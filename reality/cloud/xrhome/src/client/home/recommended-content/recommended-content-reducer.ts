import {
  RecommendedState,
  RecommendedAction,
  GetRecommendedAppsAction,
  GetPopularTutorialsAction,
  GetBlogsAction,
  ErrorAction,
  PendingAction,
} from './recommended-content-types'

const initialState: RecommendedState = {
  recommendedApps: [],  // Apps fetched from ServeSearch
  popularTutorials: [],  // Vids fetched from 8th Wall YouTube
  blogs: [],
  pending: {},
  error: {},
}

const getRecommendedApps: GetRecommendedAppsAction = (state, action) => ({
  ...state,
  recommendedApps: action.apps,
})

const getPopularTutorials: GetPopularTutorialsAction = (state, action) => ({
  ...state,
  popularTutorials: action.tutorials,
})

const getBlogs: GetBlogsAction = (state, action) => ({
  ...state,
  blogs: action.blogs,
})

const setError: ErrorAction = (state, action) => ({
  ...state,
  error: {
    ...state.error,
    ...action.error,
  },
})

const setPending: PendingAction = (state, action) => ({
  ...state,
  pending: {
    ...state.pending,
    ...action.pending,
  },
})

const actions = {
  [RecommendedAction.GetRecommendedApps]: getRecommendedApps,
  [RecommendedAction.GetPopularTutorials]: getPopularTutorials,
  [RecommendedAction.GetBlogs]: getBlogs,
  [RecommendedAction.Error]: setError,
  [RecommendedAction.Pending]: setPending,
} as const

const reducer = (state = {...initialState}, action: any): RecommendedState => {
  const handler = actions[action.type]
  if (!handler) {
    return state
  }
  return handler(state, action)
}

export {
  reducer,
}
