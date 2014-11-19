(function() {
    var bfjs = {};

    bfjs.LateActor = (function() {
        var TheClass = function() {
            this.loaded = false;
            this.deferredTransactions = [];
        };

        TheClass.construct = function() {
            return new this();
        };

        var p = TheClass.prototype;

        p.loadedCallback = function() {
            this.loaded = true;

            for (var i in this.deferredTransactions) {
                var transaction = this.deferredTransactions[i];
                transaction.do();
            }
            this.deferredTransactions = [];
        };

        p.doWhenReady = function(transaction) {
            this.deferredTransactions.push(transaction);
            if (this.loaded) {
                this.loadedCallback();
            }
        };

        return TheClass;
    }());

    bfjs.CoreActor = (function() {
        var TheClass = function() {
            this.hasBfCredentials = false;
            this.gatewayChosen = false;
            this.loadMe = true;

            // statics
            this.depUrl = "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
            this.depName = "jQuery";
        };

        TheClass.construct = function() {
            return new this();
        };

        var p = TheClass.prototype = new bfjs.LateActor();
        p.constructor = TheClass;

        return TheClass;
    }());

    bfjs.GatewayActor = (function() {
        var TheClass = function() {
            this.loaded = false;
            this.loadMe = false;
        };

        TheClass.construct = function() {
            return new this();
        };

        var p = TheClass.prototype = new bfjs.LateActor();
        p.constructor = TheClass;

        return TheClass;
    }());

    bfjs.StripeGateway = (function() {
        var TheClass = function() {
            // statics
            this.key = 'stripe';
            this.depUrl = "https://js.stripe.com/v2/";
            this.depName = "Stripe";
        };

        TheClass.construct = function() {
            return new this();
        };

        var p = TheClass.prototype = new bfjs.GatewayActor();

        p.constructor = TheClass;

        return TheClass;
    }());

    bfjs.BraintreeGateway = (function() {
        var TheClass = function() {
            // statics
            this.key = 'braintree';
            this.depUrl = "https://assets.braintreegateway.com/v2/braintree.js";
            this.depName = "braintree";
        };

        TheClass.construct = function() {
            return new this();
        };

        var p = TheClass.prototype = new bfjs.GatewayActor();
        p.constructor = TheClass;

        return TheClass;
    }());

    bfjs.Transaction = (function() {
        var TheClass = function(bfjs, formElementCandidate, accountID, callback, targetGateway) {
            this.formElementCandidate = formElementCandidate;
            this.callback = callback;
            this.accountID = accountID;
            this.targetGateway = targetGateway;
            this.bfjs = bfjs;
            this.state = {
                formElement:  null,
                $formElement: null
            };
        };

        TheClass.construct = function(bfjs, formElementCandidate, accountID, callback, targetGateway) {
            return new this(bfjs, formElementCandidate, accountID, callback, targetGateway);
        };

        var p = TheClass.prototype;

        p.do = function() {
            var self = this;
            $( document ).ready(function() {
                var $formElement = $(self.formElementCandidate);
                var formElement = $formElement.get(0);

                if (!(formElement instanceof HTMLElement)) {
                    throw "Expected jQuery object or HTML element. Perhaps the Form hasn't finished loading?";
                }

                self.state.formElement = formElement;
                self.state.$formElement = $formElement;

                $formElement.submit(function(e) {
                    // Disable the submit button to prevent repeated clicks
                    $(self).find('button').prop('disabled', true);

                    e.preventDefault();
                    e.stopPropagation();
                    self.bfjs[self.chosenGateway].deferRequest();
                });

                // ready to go
                $formElement.find('button').prop('disabled', false);
            });
        };

        return TheClass;
    }());

    // core is mainly to check if jquery is loaded
    bfjs.core = bfjs.CoreActor.construct();

    bfjs.stripe = bfjs.StripeGateway.construct();

    bfjs.braintree = bfjs.BraintreeGateway.construct();

    bfjs.lateActors = [
        bfjs.core,
        bfjs.stripe,
        bfjs.braintree
    ];

    bfjs.state = {
        api: {
            url: null,
            token: null,
            organizationID: null
        }
    };

    bfjs.grabScripts = function() {
        var queue = [];
        for (var i in bfjs.lateActors) {
            var actor = bfjs.lateActors[i];
            //console.log(actor);

            if (typeof window[actor.depName] !== 'undefined') {
                actor.loadedCallback();
            } else {
                queue.push({
                    src: actor.depUrl,
                    callback: actor.loadedCallback
                });
            }
        }

        for (var i = 0; i<queue.length; i++) {
            bfjs.loadScript(queue[i].src, queue[i].callback);
        }
    };

    bfjs.loadScript = function(url, callback){

        var script = document.createElement("script")
        script.type = "text/javascript";

        var doCallback = function() {
            callback();
        };

        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                        script.readyState == "complete"){
                    script.onreadystatechange = null;
                    doCallback();
                }
            };
        } else {  //Others
            script.onload = function(){
                doCallback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    };

    bfjs.stripe.do = function(state) {
    	var payload = {
    		"gateway": "Stripe"
    	}

    	if(bfjs.state.api.organizationID != null) {
        	payload.organizationID = bfjs.state.api.organizationID;
        }

        bfjs.doPreAuth(payload, bfjs.stripe.key);
    };

    bfjs.braintree.do = function(state) {
        var payload = {
            "gateway": "Braintree"
        }

        if(bfjs.state.api.organizationID != null) {
            payload.organizationID = bfjs.state.api.organizationID;
        }

        bfjs.doPreAuth(payload, bfjs.braintree.key);
    };

    bfjs.stripe.responseHandler = function(status, response) {
        if (response.error) {
            // Show the errors on the form
            bfjs.ultimateFailure(response.error.message);
        } else {
            // token contains id, last4, and card type
            var token = response.id;
            var card = response.card;

            var payload = {
                stripeToken: token,
                cardID: card.id,
                accountID: bfjs.state.accountID
            };

            if(bfjs.state.api.organizationID != null) {
            	payload.organizationID = bfjs.state.api.organizationID;
            }

            // and re-submit
            bfjs.doAuthCapture(payload, bfjs.stripe.key);
        }
    };

    bfjs.doPreAuth = function(payload, gateway) {
        var controller = "tokenization/"
        var endpoint = "pre-auth";
        var fullURL = bfjs.state.api.url + controller + endpoint;
        var auth = bfjs.state.api.token;
        
        $.support.cors = true;
        
        $.ajax({
                type: "POST",
                url: fullURL,
                data: JSON.stringify(payload),
                contentType: 'application/json',
                //dataType: 'jsonp',
                //jsonp: function(data){console.log(data);},
                crossDomain: true,
                xhrFields: {
                    //withCredentials: true
                },
                headers: {
                    'Authorization': 'Bearer '+auth,
                    //'Access-Control-Allow-Origin': "*",
                    //'Access-Control-Request-Headers': 'Authorization Access-Control-Allow-Origin'
                },
                /*beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", 'Bearer '+auth);
                    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                    xhr.withCredentials = true;
                },*/
            })
        .success(function(data) {
            bfjs.preAuthSuccessHandler(data, bfjs.stripe.key);
        })
        .fail(bfjs.preAuthFailHandler);
    };

    bfjs.doAuthCapture = function(payload, gateway) {
        var controller = "tokenization/"
        var endpoint = "auth-capture";
        var fullURL = bfjs.state.api.url + controller + endpoint;
        var auth = bfjs.state.api.token;
        
        $.ajax({
                type: "POST",
                url: fullURL,
                data: JSON.stringify(payload),
                contentType: 'application/json',
                //dataType: 'jsonp',
                //jsonp: function(data){console.log(data);},
                crossDomain: true,
                xhrFields: {
                    //withCredentials: true
                },
                headers: {
                    'Authorization': 'Bearer '+auth,
                    //'Access-Control-Allow-Origin': "*",
                    //'Access-Control-Request-Headers': 'Authorization Access-Control-Allow-Origin'
                },
                /*beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", 'Bearer '+auth);
                    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                    xhr.withCredentials = true;
                },*/
            })
        .success(function(data) {
            bfjs.authCaptureSuccessHandler(data, bfjs.stripe.key);
        })
        .fail(bfjs.authCaptureFailHandler);
    };

    bfjs.ultimateSuccess = function(paymentMethod) {
        //console.log(paymentMethod);
        bfjs.state.callback(paymentMethod, false);
    };

    bfjs.ultimateFailure = function(reason) {
        console.error(reason);
        bfjs.state.callback(null, reason);
    };
    
    bfjs.core.getFormValue = function(key) {
        var $formElement = bfjs.state.$formElement;
        
        return $formElement.find("input[bf-data='"+key+"'], select[bf-data='"+key+"']").val();
    };

    bfjs.stripe.oncePreauthed = function(data) {
        if (!data.results) {
            bfjs.ultimateFailure("Preauthorization failed. Response received, but with no prauth information in it.");
        }
        // This identifies your website in the createToken call below
        var stripePublishableKey = data.results[0].publicKey;
        Stripe.setPublishableKey(stripePublishableKey);
        
        var mappings = {
            'cardholder-name': 'name',
            'cvc': 'cvc',
            'number': 'number',
            'exp-month': 'exp_month',
            'exp-year': 'exp_year',
            'address-line1': 'address_line1',
            'address-line2': 'address_line2',
            'address-city': 'address_city',
            'address-state': 'address_state',
            'address-zip': 'address_zip',
            'address-country': 'address_country',
        };
        
        var tokenInfo = {};
        
        for (var i in mappings) {
            var mapping = mappings[i];
            var valueFromForm = bfjs.core.getFormValue(i);
            if (valueFromForm) {
                tokenInfo[mappings[i]] = valueFromForm;
            }
        }

        Stripe.card.createToken(tokenInfo, bfjs.stripe.responseHandler);
    };
    
    bfjs.preAuthSuccessHandler = function(data, gateway) {
        //console.log(data);
        try {
            bfjs[gateway].oncePreauthed(data);
        } catch(e) {
            bfjs.ultimateFailure("Preauthorization failed. "+e.message);
        }
    };

    bfjs.preAuthFailHandler = function(reason) {
        // maybe should only go to ultimate failure if ALL gateways fail to tokenize
        bfjs.ultimateFailure(reason);
    };

    bfjs.authCaptureSuccessHandler = function(data, gateway) {
        //console.log(data);
        try {
            var paymentMethod = data.results[0];
            bfjs.ultimateSuccess(paymentMethod);
        } catch(e) {
            bfjs.ultimateFailure("Authorized capture failed. "+e.message);
        }
    };

    bfjs.authCaptureFailHandler = function(reason) {
        // maybe should only go to ultimate failure if ALL gateways fail to tokenize
        bfjs.ultimateFailure(reason);
    };

    bfjs.captureCardOnSubmit = function(formElementSelector, accountID, callback, targetGateway) {
        if (bfjs.core.hasBfCredentials) {
            if (bfjs.core.gatewayChosen){
                var newTransaction = bfjs.Transaction.construct(bfjs, formElementSelector, accountID, callback, targetGateway);
                bfjs.core.doWhenReady(newTransaction);
            } else {
                throw "You need to first call bfjs.loadGateways() with a list of gateways you are likely to use (ie ['stripe', 'braintree'])";
            }
        } else {
            throw "You need to first call bfjs.useAPI() will BillForward credentials";
        }
    };

    bfjs.useAPI = function(url, token, organizationID) {
        bfjs.state.api.url = url;
        bfjs.state.api.token = token;
        bfjs.state.api.organizationID = organizationID;
        bfjs.core.hasBfCredentials = true;
    };

    bfjs.loadGateways = function(gateways) {
        for(var g in gateways) {
            var gateway = gateways[g];
            switch(gateway.toLowerCase()) {
                case 'stripe':
                case 'braintree':
                    bfjs[gateway.toLowerCase()].loadMe = true;
                    bfjs.core.gatewayChosen = true;
                    break;
                default:
                    throw "'"+gateway+"' is not the name of any supported gateway."
            }
        }
        
        if (bfjs.core.gatewayChosen){
            bfjs.grabScripts();
        }
    };

    window.BillForward = window.BillForward || bfjs;
}());