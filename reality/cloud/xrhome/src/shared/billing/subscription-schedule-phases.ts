import type {Stripe} from 'stripe'
import type {DeepReadonly} from 'ts-essentials'

const getCurrentPhaseIndex = (
  schedule: DeepReadonly<Stripe.SubscriptionSchedule>
): number => (
  schedule.phases.findIndex(phase => (
    phase.start_date === schedule.current_phase?.start_date &&
    phase.end_date === schedule.current_phase?.end_date
  ))
)

const getCurrentPhase = (
  schedule: Stripe.SubscriptionSchedule | null
): Stripe.SubscriptionSchedule.Phase | null => {
  if (!schedule) {
    return null
  }

  const currentPhaseIndex = getCurrentPhaseIndex(schedule)
  return currentPhaseIndex !== -1 ? schedule.phases[currentPhaseIndex] : null
}

const getUpcomingPhase = (
  schedule: DeepReadonly<Stripe.SubscriptionSchedule> | null
): DeepReadonly<Stripe.SubscriptionSchedule.Phase> | null => {
  if (!schedule) {
    return null
  }

  const currentPhaseIndex = getCurrentPhaseIndex(schedule)
  if (currentPhaseIndex === -1 || currentPhaseIndex + 1 >= schedule.phases.length) {
    return null
  }
  return schedule.phases[currentPhaseIndex + 1]
}

export {
  getCurrentPhase,
  getUpcomingPhase,
}
