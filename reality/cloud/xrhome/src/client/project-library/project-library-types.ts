import type {IDiscoveryApp} from '../common/types/models'

// Defines error states for each async action.
type ErrorState = {
  getSearchApps?: boolean
}

// Defines pending states for each async action.
type PendingState = {
  getSearchApps?: boolean
}

// Top-level launcher state.
type ProjectLibraryState = {
  searchApps: IDiscoveryApp[]
  pending: PendingState
  error: ErrorState
}

interface IInnerHits {
  code?: {
    total: number
    hits: Array<{
      fileContent: string
      fileContentHighlights: string[]
      relativePath: string
    }>
  }
}

// Action types.
enum ProjectLibraryAction {
  Pending = 'PROJECT_LIBRARY/PENDING',
  Error = 'PROJECT_LIBRARY/ERROR',
  GetSearchApps = 'PROJECT_LIBRARY/GET_SEARCH_APPS',
  ClearSearchApps = 'PROJECT_LIBRARY/CLEAR_SEARCH_APPS',
}

// Action creators.
type PendingAction = (
  state: ProjectLibraryState,
  action: {type: ProjectLibraryAction.Pending, pending: PendingState}
) => ProjectLibraryState

type ErrorAction = (
  state: ProjectLibraryState,
  action: {type: ProjectLibraryAction.Error, error: ErrorState}
) => ProjectLibraryState

type GetSearchAppsAction = (
  state: ProjectLibraryState,
  action: {type: ProjectLibraryAction.GetSearchApps, apps: IDiscoveryApp[]}
) => ProjectLibraryState

type ClearSearchAppsAction = (state: ProjectLibraryState) => ProjectLibraryState

export {
  ProjectLibraryState,
  ProjectLibraryAction,
  PendingAction,
  ErrorAction,
  GetSearchAppsAction,
  ClearSearchAppsAction,
  IInnerHits,
}
