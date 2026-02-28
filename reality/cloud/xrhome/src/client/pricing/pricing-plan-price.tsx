import React from 'react'

import {Trans} from 'react-i18next'

import {createThemedStyles} from '../ui/theme'
import {combine} from '../common/styles'

const useStyles = createThemedStyles(theme => ({
  pricingPlanPrice: {
    display: 'flex',
    gap: '0.25em',
    alignItems: 'baseline',
    lineHeight: '1.75em',
  },
  priceSign: {
    alignSelf: 'flex-start',
  },
  priceNumber: {
    fontFamily: theme.headingFontFamily,
    fontSize: '2em',
    fontWeight: 700,
  },
  priceInterval: {
    fontSize: '1.125em',
    lineHeight: '1.125em',
  },
}))

const PricingPlanPrice: React.FC<{price: number}> = ({price}) => {
  const classes = useStyles()

  return (
    <div className={classes.pricingPlanPrice}>
      <span className={combine(classes.priceInterval, classes.priceSign)}>
        $
      </span>
      <Trans
        ns='pricing-page'
        i18nKey='credit_pricing_card.credit_price.monthly'
        values={{price}}
        components={{
          1: <div className={classes.priceNumber} />,
          2: <div className={classes.priceInterval} />,
        }}
      />
    </div>
  )
}

export {PricingPlanPrice}
