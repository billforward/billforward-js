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
        var TheClass = function(bfjs, targetGateway, formElementCandidate, accountID, callback) {
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

        TheClass.construct = function() {
            return new this.apply(this, arguments);
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

                    var transactionClass = self.bfjs.gatewayTransactionClasses[self.targetGateway];
                    var gatewayInstance = self.bfjs.gatewayInstances[self.targetGateway];

                    var newGatewayTransaction = transactionClass.construct(transactionClass);
                    gatewayInstance.doWhenReady(newGatewayTransaction);
                });

                // ready to go
                $formElement.find('button').prop('disabled', false);
            });
        };

        return TheClass;
    }());

    bfjs.GatewayTransaction = (function() {
        var TheClass = function(myGateway) {
            this.myGateway = myGateway;
        };

        TheClass.construct = function(myGateway) {
            return new this(myGateway);
        };

        var p = TheClass.prototype = new bfjs.Transaction();
        p.constructor = TheClass;

        TheClass.buildBFAjax = function(payload, endpoint) {
            var controller = "tokenization/"
            var fullURL = bfjs.state.api.url + controller + endpoint;
            var auth = bfjs.state.api.token;

            var ajaxObj = {
                type: "POST",
                url: fullURL,
                data: JSON.stringify(payload),
                contentType: 'application/json',
                crossDomain: true,
                headers: {
                    'Authorization': 'Bearer '+auth,
                },
            }
            return ajaxObj;
        };

        p.doPreAuth = function(payload, gateway) {
            var endpoint = "pre-auth";

            var ajaxObj = TheClass.buildBFAjax(payload, endpoint);
            
            $.ajax(ajaxObj)
            .success(this.oncePreauthed)
            .fail(this.preAuthFailHandler);
        };

        p.doAuthCapture = function(payload, gateway) {
            var endpoint = "auth-capture";

            var ajaxObj = TheClass.buildBFAjax(payload, endpoint);
            
            $.ajax(ajaxObj)
            .success(this.onceAuthCaptured)
            .fail(this.authCaptureFailHandler);
        };

        p.preAuthFailHandler = function(reason) {
            // maybe should only go to ultimate failure if ALL gateways fail to tokenize
            this.ultimateFailure(reason);
        };

        p.authCaptureFailHandler = function(reason) {
            // maybe should only go to ultimate failure if ALL gateways fail to tokenize
            this.ultimateFailure(reason);
        };

        p.onceAuthCaptured = function(paymentMethod) {
            this.ultimateSuccess(paymentMethod);
        };

        p.ultimateSuccess = function(paymentMethod) {
            console.log(paymentMethod);
            this.callback(paymentMethod, false);
        };

        p.ultimateFailure = function(reason) {
            console.error(reason);
            this.callback(null, reason);
        };

        return TheClass;
    }());

    bfjs.StripeTransaction = (function() {
        var TheClass = function() {
        };

        TheClass.construct = function() {
            return new this();
        };

        var p = TheClass.prototype = new bfjs.GatewayTransaction();
        p.constructor = TheClass;

        p.do = function() {
            var payload = {
                "gateway": "Stripe"
            }

            if(this.bfjs.state.api.organizationID != null) {
                payload.organizationID = this.bfjs.state.api.organizationID;
            }

            this.doPreAuth(payload);
        };

        p.oncePreauthed = function(data) {
            if (!data.results) {
                this.ultimateFailure("Preauthorization failed. Response received, but with no prauth information in it.");
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
                var valueFromForm = this.bfjs.core.getFormValue(i);
                if (valueFromForm) {
                    tokenInfo[mappings[i]] = valueFromForm;
                }
            }

            Stripe.card.createToken(tokenInfo, this.gatewayResponseHandler);
        };

        p.gatewayResponseHandler = function(status, response) {
            if (response.error) {
                // Show the errors on the form
                this.ultimateFailure(response.error.message);
            } else {
                // token contains id, last4, and card type
                var token = response.id;
                var card = response.card;

                var payload = {
                    stripeToken: token,
                    cardID: card.id,
                    accountID: this.accountID
                };

                if(this.bfjs.state.api.organizationID != null) {
                    payload.organizationID = this.bfjs.state.api.organizationID;
                }

                // and re-submit
                this.bfjs.doAuthCapture(payload);
            }
        };

        return TheClass;
    }());

    bfjs.BraintreeTransaction = (function() {
        var TheClass = function() {
        };

        TheClass.construct = function() {
            return new this();
        };

        var p = TheClass.prototype = new bfjs.GatewayTransaction();
        p.constructor = TheClass;

        p.do = function() {
            var payload = {
                "gateway": "Braintree"
            }

            if(bfjs.state.api.organizationID != null) {
                payload.organizationID = bfjs.state.api.organizationID;
            }

            this.doPreAuth(payload);
        };

        return TheClass;
    }());

    // core is mainly to check if jquery is loaded
    bfjs.core = bfjs.CoreActor.construct();

    bfjs.gatewayInstances = {
        'stripe': bfjs.StripeGateway.construct(),
        'braintree': bfjs.BraintreeGateway.construct()
    };

    bfjs.gatewayTransactionClasses = {
        'stripe': bfjs.StripeTransaction
    };

    bfjs.lateActors = [
        bfjs.core,
        bfjs.gatewayInstances['stripe'],
        bfjs.gatewayInstances['braintree']
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
                actor.loadedCallback.call(actor);
            } else {
                queue.push({
                    actor: actor,
                    src: actor.depUrl,
                    callback: actor.loadedCallback
                });
            }
        }

        for (var i = 0; i<queue.length; i++) {
            bfjs.loadScript(queue[i].src, queue[i].callback, queue[i].actor);
        }
    };

    bfjs.loadScript = function(url, callback, actor){

        var script = document.createElement("script")
        script.type = "text/javascript";

        var doCallback = function() {
            callback.call(actor);
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
    
    bfjs.core.getFormValue = function(key) {
        var $formElement = bfjs.state.$formElement;
        
        return $formElement.find("input[bf-data='"+key+"'], select[bf-data='"+key+"']").val();
    };

    /*bfjs.stripe*/

    bfjs.captureCardOnSubmit = function(formElementSelector, targetGateway, accountID, callback) {
        if (bfjs.core.hasBfCredentials) {
            if (bfjs.core.gatewayChosen){
                var newTransaction = bfjs.Transaction.construct(bfjs, formElementSelector, targetGateway, accountID, callback);
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
                    bfjs.gatewayInstances[gateway.toLowerCase()].loadMe = true;
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