(function() {
    var bfjs = {};
    // core is mainly to check if jquery is loaded
    bfjs.core = {
        loaded:false,
        deferredRequest:null
    };
    bfjs.stripe = {
        loaded:false,
        needed:true,
        deferredRequest:null
    };
    bfjs.state = {
        formElement: null
    };

    bfjs.grabScripts = function() {
        var queue = [];
        if (jQuery) {
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
            addPostVariable('quantity1', quantity1);
            addPostVariable('quantity2', quantity2);
            addPostVariable('ratePlanID', ratePlanID);
            addPostVariable('accountID', accountID);

            // and re-submit
            $form.get(0).submit();
        }
    };

    bfjs.core.do = function() {
        var formElement = bfjs.core.formElementCandidate;
        if (formElement instanceof jQuery) {
            console.log(formElement.length);
            formElement = formElement.get(0);
        }
        if (!(formElement instanceof HTMLElement)) {
            throw "Expected jQuery object or HTML element. Perhaps the Form or JQuery haven't finished loading?";
        }

        // Disable the submit button to prevent repeated clicks
        $(formElement).find('button').prop('disabled', true);

        bfjs.state.formElement = formElement;

        if (bfjs.stripe.needed) {
            bfjs.stripe.deferRequest();
        }
    };

    bfjs.addPaymentMethodToAccount = function(formElement, accountID) {
        bfjs.core.formElementCandidate = formElement;
        bfjs.state.accountID = accountID;
        // do async so we can return false irrespective of whether this errors
        setTimeout(function() {
            bfjs.core.deferRequest();
        }, 0);

        // prevent default action
        return false;
    };

    bfjs.grabScripts();

    window.bfjs = window.bfjs || bfjs;
}());