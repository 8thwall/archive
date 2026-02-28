import {MILLISECONDS_PER_MINUTE, MILLISECONDS_PER_SECOND} from './time-utils'

const PERIOD_DURATION_MILLIS = MILLISECONDS_PER_MINUTE

const DEFAULT_MAX_ENTRIES = 100
const DEFAULT_MIN_AGE_MILLIS = 0
const DEFAULT_MAX_AGE_MILLIS = MILLISECONDS_PER_MINUTE
const DEFAULT_REQUEST_RATE_FLOOR = 0
const DEFAULT_REFRESH_WINDOW_MILLIS = 5 * MILLISECONDS_PER_SECOND

type GenericCacheEntry<T> = {
  count: number
  periodStart: number
  previousPeriodCount: number
  previousPeriodStart: number
  loadTimestamp: number
  loadPromise: Promise<any> | null
  hasValue: boolean
  value: T
  error: Error
}

// Creates a cache that can be used to cache the result of an asynchronous fetch in memory.
// fetchItem is the function that runs the request
// makeKey translates the request format to a unique string
// maxEntries limits the number of entries in the cache
// maxAgeMillis determines the longest possible time an entry can be used without revalidating
// requestRateFloor determines the minimum request rate per minute before the caching starts
// refreshWindowMillis defines a duration before maxAgeMillis when a background refresh should start
// eslint-disable-next-line arrow-parens
const createCache = <A extends unknown[], T>(fetchItem: (...args: A) => Promise<T>, {
  makeKey = (...args: A) => args.join('/'),
  maxEntries = DEFAULT_MAX_ENTRIES,
  minAgeMillis = DEFAULT_MIN_AGE_MILLIS,
  maxAgeMillis = DEFAULT_MAX_AGE_MILLIS,
  requestRateFloor = DEFAULT_REQUEST_RATE_FLOOR,
  refreshWindowMillis = DEFAULT_REFRESH_WINDOW_MILLIS,
} = {}) => {
  type CacheEntry = GenericCacheEntry<T>

  const cache = new Map<string, CacheEntry>()

  const getRequestsPerMinute = (entry: CacheEntry) => {
    const requestCount = entry.previousPeriodCount + entry.count

    // If we're still on the first period, count the duration as the full period duration
    const durationMillis = Math.max(
      PERIOD_DURATION_MILLIS,
      Date.now() - (entry.previousPeriodStart || entry.periodStart)
    )
    return requestCount / (durationMillis / MILLISECONDS_PER_MINUTE)
  }
  const shouldSkipCache = (entry: CacheEntry) => {
    if (entry.loadTimestamp) {
      const cacheAge = Date.now() - entry.loadTimestamp
      if (cacheAge > maxAgeMillis) {
        return true
      }
    }
    // If the request rate is below a specific rate, we don't need to use the cache.
    return getRequestsPerMinute(entry) < requestRateFloor
  }
  const needsRefresh = (entry: CacheEntry) => {
    const cacheAge = Date.now() - entry.loadTimestamp
    if (cacheAge < minAgeMillis) {
      return false
    }
    if (cacheAge > maxAgeMillis - refreshWindowMillis) {
      return true
    }
    // Averaging 35 req/minute means cache for 35 seconds
    return cacheAge > getRequestsPerMinute(entry) * MILLISECONDS_PER_SECOND
  }
  const incrementUsageCount = (entry: CacheEntry) => {
    if (Date.now() > entry.periodStart + PERIOD_DURATION_MILLIS) {
      entry.previousPeriodCount = entry.count
      entry.previousPeriodStart = entry.periodStart
      entry.periodStart = Date.now()
      entry.count = 1
    } else {
      entry.count++
    }
  }

  const runFetch = (args: A, entry: CacheEntry) => {
    const finish = (error: Error | null, result: T | null) => {
      entry.loadPromise = null
      entry.loadTimestamp = Date.now()
      if (error) {
        entry.error = error
        entry.hasValue = false
        entry.value = null
      } else {
        entry.error = null
        entry.hasValue = true
        entry.value = result
      }
    }

    entry.loadPromise = fetchItem(...args)
      .then((value) => {
        finish(null, value)
        return value
      }).catch((err) => {
        finish(err || new Error('Failed to fetch item in memory cache'), null)
        throw err
      })

    return entry.loadPromise
  }
  const removeLeastAccessed = () => {
    let leastKey = null
    let leastRate = 0

    cache.forEach((entry, key) => {
      const rate = getRequestsPerMinute(entry)
      if (!leastKey || rate < leastRate) {
        leastRate = rate
        leastKey = key
      }
    })

    cache.delete(leastKey)
  }
  const loadNewEntry = (key: string, args: A) => {
    if (cache.size >= maxEntries) {
      removeLeastAccessed()
    }

    const entry: CacheEntry = {
      count: 1,
      periodStart: Date.now(),
      previousPeriodCount: 0,
      previousPeriodStart: 0,
      loadTimestamp: 0,
      loadPromise: null,
      hasValue: false,
      value: null,
      error: null,
    }

    cache.set(key, entry)
    return runFetch(args, entry)
  }
  const getItem = async (...args: A): Promise<T> => {
    const key = makeKey(...args)
    const entry = cache.get(key)

    if (!entry) {
      return loadNewEntry(key, args)
    }

    incrementUsageCount(entry)

    if (shouldSkipCache(entry)) {
      return entry.loadPromise || runFetch(args, entry)
    }

    // This starts the promise without waiting on it
    // The logic below chooses whether to return the previously loaded value, or use the new promise
    if (!entry.loadPromise && needsRefresh(entry)) {
      runFetch(args, entry)
    }

    // Even if we have a pending load, we can continue to use the cached result if present.
    // If the previous result was an error though, it's fine to wait on the refresh promise
    // if there is one.
    if (entry.hasValue) {
      return entry.value
    } else if (entry.loadPromise) {
      return entry.loadPromise
    } else {
      throw entry.error
    }
  }

  return {
    getItem,
    clear: () => cache.clear(),
  }
}

export {
  createCache,
}
