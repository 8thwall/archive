import {batch} from 'react-redux'
import type {Stripe} from '@stripe/stripe-js'

import {dispatchify, onError} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {DispatchifiedActions} from '../common/types/actions'
import type {IAccount} from '../common/types/models'
import {trimBillingInfo} from './billing-utils'

function flattenBilling(billing) {
  const o = {}
  if (billing.tax_info) {
    o['billing.tax_info.type'] = billing.tax_info.type
    o['billing.tax_info.tax_id'] = billing.tax_info.tax_id
  }
  if (billing.address) {
    o['billing.address.line1'] = billing.address.line1
    o['billing.address.line2'] = billing.address.line2
    o['billing.address.city'] = billing.address.city
    o['billing.address.state'] = billing.address.state
    o['billing.address.country'] = billing.address.country
    o['billing.address.postal_code'] = billing.address.postal_code
  }
  if (billing.shipping) {
    o['billing.shipping.phone'] = billing.shipping.phone
    if (billing.shipping.address) {
      o['billing.shipping.address.line1'] = billing.shipping.address.line1
      o['billing.shipping.address.line2'] = billing.shipping.address.line2
      o['billing.shipping.address.city'] = billing.shipping.address.city
      o['billing.shipping.address.state'] = billing.shipping.address.state
      o['billing.shipping.address.country'] = billing.shipping.address.country
      o['billing.shipping.address.postal_code'] = billing.shipping.address.postal_code
    }
  }
  o['billing.description'] = billing.description
  o['billing.email'] = billing.email
  o['billing.phone'] = billing.phone
  o['billing.name'] = billing.name
  o['billing.sources'] = billing.sources
  o['billing.default_source'] = billing.default_source
  return o
}

const getBillingForAccount = (accountUuid: string) => dispatch => (
  dispatch(authenticatedFetch(`/v1/billing/${accountUuid}`))
    .then(({info}) => dispatch({type: 'BILLING_SET', info}))
    .catch(err => dispatch({type: 'ERROR', msg: err.message}))
)

/**
 * @deprecated use getBillingForAccount
 */
const getBilling = () => (dispatch, getState) => getState().accounts.allAccounts.map(a => a.uuid)
  .includes(getState().accounts.selectedAccount) &&
  dispatch(getBillingForAccount(getState().accounts.selectedAccount))

// Create billing info for this workspace if there is no billing for this workspace yet
const addBilling = (accountUuid: string, accountInfo = {}) => async (dispatch) => {
  const accountWithBilling = await dispatch(authenticatedFetch(
    `/v1/billing/${accountUuid}`,
    {method: 'POST', body: JSON.stringify(trimBillingInfo(accountInfo))}
  ))
  dispatch({type: 'ACCOUNTS_SET_ONE', account: accountWithBilling})

  return accountWithBilling
}

const getCardErrorMessage = (error) => {
  if (error.code !== 'card_declined' || error.decline_code !== 'generic_decline') {
    return error.message
  }

  // eslint-disable-next-line camelcase
  const {payment_method} = error
  if (payment_method.card.funding === 'prepaid') {
    return 'Card declined. Prepaid cards are currently not accepted. ' +
      'Please try again with a credit card.'
  } else {
    return 'We aren’t able to process your card. Make sure that your ' +
      'information is correct or try a different payment method.'
  }
}

const getPaymentSetupIntent = (
  accountUuid: string
) => async (dispatch) => {
  const url = `/v1/billing/${accountUuid}/card_intent`
  const {secret} = await dispatch(authenticatedFetch(url, {method: 'GET'}))
  return secret
}

const addPaymentMethod = (
  stripe,
  elements,
  accountUuid: string
) => async (dispatch) => {
  dispatch({type: 'BILLING_PENDING', pending: true})
  try {
    const result = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
    })
    if (result.error) {
      throw new Error(getCardErrorMessage(result.error))
    }
    await dispatch(getBillingForAccount(accountUuid))
    batch(() => {
      dispatch({
        type: 'BILLING_LATEST_PAYMENT_METHOD_ADDED',
        latestPaymentMethod: result.setupIntent.payment_method,
      })
      dispatch({type: 'BILLING_PENDING', pending: false})
    })
    return result.setupIntent.payment_method
  } catch (e) {
    dispatch({type: 'ERROR', msg: e.message})
    dispatch({type: 'BILLING_PENDING', pending: false})
    throw e
  }
}

