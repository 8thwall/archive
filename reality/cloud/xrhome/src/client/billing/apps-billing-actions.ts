import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {DispatchifiedActions} from '../common/types/actions'
import {rawActions as billingActions} from './billing-actions'

const upgradeAppWithContracts = (
  appUuid,
  paymentSource,  // Uses Stripe Sources API.
  paymentMethod,  // Uses Stripe PaymentMethods API.
  subscriptionContractUuid,
  invoiceContractUuid,
  contractTierUuids,
  hasRecurringLicense
) => async (dispatch, getState) => {
  let result
  try {
    result = await dispatch(authenticatedFetch('/v1/apps-billing/upgrade', {
      method: 'PATCH',
      body: JSON.stringify({
        AccountUuid: getState().accounts.selectedAccount,
        subscriptionContractUuid,
        invoiceContractUuid,
        contractTierUuids,
        paymentSource,
        paymentMethod,
        appUuid,
        hasRecurringLicense,
      }),
    }))
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
    throw err
  }

  const {account, invoice, upcomingInvoice, scheduledSubscriptions, app} = result
  if (app.commercialStatus === 'DEVELOP') {
    window.dataLayer.push({event: 'devLicenseUpgrade'})
  } else if (app.commercialStatus === 'LAUNCH') {
    window.dataLayer.push({event: 'launchLicenseUpgrade'})
  }
  if (account) {
    dispatch({type: 'UPDATE_ACCOUNT', account})
  }
  if (scheduledSubscriptions?.completed) {
    dispatch({
      type: 'BILLING_SCHEDULED_SUBSCRIPTIONS_REMOVE',
      scheduledSubscriptions: scheduledSubscriptions.completed,
    })
  }
  if (scheduledSubscriptions?.created) {
    dispatch({
      type: 'BILLING_SCHEDULED_SUBSCRIPTIONS_ADD',
      scheduledSubscriptions: [scheduledSubscriptions.created],
    })
  }
  dispatch({type: 'APP_COMMERCIAL_UPGRADE', app})
  dispatch({
    type: 'BILLING_COMMERCIAL_LICENSE_PURCHASED',
    invoiceInfo: invoice,
    upcomingInvoiceInfo: upcomingInvoice,
  })
  dispatch({
    type: 'SUCCESS',
    /* eslint-disable local-rules/hardcoded-copy */
    msg: 'Success! Your White Label subscription is active. ' +
        'To remove branding and splash screen, republish your project.',
    /* eslint-enable local-rules/hardcoded-copy */
  })
}

const cancelAppLicense = (appName, uuid) => (dispatch) => {
  dispatch({type: 'APPS_LOADING', loading: true})
  dispatch(authenticatedFetch('/v1/apps-billing/cancel', {
    method: 'POST', body: JSON.stringify({AppUuid: uuid}),
  })).then(({account, prevCommercialStatus, scheduledSubscriptions, app}) => {
    if (prevCommercialStatus === 'DEVELOP') {
      window.dataLayer.push({event: 'devLicenseCancel'})
    } else if (prevCommercialStatus === 'LAUNCH') {
      window.dataLayer.push({event: 'launchLicenseCancel'})
    }
    if (account) {
      dispatch({type: 'UPDATE_ACCOUNT', account})
    }
    if (scheduledSubscriptions) {
      dispatch({type: 'BILLING_SCHEDULED_SUBSCRIPTIONS_REMOVE', scheduledSubscriptions})
    }
    dispatch({type: 'APPS_UPDATE', app})
    dispatch({type: 'APPS_LOADING', loading: false})
    dispatch({type: 'SUCCESS', msg: `${appName} has been canceled.`})
  }).catch((err) => {
    dispatch({type: 'APPS_LOADING', loading: false})
    return dispatch({type: 'ERROR', msg: err.message})
  })
}

