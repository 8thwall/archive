import unionBy from 'lodash/unionBy'
import orderBy from 'lodash/orderBy'

import {
  InvoicesAction,
  InvoicesMessage,
  InvoicesReduxState,
  InvoicesReducerFunction,

  // Actions.
  GetInvoicesAction,
  GetUpcomingAppLicenseInvoicesAction,
  GetUpcomingAppLicenseInvoicePreviewAction,
  GetUpcomingPlanInvoiceAction,
  GetAccountPlanChangeInvoicePreviewAction,
  SetErrorAction,
  SetPendingAction,

  // Action types.
  ACCOUNTS_SELECT,
  GET_INVOICES,
  GET_UPCOMING_APP_LICENSE_INVOICES,
  GET_UPCOMING_APP_LICENSE_INVOICE_PREVIEW,
  GET_UPCOMING_PLAN_INVOICE,
  GET_ACCOUNT_PLAN_CHANGE_INVOICE_PREVIEW,
  SET_ERROR,
  SET_PENDING,
} from './types'

const initialState: InvoicesReduxState = {
  invoices: [],
  upcomingAppLicenseInvoices: [],
  pending: {},
  error: {},
}

const getInvoices = (
  state: InvoicesReduxState,
  action: GetInvoicesAction
): InvoicesReduxState => ({
  ...state,
  // Replace any invoice with a duplicate ID with the newly fetched invoice.
  invoices: orderBy(unionBy(action.invoices, state.invoices, 'id'), ['created'], 'desc'),
  hasMore: action.hasMore,
})

const getUpcomingAppLicenseInvoices = (
  state: InvoicesReduxState,
  action: GetUpcomingAppLicenseInvoicesAction
): InvoicesReduxState => ({
  ...state,
  upcomingAppLicenseInvoices: action.upcomingAppLicenseInvoices,
})

const getUpcomingAppLicenseInvoicePreview = (
  state: InvoicesReduxState,
  action: GetUpcomingAppLicenseInvoicePreviewAction
): InvoicesReduxState => ({
  ...state,
  upcomingAppLicenseInvoicePreview: action.upcomingAppLicenseInvoicePreview,
})

const getUpcomingPlanInvoice = (
  state: InvoicesReduxState,
  action: GetUpcomingPlanInvoiceAction
): InvoicesReduxState => ({
  ...state,
  upcomingPlanInvoice: action.upcomingPlanInvoice,
})

const getAccountPlanChangeInvoicePreview = (
  state: InvoicesReduxState,
  action: GetAccountPlanChangeInvoicePreviewAction
): InvoicesReduxState => ({
  ...state,
  accountPlanChangeInvoicePreview: action.accountPlanChangeInvoicePreview,
})

const setPending = (
  state: InvoicesReduxState,
  action: SetPendingAction
): InvoicesReduxState => ({
  ...state,
  pending: {
    ...state.pending,
    ...action.pending,
  },
})

const setError = (
  state: InvoicesReduxState,
  action: SetErrorAction
): InvoicesReduxState => ({
  ...state,
  error: {
    ...state.error,
    ...action.error,
  },
})

const clearInvoices = (): InvoicesReduxState => ({
  ...initialState,
})

const actions: Record<InvoicesMessage, InvoicesReducerFunction> = {
  [GET_INVOICES]: getInvoices,
  [GET_UPCOMING_APP_LICENSE_INVOICES]: getUpcomingAppLicenseInvoices,
  [GET_UPCOMING_APP_LICENSE_INVOICE_PREVIEW]: getUpcomingAppLicenseInvoicePreview,
  [GET_UPCOMING_PLAN_INVOICE]: getUpcomingPlanInvoice,
  [GET_ACCOUNT_PLAN_CHANGE_INVOICE_PREVIEW]: getAccountPlanChangeInvoicePreview,
  [SET_PENDING]: setPending,
  [SET_ERROR]: setError,
  [ACCOUNTS_SELECT]: clearInvoices,
}

const Reducer = (state = {...initialState}, action: InvoicesAction): InvoicesReduxState => {
  const handler = actions[action.type]
  if (!handler) {
    return state
  }
  return handler(state, action)
}

export default Reducer
