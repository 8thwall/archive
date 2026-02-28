/* eslint-disable quote-props */
import React from 'react'
import {createUseStyles} from 'react-jss'

import * as settings from '../static/styles/settings'
import {bool, combine} from '../common/styles'

const useStyles = createUseStyles({
  likeLink: {
    display: 'inline',
    border: 'none',
    padding: 0,
    background: 'none',
    color: settings.brandPurple,
    'fontFamily': 'inherit',
    '&:hover': {
      cursor: 'pointer',
      color: settings.linkBlue,
    },

    '&.black': {
      color: settings.gray5,
      '&:hover': {
        color: settings.gray4,
      },
      '&.disabled': {
        opacity: 0.33,
        '&:hover': {
          cursor: 'default',
          color: settings.gray5,
        },
      },
    },
    '&.disabled': {
      opacity: 0.33,
      '&:hover': {
        cursor: 'default',
        color: settings.brandPurple,
      },
    },
    '&.underline': {
      textDecoration: 'underline',
    },
  },
})

interface IButtonLink {
  color?: '' | 'black'
  className?: string
  children?: React.ReactNode
  disabled?: boolean
  underline?: boolean
  onClick?(event: React.MouseEvent): void
  [rest: string]: unknown
}

const ButtonLink: React.FunctionComponent<IButtonLink> = ({
  color = '',
  className,
  children,
  disabled = false,
  underline = false,
  onClick,
  ...rest
}) => {
  const classes = useStyles()
  return (
    <button
      type='button'
      className={combine(
        classes.likeLink,
        className,
        color,
        bool(disabled, 'disabled'),
        bool(underline, 'underline')
      )}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

export default ButtonLink