const deletePaymentMethod = (
  paymentMethod,
  replacementPaymentMethod,
  defaultPaymentMethod,
  AppUuids
) => async (dispatch, getState) => {
  try {
    const body = JSON.stringify({
      paymentMethod,
      replacementPaymentMethod,
      defaultPaymentMethod,
      AppUuids,
    })
    await dispatch(
      authenticatedFetch(
        `/v1/billing/paymentMethod/${getState().accounts.selectedAccount}`,
        {method: 'DELETE', body}
      )
    )
    return dispatch(getBilling())
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const updateBilling = (flattenedBilling, accountUuid = null) => (dispatch, getState) => dispatch(
  authenticatedFetch(`/v1/billing/${accountUuid || getState().accounts.selectedAccount}`,
    {method: 'PATCH', body: JSON.stringify(trimBillingInfo(flattenedBilling))})
).then((info) => {
  dispatch({type: 'BILLING_INFO_SET', info})
  return info
}).catch((err) => {
  // Server responds with 422 if the customer's location is unrecognizable.
  // Throw and let callers decide how they want to handle unrecognizable locations.
  if (err.status === 422) {
    throw err
  }
  dispatch({type: 'ERROR', msg: err.message})
})

const addBillingWithPaymentMethod = (
  stripe,
  cardElement,
  accountUuid,
  flattenedBilling
) => async (dispatch) => {
  dispatch({type: 'ACKNOWLEDGE_ERROR'})
  dispatch({type: 'BILLING_PENDING', pending: true})

  try {
    const accountWithBilling = await dispatch(
      authenticatedFetch(`/v1/billing/${accountUuid}`, {method: 'POST'})
    )

    const {secret} = await dispatch(
      authenticatedFetch(`/v1/billing/${accountUuid}/card_intent`, {method: 'GET'})
    )
    const {error, setupIntent} = await stripe.confirmCardSetup(secret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: flattenedBilling['billing.description'],
        },
      },
    })

    if (error) {
      throw error
    }

    const paymentMethod = setupIntent.payment_method
    const body = {
      ...trimBillingInfo(flattenedBilling),
      'billing.invoice_settings.default_payment_method': paymentMethod,
    }

    const info = await dispatch(
      authenticatedFetch(
        `/v1/billing/${accountUuid}`,
        {method: 'PATCH', body: JSON.stringify(body)}
      )
    )

    dispatch({type: 'BILLING_INFO_SET', info})
    dispatch({type: 'ACCOUNTS_SET_ONE', account: accountWithBilling})
    dispatch({type: 'BILLING_PENDING', pending: false})
  } catch (e) {
    dispatch({type: 'BILLING_PENDING', pending: false})
    dispatch({type: 'ERROR', msg: e.message})
    throw e
  }
}

const downgrade = (account, dispatch) => {
  dispatch({type: 'BILLING_DOWNGRADE_PENDING', pending: true})
  const route = `/v1/billing/downgrade/eoc/${account}`
  return dispatch(authenticatedFetch(route, {method: 'PATCH'}))
    .then(({account}) => {
      dispatch({type: 'ACCOUNTS_SET_ONE', account})
      dispatch({type: 'BILLING_DOWNGRADE_PENDING', pending: false})
      window.dataLayer.push({event: 'downgradeEndOfCycle'})
    })
    .catch((err) => {
      dispatch({type: 'ERROR', msg: err.message})
      dispatch({type: 'BILLING_DOWNGRADE_PENDING', pending: false})
      throw (err)
    })
}

const downgradeEndOfCycle = () => (dispatch, getState) => downgrade(
  getState().accounts.selectedAccount,
  dispatch
)

