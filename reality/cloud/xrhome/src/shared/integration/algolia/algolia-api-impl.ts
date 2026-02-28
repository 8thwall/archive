import memoize from 'memoizee'
import algoliasearch, {AlgoliaSearchOptions, SearchClient, SearchIndex} from 'algoliasearch/lite'
import type {SearchResponse} from '@algolia/client-search'

import {MILLISECONDS_PER_SECOND} from '../../time-utils'
import type {AlgoliaAPI} from './algolia-api'

const ALGOLIA_APPLICATION_ID = '<REMOVED_BEFORE_OPEN_SOURCING>'
const ALGOLIA_PUBLIC_API_KEY = '<REMOVED_BEFORE_OPEN_SOURCING>'
const ALGOLIA_INDEX = '<REMOVED_BEFORE_OPEN_SOURCING>'

const CACHE_TIME_MILLISECONDS = 30 * MILLISECONDS_PER_SECOND
const cache = (fn, maxAge = CACHE_TIME_MILLISECONDS) => memoize(fn, {
  maxAge,
  promise: true,
  normalizer: args => JSON.stringify(args),
})

const createAlgolia = (): AlgoliaAPI => {
  const client: SearchClient = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_PUBLIC_API_KEY)
  const algoliaClientIndex: SearchIndex = client.initIndex(ALGOLIA_INDEX)

  const search = (query: string, options: AlgoliaSearchOptions): Promise<SearchResponse> => (
    algoliaClientIndex.search(query, options)
  )

  return {
    search: cache(search),
  }
}

export {
  createAlgolia,
}
