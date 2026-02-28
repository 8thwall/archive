import stripePromise from './stripe'

import {dispatchify} from '../common'
import authenticatedFetch from '../common/authenticated-fetch'
import type {DispatchifiedActions} from '../common/types/actions'
import type {IAccount} from '../common/types/models'
import {FeatureCategory} from '../../shared/feature-constants'

interface CreateFeatureCheckoutParams {
  account: IAccount
  category: string
  featureName: string
  optionName: string
  quantity?: number
  entityName: string  // Could be account shortName or app appName
  successUrl: string
  cancelUrl: string
}

interface CancelAccountFeatureSubscriptionParams {
  account: IAccount
  featureName: string
  optionName: string
}

const cancelAccountFeatureSubscription = ({
  account, featureName, optionName,
}: CancelAccountFeatureSubscriptionParams) => async (dispatch) => {
  dispatch({type: 'BILLING_CANCEL_PENDING_PLAN_PENDING', pending: true})
  const route = `/v1/features/cancel/${account.uuid}`
  try {
    const {category, entity} = await dispatch(
      authenticatedFetch(route,
        {
          method: 'PATCH',
          body: JSON.stringify({
            entityId: account.uuid,
            category: FeatureCategory.Account,
            featureName,
            optionName,
          }),
        })
    )
    if (category !== FeatureCategory.Account) {
      throw new Error('Category mismatch on cancelling account level subscription')
    }
    dispatch({type: 'ACCOUNTS_SET_ONE', account: entity})
    dispatch({type: 'BILLING_CANCEL_PENDING_PLAN_PENDING', pending: false})
    window.dataLayer.push({event: 'cancelFeatureEndOfCycle'})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
    dispatch({type: 'BILLING_CANCEL_PENDING_PLAN_PENDING', pending: false})
    throw (err)
  }
}

const createFeatureCheckout = ({
  account,
  category,
  featureName,
  optionName,
  quantity,
  entityName,
  successUrl,
  cancelUrl,
}: CreateFeatureCheckoutParams) => async (dispatch) => {
  try {
    const url = `/v1/features/create-checkout/${account.uuid}`
    const {sessionId} = await dispatch(authenticatedFetch(url, {
      method: 'POST',
      body: JSON.stringify({
        category,
        featureName,
        optionName,
        quantity,
        entityName,
        successUrl,
        cancelUrl,
      }),
    }))

    // This could happen:
    // 1. The account does not have a Stripe id
    // 2. The user does not have a billing role
    if (!sessionId) {
      throw new Error('Error creating checkout session')
    }

    const stripe = await stripePromise
    const {error} = await stripe.redirectToCheckout({sessionId})
    if (error) {
      throw new Error(error.message)
    }
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

interface CreateFeaturePortalParams {
  account: IAccount
  returnUrl: string
  configName?: string  // uses default config if not provided
}

const createFeaturePortal = ({
  account,
  returnUrl,
  configName,
}: CreateFeaturePortalParams) => async (dispatch) => {
  try {
    const url = `/v1/features/create-portal/${account.uuid}`
    const requestBody = {
      returnUrl,
      ...(configName && {configName}),
    }
    const {sessionUrl} = await dispatch(authenticatedFetch(url, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    }))

    // This could happen:
    // 1. The account does not have a Stripe id
    // 2. The user does not have a billing role
    if (!sessionUrl) {
      throw new Error('Error creating portal session')
    }

    return sessionUrl
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
    return null
  }
}

interface UpdateFeatureSubscriptionParams {
  account: IAccount
  entityId: string
  category: string
  featureName: string
  optionName: string
}

// TODO(wayne): Connect this to a UI component
const updateFeatureSubscription = ({
  account,
  entityId,
  category,
  featureName,
  optionName,
}: UpdateFeatureSubscriptionParams) => async (dispatch) => {
  try {
    const url = `/v1/features/update-subscription/${account.uuid}`
    const {subscriptionId} = await dispatch(authenticatedFetch(url, {
      method: 'POST',
      body: JSON.stringify({entityId, category, featureName, optionName}),
    }))

    return subscriptionId
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
    return null
  }
}

interface ReactivateAccountFeatureSubscription {
  account: IAccount
  featureName: string
  optionName: string
}

const reactivateAccountFeatureSubscription = ({
  account,
  featureName,
  optionName,
}: ReactivateAccountFeatureSubscription) => async (dispatch) => {
  try {
    dispatch({type: 'BILLING_REACTIVATE_PENDING', pending: true})
    const url = `/v1/features/reactivate-subscription/${account.uuid}`
    const {category: returnedCategory, entity} = await dispatch(authenticatedFetch(url, {
      method: 'PATCH',
      // eslint-disable-next-line local-rules/hardcoded-copy
      body: JSON.stringify({
        entityId: account.uuid,
        category: FeatureCategory.Account,
        featureName,
        optionName,
      }),
    }))
    // eslint-disable-next-line local-rules/hardcoded-copy
    if (returnedCategory === FeatureCategory.Account) {
      dispatch({type: 'ACCOUNTS_SET_ONE', account: entity})
    }
    dispatch({type: 'BILLING_REACTIVATE_PENDING', pending: false})
    window.dataLayer.push({event: 'reactivateFeatureSubscription'})
  } catch (err) {
    dispatch({type: 'ERROR', msg: err.message})
  }
}

const rawActions = {
  createFeatureCheckout,
  createFeaturePortal,
  updateFeatureSubscription,
  cancelAccountFeatureSubscription,
  reactivateAccountFeatureSubscription,
}

type FeatureActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  rawActions,
}

export type {
  FeatureActions,
}