const reactivateBilling = () => (dispatch, getState) => {
  dispatch({type: 'BILLING_REACTIVATE_PENDING', pending: true})
  const route = `/v1/billing/reactivate/${getState().accounts.selectedAccount}`
  return dispatch(authenticatedFetch(route, {method: 'PATCH'}))
    .then(({account}) => {
      dispatch({type: 'ACCOUNTS_SET_ONE', account})
      dispatch({type: 'BILLING_REACTIVATE_PENDING', pending: false})
      window.dataLayer.push({event: 'reactivateWebDeveloperPro'})
    })
    .catch((err) => {
      dispatch({type: 'ERROR', msg: err.message})
      dispatch({type: 'BILLING_REACTIVATE_PENDING', pending: false})
      throw (err)
    })
}

const loadAccountLevelBilledUsage = account => (dispatch) => {
  const url = `/v1/billing/${account.uuid}/usage`
  dispatch(authenticatedFetch(url, {method: 'GET'})).then((usage) => {
    dispatch({type: 'BILLING_ACCOUNT_BILLED_USAGE', uuid: account.uuid, usage})
  }).catch(err => dispatch({type: 'ERROR', msg: err.message}))
}

const getAccountPlans = account => async (dispatch) => {
  try {
    dispatch({type: 'BILLING_GET_ACCOUNT_PLANS_PENDING', pending: true})
    const url = `/v1/billing/plans/${account.uuid}`
    const {plans} = await dispatch(authenticatedFetch(url, {method: 'GET'}))
    dispatch({type: 'BILLING_GET_ACCOUNT_PLANS', plans})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  } finally {
    dispatch({type: 'BILLING_GET_ACCOUNT_PLANS_PENDING', pending: false})
  }
}

const confirmAccountPlanUpgrade = (
  stripe: Stripe,
  account: IAccount,
  clientSecret: string,
  paymentMethod: string,
  onSuccessfulCheckout: () => void
) => async (dispatch): Promise<boolean> => {
  try {
    dispatch({type: 'BILLING_UPDATE_ACCOUNT_PLAN_PENDING', pending: true})
    const result = await stripe.confirmCardPayment(clientSecret, {payment_method: paymentMethod})
    if (result.error) {
      throw new Error(result.error.message)
    }
    const confirmResult = await dispatch(authenticatedFetch(
      `/v1/billing/confirm-account-plan-upgrade/${account.uuid}`,
      {
        method: 'PATCH',
        body: JSON.stringify({paymentIntent: result.paymentIntent.id}),
      }
    ))

    batch(() => {
      dispatch({
        type: 'BILLING_INFO_SET',
        info: {subscription: confirmResult.subscription},
      })

      dispatch({type: 'UPDATE_ACCOUNT', account: {uuid: account.uuid, ...confirmResult.account}})

      onSuccessfulCheckout()
    })
    return true
  } catch (e) {
    dispatch({type: 'ERROR', msg: e.message})
    return false
  } finally {
    dispatch({type: 'BILLING_UPDATE_ACCOUNT_PLAN_PENDING', pending: false})
  }
}

const updateAccountPlan = (
  stripe: Stripe,
  account: IAccount,
  accountType: string,
  priceId: string,
  paymentMethod?: string,
  promoCode?: string
) => async (dispatch): Promise<boolean> => {
  try {
    dispatch({type: 'BILLING_UPDATE_ACCOUNT_PLAN_PENDING', pending: true})
    const url = `/v1/billing/update-account-plan/${account.uuid}`
    const updateResult = await dispatch(authenticatedFetch(url, {
      method: 'PATCH',
      body: JSON.stringify({accountType, priceId, paymentMethod, promoCode}),
    }))
    const {subscriptionSchedule, invoiceSettings} = updateResult
    let {account: resAccount, subscription} = updateResult

    // Attempt to confirm payment that requires authorization.
    if (subscription?.status === 'incomplete' || subscription?.pending_update) {
      const result = await stripe.confirmCardPayment(
        subscription.latest_invoice.payment_intent.client_secret,
        {payment_method: subscription.latest_invoice.payment_intent.payment_method}
      )
      if (!result.error) {
        const confirmResult = await dispatch(authenticatedFetch(
          `/v1/billing/confirm-account-plan-upgrade/${account.uuid}`,
          {
            method: 'PATCH',
            body: JSON.stringify({paymentIntent: result.paymentIntent.id}),
          }
        ))
        resAccount = confirmResult.account
        subscription = confirmResult.subscription
      } else {
        dispatch({type: 'ERROR', msg: result.error.message})
      }
    }

    batch(() => {
      const billingArgs = {
        ...(subscriptionSchedule ? {accountSubscriptionSchedule: subscriptionSchedule} : {}),
        ...(subscription ? {subscription} : {}),
        ...(invoiceSettings ? {invoice_settings: invoiceSettings} : {}),
      }
      dispatch({
        type: 'BILLING_INFO_SET',
        info: billingArgs,
      })

      dispatch({type: 'UPDATE_ACCOUNT', account: {uuid: account.uuid, ...resAccount}})
    })

    return !subscription || (subscription.status === 'active' && !subscription.pending_update)
  } catch (err) {
    // Server responds with 422 if the customer's location is unrecognizable.
    // Throw and let callers decide how they want to handle unrecognizable locations.
    if (err.status === 422) {
      throw err
    }

    dispatch({type: 'ERROR', msg: err.message})
    return false
  } finally {
    dispatch({type: 'BILLING_UPDATE_ACCOUNT_PLAN_PENDING', pending: false})
  }
}

