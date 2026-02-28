import React from 'react'
import {useTranslation, Trans} from 'react-i18next'

import {useSelector} from '../../hooks'
import type {RootState} from '../../reducer'

// Determines string to display for Payout Schedule
const PayoutScheduleText = () => {
  const {t} = useTranslation('account-pages')
  const schedule =
    useSelector((state: RootState) => state.payments.payoutDetails?.connectAccount?.schedule)
  if (schedule.interval === 'daily') {
    return <>{t('plan_billing_page.payout_schedule_text.daily')}</>
  }

  if (schedule.interval === 'weekly') {
    return <>{t(`plan_billing_page.payout_schedule_text.weekly_${schedule.weekly_anchor}`)}</>
  }

  if (schedule.monthly_anchor === 15) {
    return (
      <Trans
        ns='account-pages'
        i18nKey='plan_billing_page.payout_schedule_text.monthly_15th'
      >
        15<sup>th</sup> of every month
      </Trans>
    )
  }

  return <>{t('plan_billing_page.payout_schedule_text.monthly')}</>
}

export default PayoutScheduleText
