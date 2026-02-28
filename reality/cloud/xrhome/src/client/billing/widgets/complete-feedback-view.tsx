import * as React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {Badge} from '../../ui/components/badge'
import {Icon} from '../../ui/components/icon'
import useCurrentAccount from '../../common/use-current-account'
import {useSelector} from '../../hooks'
import {getCurrentBillingEndDate} from '../billing-utils'
import {getActiveCreditGrant} from '../../../shared/feature-utils'
import {useCreditQuery} from '../use-credit-query'

const useStyles = createUseStyles({
  heading: {
    margin: '0.7em 0',
    fontWeight: '700',
  },
  bodyText: {
    fontSize: '1.125em',
    lineHeight: '1.5em',
  },
})

interface ICompleteFeedbackView {
  isCreditSubscription?: boolean
}

const EndFeedbackMessage: React.FC<ICompleteFeedbackView> = ({isCreditSubscription}) => {
  const classes = useStyles()
  const {i18n} = useTranslation(['account-pages'])
  const {data} = useCreditQuery()
  const account = useCurrentAccount()
  const cycleEndDate = useSelector(state => getCurrentBillingEndDate(state))

  if (isCreditSubscription) {
    const activeCreditGrant = getActiveCreditGrant(account.Features)
    const activeOption = (activeCreditGrant?.optionName)?.toLowerCase()
    const creditCycleEndDate = new Date(
      data.categorizedCreditGrants.PAID_PLAN?.slice().reverse().find(g => g.expiresAt).expiresAt
    )
    const formattedCreditCycleEndDate = creditCycleEndDate &&
      Intl.DateTimeFormat(i18n.language).format(creditCycleEndDate)

    return (
      <p className={classes.bodyText}>
        <Trans
          ns='account-pages'
          i18nKey={`plan_billing_page.complete_feedback_view.credit_plan_canceled.${activeOption}`}
          values={{endDate: formattedCreditCycleEndDate}}
          components={{
            1: <b />,
          }}
        />
      </p>
    )
  } else {
    const accountType = account.accountType.toLowerCase()
    const formattedEndDate = cycleEndDate && Intl.DateTimeFormat(i18n.language).format(cycleEndDate)

    return (
      <p className={classes.bodyText}>
        <Trans
          ns='account-pages'
          i18nKey={`plan_billing_page.complete_feedback_view.plan_canceled.${accountType}`}
          values={{endDate: formattedEndDate}}
          components={{
            b: <b />,
          }}
        />
      </p>
    )
  }
}

const CompleteFeedBackView: React.FC<ICompleteFeedbackView> = ({isCreditSubscription = false}) => {
  const classes = useStyles()
  const {t} = useTranslation(['account-pages'])

  return (
    <>
      <Badge color='mint' height='small' variant='pastel'>
        <Icon color='successDark' stroke='checkmark' />
        {t('plan_billing_page.complete_feedback_view.badge.submitted')}
      </Badge>
      <h2 className={classes.heading}>
        {t('plan_billing_page.complete_feedback_view.heading.thank_you')}
      </h2>
      <EndFeedbackMessage isCreditSubscription={isCreditSubscription} />
    </>
  )
}

export default CompleteFeedBackView
