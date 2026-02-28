import type {LoggedInUserState, PendingState} from './user-niantic-types'
import type {ActionTypes, ErrorAction} from './user-niantic-errors'
import type {SignUpUserNianticRequest} from '../../shared/users/users-niantic-types'

const SET_PENDING = 'USER_NIANTIC/PENDING'
const SET_ERROR = 'USER_NIANTIC/ERROR'
const ACKNOWLEDGE_ERROR = 'USER_NIANTIC/ACKNOWLEDGE_ERROR'
const SET_LOGGED_IN_USER = 'USER_NIANTIC/SET_LOGGED_IN_USER'
const LOGOUT = 'USER_NIANTIC/LOGOUT'
const UPDATE_ATTRIBUTE = 'USER_NIANTIC/UPDATE_ATTRIBUTE'
const INCOMPLETE_SIGNUP = 'USER_NIANTIC/INCOMPLETE_SIGNUP'
const CLEAR_INCOMPLETE_SIGNUP = 'USER_NIANTIC/CLEAR_INCOMPLETE_SIGNUP'

type UserNianticActionType = typeof SET_PENDING | typeof SET_ERROR | typeof SET_LOGGED_IN_USER |
typeof ACKNOWLEDGE_ERROR | typeof LOGOUT | typeof UPDATE_ATTRIBUTE | typeof INCOMPLETE_SIGNUP |
typeof CLEAR_INCOMPLETE_SIGNUP

interface SetPendingAction {
  type: typeof SET_PENDING
  pending: PendingState
}

interface SetErrorAction {
  type: typeof SET_ERROR
  error: ErrorAction
}

interface AcknowledgeErrorAction {
  type: typeof ACKNOWLEDGE_ERROR
  action: ActionTypes
}

interface SetLoggedInUserAction {
  type: typeof SET_LOGGED_IN_USER
  user: LoggedInUserState
}

interface LogoutAction {
  type: typeof LOGOUT
}

interface SetUpdateUserAttributeAction {
  type: typeof UPDATE_ATTRIBUTE
  attribute: Partial<LoggedInUserState>
}

interface SetIncompleteSignupUserAction {
  type: typeof INCOMPLETE_SIGNUP
  user: SignUpUserNianticRequest
}

type UserNianticActions = SetPendingAction | SetErrorAction | SetLoggedInUserAction |
AcknowledgeErrorAction | LogoutAction | SetUpdateUserAttributeAction |
SetIncompleteSignupUserAction

const acknowledgeError = (action: ActionTypes): AcknowledgeErrorAction => ({
  type: ACKNOWLEDGE_ERROR,
  action,
})

const errorAction = (error: ErrorAction): SetErrorAction => ({
  type: SET_ERROR,
  error,
})

const pendingAction = (pending: PendingState): SetPendingAction => ({
  type: SET_PENDING,
  pending,
})

const updateAttributeAction = (
  attribute: Partial<LoggedInUserState>
): SetUpdateUserAttributeAction => ({
  type: UPDATE_ATTRIBUTE,
  attribute,
})

export {
  SET_PENDING,
  SET_ERROR,
  ACKNOWLEDGE_ERROR,
  SET_LOGGED_IN_USER,
  LOGOUT,
  UPDATE_ATTRIBUTE,
  INCOMPLETE_SIGNUP,
  CLEAR_INCOMPLETE_SIGNUP,
  errorAction,
  acknowledgeError,
  pendingAction,
  updateAttributeAction,
}

export type {
  UserNianticActionType,
  UserNianticActions,
  SetPendingAction,
  SetErrorAction,
  SetLoggedInUserAction,
  AcknowledgeErrorAction,
  SetUpdateUserAttributeAction,
  SetIncompleteSignupUserAction,
}
