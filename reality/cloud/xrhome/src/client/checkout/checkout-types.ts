import type {PaymentIntent} from '@stripe/stripe-js'

type CheckoutPaymentMethod = {
  last4: string
  type: string
}

type CheckoutOrder = {
  app: {
    title: string
  }
  product: {
    amount: number
    currency: string
    productId: string
    name: string
    expirationTimeMillis: number
  }
  orderId?: string
  paymentMethod?: CheckoutPaymentMethod
  status: PaymentIntent.Status
  completedAt?: number
  clientSecret?: string
}

// Redux Action Types
enum CheckoutActionType {
  ORDER = 'CHECKOUT/ORDER',
  SUCCESS = 'CHECKOUT/SUCCESS',
  PENDING = 'CHECKOUT/PENDING',
  ERROR = 'CHECKOUT/ERROR',
  CLEAR = 'CHECKOUT/CLEAR',
}

// Top-level redux state.
type CheckoutReduxState = {
  order: CheckoutOrder | null
  pending: PendingState
  error: ErrorState
}

type ErrorState = {
  fetchOrder?: boolean
}

type PendingState = {
  fetchOrder?: boolean
}

// Action Creators
type OrderAction = {
  type: CheckoutActionType.ORDER
  order: CheckoutOrder
}

type SuccessAction = {
  type: CheckoutActionType.SUCCESS
  paymentMethod: CheckoutPaymentMethod
  completedAt: number
}

type PendingAction = {
  type: CheckoutActionType.PENDING
  pending: PendingState
}

type ErrorAction = {
  type: CheckoutActionType.ERROR
  error: ErrorState
}

// Event to send back to the parent window.
type CheckoutSuccessEvent = {
  productId: string
  timestamp: number
}

export {
  CheckoutOrder,
  CheckoutPaymentMethod,
  CheckoutActionType,
  CheckoutReduxState,
  OrderAction,
  SuccessAction,
  PendingAction,
  ErrorAction,
  CheckoutSuccessEvent,
}
