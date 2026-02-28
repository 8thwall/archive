import React from 'react'
import {createUseStyles} from 'react-jss'

import {
  brandOrange, orangeGradient, orangeGradientHighlight, white,
} from '../../static/arcade/arcade-settings'
import {hexColorWithAlpha} from '../../../shared/colors'
import {combine} from '../../common/styles'

const useStyles = createUseStyles({
  primaryButton: {
    'background': orangeGradient,
    'borderRadius': '30px',
    'backgroundClip': 'padding-box',
    'boxSizing': 'border-box',
    'width': 'fit-content',
    'padding': '0.625rem 1.5rem',
    'fontSize': '0.875em',
    'lineHeight': '1.25rem',
    'textDecoration': 'none',
    'color': white,
    'textAlign': 'center',
    'boxShadow': `0px 1px 1px 0px ${hexColorWithAlpha(white, 0.3)} inset, ` +
      `0px 0px 0px 1px ${hexColorWithAlpha(white, 0.05)} inset, ` +
        '1px 1.5px 4px 0px rgba(0, 0, 0, 0.08) inset, ' +
        '1px 1.5px 4px 0px rgba(0, 0, 0, 0.10) inset',

    '&:hover': {
      background: orangeGradientHighlight,
      boxShadow: `0px 1px 1px 0px ${hexColorWithAlpha(white, 0.3)} inset, ` +
        `0px 0px 0px 1px ${hexColorWithAlpha(white, 0.05)} inset, ` +
        '1px 1.5px 4px 0px rgba(0, 0, 0, 0.08) inset, ' +
        '1px 1.5px 4px 0px rgba(0, 0, 0, 0.10) inset, ' +
        `0px 0px 12px 5px ${hexColorWithAlpha(brandOrange, 0.1)}`,
    },
  },
})

interface IPrimaryButton {
  text: string
  href: string
  className?: string
  a8?: string
}

const PrimaryButton: React.FC<IPrimaryButton> = ({text, href, className, a8}) => {
  const classes = useStyles()

  return (
    <a
      className={combine(classes.primaryButton, className)}
      href={href}
      target='_blank'
      rel='noreferrer'
      a8={a8}
    >{text}
    </a>
  )
}

export {PrimaryButton}
