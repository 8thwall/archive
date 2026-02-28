/* eslint-disable camelcase */

type SignUpResponse = {
  accessToken: string
}

type SignUpRequest = {
  appKey: string
  authProviderId: string
  providerToken: string
  shouldCreate?: boolean
}

type LoginRequest = {
  authProviderId: string
  providerToken: string
}

type LoginResponse = {
  accessToken: string
}

type AccountResponse = {
  player_id: string
  result: string
}

export {
  SignUpResponse,
  SignUpRequest,
  LoginRequest,
  LoginResponse,
  AccountResponse,
}
