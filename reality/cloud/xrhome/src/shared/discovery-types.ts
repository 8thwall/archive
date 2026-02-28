import type {DeepReadonly} from 'ts-essentials'

import type {IDiscoveryApp} from '../client/common/types/models'

type ErrorState = {
  search?: boolean
}

type PendingState = {
  search?: boolean
}

type Keyword = {
  name: string
  heroId: string
  isDropdown?: boolean
  carouselPriority?: number
  slug?: string
  industryId?: string
  descriptionTranslationKey: string
  nameTranslationKey: string
  pageTitleTranslationKey: string
}

type TechType = {
  name: string
  displayName?: string
}

type SearchQuery = {
  indexName: INDEX_NAME
  size: number
  excludes: Record<string, any>
  keywords?: string[]
  from?: number
}

// Top-level redux state.
interface DiscoveryReduxState extends DeepReadonly<{
  preload: boolean
  preloadFrom: number
  keywords: Keyword[]
  searchResults: IDiscoveryApp[]
  pending: PendingState
  error: ErrorState
}> {}

// Action types.
enum DiscoveryActionType {
  SEARCH = 'DISCOVERY/SEARCH',
  PENDING = 'DISCOVERY/PENDING',
  ERROR = 'DISCOVERY/ERROR',
  CLEAR = 'DISCOVERY/CLEAR',
  PRELOAD = 'DISCOVERY/PRELOAD'
}

type PreloadAction = {
  type: DiscoveryActionType.PRELOAD
  preload: boolean
  from: number
}

// Action creators.
type SearchAction = {
  // TODO(kyle): The parameters here should match the request API of ServeDocuments.
  type: DiscoveryActionType.SEARCH
  searchQuery: SearchQuery
  searchResults: IDiscoveryApp[]
}

type PendingAction = {
  type: DiscoveryActionType.PENDING
  pending: PendingState
}

type ErrorAction = {
  type: DiscoveryActionType.ERROR
  error: ErrorState
}

enum INDEX_NAME {
  Apps = 'apps',
}

type ServeDocumentsRequestBody = {
  indexName: INDEX_NAME
  keywords?: string[]
  filters?: Record<string, any>
  excludes?: Record<string, any>
  from?: number
  size?: number
}

export {
  INDEX_NAME,
  DiscoveryReduxState,
  DiscoveryActionType,
  TechType,
  SearchAction,
  PendingAction,
  ErrorAction,
  Keyword,
  ServeDocumentsRequestBody,
  SearchQuery,
  PreloadAction,
}
