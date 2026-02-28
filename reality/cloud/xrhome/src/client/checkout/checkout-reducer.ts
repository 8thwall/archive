import {
  CheckoutActionType, CheckoutReduxState, OrderAction,
  SuccessAction, PendingAction, ErrorAction,
} from './checkout-types'

const initialState: CheckoutReduxState = {
  order: null,
  pending: {},
  error: {},
}

const setOrder = (
  state: CheckoutReduxState,
  action: OrderAction
): CheckoutReduxState => ({
  ...state,
  order: action.order,
})

const setOrderSuccess = (
  state: CheckoutReduxState,
  action: SuccessAction
): CheckoutReduxState => ({
  ...state,
  order: {
    ...state.order,
    paymentMethod: action.paymentMethod,
    completedAt: action.completedAt,
    status: 'succeeded',
  },
})

const setPending = (
  state: CheckoutReduxState,
  action: PendingAction
): CheckoutReduxState => ({
  ...state,
  pending: {
    ...state.pending,
    ...action.pending,
  },
})

const setError = (
  state: CheckoutReduxState,
  action: ErrorAction
): CheckoutReduxState => ({
  ...state,
  error: {
    ...state.error,
    ...action.error,
  },
})

const clearOrder = (): CheckoutReduxState => ({...initialState})

const actions = {
  [CheckoutActionType.ORDER]: setOrder,
  [CheckoutActionType.SUCCESS]: setOrderSuccess,
  [CheckoutActionType.PENDING]: setPending,
  [CheckoutActionType.ERROR]: setError,
  [CheckoutActionType.CLEAR]: clearOrder,
} as const

const Reducer = (state = {...initialState}, action): CheckoutReduxState => {
  const handler = actions[action.type]
  if (!handler) {
    return state
  }
  return handler(state, action)
}

export default Reducer
