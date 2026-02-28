import React from 'react'
import {useTranslation} from 'react-i18next'

import ButtonLink from '../uiWidgets/button-link'
import {useSelector} from '../hooks'
import useCurrentAccount from '../common/use-current-account'

interface ICancelSubscriptionButton {
  disabled?: boolean
  onCancelClick: () => void
}

const CancelSubscriptionButton: React.FC<ICancelSubscriptionButton> = ({
  onCancelClick,
  disabled = false,
}) => {
  const {t} = useTranslation(['account-pages'])
  const account = useCurrentAccount()
  const apps = useSelector(state => state.apps)

  if (account.pendingCancellation !== 'None' || apps.loading) {
    return null
  }

  return (
    <div className='auto-renew-status'>
      <ButtonLink
        onClick={onCancelClick}
        tabIndex={0}
        onKeyPress={onCancelClick}
        color='black'
        disabled={disabled}
        a8='click;xr-home-account;cancel-subscription'
      >
        {t('plan_billing_page.cancel_subscription_button')}
      </ButtonLink>
    </div>
  )
}

export default CancelSubscriptionButton
