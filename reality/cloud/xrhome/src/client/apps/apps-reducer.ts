import jwt from 'jsonwebtoken'
import type {DeepReadonly} from 'ts-essentials'

import {MILLISECONDS_PER_SECOND, MILLISECONDS_PER_MINUTE} from '../../shared/time-utils'
import type {IApp} from '../common/types/models'

type AppsState = {loading?: boolean} & IApp[]

const initialState: AppsState = []
initialState.loading = true

const Reducer = (
  state: DeepReadonly<AppsState> = initialState, action
): DeepReadonly<AppsState> => {
  switch (action.type) {
    case 'USER_LOGOUT':
      return [...initialState]

    case 'APPS_CLEAR': {
      return Object.assign([], {loading: state.loading})
    }

    case 'APPS_LOADING': {
      const newState: AppsState = [...state]
      newState.loading = action.loading
      return newState
    }

    case 'APPS_SET':
      return Object.assign([...action.apps], {loading: state.loading})

    case 'APPS_UPDATE':
      if (action.app.status === 'DELETED') {
        return [...state.filter(a => a.uuid !== action.app.uuid)]
      }

      if (state.findIndex(a => a.uuid === action.app.uuid) === -1) {
        return [action.app, ...state]
      } else {
        return state.map(a => (a.uuid === action.app.uuid ? {...a, ...action.app} : a))
      }

    case 'APP_COMMERCIAL_UPGRADE': {
      return state.map((a) => {
        const {app} = action
        if (a.uuid !== app.uuid) {
          return a
        }

        return {
          ...a,
          ContractUuid: app.ContractUuid,
          isCommercial: !!app.commercialStatus,
          commercialStatus: app.commercialStatus,
          subscriptionId: app.subscriptionId,
          licenseSubscriptionItemId: app.licenseSubscriptionItemId,
          usageSubscriptionItemId: app.usageSubscriptionItemId,
          hasRecurringLicense: app.hasRecurringLicense,
          endingAt: app.endingAt,
        }
      })
    }

    case 'APP_SET_XRSESSIONTOKEN': {
      return state.map((a) => {
        const {appUuid} = action
        if (a.uuid !== appUuid) {
          return a
        }

        const bufferToLoadNewToken = 5 * MILLISECONDS_PER_MINUTE
        const decoded = jwt.decode(action.xrSessionToken)
        if (typeof decoded === 'string') {
          throw new Error('Unexpected token format in APP_SET_XRSESSIONTOKEN')
        }
        const expiry = decoded.exp * MILLISECONDS_PER_SECOND - bufferToLoadNewToken

        return {
          ...a,
          xrSessionToken: {
            token: action.xrSessionToken,
            expiry,
          },
        }
      })
    }

    case 'USER_APP_SPECIFICS_UPDATE': {
      const appUuid = action.appUuid || action.uuid
      return state.map(app => (app.uuid === appUuid
        ? {...app, userSpecific: {...app.userSpecific, ...action.userSpecific}}
        : app
      ))
    }

    case 'USER_APP_ACCESS_DATE_UPDATE': {
      const appUuid = action.appUuid || action.uuid
      return state.map(app => (app.uuid === appUuid
        ? {...app, userSpecific: {...app.userSpecific, accessDate: new Date().toString()}}
        : app
      ))
    }

    case 'APP_UPDATE_WEBVERSION': {
      const app = state.find(a => a.uuid === action.app.uuid)
      return [...state.filter(a => a.uuid !== action.app.uuid), {
        ...app,
        webVersionStaging: action.app.webVersionStaging,
        webVersionProduction: action.app.webVersionProduction,
      }]
    }

    case 'PWA_INFO_SET':
      return state.map((a) => {
        if (a.uuid === action.appUuid) {
          return {
            ...a,
            PwaInfo: action.pwaInfo,
          }
        } else {
          return a
        }
      })

    case 'NAE_INFO_SET':
      return state.map((a) => {
        if (a.uuid === action.naeInfo.AppUuid) {
          const updatedNaeInfos = [
            ...(a.NaeInfos || []).filter(info => info.platform !== action.naeInfo.platform),
            action.naeInfo,
          ]

          return {
            ...a,
            NaeInfos: updatedNaeInfos,
          }
        } else {
          return a
        }
      })

    case 'AD_SUBMISSION_CREATE': {
      const app = state.find(a => a.uuid === action.adSubmission.AppUuid)
      return [...state.filter(a => a.uuid !== action.adSubmission.AppUuid), {
        ...app,
        AdSubmissions: app.AdSubmissions
          ? [...app.AdSubmissions, action.adSubmission]
          : [action.adSubmission],
      }]
    }

    default:
      return state
  }
}

export default Reducer
