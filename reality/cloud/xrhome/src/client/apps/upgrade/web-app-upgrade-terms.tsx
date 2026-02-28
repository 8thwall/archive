import React from 'react'
import {useTranslation, Trans} from 'react-i18next'

import {getFormattedAmountDue} from '../../contracts/contract-pricing-formatter'
import {useFormattedIntervalBasis} from '../../../shared/billing/interval-formatter'
import LinkOut from '../../uiWidgets/link-out'

const WebAppUpgradeTerms = ({targetLicense}) => {
  const {t} = useTranslation(['app-pages'])
  const currentAmount = getFormattedAmountDue(targetLicense)
  const {intervalCount, interval} = targetLicense.subLicense
  const formattedIntervalBasis = useFormattedIntervalBasis(intervalCount,
    interval.toLowerCase(), 'adj')

  return (
    <>
      <p>
        <Trans
          ns='app-pages'
          i18nKey='purchase_license_page.web_app_upgrade_terms.toc_privacy_policy'
          components={{
            1: <LinkOut url='https://www.8thwall.com/terms' />,
            3: <LinkOut url='https://www.8thwall.com/privacy' />,
          }}
        />
      </p>
      <p>
        {/* TODO(kim): The English copy currently uses 'a/an'. Please correct this in the future */}
        <strong>
          {t(
            'purchase_license_page.web_app_upgrade_terms.auto_charge_subscription_interval',
            {currentAmount, formattedIntervalBasis}
          )}
        </strong>
        {' '}
        <Trans
          ns='app-pages'
          // eslint-disable-next-line max-len
          i18nKey='purchase_license_page.web_app_upgrade_terms.subscription_campaign_duration_settings'
          components={{
            2: <LinkOut url='https://8th.io/white-label' />,
          }}
        />
      </p>
      <p>
        {t('purchase_license_page.web_app_upgrade_terms.no_refunds')}
      </p>
    </>
  )
}

export default WebAppUpgradeTerms
