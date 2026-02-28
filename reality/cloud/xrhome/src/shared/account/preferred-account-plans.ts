import type {AccountPlan, AvailableAccountPlans, PreferredAccountPlan} from './account-types'

const compareAccountPlansByInterval = (planA: AccountPlan, planB: AccountPlan) => {
  const intervalPriority = {
    'day': 0,
    'week': 1,
    'month': 2,
    'year': 3,
  }

  if (planA.interval === planB.interval && planA.intervalCount === planB.intervalCount) {
    // Interval and interval counts match. Sort by plan amount.
    return planA.amount - planA.amount
  }

  if (planA.interval === planB.interval) {
    // Intervals match. Sort by interval count.
    return planA.intervalCount - planB.intervalCount
  }

  // Intervals are different. Sort by the intervals.
  return intervalPriority[planA.interval] - intervalPriority[planB.interval]
}

const getHighestPriorityPlan =
  (plans: AccountPlan[]): AccountPlan => plans.sort(compareAccountPlansByInterval)[0]

const getPreferredAccountPlans = (plansByType: AvailableAccountPlans): PreferredAccountPlan[] => {
  const planTypes = Object.keys(plansByType) as Array<keyof typeof plansByType>
  return planTypes.reduce((acc, planType) => {
    const plans = plansByType[planType]
    const plan = getHighestPriorityPlan(plans)
    return [...acc, {...plan, accountType: planType}]
  }, [] as PreferredAccountPlan[])
}

export {
  compareAccountPlansByInterval,
  getPreferredAccountPlans,
}
