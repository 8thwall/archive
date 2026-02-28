import type {User as ClientUser} from '../../client/common/types/db'
import type {LOGIN_PROVIDERS} from './users-niantic-constants'

type LoginProvider = typeof LOGIN_PROVIDERS[number]
interface UserLogin {
  provider: LoginProvider
  email: string
}

type ClientSideUser = Omit<ClientUser, 'createdAt' | 'updatedAt'>

interface NianticAccountProfile {
  logins: UserLogin[]
  profilePhotoMonogram: string
  profilePhotoUrl?: string
}

interface GetUserNianticResponse {
  user: ClientSideUser
  niantic?: NianticAccountProfile
}

interface LoginUserNianticRequest {
  authProviderId: LoginProvider
  providerToken?: string
}

interface SignUpUserNianticRequest {
  authProviderId: LoginProvider
  providerToken?: string
  email?: string
  password?: string
  givenName?: string
  familyName?: string
}

interface SignUpUserNianticResponse {
  user: ClientUser
  refreshTime: number
}

interface MigrateNianticRequest {
  authProviderId: LoginProvider
  providerToken: string
}

interface DisconnectUserLoginRequest {
  authProviderId: LoginProvider
}

interface DisconnectUserLoginResponse {
  logins: UserLogin[]
}
interface UserNianticAuthResponse {
  userUuid: string
  refreshTime: number
}

interface VerifyEmailRequest {
  verificationCode: string
  verificationBehavior: 'sign-up' | 'link' | 'update'
}

interface VerifyEmailResponse {
  login: UserLogin
  user: Partial<ClientUser>
}

interface ConnectUserLoginRequest {
  authProviderId: Omit<LoginProvider, 'cognito'>
  providerToken: string
}

interface ConnectUserLoginResponse {
  login: UserLogin
}

type OnUserSigninListener = (params: SignUpUserNianticRequest | LoginUserNianticRequest) => void

const PATCHABLE_ATTRIBUTES = [
  'primaryContactEmail',
  'familyName',
  'givenName',
  'handle',
  'profileIconFile',
  'lastSeenReleasePopupId',
]

interface PatchUserNianticRequest {
  primaryContactEmail?: string
  familyName?: string
  givenName?: string
  handle?: string
  profileIconFile?: File
  lastSeenReleasePopupId?: string
}
interface PatchUserNianticResponse {
  user: ClientSideUser
}

interface CreateLoginTokenResponse {
  token: string
}

interface VerifyLoginTokenRequest {
  token: string
}

export {
  PATCHABLE_ATTRIBUTES,
}

export type {
  LoginProvider,
  GetUserNianticResponse,
  NianticAccountProfile,
  LoginUserNianticRequest,
  SignUpUserNianticRequest,
  SignUpUserNianticResponse,
  MigrateNianticRequest,
  UserNianticAuthResponse,
  ClientSideUser,
  OnUserSigninListener,
  UserLogin,
  PatchUserNianticRequest,
  PatchUserNianticResponse,
  DisconnectUserLoginRequest,
  DisconnectUserLoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ConnectUserLoginRequest,
  ConnectUserLoginResponse,
  CreateLoginTokenResponse,
  VerifyLoginTokenRequest,
}
