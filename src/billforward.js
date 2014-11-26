(function() {
    var bfjs = {};

    bfjs.LateActor = (function() {
        var TheClass = function() {
            this.loaded = false;
            this.deferredTransactions = [];
        };

        var p = TheClass.prototype;
        p.constructor = TheClass;

        TheClass.construct = (function() {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)
            
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        p.loadedCallback = function() {
            this.loaded = true;

            for (var i = this.deferredTransactions.length-1; this.deferredTransactions.length>0; i--) {
                this.deferredTransactions.splice(i, 1)[0].do();
            }
        };

        p.doWhenReady = function(transaction) {
            this.deferredTransactions.push(transaction);
            if (this.loaded) {
                this.loadedCallback();
            }
        };

        return TheClass;
    })();

    bfjs.CoreActor = (function() {
        var TheClass = function() {
            this.hasBfCredentials = false;
            this.gatewayChosen = false;
            this.loadMe = true;

            // statics
            this.depUrl = "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
            this.depName = "jQuery";
        };

        var p = TheClass.prototype = new bfjs.LateActor();
        p.constructor = TheClass;

        TheClass.construct = (function() {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)
            
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        return TheClass;
    })();

    bfjs.GatewayActor = (function() {
        var TheClass = function() {
            this.loaded = false;
            this.loadMe = false;
        };

        var p = TheClass.prototype = new bfjs.LateActor();
        p.constructor = TheClass;

        TheClass.construct = (function() {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)
            
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        return TheClass;
    })();

    bfjs.StripeGateway = (function() {
        var TheClass = function() {
            // statics
            this.key = 'stripe';
            this.depUrl = "https://js.stripe.com/v2/";
            this.depName = "Stripe";
        };

        var p = TheClass.prototype = new bfjs.GatewayActor();
        p.constructor = TheClass;

        TheClass.construct = (function() {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)
            
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        return TheClass;
    })();

    bfjs.BraintreeGateway = (function() {
        var TheClass = function() {
            // statics
            this.key = 'braintree';
            this.depUrl = "https://assets.braintreegateway.com/v2/braintree.js";
            this.depName = "braintree";
            this.usePaypal = false;
            this.paypalButtonSelector = null;
        };

        var p = TheClass.prototype = new bfjs.GatewayActor();
        p.constructor = TheClass;

        TheClass.construct = (function() {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)
            
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        return TheClass;
    })();

    bfjs.TransactionBase = (function() {
        var TheClass = function() {
        };

        var p = TheClass.prototype;
        p.constructor = TheClass;

        TheClass.construct = (function() {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)
            
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        return TheClass;
    })();

    bfjs.Transaction = (function() {
        var _parent = bfjs.TransactionBase;

        var TheClass = function(bfjs, targetGateway, formElementCandidate, accountID, callback, cardDetails) {
            _parent.apply(this, arguments);
            this.formElementCandidate = formElementCandidate;
            this.callback = callback;
            this.accountID = accountID;
            this.targetGateway = targetGateway;
            this.bfjs = bfjs;
            this.state = {
                formElement:  null,
                $formElement: null,
                cardDetails: cardDetails
            };
        };

        var p = TheClass.prototype = new _parent();
        p.constructor = TheClass;

        TheClass.construct = (function() {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)
            
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        p.do = function() {
            var self = this;

            var transactionClass = self.bfjs.gatewayTransactionClasses[self.targetGateway];
            var gatewayInstance = self.bfjs.gatewayInstances[self.targetGateway];

            var newGatewayTransaction = transactionClass.construct(gatewayInstance, self);
            gatewayInstance.doWhenReady(newGatewayTransaction);

            newGatewayTransaction.doPageLoadDanceWhenReady();

            if (self.state.cardDetails) {
                newGatewayTransaction.doSubmitDanceWhenReady();
            } else {
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
                        $(this).find('button').prop('disabled', true);

                        e.preventDefault();
                        e.stopPropagation();

                        newGatewayTransaction.doSubmitDanceWhenReady();
                    });

                    // ready to go
                    $formElement.find('button').prop('disabled', false);
                });
            }
        };

        return TheClass;
    })();

    bfjs.GatewayTransactionBase = (function() {
        var _parent = bfjs.LateActor;

        var TheClass = function(myGateway, transaction) {
            this.myGateway = myGateway;
            this.transaction = transaction;
        };

        var p = TheClass.prototype = new _parent();
        p.constructor = TheClass;

        TheClass.construct = (function() {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)
            
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        p.buildBFAjax = function(payload, endpoint) {
            var controller = "tokenization/"

            var fullURL = this.transaction.bfjs.state.api.url + controller + endpoint;
            var auth = this.transaction.bfjs.state.api.token;

            if(this.transaction.bfjs.state.api.organizationID != null) {
                payload.organizationID = this.transaction.bfjs.state.api.organizationID;
            }

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

        p.doPreAuth = function(payload) {
            var endpoint = "pre-auth";

            var ajaxObj = this.buildBFAjax(payload, endpoint);

            var self = this;
            
            $.ajax(ajaxObj)
            .success(function() {
                self.preAuthSuccessHandler.apply(self, arguments);
            })
            .fail(function() {
                self.preAuthFailHandler.apply(self, arguments);
            });
        };

        p.doAuthCapture = function(payload) {
            var endpoint = "auth-capture";

            var ajaxObj = this.buildBFAjax(payload, endpoint);

            var self = this;
            
            $.ajax(ajaxObj)
            .success(function() {
                self.authCaptureSuccessHandler.apply(self, arguments);
            })
            .fail(function() {
                self.authCaptureFailHandler.apply(self, arguments);
            });
        };

        p.jqXHRErrorToBFJSError = function(jqXHR, textStatus, errorThrown, phase) {
            /* Errors:
            I have starred the errors that I have so far implemented.
            The rest are proposed.

            The 0th of any group 'x' is a 'generic' catch-all for that group.

            You could search for the 'failure to connect' group using:
                code >= 1000 && code < 2000

            Special:
                0    - Uncategorized error

            Connecting to BillForward:
                1xxx - Failure to connect
                1000 ----- (Generic)
                11xx --- Failure to reach server
              * 1100 ----- (Generic)
                12xx --- Access denied
                1200 ----- (Generic)
                121x ----- Access token invalid
                1210 ------- (Generic)
                122x ----- Privilege failure
                1220 ------- (Generic)
                1221 ------- Access token valid, but BillForward role lacks privilege

            Preauthorization:
                20xx - Preauthorization failed
                2000 --- (Generic)
                201x --- Expected information absent
              * 2010 ----- (Generic)
                202x --- Precondition failed
                2020 ----- (Generic)

            Client-side tokenization of card with gateway:
                30xx - Tokenization failed
                3000 --- (Generic)

            Authorized card capture:
                40xx - Card capture failed
                4000 --- (Generic)
                401x --- Card declined
                4010 ----- (Generic)
            */

            var error = {
                detailObj: jqXHR
            };

            if (jqXHR.status === 400) {
                if (phase === "pre") {
                    error.code = 2000;
                    error.message = "Preauthorization failed.";
                } else {
                    error.code = 4000;
                    error.message = "Auth-capture failed.";
                    if (jqXHR.responseJSON) {
                        if (jqXHR.responseJSON.errorMessage) {
                            if (jqXHR.responseJSON.errorMessage === 'Your card was declined.') {
                                error.code = 4010;
                                error.message = "Your card was declined.";
                            }
                        }
                    }
                }
            } else {
                error.code = 1100;
                error.message = "Failed to connect to BillForward.";
            }

            return error;
        };

        p.preAuthFailHandler = function(jqXHR, textStatus, errorThrown) {
            var bfjsError = this.jqXHRErrorToBFJSError(jqXHR, textStatus, errorThrown, "pre");

            // maybe should only go to ultimate failure if ALL gateways fail to tokenize
            this.ultimateFailure(bfjsError);
        };

        p.authCaptureFailHandler = function(jqXHR, textStatus, errorThrown) {
            var bfjsError = this.jqXHRErrorToBFJSError(jqXHR, textStatus, errorThrown, "capture");

            // maybe should only go to ultimate failure if ALL gateways fail to tokenize
            this.ultimateFailure(bfjsError);
        };

        p.preAuthSuccessHandler = function(data) {
            this.preAuthResponsePayload = data;

            this.oncePreAuthed();
        };

        p.authCaptureSuccessHandler = function(paymentMethod) {
            this.onceAuthCaptured(paymentMethod);
        };

        p.oncePreAuthed = function() {
            this.submitDancer.loadedCallback();
        };

        p.onceAuthCaptured = function(paymentMethod) {
            this.ultimateSuccess(paymentMethod);
        };

        p.ultimateSuccess = function(paymentMethod) {
            console.log(paymentMethod);
            this.transaction.callback(paymentMethod, false);
        };

        p.ultimateFailure = function(reason) {
            console.error(reason);
            this.transaction.callback(null, reason);
        };

        return TheClass;
    })();

    bfjs.GatewayTransaction = (function() {
        var _parent = bfjs.GatewayTransactionBase;

        var TheClass = function() {
            _parent.apply(this, arguments);
            this.pageLoadDancer = this.makeDancer();
            this.submitDancer = this.makeDancer();
        };

        var p = TheClass.prototype = new _parent();
        p.constructor = TheClass;

        TheClass.construct = (function() {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)
            
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        p.makeDancer = function() {
            var dancer = bfjs.LateActor.construct();
            dancer.troupeLeader = this;
            return dancer;
        };

        p.doPageLoadDanceWhenReady = function() {
            var self = this;

            var deferredTransaction = bfjs.TransactionBase.construct();
            deferredTransaction.do = function() {
                self.doPreAuth(self.preAuthRequestPayload);
            };

            this.pageLoadDancer.doWhenReady(deferredTransaction);
        };

        p.doSubmitDanceWhenReady = function() {
            var self = this;

            var deferredTransaction = bfjs.TransactionBase.construct();
            deferredTransaction.do = function() {
                self.startAuthCapture(self.preAuthResponsePayload);
            };

            this.submitDancer.doWhenReady(deferredTransaction);
        };

        return TheClass;
    })();

    bfjs.StripeTransaction = (function() {
        var _parent = bfjs.GatewayTransaction;

        var TheClass = function() {
            _parent.apply(this, arguments);
        };

        TheClass.mappings = {
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

        var p = TheClass.prototype = new _parent();
        p.constructor = TheClass;

        TheClass.construct = (function() {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)
            
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        p.do = function() {
            var payload = {
                "gateway": "Stripe"
            }

            if(this.transaction.bfjs.state.api.organizationID != null) {
                payload.organizationID = this.transaction.bfjs.state.api.organizationID;
            }

            this.preAuthRequestPayload = payload;

            // ready to do pageLoadDo
            this.pageLoadDancer.loadedCallback();
        };

        p.startAuthCapture = function(data) {
            var stripePublishableKey;
            var failed = false;
            try {
                stripePublishableKey = data.results[0].publicKey;
                if (!data.results[0].publicKey) {
                    failed = true;
                }   
            } catch (e){
                failed = true;
            }

            if (failed) {
                return this.ultimateFailure({
                    code: 2010,
                    message: "Preauthorization failed. Response received, but expected information was absent.",
                    detailObj: data
                });
            }
            // This identifies your website in the createToken call below

            var stripePublishableKey = data.results[0].publicKey;
            Stripe.setPublishableKey(stripePublishableKey);
            
            var tokenInfo = {};
            
            for (var i in TheClass.mappings) {
                var mapping = TheClass.mappings[i];
                var valueFromForm;
                if (this.transaction.state.cardDetails) {
                    valueFromForm = this.transaction.state.cardDetails[i];
                } else {
                    valueFromForm = this.transaction.bfjs.core.getFormValue(i, this.transaction.state.$formElement);
                }
                
                if (valueFromForm) {
                    tokenInfo[TheClass.mappings[i]] = valueFromForm;
                }
            }

            var self = this;

            Stripe.card.createToken(tokenInfo, function() {
                self.gatewayResponseHandler.apply(self, arguments);
            });
        };

        p.gatewayResponseHandler = function(status, response) {
            if (response.error) {
                var bfjsError = {
                    code: 3000,
                    message: "Card capture to Stripe failed.",
                    detailObj: response
                };
                // Show the errors on the form
                this.ultimateFailure(bfjsError);
            } else {
                // token contains id, last4, and card type
                var token = response.id;
                var card = response.card;

                var payload = {
                    stripeToken: token,
                    cardID: card.id,
                    accountID: this.accountID
                };

                // and re-submit
                this.doAuthCapture(payload);
            }
        };

        return TheClass;
    })();

    bfjs.BraintreeTransaction = (function() {
        var _parent = bfjs.GatewayTransaction;

        var TheClass = function() {
            _parent.apply(this, arguments);
        };

        TheClass.mappings = {
            'cardholder-name': 'cardholder_name',
            'cvc': 'cvv',
            'number': 'number',
            'exp-date': 'expiration_date',
            'exp-month': 'expiration_month',
            'exp-year': 'expiration_year',
            'address-zip': 'postal_code'
        };

        var p = TheClass.prototype = new _parent();
        p.constructor = TheClass;

        TheClass.construct = (function() {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)
            
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        p.do = function() {
            var payload = {
                "gateway": "Braintree"
            }

            if(bfjs.state.api.organizationID != null) {
                payload.organizationID = bfjs.state.api.organizationID;
            }

            this.preAuthRequestPayload = payload;

            //this.doPreAuth(payload);

            // ready to do pageLoadDo
            this.pageLoadDancer.loadedCallback();
        };

        p.oncePreAuthed = function() {
            var data = this.preAuthResponsePayload;
            var clientToken;
            var failed = false;
            try {
                clientToken = data.results[0].clientToken;
                if (!data.results[0].clientToken) {
                    failed = true;
                }   
            } catch (e){
                failed = true;
            }

            this.clientToken = clientToken;

            if (failed) {
                return this.ultimateFailure({
                    code: 2010,
                    message: "Preauthorization failed. Response received, but expected information was absent.",
                    detailObj: data
                });
            }

            if (this.transaction.state.cardDetails) {
                // programmatic tokenization requires no setup.
                // doesn't support PayPal button though
            } else {
                var $formElement = this.transaction.state.$formElement;

                var formId = $formElement.attr('id');

                if (!formId) {
                    // attribute does not exist
                    var uniqueId = "bf-payment-form-unique-id";
                    $formElement.attr('id', uniqueId);
                    formId = uniqueId;
                }

                for (var i in TheClass.mappings) {
                    var mapping = TheClass.mappings[i];
                    bfjs.core.translateFormValue(i, this.transaction.state.$formElement, 'data-braintree-name', mapping);
                }

                if (this.myGateway.usePaypal) {
                    var $paypalSelector = $(this.myGateway.paypalButtonSelector);
                    var paypalDivId = $paypalSelector.attr('id');

                    if (!paypalDivId) {
                        // attribute does not exist
                        var uniqueId = "bf-braintree-paypal-unique-id";
                        $paypalSelector.attr('id', uniqueId);
                        paypalDivId = uniqueId;
                    }

                    braintree.setup(clientToken, "paypal", {container: paypalDivId});
                }
                //braintree.setup(clientToken, "custom", {id: formId});
            }

            this.submitDancer.loadedCallback();
        };

        p.startAuthCapture = function(data) {
            var nonceValue;
            if (this.myGateway.usePaypal) {
                // check for a nonce
                var $paypalSelector = $(this.myGateway.paypalButtonSelector);
                var nonceSelector = $paypalSelector.find("input[name='payment_method_nonce']");
                nonceValue = nonceSelector.val();
                if (nonceValue) {
                    this.gatewayResponseHandler(null, nonceValue);
                    return;
                }
            }
            var tokenInfo = {};

            for (var i in TheClass.mappings) {
                var mapping = TheClass.mappings[i];
                var valueFromForm;
                if (this.transaction.state.cardDetails) {
                    valueFromForm = this.transaction.state.cardDetails[i];
                } else {
                    valueFromForm = this.transaction.bfjs.core.getFormValue(i, this.transaction.state.$formElement);
                }
                
                if (valueFromForm) {
                    tokenInfo[TheClass.mappings[i]] = valueFromForm;
                }
            }

            var self = this;

            console.log(tokenInfo);

            var client = new braintree.api.Client({clientToken: this.clientToken});
            client.tokenizeCard(tokenInfo, function() {
                self.gatewayResponseHandler.apply(self, arguments);
            });
        };

        p.gatewayResponseHandler = function(err, nonce) {
            console.log(err, nonce);
            if (err) {
                var bfjsError = {
                    code: 3000,
                    message: "Card capture to Braintree failed.",
                    detailObj: err
                };
                // Show the errors on the form
                this.ultimateFailure(bfjsError);
            } else {
                var payload = {
                    nonce: nonce,
                    accountID: this.accountID
                };

                // and re-submit
                this.doAuthCapture(payload);
            }
        };

        return TheClass;
    })();

    // core is mainly to check if jquery is loaded
    bfjs.core = bfjs.CoreActor.construct();

    bfjs.gatewayInstances = {
        'stripe': bfjs.StripeGateway.construct(),
        'braintree': bfjs.BraintreeGateway.construct()
    };

    bfjs.gatewayTransactionClasses = {
        'stripe': bfjs.StripeTransaction,
        'braintree': bfjs.BraintreeTransaction
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
            if (queue[i].actor.loadMe) {
                bfjs.loadScript(queue[i].src, queue[i].callback, queue[i].actor);   
            }
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

    bfjs.core.getFormInput = function(key, $formElement) {        
        return $formElement.find("input[bf-data='"+key+"'], select[bf-data='"+key+"']");
    };

    bfjs.core.valueFromFormInput = function($formInput) {        
        return $formInput.val();
    };
    
    bfjs.core.getFormValue = function(key, $formElement) {
        var $input = bfjs.core.getFormInput(key, $formElement);
        var value = bfjs.core.valueFromFormInput($input);
        return value;
    };

    bfjs.core.translateFormValue = function(key, $formElement, newAttr, newKey) {
        var $input = bfjs.core.getFormInput(key, $formElement);
        var value = bfjs.core.valueFromFormInput($input);

        if (value) {
            $input.attr(newAttr, newKey);
        }
    };

    var invoke = function(formElementSelector, cardDetails, targetGateway, accountID, callback) {
        var resolvedGateway = bfjs.resolveGatewayName(targetGateway, cardDetails);

        if (bfjs.core.hasBfCredentials) {
            if (!bfjs.core.gatewayChosen) {
                bfjs.loadGateways([resolvedGateway]);
            }

            if (bfjs.core.gatewayChosen){
                var newTransaction;
                if (cardDetails) {
                    newTransaction = bfjs.Transaction.construct(bfjs, resolvedGateway, null, accountID, callback, cardDetails);
                } else {
                    newTransaction = bfjs.Transaction.construct(bfjs, resolvedGateway, formElementSelector, accountID, callback, null);
                }
                
                bfjs.core.doWhenReady(newTransaction);
            } else {
                throw "You need to first call BillForward.loadGateways() with a list of gateways you are likely to use (ie ['stripe', 'braintree'])";
            }
        } else {
            throw "You need to first call BillForward.useAPI() will BillForward credentials";
        }
    };

    bfjs.captureCardOnSubmit = function(formElementSelector, targetGateway, accountID, callback) {
        return invoke(formElementSelector, null, targetGateway, accountID, callback);
    };

    bfjs.captureCard = function(cardDetails, targetGateway, accountID, callback) {
        return invoke(null, cardDetails, targetGateway, accountID, callback);
    };

    bfjs.useAPI = function(url, token, organizationID) {
        bfjs.state.api.url = url;
        bfjs.state.api.token = token;
        bfjs.state.api.organizationID = organizationID;
        bfjs.core.hasBfCredentials = true;
    };

    bfjs.addPayPalButton = function(selector) {
        // supported for Braintree only
        bfjs.gatewayInstances['braintree'].usePaypal = true;
        bfjs.gatewayInstances['braintree'].paypalButtonSelector = selector;
    };

    bfjs.resolveGatewayName = function(name, cardDetails) {
        var lowerCase = name.toLowerCase();
        var resolved = lowerCase;
        if (resolved === 'braintree+paypal') {
            resolved = 'braintree';
            if (!bfjs.gatewayInstances[resolved].usePaypal) {
                throw "You need first to call BillForward.addPayPalButton() with a Jquery-style selector to your PayPal button";
            }
            if (cardDetails) {
                throw "Programmatic access is not available for Braintree+PayPal. You must use BillForward.captureCardOnSubmit(), or switch to the 'braintree' gateway."
            }
        }

        return resolved;
    };

    bfjs.loadGateways = function(gateways) {
        for(var g in gateways) {
            var gateway = gateways[g];
            var resolvedName = bfjs.resolveGatewayName(gateway);
            switch(gateway.toLowerCase()) {
                case 'stripe':
                case 'braintree':
                    bfjs.gatewayInstances[resolvedName].loadMe = true;
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
})();