import parseISO from 'date-fns/parseISO'

export {default as reducer} from './usage-reducer'
export {default as middleware} from './usage-middleware'

export function getPeriodStart(lastBillingClose, createdAt, from = new Date()) {
  const anchor = lastBillingClose || createdAt
  if (!anchor) return undefined
  const anchorDateOfTheMonth = parseISO(anchor).getDate()
  const lastMonthDays = (new Date(from.getFullYear(), from.getMonth(), 0)).getDate()

  let periodStart
  if (anchorDateOfTheMonth <= from.getDate()) {
    periodStart = new Date(from.getFullYear(), from.getMonth(), anchorDateOfTheMonth)
  } else {
    periodStart = new Date(from.getFullYear(), from.getMonth() - 1, Math.min(lastMonthDays, anchorDateOfTheMonth))
  }
  return periodStart
}
