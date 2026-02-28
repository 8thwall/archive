import React from 'react'

import {Trans} from 'react-i18next'

import {Icon} from '../ui/components/icon'
import {createThemedStyles} from '../ui/theme'
import {combine} from '../common/styles'
import {hexColorWithAlpha} from '../../shared/colors'
import {mint, brandHighlight, brandWhite} from '../static/styles/settings'

const useStyles = createThemedStyles(theme => ({
  pricingCreditAmount: {
    'padding': '0.75em 1.25em',
    'display': 'flex',
    'gap': '0.25em',
    'borderRadius': '0.75em',
    'alignItems': 'center',
    'fontSize': '1.125em',
    'whiteSpace': 'nowrap',
    'color': 'var(--pricing-credit-amount-fg-color)',
    'background': 'var(--pricing-credit-amount-bg-color)',
    '& svg': {
      fill: 'var(--pricing-credit-amount-fg-color)',
    },
  },
  pricingNumber: {
    fontFamily: theme.subHeadingFontFamily,
  },
  gray: {
    '--pricing-credit-amount-fg-color': hexColorWithAlpha(brandWhite, 0.75),
    '--pricing-credit-amount-bg-color': hexColorWithAlpha(theme.bgMain, 0.3),
  },
  mint: {
    '--pricing-credit-amount-fg-color': '#A3FFE7',
    '--pricing-credit-amount-bg-color': hexColorWithAlpha(mint, 0.4),
  },
  purple: {
    '--pricing-credit-amount-fg-color': '#EAD2FF',
    '--pricing-credit-amount-bg-color': hexColorWithAlpha(brandHighlight, 0.4),
  },
}))

interface PricingCreditAmountProps {
  amount: number
  color: 'gray' | 'mint' | 'purple'
}

const PricingCreditAmount: React.FC<PricingCreditAmountProps> = ({amount, color}) => {
  const classes = useStyles()
  return (
    <div className={combine(classes.pricingCreditAmount, classes[color])}>
      <Icon stroke='creditsBold' color='white' />
      <Trans
        ns='pricing-page'
        i18nKey='credit_pricing_card.monthly_credits'
        values={{creditAmount: amount}}
        components={{1: <span className={classes.pricingNumber} />}}
      />
    </div>
  )
}

export {PricingCreditAmount}
