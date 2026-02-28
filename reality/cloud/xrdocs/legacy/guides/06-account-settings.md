---
id: account-settings
---

# Account Settings

The Account page allows you to:

* [Purchase](#purchase-plan) a Plan subscription.
* [Cancel Plan](#cancel-plan) if you have an active plan subscription.
* [Change Billing Period](#change-billing-period) to switch between monthly or annual billing.
* [Change Plan](#change-plan) if you need to upgrade or downgrade to different plan.
* [Manage commercial licenses](#manage-commercial-licenses)
* [Manage payment methods](#manage-payment-methods)
* [Manage invoices](#invoices) (View, Pay and Download)
* [Update billing information](#update-billing-information)
* [Setup Payments API](./advanced-topics/08-payments-module.md) to monetize your WebAR or WebVR
experiences with 8th Wall Payments.

## Purchase Plan {#purchase-plan}

:::note
**8th Wall subscriptions automatically renew each billing period until you cancel. There are no refunds or credits for partial or unused billing periods.**
:::

Please refer to https://www.8thwall.com/pricing for detailed information on plans and pricing.

For commercial licensing inquiries, please email licensing@8thwall.com

To purchase a plan, please follow these steps:

1. Login to your 8th Wall account, and click "Go to My Projects":

![GoToMyProjects](/images/go-to-my-projects.jpg)

2. Expand your workspace, if not already open.

![SelectWorkspace](/images/console-home-my-workspaces.jpg)

3. Click **Account** in the left navigation.

![SelectAccountNav](/images/console-workspace-nav.jpg)

4. The current plan will be displayed. Click the **Manage Plan** button to expand the plan
management settings.

![ManagePlanClosed](/images/manage-plan-basic.jpg)

5. Find the desired plan and click **Upgrade**:

![SelectPlan](/images/console-workspace-plan-select.jpg)

6. Select a billing interval (1): **Monthly** or **Annually**

7. If you have a **promotion code** (2), enter it and click **Apply**

8. Select a payment method (3), or add a new payment method.

9. Click **Complete Purchase** (4) to activate your paid subscription. **8th Wall subscriptions automatically renew each billing period until you cancel. There are no refunds or credits for partial or unused billing periods.**

![ConfirmPlanPurchase](/images/console-workspace-upgrade-plan.jpg)

## Cancel Plan {#cancel-plan}

:::note
**8th Wall subscriptions automatically renew each billing period until you cancel. There are no refunds or credits for partial or unused billing periods.**
:::

:::note
* The **Starter and Plus plans have been discontinued**.  If you cancel, it is not possible to
re-subscribe to Starter or Plus in the future.
:::

To cancel an existing plan:

1. Login to your 8th Wall account, and click "Go to My Projects":

![GoToMyProjects](/images/go-to-my-projects.jpg)

2. Expand your workspace, if not already open.

![SelectWorkspace](/images/console-home-my-workspaces.jpg)

3. Click **Account** in the left navigation.

![SelectAccountNav](/images/console-workspace-nav.jpg)

4. The Account page will display your **current plan**, **date** and **amount** of next charge.
5. Click **Manage Plan**

![ManagePlan](/images/console-workspace-manage-plan.jpg)

6. Click **Cancel Plan** to disable subscription auto-renew. The subscription will be cancelled at
the **end of the current billing period** and you may continue to use your paid subscription
features through that date.

![AccountCancel](/images/console-workspace-account-cancel.jpg)

:::note
A Pro subscription cannot be canceled while any active commercial licenses are active. Once all
commercial licenses have ended (which will take the projects offline) the Pro subscription can be
set to cancel.
:::

## Change Billing Period {#change-billing-period}

8th Wall plan subscriptions can be paid **monthly** or **annually**.

**Note**: Changes to your billing interval will take effect for the **next billing cycle**.

To switch between monthly and annual billing, please follow these instructions:

1. Login to your 8th Wall account, and click "Go to My Projects":

![GoToMyProjects](/images/go-to-my-projects.jpg)

2. Expand your workspace, if not already open.

![SelectWorkspace](/images/console-home-my-workspaces.jpg)

3. Click **Account** in the left navigation.

![SelectAccountNav](/images/console-workspace-nav.jpg)

4. The Account page will display your **current plan**, **date** and **amount** of next charge.
5. Click **Manage Plan**

![ManagePlanBillingPeriod](/images/console-workspace-manage-plan.jpg)

6. The page will display your current billing interval.  Select a new billing interval, add a promotion code (if applicable), select a payment method, and click **Submit** to schedule your billing period change for the start of the next billing cycle.

![ChangeBillingPeriod](/images/console-workspace-plan-billing-period.jpg)

## Change Plan {#change-plan}

:::note
**8th Wall subscriptions automatically renew each billing period until you cancel. There are no refunds or credits for partial or unused billing periods.**
:::

:::note
* The **Starter and Plus plans have been discontinued**.  If you cancel or upgrade from these legacy
plans it is not possible to switch back at a later date.
* Subscription **upgrades** will take effect **immediately** and you will be charged the pro-rated difference between the current lower plan and the newly selected higher plan.
* Subscripiton **downgrades** are scheduled take effect at the start of the **next billing period**.
:::

If you are on a legacy Starter or Plus plan, and wish to upgrade to Pro:

1. Login to your 8th Wall account, and click "Go to My Projects":

![GoToMyProjects](/images/go-to-my-projects.jpg)

2. Expand your workspace, if not already open.

![SelectWorkspace](/images/console-home-my-workspaces.jpg)

3. Click **Account** in the left navigation.

![SelectAccountNav](/images/console-workspace-nav.jpg)

4. The Account page will display your **current plan**, **date** and **amount** of next charge.
5. Click **Manage Plan**

![ManagePlan](/images/console-workspace-manage-plan-plus.jpg)

6. Click the **Upgrade** button next to the new desired plan.

![PlanUpgradeDowngrade](/images/console-workspace-manage-plan-upgrade-downgrade.jpg)

7. Complete the wizard: select Billing period, add a promotion code (if applicable), select your payment method and confirm your plan change.

## Manage Commercial Licenses {#manage-commercial-licenses}

Commercial licenses and their payment methods can be managed from the Account page of your workspace. This widget will only be displayed if you have active commercial licenses. It allows you to modify the payment method of a commercial license, or cancel it immediately.

1. Login to your 8th Wall account, and click "Go to My Projects":

![GoToMyProjects](/images/go-to-my-projects.jpg)

2. Expand your workspace, if not already open.

![SelectWorkspace](/images/console-home-my-workspaces.jpg)

3. Click **Account** in the left navigation.

![SelectAccountNav](/images/console-workspace-nav.jpg)

### View commercial licenses {#view-commercial-licenses}

The Commercial License widget will display information about all commercial licenses within your workspace:

* Project Name
* Commercial Agreement (Contract)
* Payment Method
* Next Payment (Both amount and date of the next charge)
* Status (Active or Ended)

![Commercial Projects](/images/console-workspace-account-projects.jpg)

### Cancel an active commercial license {#cancel-an-active-commercial-license}

:::warning
Cancelling an active commercial license will **immediately disable** the associated project so it can no longer
be viewed.  This applies to both 8th Wall Hosted and Self-Hosted projects. **This action cannot be undone!**

If you prefer to schedule a future end date to the license, please manage the [Project Duration](/legacy/guides/projects/commercial-licenses-and-campaigns/#campaign-duration) settings for your project instead.
:::

1. Click the **down arrow** icon in the Status column for the desired project.
2. Select **End project now**
3. A warning dialog will be displayed.
4. Type 'END' to confirm you want to **immediately cancel the license (and take the project offline)** and click "OK".

![CommercialProjectEndNow](/images/console-workspace-account-projects-cancel.jpg)

#### Change payment method for an active commercial license {#change-payment-method-for-an-active-commercial-license}

1. Click the **down arrow** icon in the Payment Method column for the desired project.
2. A list of available payment methods will be displayed.  Select a new payment method.

![CommercialProjects](/images/console-workspace-account-projects-edit.jpg)

## Manage Payment Methods {#manage-payment-methods}

The Payment Methods widget allows you to:

* Add a new payment method.
* Set payment method as default (to be used for future charges)
* Remove payment methods.

To add, remove or set a new default payment method:

1. Login to your 8th Wall account, and click "Go to My Projects":

![GoToMyProjects](/images/go-to-my-projects.jpg)

2. Expand your workspace, if not already open.

![SelectWorkspace](/images/console-home-my-workspaces.jpg)

3. Click **Account** in the left navigation.

![SelectAccountNav](/images/console-workspace-nav.jpg)

On this page, you can manage your payment methods as well as the billing information you'd like to
appear on your invoices.

Click "Add payment method" to add a new credit card to your account. If you would like this newly
added credit card to be used for future bills, make sure to click "Make Default"

![PaymentMethods](/images/console-workspace-account-payment-methods.jpg)

## Invoices {#invoices}

The Invoices widget on the Account page allows you to view and download invoices, and make payments
for any outstanding invoices.

To access the invoices associated with your account:

1. Login to your 8th Wall account, and click "Go to My Projects":

![GoToMyProjects](/images/go-to-my-projects.jpg)

2. Expand your workspace, if not already open.

![SelectWorkspace](/images/console-home-my-workspaces.jpg)

3. Click **Account** in the left navigation.

![SelectAccountNav](/images/console-workspace-nav.jpg)

The following information is displayed:

* Invoice Number (click to download PDF invoice)
* Date
* Invoice Total
* Amount Paid
* Balance Due
* Link to view receipt
* Invoice Status

![Commercial Projects](/images/console-workspace-account-invoices.jpg)

## Update Billing Information {#update-billing-information}

The "Billing Information" section of the Account page allows you to specify contact information
you'd like to appear on future invoices and the email address you would like invoices/receipts sent
to.

:::note
Updated billing information will be reflected on **future invoices/receipts**.
:::

To update account billing information:

1. Login to your 8th Wall account, and click "Go to My Projects":

![GoToMyProjects](/images/go-to-my-projects.jpg)

2. Expand your workspace, if not already open.

![SelectWorkspace](/images/console-home-my-workspaces.jpg)

3. Click **Account** in the left navigation.

![SelectAccountNav](/images/console-workspace-nav.jpg)

4. Click **Edit** to modify your billing information.

![BillingInformation](/images/console-workspace-account-invoice-details.jpg)

5. Click **Update** to save your changes.