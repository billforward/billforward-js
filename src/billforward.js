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
            this.depUrl = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
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

    bfjs.SpreedlyGateway = (function() {
        var TheClass = function() {
            // statics
            this.key = 'generic';
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

    bfjs.SagePayGateway = (function() {
        var TheClass = function() {
            // statics
            this.key = 'sagepay';
            this.sagePayFormContainerSelector = null;
            this.sagePayFormContainerOptions = {};
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
                async: true,
                headers: {
                    'Authorization': 'Bearer '+auth
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
              * 1000 ----- (Generic)
                11xx --- Failure to reach server
              * 1100 ----- (Generic)
                12xx --- Access denied
                1200 ----- (Generic)
                121x ----- Access token invalid
              * 1210 ------- (Generic)
              * 1211 ------- Access token expired
                122x ----- Privilege failure
              * 1220 ------- (Generic)
              * 1221 ------- Access token valid, but BillForward role lacks privilege

            Preauthorization:
                20xx - Preauthorization failed
              * 2000 --- (Generic)
              * 2001 --- Unhandled BillForward server error
                201x --- Expected information absent
              * 2010 ----- (Generic)
                202x --- Precondition failed
              * 2020 ----- (Generic)
              * 2021 ----- Specified gateway not configured
                203x --- BillForward server proposed an unsupported operation
              * 2030 ----- (Generic)
                21xx --- Failure between BillForward server and gateway
              * 2100 ----- (Generic)

            Client-side tokenization of card with gateway:
                30xx - Tokenization failed
              * 3000 --- (Generic)
                31xx - Failed to connect to gateway
              * 3100 --- (Generic)
                32xx - Received malformed response
              * 3200 --- (Generic)

            Server-side scrutinization of token from gateway:
                50xx - Verification failed
                5000 --- (Generic)
                501x --- Server rejected card notification
              * 5010 ----- (Generic)
                502x --- Error occurred during verification
              * 5020 ----- (Generic)
                51xx - Malformed response from server
              * 5100 --- (Generic)
              * 5101 --- JSON parse error

            Authorized card capture:
                4xxx - Card capture failed
              * 4000 --- (Generic)
              * 4001 --- Unhandled BillForward server error
              * 4002 --- Handled BillForward server error
                41xx --- Card declined
              * 4100 ----- (Generic)
                42xx --- Input validation failure
                4200 ----- (Generic)
                43xx --- Failure between BillForward server and gateway
              * 4300 ----- (Generic)
            */

            var error = {
                detailObj: jqXHR
            };
            var json = jqXHR.responseJSON;
            var text = jqXHR.responseText;
            if (text) {
                try {
                    var parsed = JSON.parse(text);
                    json = parsed;
                } catch(e) {
                }
            }

            if (!json) {
                json = {};
            }

            if (!json.errorType) {
                json.errorType = "";
            }

            if (!json.errorMessage) {
                json.errorMessage = "";
            }

            switch (jqXHR.status) {
                case  400:
                case  500:
                    if (phase === "pre") {
                        error.code = 2000;
                        error.message = "Preauthorization failed.";
                        switch (json.errorType) {
                            case 'PreconditionFailed':
                                error.code = 2020;
                                error.message = "A required precondition was not satisfied before this request.";
                                if (json.errorMessage.indexOf('not been configured') !== -1) {
                                    error.code = 2021;
                                    error.message = "You must first configure your gateway in the BillForward UI.";
                                }
                            case 'SagePayOperationFailure':
                                error.code = 2100;
                                var portions = json.errorMessage.split(" Message was: ");
                                error.message = portions[0];
                                error.detailObj = {
                                    'message': portions[1]
                                };
                                break;
                            case 'ServerError':
                            default:
                                if (jqXHR.status === 500) {
                                    error.code = 2001;
                                    error.message = "BillForward server encountered unhandled error during pre-authorization.";
                                }
                        }
                    } else {
                        error.code = 4000;
                        error.message = "Auth-capture failed.";
                        switch (json.errorType) {
                            case 'BraintreeOperationFailure':
                            case 'SagePayOperationFailure':
                            case 'StripeOperationFailure':
                                error.code = 4300;
                                var portions = json.errorMessage.split(" Message was: ");
                                error.message = portions[0];
                                error.detailObj = {
                                    'message': portions[1]
                                };
                                break;
                            case 'TokenizationAuthCaptureFailure':
                                error.code = 4002;
                                error.message = "BillForward server encountered a known error during authorized card capture.";
                                error.detailObj = {
                                    'message': json.errorMessage
                                };
                                break;
                            case 'ServerError':
                            default:
                                if (jqXHR.status === 500) {
                                    error.code = 4001;
                                    error.message = "BillForward server encountered unhandled error during authorized card capture.";
                                }
                                if (json.errorMessage.indexOf('declined') != -1) {
                                    error.code = 4100;
                                    error.message = "Your card was declined.";
                                }
                        }
                    }
                    switch (json.errorType) {
                        case 'PermissionsError':
                            error.code = 1220;
                            error.message = "Access to BillForward server is denied.";
                            if (json.errorMessage === 'Access is denied') {
                                error.code = 1221;
                                error.message = "Your BillForward role lacks privilege to capture cards.";
                            }
                            break;
                        default:
                        }
                    break;
                case 401:
                    error.code = 1210;
                    error.message = "Your BillForward token is invalid.";
                    if (json.errorMessage.indexOf('expired') != -1) {
                        error.code = 1211;
                        error.message = "Your BillForward token has expired.";
                    }
                    break;
                default:
                    error.code = 1000;
                    error.message = "Failed to connect to BillForward.";

                    if (jqXHR.readyState === 0) {
                        error.code = 1100;
                        error.message = "Failed to connect to BillForward.";
                    }
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

        p.authCaptureSuccessHandler = function(data) {
            this.onceAuthCaptured(data);
        };

        p.oncePreAuthed = function() {
            this.submitDancer.loadedCallback();
        };

        p.onceAuthCaptured = function(data) {
            var paymentMethod = data.results[0];
            this.ultimateSuccess(paymentMethod);
        };

        p.ultimateSuccess = function(paymentMethod) {
            //console.log(paymentMethod);
            this.transaction.callback(paymentMethod, false);
        };

        p.ultimateFailure = function(reason) {
            //console.error(reason);
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
            'exp-date': 'exp_date', // not supported in Stripe; we cheat
            'address-line1': 'address_line1',
            'address-line2': 'address_line2',
            'address-city': 'address_city',
            'address-province': 'address_state',
            'address-zip': 'address_zip',
            'address-country': 'address_country',
            'name-first': 'firstName',
            'name-last': 'lastName',
        };

        // these, if present, will be thrown straight into BF authCapture request.
        TheClass.bfBypass = {
            'email': 'email',
            'company-name': 'companyName',
            'name-first': 'firstName',
            'name-last': 'lastName',
            'phone-mobile': 'mobile',
            'use-as-default-payment-method':'defaultPaymentMethod'
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
                "@type": "StripePreAuthRequest",
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

            var resolvedValues = (function(mappings) {
                var map = {};

                for (var i in mappings) {
                    var mapping = mappings[i];
                    var valueFromForm;
                    valueFromForm = this.transaction.state.cardDetails
                    ? this.transaction.state.cardDetails[i]
                    : this.transaction.bfjs.core.getFormValue(i, this.transaction.state.$formElement);

                    map[i] = valueFromForm;
                }

                return map;
            })
            .call(this, TheClass.mappings);

            var setKeyToVal = function(key, value) {
                tokenInfo[TheClass.mappings[key]] = value;
            };
            
            for (var i in TheClass.mappings) {
                var mapping = TheClass.mappings[i];
                var valueFromForm = resolvedValues[i];

                var doDefault = function() {
                    setKeyToVal(i, valueFromForm);
                };
                
                if (valueFromForm) {
                    switch (i) {
                        case 'exp-date':
                            var parts = valueFromForm.split("/");
                            var month = parts[0];
                            var year = parts[1];
                            setKeyToVal('exp-month', month);
                            setKeyToVal('exp-year', year);
                            break;
                        case 'exp-month':
                        case 'exp-year':
                            // concede fealty
                            if (resolvedValues['exp-date']) break;
                            doDefault(); break;
                        case 'name-last': break;
                        case 'name-first':
                            if (!resolvedValues['cardholder-name']) {
                                // we'll have to build it from first and last
                                var cardHolderName = [
                                resolvedValues['name-first'],
                                resolvedValues['name-last']
                                ].join(" ");

                                setKeyToVal('cardholder-name', cardHolderName);
                            }
                            break;
                        default:
                            doDefault();
                    }
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
                    "@type": 'StripeAuthCaptureRequest',
                    "gateway": "Stripe",
                    "stripeToken": token,
                    "cardID": card.id,
                    "accountID": this.transaction.accountID
                };

                // add BF-only attributes here
                var additional = {};
            
                for (var i in TheClass.bfBypass) {
                    var mapping = TheClass.bfBypass[i];
                    var valueFromForm;
                    if (this.transaction.state.cardDetails) {
                        valueFromForm = this.transaction.state.cardDetails[i];
                    } else {
                        valueFromForm = this.transaction.bfjs.core.getFormValue(i, this.transaction.state.$formElement);
                    }
                    switch(i) {
                            case 'use-as-default-payment-method':
                            // if it's filled in, evaluate as true. Unless it's filled in as string "false".
                            valueFromForm = valueFromForm && valueFromForm !== "false" ? true : false;
                            break;
                    }
                    
                    if (valueFromForm) {
                        additional[TheClass.bfBypass[i]] = valueFromForm;
                    }
                }

                $.extend(payload, additional);

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
        };

        TheClass.mappingsProgrammatic = {
            'cardholder-name': 'cardholderName',
            'cvc': 'cvv',
            'number': 'number',
            'exp-date': 'expirationDate',
            'exp-month': 'expirationMonth',
            'exp-year': 'expirationYear'
        };

        TheClass.mappingsProgrammaticBillingAddress = {
            'address-zip': 'postalCode',
            'address-line1': 'streetAddress',
            'address-line2': 'extendedAddress',
            'address-line3': 'locality',
            'address-city': 'locality',
            'address-country': 'countryName',
            'address-province': 'region',
            'name-first': 'firstName',
            'name-last': 'lastName'
            //'company': 'company',
        };
        
        // these, if present, will be thrown straight into BF authCapture request.
        TheClass.bfBypass = {
            'company-name': 'companyName',
            'name-first': 'firstName',
            'name-last': 'lastName',
            'use-as-default-payment-method':'defaultPaymentMethod'
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
                "@type": "BraintreePreAuthRequest",
                "gateway": "Braintree",
                "accountID": this.transaction.accountID
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
            var merchantId;
            var environment;
            var failed = false;
            try {
                clientToken = data.results[0].clientToken;
                merchantId = data.results[0].merchantId;
                environment = data.results[0].environment;
                if (!clientToken || !merchantId || !environment) {
                    failed = true;
                }
            } catch (e){
                failed = true;
            }

            this.clientToken = clientToken;
            this.merchantId = merchantId;
            this.environment = environment;
            var resolvedEnvironment;
            switch(environment) {
                    case 'Production':
                        resolvedEnvironment = BraintreeData.environments.production;
                        break;
                    case 'Sandbox':
                    default:
                        resolvedEnvironment = BraintreeData.environments.sandbox;
            }
            this.resolvedEnvironment = resolvedEnvironment;
            
            console.log("env", environment);
            console.log("resEnv", resolvedEnvironment);

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
                    BraintreeData.setup(merchantId, formId, resolvedEnvironment);
                }
                //braintree.setup(clientToken, "custom", {id: formId});
            }

            this.submitDancer.loadedCallback();
        };

        p.startAuthCapture = function(data) {
            var self = this;
            
            var deviceDataValue;
            if (!this.transaction.state.cardDetails) {
                var $formElement = this.transaction.state.$formElement;
                var deviceDataSelector = $formElement.find("input[name='device_data']");
                deviceDataValue = deviceDataSelector.val();
                console.log("dev_d", deviceDataValue);
            }

            var nonceValue;
            if (this.myGateway.usePaypal && !this.transaction.state.cardDetails) {
                // check for a nonce
                var $paypalSelector = $(this.myGateway.paypalButtonSelector);
                var nonceSelector = $paypalSelector.find("input[name='payment_method_nonce']");
                
                nonceValue = nonceSelector.val();
                if (nonceValue) {
                    //this.gatewayResponseHandler(null, nonceValue);
                    self.gatewayResponseHandler.apply(self, [null, deviceDataValue, nonceValue]);
                    return;
                }
            }
            var tokenInfo = {};

            if (this.transaction.state.cardDetails) {
                for (var i in TheClass.mappingsProgrammatic) {
                    var mapping = TheClass.mappingsProgrammatic[i];
                    var valueFromForm = this.transaction.state.cardDetails[i];
                    
                    if (valueFromForm) {
                        tokenInfo[TheClass.mappingsProgrammatic[i]] = valueFromForm;
                    }
                }
            } else {
                for (var i in TheClass.mappings) {
                    var mapping = TheClass.mappings[i];
                    var valueFromForm = this.transaction.bfjs.core.getFormValue(i, this.transaction.state.$formElement);
                    
                    if (valueFromForm) {
                        tokenInfo[TheClass.mappings[i]] = valueFromForm;
                    }
                }
            }

            tokenInfo.billingAddress = {};

            for (var i in TheClass.mappingsProgrammaticBillingAddress) {
                var mapping = TheClass.mappingsProgrammaticBillingAddress[i];

                var valueFromForm;
                if (this.transaction.state.cardDetails) {
                    valueFromForm = this.transaction.state.cardDetails[i];
                } else {
                    valueFromForm = this.transaction.bfjs.core.getFormValue(i, this.transaction.state.$formElement);
                }

                if (valueFromForm) {
                    tokenInfo.billingAddress[TheClass.mappingsProgrammaticBillingAddress[i]] = valueFromForm;
                }
            }

            //console.log(tokenInfo);

            var client = new braintree.api.Client({clientToken: this.clientToken});
            client.tokenizeCard(tokenInfo, function() {
                var argumentsArr = [];
                for (var a = 0; a<arguments.length; a++) {
                    var arg = arguments[a];
                    argumentsArr.push(arg);
                }
                self.gatewayResponseHandler.apply(self, [deviceDataValue].concat(argumentsArr));
            });
        };

        p.gatewayResponseHandler = function(err, deviceData, nonce) {
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
                    "@type": "BraintreeAuthCaptureRequest",
                    "gateway": "Braintree",
                    "paymentMethodNonce": nonce,
                    "accountID": this.transaction.accountID
                };
                
                if (deviceData) {
                    payload.deviceData = deviceData;
                }

                // add BF-only attributes here
                var additional = {};
            
                for (var i in TheClass.bfBypass) {
                    var mapping = TheClass.bfBypass[i];
                    var valueFromForm;
                    if (this.transaction.state.cardDetails) {
                        valueFromForm = this.transaction.state.cardDetails[i];
                    } else {
                        valueFromForm = this.transaction.bfjs.core.getFormValue(i, this.transaction.state.$formElement);
                    }
                    switch(i) {
                            case 'use-as-default-payment-method':
                            // if it's filled in, evaluate as true. Unless it's filled in as string "false".
                            valueFromForm = valueFromForm && valueFromForm !== "false" ? true : false;
                            break;
                    }
                    
                    if (valueFromForm) {
                        additional[TheClass.bfBypass[i]] = valueFromForm;
                    }
                }

                $.extend(payload, additional);

                // and re-submit
                this.doAuthCapture(payload);
            }
        };

        return TheClass;
    })();

    bfjs.SpreedlyTransaction = (function() {
        var _parent = bfjs.GatewayTransaction;

        var TheClass = function() {
            _parent.apply(this, arguments);
        };

        TheClass.mappings = {
            'name-first': 'first_name',
            'name-last': 'last_name',
            'cardholder-name': 'name', // not supported in Spreedly; we cheat
            'cvc': 'verification_value',
            'number': 'number',
            'exp-month': 'month',
            'exp-year': 'year',
            'exp-date': 'exp_date', // not supported in Stripe; we cheat
            'address-line1': 'address1',
            'address-line2': 'address2',
            'address-city': 'city',
            'address-province': 'state',
            'address-zip': 'zip',
            'address-country': 'country',
            'phone-mobile': 'phone_number',
            'email': 'email',
        };

        // these, if present, will be thrown straight into BF authCapture request.
        TheClass.bfBypass = {
            'company-name': 'companyName',
            'name-first': 'firstName',
            'name-last': 'lastName',
            'use-as-default-payment-method':'defaultPaymentMethod'
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
                "@type": "SpreedlyPreAuthRequest",
                "gateway": "Spreedly"
            }

            if(this.transaction.bfjs.state.api.organizationID != null) {
                payload.organizationID = this.transaction.bfjs.state.api.organizationID;
            }

            this.preAuthRequestPayload = payload;

            // ready to do pageLoadDo
            this.pageLoadDancer.loadedCallback();
        };

        p.startAuthCapture = function(data) {
            var spreedlyEnvKey;
            var failed = false;
            try {
                spreedlyEnvKey = data.results[0].publicKey;
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
            
            var tokenInfo = {};
            
            /*for (var i in TheClass.mappings) {
                var mapping = TheClass.mappings[i];
                var valueFromForm;
                if (this.transaction.state.cardDetails) {
                    valueFromForm = this.transaction.state.cardDetails[i];
                } else {
                    valueFromForm = this.transaction.bfjs.core.getFormValue(i, this.transaction.state.$formElement);
                }
                
                if (valueFromForm) {
                    switch (mapping) {
                        case 'exp_date':
                            var parts = valueFromForm.split("/");
                            var month = parts[0];
                            var year = parts[1];
                            tokenInfo['expMonth'] = month;
                            tokenInfo['expYear'] = year;
                            break;
                        case 'name':
                            var parts = (valueFromForm||"").split(" ");
                            var firstName;
                            var lastName;
                            if (parts.length<2) {
                                // I guess assume they only provided a first name?
                                firstName = parts[0];
                                lastName = "";
                            } else {
                                // we'll consider the final word to be the surname; everything else is first name.
                                firstName = parts.slice(0, -1).join(' ');
                                lastName = parts.slice(-1).join(' ');
                            }
                            tokenInfo['first_name'] = firstName;
                            tokenInfo['last_name'] = lastName;
                            break;
                        case 'first_name':
                            // if this was already populated by cardholder name split, concede authority
                            if (tokenInfo['first_name']) break;
                            tokenInfo[TheClass.mappings[i]] = valueFromForm;
                            break;
                        case 'last_name':
                            // if this was already populated by cardholder name split, concede authority
                            if (tokenInfo['last_name']) break;
                            tokenInfo[TheClass.mappings[i]] = valueFromForm;
                            break;
                        default:
                            tokenInfo[TheClass.mappings[i]] = valueFromForm;
                    }
                }
            }*/

            var resolvedValues = (function(mappings) {
                var map = {};

                for (var i in mappings) {
                    var mapping = mappings[i];
                    var valueFromForm;
                    valueFromForm = this.transaction.state.cardDetails
                    ? this.transaction.state.cardDetails[i]
                    : this.transaction.bfjs.core.getFormValue(i, this.transaction.state.$formElement);

                    map[i] = valueFromForm;
                }

                return map;
            })
            .call(this, TheClass.mappings);

            var setKeyToVal = function(key, value) {
                tokenInfo[TheClass.mappings[key]] = value;
            };
            
            for (var i in TheClass.mappings) {
                var mapping = TheClass.mappings[i];
                var valueFromForm = resolvedValues[i];

                var doDefault = function() {
                    setKeyToVal(i, valueFromForm);
                };
                
                if (valueFromForm) {
                    switch (i) {
                        case 'exp-date':
                            var parts = valueFromForm.split("/");
                            var month = parts[0];
                            var year = parts[1];
                            setKeyToVal('exp-month', month);
                            setKeyToVal('exp-year', year);
                            break;
                        case 'exp-month':
                        case 'exp-year':
                            // concede fealty
                            if (resolvedValues['exp-date']) break;
                            doDefault(); break;
                        case 'cardholder-name':
                            // gotta split this
                            var parts = (valueFromForm||"").split(" ");
                            var firstName;
                            var lastName;
                            if (parts.length<2) {
                                // I guess assume they only provided a first name?
                                firstName = parts[0];
                                lastName = "";
                            } else {
                                // we'll consider the final word to be the surname; everything else is first name.
                                firstName = parts.slice(0, -1).join(' ');
                                lastName = parts.slice(-1).join(' ');
                            }
                            setKeyToVal('name-first', firstName);
                            setKeyToVal('name-last', lastName);
                            break;
                        case 'name-last':
                        case 'name-first':
                            // concede fealty
                            if (resolvedValues['cardholder-name']) break;
                            doDefault(); break;
                        default:
                            doDefault();
                    }
                }
            }

            var self = this;

            tokenInfo['environment_key'] = spreedlyEnvKey;

            // Serialize and URI encode parameters.
            var paramStr = $.param(tokenInfo);

            var url = "https://core.spreedly.com/v1/payment_methods.js?"+ paramStr;
            var ajaxObj = {
              type: "GET",
              url: url,
              dataType: "jsonp",
              async: true
            };

            $.ajax(ajaxObj)
            .done(function() {
                self.gatewayResponseHandler.apply(self, arguments);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                var bfjsError = {
                    detailObj: jqXHR,
                    message: "Card capture with Spreedly failed; failed to connect to Spreedly.",
                    code: 3100
                };

                // maybe should only go to ultimate failure if ALL gateways fail to tokenize
                self.ultimateFailure(bfjsError);
            });
        };

        p.gatewayResponseHandler = function(data) {
            if (data.status === 201) {
                var parseFailure = false;
                var token;
                try {
                    token = data.transaction.payment_method.token;
                } catch(e) {
                    parseFailure = true;
                }
                if (parseFailure || !token) {
                    var bfjsError = {
                        code: 3200,
                        message: "Card capture to Spreedly failed; token not in promised location within response.",
                        detailObj: data
                    };
                    return this.ultimateFailure(bfjsError);
                }

                var payload = {
                    "@type": 'SpreedlyAuthCaptureRequest',
                    "gateway": "Spreedly",
                    "cardToken": token,
                    "accountID": this.transaction.accountID
                };

                // add BF-only attributes here
                var additional = {};
            
                for (var i in TheClass.bfBypass) {
                    var mapping = TheClass.bfBypass[i];
                    var valueFromForm;
                    if (this.transaction.state.cardDetails) {
                        valueFromForm = this.transaction.state.cardDetails[i];
                    } else {
                        valueFromForm = this.transaction.bfjs.core.getFormValue(i, this.transaction.state.$formElement);
                    }
                    switch(i) {
                            case 'use-as-default-payment-method':
                            // if it's filled in, evaluate as true. Unless it's filled in as string "false".
                            valueFromForm = valueFromForm && valueFromForm !== "false" ? true : false;
                            break;
                    }
                    
                    if (valueFromForm) {
                        additional[TheClass.bfBypass[i]] = valueFromForm;
                    }
                }

                $.extend(payload, additional);

                return this.doAuthCapture(payload);
            } else {
                var bfjsError = {
                    code: 3000,
                    message: "Card capture to Spreedly failed.",
                    detailObj: data
                };
                // Show the errors on the form
                return this.ultimateFailure(bfjsError);
            }
        };

        return TheClass;
    })();

    bfjs.SagePayTransaction = (function() {
        var _parent = bfjs.GatewayTransaction;

        var TheClass = function() {
            _parent.apply(this, arguments);
        };

        TheClass.mappings = {
        };

        // these, if present, will be thrown straight into BF authCapture request.
        TheClass.bfBypass = {
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
            this.VPSProtocol = "3.00";
            var payload = {
                "@type": "SagePayPreAuthRequest",
                "gateway": "SagePay",
                "currency": "GBP",
                "VPSProtocol": this.VPSProtocol,
                "formProfile": "LOW",
                "billForwardURL": this.transaction.bfjs.state.api.url,
                "billForwardPublicToken": this.transaction.bfjs.state.api.token
            }

            if(this.transaction.bfjs.state.api.organizationID != null) {
                payload.organizationID = this.transaction.bfjs.state.api.organizationID;
            }

            this.preAuthRequestPayload = payload;

            // ready to do pageLoadDo
            this.pageLoadDancer.loadedCallback();
        };

        p.startAuthCapture = function(data) {
            var failed = false;
            var payload;
            try {
                payload = data.results[0];
                /*if (!payload.VPSProtocol
                    || !payload.vendor
                    || !payload.vendorTxCode
                    || !payload.currency
                    || !payload.notificationEndpoint
                    || !payload.environment
                    ) {
                    failed = true;
                }*/

                if (!payload.VPSProtocol
                    || !payload.nextURL
                    ) {
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

            if (this.VPSProtocol !== payload.VPSProtocol) {
                return this.ultimateFailure({
                    code: 2030,
                    message: "Preauthorization failed. We do not support SagePay VPSProtocol '"+payload.VPSProtocol+"'.",
                    detailObj: data
                });
            }

            // var fullURL = this.transaction.bfjs.state.api.url + payload.notificationEndpoint;
            // var auth = this.transaction.bfjs.state.api.token;

            // var callbackURL = fullURL+"?access_token="+auth;
            // // var callbackURL = fullURL;
            // // var callbackURL = "https://api-sandbox.billforward.net:443/v1/accounts?access_token=ec362f68-03d7-4964-bb6f-2da7ce768ed2";

            // var postVars = {
            //     VPSProtocol: payload.VPSProtocol,
            //     TxType: "TOKEN",
            //     Vendor: payload.vendor,
            //     VendorTxCode: payload.vendorTxCode,
            //     Currency: payload.currency,
            //     Profile: "LOW",
            //     Language: "EN",
            //     NotificationURL: callbackURL
            // };

            /*var windowProxy;
            window.onload=function(){ 
                // Create a proxy window to send to and receive 
                // messages from the iFrame
                windowProxy = new Porthole.WindowProxy(
                    'http://other-domain.com/proxy.html', 'guestFrame');

                // Register an event handler to receive messages;
                windowProxy.addEventListener(onMessage);
            };*/

            console.log(this.transaction.bfjs.state.api.url);

            var bfAPIURLParsed = this.transaction.bfjs.core.parseURL(this.transaction.bfjs.state.api.url);

            console.log(bfAPIURLParsed);

            var self = this;

            var registrationRequesterID = "bf-sagePayRegistrationRequester";

            var handleIFrameResponse = function(e) {
                var originalEvent = e.originalEvent;
                console.log(originalEvent);
                console.log(bfAPIURLParsed);
                console.log(originalEvent.origin, bfAPIURLParsed.origin);
                if (originalEvent.origin === bfAPIURLParsed.origin) {
                    console.log("awww yiss")
                    console.log(originalEvent.data);
                    self.gatewayResponseHandler.call(self, originalEvent.data);
                    var $registrationRequester = $("#"+registrationRequesterID);
                    $registrationRequester.hide();
                }
              };
            $(window).unbind('message', handleIFrameResponse);
            $(window).bind('message', handleIFrameResponse);

            var $sagePayFormContainerSelector = $(this.myGateway.sagePayFormContainerSelector);

            var viewOptions = $.extend({
                width: "398px",
                height: "464px",
                border: "none"
            }, this.myGateway.sagePayFormContainerOptions);

            $sagePayFormContainerSelector.append('<iframe id="'+registrationRequesterID+'" src="'+payload.nextURL+'"></iframe>');
            var $registrationRequester = $("#"+registrationRequesterID);
            $registrationRequester.css("border", viewOptions.border);
            $registrationRequester.width(viewOptions.width);
            $registrationRequester.height(viewOptions.height);
        };

        p.gatewayResponseHandler = function(data) {
            var self = this;

            var malformedResponse = function(data) {
                var bfjsError = {
                    code: 5100,
                    message: "Card capture to SagePay failed; malformed response.",
                    detailObj: data
                };
                return self.ultimateFailure(bfjsError);
            };

            var parsed;
            try {
                parsed = JSON.parse(data);
            } catch(err) {
                var bfjsError = {
                    code: 5101,
                    message: "Card capture to SagePay failed; malformed response (expected JSON-encoded).",
                    detailObj: data
                };
                return self.ultimateFailure(bfjsError);
            }

            var successHandler = function(data) {
                if (!data.cardToken) {
                    return malformedResponse(data);
                }

                var payload = {
                    "@type": 'SagePayAuthCaptureRequest',
                    "gateway": "SagePay",
                    "cardType": data.cardType,
                    "expiryDate": data.expiryDate,
                    "last4Digits": data.last4Digits,
                    "cardToken": data.cardToken,
                    "accountID": self.transaction.accountID
                };

                // add BF-only attributes here
                var additional = {};
            
                for (var i in TheClass.bfBypass) {
                    var mapping = TheClass.bfBypass[i];
                    var valueFromForm;
                    if (self.transaction.state.cardDetails) {
                        valueFromForm = self.transaction.state.cardDetails[i];
                    } else {
                        valueFromForm = self.transaction.bfjs.core.getFormValue(i, self.transaction.state.$formElement);
                    }
                    switch(i) {
                        case 'use-as-default-payment-method':
                        // if it's filled in, evaluate as true. Unless it's filled in as string "false".
                        valueFromForm = valueFromForm && valueFromForm !== "false" ? true : false;
                        break;
                    }
                    
                    if (valueFromForm) {
                        additional[TheClass.bfBypass[i]] = valueFromForm;
                    }
                }

                $.extend(payload, additional);

                return self.doAuthCapture(payload);
            };

            var invalidHandler = function(data) {
                var reason = data.statusDetail;
                var bfjsError = {
                    code: 5010,
                    message: "Card capture to SagePay failed; card rejected. Reason: '"+reason+"'",
                    detailObj: data
                };
                return self.ultimateFailure(bfjsError);
            };

            var errorHandler = function(data) {
                var bfjsError = {
                    code: 5020,
                    message: "Card capture to SagePay failed; error occurred in BillForward server during token verification.",
                    detailObj: data
                };
                return self.ultimateFailure(bfjsError);
            };

            switch(parsed.status) {
                case 'OK':
                    return successHandler(parsed);
                case 'INVALID':
                    return invalidHandler(parsed);
                case 'ERROR':
                    return errorHandler(parsed);
                default:
                    return malformedResponse(parsed);
            }
        };

        return TheClass;
    })();

    // core is mainly to check if jquery is loaded
    bfjs.core = bfjs.CoreActor.construct();

    bfjs.gatewayInstances = {
        'stripe': bfjs.StripeGateway.construct(),
        'braintree': bfjs.BraintreeGateway.construct(),
        'generic': bfjs.SpreedlyGateway.construct(),
        'sagepay': bfjs.SagePayGateway.construct()
    };

    bfjs.gatewayTransactionClasses = {
        'stripe': bfjs.StripeTransaction,
        'braintree': bfjs.BraintreeTransaction,
        'generic': bfjs.SpreedlyTransaction,
        'sagepay': bfjs.SagePayTransaction
    };

    bfjs.lateActors = [
        bfjs.core,
        bfjs.gatewayInstances['stripe'],
        bfjs.gatewayInstances['braintree'],
        bfjs.gatewayInstances['generic'],
        bfjs.gatewayInstances['sagepay']
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
        for (var i=0; i<bfjs.lateActors.length; i++) {
            var actor = bfjs.lateActors[i];
            
            var loadedCallback = actor.loadedCallback;
            
            switch (actor.depName) {
                    case 'braintree':
                        if(typeof window.BraintreeData === 'undefined') {
                            // schedule a load of BraintreeData after Braintree is loaded, then call Braintree's loaded callback.
                            loadedCallback = function() {
                                var url = "https://js.braintreegateway.com/v1/braintree-data.js";
                                
                                bfjs.loadScript(url, actor.loadedCallback, actor);
                            };
                        }
                    default:
                        if (!actor.depName || typeof window[actor.depName] !== 'undefined') {
                            loadedCallback.call(actor);
                        } else {
                            queue.push({
                                actor: actor,
                                src: actor.depUrl,
                                callback: loadedCallback
                            });
                        }
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

    bfjs.core.parseURL = function(href) {
        var urlParser = document.createElement("a");
        urlParser.href = href;
        return {
            host: urlParser.host,
            hostname: urlParser.hostname,
            href: urlParser.href,
            pathname: urlParser.pathname,
            protocol: urlParser.protocol,
            origin: urlParser.origin
        };
    };

    var invoke = function(formElementSelector, cardDetails, targetGateway, accountID, callback) {
        var resolvedGateway = bfjs.resolveGatewayName(targetGateway, cardDetails);

        if (bfjs.core.hasBfCredentials) {
            if (!bfjs.core.gatewayChosen) {
                bfjs.loadGateways([resolvedGateway], cardDetails);
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
                throw new Error("You need to first call BillForward.loadGateways() with a list of gateways you are likely to use (ie ['stripe', 'braintree', 'generic'])");
            }
        } else {
            throw new Error("You need to first call BillForward.useAPI() will BillForward credentials");
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

    bfjs.addSagePayForm = function(selector, options) {
        // supported for SagePay only
        bfjs.gatewayInstances['sagepay'].sagePayFormContainerSelector = selector;
        bfjs.gatewayInstances['sagepay'].sagePayFormContainerOptions = options || {};
    };

    bfjs.resolveGatewayName = function(name, cardDetails) {
        var lowerCase = name.toLowerCase();
        var resolved = lowerCase;
        switch(resolved) {
            case 'braintree+paypal':
                resolved = 'braintree';
                if (!bfjs.gatewayInstances[resolved].usePaypal) {
                    throw new Error("You need first to call BillForward.addPayPalButton() with a Jquery-style selector to your PayPal button");
                }
                if (cardDetails) {
                    throw new Error("Formless invocation is not available for Braintree+PayPal. You must use BillForward.captureCardOnSubmit(), or switch to the 'braintree' gateway.");
                }
                break;
            case 'sagepay':
                if (!bfjs.gatewayInstances[resolved].sagePayFormContainerSelector) {
                    throw new Error("You need first to call BillForward.addSagePayForm() with a Jquery-style selector to some <div> into which BillForward.js can inject the SagePay form.");
                }
                if (!cardDetails) {
                    throw new Error("Custom form invocation is not available for SagePay. You must use BillForward.captureCard().");
                }
                break;
        }

        return resolved;
    };

    bfjs.loadGateways = function(gateways, cardDetails) {
       for (i = 0; i < gateways.length; i++) {
            var gateway = gateways[i];
            var resolvedName = bfjs.resolveGatewayName(gateway, cardDetails);
            switch(gateway.toLowerCase()) {
                case 'stripe':
                case 'braintree':
                case 'generic':
                case 'sagepay':
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

    // (function(){var a=false,b=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.PortholeClass=function(){};PortholeClass.extend=function(g){var f=this.prototype;a=true;var e=new this();a=false;for(var d in g){e[d]=typeof g[d]=="function"&&typeof f[d]=="function"&&b.test(g[d])?(function(h,i){return function(){var k=this._super;this._super=f[h];var j=i.apply(this,arguments);this._super=k;return j}})(d,g[d]):g[d]}function c(){if(!a&&this.init){this.init.apply(this,arguments)}}c.prototype=e;c.prototype.constructor=c;c.extend=arguments.callee;return c}})();(function(c){var b={debug:false,trace:function(d){if(this.debug&&c.console!==undefined){c.console.log("Porthole: "+d)}},error:function(d){if(c.console!==undefined){c.console.error("Porthole: "+d)}}};b.WindowProxy=function(){};b.WindowProxy.prototype={post:function(e,d){},addEventListener:function(d){},removeEventListener:function(d){}};b.WindowProxyBase=PortholeClass.extend({init:function(d){if(d===undefined){d=""}this.targetWindowName=d;this.origin=c.location.protocol+"//"+c.location.host;this.eventListeners=[]},getTargetWindowName:function(){return this.targetWindowName},getOrigin:function(){return this.origin},getTargetWindow:function(){return b.WindowProxy.getTargetWindow(this.targetWindowName)},post:function(e,d){if(d===undefined){d="*"}this.dispatchMessage({data:e,sourceOrigin:this.getOrigin(),targetOrigin:d,sourceWindowName:c.name,targetWindowName:this.getTargetWindowName()})},addEventListener:function(d){this.eventListeners.push(d);return d},removeEventListener:function(g){var d;try{d=this.eventListeners.indexOf(g);this.eventListeners.splice(d,1)}catch(h){this.eventListeners=[]}},dispatchEvent:function(f){var d;for(d=0;d<this.eventListeners.length;d++){try{this.eventListeners[d](f)}catch(g){}}}});b.WindowProxyLegacy=b.WindowProxyBase.extend({init:function(d,e){this._super(e);if(d!==null){this.proxyIFrameName=this.targetWindowName+"ProxyIFrame";this.proxyIFrameLocation=d;this.proxyIFrameElement=this.createIFrameProxy()}else{this.proxyIFrameElement=null;b.trace("proxyIFrameUrl is null, window will be a receiver only");this.post=function(){throw new Error("Receiver only window")}}},createIFrameProxy:function(){var d=document.createElement("iframe");d.setAttribute("id",this.proxyIFrameName);d.setAttribute("name",this.proxyIFrameName);d.setAttribute("src",this.proxyIFrameLocation);d.setAttribute("frameBorder","1");d.setAttribute("scrolling","auto");d.setAttribute("width",30);d.setAttribute("height",30);d.setAttribute("style","position: absolute; left: -100px; top:0px;");if(d.style.setAttribute){d.style.setAttribute("cssText","position: absolute; left: -100px; top:0px;")}document.body.appendChild(d);return d},dispatchMessage:function(e){var d=c.encodeURIComponent;if(this.proxyIFrameElement){var f=this.proxyIFrameLocation+"#"+d(b.WindowProxy.serialize(e));this.proxyIFrameElement.setAttribute("src",f);this.proxyIFrameElement.height=this.proxyIFrameElement.height>50?50:100}}});b.WindowProxyHTML5=b.WindowProxyBase.extend({init:function(d,e){this._super(e);this.eventListenerCallback=null},dispatchMessage:function(d){this.getTargetWindow().postMessage(b.WindowProxy.serialize(d),d.targetOrigin)},addEventListener:function(e){if(this.eventListeners.length===0){var d=this;if(c.addEventListener){this.eventListenerCallback=function(f){d.eventListener(d,f)};c.addEventListener("message",this.eventListenerCallback,false)}else{if(c.attachEvent){this.eventListenerCallback=function(f){d.eventListener(d,c.event)};c.attachEvent("onmessage",this.eventListenerCallback)}}}return this._super(e)},removeEventListener:function(d){this._super(d);if(this.eventListeners.length===0){if(c.removeEventListener){c.removeEventListener("message",this.eventListenerCallback)}else{if(c.detachEvent){if(typeof c.onmessage==="undefined"){c.onmessage=null}c.detachEvent("onmessage",this.eventListenerCallback)}}this.eventListenerCallback=null}},eventListener:function(e,d){var f=b.WindowProxy.unserialize(d.data);if(f&&(e.targetWindowName===""||f.sourceWindowName==e.targetWindowName)){e.dispatchEvent(new b.MessageEvent(f.data,d.origin,e))}}});if(!c.postMessage){b.trace("Using legacy browser support");b.WindowProxy=b.WindowProxyLegacy.extend({})}else{b.trace("Using built-in browser support");b.WindowProxy=b.WindowProxyHTML5.extend({})}b.WindowProxy.serialize=function(d){if(typeof JSON==="undefined"){throw new Error("Porthole serialization depends on JSON!")}return JSON.stringify(d)};b.WindowProxy.unserialize=function(g){if(typeof JSON==="undefined"){throw new Error("Porthole unserialization dependens on JSON!")}try{var d=JSON.parse(g)}catch(f){return false}return d};b.WindowProxy.getTargetWindow=function(d){if(d===""){return parent}else{if(d==="top"||d==="parent"){return c[d]}}return c.frames[d]};b.MessageEvent=function a(f,d,e){this.data=f;this.origin=d;this.source=e};b.WindowProxyDispatcher={forwardMessageEvent:function(i){var g,h=c.decodeURIComponent,f,d;if(document.location.hash.length>0){g=b.WindowProxy.unserialize(h(document.location.hash.substr(1)));f=b.WindowProxy.getTargetWindow(g.targetWindowName);d=b.WindowProxyDispatcher.findWindowProxyObjectInWindow(f,g.sourceWindowName);if(d){if(d.origin===g.targetOrigin||g.targetOrigin==="*"){d.dispatchEvent(new b.MessageEvent(g.data,g.sourceOrigin,d))}else{b.error("Target origin "+d.origin+" does not match desired target of "+g.targetOrigin)}}else{b.error("Could not find window proxy object on the target window")}}},findWindowProxyObjectInWindow:function(d,g){var f;if(d){for(f in d){if(Object.prototype.hasOwnProperty.call(d,f)){try{if(d[f]!==null&&typeof d[f]==="object"&&d[f] instanceof d.Porthole.WindowProxy&&d[f].getTargetWindowName()===g){return d[f]}}catch(h){}}}}return null},start:function(){if(c.addEventListener){c.addEventListener("resize",b.WindowProxyDispatcher.forwardMessageEvent,false)}else{if(c.attachEvent&&c.postMessage!=="undefined"){c.attachEvent("onresize",b.WindowProxyDispatcher.forwardMessageEvent)}else{if(document.body.attachEvent){c.attachEvent("onresize",b.WindowProxyDispatcher.forwardMessageEvent)}else{b.error("Cannot attach resize event")}}}}};if(typeof c.exports!=="undefined"){c.exports.Porthole=b}else{c.Porthole=b}})(window);

    window.BillForward = window.BillForward || bfjs;
})();
