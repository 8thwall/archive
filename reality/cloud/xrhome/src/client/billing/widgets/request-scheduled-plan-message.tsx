import React from 'react'
import {createUseStyles} from 'react-jss'
import format from 'date-fns/format'
import type Stripe from 'stripe'
import {useTranslation, Trans} from 'react-i18next'

import ColoredMessage from '../../messages/colored-message'
import {
  getCurrentPhase, getUpcomingPhase,
} from '../../../shared/billing/subscription-schedule-phases'
import {stripeTimeToDate} from '../../../shared/time-utils'
import {useFormattedIntervalBasis} from '../../../shared/billing/interval-formatter'
import {Loader} from '../../ui/components/loader'
import {BoldButton} from '../../ui/components/bold-button'
import {brandBlack, tinyViewOverride} from '../../static/styles/settings'
import {products} from '../../../shared/stripe-client-config'
import type {UpgradableAccountTypes} from '../../../shared/account/account-types'
import {compareWebAccountTypes, getPlanTypeForAccountType} from '../../../shared/account-utils'

const useStyles = createUseStyles({
  messageContainer: {
    margin: '1em 0',
  },
  container: {
    'display': 'flex',
    'flexWrap': 'nowrap',
    '& p': {
      flex: 1,
      lineHeight: '1.25em',
      margin: 0,
    },
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  cancelRequestContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '1.25em',
    [tinyViewOverride]: {
      marginTop: '1em',
      justifyContent: 'flex-end',
    },
  },
  cancelRequestButton: {
    height: '1.25em',
    lineHeight: '1.25em',
    color: brandBlack,
    whiteSpace: 'nowrap',
  },
})

const getScheduledAccountType = (phase) => {
  const productId = (phase.items[0].price as Stripe.Price).product
  const accountTypeForProduct = Object.keys(products).find(
    accountType => products[accountType].has(productId)
  )
  return accountTypeForProduct as UpgradableAccountTypes || null
}

const useUpdatingPhaseText = (accountSubscriptionSchedule, updatingDate) => {
  const {t} = useTranslation('account-pages')
  const currentPrice = getCurrentPhase(
    accountSubscriptionSchedule
  )?.items[0]?.price as Stripe.Price
  const upcomingPrice = getUpcomingPhase(
    accountSubscriptionSchedule
  )?.items[0]?.price as Stripe.Price
  const {
    interval_count: currentIntervalCount,
    interval: currentInterval,
  } = currentPrice.recurring
  const currentFormattedIntervalBasis =
    useFormattedIntervalBasis(currentIntervalCount, currentInterval, 'adv')
  const {
    interval_count: upcomingIntervalCount,
    interval: upcomingInterval,
  } = upcomingPrice.recurring
  const upcomingFormattedIntervalBasis =
    useFormattedIntervalBasis(upcomingIntervalCount, upcomingInterval, 'adv')

  return t('plan_billing_page.request_scheduled_plan.updating_phase_text',
    {currentFormattedIntervalBasis, upcomingFormattedIntervalBasis, updatingDate})
}

const RequestScheduledPlanMessage = ({
  accountSubscriptionSchedule, onCancelScheduledPlanClick, cancelScheduledPlanPending,
}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const currentPlan = getScheduledAccountType(getCurrentPhase(accountSubscriptionSchedule))
  const upcomingPlan = getScheduledAccountType(getUpcomingPhase(accountSubscriptionSchedule))
  const scheduledDirection = compareWebAccountTypes(currentPlan, upcomingPlan)

  const updatingDate =
    format(stripeTimeToDate(accountSubscriptionSchedule.current_phase?.end_date), 'MM/dd/yy')
  const updatingPhaseText = useUpdatingPhaseText(accountSubscriptionSchedule, updatingDate)
  const planTypeForAccountType = getPlanTypeForAccountType(upcomingPlan)

  return (
    <ColoredMessage className={classes.messageContainer} iconName='info circle' color='blue'>
      <div className={classes.container}>
        {scheduledDirection === 0 &&
          <p>
            {updatingPhaseText}
          </p>
        }
        {scheduledDirection < 0 &&
          <p>
            <Trans
              ns='account-pages'
              i18nKey='plan_billing_page.request_scheduled_plan.message.less_direction'
            >
              Your request for downgrading to <b>{{planTypeForAccountType}}</b> plan
              is submitted and it will be updated at the end of the billing period
              on <b>{{updatingDate}}</b>
            </Trans>
          </p>
        }
        <div className={classes.cancelRequestContainer}>
          {cancelScheduledPlanPending
            ? <Loader inline size='small' />
            : (
              <BoldButton
                className={classes.cancelRequestButton}
                onClick={onCancelScheduledPlanClick}
              >
                {t('plan_billing_page.request_scheduled_plan.message.cancel_request')}
              </BoldButton>
            )
          }
        </div>
      </div>
    </ColoredMessage>
  )
}

export default RequestScheduledPlanMessage
