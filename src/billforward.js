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
                this.deferredTransactions.splice(i, 1)[0]['do']();
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
            this.depUrlRequire = "https://js.stripe.com/v2/?1";
            this.depName = "Stripe";
            this.depObj = null;
            this.requireShim = {};
            // this.requireShim[this.depName] = {
            //   "exports": "Stripe"
            // };
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
            this.depUrl = "https://js.braintreegateway.com/v2/braintree.js";
            this.depUrlRequire = "https://js.braintreegateway.com/v2/braintree";
            this.depName = "braintree";
            this.usePaypal = false;
            this.paypalButtonSelector = null;
            this.depObj = null;
            this.requireShim = {};
            this.handlePayPalFetchBegin = function() { return; };
            this.handlePayPalReady = function() { return; };
            this.handlePayPalLoaded = function() { return; };
            this.onPaymentMethodReceived = function() { return; };
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
            this.getDeferredCardDetails = function() { return {} };
            this.handleIFrameFetchBegin = function() { return {} };
            this.handleIFrameReady = function() { return {} };
            this.handleIFrameLoaded = function() { return {} };
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

        p['do'] = function() {
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

                    function onSubmit(event) {
                        // Disable the submit button to prevent repeated clicks
                        $(this).find('button').prop('disabled', true);

                        event.preventDefault();
                        event.stopPropagation();

                        newGatewayTransaction.doSubmitDanceWhenReady();
                    }

                    $formElement.off('submit', onSubmit);
                    $formElement.on('submit', onSubmit);

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
            };
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
                52xx - Token registration aborted
                5200 --- (Generic)
              * 5201 --- Aborted by customer
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
            /*if ('undefined' !== typeof this.undisableForm) {
                this.undisableForm();
                this.undisableForm = null;
                this.submitDanceBegun = false;
            }*/
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
            // this.submitDanceBegun = false;
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
            deferredTransaction['do'] = function() {
                self.doPreAuth(self.preAuthRequestPayload);
            };

            this.pageLoadDancer.doWhenReady(deferredTransaction);
        };

        p.doSubmitDanceWhenReady = function() {
            var self = this;

            // if (!this.submitDanceBegun) {
                var deferredTransaction = bfjs.TransactionBase.construct();
                deferredTransaction['do'] = function() {
                    /*if (disableForm) {
                        disableForm();
                    }
                    this.undisableForm = undisableForm;*/
                    self.startAuthCapture(self.preAuthResponsePayload);
                };

                this.submitDancer.doWhenReady(deferredTransaction);   
            // }
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

        p['do'] = function() {
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

            /*if (typeof Stripe !== 'undefined') {
                this.myGateway.depObj = Stripe;
            }*/

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

        p['do'] = function() {
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
            
            // console.log("env", environment);
            // console.log("resEnv", resolvedEnvironment);

            if (failed) {
                return this.ultimateFailure({
                    code: 2010,
                    message: "Preauthorization failed. Response received, but expected information was absent.",
                    detailObj: data
                });
            }

            if (typeof braintree !== 'undefined') {
                this.myGateway.depObj = braintree;
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

                    var self = this;

                    var onPaymentMethodReceived = function(obj) {
                        self.myGateway.onPaymentMethodReceived();
                    };

                    function handlePayPalLoaded(e) {
                        e.stopPropagation();
                        self.myGateway.handlePayPalLoaded();
                    }

                    function handlePayPalReady(e) {
                        $imgSelector = $(e.target).find('img');
                        $imgSelector.off('ready', handlePayPalReady);
                        self.myGateway.handlePayPalReady();
                        $imgSelector.one('load', handlePayPalLoaded)
                        .each(function() {
                          if(this.complete) {
                            $(this).load();
                            }
                        });
                        e.stopPropagation();
                    }

                    function handleDOMNodeInserted(event) {
                        if (event.target.nodeName === "A") {
                            $(document).off('DOMNodeInserted', self.myGateway.paypalButtonSelector, handleDOMNodeInserted);
                            handlePayPalReady(event);
                        }
                    }

                    $(document).on('DOMNodeInserted', this.myGateway.paypalButtonSelector + " A", handleDOMNodeInserted);

                    self.myGateway.handlePayPalFetchBegin();

                    this.myGateway.depObj.setup(clientToken, "paypal", {
                        container: paypalDivId,
                        singleUse: false,
                        onPaymentMethodReceived: onPaymentMethodReceived
                        /*function(obj) {
                            var $formElement = self.transaction.state.$formElement;

                            var $self = $formElement;

                            var disableForm = function() {
                                var $set = $self.find('input, textarea, button, select');
                                $set.prop('disabled',function(setIndex, currentVal) {
                                    $set.get(setIndex).prop('bf-prior-disable', currentVal);
                                    return true;
                                });
                            };

                            var undisableForm = function() {
                                var $set = $self.find('input, textarea, button, select');
                                $set.prop('disabled',function(setIndex, currentVal) {
                                    return $set.get(setIndex).prop('bf-prior-disable');
                                });
                            };

                            self.doSubmitDanceWhenReady(disableForm, undisableForm);
                        }*/
                    });
                    BraintreeData.setup(merchantId, formId, resolvedEnvironment);
                }
                //this.myGateway.depObj.setup(clientToken, "custom", {id: formId});
            }

            this.submitDancer.loadedCallback();
        };

        p.startAuthCapture = function(data) {
            var self = this;
            
            var deviceDataValue;
            var nonceValue;
            if (this.myGateway.usePaypal && !this.transaction.state.cardDetails) {
                // check for a device_data
                var $formElement = this.transaction.state.$formElement;
                var deviceDataSelector = $formElement.find("input[name='device_data']");
                deviceDataValue = deviceDataSelector.val();

                // check for a nonce
                var $paypalSelector = $(this.myGateway.paypalButtonSelector);
                var nonceSelector = $paypalSelector.find("input[name='payment_method_nonce']");
                
                nonceValue = nonceSelector.val();
                if (nonceValue) {
                    //this.gatewayResponseHandler(null, nonceValue);
                    self.gatewayResponseHandler.call(self, null, nonceValue, deviceDataValue);
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
                        tokenInfo[TheClass.mappingsProgrammatic[i]] = valueFromForm;
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

            // console.log(tokenInfo);

            var self = this;

            var client = new this.myGateway.depObj.api.Client({clientToken: this.clientToken});
            client.tokenizeCard(tokenInfo, function(err, nonce, cardDetailsObj) {
                self.gatewayResponseHandler.call(self, err, nonce, deviceDataValue);
            });
        };

        p.gatewayResponseHandler = function(err, nonce, deviceData) {
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

        p['do'] = function() {
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

        p['do'] = function() {
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

            // console.log(this.transaction.bfjs.state.api.url);

            var bfAPIURLParsed = this.transaction.bfjs.core.parseURL(this.transaction.bfjs.state.api.url);

            // console.log(bfAPIURLParsed);

            var self = this;

            var viewOptions = $.extend({
                width: "398px",
                height: "464px",
                border: "none"
            }, this.myGateway.sagePayFormContainerOptions);

            var $sagePayFormContainerSelector = $(this.myGateway.sagePayFormContainerSelector);

            this.myGateway.handleIFrameFetchBegin();

            var registrationRequesterID = "bf-sagePayRegistrationRequester";

            $sagePayFormContainerSelector.append('<div id="'+registrationRequesterID+'"></div>');

            // $sagePayFormContainerSelector.append('<iframe id="'+registrationRequesterID+'"></iframe>');
            // var $registrationRequester = $("#"+registrationRequesterID);

            var easyXDM = this.transaction.bfjs.imports.easyXDM;

            var socket = new easyXDM.Socket({
                remote: payload.nextURL, // the path to the provider
                onMessage:function(message, origin) {
                    console.log(message, origin);
                    // windowProxy.removeEventListener(handleIFrameResponse);
                    var originalEvent = event.originalEvent;
                    // console.log(originalEvent);
                    // console.log(bfAPIURLParsed);
                    // console.log(originalEvent.origin, bfAPIURLParsed.origin);
                    if (originalEvent.origin === bfAPIURLParsed.origin) {
                        var $registrationRequester = $("#"+registrationRequesterID);
                        $registrationRequester.remove();
                        self.gatewayResponseHandler.call(self, originalEvent.data);
                    }
                },
                container: registrationRequesterID,
                props: {
                    style: {
                        border: "1px solid red"
                    },
                    width: viewOptions.width,
                    height: viewOptions.height
                },
                lazy: false
            });

            // var $sagePayFormContainerSelector = $(this.myGateway.sagePayFormContainerSelector);

            // this.myGateway.handleIFrameFetchBegin();

            // $sagePayFormContainerSelector.append('<iframe id="'+registrationRequesterID+'" src="'+payload.nextURL+'"></iframe>');
            // var $registrationRequester = $("#"+registrationRequesterID);
            // $registrationRequester.hide();
            /*$registrationRequester.css("border", viewOptions.border);
            $registrationRequester.width(viewOptions.width);
            $registrationRequester.height(viewOptions.height);*/

            /*function handleIFrameReady() {
                $registrationRequester.off('ready', handleIFrameReady);
                self.myGateway.handleIFrameReady();
            }
            function handleIFrameLoaded(e) {
                // e.stopPropagation();
                $registrationRequester.off('load', handleIFrameLoaded);
                self.myGateway.handleIFrameLoaded();
                // $registrationRequester.show();
            }
            $registrationRequester.ready(handleIFrameReady);
            $registrationRequester.off('load', handleIFrameLoaded);
            $registrationRequester.one('load', handleIFrameLoaded);*/
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
                if (!data.token) {
                    return malformedResponse(data);
                }

                if (data.token === "null") {
                    var bfjsError = {
                        code: 5201,
                        message: "Card capture to SagePay failed; customer aborted token registration.",
                        detailObj: data
                    };
                    return self.ultimateFailure(bfjsError);
                }

                var payload = {
                    "@type": 'SagePayAuthCaptureRequest',
                    "gateway": "SagePay",
                    "cardType": data.cardType,
                    "expiryDate": data.expiryDate,
                    "last4Digits": data.last4Digits,
                    "cardToken": data.token,
                    "accountID": self.transaction.accountID
                };

                // add BF-only attributes here
                var additional = {};

                // extend cardDetails with late card details, if applicable
                var lateCardDetails = {};
                if (self.myGateway.getDeferredCardDetails) {
                    $.extend(lateCardDetails, self.myGateway.getDeferredCardDetails());
                }
                var extendedDetails = $.extend(self.transaction.state.cardDetails, lateCardDetails);
            
                for (var i in TheClass.bfBypass) {
                    var mapping = TheClass.bfBypass[i];
                    var valueFromForm;
                    valueFromForm = extendedDetails[i];
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
        function attemptLoadUsingRequire(actor) {
            // catch RequireJS-loaded dependency
            if ("function" == typeof define && define.amd) {
                if ("function" == typeof require) {
                    var paths = {};
                    paths[actor.depName] = actor.depUrlRequire;

                    // console.log(actor);

                    require.config({
                        paths: paths,
                        shim: actor.requireShim
                    });
                    require([actor.depName], function(dependency) {
                        if ("function" == typeof dependency) {
                            actor.depObj = dependency();
                        } else {
                            actor.depObj = dependency;
                        }
                        // console.log(actor.depObj);
                        // console.log(actor);
                        actor.depObj = dependency;
                        actor.loadedCallback.call(actor);
                    });
                    // don't consult window for dependency, and don't tag load it
                    return true;
                } else {
                    // define but no require?
                    // we're gonna have trouble I know it :(
                    throw new Error("No implementation of require() found to await module-loaded dependency: braintree.js");
                }
            }
            return false;
        }

        var queue = [];
        var actor;

        var braintreeActor;
        var stripeActor;
        for (var i=0; i<bfjs.lateActors.length; i++) {
            actor = bfjs.lateActors[i];
            
            var loadedCallback = actor.loadedCallback;
            
            switch (actor.depName) {
                // case 'Stripe':
                    // stripeActor = bfjs.lateActors[i];
                    // if (attemptLoadUsingRequire(stripeActor)) {
                    //     continue;
                    // }
                case 'braintree':
                    braintreeActor = bfjs.lateActors[i];
                    if(typeof window.BraintreeData === 'undefined') {
                        originalLoadedCallback = actor.loadedCallback;
                        // schedule a load of BraintreeData after Braintree is loaded, then call Braintree's loaded callback.
                        actor.loadedCallback = function() {
                            // we allow Braintree to call its own loaded callback only once BraintreeData is in.
                            var url = "https://js.braintreegateway.com/v1/braintree-data.js";
                            
                            // tag load BraintreeData
                            bfjs.loadScript(url, originalLoadedCallback, actor);
                        };

                        loadedCallback = actor.loadedCallback;

                        // catch RequireJS-loaded Braintree
                        if (attemptLoadUsingRequire(braintreeActor)) {
                            continue;
                        }
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
        // script.async = true;

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

        if (typeof value !== 'undefined') {
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

    bfjs.core.getWindowLocationHref = function(href) {
        return window.location.href;
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

    bfjs.addPayPalButton = function(selector, onPaymentMethodReceived, handlePayPalFetchBegin, handlePayPalReady, handlePayPalLoaded) {
        // supported for Braintree only
        bfjs.gatewayInstances['braintree'].usePaypal = true;
        bfjs.gatewayInstances['braintree'].paypalButtonSelector = selector;
        bfjs.gatewayInstances['braintree'].onPaymentMethodReceived = onPaymentMethodReceived || function() { return; };
        bfjs.gatewayInstances['braintree'].handlePayPalFetchBegin = handlePayPalFetchBegin || function() { };
        bfjs.gatewayInstances['braintree'].handlePayPalReady = handlePayPalReady || function() { };
        bfjs.gatewayInstances['braintree'].handlePayPalLoaded = handlePayPalLoaded || function() { };
    };

    bfjs.addSagePayForm = function(selector, options, getDeferredCardDetails, handleIFrameFetchBegin, handleIFrameReady, handleIFrameLoaded) {
        // supported for SagePay only
        bfjs.gatewayInstances['sagepay'].sagePayFormContainerSelector = selector;
        bfjs.gatewayInstances['sagepay'].sagePayFormContainerOptions = options || {};
        bfjs.gatewayInstances['sagepay'].getDeferredCardDetails = getDeferredCardDetails || function() { return {} };
        bfjs.gatewayInstances['sagepay'].handleIFrameFetchBegin = handleIFrameFetchBegin || function() { };
        bfjs.gatewayInstances['sagepay'].handleIFrameReady = handleIFrameReady || function() { };
        bfjs.gatewayInstances['sagepay'].handleIFrameLoaded = handleIFrameLoaded || function() { };
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

    bfjs.imports = {};

    /**
     * easyXDM
     * http://easyxdm.net/
     * Copyright(c) 2009-2011, Øyvind Sean Kinsey, oyvind@kinsey.no.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    (function(N,d,p,K,k,H){var b=this;var n=Math.floor(Math.random()*10000);var q=Function.prototype;var Q=/^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/;var R=/[\-\w]+\/\.\.\//;var F=/([^:])\/\//g;var I="";var o={};var M=N.easyXDM;var U="easyXDM_";var E;var y=false;var i;var h;function C(X,Z){var Y=typeof X[Z];return Y=="function"||(!!(Y=="object"&&X[Z]))||Y=="unknown"}function u(X,Y){return !!(typeof(X[Y])=="object"&&X[Y])}function r(X){return Object.prototype.toString.call(X)==="[object Array]"}function c(){var Z="Shockwave Flash",ad="application/x-shockwave-flash";if(!t(navigator.plugins)&&typeof navigator.plugins[Z]=="object"){var ab=navigator.plugins[Z].description;if(ab&&!t(navigator.mimeTypes)&&navigator.mimeTypes[ad]&&navigator.mimeTypes[ad].enabledPlugin){i=ab.match(/\d+/g)}}if(!i){var Y;try{Y=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");i=Array.prototype.slice.call(Y.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/),1);Y=null}catch(ac){}}if(!i){return false}var X=parseInt(i[0],10),aa=parseInt(i[1],10);h=X>9&&aa>0;return true}var v,x;if(C(N,"addEventListener")){v=function(Z,X,Y){Z.addEventListener(X,Y,false)};x=function(Z,X,Y){Z.removeEventListener(X,Y,false)}}else{if(C(N,"attachEvent")){v=function(X,Z,Y){X.attachEvent("on"+Z,Y)};x=function(X,Z,Y){X.detachEvent("on"+Z,Y)}}else{throw new Error("Browser not supported")}}var W=false,J=[],L;if("readyState" in d){L=d.readyState;W=L=="complete"||(~navigator.userAgent.indexOf("AppleWebKit/")&&(L=="loaded"||L=="interactive"))}else{W=!!d.body}function s(){if(W){return}W=true;for(var X=0;X<J.length;X++){J[X]()}J.length=0}if(!W){if(C(N,"addEventListener")){v(d,"DOMContentLoaded",s)}else{v(d,"readystatechange",function(){if(d.readyState=="complete"){s()}});if(d.documentElement.doScroll&&N===top){var g=function(){if(W){return}try{d.documentElement.doScroll("left")}catch(X){K(g,1);return}s()};g()}}v(N,"load",s)}function G(Y,X){if(W){Y.call(X);return}J.push(function(){Y.call(X)})}function m(){var Z=parent;if(I!==""){for(var X=0,Y=I.split(".");X<Y.length;X++){Z=Z[Y[X]]}}return Z.easyXDM}function e(X){N.easyXDM=M;I=X;if(I){U="easyXDM_"+I.replace(".","_")+"_"}return o}function z(X){return X.match(Q)[3]}function f(X){return X.match(Q)[4]||""}function j(Z){var X=Z.toLowerCase().match(Q);var aa=X[2],ab=X[3],Y=X[4]||"";if((aa=="http:"&&Y==":80")||(aa=="https:"&&Y==":443")){Y=""}return aa+"//"+ab+Y}function B(X){X=X.replace(F,"$1/");if(!X.match(/^(http||https):\/\//)){var Y=(X.substring(0,1)==="/")?"":p.pathname;if(Y.substring(Y.length-1)!=="/"){Y=Y.substring(0,Y.lastIndexOf("/")+1)}X=p.protocol+"//"+p.host+Y+X}while(R.test(X)){X=X.replace(R,"")}return X}function P(X,aa){var ac="",Z=X.indexOf("#");if(Z!==-1){ac=X.substring(Z);X=X.substring(0,Z)}var ab=[];for(var Y in aa){if(aa.hasOwnProperty(Y)){ab.push(Y+"="+H(aa[Y]))}}return X+(y?"#":(X.indexOf("?")==-1?"?":"&"))+ab.join("&")+ac}var S=(function(X){X=X.substring(1).split("&");var Z={},aa,Y=X.length;while(Y--){aa=X[Y].split("=");Z[aa[0]]=k(aa[1])}return Z}(/xdm_e=/.test(p.search)?p.search:p.hash));function t(X){return typeof X==="undefined"}var O=function(){var Y={};var Z={a:[1,2,3]},X='{"a":[1,2,3]}';if(typeof JSON!="undefined"&&typeof JSON.stringify==="function"&&JSON.stringify(Z).replace((/\s/g),"")===X){return JSON}if(Object.toJSON){if(Object.toJSON(Z).replace((/\s/g),"")===X){Y.stringify=Object.toJSON}}if(typeof String.prototype.evalJSON==="function"){Z=X.evalJSON();if(Z.a&&Z.a.length===3&&Z.a[2]===3){Y.parse=function(aa){return aa.evalJSON()}}}if(Y.stringify&&Y.parse){O=function(){return Y};return Y}return null};function T(X,Y,Z){var ab;for(var aa in Y){if(Y.hasOwnProperty(aa)){if(aa in X){ab=Y[aa];if(typeof ab==="object"){T(X[aa],ab,Z)}else{if(!Z){X[aa]=Y[aa]}}}else{X[aa]=Y[aa]}}}return X}function a(){var Y=d.body.appendChild(d.createElement("form")),X=Y.appendChild(d.createElement("input"));X.name=U+"TEST"+n;E=X!==Y.elements[X.name];d.body.removeChild(Y)}function A(Y){if(t(E)){a()}var ac;if(E){ac=d.createElement('<iframe name="'+Y.props.name+'"/>')}else{ac=d.createElement("IFRAME");ac.name=Y.props.name}ac.id=ac.name=Y.props.name;delete Y.props.name;if(typeof Y.container=="string"){Y.container=d.getElementById(Y.container)}if(!Y.container){T(ac.style,{position:"absolute",top:"-2000px",left:"0px"});Y.container=d.body}var ab=Y.props.src;Y.props.src="javascript:false";T(ac,Y.props);ac.border=ac.frameBorder=0;ac.allowTransparency=true;Y.container.appendChild(ac);if(Y.onLoad){v(ac,"load",Y.onLoad)}if(Y.usePost){var aa=Y.container.appendChild(d.createElement("form")),X;aa.target=ac.name;aa.action=ab;aa.method="POST";if(typeof(Y.usePost)==="object"){for(var Z in Y.usePost){if(Y.usePost.hasOwnProperty(Z)){if(E){X=d.createElement('<input name="'+Z+'"/>')}else{X=d.createElement("INPUT");X.name=Z}X.value=Y.usePost[Z];aa.appendChild(X)}}}aa.submit();aa.parentNode.removeChild(aa)}else{ac.src=ab}Y.props.src=ab;return ac}function V(aa,Z){if(typeof aa=="string"){aa=[aa]}var Y,X=aa.length;while(X--){Y=aa[X];Y=new RegExp(Y.substr(0,1)=="^"?Y:("^"+Y.replace(/(\*)/g,".$1").replace(/\?/g,".")+"$"));if(Y.test(Z)){return true}}return false}function l(Z){var ae=Z.protocol,Y;Z.isHost=Z.isHost||t(S.xdm_p);y=Z.hash||false;if(!Z.props){Z.props={}}if(!Z.isHost){Z.channel=S.xdm_c.replace(/["'<>\\]/g,"");Z.secret=S.xdm_s;Z.remote=S.xdm_e.replace(/["'<>\\]/g,"");ae=S.xdm_p;if(Z.acl&&!V(Z.acl,Z.remote)){throw new Error("Access denied for "+Z.remote)}}else{Z.remote=B(Z.remote);Z.channel=Z.channel||"default"+n++;Z.secret=Math.random().toString(16).substring(2);if(t(ae)){if(j(p.href)==j(Z.remote)){ae="4"}else{if(C(N,"postMessage")||C(d,"postMessage")){ae="1"}else{if(Z.swf&&C(N,"ActiveXObject")&&c()){ae="6"}else{if(navigator.product==="Gecko"&&"frameElement" in N&&navigator.userAgent.indexOf("WebKit")==-1){ae="5"}else{if(Z.remoteHelper){ae="2"}else{ae="0"}}}}}}}Z.protocol=ae;switch(ae){case"0":T(Z,{interval:100,delay:2000,useResize:true,useParent:false,usePolling:false},true);if(Z.isHost){if(!Z.local){var ac=p.protocol+"//"+p.host,X=d.body.getElementsByTagName("img"),ad;var aa=X.length;while(aa--){ad=X[aa];if(ad.src.substring(0,ac.length)===ac){Z.local=ad.src;break}}if(!Z.local){Z.local=N}}var ab={xdm_c:Z.channel,xdm_p:0};if(Z.local===N){Z.usePolling=true;Z.useParent=true;Z.local=p.protocol+"//"+p.host+p.pathname+p.search;ab.xdm_e=Z.local;ab.xdm_pa=1}else{ab.xdm_e=B(Z.local)}if(Z.container){Z.useResize=false;ab.xdm_po=1}Z.remote=P(Z.remote,ab)}else{T(Z,{channel:S.xdm_c,remote:S.xdm_e,useParent:!t(S.xdm_pa),usePolling:!t(S.xdm_po),useResize:Z.useParent?false:Z.useResize})}Y=[new o.stack.HashTransport(Z),new o.stack.ReliableBehavior({}),new o.stack.QueueBehavior({encode:true,maxLength:4000-Z.remote.length}),new o.stack.VerifyBehavior({initiate:Z.isHost})];break;case"1":Y=[new o.stack.PostMessageTransport(Z)];break;case"2":if(Z.isHost){Z.remoteHelper=B(Z.remoteHelper)}Y=[new o.stack.NameTransport(Z),new o.stack.QueueBehavior(),new o.stack.VerifyBehavior({initiate:Z.isHost})];break;case"3":Y=[new o.stack.NixTransport(Z)];break;case"4":Y=[new o.stack.SameOriginTransport(Z)];break;case"5":Y=[new o.stack.FrameElementTransport(Z)];break;case"6":if(!i){c()}Y=[new o.stack.FlashTransport(Z)];break}Y.push(new o.stack.QueueBehavior({lazy:Z.lazy,remove:true}));return Y}function D(aa){var ab,Z={incoming:function(ad,ac){this.up.incoming(ad,ac)},outgoing:function(ac,ad){this.down.outgoing(ac,ad)},callback:function(ac){this.up.callback(ac)},init:function(){this.down.init()},destroy:function(){this.down.destroy()}};for(var Y=0,X=aa.length;Y<X;Y++){ab=aa[Y];T(ab,Z,true);if(Y!==0){ab.down=aa[Y-1]}if(Y!==X-1){ab.up=aa[Y+1]}}return ab}function w(X){X.up.down=X.down;X.down.up=X.up;X.up=X.down=null}T(o,{version:"2.4.19.3",query:S,stack:{},apply:T,getJSONObject:O,whenReady:G,noConflict:e});o.DomHelper={on:v,un:x,requiresJSON:function(X){if(!u(N,"JSON")){d.write('<script type="text/javascript" src="'+X+'"><\/script>')}}};(function(){var X={};o.Fn={set:function(Y,Z){X[Y]=Z},get:function(Z,Y){if(!X.hasOwnProperty(Z)){return}var aa=X[Z];if(Y){delete X[Z]}return aa}}}());o.Socket=function(Y){var X=D(l(Y).concat([{incoming:function(ab,aa){Y.onMessage(ab,aa)},callback:function(aa){if(Y.onReady){Y.onReady(aa)}}}])),Z=j(Y.remote);this.origin=j(Y.remote);this.destroy=function(){X.destroy()};this.postMessage=function(aa){X.outgoing(aa,Z)};X.init()};o.Rpc=function(Z,Y){if(Y.local){for(var ab in Y.local){if(Y.local.hasOwnProperty(ab)){var aa=Y.local[ab];if(typeof aa==="function"){Y.local[ab]={method:aa}}}}}var X=D(l(Z).concat([new o.stack.RpcBehavior(this,Y),{callback:function(ac){if(Z.onReady){Z.onReady(ac)}}}]));this.origin=j(Z.remote);this.destroy=function(){X.destroy()};X.init()};o.stack.SameOriginTransport=function(Y){var Z,ab,aa,X;return(Z={outgoing:function(ad,ae,ac){aa(ad);if(ac){ac()}},destroy:function(){if(ab){ab.parentNode.removeChild(ab);ab=null}},onDOMReady:function(){X=j(Y.remote);if(Y.isHost){T(Y.props,{src:P(Y.remote,{xdm_e:p.protocol+"//"+p.host+p.pathname,xdm_c:Y.channel,xdm_p:4}),name:U+Y.channel+"_provider"});ab=A(Y);o.Fn.set(Y.channel,function(ac){aa=ac;K(function(){Z.up.callback(true)},0);return function(ad){Z.up.incoming(ad,X)}})}else{aa=m().Fn.get(Y.channel,true)(function(ac){Z.up.incoming(ac,X)});K(function(){Z.up.callback(true)},0)}},init:function(){G(Z.onDOMReady,Z)}})};o.stack.FlashTransport=function(aa){var ac,X,ab,ad,Y,ae;function af(ah,ag){K(function(){ac.up.incoming(ah,ad)},0)}function Z(ah){var ag=aa.swf+"?host="+aa.isHost;var aj="easyXDM_swf_"+Math.floor(Math.random()*10000);o.Fn.set("flash_loaded"+ah.replace(/[\-.]/g,"_"),function(){o.stack.FlashTransport[ah].swf=Y=ae.firstChild;var ak=o.stack.FlashTransport[ah].queue;for(var al=0;al<ak.length;al++){ak[al]()}ak.length=0});if(aa.swfContainer){ae=(typeof aa.swfContainer=="string")?d.getElementById(aa.swfContainer):aa.swfContainer}else{ae=d.createElement("div");T(ae.style,h&&aa.swfNoThrottle?{height:"20px",width:"20px",position:"fixed",right:0,top:0}:{height:"1px",width:"1px",position:"absolute",overflow:"hidden",right:0,top:0});d.body.appendChild(ae)}var ai="callback=flash_loaded"+H(ah.replace(/[\-.]/g,"_"))+"&proto="+b.location.protocol+"&domain="+H(z(b.location.href))+"&port="+H(f(b.location.href))+"&ns="+H(I);ae.innerHTML="<object height='20' width='20' type='application/x-shockwave-flash' id='"+aj+"' data='"+ag+"'><param name='allowScriptAccess' value='always'></param><param name='wmode' value='transparent'><param name='movie' value='"+ag+"'></param><param name='flashvars' value='"+ai+"'></param><embed type='application/x-shockwave-flash' FlashVars='"+ai+"' allowScriptAccess='always' wmode='transparent' src='"+ag+"' height='1' width='1'></embed></object>"}return(ac={outgoing:function(ah,ai,ag){Y.postMessage(aa.channel,ah.toString());if(ag){ag()}},destroy:function(){try{Y.destroyChannel(aa.channel)}catch(ag){}Y=null;if(X){X.parentNode.removeChild(X);X=null}},onDOMReady:function(){ad=aa.remote;o.Fn.set("flash_"+aa.channel+"_init",function(){K(function(){ac.up.callback(true)})});o.Fn.set("flash_"+aa.channel+"_onMessage",af);aa.swf=B(aa.swf);var ah=z(aa.swf);var ag=function(){o.stack.FlashTransport[ah].init=true;Y=o.stack.FlashTransport[ah].swf;Y.createChannel(aa.channel,aa.secret,j(aa.remote),aa.isHost);if(aa.isHost){if(h&&aa.swfNoThrottle){T(aa.props,{position:"fixed",right:0,top:0,height:"20px",width:"20px"})}T(aa.props,{src:P(aa.remote,{xdm_e:j(p.href),xdm_c:aa.channel,xdm_p:6,xdm_s:aa.secret}),name:U+aa.channel+"_provider"});X=A(aa)}};if(o.stack.FlashTransport[ah]&&o.stack.FlashTransport[ah].init){ag()}else{if(!o.stack.FlashTransport[ah]){o.stack.FlashTransport[ah]={queue:[ag]};Z(ah)}else{o.stack.FlashTransport[ah].queue.push(ag)}}},init:function(){G(ac.onDOMReady,ac)}})};o.stack.PostMessageTransport=function(aa){var ac,ad,Y,Z;function X(ae){if(ae.origin){return j(ae.origin)}if(ae.uri){return j(ae.uri)}if(ae.domain){return p.protocol+"//"+ae.domain}throw"Unable to retrieve the origin of the event"}function ab(af){var ae=X(af);if(ae==Z&&af.data.substring(0,aa.channel.length+1)==aa.channel+" "){ac.up.incoming(af.data.substring(aa.channel.length+1),ae)}}return(ac={outgoing:function(af,ag,ae){Y.postMessage(aa.channel+" "+af,ag||Z);if(ae){ae()}},destroy:function(){x(N,"message",ab);if(ad){Y=null;ad.parentNode.removeChild(ad);ad=null}},onDOMReady:function(){Z=j(aa.remote);if(aa.isHost){var ae=function(af){if(af.data==aa.channel+"-ready"){Y=("postMessage" in ad.contentWindow)?ad.contentWindow:ad.contentWindow.document;x(N,"message",ae);v(N,"message",ab);K(function(){ac.up.callback(true)},0)}};v(N,"message",ae);T(aa.props,{src:P(aa.remote,{xdm_e:j(p.href),xdm_c:aa.channel,xdm_p:1}),name:U+aa.channel+"_provider"});ad=A(aa)}else{v(N,"message",ab);Y=("postMessage" in N.parent)?N.parent:N.parent.document;Y.postMessage(aa.channel+"-ready",Z);K(function(){ac.up.callback(true)},0)}},init:function(){G(ac.onDOMReady,ac)}})};o.stack.FrameElementTransport=function(Y){var Z,ab,aa,X;return(Z={outgoing:function(ad,ae,ac){aa.call(this,ad);if(ac){ac()}},destroy:function(){if(ab){ab.parentNode.removeChild(ab);ab=null}},onDOMReady:function(){X=j(Y.remote);if(Y.isHost){T(Y.props,{src:P(Y.remote,{xdm_e:j(p.href),xdm_c:Y.channel,xdm_p:5}),name:U+Y.channel+"_provider"});ab=A(Y);ab.fn=function(ac){delete ab.fn;aa=ac;K(function(){Z.up.callback(true)},0);return function(ad){Z.up.incoming(ad,X)}}}else{if(d.referrer&&j(d.referrer)!=S.xdm_e){N.top.location=S.xdm_e}aa=N.frameElement.fn(function(ac){Z.up.incoming(ac,X)});Z.up.callback(true)}},init:function(){G(Z.onDOMReady,Z)}})};o.stack.NameTransport=function(ab){var ac;var ae,ai,aa,ag,ah,Y,X;function af(al){var ak=ab.remoteHelper+(ae?"#_3":"#_2")+ab.channel;ai.contentWindow.sendMessage(al,ak)}function ad(){if(ae){if(++ag===2||!ae){ac.up.callback(true)}}else{af("ready");ac.up.callback(true)}}function aj(ak){ac.up.incoming(ak,Y)}function Z(){if(ah){K(function(){ah(true)},0)}}return(ac={outgoing:function(al,am,ak){ah=ak;af(al)},destroy:function(){ai.parentNode.removeChild(ai);ai=null;if(ae){aa.parentNode.removeChild(aa);aa=null}},onDOMReady:function(){ae=ab.isHost;ag=0;Y=j(ab.remote);ab.local=B(ab.local);if(ae){o.Fn.set(ab.channel,function(al){if(ae&&al==="ready"){o.Fn.set(ab.channel,aj);ad()}});X=P(ab.remote,{xdm_e:ab.local,xdm_c:ab.channel,xdm_p:2});T(ab.props,{src:X+"#"+ab.channel,name:U+ab.channel+"_provider"});aa=A(ab)}else{ab.remoteHelper=ab.remote;o.Fn.set(ab.channel,aj)}var ak=function(){var al=ai||this;x(al,"load",ak);o.Fn.set(ab.channel+"_load",Z);(function am(){if(typeof al.contentWindow.sendMessage=="function"){ad()}else{K(am,50)}}())};ai=A({props:{src:ab.local+"#_4"+ab.channel},onLoad:ak})},init:function(){G(ac.onDOMReady,ac)}})};o.stack.HashTransport=function(Z){var ac;var ah=this,af,aa,X,ad,am,ab,al;var ag,Y;function ak(ao){if(!al){return}var an=Z.remote+"#"+(am++)+"_"+ao;((af||!ag)?al.contentWindow:al).location=an}function ae(an){ad=an;ac.up.incoming(ad.substring(ad.indexOf("_")+1),Y)}function aj(){if(!ab){return}var an=ab.location.href,ap="",ao=an.indexOf("#");if(ao!=-1){ap=an.substring(ao)}if(ap&&ap!=ad){ae(ap)}}function ai(){aa=setInterval(aj,X)}return(ac={outgoing:function(an,ao){ak(an)},destroy:function(){N.clearInterval(aa);if(af||!ag){al.parentNode.removeChild(al)}al=null},onDOMReady:function(){af=Z.isHost;X=Z.interval;ad="#"+Z.channel;am=0;ag=Z.useParent;Y=j(Z.remote);if(af){T(Z.props,{src:Z.remote,name:U+Z.channel+"_provider"});if(ag){Z.onLoad=function(){ab=N;ai();ac.up.callback(true)}}else{var ap=0,an=Z.delay/50;(function ao(){if(++ap>an){throw new Error("Unable to reference listenerwindow")}try{ab=al.contentWindow.frames[U+Z.channel+"_consumer"]}catch(aq){}if(ab){ai();ac.up.callback(true)}else{K(ao,50)}}())}al=A(Z)}else{ab=N;ai();if(ag){al=parent;ac.up.callback(true)}else{T(Z,{props:{src:Z.remote+"#"+Z.channel+new Date(),name:U+Z.channel+"_consumer"},onLoad:function(){ac.up.callback(true)}});al=A(Z)}}},init:function(){G(ac.onDOMReady,ac)}})};o.stack.ReliableBehavior=function(Y){var aa,ac;var ab=0,X=0,Z="";return(aa={incoming:function(af,ad){var ae=af.indexOf("_"),ag=af.substring(0,ae).split(",");af=af.substring(ae+1);if(ag[0]==ab){Z="";if(ac){ac(true)}}if(af.length>0){aa.down.outgoing(ag[1]+","+ab+"_"+Z,ad);if(X!=ag[1]){X=ag[1];aa.up.incoming(af,ad)}}},outgoing:function(af,ad,ae){Z=af;ac=ae;aa.down.outgoing(X+","+(++ab)+"_"+af,ad)}})};o.stack.QueueBehavior=function(Z){var ac,ad=[],ag=true,aa="",af,X=0,Y=false,ab=false;function ae(){if(Z.remove&&ad.length===0){w(ac);return}if(ag||ad.length===0||af){return}ag=true;var ah=ad.shift();ac.down.outgoing(ah.data,ah.origin,function(ai){ag=false;if(ah.callback){K(function(){ah.callback(ai)},0)}ae()})}return(ac={init:function(){if(t(Z)){Z={}}if(Z.maxLength){X=Z.maxLength;ab=true}if(Z.lazy){Y=true}else{ac.down.init()}},callback:function(ai){ag=false;var ah=ac.up;ae();ah.callback(ai)},incoming:function(ak,ai){if(ab){var aj=ak.indexOf("_"),ah=parseInt(ak.substring(0,aj),10);aa+=ak.substring(aj+1);if(ah===0){if(Z.encode){aa=k(aa)}ac.up.incoming(aa,ai);aa=""}}else{ac.up.incoming(ak,ai)}},outgoing:function(al,ai,ak){if(Z.encode){al=H(al)}var ah=[],aj;if(ab){while(al.length!==0){aj=al.substring(0,X);al=al.substring(aj.length);ah.push(aj)}while((aj=ah.shift())){ad.push({data:ah.length+"_"+aj,origin:ai,callback:ah.length===0?ak:null})}}else{ad.push({data:al,origin:ai,callback:ak})}if(Y){ac.down.init()}else{ae()}},destroy:function(){af=true;ac.down.destroy()}})};o.stack.VerifyBehavior=function(ab){var ac,aa,Y,Z=false;function X(){aa=Math.random().toString(16).substring(2);ac.down.outgoing(aa)}return(ac={incoming:function(af,ad){var ae=af.indexOf("_");if(ae===-1){if(af===aa){ac.up.callback(true)}else{if(!Y){Y=af;if(!ab.initiate){X()}ac.down.outgoing(af)}}}else{if(af.substring(0,ae)===Y){ac.up.incoming(af.substring(ae+1),ad)}}},outgoing:function(af,ad,ae){ac.down.outgoing(aa+"_"+af,ad,ae)},callback:function(ad){if(ab.initiate){X()}}})};o.stack.RpcBehavior=function(ad,Y){var aa,af=Y.serializer||O();var ae=0,ac={};function X(ag){ag.jsonrpc="2.0";aa.down.outgoing(af.stringify(ag))}function ab(ag,ai){var ah=Array.prototype.slice;return function(){var aj=arguments.length,al,ak={method:ai};if(aj>0&&typeof arguments[aj-1]==="function"){if(aj>1&&typeof arguments[aj-2]==="function"){al={success:arguments[aj-2],error:arguments[aj-1]};ak.params=ah.call(arguments,0,aj-2)}else{al={success:arguments[aj-1]};ak.params=ah.call(arguments,0,aj-1)}ac[""+(++ae)]=al;ak.id=ae}else{ak.params=ah.call(arguments,0)}if(ag.namedParams&&ak.params.length===1){ak.params=ak.params[0]}X(ak)}}function Z(an,am,ai,al){if(!ai){if(am){X({id:am,error:{code:-32601,message:"Procedure not found."}})}return}var ak,ah;if(am){ak=function(ao){ak=q;X({id:am,result:ao})};ah=function(ao,ap){ah=q;var aq={id:am,error:{code:-32099,message:ao}};if(ap){aq.error.data=ap}X(aq)}}else{ak=ah=q}if(!r(al)){al=[al]}try{var ag=ai.method.apply(ai.scope,al.concat([ak,ah]));if(!t(ag)){ak(ag)}}catch(aj){ah(aj.message)}}return(aa={incoming:function(ah,ag){var ai=af.parse(ah);if(ai.method){if(Y.handle){Y.handle(ai,X)}else{Z(ai.method,ai.id,Y.local[ai.method],ai.params)}}else{var aj=ac[ai.id];if(ai.error){if(aj.error){aj.error(ai.error)}}else{if(aj.success){aj.success(ai.result)}}delete ac[ai.id]}},init:function(){if(Y.remote){for(var ag in Y.remote){if(Y.remote.hasOwnProperty(ag)){ad[ag]=ab(Y.remote[ag],ag)}}}aa.down.init()},destroy:function(){for(var ag in Y.remote){if(Y.remote.hasOwnProperty(ag)&&ad.hasOwnProperty(ag)){delete ad[ag]}}aa.down.destroy()}})};b.easyXDM=o})(window,document,location,window.setTimeout,decodeURIComponent,encodeURIComponent);
    bfjs.imports.easyXDM = easyXDM.noConflict("bfjs.imports");

    window.BillForward = window.BillForward || bfjs;
})();
