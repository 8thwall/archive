import type {
  UserNianticReduxState, UserNianticReducerFunction,
} from './user-niantic-types'
import {
  UserNianticActionType, UserNianticActions, SetPendingAction, SetErrorAction,
  SetLoggedInUserAction, SetUpdateUserAttributeAction, SetIncompleteSignupUserAction,
  SET_PENDING, SET_ERROR, SET_LOGGED_IN_USER, ACKNOWLEDGE_ERROR, AcknowledgeErrorAction, LOGOUT,
  UPDATE_ATTRIBUTE, INCOMPLETE_SIGNUP, CLEAR_INCOMPLETE_SIGNUP,
} from './user-niantic-action-types'

const INITIAL_USER_NIANTIC_STATE: UserNianticReduxState = {
  loggedInUser: null,
  incompleteSignupUser: null,
  pending: {},
  error: {},
} as const

const setPending = (
  state: UserNianticReduxState,
  action: SetPendingAction
): UserNianticReduxState => ({
  ...state,
  pending: {
    ...state.pending,
    ...action.pending,
  },
})

const setError = (
  state: UserNianticReduxState,
  action: SetErrorAction
): UserNianticReduxState => ({
  ...state,
  error: {
    ...state.error,
    [action.error.action]: action.error.error,
  },
})

const acknowledgeError = (
  state: UserNianticReduxState,
  action: AcknowledgeErrorAction
): UserNianticReduxState => {
  const newErrorState = {...state.error}
  delete newErrorState[action.action]

  return {
    ...state,
    error: {...newErrorState},
  }
}

const setLoggedInUser = (
  state: UserNianticReduxState,
  action: SetLoggedInUserAction
): UserNianticReduxState => ({
  ...state,
  loggedInUser: {
    ...action.user,
  },
})

const updateUserAttribute = (
  state: UserNianticReduxState,
  action: SetUpdateUserAttributeAction
): UserNianticReduxState => ({
  ...state,
  loggedInUser: {
    ...state.loggedInUser,
    ...action.attribute,
  },
})

const setIncompleteSignupUser = (
  state: UserNianticReduxState,
  action: SetIncompleteSignupUserAction
): UserNianticReduxState => ({
  ...state,
  incompleteSignupUser: {...action.user},
})

const clearIncompleteSignupUser = (
  state: UserNianticReduxState
): UserNianticReduxState => ({
  ...state,
  incompleteSignupUser: null,
})

const logout = (state: UserNianticReduxState): UserNianticReduxState => ({
  ...state,
  loggedInUser: null,
})

const actions: Record<UserNianticActionType, UserNianticReducerFunction> = {
  [SET_PENDING]: setPending,
  [SET_ERROR]: setError,
  [ACKNOWLEDGE_ERROR]: acknowledgeError,
  [SET_LOGGED_IN_USER]: setLoggedInUser,
  [LOGOUT]: logout,
  [UPDATE_ATTRIBUTE]: updateUserAttribute,
  [INCOMPLETE_SIGNUP]: setIncompleteSignupUser,
  [CLEAR_INCOMPLETE_SIGNUP]: clearIncompleteSignupUser,
}

const Reducer = (
  state = {...INITIAL_USER_NIANTIC_STATE}, action: UserNianticActions
): UserNianticReduxState => {
  const handler = actions[action.type]
  return handler ? handler(state, action) : state
}

export default Reducer
