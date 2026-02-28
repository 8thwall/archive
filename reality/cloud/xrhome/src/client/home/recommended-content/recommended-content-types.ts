import type {IDiscoveryApp} from '../../common/types/models'

type ErrorState = {
  getRecommendedApps?: boolean
  getPopularTutorials?: boolean
  getBlogs?: boolean
}

type PendingState = {
  getRecommendedApps?: boolean
  getPopularTutorials?: boolean
  getBlogs?: boolean
}

type RecommendedState = {
  recommendedApps: IDiscoveryApp[]
  popularTutorials: Tutorial[]
  blogs: Blog[]
  pending: PendingState
  error: ErrorState
}

type Tutorial = {
  id: string
  title: string
  coverImage: string
}

type Blog = {
  id: string
  title: string
  slug: string
  featuredImage: string
}

// Action types.
enum RecommendedAction {
  Pending = 'RECOMMENDED/PENDING',
  Error = 'RECOMMENDED/ERROR',

  GetRecommendedApps = 'RECOMMENDED/GET_APPS',
  GetPopularTutorials = 'RECOMMENDED/GET_TUTORIALS',
  GetBlogs = 'RECOMMENDED/GET_BLOGS',
}

type GetRecommendedAppsAction = (
  state: RecommendedState,
  action: {
    type: RecommendedAction.GetRecommendedApps
    apps: IDiscoveryApp[]
  }
) => RecommendedState

type GetPopularTutorialsAction = (
  state: RecommendedState,
  action: {
    type: RecommendedAction.GetPopularTutorials
    tutorials: Tutorial[]
  }
) => RecommendedState

type GetBlogsAction = (
  state: RecommendedState,
  action: {
    type: RecommendedAction.GetBlogs
    blogs: Blog[]
  }
) => RecommendedState

type ErrorAction = (
  state: RecommendedState,
  action: {
    type: RecommendedAction.Error
    error: ErrorState
  }
) => RecommendedState

type PendingAction = (
  state: RecommendedState,
  action: {
    type: RecommendedAction.Pending
    pending: PendingState
  }
) => RecommendedState

export {
  RecommendedState,
  RecommendedAction,
  GetRecommendedAppsAction,
  GetPopularTutorialsAction,
  GetBlogsAction,
  ErrorAction,
  PendingAction,
}
