import {
  PayoutActionType, PayoutReduxState, DetailsAction,
  PendingAction, ErrorAction, DetailsState,
} from './payout-types'

const initialState: PayoutReduxState = {
  payoutDetails: {} as DetailsState,
  pending: false,
  error: {},
}

const setDetails = (
  state: PayoutReduxState,
  action: DetailsAction
): PayoutReduxState => ({
  ...state,
  payoutDetails: action.payoutDetails,
  error: {},
})

const setPending = (
  state: PayoutReduxState,
  action: PendingAction
): PayoutReduxState => ({
  ...state,
  pending: action.pending,
})

const setError = (
  state: PayoutReduxState,
  action: ErrorAction
): PayoutReduxState => ({
  ...state,
  error: {
    ...state.error,
    ...action.error,
  },
})

const setClear = (): PayoutReduxState => ({...initialState})

const actions = {
  [PayoutActionType.DETAILS]: setDetails,
  [PayoutActionType.PENDING]: setPending,
  [PayoutActionType.ERROR]: setError,
  [PayoutActionType.CLEAR]: setClear,
} as const

const Reducer = (state = {...initialState}, action): PayoutReduxState => {
  const handler = actions[action.type]
  if (!handler) {
    return state
  }
  return handler(state, action)
}

export default Reducer
