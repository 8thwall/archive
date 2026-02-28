import IntervalTree, {Interval} from '@flatten-js/interval-tree'

import type {DeepReadonly} from 'ts-essentials'

import {MILLISECONDS_PER_HOUR} from '../../shared/time-utils'
import {makeRunQueue} from '../../shared/run-queue'

/**
 * Creates an interval tree that can be used to efficiently query
 * and insert data in a time range. The data structure is
 * safe to be written to concurrently (locks and queues writes).
 * @param mapper An asynchronous function that takes a range and returns the data in that range
 * @param granularity An optional parameter that specifies the granularity of the data,
 * if not passed defaults to MILLISECONDS_PER_HOUR
 * @returns loadRange as a writing function,
 * getRange as a read (but may load data) function
 */
const makeAnalyticsIntervalTree = <T>(
  // eslint-disable-next-line arrow-parens
  mapper: (start: Date, end: Date) => Promise<T[]>,
  granularity: number = MILLISECONDS_PER_HOUR
) => {
  const tree = new IntervalTree<T[]>()

  const runQueue = makeRunQueue()

  type IntervalData = {
    interval: Interval
    data: T[]
  }

  const createNewIntervals = (
    searchInterval: Interval, existingIntervals: DeepReadonly<Interval[]>
  ): Interval[] => {
    const newIntervals: Interval[] = []
    let runningLow = searchInterval.low
    for (const interval of existingIntervals) {
      // Case 1: Existing interval entirely contains the search interval
      if (interval.low <= runningLow && searchInterval.high <= interval.high) {
        runningLow = searchInterval.high
        break
      }
      // Case 2: Search interval entirely contains the existing interval
      if (runningLow < interval.low && interval.high < searchInterval.high) {
        newIntervals.push(new Interval(runningLow, interval.low))
        runningLow = interval.high
        // eslint-disable-next-line no-continue
        continue
      }
      // Case 3: Existing interval is partially before the search interval
      if (interval.low <= runningLow) {
        runningLow = interval.high
        // eslint-disable-next-line no-continue
        continue
      }
      // Case 4: Existing interval is partially after the search interval
      if (searchInterval.high <= interval.high) {
        newIntervals.push(new Interval(runningLow, interval.low))
        runningLow = searchInterval.high
        break
      }
    }
    // Check if we've added the last part of the search interval
    if (runningLow < searchInterval.high) {
      newIntervals.push(new Interval(runningLow, searchInterval.high))
    }
    return newIntervals
  }

  const mergeNewIntervalData = (
    existingIntervalData: IntervalData[], newIntervalData: IntervalData[]
  ) => {
    // remove the existing nodes
    existingIntervalData.forEach(({interval, data}) => {
      tree.remove(interval, data)
    })
    const allData = existingIntervalData.concat(newIntervalData)
    const sorted = allData.sort((a, b) => a.interval.low - b.interval.low)
    // merge all the nodes
    const final = sorted.reduce(
      (
        {interval: accInterval, data: accData},
        {interval: newInterval, data: newData}
      ) => ({interval: accInterval.merge(newInterval), data: accData.concat(newData)})
    )
    tree.insert(final.interval, final.data)
  }

  /**
   * Will update the tree with the data in the range
   * from calling the mapping function on the range
   * in the maximally efficient way (no overlapping requests),
   * and ensure that any overlapping intervals are merged.
   * Guarantees that tree.search will return a single containing
   * interval for the range.
   * @param start The start date of the range to be loaded
   * @param end The end date of the range to be loaded
   */
  const loadRange = async (
    start: Date, end: Date
  ) => {
    const mergeThunk = async () => {
      const loadInterval = new Interval(start.getTime(), end.getTime())
      // @ts-ignore Search is typed as any in the library
      const existingIntervalData: IntervalData[] = tree.search(
        loadInterval, (data, interval) => ({data, interval})
      )
      const newIntervals = createNewIntervals(
        loadInterval, existingIntervalData.map(({interval}) => interval)
      )
      if (newIntervals.length === 0) {
        return
      }
      const newIntervalData: IntervalData[] = await Promise.all(
        newIntervals.map(
          async (interval) => {
            const data = await mapper(new Date(interval.low), new Date(interval.high))
            // transform the data into the interval data format
            return {interval, data}
          }
        )
      )
      mergeNewIntervalData(existingIntervalData, newIntervalData)
    }
    await runQueue.next(mergeThunk)
  }

  /**
   * Returns an array of data that is exactly the data between the two dates
   * @param start The start date of the range
   * @param end The end date of the range
   * @param bucketingFn A function that takes in a timestamp and returns a string
   * corresponding to the bucket that the timestamp should be placed in. E.g. monthly buckets
   * can return the ISO string of the start of the month. The buckets must be continuous,
   * e.g. BUCKET1___BUCKET2___BUCKET1 is not allowed. By default, the bucketing function
   * uses the data's bucketing. E.g. if the data in the tree is hourly it will return the
   * exact hourly data in the tree.
   * @param reducer A function that takes two data points and returns a single data point
   * that is the combination of the two. E.g. summing total time spent or averaging. Used
   * to combine data points that are in the same bucket.
   * @returns data: T[], sorted by date ascending
   */
  const getRange = async (
    start: Date, end: Date,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reducer: (a: T, b: T) => T,
    bucketingFn: (timestamp: Date) => string = timestamp => timestamp.toISOString()
  ) => {
    // Verifies that data is in the tree, if not,
    // will load it. Otherwise does no excess work.
    await loadRange(start, end)
    const getInterval = new Interval(start.getTime(), end.getTime())
    // @ts-ignore Search is typed as any in the library
    const containingIntervalData: IntervalData[] = tree.search(
      getInterval, (data, interval) => ({data, interval})
    )
    // The load range call above guarantees there is exactly one interval that fully
    // contains the range.
    const [{interval: containingInterval, data}] = containingIntervalData
    const startIndex = Math.floor((getInterval.low - containingInterval.low) / granularity)
    const endIndex = Math.floor((getInterval.high - containingInterval.low) / granularity)
    const slicedData = data.slice(startIndex, endIndex)
    const bucketedData = slicedData.reduce((acc, val, i) => {
      const timestamp = new Date(containingInterval.low + i * granularity)
      const bucket = bucketingFn(timestamp)
      if (acc.currentBucket !== bucket) {
        acc.currentBucket = bucket
        acc.bucketed.push(val)
      } else {
        const previous = acc.bucketed[acc.bucketed.length - 1]
        acc.bucketed[acc.bucketed.length - 1] = reducer(previous, val)
      }
      return acc
    }, {currentBucket: '', bucketed: [] as T[]})
    return bucketedData.bucketed
  }

  return {
    loadRange,
    getRange,
  }
}

export {
  makeAnalyticsIntervalTree,
}
