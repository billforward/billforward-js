(function() {
    var bfjs = {};
    // core is mainly to check if jquery is loaded
    bfjs.core = {
        loaded:false,
        instantiated:false,
        deferredRequest:null
    };
    bfjs.stripe = {
        key: 'stripe',
        loaded:false,
        needed:true,
        deferredRequest:null
    };
    bfjs.state = {
        api: {
            url: null,
            token: null
        },
        formElement: null,
        callback: null
    };

    bfjs.grabScripts = function() {
        var queue = [];
        if (typeof jQuery !== 'undefined') {
            bfjs.core.loadedCallback();
        } else {
            // everyone has this in their cache anyway, so..
            queue.push({
                src: "http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",
                callback: bfjs.core.loadedCallback
            });
        }
        if (bfjs.stripe.needed) {
            queue.push({
                src: "https://js.stripe.com/v2/",
                callback: bfjs.stripe.loadedCallback
            });
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

    bfjs.core.loadedCallback = function() {
        // now that core's loaded, check if we had pending requests..
        bfjs.core.loaded = true;

        if (bfjs.core.deferredRequest)
        bfjs.core.deferredRequest();
    };

    bfjs.stripe.loadedCallback = function() {
        // now that Stripe's loaded, check if we had pending requests..
        bfjs.stripe.loaded = true;

        if (bfjs.stripe.deferredRequest)
        bfjs.stripe.deferredRequest();
    };

    bfjs.stripe.deferRequest = function() {
        if (bfjs.stripe.loaded) {
            bfjs.stripe.do();
        } else {
            bfjs.stripe.deferredRequest = bfjs.stripe.do;
        }
    };

    bfjs.core.deferRequest = function() {
        if (bfjs.core.loaded) {
            bfjs.core.do();
        } else {
            bfjs.core.deferredRequest = bfjs.core.do;
        }
    };

    bfjs.stripe.do = function(state) {
        bfjs.doPreAuth({}, bfjs.stripe.key);
    };

    bfjs.core.do = function() {
        $( document ).ready(function() {
            var $formElement = $(bfjs.core.formElementCandidate);
            var formElement = $formElement.get(0);

            if (!(formElement instanceof HTMLElement)) {
                throw "Expected jQuery object or HTML element. Perhaps the Form hasn't finished loading?";
            }

            bfjs.state.formElement = formElement;
            bfjs.state.$formElement = $formElement;

            $formElement.submit(function(e) {
                // Disable the submit button to prevent repeated clicks
                $(this).find('button').prop('disabled', true);

                e.preventDefault();
                e.stopPropagation();
                if (bfjs.stripe.needed) {
                    bfjs.stripe.deferRequest();
                }
            });

            // ready to go
            $formElement.find('button').prop('disabled', false);
        });
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

            // and re-submit
            bfjs.doAuthCapture(payload, bfjs.stripe.key);
        }
    };

    bfjs.doPreAuth = function(payload, gateway) {
        var xmlhttp = new XMLHttpRequest();
        var controller = "vaulted-gateways/"
        var endpoint = "pre-auth";
        var fullURL = bfjs.state.api.url + controller + endpoint;
        var auth = bfjs.state.api.token;

        xmlhttp.open("POST",fullURL,true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.setRequestHeader('Authorization', 'Bearer '+auth);

        xmlhttp.onreadystatechange = function() {
            bfjs.preAuthHandler(xmlhttp, gateway);
        };
        
        xmlhttp.send(JSON.stringify(payload));
    };

    bfjs.doAuthCapture = function(payload, gateway) {
        var xmlhttp = new XMLHttpRequest();
        var controller = "vaulted-gateways/"
        var endpoint = "auth-capture";
        var fullURL = bfjs.state.api.url + controller + endpoint;
        var auth = bfjs.state.api.token;

        xmlhttp.open("POST",fullURL,true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.setRequestHeader('Authorization', 'Bearer '+auth);

        xmlhttp.onreadystatechange = function() {
            bfjs.authCaptureHandler(xmlhttp, gateway);
        };
        
        xmlhttp.send(JSON.stringify(payload));
    };

    bfjs.ultimateSuccess = function(paymentMethod) {
        //console.log(paymentMethod);
        bfjs.state.callback(paymentMethod, false);
    };

    bfjs.ultimateFailure = function(reason) {
        console.error(reason);
        bfjs.state.callback(null, reason);
    };

    bfjs.preAuthHandler = function(xmlhttp, gateway) {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                bfjs.preAuthSuccessHandler(xmlhttp.responseText, gateway);
            } else {
                bfjs.preAuthFailHandler(xmlhttp.responseText);
            }
        }
    };

    bfjs.authCaptureHandler = function(xmlhttp, gateway) {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                bfjs.authCaptureSuccessHandler(xmlhttp.responseText, gateway);
            } else {
                bfjs.authCaptureFailHandler(xmlhttp.responseText);
            }
        }
    };
    
    bfjs.core.getFormValue = function(key) {
        var $formElement = bfjs.state.$formElement;
        
        return $formElement.find("input[bf-data='"+key+"'], select[bf-data='"+key+"']").val();
    };

    bfjs.stripe.oncePreauthed = function(data) {
        if (!decoded.results) {
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
            decoded = JSON.parse(data);
            bfjs[gateway].oncePreauthed(decoded);
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
            decoded = JSON.parse(data);
            paymentMethod = decoded.results[0];
            bfjs.ultimateSuccess(paymentMethod);
        } catch(e) {
            bfjs.ultimateFailure(e.message);
        }
    };

    bfjs.authCaptureFailHandler = function(reason) {
        // maybe should only go to ultimate failure if ALL gateways fail to tokenize
        bfjs.ultimateFailure(reason);
    };

    bfjs.captureCardOnSubmit = function(formElementSelector, accountID, callback) {
        if (bfjs.core.instantiated) {
            bfjs.core.formElementCandidate = formElementSelector;
            bfjs.state.accountID = accountID;
            bfjs.state.callback = callback;
            bfjs.core.deferRequest();
        } else {
            throw "You need to first call bfjs.useAPI() will BillForward credentials";
        }
    };

    bfjs.useAPI = function(url, token) {
        bfjs.state.api.url = url;
        bfjs.state.api.token = token;
        bfjs.core.instantiated = true;
    };

    bfjs.grabScripts();

    window.BillForward = window.BillForward || bfjs;
}());