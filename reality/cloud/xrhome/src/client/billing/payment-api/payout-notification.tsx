import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import LinkOut from '../../uiWidgets/link-out'
import {brandBlack} from '../../static/styles/settings'
import {NOTIFICATION_STATE} from '../../../shared/payout-constants'
import type {PaymentApiState} from './payout-types'
import {generateOnboardingLink} from './payout-utils'
import useCurrentAccount from '../../common/use-current-account'
import {StaticBanner} from '../../ui/components/banner'
import {Icon} from '../../ui/components/icon'

const useStyles = createUseStyles({
  notificationBody: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5em',
    width: '100%',
  },
  notificationLink: {
    marginLeft: 'auto',
    color: brandBlack,
    display: 'flex',
    alignItems: 'flex-end',
  },
})

interface IPayoutNotification {
  connectState: PaymentApiState
  // TODO(kim): add custom notificaiton messaging
}

const PayoutNotification: React.FC<IPayoutNotification> = ({connectState}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const currentState = NOTIFICATION_STATE.find(state => state.state === connectState)
  const account = useCurrentAccount()

  return (
    <StaticBanner type={currentState.type}>
      <div className={classes.notificationBody}>
        {t(currentState.message)}
        {currentState.link &&
          <LinkOut
            className={classes.notificationLink}
            url={generateOnboardingLink(account.uuid)}
          >
            {t('plan_billing_page.payout_notification.go_to_stripe')}&nbsp;
            <Icon stroke='external' />
          </LinkOut>
        }
      </div>
    </StaticBanner>
  )
}

export default PayoutNotification
