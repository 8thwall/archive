import {useTranslation} from 'gatsby-plugin-react-i18next'
import React from 'react'

import Toggle from './toggle'
import Badge from './badge'

import * as styles from './plan-billing-toggle.module.scss'

interface IPlanBillingToggle {
  showToggledState: boolean,
  onToggleClick: () => void
}

const PlanBillingToggle: React.FC<IPlanBillingToggle> = ({
  showToggledState, onToggleClick,
}) => {
  const {t} = useTranslation(['pricing-page'])

  return (
    <Toggle
      id='billing'
      showToggledState={showToggledState}
      onToggleClick={onToggleClick}
      toggledText={(
        <div>
          {t('pricing_toggle.pay_yearly')}&nbsp;
          <Badge height='small' color='mint' className={styles.pricingBadge}>Save up to 25%</Badge>
        </div>
      )}
      untoggledText={t('pricing_toggle.pay_monthly')}
      toggleBkgColor='white'
      bkgColor='moonlight'
    />
  )
}

export default PlanBillingToggle