const deleteScheduledPlan = (account: IAccount) => async (dispatch) => {
  try {
    dispatch({type: 'BILLING_DELETE_SCHEDULED_PLAN_PENDING', pending: true})
    const url = `/v1/billing/scheduled-plan/${account.uuid}`
    await dispatch(authenticatedFetch(url, {method: 'DELETE'}))
    batch(() => {
      dispatch({
        type: 'BILLING_INFO_SET',
        info: {accountSubscriptionSchedule: null},
      })
      dispatch({
        type: 'UPDATE_ACCOUNT',
        account: {uuid: account.uuid, accountSubscriptionScheduleId: null},
      })
    })
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  } finally {
    batch(() => {
      dispatch({type: 'BILLING_DELETE_SCHEDULED_PLAN_PENDING', pending: false})
      dispatch({
        type: 'SUCCESS', msg: 'You have successfully canceled your billing period change.',
      })
    })
  }
}
const clearAccountPlans = () => (dispatch) => {
  try {
    dispatch({type: 'BILLING_CLEAR_ACCOUNT_PLANS'})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const cancelPendingAccountPlan = (
  account: IAccount,
  onCancelSuccess: () => void
) => async (dispatch) => {
  try {
    dispatch({type: 'BILLING_CANCEL_PENDING_PLAN_PENDING', pending: true})
    const url = `/v1/billing/cancel-pending-account-plan/${account.uuid}`
    const {subscription, account: resAccount} = await dispatch(
      authenticatedFetch(url, {method: 'DELETE'})
    )
    batch(() => {
      dispatch({
        type: 'BILLING_INFO_SET',
        info: {subscription: resAccount.accountSubscriptionId ? subscription : null},
      })
      dispatch({
        type: 'UPDATE_ACCOUNT',
        account: {
          uuid: account.uuid,
          accountSubscriptionId: resAccount.accountSubscriptionId,
          accountLicenseSubscriptionItemId: resAccount.accountLicenseSubscriptionItemId,
          lastBillingClose: resAccount.lastBillingClose,
          subscriptionItem: resAccount.subscriptionItem,
          webOrigin: resAccount.webOrigin,
        },
      })
      onCancelSuccess()
    })
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
    throw err
  } finally {
    dispatch({type: 'BILLING_CANCEL_PENDING_PLAN_PENDING', pending: false})
  }
}

const rawActions = {
  getBilling,
  addBillingWithPaymentMethod,
  getBillingForAccount,
  addBilling,
  getPaymentSetupIntent,
  addPaymentMethod,
  deletePaymentMethod,
  downgradeEndOfCycle,
  updateBilling,
  reactivateBilling,
  error: onError,
  loadAccountLevelBilledUsage,
  getAccountPlans,
  confirmAccountPlanUpgrade,
  updateAccountPlan,
  deleteScheduledPlan,
  clearAccountPlans,
  cancelPendingAccountPlan,
}

type BillingActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  rawActions,
  flattenBilling,
}

export type {
  BillingActions,
}
