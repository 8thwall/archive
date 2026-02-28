import memoize from 'memoizee'

import {DEFAULT_POSTS_PER_PAGE, PUBLISHED_STATE} from '../../cms-constants'

import {Hubspot} from './hubspot-api'
import {MILLISECONDS_PER_SECOND} from '../../time-utils'
import type {IHubspotBlogApi} from './hubspot-blog-api'

const SNAKE_CASING = 'snake'

const CACHE_TIME_MILLISECONDS = 30 * MILLISECONDS_PER_SECOND
const cache = (fn, maxAge = CACHE_TIME_MILLISECONDS) => memoize(fn, {
  maxAge,
  promise: true,
  normalizer: args => JSON.stringify(args),
})

const getPosts = opts => Hubspot.use().apiRequest({
  method: 'GET',
  path: '/content/api/v2/blog-posts',
  qs: {
    limit: DEFAULT_POSTS_PER_PAGE,
    ...opts,
  },
})

const getPost = id => (
  Hubspot.use().apiRequest({method: 'GET', path: `/content/api/v2/blog-posts/${id}`})
)

const getTopics = opts => (
  Hubspot.use().apiRequest({method: 'GET', path: '/blogs/v3/topics', qs: opts})
)

// We have to request snake casing from hubspot with query params here to keep property naming in
// sync with other v2 responses
const getTopic = id => Hubspot.use().apiRequest({
  method: 'GET', path: `/blogs/v3/topics/${id}`, qs: {casing: SNAKE_CASING},
})

const createHubspotBlogApi = (): IHubspotBlogApi => ({
  posts: {
    list: cache(getPosts),
    get: cache(getPost),
  },
  topics: {
    list: cache(getTopics),
    get: cache(getTopic),
  },
})

export {
  createHubspotBlogApi,
  PUBLISHED_STATE,
}
