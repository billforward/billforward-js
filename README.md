billforward-js
==============

BillForward.js is a library that provides easy, gateway-agnostic card tokenization.

With one line of code, you can capture a credit card, and add it as a payment method to a customer's account in BillForward. This enables your customers to pay for your products and services on a recurring basis.

You do not have to write any back-end code, nor send any card details to your own server. This keeps you on the right side of PCI-DSS compliance. :)

Where the payment gateway allows, we enable you to present your own custom form. This lets you keep control of your brand.

Should a payment gateway allow only 'hosted' forms, BillForward.js will simplify the process of fetching, embedding, and communicating with the form. We will also protect your page from being forcibly redirected.

BillForward.js presents a generic interface in code for:
- Card capture from custom forms
- Card capture from hosted forms

The code you write is the same, regardless of payment gateway. This makes it trivial to use certain gateways for certain types of card.

# Supported gateways
Currently supported:

- `stripe`
- `braintree`
- `braintree+paypal`
- `sagepay`
- `payvision`

# Usage

## Inclusion

### Easy mode

Embed BillForward.js into your page:

```html
<script type="text/javascript" src="lib/billforward-js/src/billforward.js"></script>
```

### RequireJS

First, include BillForwardJS in your `require-config.js`:

#### Inclusion

##### Using AMD module loading

Just point to `billforward.js`; we are an AMD module, so this is all RequireJS should require:

```js
require.config({
	paths: {
		"bfjs": "/path/to/billforward", // billforward.js location
	}
});
```

##### Using shim from global namespace

If for any reason you prefer to grab us from the global variable `window.BillForward` instead of grabbing us via our AMD module definition, you can use RequireJS's shims to grab our namespace.

You can shim us into your `require-config.js`:

```js
require.config({
  paths: {
    "bfjs": "/path/to/billforward", // billforward.js location
  },
  shim: {
    "bfjs": {
        deps: ["jQuery"], // you don't have to declare a dependency on JQuery (BFJS can look for window.jQuery at runtime), but it helps
        exports: 'BillForward' // we set window.BillForward, so shim should look for this
      }
  }
});
```

#### Grabbing a reference to BillForward.js

Once included, your RequireJS module can access us like so:

```js
define([
  "bfjs",
], function (BillForward) {
	console.log(BillForward); // it's here; honest!
});
```

### Browserify (via npm)

