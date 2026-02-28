import {entry} from '../../registry'

type AppAnalyticsDataPoint = {
  dt: string
  meanPageTimeMs: number
  totalPageMillis: number
  userSessions: number
  loggingRatio: number
  views: number
}

type CsvAppAnalyticsDataPoint = {
  dt: string
  meanDwellTimeMs: number  // meanPageTimeMs renamed to meanDwellTimeMs for CSV export.
  views: number
}

type AppAnalyticsData = AppAnalyticsDataPoint[]

interface IAppAnalyticsApi {
  getMonthAppData: (appKey: string, month: string) => Promise<AppAnalyticsData>
}

const AppAnalyticsApi = entry<IAppAnalyticsApi>('app-analytics-api')

export {
  AppAnalyticsApi,
  type IAppAnalyticsApi,
  type AppAnalyticsData,
  type AppAnalyticsDataPoint,
  type CsvAppAnalyticsDataPoint,
}
