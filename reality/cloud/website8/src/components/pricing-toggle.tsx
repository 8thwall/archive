import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'
import React from 'react'

import {bool, combine} from '../styles/classname-utils'
import * as classes from './pricing-toggle.module.scss'

interface IPricingToggle {
  showAnnualPricing: boolean,
  setShowAnnualPricing: () => void
}

const PricingToggle: React.FC<IPricingToggle> = ({
  showAnnualPricing, setShowAnnualPricing,
}) => {
  const {t} = useTranslation(['pricing-page'])

  return (
    <div className={classes.pricingToggleBlock}>
      <label className={classes.pricingToggleContainer} htmlFor='pricingToggle'>
        <input
          type='checkbox'
          className={classes.pricingToggleInput}
          onClick={setShowAnnualPricing}
          id='pricingToggle'
          checked={showAnnualPricing}
        />
        <div className={classes.pricingToggle} />
        <div className={combine(classes.options, bool(!showAnnualPricing, classes.optionSelected))}>
          {t('pricing_toggle.pay_monthly')}
        </div>
        <div className={combine(classes.options, bool(showAnnualPricing, classes.optionSelected))}>
          {t('pricing_toggle.pay_annually')}
        </div>
      </label>
      <div className={classes.savePercentText}>
        <Trans
          ns='pricing-page'
          i18nKey='pricing_toggle.save_upfront'
        >
          Save up to <b>25%</b> paying upfront
        </Trans>
      </div>
    </div>
  )
}

export default PricingToggle
