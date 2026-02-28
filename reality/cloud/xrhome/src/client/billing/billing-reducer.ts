import type {BillingReduxState} from './billing-types'

const initialState: BillingReduxState = {
  billedUsageByAccount: {},
  subscriptionsByApp: {},
  billingUpdating: false,
  upgradePending: false,
  downgradePending: false,
  getAccountPlansPending: false,
  updateAccountPlanPending: false,
  deleteScheduledPlanPending: false,
  cancelPendingPlanPending: false,
  reactivatePending: false,
  scheduledSubscriptions: [],
  paymentMethods: [],
  default_source: '',
  pending: false,
  description: '',
  address: {
    line1: null,
    line2: null,
    city: null,
    state: null,
    postal_code: null,
    country: null,
  },
  phone: null,
  name: null,
  email: null,
  tax_info: null,
  latestInvoiceInfo: null,
  upcomingAppLicenseInvoiceInfo: null,
  accountPlans: {},
  tax: {
    automatic_tax: null,
    ip_address: null,
    location: {
      country: null,
      source: null,
      state: null,
    },
  },
  subscription: null,
  accountSubscriptionSchedule: null,
  latestPaymentMethod: null,
  invoice_settings: null,
}

const Reducer = (state = initialState, action: any): BillingReduxState => {
  switch (action.type) {
    case 'USER_LOGOUT':
      return state

    case 'BILLING_INFO_SET':
      return {...state, ...action.info}

    case 'BILLING_SET':
      return action.info
        ? ({
          billedUsageByAccount: state.billedUsageByAccount,
          subscriptionsByApp: state.subscriptionsByApp,
          upgradePending: state.upgradePending,
          getAccountPlansPending: state.getAccountPlansPending,
          updateAccountPlanPending: state.updateAccountPlanPending,
          deleteScheduledPlanPending: state.deleteScheduledPlanPending,
          accountPlans: state.accountPlans,
          ...action.info,
        })
        : initialState

    case 'BILLING_PENDING':
      return {...state, pending: action.pending}

    case 'BILLING_ACCOUNT_UPGRADE_PENDING':
      return {...state, upgradePending: action.pending}

    case 'BILLING_DOWNGRADE_PENDING':
      return {...state, downgradePending: action.pending}

    case 'BILLING_REACTIVATE_PENDING':
      return {...state, reactivatePending: action.pending}

    case 'BILLING_UPDATING':
      return {...state, billingUpdating: action.billingUpdating}

    case 'BILLING_COMMERCIAL_LICENSE_PURCHASED':
      return {
        ...state,
        latestInvoiceInfo: action.invoiceInfo,
        upcomingAppLicenseInvoiceInfo: action.upcomingInvoiceInfo,
      }

    case 'BILLING_LATEST_PAYMENT_METHOD_ADDED':
      return {...state, latestPaymentMethod: action.latestPaymentMethod}

    case 'BILLING_ACCOUNT_BILLED_USAGE':
      return {
        ...state,
        billedUsageByAccount: {...state.billedUsageByAccount, [action.uuid]: action.usage},
      }

    case 'BILLING_APP_SUBSCRIPTION_SET':
      return {
        ...state,
        subscriptionsByApp: {...state.subscriptionsByApp, [action.appKey]: action.subscription},
      }

    case 'BILLING_SCHEDULED_SUBSCRIPTIONS_ADD': {
      const prevScheduledSubs = state.scheduledSubscriptions || []
      return {
        ...state,
        scheduledSubscriptions: [...prevScheduledSubs, ...action.scheduledSubscriptions],
      }
    }

    case 'BILLING_SCHEDULED_SUBSCRIPTIONS_REMOVE': {
      const prevScheduledSubs = state.scheduledSubscriptions || []
      const removeScheduledSubs = action.scheduledSubscriptions || []
      return {
        ...state,
        scheduledSubscriptions: prevScheduledSubs.filter(
          s => !removeScheduledSubs.find(ns => ns.uuid === s.uuid)
        ),
      }
    }

    case 'BILLING_GET_ACCOUNT_PLANS':
      return {...state, accountPlans: action.plans}

    case 'BILLING_GET_ACCOUNT_PLANS_PENDING':
      return {...state, getAccountPlansPending: action.pending}

    case 'BILLING_UPDATE_ACCOUNT_PLAN_PENDING':
      return {...state, updateAccountPlanPending: action.pending}

    case 'BILLING_DELETE_SCHEDULED_PLAN_PENDING':
      return {...state, deleteScheduledPlanPending: action.pending}

    case 'BILLING_CLEAR_ACCOUNT_PLANS':
      return {...state, accountPlans: {}}

    case 'BILLING_CANCEL_PENDING_PLAN_PENDING':
      return {...state, cancelPendingPlanPending: action.pending}

    default:
      return state
  }
}

export default Reducer
