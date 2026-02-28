import type {DeepReadonly} from 'ts-essentials'

import type {IDiscoveryApp} from '../client/common/types/models'

type Keyword = string

// Top-level redux state.
type HomeReduxState = DeepReadonly<{
  searchResults: Record<Keyword, IDiscoveryApp[]>
  searchPending: Record<Keyword, boolean>
  searchError: Record<Keyword, boolean>
  preload: boolean
}>

// Action types.
enum HomeActionType {
  SEARCH = 'HOME/SEARCH',
  SEARCH_PENDING = 'HOME/SEARCH_PENDING',
  SEARCH_ERROR = 'HOME/SEARCH_ERROR',
  SEARCH_CLEAR = 'HOME/SEARCH_CLEAR',
  PRELOAD = 'HOME/PRELOAD'
}

type PreloadAction = {
  type: HomeActionType.PRELOAD
  preload: boolean
}

// Action creators.
type SearchAction = {
  // TODO(wayne): The parameters here should match the request API of ServeDocuments.
  type: HomeActionType.SEARCH
  keyword: string
  searchResults: IDiscoveryApp[]
}

type SearchPendingAction = {
  type: HomeActionType.SEARCH_PENDING
  searchPending: HomeReduxState['searchPending']
}

type SearchErrorAction = {
  type: HomeActionType.SEARCH_ERROR
  searchError: HomeReduxState['searchError']
}

enum SEARCH_INDEX_NAME {
  Apps = 'apps',
}

type ServeDocumentsRequestBody = {
  indexName: SEARCH_INDEX_NAME
  keywords?: string[]
  filters?: Record<string, any>
  from?: number
  size?: number
}

export {
  SEARCH_INDEX_NAME,
  HomeReduxState,
  HomeActionType,
  SearchAction,
  SearchPendingAction,
  SearchErrorAction,
  PreloadAction,
  ServeDocumentsRequestBody,
}
