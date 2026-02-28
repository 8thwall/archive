import React from 'react'
import {createUseStyles} from 'react-jss'

import {white} from '../../static/arcade/arcade-settings'
import {hexColorWithAlpha} from '../../../shared/colors'
import {combine} from '../../common/styles'

const useStyles = createUseStyles({
  roundedLinkButton: {
    'background': `${hexColorWithAlpha(white, 0.05)}`,
    'borderRadius': '1.25rem',
    'backgroundClip': 'padding-box',
    'boxSizing': 'border-box',
    'width': 'fit-content',
    'padding': '0.625rem 1.5rem',
    'fontSize': '0.875em',
    'lineHeight': '1.25rem',
    'textDecoration': 'none',
    'color': white,
    'boxShadow': `0px 1px 1px 0px ${hexColorWithAlpha(white, 0.3)} inset, ` +
      `0px 0px 0px 1px ${hexColorWithAlpha(white, 0.05)} inset`,

    '&:hover': {
      background: `${hexColorWithAlpha(white, 0.1)}`,
    },
  },
})

interface IRoundedLinkedButton {
  text: string
  href: string
  className?: string
  a8?: string
}

const RoundedLinkButton: React.FC<IRoundedLinkedButton> = ({text, href, className, a8}) => {
  const classes = useStyles()

  return (
    <a
      className={combine(classes.roundedLinkButton, className)}
      href={href}
      target='_blank'
      rel='noreferrer'
      a8={a8}
    >{text}
    </a>
  )
}

export {RoundedLinkButton}
