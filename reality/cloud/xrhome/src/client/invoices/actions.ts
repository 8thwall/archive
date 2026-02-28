import {batch} from 'react-redux'

import authenticatedFetch from '../common/authenticated-fetch'
import {dispatchify} from '../common'
import type {DispatchifiedActions} from '../common/types/actions'
import type {IAccount} from '../common/types/models'
import {
  GET_INVOICES,
  SET_PENDING,
  SET_ERROR,
  GET_UPCOMING_PLAN_INVOICE,
  GET_UPCOMING_APP_LICENSE_INVOICE_PREVIEW,
  GET_UPCOMING_APP_LICENSE_INVOICES,
  GET_ACCOUNT_PLAN_CHANGE_INVOICE_PREVIEW,
} from './types'

const getInvoices = (
  account: IAccount,
  options?: {limit?: number, startingAfter?: string}
) => async (dispatch) => {
  batch(() => {
    dispatch({type: SET_PENDING, pending: {invoices: true}})
    dispatch({type: SET_ERROR, error: {invoices: false}})
  })

  const limitQuery = options?.limit && `limit=${options.limit}`
  const startingAfterQuery = options?.startingAfter && `startingAfter=${options.startingAfter}`
  let queryString = ''
  if (limitQuery && startingAfterQuery) {
    queryString = `?${limitQuery}&${startingAfterQuery}`
  } else if (limitQuery || startingAfterQuery) {
    queryString = limitQuery ? `?${limitQuery}` : `?${startingAfterQuery}`
  }
  const url = `/v1/billing/${account.uuid}/invoices${queryString}`

  try {
    const {invoices, hasMore} = await dispatch(authenticatedFetch(url, {method: 'GET'}))
    dispatch({type: GET_INVOICES, invoices, hasMore})
  } catch (err) {
    dispatch({type: SET_ERROR, error: {invoices: true}})
  } finally {
    dispatch({type: SET_PENDING, pending: {invoices: false}})
  }
}

const getOpenSubscriptionInvoices = (account: IAccount) => async (dispatch) => {
  const params = new URLSearchParams({
    status: 'open',
    subscription: account.accountSubscriptionId,
    limit: '1',
  })
  const url = `/v1/billing/${account.uuid}/invoices?${params.toString()}`
  const {invoices} = await dispatch(authenticatedFetch(url, {method: 'GET'}))
  return invoices
}

const getUpcomingPlanInvoice = (account: IAccount) => async (dispatch) => {
  batch(() => {
    dispatch({type: SET_PENDING, pending: {upcomingPlanInvoice: true}})
    dispatch({type: SET_ERROR, error: {upcomingPlanInvoice: false}})
  })

  const url = `/v1/billing/${account.uuid}/upcomingPlanInvoice`

  try {
    const {upcomingPlanInvoice} = await dispatch(authenticatedFetch(url, {method: 'GET'}))
    dispatch({type: GET_UPCOMING_PLAN_INVOICE, upcomingPlanInvoice})
  } catch (err) {
    dispatch({type: SET_ERROR, error: {upcomingPlanInvoice: true}})
  } finally {
    dispatch({type: SET_PENDING, pending: {upcomingPlanInvoice: false}})
  }
}

const getUpcomingAppLicenseInvoices = (account: IAccount) => async (dispatch) => {
  batch(() => {
    dispatch({type: SET_PENDING, pending: {upcomingAppLicenseInvoices: true}})
    dispatch({type: SET_ERROR, error: {upcomingAppLicenseInvoices: false}})
  })
  const url = `/v1/apps-billing/${account.uuid}/upcomingAppLicenseInvoices`

  try {
    const {upcomingAppLicenseInvoices} = await dispatch(authenticatedFetch(url, {method: 'GET'}))
    dispatch({type: GET_UPCOMING_APP_LICENSE_INVOICES, upcomingAppLicenseInvoices})
  } catch (err) {
    dispatch({type: SET_ERROR, error: {upcomingAppLicenseInvoices: true}})
  } finally {
    dispatch({type: SET_PENDING, pending: {upcomingAppLicenseInvoices: false}})
  }
}

const getUpcomingAppLicenseInvoicePreview = (
  account: IAccount, prices: string[]
) => async (dispatch) => {
  batch(() => {
    dispatch({type: SET_PENDING, pending: {upcomingAppLicenseInvoicePreview: true}})
    dispatch({type: SET_ERROR, error: {upcomingAppLicenseInvoicePreview: false}})
  })
  const url = `/v1/apps-billing/${account.uuid}/upcomingInvoicePreview`

  try {
    const {upcomingInvoicePreview: upcomingAppLicenseInvoicePreview} =
      await dispatch(authenticatedFetch(url, {
        method: 'POST',
        body: JSON.stringify({prices}),
      }))
    dispatch({type: GET_UPCOMING_APP_LICENSE_INVOICE_PREVIEW, upcomingAppLicenseInvoicePreview})
  } catch (err) {
    dispatch({type: SET_ERROR, error: {upcomingAppLicenseInvoicePreview: true}})
  } finally {
    dispatch({type: SET_PENDING, pending: {upcomingAppLicenseInvoicePreview: false}})
  }
}

const getAccountPlanChangeInvoicePreview = (
  account: IAccount,
  accountType: string,
  priceId: string,
  paymentMethod?: string,
  promoCode?: string
) => async (dispatch) => {
  batch(() => {
    dispatch({type: SET_PENDING, pending: {accountPlanChangeInvoicePreview: true}})
    dispatch({
      type: SET_ERROR,
      error: {accountPlanAppliedPromoCode: false, accountPlanChangeInvoicePreview: false},
    })
  })

  const params = new URLSearchParams({
    accountType,
    priceId,
    ...(paymentMethod ? {paymentMethod} : {}),
    ...(promoCode ? {promoCode} : {}),
  })
  const url = `/v1/billing/${account.uuid}/upcomingPlanInvoice?${params}`

  try {
    const {upcomingPlanInvoice: accountPlanChangeInvoicePreview} =
      await dispatch(authenticatedFetch(url))
    dispatch({type: GET_ACCOUNT_PLAN_CHANGE_INVOICE_PREVIEW, accountPlanChangeInvoicePreview})
  } catch (err) {
    if (err.status === 403 && promoCode) {
      dispatch({type: SET_ERROR, error: {accountPlanAppliedPromoCode: true}})
    } else {
      dispatch({type: SET_ERROR, error: {accountPlanChangeInvoicePreview: true}})
    }
  } finally {
    dispatch({type: SET_PENDING, pending: {accountPlanChangeInvoicePreview: false}})
  }
}

const rawActions = {
  getInvoices,
  getUpcomingAppLicenseInvoices,
  getUpcomingAppLicenseInvoicePreview,
  getUpcomingPlanInvoice,
  getAccountPlanChangeInvoicePreview,
  getOpenSubscriptionInvoices,
}

export type InvoicesActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
