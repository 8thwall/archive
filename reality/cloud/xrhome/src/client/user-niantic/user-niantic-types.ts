import type {DeepReadonly} from 'ts-essentials'

import type {User} from '../common/types/db'
import type {
  ACTIONS,
  ConnectEmailErrorTypes,
  ConnectLoginErrorTypes,
  CreateLoginTokenErrorTypes,
  DisconnectLoginErrorTypes,
  EmailVerificationErrorTypes,
  LoginErrorTypes,
  SignupErrorTypes,
} from './user-niantic-errors'
import type {UserNianticActions} from './user-niantic-action-types'
import type {
  ClientSideUser, NianticAccountProfile, SignUpUserNianticRequest,
} from '../../shared/users/users-niantic-types'

interface PendingState {
  login?: boolean
  verifyLoginToken?: boolean
  signup?: boolean
  getUser?: boolean
  patchUser?: boolean
  migrateUser?: boolean
  disconnectLogin?: boolean
  connectLogin?: boolean
  connectEmail?: boolean
  updateEmail?: boolean
  verifyEmail?: boolean
  createLoginToken?: boolean
  changeVerificationEmail?: boolean
}

interface ErrorState {
  [ACTIONS.LOGIN]?: LoginErrorTypes
  [ACTIONS.EMAIL_VERIFICATION]?: EmailVerificationErrorTypes
  [ACTIONS.SIGNUP]?: SignupErrorTypes
  [ACTIONS.DISCONNECT_LOGIN]?: DisconnectLoginErrorTypes
  [ACTIONS.CONNECT_LOGIN]?: ConnectLoginErrorTypes
  [ACTIONS.CONNECT_EMAIL]?: ConnectEmailErrorTypes
  [ACTIONS.CREATE_LOGIN_TOKEN]?: CreateLoginTokenErrorTypes
}

// NOTE(johnny): The 'sign in' and 'get' endpoints return different client user types.
type LoggedInUserState = Partial<Pick<User, 'createdAt' | 'updatedAt'>> & ClientSideUser &
NianticAccountProfile

type UserNianticReduxState = DeepReadonly<{
  loggedInUser?: LoggedInUserState
  incompleteSignupUser?: SignUpUserNianticRequest
  pending: PendingState
  error: ErrorState
}>

type UserNianticReducerFunction = (
  state: UserNianticReduxState,
  action: UserNianticActions
) => UserNianticReduxState

export {
  UserNianticReduxState,
  ErrorState,
  PendingState,
}

export type {
  LoggedInUserState,
  UserNianticReducerFunction,
}
