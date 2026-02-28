import React from 'react'
import format from 'date-fns/format'
import type Stripe from 'stripe'
import {useTranslation} from 'react-i18next'
import type {DeepReadonly} from 'ts-essentials'

import {formatToCurrency} from '../../../shared/billing/currency-formatter'
import {stripeTimeToDate} from '../../../shared/time-utils'

interface INextPayment {
  upcomingInvoice: DeepReadonly<Stripe.Invoice>
  className?: string
}

const NextPayment: React.FC<INextPayment> = ({upcomingInvoice, className}) => {
  const {t} = useTranslation(['account-pages'])
  if (!upcomingInvoice) {
    return null
  }

  const paymentAmount = formatToCurrency(upcomingInvoice.amount_due)
  const paymentDate = format(stripeTimeToDate(upcomingInvoice.created), 'MM/dd/yy')
  const text = t(
    'plan_billing_page.billing_setting.licenses.table.column.next_payment',
    {paymentAmount, paymentDate}
  )

  return (
    <p className={className}>{text}</p>
  )
}

export default NextPayment
