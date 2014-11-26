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

`stripe`

In development:

`braintree`

###Initialize

Embed BillForward.js into your page:

```html
<script type="text/javascript" src="lib/billforward-js/src/billforward.js"></script>
```

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

Here is the current list of `bf-data` attributes:

```
cardholder-name
cvc
number
exp-month
exp-year
exp-date
address-line1
address-line2
address-city
address-state
address-zip
address-country
first-name
last-name
```

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
	"@type" : "paymentMethod",
	"created" : "2014-11-25T10:21:53Z",
	"changedBy" : "D082FABA-335D-4C55-8ECF-921BA46C0788",
	"updated" : "2014-11-25T10:21:53Z",
	"id" : "8A832825-5D19-49C0-83F8-561BBF5BBDBC",
	"crmID" : "card_152gSCFtrCKhtAEG4sOSK2xL",
	"accountID" : "EE82106F-1E41-48BD-8CCD-48AD3F624511",
	"organizationID" : "686A11E8-CCD1-11E3-B479-289EA14A90F5",
	"name" : "Visa (4242)",
	"description" : "############4242",
	"expiryDate" : "2016/01",
	"cardType" : "Visa",
	"linkID" : "19F10489-24EC-4FB2-8284-A74E0C1726EB",
	"gateway" : "stripe",
	"priority" : 0,
	"userEditable" : false,
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

###Optimize
For faster card capture, you can fetch dependencies (such as Stripe.js) early, rather than waiting until 'Submit' has been clicked. Declare using `BillForward.loadGateways()` which gateways you will be using on this checkout page.

For example:

```js
BillForward.loadGateways(['stripe', 'braintree']);
```

This will load in the libraries for Stripe and Braintree (irrespective of which one is actually recruited upon Submit).

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

###Example checkout
See SimpleCheckout.html for an example of a full worked checkout.