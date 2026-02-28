import {
  // Top-level state.
  ProjectLibraryState,

  // Actions.
  ProjectLibraryAction,
  PendingAction,
  ErrorAction,
  ClearSearchAppsAction,
  GetSearchAppsAction,
} from './project-library-types'

const initialState: ProjectLibraryState = {
  searchApps: [],  // Apps fetched from search API.
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

const getSearchApps: GetSearchAppsAction = (state, action) => ({
  ...state,
  searchApps: action.apps,
})

const clearSearchApps: ClearSearchAppsAction = state => ({
  ...state,
  searchApps: [],
})

const actions = {
  [ProjectLibraryAction.Pending]: setPending,
  [ProjectLibraryAction.Error]: setError,
  [ProjectLibraryAction.GetSearchApps]: getSearchApps,
  [ProjectLibraryAction.ClearSearchApps]: clearSearchApps,
} as const

const reducer = (state = {...initialState}, action: any): ProjectLibraryState => {
  const handler = actions[action.type]
  if (!handler) {
    return state
  }
  return handler(state, action)
}

export {
  reducer,
}
