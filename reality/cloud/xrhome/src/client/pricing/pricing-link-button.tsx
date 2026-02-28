import React from 'react'
import {Link} from 'react-router-dom'

import {createThemedStyles} from '../ui/theme'
import {
  ButtonSpacing, useRoundedButtonStyling, type ButtonHeight,
} from '../ui/hooks/use-rounded-button-styling'
import {combine} from '../common/styles'

const useStyles = createThemedStyles(theme => ({
  pricingLinkButton: {
    'cursor': 'pointer',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'textDecoration': 'none',
    'background': theme.primaryBtnBg,
    '&:not(:disabled)': {
      'boxShadow': theme.primaryBtnBoxShadow,
      '& > $primaryButtonContent': {
        'filter': theme.primaryBtnContentFilter,
      },
    },
    'color': theme.primaryBtnFg,
    '&:hover': {
      background: theme.primaryBtnHoverBg,
      color: theme.primaryBtnFg,
    },
    '&:disabled': {
      'cursor': 'default',
      'color': theme.primaryBtnDisabledFg,
      'background': theme.primaryBtnDisabledBg,
    },
  },
  primaryButtonContent: {},
}))

interface IPricingLinkButton {
  url: string
  height?: ButtonHeight
  spacing?: ButtonSpacing
  children?: React.ReactNode
  a8?: string
}

const PricingLinkButton: React.FC<IPricingLinkButton> = ({
  url, children, a8, height = 'medium', spacing = 'normal',
}) => {
  const classes = useStyles()
  const roundedStylingClass = useRoundedButtonStyling(height, spacing)
  return (
    <Link to={url} a8={a8} className={combine(classes.pricingLinkButton, roundedStylingClass)}>
      <span className={classes.primaryButtonContent} role='button'>{children}</span>
    </Link>
  )
}

export {PricingLinkButton}
