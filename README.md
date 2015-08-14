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

###Supported gateways
Currently supported:

- `stripe`
- `braintree`
- `braintree+paypal`
- `sagepay`
- `payvision`

###Include
####Easy mode
Embed BillForward.js into your page:

```html
<script type="text/javascript" src="lib/billforward-js/src/billforward.js"></script>
```

####RequireJS
You can shim us into your require-config.js:

```js
require.config({
	paths: {
		"BillForward": "/path/to/billforward", // billforward.js location
	},
	shim: {
		"BillForward": {
	    	deps: ["jQuery"], // you don't have to declare a dependency on JQuery (BFJS can look for window.jQuery at runtime), but it helps
	    	exports: 'BillForward' // we set window.BillForward, so shim should look for this
	    }
	}
});
```

Then your RequireJS module can access us like so:

```js
define([
  "BillForward",
], function (BillForward) {
	console.log(BillForward); // it's here; honest!
});
```

###Initialize

Generate a [public token](https://app-sandbox.billforward.net/#/setup/personal/api-keys).

Give BillForward.js credentials to connect to server:

```html
<script type="text/javascript">
  var bfAPIKey = 'YOUR BILLFORWARD PUBLIC TOKEN HERE';
  var bfAPIURL = 'https://api-sandbox.billforward.net:443/v1/';
  BillForward.useAPI(bfAPIURL, bfAPIKey);
</script>
```

###Present form
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

####Form attributes
Here is the current list of `bf-data` attributes:

```
cardholder-name
cvc
number
exp-month						// in the format '01'
exp-year						// in the format '2016'
exp-date						// in the format '01/2016'
address-line1
address-line2
address-city
address-province				// use this for 'state' in America
address-zip
address-country					// in the format 'United Kingdom'
name-first
name-last
company-name
phone-mobile
email
use-as-default-payment-method	// defaults to "false"; set to string "true"
```

All are assumed to be the String datatype.

#####Dates
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

#####Names
`cardholder-name` interacts with `name-first` and `name-last` in the following way:

- If only `cardholder-name` is provided:
 * Gateways that require a full name will use `cardholder-name`.
 * Gateways that require a first/last name split will receive the final word of `cardholder-name` as 'last name', and the rest as 'first name'.
 * BillForward Profile will use the final word of `cardholder-name` as 'last name', and the rest as 'first name'.
- If `cardholder-name`, `name-first` and `name-last` are all provided:
 * Gateways that require a full name will use `cardholder-name`.
 * Gateways that require a first/last name split will receive the final word of `cardholder-name` as 'last name', and the rest as 'first name'.
 * BillForward Profile will be named using `name-first` and `name-last`.
- If only `name-first` and `name-last` are provided:
 * Gateways that require a full name will use a space-concatenation of `name-first` and `name-last`.
 * Gateways that require a first/last name split will receive `name-first` and `name-last`.
 * BillForward Profile will be named using `name-first` and `name-last`.

In other words: where `cardholder-name` is present, it becomes authoritative; `name-first` and `name-last` are then used only as BillForward profile metadata. 
When `cardholder-name` is absent, `name-first` and `name-last` are authoritative. 

###Invoke card capture
You can now invoke BillForward.js.

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

####Capture payment method to existing BillForward account
It's possible this is a returning customer, or you have already set up some account for them in BillForward. Providing their account ID enables BillForward.js to add the payment method to that existing account:

```js
var formSelector = '#payment-form';
var targetGateway = 'stripe';
var accountID = '74DA7D63-EAEB-431B-9745-76F9109FD842';
BillForward.captureCardOnSubmit(formSelector, targetGateway, accountID);
```

####Capture payment method to new BillForward account
Perhaps the customer is a new customer, or you have not yet set up an account for them in BillForward.

Provide a `null` account ID, and the default action will occur: BillForward.js creates automatically a new account, and attaches the created payment method to that account.

```js
var formSelector = '#payment-form';
var targetGateway = 'stripe';
var accountID = null;
BillForward.captureCardOnSubmit(formSelector, targetGateway, accountID);
```

####Handle success/failure
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

#####Complex handling of response
######Failure
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


######Success
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

###Capture without form
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

###Gateway-specific invocation
####PayPal (via Braintree)
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

####SagePay
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

####PayVision

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
BillForward.addPayVisionForm('#payVisionForm', {}, ["VISA","MASTER","AMEX","MAESTRO"]);
```

View the [supported card brands](https://acapture.docs.oppwa.com/tutorials/integration-guide/customisation) in ACapture's docs.

Note that async card capture flows (for example necessitating 3D secure, online transfer or virtual wallets) are not presently supported by BillForwardJS.

[Test cards](https://acapture.docs.oppwa.com/reference/parameters#testing) are listed in ACapture's docs.

###Example checkout
See the 'examples' folder for examples of full worked checkouts.