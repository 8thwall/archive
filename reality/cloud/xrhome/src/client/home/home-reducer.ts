import {
  HomeReduxState,

  // Actions.
  HomeActionType,
  SearchAction,
  SearchPendingAction,
  SearchErrorAction,
  PreloadAction,
} from '../../shared/home-types'

const initialState: HomeReduxState = {
  searchResults: {},
  searchPending: {},
  searchError: {},
  preload: false,
}

const setPreload = (state: HomeReduxState, action: PreloadAction): HomeReduxState => ({
  ...state, preload: action.preload,
})

const search = (
  state: HomeReduxState,
  action: SearchAction
): HomeReduxState => {
  const finalState = {
    ...state,
    searchResults: {
      ...state.searchResults,
      [action.keyword]: [
        ...state.searchResults[action.keyword] || [],
        ...(action.searchResults ? action.searchResults : []),
      ],
    },
  }
  return finalState
}

const setSearchPending = (
  state: HomeReduxState,
  action: SearchPendingAction
): HomeReduxState => ({
  ...state,
  searchPending: {
    ...state.searchPending,
    ...action.searchPending,
  },
})

const setSearchError = (
  state: HomeReduxState,
  action: SearchErrorAction
): HomeReduxState => ({
  ...state,
  searchError: {
    ...state.searchError,
    ...action.searchError,
  },
})

const clearSearch = (
  state: HomeReduxState
): HomeReduxState => ({
  ...state,
  searchResults: {},
})

const actions = {
  [HomeActionType.SEARCH]: search,
  [HomeActionType.SEARCH_PENDING]: setSearchPending,
  [HomeActionType.SEARCH_ERROR]: setSearchError,
  [HomeActionType.SEARCH_CLEAR]: clearSearch,
  [HomeActionType.PRELOAD]: setPreload,
} as const

const Reducer = (state = {...initialState}, action): HomeReduxState => {
  const handler = actions[action.type]
  if (!handler) {
    return state
  }
  return handler(state, action)
}

export default Reducer
