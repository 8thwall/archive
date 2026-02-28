---
id: monetize-with-8th-wall-payments
---

# 8th Wall Payments

8th Wall Payments gives developers the tools they need to add secure payments to their AR and VR web
apps. Developers can use the Payments Module found in the Cloud Editor to easily add products for
purchase to their project. All payments are facilitated by the 8th Wall Payments API which enables
developers to collect and receive payments.

#### Why use 8th Wall Payments? {#why-use-8th-wall-payments}

Easily monetize your WebAR or WebVR experiences with 8th Wall Payments with the Payments Module.
Powered by Stripe, 8th Wall Payments provide a secure way for end users to pay for your product and
for you to make money developing WebXR projects.

With the 8th Wall Payments module, you have a one-step import that allows you the opportunity to
monetize your web AR or web VR project using extensible payment options. With the Payments Module,
you can easily customize the payment options such as cost, and item you are selling, all leveraging
our streamlined checkout flow optimized for use on mobile, desktop and VR. Access all current and
future payment types in one module. Test the success of your payment integration with built in test
mode.

Current Payment options available:

- **Access Pass**: Access pass allows you to add a one time payment to your product that expires
after a minimum of 1 day to a maximum of 7 days. No user login necessary. Access pass is available
on one device and is removed when browser cache is cleared.

#### Payment Processing {#payment-processing}

