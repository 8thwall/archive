import type {IBanner} from '../client/ui/components/banner'

interface INotifState {
  state: string
  type: IBanner['type']
  message: string
  link?: boolean
}

const NOTIFICATION_STATE: INotifState[] = [
  {
    state: 'pending',
    type: 'info',
    message: 'plan_billing_page.payout_constants.pending',
    link: true,
  },
  {
    state: 'requirementserror',
    type: 'danger',
    message: 'plan_billing_page.payout_constants.requirementserror',
    link: true,
  },
  {
    state: 'warning',
    type: 'warning',
    message: 'plan_billing_page.payout_constants.warning',
    link: true,
  },
  {
    state: 'networkerror',
    type: 'danger',
    message: 'plan_billing_page.payout_constants.networkerror',
  },
]

const COUNTRIES_ALLOW_LIST = ['US', 'JP', 'AU', 'CA', 'GB', 'NZ']

export {
  NOTIFICATION_STATE,
  COUNTRIES_ALLOW_LIST,
}
