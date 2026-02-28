import type {Stripe} from 'stripe'

interface ErrorState {
  invoices?: boolean
  upcomingPlanInvoice?: boolean
  upcomingAppLicenseInvoices?: boolean
  accountPlanChangeInvoicePreview?: boolean
  accountPlanAppliedPromoCode?: boolean
  upcomingAppLicenseInvoicePreview?: Stripe.Invoice
}

interface PendingState {
  invoices?: boolean
  upcomingPlanInvoice?: boolean
  upcomingAppLicenseInvoices?: boolean
  accountPlanChangeInvoicePreview?: boolean
  upcomingAppLicenseInvoicePreview?: Stripe.Invoice
}

// Top-level redux state.
interface InvoicesReduxState {
  invoices: Stripe.Invoice[]  // Stripe TypeScript type definitions are only supported on versions 8.0.1+
  upcomingAppLicenseInvoices: Stripe.Invoice[]
  upcomingPlanInvoice?: Stripe.Invoice
  accountPlanChangeInvoicePreview?: Stripe.Invoice
  hasMore?: boolean
  pending: PendingState
  error: ErrorState
  upcomingAppLicenseInvoicePreview?: Stripe.Invoice
}

// Action types.
const ACCOUNTS_SELECT = 'ACCOUNTS_SELECT'  // For clearing invoices when switching accounts.
const GET_INVOICES = 'INVOICES/GET'
const GET_UPCOMING_APP_LICENSE_INVOICES = 'INVOICES/GET_UPCOMING_APP_LICENSES'
const GET_UPCOMING_APP_LICENSE_INVOICE_PREVIEW = 'INVOICES/GET_UPCOMING_APP_LICENSE_PREVIEW'
const GET_UPCOMING_PLAN_INVOICE = 'INVOICES/GET_UPCOMING_PLAN'
const GET_ACCOUNT_PLAN_CHANGE_INVOICE_PREVIEW = 'INVOICES/GET_ACCOUNT_PLAN_CHANGE_INVOICE_PREVIEW'
const SET_PENDING = 'INVOICES/SET_PENDING'
const SET_ERROR = 'INVOICES/SET_ERROR'
type InvoicesMessage =
  typeof ACCOUNTS_SELECT |
  typeof GET_INVOICES |
  typeof GET_UPCOMING_APP_LICENSE_INVOICES |
  typeof GET_UPCOMING_APP_LICENSE_INVOICE_PREVIEW |
  typeof GET_UPCOMING_PLAN_INVOICE |
  typeof GET_ACCOUNT_PLAN_CHANGE_INVOICE_PREVIEW |
  typeof SET_PENDING |
  typeof SET_ERROR

// Actions.
interface GetInvoicesAction {
  type: typeof GET_INVOICES
  invoices: any[]
  hasMore: boolean
}

interface GetUpcomingAppLicenseInvoicesAction {
  type: typeof GET_UPCOMING_APP_LICENSE_INVOICES
  upcomingAppLicenseInvoices: any[]
}

interface GetUpcomingAppLicenseInvoicePreviewAction {
  type: typeof GET_UPCOMING_APP_LICENSE_INVOICE_PREVIEW
  upcomingAppLicenseInvoicePreview: any
}

interface GetUpcomingPlanInvoiceAction {
  type: typeof GET_UPCOMING_PLAN_INVOICE
  upcomingPlanInvoice: any
}

interface GetAccountPlanChangeInvoicePreviewAction {
  type: typeof GET_ACCOUNT_PLAN_CHANGE_INVOICE_PREVIEW
  accountPlanChangeInvoicePreview: Stripe.Invoice
}
interface SetPendingAction {
  type: typeof SET_PENDING
  pending: PendingState
}

interface SetErrorAction {
  type: typeof SET_ERROR
  error: ErrorState
}

type InvoicesAction =
  GetInvoicesAction |
  GetUpcomingAppLicenseInvoicesAction |
  GetUpcomingAppLicenseInvoicePreviewAction |
  GetUpcomingPlanInvoiceAction |
  GetAccountPlanChangeInvoicePreviewAction |
  SetPendingAction |
  SetErrorAction

// Reducer function.
type InvoicesReducerFunction = (
  state: InvoicesReduxState,
  action: InvoicesAction
) => InvoicesReduxState

export {
  ErrorState,
  PendingState,
  InvoicesReduxState,
  ACCOUNTS_SELECT,
  GET_INVOICES,
  GET_UPCOMING_APP_LICENSE_INVOICES,
  GET_UPCOMING_APP_LICENSE_INVOICE_PREVIEW,
  GET_UPCOMING_PLAN_INVOICE,
  GET_ACCOUNT_PLAN_CHANGE_INVOICE_PREVIEW,
  SET_PENDING,
  SET_ERROR,
  InvoicesMessage,
  GetInvoicesAction,
  GetUpcomingAppLicenseInvoicesAction,
  GetUpcomingAppLicenseInvoicePreviewAction,
  GetUpcomingPlanInvoiceAction,
  GetAccountPlanChangeInvoicePreviewAction,
  SetPendingAction,
  SetErrorAction,
  InvoicesAction,
  InvoicesReducerFunction,
}
