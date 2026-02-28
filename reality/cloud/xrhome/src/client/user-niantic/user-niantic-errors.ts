import {
  CONNECT_EMAIL_ERRORS,
  CONNECT_LOGIN_ERRORS, DISCONNECT_LOGIN_ERRORS, SIGNUP_ERRORS, MIGRATE_ERRORS,
  UPDATE_EMAIL_ERRORS,
  CREATE_LOGIN_TOKEN_ERRORS,
  EMAIL_VERIFICATION_ERRORS,
} from '../../shared/users/errors'

enum LOGIN_ERRORS {
  INVALID_LOGIN_TOKEN = 'login_error.invalid_login_token',
  MISSING_ACCOUNT = 'login_error.account_missing',
  INCORRECT_LOGIN = 'login_error.incorrect_email_password',
}

type AllErrors = LOGIN_ERRORS | EMAIL_VERIFICATION_ERRORS | SIGNUP_ERRORS | CONNECT_LOGIN_ERRORS
  | CONNECT_EMAIL_ERRORS | MIGRATE_ERRORS | UPDATE_EMAIL_ERRORS | CREATE_LOGIN_TOKEN_ERRORS

type ErrorTypeMap = {
  [key in AllErrors]: 'info' | 'warning' | 'success' | 'danger'
}

const ERROR_TYPE_MAP: ErrorTypeMap = {
  [LOGIN_ERRORS.MISSING_ACCOUNT]: 'warning',
  [LOGIN_ERRORS.INCORRECT_LOGIN]: 'danger',
  [LOGIN_ERRORS.INVALID_LOGIN_TOKEN]: 'warning',
  [EMAIL_VERIFICATION_ERRORS.INVALID]: 'danger',
  [EMAIL_VERIFICATION_ERRORS.CODE_SENT_FAILED]: 'danger',
  [EMAIL_VERIFICATION_ERRORS.CHANGE_EMAIL_FAILED]: 'danger',
  [EMAIL_VERIFICATION_ERRORS.EMPTY_EMAIL]: 'danger',
  [EMAIL_VERIFICATION_ERRORS.INVALID_EMAIL]: 'danger',
  [EMAIL_VERIFICATION_ERRORS.LOWER_CASE_EMAIL]: 'danger',
  [EMAIL_VERIFICATION_ERRORS.LIMIT_EXCEEDED_EXCEPTION]: 'danger',
  [SIGNUP_ERRORS.FAILED_TO_SIGNUP]: 'danger',
  [SIGNUP_ERRORS.PLAYER_EXISTS]: 'warning',
  [SIGNUP_ERRORS.USER_EMAIL_EXISTS]: 'warning',
  [SIGNUP_ERRORS.INVALID]: 'danger',
  [SIGNUP_ERRORS.GOOGLE_SIGNUP_FAILED]: 'warning',
  [SIGNUP_ERRORS.APPLE_SIGNUP_FAILED]: 'warning',
  [SIGNUP_ERRORS.NO_EMAIL_PROVIDED]: 'warning',
  [CONNECT_LOGIN_ERRORS.FAILED_TO_LINK]: 'danger',
  [CONNECT_LOGIN_ERRORS.LOGIN_EXISTS]: 'warning',
  [CONNECT_LOGIN_ERRORS.LOGIN_NOT_CHANGEABLE]: 'danger',
  [CONNECT_LOGIN_ERRORS.FAILED_TO_GET_LOGINS]: 'danger',
  [CONNECT_EMAIL_ERRORS.FAILED_TO_LINK]: 'danger',
  [CONNECT_EMAIL_ERRORS.LOGIN_EXISTS]: 'warning',
  [MIGRATE_ERRORS.ALREADY_MIGRATED]: 'danger',
  [MIGRATE_ERRORS.FAILED_TO_MIGRATE]: 'danger',
  [MIGRATE_ERRORS.NIANTIC_GOOGLE_ACCOUNT_EXISTS]: 'warning',
  [MIGRATE_ERRORS.NIANTIC_APPLE_ACCOUNT_EXISTS]: 'warning',
  [MIGRATE_ERRORS.MISSING_GOOGLE_NIANTIC_ACCOUNT]: 'warning',
  [MIGRATE_ERRORS.MISSING_APPLE_NIANTIC_ACCOUNT]: 'warning',
  [UPDATE_EMAIL_ERRORS.INVALID_PASSWORD]: 'danger',
  [UPDATE_EMAIL_ERRORS.INVALID_EMAIL]: 'danger',
  [UPDATE_EMAIL_ERRORS.EMPTY_EMAIL]: 'danger',
  [UPDATE_EMAIL_ERRORS.UPDATE_EMAIL_FAILED]: 'danger',
  [UPDATE_EMAIL_ERRORS.LOWER_CASE_EMAIL]: 'danger',
  [CREATE_LOGIN_TOKEN_ERRORS.EXCEEDED_TOKEN_LIMIT]: 'warning',
  [CREATE_LOGIN_TOKEN_ERRORS.INVALID_USER_SESSION]: 'danger',
  [CREATE_LOGIN_TOKEN_ERRORS.UNEXPECTED]: 'danger',
}

