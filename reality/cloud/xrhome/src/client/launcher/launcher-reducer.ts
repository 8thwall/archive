import uniqBy from 'lodash/uniqBy'

import {
  // Top-level state.
  LauncherState,

  // Actions.
  LauncherAction,
  PendingAction,
  ErrorAction,
  ClearSearchAppsAction,
  GetSearchAppsAction,
  GetConsoleAppAction,
  ClearConsoleAppsAction,
  GetAppReadMeAction,
  ClearAppReadMesAction,
} from './launcher-types'

const initialState: LauncherState = {
  consoleApps: [],  // Apps fetched from xrhome.
  searchApps: [],   // Apps fetched from search API.
  appReadMesByAppUuid: {},
  pending: {},
  error: {},
}

const setPending: PendingAction = (state, action) => ({
  ...state,
  pending: {
    ...state.pending,
    ...action.pending,
  },
})

const setError: ErrorAction = (state, action) => ({
  ...state,
  error: {
    ...state.error,
    ...action.error,
  },
})

const getConsoleApp: GetConsoleAppAction = (state, action) => ({
  ...state,
  // Prevent duplicate apps from being appended.
  consoleApps: uniqBy([...state.consoleApps, action.app], 'uuid'),
})

const clearConsoleApps: ClearConsoleAppsAction = state => ({
  ...state,
  consoleApps: [],
})

const getSearchApps: GetSearchAppsAction = (state, action) => ({
  ...state,
  searchApps: action.apps,
})

const clearSearchApps: ClearSearchAppsAction = state => ({
  ...state,
  searchApps: [],
})

const getAppReadMe: GetAppReadMeAction = (state, action) => ({
  ...state,
  appReadMesByAppUuid: {
    ...state.appReadMesByAppUuid,
    [action.appUuid]: action.readMe,
  },
})

const clearAppReadMes: ClearAppReadMesAction = state => ({
  ...state,
  appReadMes: {},
})
const actions = {
  [LauncherAction.Pending]: setPending,
  [LauncherAction.Error]: setError,
  [LauncherAction.GetConsoleApp]: getConsoleApp,
  [LauncherAction.GetSearchApps]: getSearchApps,
  [LauncherAction.ClearConsoleApps]: clearConsoleApps,
  [LauncherAction.ClearSearchApps]: clearSearchApps,
  [LauncherAction.GetAppReadMe]: getAppReadMe,
  [LauncherAction.ClearAppReadMes]: clearAppReadMes,
} as const

const reducer = (state = {...initialState}, action: any): LauncherState => {
  const handler = actions[action.type]
  if (!handler) {
    return state
  }
  return handler(state, action)
}

export {
  reducer,
}
