import {addMonths, getDate, getMonth, setDate, setMonth, lastDayOfMonth} from 'date-fns'

type ValidityPeriod = 'ONE_MONTH' | 'CALENDAR_MONTH'

const calculateExpiresAtDate = (
  validityPeriod: ValidityPeriod,
  effectiveAt: Date,
  anchorDate?: Date
) => {
  if (validityPeriod !== 'ONE_MONTH' && validityPeriod !== 'CALENDAR_MONTH') {
    throw new Error(`Invalid validity period: ${validityPeriod}`)
  }

  let expiresAt: Date

  if (validityPeriod === 'CALENDAR_MONTH') {
    // return first day of the following month (expiresAt conditions are non-inclusive)
    expiresAt = setDate(addMonths(effectiveAt, 1), 1)
  }

  if (validityPeriod === 'ONE_MONTH') {
    let expiresAtMonth: number
    let expiresAtDay: number

    const referenceDate: Date = anchorDate || effectiveAt
    const referenceDay: number = getDate(referenceDate)

    if (referenceDay <= getDate(effectiveAt)) {
      // If the effectiveAt day is on or after the referenceDay this month,
      // the grant should expire in the following month
      const effectiveAtNextMonth: Date = addMonths(effectiveAt, 1)
      expiresAtMonth = getMonth(effectiveAtNextMonth)

      // If the referenceDay exists in next month, use it, else use last day of next month
      const daysInNextMonth: number = getDate(lastDayOfMonth(effectiveAtNextMonth))
      expiresAtDay = Math.min(referenceDay, daysInNextMonth)
    } else {
      // If the effectiveAt day is before the reference day this month,
      // the grant should expire in current month
      expiresAtMonth = getMonth(effectiveAt)

      // If the referenceDay exists in current month, use it, else use last day of current month
      const daysInCurrentMonth: number = getDate(lastDayOfMonth(effectiveAt))
      expiresAtDay = Math.min(referenceDay, daysInCurrentMonth)
    }

    // Preserve the time from the referenceDate
    expiresAt = setDate(setMonth(referenceDate, expiresAtMonth), expiresAtDay)
  }
  return expiresAt
}

export type {
  ValidityPeriod,
}

export {
  calculateExpiresAtDate,
}
