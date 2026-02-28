import React from 'react'
import {createUseStyles} from 'react-jss'
import {Trans, useTranslation} from 'react-i18next'

import {
  gray1, brandWhite, headerSanSerif, gray3, mint, brandBlack, brandHighlight,
  mobileViewOverride,
} from '../static/styles/settings'
import {Icon} from '../ui/components/icon'
import {combine} from '../common/styles'
import {CREDIT_GRANT_FEATURE} from '../../shared/feature-config'
import type {ICreditGrantOption} from '../../shared/feature-types'
import {formatToCurrency} from '../../shared/billing/currency-formatter'
import {hexColorWithAlpha} from '../../shared/colors'

const useStyles = createUseStyles({
  pricingCardWrapper: {
    border: `1px solid ${brandWhite}`,
    borderRadius: '1.5em',
    padding: '0.5em',
    boxShadow: '6px 6px 12.9px 0 rgba(70, 71, 102, 0.10)',
  },
  pricingCardWrapperFree: {
    background: hexColorWithAlpha(gray3, 0.5),
  },
  pricingCardWrapperCore: {
    background: hexColorWithAlpha(mint, 0.5),
  },
  pricingCardWrapperPower: {
    background: hexColorWithAlpha(brandHighlight, 0.5),
  },
  pricingCardContainer: {
    color: brandWhite,
    border: `1px solid ${brandWhite}`,
    borderRadius: '1.125em',
    padding: '2em 3em',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.75em',
    backdropFilter: 'blur(7px)',
    [mobileViewOverride]: {
      padding: '2em 1em',
    },
  },
  pricingCardContainerFree: {
    background: `radial-gradient(circle at top, ${hexColorWithAlpha(gray3, 0.4)},` +
    ` ${hexColorWithAlpha(brandBlack, 0.4)}), ${brandBlack}`,
  },
  pricingCardContainerCore: {
    background: `radial-gradient(circle at top, ${hexColorWithAlpha(mint, 0.4)},` +
    ` ${hexColorWithAlpha(brandBlack, 0.4)}), ${brandBlack}`,
  },
  pricingCardContainerPower: {
    background: `radial-gradient(circle at top, ${hexColorWithAlpha(brandHighlight, 0.4)},` +
    ` ${hexColorWithAlpha(brandBlack, 0.4)}), ${brandBlack}`,
  },
  pricingCardSubHeading: {
    fontWeight: 400,
    textAlign: 'center',
    fontFamily: headerSanSerif,
    fontSize: '1.125rem',
  },
  pricingCardHeader: {
    fontSize: '1.5em',
    textTransform: 'uppercase',
    fontWeight: 700,
  },
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
    fontFamily: headerSanSerif,
    fontSize: '2em',
    fontWeight: 700,
  },
  priceInterval: {
    fontSize: '1.125em',
    lineHeight: '1.125em',
  },
  creditAmountContainer: {
    'padding': '0.75em 1.25em',
    'display': 'flex',
    'gap': '0.25em',
    'borderRadius': '0.75em',
    'alignItems': 'center',
    'fontSize': '1.125em',
    '& span': {
      fontWeight: 600,
      fontSize: '1.25em',
    },
  },
  creditAmountFree: {
    'color': brandBlack,
    'background': gray1,
    '& svg': {
      fill: brandBlack,
    },
  },
  creditAmountCore: {
    'color': '#A3FFE7',
    'background': hexColorWithAlpha(mint, 0.4),
    '& svg': {
      fill: '#A3FFE7',
    },
  },
  creditAmountPower: {
    'color': '#EAD2FF',
    'background': hexColorWithAlpha(brandHighlight, 0.4),
    '& svg': {
      fill: '#EAD2FF',
    },
  },
  assetList: {
    fontSize: '1.25em',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75em',
    width: '100%',
  },
  assetRow: {
    color: gray3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assetQuantity: {
    fontWeight: 700,
  },
  creditRateContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    alignItems: 'center',
  },
  creditRateNumber: {
    color: gray3,
    fontStyle: 'italic',
  },
  discountBadge: {
    fontSize: '0.825em',
    backgroundColor: hexColorWithAlpha(mint, 0.1),
    color: mint,
    padding: '0 0.25em',
  },
})

interface ICreditPricingFeature {
  name: string
  customProperty?: string | number
}

interface ICreditPricingCard {
  planName: string
  topUpName: string
  modelCount: number
  imageCount: number
  discount?: number
}

const CreditPricingCard: React.FC<ICreditPricingCard> = ({
  planName, topUpName, modelCount, imageCount, discount,
}) => {
  const creditPlan: ICreditGrantOption = CREDIT_GRANT_FEATURE[planName]
  const topUpPlan: ICreditGrantOption = CREDIT_GRANT_FEATURE[topUpName]
  const classes = useStyles()
  const {t} = useTranslation(['pricing-page'])

  return (
    <div className={combine(classes.pricingCardWrapper,
      classes[`pricingCardWrapper${creditPlan.planName}`])}
    >
      <div className={combine(classes.pricingCardContainer,
        classes[`pricingCardContainer${creditPlan.planName}`])}
      >
        <div className={classes.pricingCardHeader}>{creditPlan.planName}</div>
        <div className={classes.priceContainer}>
          <span className={combine(classes.priceInterval, classes.priceSign)}>
            $
          </span>
          <Trans
            ns='pricing-page'
            i18nKey='credit_pricing_card.credit_price.monthly'
            values={{price: creditPlan.price}}
            components={{
              1: <div className={classes.priceNumber} />,
              2: <div className={classes.priceInterval} />,
            }}
          />
        </div>
        <div className={combine(classes.creditAmountContainer,
          classes[`creditAmount${creditPlan.planName}`])}
        >
          <Icon stroke='creditsBold' color='white' />
          <Trans
            ns='pricing-page'
            i18nKey='credit_pricing_card.monthly_credits'
            values={{creditAmount: creditPlan.creditAmount}}
            components={{1: <span />}}
          />
        </div>
        <div className={classes.assetList}>
          <div className={classes.pricingCardSubHeading}>
            {t('credit_pricing_card.subeading.estimated_monthly_assets')}
          </div>
          <div className={classes.assetRow}>
            <div>{t('credit_pricing_card.label.asset_model_count')}</div>
            <div className={classes.assetQuantity}>{modelCount}</div>
          </div>
          <div className={classes.assetRow}>
            <div>{t('credit_pricing_card.label.asset_image_count')}</div>
            <div className={classes.assetQuantity}>{imageCount}</div>
          </div>
        </div>
        <div className={classes.creditRateContainer}>
          <div className={classes.pricingCardSubHeading}>
            {t('credit_pricing_card.subeading.top_up_credit_rate')}
          </div>
          <div className={classes.creditRateNumber}>
            {t('credit_pricing_card.price_per_credit', {
              price: formatToCurrency(
                (topUpPlan.price / topUpPlan.creditAmount) * 100,
                {currency: 'usd', decimalPlaces: 2}
              ),
            })}
          </div>
          {discount &&
            <div className={classes.discountBadge}>
              {t('credit_pricing_card.discount', {percentage: discount})}
            </div>
        }
        </div>
      </div>
    </div>
  )
}

export {CreditPricingCard, type ICreditPricingFeature}
