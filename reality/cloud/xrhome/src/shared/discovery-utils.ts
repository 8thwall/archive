import {
  SERVE_DOCUMENTS_DEV_URL,
  DISCOVERY_HERO_DIMENSIONS,
  SERVE_DOCUMENTS_PROD_URL,
  INDUSTRY_CARD_DIMENSIONS,
  KEYWORD_SEARCH_PARAM,
  DISCOVERY_PAGE_SIZE,
} from './discovery-constants'
import {
  INDEX_NAME,
  ServeDocumentsRequestBody,
  SearchQuery,
} from './discovery-types'

const DISCOVERY_HERO_PREFIX = 'images/discovery/hero/'

const SERVE_SEARCH_URL = BuildIf.ALL_QA ? SERVE_DOCUMENTS_DEV_URL : SERVE_DOCUMENTS_PROD_URL

const formatFilterOption = {
  try: v => ({
    tryItOut: v === 'true',
  }),
  featured: v => ({
    featured: v === 'true',
  }),
}

const getHeroImageKey = (id: string) => `${DISCOVERY_HERO_PREFIX}${id}`

const getDiscoveryHeroUrl = (
  id: string,
  options?: {size: keyof typeof DISCOVERY_HERO_DIMENSIONS}
) => {
  const dimensions = DISCOVERY_HERO_DIMENSIONS[options?.size]
  const dimensionSuffix = dimensions ? `-${dimensions[0]}x${dimensions[1]}` : ''
  return `https://cdn.8thwall.com/${getHeroImageKey(id)}${dimensionSuffix}`
}

const encodeQueryParam = (q: string) => q?.replace(/[ ,]+/g, ',')
const decodeQueryParam = (q: string) => q?.replace(/,/g, ' ')

const INDUSTRY_CARD_PREFIX = 'images/discovery/industry/'

const getIndustryCardKey = (id: string) => `${INDUSTRY_CARD_PREFIX}${id}`

const getIndustryCardUrl = (
  id: string,
  options?: {size: keyof typeof INDUSTRY_CARD_DIMENSIONS}
) => {
  const dimensions = INDUSTRY_CARD_DIMENSIONS[options?.size]
  const dimensionSuffix = dimensions ? `-${dimensions[0]}x${dimensions[1]}` : ''
  return `https://cdn.8thwall.com/${getIndustryCardKey(id)}${dimensionSuffix}`
}

// Construct request body from path and query parameters.
const constructRequestBody = ({
  searchParams, keyword = '', from = 0, excludes = {},
}): SearchQuery => {
  const initialState = {indexName: INDEX_NAME.Apps, size: DISCOVERY_PAGE_SIZE, excludes}
  // Add the path parameters to the request body.
  const body = [...searchParams.entries()].reduce((acc, [k, v]) => {
    if (k === KEYWORD_SEARCH_PARAM && v) {
      acc.keywords = v.split(',').filter(Boolean)
    } else {
      acc.filters = {...acc.filters, ...formatFilterOption[k]?.(v)}
    }
    return acc
  }, initialState as ServeDocumentsRequestBody)

  // If we're on a predetermined page, add the ':keyword' path parameter to the request body.
  if (keyword) {
    body.keywords = [...(body.keywords || []), keyword]
  }

  if (from) {
    body.from = from
  }

  return body
}

export {
  formatFilterOption,
  SERVE_SEARCH_URL,
  getDiscoveryHeroUrl,
  encodeQueryParam,
  decodeQueryParam,
  getIndustryCardUrl,
  constructRequestBody,
}
