import {getDataRealmForEnvironment, type Environment} from '../../data-realm'
import {generateIntervalTimestamps} from '../../time-utils'
import {Ddb} from '../dynamodb/dynamodb'
import type {
  AppAnalyticsDataPoint, IAppAnalyticsApi,
} from './app-analytics-api'
import {AttributesForRaw, fromAttributes, toAttributes} from '../dynamodb/typed-attributes'
import {EMPTY_DATA_POINT, METRIC_GRANULARITY} from '../../app-analytics-constants'

const TABLE_PREFIX = 'app-analytics'

const createAppAnalyticsApi = (env: Environment): IAppAnalyticsApi => {
  const dataRealm = getDataRealmForEnvironment(env)
  const fullTableName = `${TABLE_PREFIX}-${dataRealm}`

  // The true type of item here is this, but we can't use it directly
  // since the record will clash with the pk, sk and TS does not have
  // negated types. Inputs will unfortunately need to
  // be manually typed if they correspond to the following type:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type AppAnalyticsItemTrue = Record<string, AppAnalyticsDataPoint> & {
    pk: string
    sk: string
  }

  type AppAnalyticsItem = Record<string, AppAnalyticsDataPoint>

  /**
  * Helper function to convert an item to an array of AppAnalyticsDataPoint.
  * @param item DDB item type.
  * @returns Array of AppAnalyticsDataPoint sorted by date increasing.
  */
  const itemToAppAnalyticsArray = (
    key: { pk: string; sk: string },
    item: AppAnalyticsItem
  ) => {
    // The sorting key is guaranteed to be floored to the month.
    const monthStart = new Date(key.sk)
    const monthEnd = new Date(monthStart)
    monthEnd.setUTCMonth(monthStart.getUTCMonth() + 1)
    const expectedStamps = generateIntervalTimestamps(monthStart, monthEnd, METRIC_GRANULARITY)
    return expectedStamps.map((stamp) => {
    // Only hours that have data will be present in the record.
    // So if an hour is not present, we should return an empty data point,
    // timed to the hour.
      if (!item[stamp.toISOString()]) {
        return {
          ...EMPTY_DATA_POINT,
          dt: stamp.toISOString(),
        }
      }
      return {
        ...item[stamp.toISOString()],
        dt: stamp.toISOString(),
      }
    })
  }

  /**
   * Gets a month's worth of analytics data for a specific app.
   * @param appKey an app key
   * @param month An ISO8601 timestamp floored to the month.
   * @returns An array of AppAnalyticsDataPoint sorted by date increasing,
   * if no data found, returns an array of EMPTY_DATA_POINT with hourly
   * stamps.
   */
  const getMonthAppData = async (appKey: string, month: string) => {
    const key = {
      pk: appKey,
      sk: month,
    }

    const itemMonthly = (await Ddb.use().getItem({
      TableName: fullTableName,
      Key: toAttributes(key),
      // The month item is not guaranteed to exist. If it does not exist,
      // it is equivalent to a null object (no hourly data).
    })).Item ?? {}

    const monthly = fromAttributes(itemMonthly as AttributesForRaw<AppAnalyticsItem>)

    return itemToAppAnalyticsArray(key, monthly)
  }

  return {
    getMonthAppData,
  }
}

export {
  createAppAnalyticsApi,
}
