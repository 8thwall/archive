import {useSelector} from '../hooks'
import useCurrentApp from './use-current-app'

const useScheduledEndDate = () => {
  const app = useCurrentApp()
  const subscriptions = useSelector(state => state.billing.subscriptionsByApp)
  const subscription = subscriptions && subscriptions[app.appKey]

  if (!app || !subscription) {
    return null
  }
  return new Date(subscription.current_period_end)
}

export default useScheduledEndDate