To provide this payment service, 8th Wall takes a small commission of each fee, which is split with
our Stripe processor. End users must agree to [8th Wall’s Terms of
Service](https://www.8thwall.com/terms) in order to make a purchase.

#### Payment Processing Fee {#payment-processing-fee}

20% of each transaction

## Payment Restrictions {#payment-restrictions}

* 8th Wall Payments is currently only accessible in the following countries and their respective currencies:
  * Australia
  * Canada
  * Japan
  * New Zealand
  * UK
  * United States
* 8th Wall Payments is only accessible through projects using the Cloud Editor.
* You must be an `Admin` or `Owner` of your 8th Wall workspace in order to sign up for the 8th Wall Payment API.
* 8th Wall Payments are bound to the [Stripe Restricted Businesses List](https://stripe.com/gb/legal/restricted-businesses).
* You can only use 8th Wall Payments as your Payments Processor for App functionality, digital content or digital goods created using 8th Wall.
* All end users must agrees to [8th Wall’s Terms of Service](https://www.8thwall.com/terms), (see “8th Wall Payments End User Terms and Conditions” in the ToS)

## Payout Dates {#payout-dates}

Sign up for Payments API on your Accounts Page. Once your account receives funds, you will receive
payments on the 15th of every month. Amounts that have not been paid out will show up as **Pending
Amounts** on your Accounts page.

## Payment Support and Refunds {#payment-support-and-refunds}

All payments are non-refundable. If an end user has a question about their payment they can contact
[support](mailto:support@8thwall.com).

## Using 8th Wall Payments in your project {#using-8th-wall-payments-in-your-project}

8th Wall Payments leverages Stripe Connect for secure payment processing. In order to start building
web apps with paid content, you must sign-up for a Stripe Connect account through 8th Wall. This is
required to take advantage of 8th Wall Payments in order to get paid out.

Sign Up for Payments API on your Accounts Page

1. Head to your Accounts Page
1. Under Payments API select the country for your bank or debit card.
1. Click "Start Here"
![payment-api-setting](/images/payment-api-setting.png)
1. You will be directed to Stripe Connect. Follow the prompts to fill in all required fields. You will need to provide:
    1. Email
    1. Phone Number
    1. Details for Individual or Business
        1. Individual - Your date of birth and Home Address, Social Security number
        1. Business Name
    1. Industry,Website or Product Description
    1. Bank Account or Debit Card information where you will collect payments

After you send in your complete information, it may take several days for Stripe to process and validate your information. You can check back the status of your account on the Accounts screen.

Once confirmed, you will see your bank account information on your Accounts page

#### Manage Payments API Stripe Connect Account {#manage-payments-api-stripe-connect-account}

You can view your payment details for money earned across all of your workspace web apps on the Accounts page under the Payments API overview section.

Accounts page Payment API Overview

- Bank Account - the bank account or debit card where your payout will deposit
- Total Amount - the total amount of money you have collected from all of your web apps
- Payout Date - the day of the month when you will receive your Payout. View Payout Dates for schedule.
- Next Payout Amount - the total amount of money you will receive on the next Payout Date
- Pending Amount - the total amount that you have received and is on hold for processing. It is not yet ready to be sent out in the next payout

To view your Stripe Connect account click **Go to Stripe**.

To update your Stripe Account payment information, such as address or bank account information, click on **Update Information**.

To see individual payments from your web apps, click **View History**.

#### Payments Module {#payments-module}

Once you have signed up for 8th Wall Payments, you will need to import the Payments Module into your project in order to access the Payments API.

To import the Payments Module:

1. Open a Cloud Editor project
2. Click the + sign next to the “Modules”' section in the left hand navigation of the Cloud Editor.
3. Search for “Payments” and import the module into your project.

You are now ready to add paid content into your project!

#### Configurations {#configurations}

The Payments Module allows you to easily customize what type of payment option you want, the cost, the product, and more. You can also turn on Test Mode so you can ensure your payments work as expected.

#### Test Mode {#test-mode}

Test mode enables you to simulate purchases made on your web app prior to launching publicly. Turning on Test Mode allows you to integrate the Payments API in their apps, without having to make real purchases.

Configurations for Test Mode:

Configuration | Type | Default | Description
-------- | ----------- | ------- | ----------
Test Mode Enabled | `Boolean` | `false` | If True - You are simulating purchases in your product, payments are not on the server but cached locally <br /> If False - Test Mode is off |
Clear Test Purchases on Run | `Boolean` | `false` | If True - Test Mode purchases will be deleted so you can retest the purchase experience <br /> If False - Test purchase will remain on local storage until cleared. This is useful for testing existing purchase flows.

#### Access Pass {#access-pass}

This payment type offers users paid access to AR or VR content for a limited period of time. Access passes are well suited to enable paid access to AR/VR events such as a 1-day ticket to a holographic concert or a virtual art exhibit or 7-day access to an AR-enabled scavenger hunt.

In the end user experience, the user will:

1. View the Access Pass Prompt or the prompt to purchase the product
2. Click CTA will open up checkout flow hosted on 8thwall.com
3. Allows users to purchase a product for a specific price
4. Save the purchase on local device storage until the preconfigured time period

Configurations for Access Pass Defaults

Configuration | Type | Default | Description
-------- | ----------- | ------- | ----------
Access Duration Days | `Number` | `1` | The number of days that this purchase is valid for. Minimum duration is 1 day, maximum duration is 7 days.
Amount | `Number` | `0.99` | The amount to request for payment for the specified Access Pass.<br/>Amounts have a respective minimum and maximum as defined by the Currency.<br/>**AUD**: $0.99 to $99.99<br/>**CAD**: $0.99 to $99.99<br/>**GBP**: £0.99 to £99.99<br/>**JPY**: ¥99 to ¥999<br/>**NZD**: $0.99 to $99.99<br/>**USD**: $0.99 to $99.99
Access Pass Name | `String` | `'N/A'` | The name of the product. This will be used in the checkout form to describe to the user what they’re purchasing.
Currency | `String` | `'usd'` | The currency to charge the user. Can be `'aud'`, `'cad'`, `'gbp'`, `'jpy'`, `'nzd'`, or `'usd'`.
Checkout Page Language | `String` | `'en-US'` | The language that appears to the end user on the secure checkout page. Can be `'en-US'` (English - United States) or `'ja-JP'` (Japanese).
