import React from 'react'
import {useRouteMatch} from 'react-router-dom'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {Icon} from '../../ui/components/icon'
import {useSelector} from '../../hooks'
import {getPaymentMethods} from '../../billing/billing-utils'
import {getRouteAccount} from '../../common/paths'
import {useCollapsibleSettingsGroup} from '../../settings/use-collapsible-settings-group'
import CollapsibleSetting from '../../settings/collapsible-setting'
import PaymentAPISetting from '../../billing/payment-api/payment-api-setting'
import {isBillingRole} from '../../../shared/roles-utils'

const useStyles = createUseStyles(({
  iconAlign: {
    verticalAlign: 'middle',
  },
  settingContainer: {
    'marginTop': '2.5em',
    '& > div': {
      borderRadius: '0.5em',
    },
  },
}))

enum Setting {
  COMMERCIAL_PROJECTS,
  INVOICES,
  ACCOUNT_INFO,
  PAYMENT_METHODS,
  PAYMENT_API,
}

const useAvailableSettings = () => {
  const match = useRouteMatch()
  const account = useSelector(state => getRouteAccount(state, match))
  const billing = useSelector(state => state.billing)
  const user = account.Users[0]
  const userCanViewBilling = isBillingRole(user.role)
  const paymentMethods = useSelector(state => getPaymentMethods(state))
  const canViewSubscriptionSettings = userCanViewBilling
  const canViewInvoiceSettings = userCanViewBilling && !billing.pending
  const canViewPaymentSettings = userCanViewBilling && !!account.stripeId && !!paymentMethods
  const availableSettings = new Set()

  if (canViewSubscriptionSettings) {
    availableSettings.add(Setting.COMMERCIAL_PROJECTS)
  }
  if (canViewInvoiceSettings) {
    availableSettings.add(Setting.INVOICES)
    if (account.stripeId) {
      availableSettings.add(Setting.ACCOUNT_INFO)
    }
  }
  if (canViewPaymentSettings) {
    availableSettings.add(Setting.PAYMENT_METHODS)
    availableSettings.add(Setting.PAYMENT_API)
  }

  return availableSettings
}

const AccountBillingSettings: React.FC = React.memo(() => {
  const {t} = useTranslation(['account-pages'])
  const availableSettings = useAvailableSettings()
  const defaultOpenSettings = [Setting.COMMERCIAL_PROJECTS].filter(
    setting => availableSettings.has(setting)
  )
  const {
    expandedSettings,
    toggleSetting,
  } = useCollapsibleSettingsGroup(availableSettings, defaultOpenSettings)
  const classes = useStyles()

  if (!availableSettings.has(Setting.PAYMENT_API)) {
    return null
  }

  return (
    <div className={classes.settingContainer}>
      <CollapsibleSetting
        active={expandedSettings.has(Setting.PAYMENT_API)}
        onClick={() => { toggleSetting(Setting.PAYMENT_API) }}
        title={(
          <>
            {t('plan_billing_page.billing_setting.title.payments_api')}
            <Icon inline stroke='creditCardOutline' />
          </>
        )}
      >
        <PaymentAPISetting />
      </CollapsibleSetting>
    </div>
  )
})

export default AccountBillingSettings