const changePaymentMethod = (
  AppUuid,
  subscriptionId,
  paymentMethodId
) => async (dispatch, getState) => {
  dispatch({type: 'BILLING_UPDATING', billingUpdating: true})
  const AccountUuid = getState().accounts.selectedAccount
  const UserUuid = getState().user.uuid

  try {
    await dispatch(
      authenticatedFetch(
        '/v1/apps-billing/changePaymentMethod',
        {
          method: 'PUT',
          body: JSON.stringify({
            AccountUuid,
            UserUuid,
            subscriptionId,
            AppUuid,
            paymentMethod: paymentMethodId,
          }),
        }
      )
    )
    await dispatch(billingActions.getBilling())
    await dispatch({type: 'BILLING_UPDATING', billingUpdating: false})
  } catch (err) {
    dispatch({type: 'BILLING_UPDATING', billingUpdating: false})
    dispatch({type: 'ERROR', msg: err.message})
    throw (err.message)
  }
}

const fetchAppBilledUsage = app => dispatch => dispatch(
  authenticatedFetch(`/v1/apps-billing/usage/${app.uuid}`)
)
  .then(data => dispatch({
    type: 'APP_BILLED_USAGE_SET',
    appKey: app.appKey,
    data,
  }))

const fetchAppSubscription = app => dispatch => dispatch(
  authenticatedFetch(`/v1/apps-billing/subscription/${app.uuid}`)
).then(result => dispatch({
  type: 'BILLING_APP_SUBSCRIPTION_SET',
  appKey: app.appKey,
  subscription: result,
})).catch(e => console.error(e.message))

const changeAppCampaignDuration = (app, endingAt, durationType) => dispatch => dispatch(
  authenticatedFetch(`/v1/apps-billing/duration/${app.uuid}`, {
    method: 'POST',
    body: JSON.stringify({endingAt, durationType}),
  })
).then(result => Promise.all([
  dispatch({
    type: 'BILLING_APP_SUBSCRIPTION_SET',
    appKey: result.app.appKey,
    subscription: result.subscription,
  }),
  dispatch({
    type: 'APPS_UPDATE',
    app: result.app,
  }),
]))

const upgradeEnterpriseApp = (appUuid: string) => async (dispatch) => {
  try {
    dispatch({type: 'APPS_LOADING', loading: true})
    const res = await dispatch(
      authenticatedFetch(`/v1/apps-billing/enterprise/upgrade/${appUuid}`, {method: 'PATCH'})
    )
    dispatch({type: 'APPS_UPDATE', app: res.app})
    /* eslint-disable local-rules/hardcoded-copy */
    dispatch({
      type: 'SUCCESS',
      msg: 'Success! Your White Label subscription is active. ' +
        'To remove branding and splash screen, republish your project.',
    })
    /* eslint-enable local-rules/hardcoded-copy */
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  } finally {
    dispatch({type: 'APPS_LOADING', loading: false})
  }
}

const reactivateWithSplashScreen = (appUuid: string) => async (dispatch) => {
  try {
    dispatch({type: 'APPS_LOADING', loading: true})
    const res = await dispatch(
      authenticatedFetch(`/v1/apps-billing/buildWithSplashScreen/${appUuid}`, {method: 'PATCH'})
    )
    dispatch({type: 'APPS_UPDATE', app: res.app})
    /* eslint-disable local-rules/hardcoded-copy */
    dispatch({
      type: 'SUCCESS',
      msg: `Success! Your project ${res.app.appName} has been relaunched with ` +
      'the default splash screen!',
    })
    /* eslint-enable local-rules/hardcoded-copy */
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  } finally {
    dispatch({type: 'APPS_LOADING', loading: false})
  }
}

export const rawActions = {
  upgradeAppWithContracts,
  cancelAppLicense,
  changePaymentMethod,
  fetchAppBilledUsage,
  fetchAppSubscription,
  changeAppCampaignDuration,
  upgradeEnterpriseApp,
  reactivateWithSplashScreen,
}

export type AppsBillingActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
