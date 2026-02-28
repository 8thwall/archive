---
sidebar_label: requestPurchaseIfNeeded()
---
# AccessPass.requestPurchaseIfNeeded()

`AccessPass.requestPurchaseIfNeeded({ amount, name, productId, statementDescriptor, accessDurationDays, currency, language  })`

## Description {#description}

Opens a checkout window where the customer can securely make a payment for the provided access pass.

If a valid access pass has already been purchased in the past, the returned Promise will resolve immediately with information on the previous purchase.

Any parameters provided via this API will supersede any parameters provided in the Module Configuration.

## Parameters {#parameters}

Parameter | Type | Description
--------- | ---- | -------
amount | `Number` | The amount to request for payment for the specified access pass.<br/>Amounts have a respective minimum and maximum as defined by the `currency`.<br/>**AUD**: $0.99 to $99.99<br/>**CAD**: $0.99 to $99.99<br/>**GBP**: £0.99 to £99.99<br/>**JPY**: ¥99 to ¥999<br/>**NZD**: $0.99 to $99.99<br/>**USD**: $0.99 to $99.99
name | `String` | The name of the product. This is displayed to users on the checkout screen. Maximum of 30 characters.
productId | `String` | A unique identifier for this access pass. Maximum of 30 characters.
statementDescriptor | `String` | The descriptor that appears on the customer’s credit card statement. Maximum of 22 characters.
accessDurationDays | `Number` | The number of days a customer is allowed access for. Minimum of 1 and maximum of 7.
currency | `String` | The currency to charge the user. Can be '`aud`', '`cad`', '`gbp`', '`jpy`', '`nzd`', or '`usd`'.
language | `String` | The language that appears to the end user on the secure checkout page. Can be '`en-US`' (English - United States) or '`ja-JP`' (Japanese).

## Returns {#returns}

A Promise which will resolve if the customer has completed the purchase successfully. The result includes information about the purchase that was made:

```js
{
  productId: '1-day-access-pass',
  timestamp: 1653413347810,
  expirationTimestamp: 1653499747810,
}
```

## Throws {#throws}

An error is thrown if the customer does not complete the purchase successfully.

## Example {#example}

```javascript
AccessPass.requestPurchaseIfNeeded({
    amount: 9.99,
    name: '1-Day Access Pass',
    productId: '1-day-access-pass',
    statementDescriptor: '1DAY ACCESS PASS',
    accessDurationDays: 1,
    currency: 'usd',
    language: 'en-US',
})
```
