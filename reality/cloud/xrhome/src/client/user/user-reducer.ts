import type {DeepReadonly} from 'ts-essentials'

import type {IUser} from './user-actions'
import type {SupportedLocale8w} from '../../shared/i18n/i18n-locales'

type UserState = DeepReadonly<IUser & {
  refreshToken: string | null
  // eslint-disable-next-line camelcase
  phone_number: string
  picture: string
  loading: boolean
  uuid: string
  signUpOk: boolean | null
  jwtRefreshTime: number | undefined
  jwtSource: 'firebase' | 'cognito' | '8w' | undefined
  userMismatch: boolean
  country: string
  lightshipTos: boolean
  locale: SupportedLocale8w | ''
  // eslint-disable-next-line camelcase
  code_sent: boolean
  // eslint-disable-next-line camelcase
  email_verified: string
}>

const initialState: UserState = {
  jwt: null,
  confirmed: null,
  refreshToken: null,
  email: '',
  phone_number: '',
  picture: '',
  given_name: '',
  family_name: '',
  loading: true,
  signUpOk: null,  // NOTE(dat): only redirect on false
  uuid: '',
  jwtRefreshTime: undefined,
  jwtSource: undefined,

  // A user mismatch occurs when the current logged in user does not match who
  // we knew to be logged in first. Logouts should trigger
  userMismatch: false,  // Managed by useDetectUserMismatch()

  country: '',
  lightshipTos: false,
  locale: '',
  code_sent: false,
  email_verified: null,
} as const

const Reducer = (state = {...initialState}, action) => {
  switch (action.type) {
    case 'USER_JWT':
      return {
        ...state,
        jwt: action.jwt,
        jwtRefreshTime: action.jwtRefreshTime,
        refreshToken: action.refreshToken,
        jwtSource: action.jwtSource,
      }
    case 'USER_ATTRIBUTES':
      return {
        ...state,
        ...action.attributes,
      }
    case 'USER_AUTH':
      return {...state}
    case 'LOADING_USER':
      return {...state, loading: action.loading}
    case 'USER_LOGOUT':
      return {...initialState, loading: false}
    case 'USER_SIGNUP_OK_SET':
      return {...state, signUpOk: action.signUpOk}
    case 'USER_MISMATCH':
      return {...state, userMismatch: action.userMismatch}
    default:
      return state
  }
}

export default Reducer

export type {
  UserState,
}
