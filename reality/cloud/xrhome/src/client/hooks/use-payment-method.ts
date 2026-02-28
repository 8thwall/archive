import type Stripe from 'stripe'

import {getPaymentMethods} from '../billing/billing-utils'
import {useSelector} from '../hooks'

const usePaymentMethod = (sourceId: string): Stripe.PaymentMethod => useSelector(
  state => sourceId && getPaymentMethods(state)?.find(s => s.id === sourceId)
)

export {usePaymentMethod}
