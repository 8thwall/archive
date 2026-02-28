import type {ILauncherApp, ILauncherDrillDownApp} from '../common/types/models'

// Defines error states for each async action.
type ErrorState = {
  getConsoleApp?: boolean
  getSearchApps?: boolean
  getAppReadMe?: boolean
}

// Defines pending states for each async action.
type PendingState = {
  getConsoleApp?: boolean
  getSearchApps?: boolean
  getAppReadMe?: boolean
}

// Top-level launcher state.
type LauncherState = {
  consoleApps: ILauncherDrillDownApp[]
  searchApps: ILauncherApp[]
  appReadMesByAppUuid: Record<string, string>
  pending: PendingState
  error: ErrorState
}

// Action types.
enum LauncherAction {
  Pending = 'LAUNCHER/PENDING',
  Error = 'LAUNCHER/ERROR',
  GetConsoleApp = 'LAUNCHER/GET_CONSOLE_APP',
  GetSearchApps = 'LAUNCHER/GET_SEARCH_APPS',
  ClearConsoleApps = 'LAUNCHER/CLEAR_CONSOLE_APPS',
  ClearSearchApps = 'LAUNCHER/CLEAR_SEARCH_APPS',
  GetAppReadMe = 'LAUNCHER/GET_APP_README',
  ClearAppReadMes = 'LAUNCHER/CLEAR_APP_READMES',
}

// Action creators.
type PendingAction = (
  state: LauncherState,
  action: {type: LauncherAction.Pending, pending: PendingState}
) => LauncherState

type ErrorAction = (
  state: LauncherState,
  action: {type: LauncherAction.Error, error: ErrorState}
) => LauncherState

type GetConsoleAppAction = (
  state: LauncherState,
  action: {type: LauncherAction.GetConsoleApp, app: ILauncherDrillDownApp}
) => LauncherState

type ClearConsoleAppsAction = (state: LauncherState) => LauncherState

type GetSearchAppsAction = (
  state: LauncherState,
  action: {type: LauncherAction.GetSearchApps, apps: ILauncherApp[]}
) => LauncherState

type ClearSearchAppsAction = (state: LauncherState) => LauncherState

type GetAppReadMeAction = (
  state: LauncherState,
  action: {type: LauncherAction.GetAppReadMe, readMe: string, appUuid: string}
) => LauncherState

type ClearAppReadMesAction = (state: LauncherState) => LauncherState

export {
  LauncherState,
  LauncherAction,
  PendingAction,
  ErrorAction,
  GetConsoleAppAction,
  GetSearchAppsAction,
  ClearSearchAppsAction,
  ClearConsoleAppsAction,
  GetAppReadMeAction,
  ClearAppReadMesAction,
}
