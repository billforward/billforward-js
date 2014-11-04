(function() {
    var bfjs = {};
    // core is mainly to check if jquery is loaded
    bfjs.core = {
        loaded:false,
        instantiated:false,
        deferredRequest:null
    };
    bfjs.stripe = {
        loaded:false,
        needed:true,
        deferredRequest:null
    };
    bfjs.state = {
        api: {
            url: null,
            token: null
        },
        formElement: null
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
        // This identifies your website in the createToken call below
        var stripePublishableKey = 'pk_test_7lV2MLoPW0XJ4DXR1Qkatzpz';
        Stripe.setPublishableKey(stripePublishableKey);

        Stripe.card.createToken(bfjs.state.formElement, bfjs.stripe.responseHandler);
    };

    bfjs.core.do = function() {
        var $formElement = $(bfjs.core.formElementCandidate);
        var formElement = $formElement.get(0);

        if (!(formElement instanceof HTMLElement)) {
            throw "Expected jQuery object or HTML element. Perhaps the Form hasn't finished loading?";
        }

        bfjs.state.formElement = formElement;

        jQuery(function($) {
            $formElement.submit(function(e) {
                // Disable the submit button to prevent repeated clicks
                $(this).find('button').prop('disabled', true);

                e.preventDefault();
                e.stopPropagation();
                if (bfjs.stripe.needed) {
                    bfjs.stripe.deferRequest();
                }
            });
        });
    };

    bfjs.stripe.responseHandler = function(status, response) {
        var $form = $(bfjs.state.formElement);

        if (response.error) {
            // Show the errors on the form
            $form.find('.payment-errors').text(response.error.message);
            $form.find('button').prop('disabled', false);
        } else {
            function addPostVariable(varName, value) {
                $form.append($('<input type="hidden" name="'+varName+'" />').val(value));
            }

            // token contains id, last4, and card type
            var token = response.id;
            var card = response.card;

            // Insert the Stripe token into the form so it gets submitted to the server
            addPostVariable('stripeToken', token);
            addPostVariable('cardId', card.id);

            // send BillForward values
            /*addPostVariable('quantity1', quantity1);
            addPostVariable('quantity2', quantity2);
            addPostVariable('ratePlanID', ratePlanID);
            addPostVariable('accountID', accountID);

            // and re-submit
            $form.get(0).submit();*/
            var xmlhttp = new XMLHttpRequest();
            var controller = "vaulted-gateways/"
            var endpoint = "auth-capture";
            var fullURL = bfjs.state.api.url + controller + endpoint;
            var auth = bfjs.state.api.token;

            xmlhttp.open("POST",fullURL,true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');
            xmlhttp.setRequestHeader('Authorization', 'Bearer '+auth);

            xmlhttp.onreadystatechange = function() {
                bfjs.authCaptureHandler(xmlhttp);
            };

            var payload = {
                stripeToken: token,
                cardID: card.id
            };
            xmlhttp.send(JSON.stringify(payload));
        }
    };

    bfjs.authCaptureHandler = function(xmlhttp) {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                bfjs.authCaptureSuccessHandler(xmlhttp.responseText);
            } else {
                bfjs.authCaptureSuccessHandler(xmlhttp.responseText);
            }
        }
    };

    bfjs.authCaptureSuccessHandler = function(data) {
        console.log(data);
    };

    bfjs.authCaptureFailHandler = function(data) {
        console.log(data);
    };

    bfjs.capturePaymentMethod = function(formElementSelector, accountID) {
        if (bfjs.core.instantiated) {
            bfjs.core.formElementCandidate = formElementSelector;
            bfjs.state.accountID = accountID;
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

    window.bfjs = window.bfjs || bfjs;
}());