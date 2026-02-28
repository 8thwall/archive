import {MILLISECONDS_PER_DAY} from '../../shared/time-utils'

const initialState = {
  loading: true,
  summaries: [],
  views: [],
  engagementMetrics: [],
  billedUsageByApp: {},
  callsByApp: {},
  callsMetadataByApp: null,
}

const Reducer = (state = {...initialState}, action) => {
  switch (action.type) {
    case 'USER_LOGOUT':
      return {...initialState}

    case 'APPS_SET':
      if (state.summaries.length || state.views.length || state.engagementMetrics.length) {
        return state
      }

      return {
        ...state,
        summaries: action.apps.map(a => ({app: a.appName, TOTAL: 0})),
        views: action.apps.map(a => ({app: a.appName, calls: 0})),
      }

    case 'USAGE_APP_SUMMARIES': {
      const callsByApp = {}
      action.calls.forEach((c) => {
        if (callsByApp[c.appKey]) {
          callsByApp[c.appKey].push(c)
        } else {
          callsByApp[c.appKey] = [c]
        }
      })

      const appKeys = Object.keys(callsByApp)
      const callsMetadataByApp = appKeys.reduce((o, appKey) => {
        const calls = callsByApp[appKey]
        const total = calls.reduce((sum, {callNo}) => sum + Number(callNo), 0)
        const days = calls.map(({day}) => new Date(day))
        const firstDay = Math.min(...days)
        const averagePerDay = (total / (Math.max(...days) - firstDay)) * MILLISECONDS_PER_DAY

        o[appKey] = {
          averagePerDay,
          total,
          firstDay,
        }
        return o
      }, {})

      // Only used in XR
      const callCountByApp = action.calls.reduce((o, {appKey, calls}) => {
        o[appKey] = calls
        return o
      }, {})

      return {
        ...state,
        loading: false,
        views: action.calls,
        callsByApp,
        callsMetadataByApp,
        summaries: action.summaries.map(a => ({
          ...a,
          TOTAL: (a.C8 || 0) + (a.ARCORE || 0) + (a.ARKIT || 0),
          VIEWS: (callCountByApp[a.appKey] || 0),
        }))
          .sort((a, b) => (a.TOTAL > b.TOTAL ? -1 : 1)),
      }
    }

    case 'USAGE_ENGAGEMENT_METRICS':
      return {
        ...state,
        loading: false,
        engagementMetrics: action.engagementMetrics,
      }

    case 'USAGE_ENGAGEMENT_METRICS_LOADING':

      return {
        ...state,
        loading: action.loading,
      }

    case 'USAGE_APP_LOADING':
      return initialState

    case 'APP_BILLED_USAGE_SET':
      return {
        ...state,
        billedUsageByApp: {...state.billedUsageByApp, [action.appKey]: action.data},
      }

    default:
      return state
  }
}

export default Reducer
