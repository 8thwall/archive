import addDays from 'date-fns/addDays'
import getUnixTime from 'date-fns/getUnixTime'

const UPGRADEABLE_TO_ACCOUNT = ['WebAgency', 'WebBusiness', 'WebStarter', 'WebPlus']
const TRIAL_PERIOD_DAYS = 14

/* NOTE(dat): To avoid user's confusion and err on the side of delight, we
   are giving the user a full extra day of trial.
 If a user sees on the front end that their trial ends on 5/15, they will be surprised
 to receive an invoice on 5/15 8:00:01 even though they signed up on 5/1 8:00:00.
 We considered sending them an invoice on the first second of the day on 5/16. This results
 in an invoice email being the first thing in their inbox in the morning. We instead give
 the user 15 days of trial. Their $0 invoice for trial will show the full 15 days
 period: 5/1 - 5/16. Their next period will be 5/16 - 6/16. Their UI will show the
 trial ending on 5/15. The only eyebrow raising would be the $0 invoice period. But
 that would only be to our user's delight.
 */
const getTrialEndDateFrom = now => (
  addDays(now, TRIAL_PERIOD_DAYS + 1)
)

const getTrialEndDate = () => {
  const now = new Date()
  return getTrialEndDateFrom(now)
}

// For the UI, we don't want to show the extra 1 day
const getTrialEndDateInUI = () => addDays(new Date(), TRIAL_PERIOD_DAYS)

const getTrialEndUnixSecond = () => (
  getUnixTime(getTrialEndDateFrom(new Date()))
)

export {
  UPGRADEABLE_TO_ACCOUNT,
  TRIAL_PERIOD_DAYS,
  getTrialEndDate,
  getTrialEndDateInUI,
  getTrialEndUnixSecond,
}
