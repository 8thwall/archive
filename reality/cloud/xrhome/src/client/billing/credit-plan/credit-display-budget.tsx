import React from 'react'
import {Trans} from 'react-i18next'

import {Icon} from '../../ui/components/icon'
import {combine} from '../../common/styles'
import {CREDIT_GRANT_FEATURE} from '../../../shared/feature-config'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  creditBudget: {
    padding: '0.75em 1.25em',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '1.5em',
    gap: '0.25em',
    fontSize: '1.125em',
    width: 'fit-content',
  },
  creditBudgetCore: {
    'backgroundColor': theme.badgeMintPastelBgColor,
    'color': theme.badgeMintPastelFgColor,
    '& svg': {
      fill: theme.badgeMintPastelFgColor,
    },
  },
  creditBudgetPower: {
    'backgroundColor': theme.badgePurplePastelBgColor,
    'color': theme.badgePurplePastelFgColor,
    '& svg': {
      fill: theme.badgePurplePastelFgColor,
    },
  },
  creditBudgetEnterprise: {
    'backgroundColor': theme.badgeGrayPastelBgColor,
    'color': theme.badgeGrayPastelFgColor,
    '& svg': {
      fill: theme.badgeGrayPastelFgColor,
    },
  },
  creditBudgetTopUp: {
    'backgroundColor': theme.badgeBluePastelBgColor,
    'color': theme.badgeBluePastelFgColor,
    '& svg': {
      fill: theme.badgeBluePastelFgColor,
    },
  },
  creditBudgetNumber: {
    fontSize: '1.125em',
    fontWeight: 700,
  },
}))

interface ICreditDisplayBudget {
  optionName: string
  creditAmount?: number
}

const CreditDisplayBudget: React.FC<ICreditDisplayBudget> = ({
  optionName, creditAmount = 500,
}) => {
  const classes = useStyles()

  const isEnterprise = optionName === CREDIT_GRANT_FEATURE.Enterprise.name
  const isPower = optionName === CREDIT_GRANT_FEATURE.PowerSub.name
  const isCore = optionName === CREDIT_GRANT_FEATURE.CoreSub.name
  const {isTopUp} = CREDIT_GRANT_FEATURE[optionName]

  return (
    <div className={combine(classes.creditBudget, isCore && classes.creditBudgetCore,
      isPower && classes.creditBudgetPower, isEnterprise && classes.creditBudgetEnterprise,
      isTopUp && classes.creditBudgetTopUp)}
    >
      {isTopUp && <Icon stroke='plus' />}
      <Icon stroke='creditsBold' size={1.125} />
      {(isCore || isPower) &&
        <Trans
          ns='account-pages'
          i18nKey='plan_billing_page.credit_purchase_plan_card.credit_budget.monthly'
          values={{creditAmount}}
          components={{
            1: <div className={classes.creditBudgetNumber} />,
          }}
        />
      }
      {isTopUp &&
        <Trans
          ns='account-pages'
          i18nKey='plan_billing_page.credit_purchase_plan_card.credit_budget.topup'
          values={{creditAmount}}
          components={{
            1: <div className={classes.creditBudgetNumber} />,
          }}
        />
      }
      {isEnterprise &&
        <Trans
          ns='account-pages'
          i18nKey='plan_billing_page.credit_purchase_plan_card.credit_budget.custom'
          components={{
            1: <div className={classes.creditBudgetNumber} />,
          }}
        />
      }
    </div>
  )
}

export {CreditDisplayBudget}
