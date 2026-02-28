enum PaymentApiState {
  NewAccount = 'newaccount',
  Normal = 'normal',
  Pending = 'pending',
  RequirementsError = 'requirementserror',
  Warning = 'warning',
  NetworkError = 'networkerror',
}

// Redux Action Types
enum PayoutActionType {
  DETAILS = 'PAYMENTAPI/DETAILS',
  PENDING = 'PAYMENTAPI/PENDING',
  ERROR = 'PAYMENTAPI/ERROR',
  CLEAR = 'PAYMENTAPI/CLEAR',
}

type DetailsState = {
  connectAccount: {
    defaultCurrency: string
    payoutsEnabled: boolean
    requirements: any[]
    schedule: any
    externalAccount: {
      object: 'card' | 'bank_account'
      last4: string
    }
  }
  payouts: {
    available: number
    pending: number
    lifetimeEarnings: number
  }
}

type ErrorState = {
  message?: string
  status?: number
}

// Top-level redux state.
type PayoutReduxState = {
  payoutDetails: DetailsState
  pending?: boolean
  error: ErrorState
}

// Action Creators
type DetailsAction = {
  type: PayoutActionType.DETAILS
  payoutDetails: DetailsState
}

type PendingAction = {
  type: PayoutActionType.PENDING
  pending: boolean
}

type ErrorAction = {
  type: PayoutActionType.ERROR
  error: ErrorState
}

export {
  PaymentApiState,
  PayoutActionType,
  PayoutReduxState,
  DetailsAction,
  PendingAction,
  ErrorAction,
  DetailsState,
}
