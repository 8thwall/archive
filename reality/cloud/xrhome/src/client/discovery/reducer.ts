import {KEYWORDS} from '../../shared/discovery-constants'
import {
  DiscoveryReduxState,
  INDEX_NAME,

  // Actions.
  DiscoveryActionType,
  SearchAction,
  PendingAction,
  ErrorAction,
  PreloadAction,
} from '../../shared/discovery-types'

const initialState: DiscoveryReduxState = {
  keywords: KEYWORDS,
  preload: false,
  preloadFrom: 0,
  searchResults: [],
  pending: {},
  error: {},
}

const search = (
  state: DiscoveryReduxState,
  action: SearchAction
): DiscoveryReduxState => ({
  ...state,
  searchResults: [
    ...state.searchResults,
    ...(action.searchResults ? action.searchResults : []),
  ],
})

const setPending = (
  state: DiscoveryReduxState,
  action: PendingAction
): DiscoveryReduxState => ({
  ...state,
  pending: {
    ...state.pending,
    ...action.pending,
  },
})

const setError = (
  state: DiscoveryReduxState,
  action: ErrorAction
): DiscoveryReduxState => ({
  ...state,
  error: {
    ...state.error,
    ...action.error,
  },
})

const clearSearch = (
  state: DiscoveryReduxState
): DiscoveryReduxState => ({
  ...state,
  searchResults: [],
})

const actions = {
  [DiscoveryActionType.SEARCH]: search,
  [DiscoveryActionType.PENDING]: setPending,
  [DiscoveryActionType.ERROR]: setError,
  [DiscoveryActionType.CLEAR]: clearSearch,
  [DiscoveryActionType.PRELOAD]: (
    state: DiscoveryReduxState, action: PreloadAction
  ): DiscoveryReduxState => ({
    ...state,
    preload: action.preload,
    preloadFrom: action.from,
  }),
} as const

const Reducer = (state = {...initialState}, action): DiscoveryReduxState => {
  const handler = actions[action.type]
  if (!handler) {
    return state
  }
  return handler(state, action)
}

export default Reducer
