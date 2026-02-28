import cloneDeep from 'lodash/cloneDeep'

import {
  INSTALLED_DEV_COOKIE,
  DEV_TOKEN_INVITE_REQUEST,
  DEV_TOKEN_INVITE_RESPONSE,
  CLEAR_DEV_TOKEN_RESPONSE,
  DevTokenInviteResponse, InstalledDevCookie, DevTokenInviteRequest, InviteStatus,
} from './token-types'
import type {TokenActionType} from './token-actions'

export type TokenState = {
  devInviteReq: DevTokenInviteRequest
  devInviteRes: DevTokenInviteResponse
  installedDevCookie: InstalledDevCookie
  devInviteStatus: InviteStatus
}

const initialState = () => cloneDeep({
  devInviteReq: {
    AccountUuid: '',
    version: '',
    uuid: '',
    shortName: '',
  },
  devInviteRes: {
    token: '',
    url: '',
    used: false,
  },
  installedDevCookie: {
    version: '',
  },
  devInviteStatus: 'INVALID',
} as const)

const Reducer = (state: TokenState = initialState(), action: TokenActionType): TokenState => {
  switch (action.type) {
    case INSTALLED_DEV_COOKIE: {
      return {
        ...state,
        installedDevCookie: action.cookie,
      }
    }

    case DEV_TOKEN_INVITE_REQUEST: {
      return {
        ...state,
        devInviteReq: {
          ...action.devInviteReq,
          engineUrl: action.devInviteReq.engineUrl || undefined,
        },
        devInviteStatus: 'LOADING',
      }
    }

    case DEV_TOKEN_INVITE_RESPONSE: {
      return {
        ...state,
        devInviteRes: action.devInviteRes,
        devInviteStatus: 'VALID',
      }
    }

    case CLEAR_DEV_TOKEN_RESPONSE: {
      return {
        ...state,
        devInviteRes: {
          token: '',
          url: '',
          used: false,
        },
        devInviteStatus: 'INVALID',
      }
    }

    default: {
      return state
    }
  }
}

export default Reducer
