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

            this.deferredTransactions.push({
                'do': function setupJQueryExtensions() {
                    if (bfjs.isTransportShimNecessary()) {
                        /*!
                         * jQuery-ajaxTransport-XDomainRequest - v1.0.3 - 2014-06-06
                         * https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
                         * Copyright (c) 2014 Jason Moon (@JSONMOON)
                         * Licensed MIT (/blob/master/LICENSE.txt)
                         */
                        (function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else if(typeof exports==='object'){module.exports=a(require('jquery'))}else{a(jQuery)}}(function($){if($.support.cors||!$.ajaxTransport||!window.XDomainRequest){return}var n=/^https?:\/\//i;var o=/^get|post$/i;var p=new RegExp('^'+location.protocol,'i');$.ajaxTransport('* text html xml json',function(j,k,l){if(!j.crossDomain||!j.async||!o.test(j.type)||!n.test(j.url)||!p.test(j.url)){return}var m=null;return{send:function(f,g){var h='';var i=(k.dataType||'').toLowerCase();m=new XDomainRequest();if(/^\d+$/.test(k.timeout)){m.timeout=k.timeout}m.ontimeout=function(){g(500,'timeout')};m.onload=function(){var a='Content-Length: '+m.responseText.length+'\r\nContent-Type: '+m.contentType;var b={code:200,message:'success'};var c={text:m.responseText};try{if(i==='html'||/text\/html/i.test(m.contentType)){c.html=m.responseText}else if(i==='json'||(i!=='text'&&/\/json/i.test(m.contentType))){try{c.json=$.parseJSON(m.responseText)}catch(e){b.code=500;b.message='parseerror'}}else if(i==='xml'||(i!=='text'&&/\/xml/i.test(m.contentType))){var d=new ActiveXObject('Microsoft.XMLDOM');d.async=false;try{d.loadXML(m.responseText)}catch(e){d=undefined}if(!d||!d.documentElement||d.getElementsByTagName('parsererror').length){b.code=500;b.message='parseerror';throw'Invalid XML: '+m.responseText;}c.xml=d}}catch(parseMessage){throw parseMessage;}finally{g(b.code,b.message,c,a)}};m.onprogress=function(){};m.onerror=function(){g(500,'error',{text:m.responseText})};if(k.data){h=($.type(k.data)==='string')?k.data:$.param(k.data)}m.open(j.type,j.url);m.send(h)},abort:function(){if(m){m.abort()}}}})}));
                    }
                }
            });
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
            this.useApplePay = false;
            this.applePaySettings = {};
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

    bfjs.StripeAchGateway = (function () {
        var TheClass = function () {
            // statics
            this.key = 'stripeach';
            this.depName = "StripeACH";
            this.depObj = null;
            this.requireShim = {};
        };

        var p = TheClass.prototype = new bfjs.GatewayActor();
        p.constructor = TheClass;

        TheClass.construct = (function () {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)

            function lambda(args) {
                return TheClass.apply(this, args);
            }

            lambda.prototype = TheClass.prototype;

            return function () {
                return new lambda(arguments);
            }
        })();

        return TheClass;
    })();

    bfjs.StripeAchVerifyGateway = (function () {
        var TheClass = function () {
            // statics
            this.key = 'stripeachverify';
            this.depName = "StripeACHVerify";
            this.depObj = null;
            this.requireShim = {};
        };

        var p = TheClass.prototype = new bfjs.GatewayActor();
        p.constructor = TheClass;

        TheClass.construct = (function () {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)

            function lambda(args) {
                return TheClass.apply(this, args);
            }

            lambda.prototype = TheClass.prototype;

            return function () {
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
            this.braintreeOptionsObj = {};
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

    bfjs.PayVisionGateway = (function() {
        var TheClass = function() {
            // statics
            this.key = 'payvision';
            this.payvisionFormContainerSelector = null;
            this.wpwlOptions = {};
            this.supportedCardBrands = [];
            this.getDeferredCardDetails = function() { return {} };
            this.handleFormFetchBegin = function() { return {} };
            this.handleFormReady = function() { return {} };
            this.handleFormUsable = function() { return {} };
            this.handleAfterSubmit = function() { return {} };
            this.handleCheckoutWidgetFetchBegin = function() { return {} };
            this.handleCheckoutWidgetFetchFinish = function() { return {} };
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

    bfjs.ShuttleGateway = (function () {
        var C = function () {
            this.key = "shuttle";
            this.wpwlOptions = {};
            this.supportedCardBrands = [];
            this.getDeferredCardDetails = function() { return {} };
            this.handleFormFetchBegin = function() { return {} };
            this.handleFormReady = function() { return {} };
            this.handleFormUsable = function() { return {} };
            this.handleAfterSubmit = function() { return {} };
            this.handleCheckoutWidgetFetchBegin = function() { return {} };
            this.handleCheckoutWidgetFetchFinish = function() { return {} };
        };

        var p = C.prototype = new bfjs.GatewayActor();
        p.constructor = C;

        C.construct = (function () {
            function lambda(args) {
                return TheClass.apply(this, args);
            }
            lambda.prototype = TheClass.prototype;

            return function() {
                return new lambda(arguments);
            }
        })();

        return C;
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

        var TheClass = function(bfjs, targetGateway, formElementCandidate, accountID, callback, cardDetails, options) {
            _parent.apply(this, arguments);
            this.formElementCandidate = formElementCandidate;
            this.callback = callback;
            this.accountID = accountID;
            this.targetGateway = targetGateway;
            this.bfjs = bfjs;
            this.options = options;
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
                        $(this).find('button[type=submit]').prop('disabled', true);

                        event.preventDefault();
                        event.stopPropagation();

                        newGatewayTransaction.doSubmitDanceWhenReady();
                    }

                    $formElement.off('submit', onSubmit);
                    $formElement.on('submit', onSubmit);

                    // ready to go
                    $formElement.find('button[type=submit]').prop('disabled', false);
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

        p.buildBFAjax = function(payload, endpoint, controller) {
            if(!controller) {
                controller = "tokenization/";
            }

            if(controller[controller.length - 1] != "/") {
                controller += "/";
            }

            var fullURL = this.transaction.bfjs.state.api.url + controller + endpoint;
            var auth = this.transaction.bfjs.state.api.token;

            if(this.transaction.bfjs.state.api.organizationID != null) {
                payload.organizationID = this.transaction.bfjs.state.api.organizationID;
            }

            var uriParams = auth === undefined ? "" : "?" + $.param({ access_token: auth });

            var ajaxConfig = {
                type: "POST",
                url: fullURL + uriParams,
                data: JSON.stringify(payload),
                contentType: 'application/json',
                crossDomain: true,
                async: true
            };

            if (auth === undefined) { // assume session is used
                ajaxConfig["xhrFields"] = { withCredentials: true };
            }

            return ajaxConfig;
        };

        p.checkIfTransportShimNecessary = function() {
            // enforce that transport contacts BF using the a protocol matching that with which the page was loaded

            var sameSchemeRegEx = new RegExp('^(\/\/|' + location.protocol + ')', 'i');
            /*
             - Behavior: For IE8+, we detect the documentMode value provided by Microsoft.
             - Behavior: For <IE8, we inject conditional comments until we detect a match.
             - Results: In IE, the version is returned. In other browsers, false is returned.
             - Tip: To check for a range of IE versions, use if (!IE || IE < MAX_VERSION)...
            */

            var IE = (function() {
                if (document.documentMode) {
                    return document.documentMode;
                } else {
                    for (var i = 7; i > 0; i--) {
                        var div = document.createElement("div");

                        div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

                        if (div.getElementsByTagName("span").length) {
                            return i;
                        }
                    }
                }

                return undefined;
            })();
        };

        p.doPreAuth = function(payload) {
            var endpoint = "pre-auth";

            var ajaxObj = this.buildBFAjax(payload, endpoint);

            var self = this;

            if (!bfjs.isProtocolSupported(ajaxObj.url)) {
                this.ultimateFailure({
                    code: 1101,
                    message: "Failed to connect to BillForward; protocol not supported by browser",
                    detailObj: {
                        'explanation': "We cannot do cross-protocol (e.g. HTTP to HTTPS) cross-domain requests in Internet Explorer 8 & 9. Please ensure that your page is available via the same protocol with which you connect to BillForward (i.e. HTTPS), or ensure that the user uses a newer browser (i.e. IE10 or better)"
                    }
                });
                return;
            }

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

            if (!bfjs.isProtocolSupported(ajaxObj.url)) {
                this.ultimateFailure({
                    code: 1101,
                    message: "Failed to connect to BillForward; protocol not supported by browser",
                    detailObj: {
                        'explanation': "We cannot do cross-protocol (e.g. HTTP to HTTPS) cross-domain requests in Internet Explorer 8 & 9. Please ensure that your page is available via the same protocol with which you connect to BillForward (i.e. HTTPS), or ensure that the user uses a newer browser (i.e. IE10 or better)"
                    }
                });
                return;
            }

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
                1101 ----- Protocol not supported by browser
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
                33xx - User input invalid card
              * 3300 --- (Generic)
                331x --- Invalid Expiry
                3310 ----- (Generic)
              * 3311 ----- Invalid expiry year
              * 3312 ----- Invalid expiry month
                332x --- Invalid Security Code (CVC)
              * 3320 ----- (Generic)
                34xx - Invalid request
              * 3400 --- (Generic)

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
                52xx - Token registration aborted
                5200 --- (Generic)
              * 5201 --- Aborted by customer

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
                case  501:
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
                                break;
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
                                error.message = portions[1];
                                error.detailObj = {
                                    'message': json.errorMessage
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

            // TODO: should move this server side
            if(phase && phase == "other") {
                error.code = 4000;
                error.message = jqXHR.responseJSON ? jqXHR.responseJSON.errorMessage : json.errorMessage;
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
            if ('undefined' !== typeof this.beforeUltimateSuccess) {
                this.beforeUltimateSuccess();
            }
            this.transaction.callback(paymentMethod, false);
        };

        p.ultimateFailure = function(reason) {
            //console.error(reason);
            /*if ('undefined' !== typeof this.undisableForm) {
                this.undisableForm();
                this.undisableForm = null;
                this.submitDanceBegun = false;
            }*/
            if ('undefined' !== typeof this.beforeUltimateFailure) {
                this.beforeUltimateFailure();
            }
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

    bfjs.ShuttleTransaction = (function() {
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
            'exp-date': 'exp_date',
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
            'use-as-default-payment-method':'defaultPaymentMethod',
            'email-tokenization-id': 'emailTokenizationID'
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

        p.doPageLoadDanceWhenReady = function () {
            this.submitDancer.loadedCallback();
        };

        p.oncePreAuthed = function() { };

        p.startAuthCapture = function(data) {
            var tokenInfo = {};
            var signatureBody = Object.assign({}, this.transaction.options);
            delete signatureBody["host"];
            delete signatureBody["nonce"];

            var payload = {
                "@type": "ShuttlePreAuthRequest",
                "gateway": "Shuttle",
                "signatureBody": JSON.stringify(signatureBody)
            }
            if(this.transaction.bfjs.state.api.organizationID != null) {
                payload.organizationID = this.transaction.bfjs.state.api.organizationID;
            }

            var ajaxObj = this.buildBFAjax(payload, "pre-auth");

            if (!bfjs.isProtocolSupported(ajaxObj.url)) {
                this.ultimateFailure({
                    code: 1101,
                    message: "Failed to connect to BillForward; protocol not supported by browser",
                    detailObj: {
                        'explanation': "We cannot do cross-protocol (e.g. HTTP to HTTPS) cross-domain requests in Internet Explorer 8 & 9. Please ensure that your page is available via the same protocol with which you connect to BillForward (i.e. HTTPS), or ensure that the user uses a newer browser (i.e. IE10 or better)"
                    }
                });
                return;
            }

            $.ajax(ajaxObj)
              .success(function(data) {
                  var signature = data.signature;

                  Shuttle.selectToken(this.transaction.options, signature);
              })
              .fail(function() {
                  self.preAuthFailHandler.apply(self, arguments);
              });

            if ('undefined' === typeof this.transaction.submitTokenToBF) {
                var self = this;
                Stripe.card.createToken(tokenInfo, function() {
                    self.gatewayResponseHandler.apply(self, arguments);
                });
            } else {
                // don't bother creating token; we have token already
                this.transaction.submitTokenToBF();
            }
        };

        function transformStripeJsErrorToBfjsError(stripeResponse) {
            var bfjsError = {
                code: 3000,
                message: "Card capture failed.",
                detailObj: stripeResponse
            };

            // Stripe's error messages are actually very nice
            // so let's use those
            // also note that multiple Stripe errors (with differing messages) can share the same code
            // so again: Stripe's message text is required for the full story.
            var stripeError = stripeResponse.error;
            switch(stripeError.type) {
                case "card_error":
                    switch (stripeError.code) {
                        case "invalid_expiry_year":
                            bfjsError.code = 3311;
                            // bfjsError.message = "Card's expiry year is invalid.";
                            bfjsError.message = stripeError.message;
                            break;
                        case "invalid_expiry_month":
                            bfjsError.code = 3312;
                            // bfjsError.message = "Card's expiry month is invalid.";
                            bfjsError.message = stripeError.message;
                            break;
                        case "invalid_cvc":
                            bfjsError.code = 3320;
                            // bfjsError.message = "Card's Security code (CVC) is invalid.";
                            bfjsError.message = stripeError.message;
                            break;
                        case "invalid_request_error":
                            bfjsError.code = 3400;
                            bfjsError.message = stripeError.message;
                            break;
                        default:
                            bfjsError.code = 3300;
                            bfjsError.message = stripeError.message;
                    }
                    break;
                default:
                    // we've no knowledge of any other type of error than card_error
                    // however, their message will likely still be better than our generic apology.
                    bfjsError.message = stripeError.message;
            }

            return bfjsError;
        }

        p.gatewayResponseHandler = function(status, response) {
            if (response.error) {
                var bfjsError = transformStripeJsErrorToBfjsError(response)

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
                    "accountID": this.transaction.accountID,
                    'email-tokenization-id': this.transaction.emailTokenizationID
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

        p.resetApplePay = function(outcome) {
            if (this.transaction.responsibleForClosingApplePay
              && this.transaction.closeApplePayDialog) {
                try {
                    this.transaction.closeApplePayDialog(ApplePaySession[outcome]);
                } catch(err) {
                    console.log(err);
                }
                this.transaction.closeApplePayDialog = undefined;
            }
            this.transaction.applePayPaymentAuthorized = false;
            this.transaction.submittingApplePayTokenToBF = false;
            this.transaction.submitTokenToBF = undefined;
        };

        p.beforeUltimateSuccess = function() {
            if (this.myGateway.useApplePay) {
                this.resetApplePay('STATUS_SUCCESS');
            }
        };

        p.beforeUltimateFailure = function() {
            if (this.myGateway.useApplePay) {
                this.resetApplePay('STATUS_FAILURE');
            }
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
            'use-as-default-payment-method':'defaultPaymentMethod',
            'email-tokenization-id': 'emailTokenizationID'
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

        p.oncePreAuthed = function() {
            var data = this.preAuthResponsePayload;
            var stripePublishableKey;
            var stripeAccountID;
            try {
                stripePublishableKey = data.results[0].publicKey;
                if (!stripePublishableKey) {
                    throw new Error("No public key found in pre-auth response.");
                }
                stripeAccountID = data.results[0].stripeAccountID;
                if (this.myGateway.useApplePay && !stripeAccountID) {
                    throw new Error("No Stripe Account ID key found in pre-auth response. This is required for Apple Pay.");
                }
            } catch (e){
                return this.ultimateFailure({
                    code: 2010,
                    message: "Preauthorization failed. Response received, but expected information was absent.",
                    detailObj: {
                        error: e,
                        apiResponse: data
                    }
                });
            }

            Stripe.setPublishableKey(stripePublishableKey);

            var self = this;
            if (this.myGateway.useApplePay) {
                this.transaction.responsibleForClosingApplePay =
                'undefined' === typeof self.myGateway.applePaySettings.onPaymentAuthorized;

                function beginApplePay() {
                    // user currently needs to invoke .begin()
                    var session = Stripe.applePay.buildSession(
                        self.myGateway.applePaySettings.paymentRequest,
                        function(result, completion) {
                            function submitTokenToBF() {
                                if (!self.transaction.submittingApplePayTokenToBF) {
                                    self.transaction.submittingApplePayTokenToBF = true;
                                    if (!self.transaction.state.cardDetails) {
                                        $(self.transaction.formElementCandidate).find('button[type=submit]').prop('disabled', true);
                                    }
                                    self.gatewayResponseHandler(200, result.token);
                                }
                            }
                            self.transaction.submittingApplePayTokenToBF = false;
                            self.transaction.applePayPaymentAuthorized = true;
                            self.transaction.closeApplePayDialog = completion;
                            self.transaction.submitTokenToBF = submitTokenToBF;
                            if (self.transaction.responsibleForClosingApplePay) {
                                submitTokenToBF();
                            } else {
                                if (!self.transaction.state.cardDetails) {
                                    $(self.transaction.formElementCandidate).find('button[type=submit]').prop('disabled', false);
                                }
                                self.myGateway.applePaySettings.onPaymentAuthorized(
                                    completion,
                                    submitTokenToBF,
                                    result
                                    );
                            }
                        }, function(error) {
                            self.gatewayResponseHandler(402, {
                                error: error
                            });
                        });

                    var forwardingSession = new Object();
                    forwardingSession.prototype = session;

                    // monkey-patch session.begin() to also disable the manual card capture form
                    forwardingSession.begin = function() {
                        if (self.transaction.responsibleForClosingApplePay) {
                            if (!self.transaction.state.cardDetails) {
                                $(self.transaction.formElementCandidate).find('button[type=submit]').prop('disabled', true);
                            }
                        }
                        self.myGateway.applePaySettings.disableApplePayButton();
                        return this.prototype.begin.apply(this.prototype, arguments);
                    };

                    // monkey-patch session.oncancel to also re-enable the manual card capture form
                    Object.defineProperty(forwardingSession, 'oncancel', {
                        set: function(value) {
                            var proto = this.prototype;
                            this.prototype.oncancel = function() {
                                if (self.transaction.responsibleForClosingApplePay) {
                                    if (!self.transaction.state.cardDetails) {
                                        $(self.transaction.formElementCandidate).find('button[type=submit]').prop('disabled', false);
                                    }
                                }
                                self.myGateway.applePaySettings.enableApplePayButton();
                                return value.apply(proto, arguments);
                            }
                        }
                    });
                    return forwardingSession;
                }

                Stripe.applePay.stripeAccount = stripeAccountID;
                this.myGateway.applePaySettings.onApplePayBegunCheckingAvailability();
                Stripe.applePay.checkAvailability(function(available) {
                    if (available) {
                        self.myGateway.applePaySettings.enableApplePayButton();
                    }
                    self.myGateway.applePaySettings.onApplePayAvailability(available, beginApplePay);
                });
            }

            this.submitDancer.loadedCallback();
        };

        p.startAuthCapture = function(data) {
            var tokenInfo = {};

            // if someone submits the card form: disable Apple Pay flow whilst we are pursue the general flow.
            if (this.myGateway.useApplePay) {
                this.myGateway.applePaySettings.disableApplePayButton();
            }

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

            if ('undefined' === typeof this.transaction.submitTokenToBF) {
                var self = this;
                Stripe.card.createToken(tokenInfo, function() {
                    self.gatewayResponseHandler.apply(self, arguments);
                });
            } else {
                // don't bother creating token; we have token already
                this.transaction.submitTokenToBF();
            }
        };

        function transformStripeJsErrorToBfjsError(stripeResponse) {
            var bfjsError = {
                code: 3000,
                message: "Card capture failed.",
                detailObj: stripeResponse
            };

            // Stripe's error messages are actually very nice
            // so let's use those
            // also note that multiple Stripe errors (with differing messages) can share the same code
            // so again: Stripe's message text is required for the full story.
            var stripeError = stripeResponse.error;
            switch(stripeError.type) {
                case "card_error":
                switch (stripeError.code) {
                    case "invalid_expiry_year":
                    bfjsError.code = 3311;
                    // bfjsError.message = "Card's expiry year is invalid.";
                    bfjsError.message = stripeError.message;
                    break;
                    case "invalid_expiry_month":
                    bfjsError.code = 3312;
                    // bfjsError.message = "Card's expiry month is invalid.";
                    bfjsError.message = stripeError.message;
                    break;
                    case "invalid_cvc":
                    bfjsError.code = 3320;
                    // bfjsError.message = "Card's Security code (CVC) is invalid.";
                    bfjsError.message = stripeError.message;
                    break;
                    case "invalid_request_error":
                    bfjsError.code = 3400;
                    bfjsError.message = stripeError.message;
                    break;
                    default:
                    bfjsError.code = 3300;
                    bfjsError.message = stripeError.message;
                }
                break;
                default:
                // we've no knowledge of any other type of error than card_error
                // however, their message will likely still be better than our generic apology.
                bfjsError.message = stripeError.message;
            }

            return bfjsError;
        }

        p.gatewayResponseHandler = function(status, response) {
            if (response.error) {
                var bfjsError = transformStripeJsErrorToBfjsError(response)

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
                    "accountID": this.transaction.accountID,
                    'email-tokenization-id': this.transaction.emailTokenizationID
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

        p.resetApplePay = function(outcome) {
            if (this.transaction.responsibleForClosingApplePay
                && this.transaction.closeApplePayDialog) {
                try {
                    this.transaction.closeApplePayDialog(ApplePaySession[outcome]);
                } catch(err) {
                    console.log(err);
                }
                this.transaction.closeApplePayDialog = undefined;
            }
            this.transaction.applePayPaymentAuthorized = false;
            this.transaction.submittingApplePayTokenToBF = false;
            this.transaction.submitTokenToBF = undefined;
        };

        p.beforeUltimateSuccess = function() {
            if (this.myGateway.useApplePay) {
                this.resetApplePay('STATUS_SUCCESS');
            }
        };

        p.beforeUltimateFailure = function() {
            if (this.myGateway.useApplePay) {
                this.resetApplePay('STATUS_FAILURE');
            }
        };

        return TheClass;
    })();


    bfjs.StripeAchTransaction = (function () {
        var _parent = bfjs.GatewayTransaction;

        var TheClass = function () {
            _parent.apply(this, arguments);
        };

        var p = TheClass.prototype = new _parent();
        p.constructor = TheClass;

        TheClass.construct = (function () {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)

            function lambda(args) {
                return TheClass.apply(this, args);
            }

            lambda.prototype = TheClass.prototype;

            return function () {
                return new lambda(arguments);
            }
        })();

        p['do'] = function() {
            // DO NOTHING
        };

        p.doSubmitDanceWhenReady = function () {
            var self = this;

            var payload;

            if (self.transaction.formElementCandidate) {
                var $form = $(self.transaction.formElementCandidate);

                var isDefaultFormValue = bfjs.core.getFormValue("use-as-default-payment-method", $form);
                var isDefaultPayment = typeof isDefaultFormValue === "string" ? isDefaultFormValue !== "false" : !!isDefaultFormValue;

                payload = {
                    accountID: bfjs.core.getFormValue("account-id", $form),
                    routingNumber: bfjs.core.getFormValue("routing-number", $form),
                    accountNumber: bfjs.core.getFormValue("account-number", $form),
                    stripeCustomerID: bfjs.core.getFormValue("stripe-customer-id", $form),
                    holderName: bfjs.core.getFormValue("holder-name", $form),
                    bankAccountName: bfjs.core.getFormValue("bank-account-name", $form),
                    accountHolderType: bfjs.core.getFormValue("account-holder-type", $form),
                    emailTokenizationID: bfjs.core.getFormValue("email-tokenization-id", $form),
                    defaultPaymentMethod: isDefaultPayment
                }
            } else {
                var details = $.extend({}, self.transaction.state.cardDetails);

                var dictionary = {
                    "account-id": "accountID",
                    "routing-number": "routingNumber",
                    "account-number": "accountNumber",
                    "stripe-customer-id": "stripeCustomerID",
                    "holder-name": "holderName",
                    "bank-account-name": "bankAccountName",
                    "account-holder-type": "accountHolderType",
                    "use-as-default-payment-method": "defaultPaymentMethod",
                    'email-tokenization-id': 'emailTokenizationID'
                };

                payload = {};
                for (var key in details) {
                    if (details.hasOwnProperty(key)) {
                        var translatedKey = dictionary[key] ? dictionary[key] : key;
                        payload[translatedKey] = details[key];
                    }
                }
            }

            if (!payload.accountID) {
                payload.accountID = self.transaction.accountID;
            }

            $.ajax(self.buildBFAjax(payload, "ach"))
                .done(function (resp, msg, err) {
                    self.transaction.callback(
                        resp.results[0],
                        null
                    );
                })
                .fail(function (resp, msg, err) {
                    self.transaction.callback(
                        resp.responseJSON,
                        self.jqXHRErrorToBFJSError(resp, msg, err, "other")
                    );
                })
                .always(function () {
                    if (self.transaction.formElementCandidate) {
                        var $form = $(self.transaction.formElementCandidate);
                        $form.find("button[type=submit]").prop("disabled", false);
                    }
                });
        };

        return TheClass;
    })();

    bfjs.StripeAchVerifyTransaction = (function () {
        var _parent = bfjs.GatewayTransaction;

        var TheClass = function () {
            _parent.apply(this, arguments);
        };

        var p = TheClass.prototype = new _parent();
        p.constructor = TheClass;

        TheClass.construct = (function () {
            // factory pattern for invoking own constructor with arguments
            // basically: return new this(arguments)

            function lambda(args) {
                return TheClass.apply(this, args);
            }

            lambda.prototype = TheClass.prototype;

            return function () {
                return new lambda(arguments);
            }
        })();

        p['do'] = function() {
            // DO NOTHING
        };

        p.doSubmitDanceWhenReady = function () {
            var self = this;

            var payload = null;
            var paymentMethodID = null;
            var $form = null;

            if (self.transaction.formElementCandidate) {
                $form = $(self.transaction.formElementCandidate);

                payload = {
                    amounts: [
                        bfjs.core.getFormValue("amount1", $form),
                        bfjs.core.getFormValue("amount2", $form)
                    ]
                };

                paymentMethodID = bfjs.core.getFormValue("payment-method-id", $form);
            } else {
                var details = $.extend({}, self.transaction.state.cardDetails);

                var dictionary = {
                    "payment-method-id": "paymentMethodID"
                };

                payload = {};
                for (var key in details) {
                    if (details.hasOwnProperty(key)) {
                        var translatedKey = dictionary[key] ? dictionary[key] : key;
                        payload[translatedKey] = details[key];
                    }
                }

                if (!payload.amounts) {
                    payload.amounts = [
                        details.amount1,
                        details.amount2
                    ];
                }

                paymentMethodID = payload.paymentMethodID;
            }

            if (!paymentMethodID) {
                throw "Field 'paymentMethodID' cannot be null";
            }

            $.ajax(self.buildBFAjax(payload, paymentMethodID + "/verify/micro-deposits", "payment-methods"))
                .done(function (resp, msg, err) {
                    self.transaction.callback(
                        resp.results[0],
                        null
                    );
                })
                .fail(function (resp, msg, err) {
                    self.transaction.callback(
                        resp.responseJSON,
                        self.jqXHRErrorToBFJSError(resp, msg, err, "other")
                    );
                })
                .always(function () {
                    if ($form) {
                        $form.find("button[type=submit]").prop("disabled", false);
                    }
                });
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

                    var onPaymentMethodReceived = function() {
                        self.myGateway.onPaymentMethodReceived.apply(self.myGateway.onPaymentMethodReceived, arguments);
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

                    var nominalBraintreeInputs = {
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
                    };

                    var qualifiedBraintreeInputs = $.extend({}, self.myGateway.braintreeOptionsObj, nominalBraintreeInputs);

                    this.myGateway.depObj.setup(clientToken, "paypal", qualifiedBraintreeInputs);
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

            var registrationRequesterID = "bf-sagePayRegistrationRequester";

            function handleIFrameResponse(e) {
                var originalEvent = e.originalEvent;
                // console.log(originalEvent);
                // console.log(bfAPIURLParsed);
                // console.log(originalEvent.origin, bfAPIURLParsed.origin);
                if (originalEvent.origin === bfAPIURLParsed.origin) {
                    var $registrationRequester = $("#"+registrationRequesterID);
                    $registrationRequester.remove();
                    self.gatewayResponseHandler.call(self, originalEvent.data);
                }
              };
            $(window).off('message', handleIFrameResponse);
            $(window).one('message', handleIFrameResponse);

            var $sagePayFormContainerSelector = $(this.myGateway.sagePayFormContainerSelector);

            var viewOptions = $.extend({
                width: "450px",
                height: "450px",
                border: "none"
            }, this.myGateway.sagePayFormContainerOptions);

            this.myGateway.handleIFrameFetchBegin();

            $sagePayFormContainerSelector.append('<iframe id="'+registrationRequesterID+'" src="'+payload.nextURL+'"></iframe>');
            var $registrationRequester = $("#"+registrationRequesterID);
            // $registrationRequester.hide();
            $registrationRequester.css("border", viewOptions.border);
            $registrationRequester.width(viewOptions.width);
            $registrationRequester.height(viewOptions.height);

            function handleIFrameReady() {
                $registrationRequester.off('ready', handleIFrameReady);
                self.myGateway.handleIFrameReady();
            }
            function handleIFrameLoaded(e) {
                e.stopPropagation();
                $registrationRequester.off('load', handleIFrameLoaded);
                self.myGateway.handleIFrameLoaded();
                // $registrationRequester.show();
            }
            $registrationRequester.ready(handleIFrameReady);
            $registrationRequester.off('load', handleIFrameLoaded);
            $registrationRequester.one('load', handleIFrameLoaded);
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

    bfjs.PayVisionTransaction = (function() {
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
            // this.VPSProtocol = "3.00";
            var payload = {
                "@type": "PayVisionPreAuthRequest",
                "gateway": "Payvision",
                // "currency": "GBP",
                // "VPSProtocol": this.VPSProtocol,
                // "formProfile": "LOW",
                // "billForwardURL": this.transaction.bfjs.state.api.url,
                // "billForwardPublicToken": this.transaction.bfjs.state.api.token
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

                if (!payload.checkoutID
                    || !payload.redirectEndpoint
                    || !payload.oppwaDomain
                    || !payload.oppwaPaymentWidgetsVersion
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

            // var bfAPIURLParsed = this.transaction.bfjs.core.parseURL(this.transaction.bfjs.state.api.url);

            // // console.log(bfAPIURLParsed);

            var self = this;

            var bfAPIURLParsed = this.transaction.bfjs.core.parseURL(this.transaction.bfjs.state.api.url);

            var payvisionFormID = "bf-payVisionForm";
            // var payvisionFormGrandparentID = "bf-payVisionFormGrandparent";
            var payvisionFormParentID = "bf-payVisionFormParent";
            var payvisionIframeID = "bf-payVisionIframe";

            function handleIFrameResponse(e) {
                var originalEvent = e.originalEvent;
                // console.log(originalEvent);
                // console.log(bfAPIURLParsed);
                // console.log(originalEvent.origin, bfAPIURLParsed.origin);
                if (originalEvent.origin === bfAPIURLParsed.origin) {
                    $(window).off('message', handleIFrameResponse);
                    var $payvisionIframe = $("#"+payvisionIframeID);
                    $payvisionIframe.remove();
                    self.gatewayResponseHandler.call(self, originalEvent.data);
                }
              };
            $(window).off('message', handleIFrameResponse);
            $(window).on('message', handleIFrameResponse);

            // function handleIFrameResponse(e) {
            //     var originalEvent = e.originalEvent;
            //     // console.log(originalEvent);
            //     // console.log(bfAPIURLParsed);
            //     // console.log(originalEvent.origin, bfAPIURLParsed.origin);
            //     if (originalEvent.origin === bfAPIURLParsed.origin) {
            //         var $payvisionIframe = $("#"+payvisionIframeID);
            //         $payvisionIframe.remove();
            //         self.gatewayResponseHandler.call(self, originalEvent.data);
            //     }
            //   };
            // $(window).off('message', handleIFrameResponse);
            // $(window).one('message', handleIFrameResponse);

            // var $payvisionFormContainerSelector = $(this.myGateway.payvisionFormContainerSelector);

            // var viewOptions = $.extend({
            //     width: "450px",
            //     height: "450px",
            //     border: "none"
            // }, this.myGateway.sagePayFormContainerOptions);

            var configuredPreferences = this.myGateway;

            function onAfterSubmit() {
                $("#"+payvisionFormParentID).remove();
                return configuredPreferences.handleAfterSubmit.apply(this, arguments);
            }

            var iframeCommsReady = false;

            function onReadyIframeCommunication() {
                if (!iframeCommsReady) {
                    iframeCommsReady = true;
                    return configuredPreferences.handleFormUsable.apply(this, arguments);
                }
            }

            function handleFormReady() {
                return configuredPreferences.handleFormReady.apply(this, arguments);
            }

            (function($, bespokeOptions) {
                this.wpwlOptions = $.extend(true, {
                    paymentTarget: payvisionIframeID,
                    shopperResultTarget: payvisionIframeID,
                    style: "plain",
                    brandDetection: true,
                    onAfterSubmit: onAfterSubmit,
                    onReady: handleFormReady,
                    onReadyIframeCommunication: onReadyIframeCommunication
                }, bespokeOptions);
            }).call(window, $, this.myGateway.wpwlOptions);

            // function nukeForm(formParentID, childToRemove) {
            //     var element = document.getElementById(formParentID);
            //     element.parentNode.removeChild(element);
            // }

            var formContainer;

            // function wpwlOptionsBuilder(payvisionIframeID, nukeForm, formParentID, childToRemove) {
            //     return {
            //         paymentTarget: payvisionIframeID,
            //         shopperResultTarget: payvisionIframeID,
            //         brandDetection: true,
            //         style: "plain",
            //         onAfterSubmit: nukeForm.bind(null, formParentID, childToRemove)
            //     };
            // };
            // var serialize = function(thing) {
            //     return JSON.stringify(thing, function(key, value) {
            //       if ('function' === typeof value) {
            //         return String(value); // implicitly `toString` it
            //       }
            //       return value;
            //     }, "\t");
            // };
            //https://acapture.docs.oppwa.com/reference/parameters#testing

            formContainer = $('<div>')
                    .css('display', "inline-block")
                    .attr('id', payvisionFormParentID)
                    // .appendTo($('<div>')
                    //     .css('display', "inline-block")
                    //     .attr('id', payvisionFormGrandparentID)
                        .appendTo(this.myGateway.payvisionFormContainerSelector);

            // $('<script>')
            //     .attr('type', 'text/javascript')
            //     .text('var wpwlOptions = ('+wpwlOptionsBuilder+')("'+payvisionIframeID+'", '+nukeForm+', "'+payvisionFormGrandparentID+'", "'+payvisionFormParentID+'");')
            //     .appendTo(this.myGateway.payvisionFormContainerSelector);

            var controller = "tokenization/";
            var endpoint = payload.redirectEndpoint;
            // var auth = encodeURIComponent("?access_token="+this.transaction.bfjs.state.api.token);
            var nextURL = this.transaction.bfjs.state.api.url + controller + endpoint;

            $('<iframe>')
                .attr('id', payvisionIframeID)
                .attr('name', payvisionIframeID)
                .attr('src', "about:blank")
                .attr('frameborder', "0")
                .css('display', "none")
                .appendTo(this.myGateway.payvisionFormContainerSelector);

            var cardBrands = this.myGateway.supportedCardBrands.join(" ");

            // var $payvisionIframe = $("#"+payvisionIframeID);
            $('<form>')
                .attr('id', payvisionFormID)
                .addClass('paymentWidgets')
                .attr('action', nextURL)
                .attr('target', payvisionIframeID)
                .appendTo(
                    formContainer
                    )
                    .text(cardBrands)
                    .css('display', "none");

            // $payvisionFormContainerSelector.append('<form id="'+payvisionFormID+'" class="paymentWidgets" action="'+nextURL+'" target="'+payvisionIframeID+'">'+cardBrands+'</form>');
            // var $payvisionForm = $("#"+payvisionFormID);

            // // $payvisionIframe.hide();
            // $payvisionIframe.css("border", viewOptions.border);
            // $payvisionIframe.width(viewOptions.width);
            // $payvisionIframe.height(viewOptions.height);

            // function handleIFrameReady() {
            //     $payvisionIframe.off('ready', handleIFrameReady);
            //     self.myGateway.handleIFrameReady();
            // }
            // function handleIFrameLoaded(e) {
            //     e.stopPropagation();
            //     $payvisionIframe.off('load', handleIFrameLoaded);
            //     self.myGateway.handleIFrameLoaded();
            //     // $payvisionIframe.show();
            // }
            // $payvisionIframe.ready(handleIFrameReady);
            // $payvisionIframe.off('load', handleIFrameLoaded);
            // $payvisionIframe.one('load', handleIFrameLoaded);

            // var checkoutID = payload.checkoutID;

            var domain = payload.oppwaDomain;
            var version = payload.oppwaPaymentWidgetsVersion;
            var endpoint = "paymentWidgets.js?checkoutId="+payload.checkoutID;

            var payvisionUrl = [domain, version, endpoint].join("/");

            //<script src="https://test.oppwa.com/v1/paymentWidgets.js?checkoutId={checkoutId}"></script>

            var payVisionActor = (function() {
                var TheClass = function() {
                    // statics
                    this.key = 'stripe';
                    this.depUrl = payvisionUrl;
                    this.depName = "Payvision checkout"+payload.checkoutID;
                    this.depObj = null;
                    this.loadMe = true;
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
            })().construct();

            var payvisionLoadedCallback = (function payvisionLoadedCallback() {
                // console.log(arguments);
                this.myGateway.handleCheckoutWidgetFetchFinish();
                this.myGateway.handleFormFetchBegin();
            }).bind(this);

            this.myGateway.handleCheckoutWidgetFetchBegin();

            this.transaction.bfjs.loadScript(payvisionUrl, payvisionLoadedCallback, payVisionActor);
        };

        p.gatewayResponseHandler = function(data) {
            var self = this;

            var malformedResponse = function(data) {
                var bfjsError = {
                    code: 5100,
                    message: "Card capture to PayVision failed; malformed response.",
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
                    message: "Card capture to PayVision failed; malformed response (expected JSON-encoded).",
                    detailObj: data
                };
                return self.ultimateFailure(bfjsError);
            }

            var successHandler = function(data) {
                if (!data.id
                    || !data.resourcePath) {
                    return malformedResponse(data);
                }

                if (data.token === "null") {
                    var bfjsError = {
                        code: 5201,
                        message: "Card capture to PayVision failed; customer aborted token registration.",
                        detailObj: data
                    };
                    return self.ultimateFailure(bfjsError);
                }

                var payload = {
                    "@type": 'PayVisionAuthCaptureRequest',
                    "gateway": "Payvision",
                    "registrationID": data.id,
                    "registrationResourcePath": data.resourcePath,
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
                    message: "Card capture to PayVision failed; card rejected. Reason: '"+reason+"'",
                    detailObj: data
                };
                return self.ultimateFailure(bfjsError);
            };

            var errorHandler = function(data) {
                var bfjsError = {
                    code: 5020,
                    message: "Card capture to PayVision failed; error occurred in BillForward server during token verification.",
                    detailObj: data
                };
                return self.ultimateFailure(bfjsError);
            };

            return successHandler(parsed);

            /*switch(parsed.status) {
                case 'OK':
                    return successHandler(parsed);
                case 'INVALID':
                    return invalidHandler(parsed);
                case 'ERROR':
                    return errorHandler(parsed);
                default:
                    return malformedResponse(parsed);
            }*/
        };

        return TheClass;
    })();

    // core is mainly to check if jquery is loaded
    bfjs.core = bfjs.CoreActor.construct();

    bfjs.gatewayInstances = {
        'stripe': bfjs.StripeGateway.construct(),
        'stripeach': bfjs.StripeAchGateway.construct(),
        'stripeachverify': bfjs.StripeAchVerifyGateway.construct(),
        'braintree': bfjs.BraintreeGateway.construct(),
        'generic': bfjs.SpreedlyGateway.construct(),
        'sagepay': bfjs.SagePayGateway.construct(),
        'payvision': bfjs.PayVisionGateway.construct()
    };

    bfjs.gatewayTransactionClasses = {
        'stripe': bfjs.StripeTransaction,
        'stripeach': bfjs.StripeAchTransaction,
        'stripeachverify': bfjs.StripeAchVerifyTransaction,
        'braintree': bfjs.BraintreeTransaction,
        'generic': bfjs.SpreedlyTransaction,
        'sagepay': bfjs.SagePayTransaction,
        'payvision': bfjs.PayVisionTransaction
    };

    bfjs.lateActors = [
        bfjs.core,
        bfjs.gatewayInstances['stripe'],
        bfjs.gatewayInstances['braintree'],
        bfjs.gatewayInstances['generic'],
        bfjs.gatewayInstances['sagepay'],
        bfjs.gatewayInstances['payvision']
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
            if (!actor.loadMe) {
                continue;
            }

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
            bfjs.loadScript(queue[i].src, queue[i].callback, queue[i].actor);
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
        if ($formInput.attr('type') === "checkbox") {
            return $formInput.is(':checked');
        }
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
            origin: urlParser.origin || urlParser.protocol+"//"+urlParser.hostname
        };
    };

    var invoke = function(formElementSelector, cardDetails, targetGateway, accountID, callback, options) {
        var resolvedGateway = bfjs.resolveGatewayName(targetGateway, cardDetails);

        if (!bfjs.core.hasBfCredentials) {
            throw new Error("You need to first call BillForward.useAPI() with BillForward credentials");
        }
        if (!bfjs.core.gatewayChosen) {
            bfjs.loadGateways([resolvedGateway], cardDetails);
        }

        if (!bfjs.core.gatewayChosen) {
            throw new Error("You need to first call BillForward.loadGateways() with a list of gateways you are likely to use (ie ['stripe', 'braintree', 'generic'])");
        }
        var newTransaction = cardDetails
        ? bfjs.Transaction.construct(bfjs, resolvedGateway, null, accountID, callback, cardDetails, options)
        : bfjs.Transaction.construct(bfjs, resolvedGateway, formElementSelector, accountID, callback, null, options);

        bfjs.core.doWhenReady(newTransaction);
    };

    bfjs.captureCardOnSubmit = function(formElementSelector, targetGateway, accountID, callback, options) {
        return invoke(formElementSelector, null, targetGateway, accountID, callback, options);
    };

    bfjs.captureBankAccountOnSubmit = function(formElementSelector, targetGateway, accountID, callback) {
        if (targetGateway != "stripe") {
            throw "'" + targetGateway + "' gateway does not support bank accounts";
        } else {
            // We are masking the stripe ach gateway as a plain stripe one
            targetGateway = "stripeach";
        }

        return invoke(formElementSelector, null, targetGateway, accountID, callback);
    };

    bfjs.verifyBankAccountOnSubmit = function(formElementSelector, targetGateway, accountID, callback) {
        if (targetGateway != "stripe") {
            throw "'" + targetGateway + "' gateway does not support bank accounts";
        } else {
            // We are masking the stripe ach verify gateway as a plain stripe one
            targetGateway = "stripeachverify";
        }

        return invoke(formElementSelector, null, targetGateway, accountID, callback);
    };

    bfjs.captureCard = function(cardDetails, targetGateway, accountID, callback) {
        return invoke(null, cardDetails, targetGateway, accountID, callback);
    };

    bfjs.captureBankAccount = function(bankAccountDetails, targetGateway, accountID, callback) {
        if (targetGateway != "stripe") {
            throw "'" + targetGateway + "' gateway does not support bank accounts";
        } else {
            // We are masking the stripe ach gateway as a plain stripe one
            targetGateway = "stripeach";
        }

        return invoke(null, bankAccountDetails, targetGateway, accountID, callback);
    };

    bfjs.verifyBankAccount = function(bankAccountDetails, targetGateway, accountID, callback) {
        if (targetGateway != "stripe") {
            throw "'" + targetGateway + "' gateway does not support bank accounts";
        } else {
            // We are masking the stripe ach verify gateway as a plain stripe one
            targetGateway = "stripeachverify";
        }

        return invoke(null, bankAccountDetails, targetGateway, accountID, callback);
    };

    bfjs.useAPI = function(url, token, organizationID) {
        bfjs.state.api.url = url;
        bfjs.state.api.token = token;
        bfjs.state.api.organizationID = organizationID;
        bfjs.core.hasBfCredentials = true;
    };

    /**
     * @typedef {Object} paymentRequest
     * @property {String} countryCode - Two-letter ISO 3166 country code of the merchant (you).
     * @property {String} currencyCode - Three-letter ISO 4217 currency code for the transaction.
     * @property {Object} total - Information about the transaction, to be presented by Apple Pay to your customer.
     * @property {String} total.label - Name of your business
     * @property {String} total.amount - Monetary value of the transaction. This is a required field, even though we are not capturing funds. Any price is fine; the amount will not actually be charged. Please provide as a currency string, for example '19.99'.
     * @see https://developer.apple.com/reference/applepayjs/paymentRequest
     * @see https://stripe.com/docs/apple-pay/web
     */
    /**
     * @typedef {Function} BeginApplePay
     * @returns ApplePaySession
     * @see https://developer.apple.com/reference/applepayjs/applepaysession
     * @see https://stripe.com/docs/apple-pay/web
     */
    /**
     * @typedef {Function} ApplePayAvailability
     * @param {boolean} available - If true: you should show your Apple Pay button, and configure it to invoke `beginApplePay()` when clicked.
     * @param {BeginApplePay} beginApplePay - you should invoke this when your customer clicks your Apple Pay button.
     */
    /**
     * @typedef {any} ApplePaySession
     * This is an enum which will be available on your `window` object when Apple Pay is available. Allowed values:
     * ApplePaySession.STATUS_SUCCESS
     * ApplePaySession.STATUS_FAILURE
     */
    /**
     * @typedef {Function} CompleteApplePaySession
     * @param {ApplePaySession} status - Session outcome which Apple Pay should present to the user.
     */
    /**
     * @typedef {Function} SubmitStripeTokenToBillForward
     * @param {Object} result - Result of card capture. Contains Stripe Token and Card.
     */
    /**
     * @typedef {Function} PaymentAuthorized
     * @param {CompleteApplePaySession} completion - Dispels the Apple Pay dialog. Invoke this when you want to return interaction to the user. Usually you should invoke this when the ultimate outcome of the card capture flow ("did I successfully create a new PaymentMethod in BillForward?") is known. But there are situations where you may need to prematurely tell the user "it succeeded" -- for example if you need them to fill in other parts of the form (e.g. accept terms & conditions) before submitting the Stripe token to BillForward.
     * @param {SubmitStripeTokenToBillForward} submitTokenToBF - Submits the Stripe token to BillForward. Invoke this when all interactions required of the user have completed, and you would like to send the Stripe token to BillForward to create a PaymentMethod.
     * @param {Object} result - Result of card capture. Contains Stripe Token and Card.
     */
    /**
     * @typedef {Object} ApplePaySettings
     * @property {paymentRequest} paymentRequest - your payment request, which we will send to Apple Pay upon successful card capture
     * @property {ApplePayAvailability} onApplePayAvailability - your callback, which we will invoke once we know whether Apple Pay is available.
     * @property {Function} onApplePayBegunCheckingAvailability - [Optional] This event is fired to help you show detailed loading progress. It implies that Stripe.js has loaded, that we have successfully grabbed Stripe credentials from BillForward, that we have inited Stripe.js with those credentials, and that we are about to check whether Apple Pay is available.
     * @property {Function} disableApplePayButton - [Optional] This event is fired whenever we recommend that you disable your Apple Pay button (i.e. to prevent a user from retrying card capture whilst a request is in-flight).
     * @property {Function} enableApplePayButton - [Optional] This event is fired whenever we recommend that you enable your Apple Pay button (i.e. to enable a user to retry card capture once there are no requests is in-flight).
     * @property {PaymentAuthorized} onPaymentAuthorized - [Optional] This event is fired when Stripe.js successfully receives a token from the Apple Pay user (but _before_ sending the Stripe token to BillForward). If you do not override this, we will automatically send the Stripe token to BillForward. Override this if you would like to do anything (such as returning interaction to the user so that they can complete a form) before sending the token to BillForward. When the user has finished interacting with the form: they can submit their Apple Pay token by using the existing "submit" button in the form (if present), or you can invoke `submitTokenToBF()`. Note also that if the user has captured an Apple Pay token, then that is the token that we will submit when "submit" is clicked (we will ignore any card details input into non-Apple Pay portion of the form, and will not acquire a token for those). When handling this callback: consider hiding any part of the form used for capturing non-Apple Pay cards (since -- as soon as an Apple Pay token is captured -- the Apple Pay token is the only token that we will be submitting to BillForward).
     */
    /**
     * Currently suported only in concert with `BillForward.captureCardOnSubmit()` invocation.
     * @name addApplePayButton
     * @function 
     * @param {ApplePaySettings} applePaySettings - Object containing Apple Pay settings.
     */
    bfjs.addApplePayButton = function(applePaySettings) {
        applePaySettings = applePaySettings || {};
        applePaySettings.onApplePayBegunCheckingAvailability = applePaySettings.onApplePayBegunCheckingAvailability || function() {};
        applePaySettings.onApplePayAvailability = applePaySettings.onApplePayAvailability || function() {};
        applePaySettings.paymentRequest = applePaySettings.paymentRequest || {};
        applePaySettings.disableApplePayButton = applePaySettings.disableApplePayButton || function() {};
        applePaySettings.enableApplePayButton = applePaySettings.enableApplePayButton || function() {};
        applePaySettings.onPaymentAuthorized = applePaySettings.onPaymentAuthorized; // undefined is a valid value, and means "send captured token to BillForward, and dispel Apple Pay dialog when outcome is known"
        // supported for Stripe only
        bfjs.gatewayInstances['stripe'].useApplePay = true;
        bfjs.gatewayInstances['stripe'].applePaySettings = applePaySettings;
    };

    bfjs.addPayPalButton = function(selector, onPaymentMethodReceived, handlePayPalFetchBegin, handlePayPalReady, handlePayPalLoaded, braintreeOptionsObj) {
        // supported for Braintree only
        bfjs.gatewayInstances['braintree'].usePaypal = true;
        bfjs.gatewayInstances['braintree'].paypalButtonSelector = selector;
        bfjs.gatewayInstances['braintree'].onPaymentMethodReceived = onPaymentMethodReceived || function() { return; };
        bfjs.gatewayInstances['braintree'].handlePayPalFetchBegin = handlePayPalFetchBegin || function() { };
        bfjs.gatewayInstances['braintree'].handlePayPalReady = handlePayPalReady || function() { };
        bfjs.gatewayInstances['braintree'].handlePayPalLoaded = handlePayPalLoaded || function() { };
        bfjs.gatewayInstances['braintree'].braintreeOptionsObj = braintreeOptionsObj || {};
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

    bfjs.addPayVisionForm = function(selector, supportedCardBrands, wpwlOptions, callbacks) {
        var callbacks = callbacks || {};

        // supported for Payvision only
        bfjs.gatewayInstances['payvision'].payvisionFormContainerSelector = selector;
        bfjs.gatewayInstances['payvision'].wpwlOptions = wpwlOptions || {};
        bfjs.gatewayInstances['payvision'].supportedCardBrands = supportedCardBrands || ["VISA","MASTER","AMEX","MAESTRO"];
        bfjs.gatewayInstances['payvision'].getDeferredCardDetails = callbacks.getDeferredCardDetails || function() { return {} };
        bfjs.gatewayInstances['payvision'].handleFormFetchBegin = callbacks.handleFormFetchBegin || function() { };
        bfjs.gatewayInstances['payvision'].handleFormReady = callbacks.handleFormReady || function() { };
        bfjs.gatewayInstances['payvision'].handleFormUsable = callbacks.handleFormUsable || function() { };
        bfjs.gatewayInstances['payvision'].handleAfterSubmit = callbacks.handleAfterSubmit || function() { };
        bfjs.gatewayInstances['payvision'].handleCheckoutWidgetFetchBegin = callbacks.handleCheckoutWidgetFetchBegin || function() { };
        bfjs.gatewayInstances['payvision'].handleCheckoutWidgetFetchFinish = callbacks.handleCheckoutWidgetFetchFinish || function() { };
    };

    bfjs.isTransportShimNecessary = function() {
        // enforce that transport contacts BF using the a protocol matching that with which the page was loaded

        var sameSchemeRegEx = new RegExp('^(\/\/|' + location.protocol + ')', 'i');
        /*
         - Behavior: For IE8+, we detect the documentMode value provided by Microsoft.
         - Behavior: For <IE8, we inject conditional comments until we detect a match.
         - Results: In IE, the version is returned. In other browsers, false is returned.
         - Tip: To check for a range of IE versions, use if (!IE || IE < MAX_VERSION)...
        */

        var IE = (function() {
            if (document.documentMode) {
                return document.documentMode;
            } else {
                for (var i = 7; i > 0; i--) {
                    var div = document.createElement("div");

                    div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

                    if (div.getElementsByTagName("span").length) {
                        return i;
                    }
                }
            }

            return undefined;
        })();

        return 'undefined' === typeof IE
        ? false
        : +IE<=9;
    };

    bfjs.isProtocolSupported = function(BFURL) {
        if (!bfjs.isTransportShimNecessary()) {
            return true;
        }
        var sameSchemeRegEx = new RegExp('^(\/\/|' + location.protocol + ')', 'i');
        return sameSchemeRegEx.test(BFURL);
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
                case 'stripeach':
                case 'stripeachverify':
                case 'braintree':
                case 'generic':
                case 'sagepay':
                case 'payvision':
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

    if (typeof define === 'function' && define.amd) {
        define('bfjs', [], function() {
            window.BillForward = window.BillForward || bfjs;
            return bfjs;
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = bfjs;
    } else {
        window.BillForward = window.BillForward || bfjs;
    }
})();
