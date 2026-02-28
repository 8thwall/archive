// ---
// --- object types
// ---

export interface DevTokenInviteRequest {
  AccountUuid: string
  uuid: string  // UserUuid
  version: string
  engineUrl?: string | undefined
  shortName: string
}

export interface DevTokenInviteResponse {
  token: string
  url: string
  used: boolean
}

export interface InstalledDevCookie {
  version: string
  engineUrl?: string
}

export type InviteStatus = 'INVALID' | 'LOADING' | 'VALID'

// ---
export const INSTALLED_DEV_COOKIE = 'INSTALLED_DEV_COOKIE'
export const DEV_TOKEN_INVITE_REQUEST = 'DEV_TOKEN_INVITE_REQUEST'
export const DEV_TOKEN_INVITE_RESPONSE = 'DEV_TOKEN_INVITE_RESPONSE'
export const CLEAR_DEV_TOKEN_RESPONSE = 'CLEAR_DEV_TOKEN_RESPONSE'
