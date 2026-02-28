import {MILLISECONDS_PER_HOUR} from './time-utils'
import type {AppAnalyticsDataPoint} from './integration/app-analytics/app-analytics-api'

const METRIC_GRANULARITY = MILLISECONDS_PER_HOUR

const EMPTY_DATA_POINT: Omit<AppAnalyticsDataPoint, 'dt'> = {
  meanPageTimeMs: 0,
  totalPageMillis: 0,
  userSessions: 0,
  loggingRatio: 1,
  views: 0,
}

export {
  METRIC_GRANULARITY,
  EMPTY_DATA_POINT,
}
