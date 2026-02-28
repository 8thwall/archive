import React from 'react'

import {createThemedStyles} from '../ui/theme'
import AutoHeading from '../widgets/auto-heading'
import {combine} from '../common/styles'
import {hexColorWithAlpha} from '../../shared/colors'
import {darkBlue, gray3} from '../static/styles/settings'
import AutoHeadingScope from '../widgets/auto-heading-scope'

const useStyles = createThemedStyles(theme => ({
  pricingPlanCard: {
    border: `1px solid ${theme.fgMuted}`,
    borderRadius: '1.5em',
    padding: '0.5em',
    background: 'var(--pricing-plan-card-border-bg)',
    flexGrow: '1',
  },
  pricingCardBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.75rem',
    width: '100%',
    minHeight: '100%',
    border: `1px solid ${theme.fgMuted}`,
    color: theme.fgMain,
    borderRadius: '1.125rem',
    padding: '2rem 3rem',
    backdropFilter: 'blur(7px)',
    background: 'radial-gradient(circle at top, var(--pricing-plan-card-bg),' +
      `${hexColorWithAlpha(darkBlue, 0.4)}), ${darkBlue}`,
  },
  purple: {
    '--pricing-plan-card-bg': hexColorWithAlpha(theme.fgPrimary, 0.4),
    '--pricing-plan-card-border-bg': hexColorWithAlpha(theme.fgPrimary, 0.5),
  },
  mint: {
    '--pricing-plan-card-bg': hexColorWithAlpha(theme.fgSuccess, 0.4),
    '--pricing-plan-card-border-bg': hexColorWithAlpha(theme.fgSuccess, 0.5),
  },
  gray: {
    '--pricing-plan-card-bg': hexColorWithAlpha(gray3, 0.4),
    '--pricing-plan-card-border-bg': hexColorWithAlpha(gray3, 0.5),
  },
}))

interface IPricingPlanCard {
  title?: React.ReactNode
  color?: 'purple' | 'mint' | 'gray'
  children?: React.ReactNode
}

const PricingPlanCard: React.FC<IPricingPlanCard> = ({
  title, color = 'purple', children,
}) => {
  const classes = useStyles()

  return (
    <div className={combine(classes.pricingPlanCard, classes[color])}>
      <AutoHeadingScope>
        <div className={combine(classes.pricingCardBody, classes[color])}>
          {title && <AutoHeading>{title}</AutoHeading>}
          {children}
        </div>
      </AutoHeadingScope>
    </div>
  )
}

export {PricingPlanCard, type IPricingPlanCard}
