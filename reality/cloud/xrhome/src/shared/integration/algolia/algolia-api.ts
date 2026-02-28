import type {SearchResponse, SearchOptions} from '@algolia/client-search'

import {entry} from '../../registry'

interface AlgoliaAPI {
  search: (query: string, searchOptions: SearchOptions) => Promise<SearchResponse>
}

const Algolia = entry<AlgoliaAPI>('algolia')

export {Algolia}

export type {AlgoliaAPI}
