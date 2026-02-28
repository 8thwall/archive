import React from 'react'
import {createUseStyles} from 'react-jss'
import {Trans} from 'react-i18next'

import {gray3} from '../../static/styles/settings'
import {combine} from '../../common/styles'
import {CREDIT_GRANT_FEATURE} from '../../../shared/feature-config'

const useStyles = createUseStyles({
  priceContainer: {
    display: 'flex',
    gap: '0.25em',
    alignItems: 'baseline',
    lineHeight: '1.75em',
  },
  priceSign: {
    alignSelf: 'flex-start',
  },
  priceNumber: {
    fontSize: '2em',
    fontWeight: 700,
  },
  priceOriginal: {
    color: gray3,
    textDecoration: 'line-through',
  },
  priceInterval: {
    fontSize: '1.125em',
    lineHeight: '1.125em',
  },
})

interface ICreditDisplayPrice {
  optionName: string
  price?: number
  originalPrice?: number
}

const CreditDisplayPrice: React.FC<ICreditDisplayPrice> = ({
  optionName, price, originalPrice,
}) => {
  const classes = useStyles()

  const isEnterprise = optionName === CREDIT_GRANT_FEATURE.Enterprise.name
  const isPower = optionName === CREDIT_GRANT_FEATURE.PowerSub.name
  const isCore = optionName === CREDIT_GRANT_FEATURE.CoreSub.name
  const {isTopUp} = CREDIT_GRANT_FEATURE[optionName]

  return (
    <div className={classes.priceContainer}>
      {!isEnterprise &&
        <span className={combine(classes.priceInterval, classes.priceSign)}>
          $
        </span>
      }
      {(isCore || isPower) &&
        <Trans
          ns='account-pages'
          i18nKey='plan_billing_page.credit_purchase_plan_card.price.monthly'
          values={{price}}
          components={{
            1: <div className={classes.priceNumber} />,
            2: <div className={classes.priceInterval} />,
          }}
        />
      }
      {isTopUp &&
        <Trans
          ns='account-pages'
          i18nKey='plan_billing_page.credit_purchase_plan_card.price.topup'
          values={{
            price,
            originalPrice,
          }}
          components={{
            1: <div className={classes.priceNumber} />,
            2: <div className={combine(classes.priceNumber, classes.priceOriginal)} />,
            3: <div className={classes.priceInterval} />,
          }}
        />
      }
      {isEnterprise &&
        <Trans
          ns='account-pages'
          i18nKey='plan_billing_page.credit_purchase_plan_card.price.enterprise'
          components={{
            1: <div className={classes.priceNumber} />,
          }}
        />
      }
    </div>
  )
}

export {CreditDisplayPrice}
