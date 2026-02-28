import addDays from 'date-fns/addDays'
import addWeeks from 'date-fns/addWeeks'
import addMonths from 'date-fns/addMonths'
import addYears from 'date-fns/addYears'

type IntervalType = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'

/* Get date-fns function based on intervalType */
const getAddIntervalFn = (intervalType: IntervalType) => {
  switch (intervalType) {
    case 'DAY':
      return addDays
    case 'WEEK':
      return addWeeks
    case 'MONTH':
      return addMonths
    case 'YEAR':
      return addYears
    default:
      throw new Error(`Not a valid interval type ${intervalType}`)
  }
}

/* Returns periodStart + (intervalCount * intervalType) */
const addTimeWithInterval = (
  periodStart: Date | number, intervalType: IntervalType, intervalCount: number
) => getAddIntervalFn(intervalType)(periodStart, intervalCount)

export {
  addTimeWithInterval,
}
