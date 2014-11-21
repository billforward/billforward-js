billforward-js
==============

BillForward.js is a library that provides easy, gateway-agnostic card tokenization.

With one line of code, you can capture a credit card, and add it as a payment method to a customer's account in BillForward. This enables your customers to pay for your products and services on a recurring basis.

You do not have to write any back-end code, nor send any card details to your own server. This keeps you on the right side of PCI-DSS compliance. :)

Where the payment gateway allows, we enable you to present your own custom form. This lets you keep control of your brand.

Should a payment gateway allow only 'hosted' forms, BillForward.js will simplify the process of fetching, embedding, and communicating with the form. We will also protect your page from being forcibly redirected.

BillForward.js presents a generic interface in code for:
- card capture from custom forms
- card capture from hosted forms
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
address-line1
address-line2
address-city
address-state
address-zip
address-country
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
var accountID = '74DA7D63-EAEB-431B-9745-76F9109FD842';
var targetGateway = 'stripe';
BillForward.captureCardOnSubmit(formSelector, targetGateway, accountID);
```

####Capture payment method to new BillForward account
Perhaps the customer is a new customer, or you have not yet set up an account for them in BillForward.

Provide a `null` account ID, and the default action will occur: BillForward.js creates automatically a new account, and attaches the created payment method to that account.

```js
var accountID = null;
var targetGateway = 'stripe';
BillForward.captureCardOnSubmit(formSelector, targetGateway, accountID);
```

####Handle success/failure
Naturally you will want to know when the transaction is finished, so your customer can progress through the checkout.

Pass in a callback function to handle the result:

```js
var accountID = null;
var targetGateway = 'stripe';
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
  "created": "2014-11-21T10:37:15Z",
  "changedBy": "50105F2A-34B6-4F9F-83D5-CF10B885EF7F",
  "updated": "2014-11-21T10:37:15Z",
  "id": "D4FE39EE-1E77-4F36-B837-90BA740656FC",
  "accountID": "CDA8F5F1-7BE5-481C-82E0-839EF38FEABE",
  "organizationID": "88E8A46E-4768-4D24-A923-34AD0015F12E",
  "name": "Account Credit",
  "description": "Credit Notes",
  "gateway": "credit_note",
  "priority": 100,
  "userEditable": false,
  "reusable": true,
  "deleted": false
}
```

From this object you can look up the `accountID` of the created/existing account. You might want to pass this on to your backend if you intend to do handle this data further.

#####Complex handling of success/failure:
You can present the error in the form (for example using JQuery) and re-enable the form 'submit' button:

```js
function callback(data, error) {
	if (error) {
		$(formSelector).find('.payment-errors').text(error);
		$(formSelector).find('button').prop('disabled', false);
	}
};
```

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

###Example checkout
Your finished checkout page might look like this:

```html
<html>
	<head>
		<!-- Include JQuery to make life easier -->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		
		<!-- Include BillForwardJS -->
		<script type="text/javascript" src="lib/billforward-js/src/billforward.js"></script>
		
		<script type="text/javascript">
			var bfAPIKey = 'YOUR BILLFORWARD PUBLIC TOKEN HERE';
			var bfAPIURL = 'https://api-sandbox.billforward.net:443/v1/';
			BillForward.useAPI(bfAPIURL, bfAPIKey);
			
			var accountID = null;
			var targetGateway = 'stripe';
			BillForward.captureCardOnSubmit(formSelector, targetGateway, accountID, callback);
			function callback(data, error) {
				if (error) {
					$(formSelector).find('.payment-errors').text(error);
					$(formSelector).find('button').prop('disabled', false);
				} else {
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
			</script>
		</head>
	<body>
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
  </body>
</html>
```