enum ACTIONS {
  LOGIN = 'login',
  EMAIL_VERIFICATION = 'email-verification',
  SIGNUP = 'signup',
  DISCONNECT_LOGIN = 'disconnect-login',
  CONNECT_LOGIN = 'connect-login',
  CONNECT_EMAIL = 'connect-email',
  MIGRATE = 'migrate',
  UPDATE_EMAIL = 'update-email',
  CREATE_LOGIN_TOKEN = 'create-login-token',
}

type ActionNamespaceMap = {
  [key in ACTIONS]: string
}

const ACTION_NAMESPACE_MAP: ActionNamespaceMap = {
  [ACTIONS.LOGIN]: 'niantic-id-login-page',
  [ACTIONS.EMAIL_VERIFICATION]: 'email-verification',
  [ACTIONS.SIGNUP]: 'sign-up-pages',
  [ACTIONS.DISCONNECT_LOGIN]: 'user-profile-page',
  [ACTIONS.CONNECT_LOGIN]: 'user-profile-page',
  [ACTIONS.CONNECT_EMAIL]: 'user-profile-page',
  [ACTIONS.MIGRATE]: 'migrate-existing-users',
  [ACTIONS.UPDATE_EMAIL]: 'user-profile-page',
  [ACTIONS.CREATE_LOGIN_TOKEN]: 'login-tokens',
}

type ActionTypes = `${ACTIONS}`
type LoginErrorTypes = `${LOGIN_ERRORS}`
type EmailVerificationErrorTypes = `${EMAIL_VERIFICATION_ERRORS}`
type SignupErrorTypes = `${SIGNUP_ERRORS}`
type DisconnectLoginErrorTypes = `${DISCONNECT_LOGIN_ERRORS}`
type ConnectLoginErrorTypes = `${CONNECT_LOGIN_ERRORS}`
type ConnectEmailErrorTypes = `${CONNECT_EMAIL_ERRORS}`
type MigrateErrorTypes = `${MIGRATE_ERRORS}`
type UpdateEmailErrorTypes = `${UPDATE_EMAIL_ERRORS}`
type CreateLoginTokenErrorTypes = `${CREATE_LOGIN_TOKEN_ERRORS}`

type ErrorAction = {
  action: ACTIONS.LOGIN
  error: LOGIN_ERRORS
} | {
  action: ACTIONS.EMAIL_VERIFICATION
  error: EMAIL_VERIFICATION_ERRORS
} | {
  action: ACTIONS.SIGNUP
  error: SIGNUP_ERRORS
} | {
  action: ACTIONS.DISCONNECT_LOGIN
  error: DISCONNECT_LOGIN_ERRORS
} | {
  action: ACTIONS.CONNECT_LOGIN
  error: CONNECT_LOGIN_ERRORS
} | {
  action: ACTIONS.CONNECT_EMAIL
  error: CONNECT_EMAIL_ERRORS
} | {
  action: ACTIONS.MIGRATE
  error: MIGRATE_ERRORS
} | {
  action: ACTIONS.UPDATE_EMAIL
  error: UPDATE_EMAIL_ERRORS
} | {
  action: ACTIONS.CREATE_LOGIN_TOKEN
  error: CREATE_LOGIN_TOKEN_ERRORS
}

export {
  ACTIONS,
  LOGIN_ERRORS,
  EMAIL_VERIFICATION_ERRORS,
  ERROR_TYPE_MAP,
  ACTION_NAMESPACE_MAP,
}

export type {
  ActionTypes,
  LoginErrorTypes,
  EmailVerificationErrorTypes,
  SignupErrorTypes,
  DisconnectLoginErrorTypes,
  ConnectEmailErrorTypes,
  ConnectLoginErrorTypes,
  MigrateErrorTypes,
  UpdateEmailErrorTypes,
  CreateLoginTokenErrorTypes,
  ErrorAction,
}