Note that this is a client-side library, so the `npm` distribution does not imply Node support. You can install this package from `npm` for use with [Browserify](http://browserify.org/), like so:

```bash
npm install --save billforward-js
```

## Initialization

Generate a [public token](https://app-sandbox.billforward.net/#/setup/personal/api-keys).

Give BillForward.js credentials to connect to server:

```html
<script type="text/javascript">
  var bfAPIKey = 'YOUR BILLFORWARD PUBLIC TOKEN HERE';
  var bfAPIURL = 'https://api-sandbox.billforward.net:443/v1/';
  BillForward.useAPI(bfAPIURL, bfAPIKey);
</script>
```

## Invocation

Now that you have included the library, and informed it of your BillForward credentials, you can invoke BillForward.js.

### Card capture using form

You will need to build a card capture form inside your webpage.

#### Building form in webpage
Make a credit card form:

```html
<form id="payment-form">
  <span class="payment-errors"></span>

  <div class="form-row">
    <label>
      <span>Card Number</span>
      <input type="text" size="20" bf-data="number" value="4242424242424242"/>
    </label>
  </div>

  <div class="form-row">
    <label>
      <span>CVC</span>
      <input type="text" size="4" bf-data="cvc" value="123"/>
    </label>
  </div>

  <div class="form-row">
    <label>
      <span>Expiration (MM/YYYY)</span>
      <input type="text" size="2" bf-data="exp-month" value="01"/>
    </label>
    <span> / </span>
    <input type="text" size="4" bf-data="exp-year" value="2016"/>
  </div>

  <button type="submit" disabled="true">Submit Payment</button>
</form>
```

Note that the 'submit' button is set to `disabled="true"`; BillForward.js will enable the button once it has loaded all dependencies required for the transaction.

`bf-data` attributes are used to signify which form elements are to be used in the tokenization. We capture all provided `bf-data` attributes, and pass on to the gateway any of these attributes that it supports.

#### Form attributes
Here is the current list of `bf-data` attributes:

```
cardholder-name
cvc
number
exp-month           // in the format '01'
exp-year            // in the format '2016'
exp-date            // in the format '01/2016'
address-line1
address-line2
address-city
address-province        // use this for 'state' in America
address-zip
address-country         // in the format 'United Kingdom'
name-first
name-last
company-name
phone-mobile
email
use-as-default-payment-method // defaults to "false"; set to string "true"
```

All are assumed to be the String datatype.

##### Dates

`exp-month` is formatted MM. 
`exp-year` is formatted YYYY. 
`exp-date` is formatted MM/YYYY. 

`exp-date` interacts with `exp-month` and `exp-year` in the following way:

- If only `exp-date` is provided:
 * Gateways that require a single MM/YYYY field will use `exp-date`.
 * Gateways that require separate MM and YYYY field will use a split `exp-date`.
- If only `exp-month` and `exp-year` are provided:
 * Gateways that require a single MM/YYYY field will use a slash concatenation of `exp-month` and `exp-year`.
 * Gateways that require separate MM and YYYY field will use `exp-month` and `exp-year`.
- If `exp-date`, `exp-month` and `exp-year` are all provided:
 * This is interpeted the same way as if just `exp-date` was provided.

In other words: where `exp-date` is present, it becomes authoritative.

##### Names

`cardholder-name` interacts with `name-first` and `name-last` in the following way:

- If only `cardholder-name` is provided:
  - Gateways that require a full name will use `cardholder-name`.
  - Gateways that require a first/last name split will receive the final word of `cardholder-name` as 'last name', and the rest as 'first name'.
  - BillForward Profile will use the final word of `cardholder-name` as 'last name', and the rest as 'first name'.
- If `cardholder-name`, `name-first` and `name-last` are all provided:
  - Gateways that require a full name will use `cardholder-name`.
  - Gateways that require a first/last name split will receive the final word of `cardholder-name` as 'last name', and the rest as 'first name'.
  - BillForward Profile will be named using `name-first` and `name-last`.
- If only `name-first` and `name-last` are provided:
  - Gateways that require a full name will use a space-concatenation of `name-first` and `name-last`.
  - Gateways that require a first/last name split will receive `name-first` and `name-last`.
  - BillForward Profile will be named using `name-first` and `name-last`.

In other words: where `cardholder-name` is present, it becomes authoritative; `name-first` and `name-last` are then used only as BillForward profile metadata. 
When `cardholder-name` is absent, `name-first` and `name-last` are authoritative.

### Binding card capture code to form

Specify a JQuery selector that can be used to locate your form.

Specify also the gateway to which you would like to tokenize .

```html
<script type="text/javascript">
  var formSelector = '#payment-form';
  var targetGateway = 'stripe';
  BillForward.captureCardOnSubmit(formSelector, targetGateway);
</script>
```

This will wait for the page to load, then use JQuery (loading it in if needed) to find the form using the provided JQuery Selector.

BillForward.js binds a function to the 'submit' event of that form. The function will be invoked once the user clicks 'Submit'.

This is the simplest invocation. More likely you will use these alternative invocations, for example to handle the result:

#### Capture payment method to existing BillForward account

It's possible this is a returning customer, or you have already set up some account for them in BillForward. Providing their account ID enables BillForward.js to add the payment method to that existing account:

```js
var formSelector = '#payment-form';
var targetGateway = 'stripe';
var accountID = '74DA7D63-EAEB-431B-9745-76F9109FD842';
BillForward.captureCardOnSubmit(formSelector, targetGateway, accountID);
```

#### Capture payment method to new BillForward account

Perhaps the customer is a new customer, or you have not yet set up an account for them in BillForward.

Provide a `null` account ID, and the default action will occur: BillForward.js creates automatically a new account, and attaches the created payment method to that account.

```js
var formSelector = '#payment-form';
var targetGateway = 'stripe';
var accountID = null;
BillForward.captureCardOnSubmit(formSelector, targetGateway, accountID);
```

#### Handle success/failure

Naturally you will want to know when the transaction is finished, so your customer can progress through the checkout.

Pass in a callback function to handle the result:

```js
var formSelector = '#payment-form';
var targetGateway = 'stripe';
var accountID = null;
BillForward.captureCardOnSubmit(formSelector, targetGateway, accountID, callback);

function callback(data, error) {
	if (error) {
		console.error(error);
	} else {
		console.log(data);
	}
};
```

The returned object in the event of success is a JSON representation of a BillForward payment method:

```js
{
	"id" : "PMD-2825-5D19-49C0-83F8-561BBF5BBDBC",
	"accountID" : "ACC-106F-1E41-48BD-8CCD-48AD3F624511",
	"name" : "Visa (4242)",
	"description" : "############4242",
	"expiryDate" : "2016/01",
	"cardType" : "Visa",
	"linkID" : "19F10489-24EC-4FB2-8284-A74E0C1726EB",
	"gateway" : "stripe",
	"priority" : 0,
	"reusable" : true,
	"deleted" : false
}
```

From this object you can look up the `accountID` of the created/existing account. You might want to pass this on to your backend if you intend to do handle this data further.

##### Complex handling of response

###### Failure

You can present the error in the form (for example using JQuery) and re-enable the form 'submit' button:

```js
function callback(data, error) {
	if (error) {
		$(formSelector).find('.payment-errors').text(error.message);
		$(formSelector).find('button').prop('disabled', false);
	}
};
```

Errors are JSON objects of the format:

```js
{
	'code': int,			// standardized reason code you can lookup
	'message': string,		// friendly string to present to customer
	'detailObj': Object		// further detail (if available) for debug; format may vary
}
```

The system for enumerating error codes is as follows:

```
All currently-implemented errors are those marked with *.
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
```


###### Success

Upon success, you could POST some information to your backend.

For example, if a new account is created, you might want to send its ID to your server.

Here we use JQuery to add some POST variables to the form, and point the form action to a file `handlePayment.php` on your server. We then call the form's default 'submit' event.

```js
function callback(data, error) {
	if (!error) {
		var addPostVariable = function(varName, value) {
			$(formSelector).append($('<input type="hidden" name="'+varName+'" />').val(value));
		}
		
		var postVars = {
			accountID: data.accountID
		};
		for (var i in postVars) {
			addPostVariable(i, postVars[i]);
		}
	
		$(formSelector).attr("action", "handlePayment.php");
		$(formSelector).attr("method", "POST");
		
		$(formSelector).get(0).submit();
	}
};
```

### Capture without form

We provide an alternative invocation, allowing you to capture a card programmatically rather than using a form:

```js
var cardDetails = {
	'cardholder-name': 'Bob Johnson',
    'cvc': '123',
    'number': '4242424242424242',
    'exp-month': '01',
    'exp-year': '2016',
};

BillForward.captureCard(cardDetails, 'stripe', accountID, callback);
```

Each entry in the cardDetails object is equivalent to passing in a `bf-data` attribute of the same name.

### Gateway-specific invocation

#### PayPal (via Braintree)

You can add a (hosted) PayPal button to a custom Braintree form. It will be downloaded and dropped into an HTML node of your choice:

```html
<div id="paypalButtonContainer"></div>
```

Use `addPayPalButton()` to recruit this PayPal button in your form.

```js
// Jquery-style selector pointing to your form
var formSelector = '#payment-form';

// Jquery-style selector pointing to your PayPal button container
BillForward.addPayPalButton('#paypalButtonContainer');

// bind to 'submit' event the 'card capture' routine
BillForward.captureCardOnSubmit(formSelector, 'braintree+paypal', accountID, callback);
```

Note that only the custom form invocation (`captureCardOnSubmit()`) supports this.

##### Callbacks

We allow you to pass through various config and callbacks to Braintree's SDK:

```js
// some <div/> or similar that you have reserved for throwing the PayPal button into.
var paypalButtonContainer = '#paypalButtonContainer';

/*
  This is equivalent to the Braintreee SDK's `onPaymentMethodReceived`. You don't necessarily need to do anything in response to this event (BillForward.js handles the flow for you anyway).
  https://developers.braintreepayments.com/javascript+ruby/guides/paypal/client-side
 */
function onPaymentMethodReceived(object) { }

// this callback lets you know "A PayPal button is being grabbed"; you might want to display a spinner
function handlePayPalFetchBegin() {
  // if you want seamless loading, you can hide the PayPal button container, so it's invisible until it's fully loaded
  $(paypalButtonContainer).hide();
}

// this callback lets you know "The PayPal button has arrived and is ready for interaction (but image is still loading)"; you could unhide the button now, and remove your spinner.
function handlePayPalReady() { }

// this callback lets you know "The PayPal button is ready for interaction AND its image has finished loading"; you could unhide the button now, and remove your spinner.
function handlePayPalLoaded() {
  $(paypalButtonContainer).show();
}

/*
  https://developers.braintreepayments.com/javascript+php/guides/paypal/client-side
  Anything you throw in here will be added to the Options object with which we invoke Braintree SDK's braintree.setup()
*/
var braintreeOptionsObj = {
  // A callback function that is fired for any error that can occur during the PayPal flow (e.g., if the customer’s browser does not support the Checkout with PayPal experience)
  onUnsupported: function() { },

  // A callback function, which is fired if the customer cancels or logs out without completing PayPal authentication.
  onCancelled: function() { },

  // Use this option to change the language, links, and terminology used in the PayPal flow to suit the country and language of your customer
  locale: "GB"
};

// Jquery-style selector pointing to your form
var formSelector = '#payment-form';

// Jquery-style selector pointing to your PayPal button container
BillForward.addPayPalButton(paypalButtonContainer, onPaymentMethodReceived, handlePayPalFetchBegin, handlePayPalReady, handlePayPalLoaded, braintreeOptionsObj);

// bind to 'submit' event the 'card capture' routine
BillForward.captureCardOnSubmit(formSelector, 'braintree+paypal', accountID, callback);
```

#### SagePay

SagePay is available as a hosted form only. It will be downloaded and dropped into an HTML node of your choice:

```html
<div id="sagePayFormContainer"></div>
```

Use `addSagePayForm()` to indicate your intent to use this form.

```js
// Jquery-style selector pointing to your SagePay hosted form container
BillForward.addSagePayForm('#sagePayFormContainer');

var cardDetails = {
};

// Downloads hosted form into your specified container, and binds its submission to a callback of your choice.
BillForward.captureCard(cardDetails, 'sagepay', accountID, callback);
```

You could also use the same `cardDetails` object to pass metadata into the payment method. The following metadata is honoured for SagePay hosted form invocation:

```js
var cardDetails = {
	'email': 'billiam@forward.net',
    'company-name': 'BillForward',
    'name-first': 'Bill',
    'name-last': 'Forward',
    'phone-mobile': '01189998819',
	'use-as-default-payment-method': true
};
```

The BillForward UI gives you the opportunity to specify which types of card you wish to accept through SagePay (using a multi-select).

#### PayVision

PayVision is available as a hosted form only. It will be downloaded and dropped into an HTML node of your choice:

```html
<div id="sagePayFormContainer"></div>
```

Use `addSagePayForm()` to indicate your intent to use this form.

```js
// Jquery-style selector pointing to your PayVision hosted form container
BillForward.addSagePayForm('#payVisionForm');

var cardDetails = {
};

// Downloads hosted form into your specified container, and binds its submission to a callback of your choice.
BillForward.captureCard(cardDetails, 'payvision', accountID, callback);
```

You could also use the same `cardDetails` object to pass metadata into the payment method. The following metadata is honoured for PayVision hosted form invocation:

```js
var cardDetails = {
	'email': 'billiam@forward.net',
    'company-name': 'BillForward',
    'name-first': 'Bill',
    'name-last': 'Forward',
    'phone-mobile': '01189998819',
	'use-as-default-payment-method': true
};
```

You can choose explicitly which card types to include in the form:

```js
BillForward.addPayVisionForm('#payVisionForm', ["VISA","MASTER","AMEX","MAESTRO"]);
```

View the [supported card brands](https://acapture.docs.oppwa.com/tutorials/integration-guide/customisation) in ACapture's docs.

Note that async card capture flows (for example necessitating 3D secure, online transfer or virtual wallets) are not presently supported by BillForwardJS.

[Test cards](https://acapture.docs.oppwa.com/reference/parameters#testing) are listed in ACapture's docs.

We expose a variety of configuration options for the form interaction:

```js
// selector for some element on the webpage into which we can insert the Payvision form.
var formSelector = '#payVisionForm';

// which card brands are enabled for this form
// https://acapture.docs.oppwa.com/tutorials/integration-guide/customisation
var supportedCardBrands = ["VISA","MASTER","AMEX","MAESTRO"];

// wpwl form options referred to here:
// https://acapture.docs.oppwa.com/tutorials/integration-guide/widget-api
// avoid overriding the following parameters, since we are already overriding them for our own purposes:
/*
`onAfterSubmit` // we provide instead a callback `handleAfterSubmit` of our own
onReadyIframeCommunication // we provide instead a callback `handleFormUsable` of our own
`onReady` // we provide instead a callback `handleFormReady` of our own
*/
var wpwlOptions = {};

// Callbacks provided by BillForwardJS
var callbacks = {
	// should card-capture succeed: BF can slurp up additional
	// metadata specified here, and apply it to the customer's
	// BF Account.
	getDeferredCardDetails: function() {
		// these are all the fields which can be included as extra metadata:
		return {
        	'company-name': 'BillMagic',
        	'name-first'  : 'Billiam',
        	'name-last'   : 'Forward',
        	'phone-mobile': '7',
        	'email':        'no+spam@billforward.net',
        	'use-as-default-payment-method': true
        }
	},

	// We begin requesting the .js responsible for constructing the form
	handleCheckoutWidgetFetchBegin: function() {},
	// We successfully finish requesting the .js responsible for constructing the form
	handleCheckoutWidgetFetchFinish: function() {},

	// We begin embedding the form into the page
	handleFormFetchBegin: function() {},

	// The form has finished loading (but its iframe may still be preparing)
	handleFormReady: function() {},

	// The form has finished loading, and its iframe is done preparing; it is ready for interaction, and no spinners remain.
	handleFormUsable: function() {},

	// Form contents were valid, have been submitted, and are now being sent to BillForward for scrutinization. You can use this callback to present a spinner whilst waiting for the reply from BillForward.
	handleAfterSubmit: function() {}
};

BillForward.addPayVisionForm(formSelector, supportedCardBrands, wpwlOptions, callbacks);
```

### Capture Bank Account

For the moment the only bank account capture supported is with _Stripe_ using `ACH`.
When capturing a bank account the flow can be divided in two steps:

- Capturing
- Verification

Once the **Capture** has been made, Stripe will deposit two random amounts on the bank account. These amounts have to be
verified against (or in other words, *sent to*) Stripe. You can do the verification process directly using _BillForward.js_.

In more details what happens is:
- Capture a bank account using _BillForward.js_
- Stripe deposits on the bank account two random amounts
- A BillForward PaymentMethod with `state = 'Pending'` is created
- Verify the two amounts through _BillForward.js_
- If the amounts are correct, BillForward switches the PaymentMethod `state` to `Active`
- The bank account is now verified and ready to go


#### Capturing with form

This step creates an unverified bank account on both Stripe and BillForward backends. First of all a _HTML_ form is needed:

```html
<form id="payment-form">
    <span class="payment-errors"></span>
    <span class="payment-success"></span>

    <div class="form-row">
        <label>
            <span>Holder Name</span>
            <input type="text" size="20" bf-data="holder-name" value="John Doe"/>
        </label>
    </div>

    <div class="form-row">
        <label>
            <span>Bank Account Name</span>
            <input type="text" size="20" bf-data="bank-account-name" value="John Doe's Bank"/>
        </label>
    </div>

    <div class="form-row">
        <label>
            <span>Routing Number</span>
            <input type="text" size="10" bf-data="routing-number" value="110000000"/>
        </label>
    </div>

    <div class="form-row">
        <label>
            <span>Account Number</span>
            <input type="text" size="10" bf-data="account-number" value="000123456789"/>
        </label>
    </div>

    <div class="form-row">
        <label>
            <span>Account Holder Type</span>
            <select bf-data="account-holder-type">
                <option>individual</option>
                <option>company</option>
            </select>
        </label>
    </div>

    <div class="form-row">
        <label>
            <span>Make Default</span>
            <input type="checkbox" bf-data="use-as-default-payment-method" />
        </label>
    </div>

    <input type="hidden" bf-data="account-id" value="SET AS ACCOUNT ID" />

    <button type="submit">Submit Payment</button>
</form>
```

The form is comprised of the following fields:

| Field name          | Description |
| ------------------- | ---------- |
| `holder-name`        | the account holder name. |
| `bank-account-name`   | a label identifying the bank account |
| `routing-number`     | the routing number |
| `account-number`     |  the account number |
| `account-holder-type` | the holder type (accepted values are 'individual' and 'company') |
| `account-id`         | the accound's ID to which we are adding the bank account |
| `use-as-default-payment-method` | checked if the account has to be the default for the account |

A small amount of Javascript is needed as well to bootstrap correctly the HTML form:

```javascript
        var bfAPIKey = 'YOUR BILLFORWARD PUBLIC TOKEN HERE';
        var bfAPIURL = 'https://api-sandbox.billforward.net:443/v1/';

        // connect to BillForward using credentials
        BillForward.useAPI(bfAPIURL, bfAPIKey);

        // use a 'null' account if you want to capture this card against a new customer
        var accountID = null;

        // Jquery-style selector pointing to your form
        var formSelector = '#payment-form';

        // Jquery-style selector pointing to your verify form
        var verifyFormSelector = '#verify-form';

        BillForward.captureBankAccountOnSubmit(formSelector, 'stripe', accountID, callback);

        function callback(paymentMethod, error) {
            if (error) {
                console.error(error);
            } else {
                console.log(paymentMethod);

                // Do some stuff once the capture is complete
            }
        }
```

#### Capture directly with code

It is possible to capture a bank account directly with javascript without the usage of an `html form`.
For example:

```javascript
var bankDetails = {
    "routing-number":"110000000",
    "account-number":"000123456789",
    "holder-name":"John Doe",
    "bank-account-name":"John Doe's Bank",
    "account-holder-type":"company",
    "use-as-default-payment-method" : true
};

BillForward.captureBankAccount(bankDetails, 'stripe', accountID, callback);

```

The involved field names are the same as for the form capture and are self explanatory.

#### Verify with a form

After we have successfully created a bank account we have to verify it to be able to use it for a payment.

The way Stripe verifies its bank accounts is through **micro deposits**.

After a bank account is created, two micro deposits (of the order of a couple tens of cents) are made on the BillForward Account's bank account. The two amounts have to  be used as input values for the next step.

How the _HTML_ code is supposed to look:

```html
<form id="verify-form">
    <span class="payment-errors"></span>
    <span class="payment-success"></span>

    <div class="form-row">
        <label>
            <span>Payment ID</span>
            <input type="text" size="45" bf-data="payment-method-id" value="PAYMENT METHOD ID"/>
        </label>
    </div>

    <div class="form-row">
        <label>
            <span>Amount 1</span>
            <input type="text" size="4" bf-data="amount1" value="FIRST MICRODEPOSIT AMOUNT"/>
        </label>
    </div>

    <div class="form-row">
        <label>
            <span>Amount 2</span>
            <input type="text" size="4" bf-data="amount2" value="SECOND MICRODEPOSIT AMOUNT"/>
        </label>
    </div>

    <button type="submit">Submit Verify</button>
</form>
```

Follows the Javascript code needed to bootstrap the form:

```javascript

BillForward.verifyBankAccountOnSubmit(verifyFormSelector, 'stripe', accountID, verifyCallback);

function verifyCallback(paymentMethod, error) {
    if (error) {
        console.error(error);
    } else {
        console.log(paymentMethod);
        //Do stuff...
    }
}
```

#### Verify with code

Like for the capturing it's possible to do the verification step through code only:

```javascript
var bankDetails = {
        "amounts":["32","45"]
    };

BillForward.verifyBankAccount(bankDetails, 'stripe', accountID, callback);

```

### SCA with Stripe

Integrating Stripe's 3-DS goes a little bit further than just using billforward-js for capturing cards.

Refer to Stripe's documentation about [Setup Intents](https://stripe.com/docs/api/setup_intents) or their API docs 
  for the [SetupIntent object](https://stripe.com/docs/api/setup_intents/object) for more insight on how this works 
  on the Stripe's end.


### How to implement it if I'm currently using BillForward-js?

-   Upgrade to the latest version (TODO release the version in NPM and mention which version is it)
-   Add Stripe.js V3 to your page e.g. `<script src="https://js.stripe.com/v3/"></script>`
-   If you're using `BillForward.captureCard()` method then add `"requires-setup-intent": true` to the object that you're passing to that method, e.g.: `BillForward.captureCard({..., "requires-setup-intent": true})`
-   If you're using `BillForward.captureCardOnSubmit()` then you need to add a hidden input tag: `<input type="hidden" bf-data="requires-setup-intent" value="true" />`
-   Add a callback (4th parameter for both of those methods mentioned above) that will be called once the initial card setup is done, we will need to do the 3-DS confirmation after that.
-   In your callback you'll get the resulting data that contains the captured card, as the first parameter (let's call it `data`). You should be able to access a string value at `data.additionalData.setupIntentStatus` which will be either `requires_confirmation`, `requires_action`, or `succeeded` . We're only interested in the first two - if we get any of those this means that we need to invoke the confirmation procedure.
-   Next we can confirm the SetupIntent by calling Stripe's `handleCardSetup(data.additionalData.setupIntentClientSecret)` method. Doing this will open a new popover (modal) window inside your page where the customer will be able to go through their bank's 3-DS flow.
-   Once the SetupIntent is confirmed the only thing left is to let BillForward know that the card in question has its setup intent confirmed, which can be done by calling `BillForward.stripeVerifySetupIntent(data.id, [(data, error) => console.log(data, error)])`

Here's a code sample for the above steps:

```
var bfAPIKey = '***'
var bfAPIURL = 'https://app-sandbox.billforward.net/v1/'

$(function () {
    BillForward.useAPI(bfAPIURL, bfAPIKey)

    $('#btn-sbmt').on('click', function () {

        BillForward.captureCard({
            'cardholder-name': $('#cc-cardholder').val(),
            'cvc': $('#cc-cvc').val(),
            'number': $('#cc-number').val(),
            'exp-month': $('#cc-month').val(),
            'exp-year': $('#cc-year').val(),

            'requires-setup-intent': true // This is the new option

        }, 'stripe', null /* account ID set to null to create a new account */,
            function (data) {

                // data.additionalData will contain Stripe's SetupIntent secret that we will use
                // to confirm the intent (which is Stripe's way of saying 'go through 3-DS challenge')
                console.log(data)

                if (data.additionalData
                    && ['requires_confirmation', 'requires_action'].indexOf(data.additionalData.setupIntentStatus) !== -1) {

                    // billforward.js will expose Stripe's public key in its global state
                    var stripe3 = Stripe(BillForward.state.stripe.publishableKey)

                    // this will trigger a modal window to open on your page with 3-DS challenge
                    // please refer to https://stripe.com/docs/js/setup_intents/confirm_card_setup for more

                    stripe3.handleCardSetup(data.additionalData.setupIntentClientSecret)
                        .then(function (setupIntent) {

                            if (setupIntent.error) {
                                console.error('Caught: ', setupIntent)
                            } else {
                                console.log('Attempting to verify setup intent')

                                BillForward.stripeVerifySetupIntent(data.id, function (data, error) {
                                    console.log(data)
                                    console.log(error)
                                })
                            }
                        })
                }

            })

    })
})

```

### How to implement this if I'm not using BillForward-js?

-   Make sure that you're using Stripe.js V3 (`<script src="https://js.stripe.com/v3/"></script>`)
-   When you make the `/v1/tokenization/auth-capture` API call to BillForward to save the card, add `requiresSetupIntent: true` to the request.
-   In the response you'll get SetupIntent's client secret which you'll need to use in order to confirm the SetupIntent: `var intentSecret = captureResult.results[0].additionalData.setupIntentClientSecret;`
-   You only have to confirm the SetupIntent if its status is `requirest_confirmation` or `requires_action` :


    if (captureResult.results[0].additionalData.setupIntentStatus === "requires_action" ||
        captureResult.results[0].additionalData.setupIntentStatus === "requires_confirmation") { ... }

-   Call Stripe's `confirmCardSetup(intentSecret)`
-   And let BillForward know once the SetupIntent is confirmed:


    var paymentMethodId = captureResult.results[0].id;
    confirmCardSetup(...).then(intentResult => {
        $.ajax({
            type: "POST",
            url: "https://app-sandbox.billforward.net/v1/payment-methods/"
                + paymentMethodId + "/verify/stripe-setup-intent" + "?"
                + $.param({ access_token: bfAPIKey }),
            data: JSON.stringify({}),
            contentType: 'application/json',
            crossDomain: true,
            async: true
        })
    });

Below is a code sample for this approach:

    var bfAPIKey = '***'
    var bfAPIURL = 'https://app-sandbox.billforward.net/v1/'
    var s3 = Stripe('***')

    var s3e = s3.elements()
    var cardE = s3e.create('card')
    cardE.mount('#stripe-element')

    $('#element-submit').on('click', function () {

        s3.createToken(cardE).then(function (data) {
            console.log(data)

            $.ajax({
                type: 'POST',
                url: bfAPIURL + 'tokenization/auth-capture?access_token=' + bfAPIKey,
                data: JSON.stringify({
                    '@type': 'StripeAuthCaptureRequest',
                    'gateway': 'Stripe',
                    'stripeToken': data.token.id,
                    'cardID': data.token.card.id,
                    'requiresSetupIntent': true
                }),
                contentType: 'application/json',
                crossDomain: true,
                async: true
            }).then(function (captureResult) {
                console.log(captureResult)

                var paymentMethodId = captureResult.results[0].id
                var intentSecret = captureResult.results[0].additionalData.setupIntentClientSecret
                var bfStripeCardId = captureResult.results[0].crmID

                if (captureResult.results[0].additionalData.setupIntentStatus === 'requires_action' ||
                    captureResult.results[0].additionalData.setupIntentStatus === 'requires_confirmation') {

                    s3.confirmCardSetup(intentSecret).then(function (intentResult) {

                        console.log(intentResult)

                        var fullURL = bfAPIURL + 'payment-methods/' + paymentMethodId + '/verify/stripe-setup-intent'

                        var ajaxConfig = {
                            type: 'POST',
                            url: fullURL + '?' + $.param({access_token: bfAPIKey}),
                            data: JSON.stringify({}),
                            contentType: 'application/json',
                            crossDomain: true,
                            async: true
                        }

                        $.ajax(ajaxConfig)
                            .done(function (resp, msg, err) {
                                console.log(resp)
                            })

                    })
                }
            })
        })
    });


### Example checkout

See the 'examples' folder for examples of full worked checkouts.

# Development

## Releases

### `npm`

#### Minor release

Finish your commit, then run:

```bash
npm version patch
npm publish
git push origin master --follow-tags
```

Or run `sh ./npm-release-minor.sh`

#### Major release

Finish your commit, then run:

```bash
npm version major
npm publish
git push origin master --follow-tags
```

Or run `sh ./npm-release-major.sh`