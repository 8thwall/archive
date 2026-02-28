import React, {FC} from 'react'

import {cherry} from '../../static/styles/settings'
import exclamation from './exclamation-icon'
import {combine} from '../../common/styles'
import {createCustomUseStyles} from '../../common/create-custom-use-styles'

type ThemeProps = {
  color: string
  noBackground?: boolean
  rotate?: boolean
}

const useStyles = createCustomUseStyles<ThemeProps>()({
  error: {
    'width': 'fit-content',
    'margin': '0.25em 0',
    'padding': '1em',
    'color': ({color}) => color,
    'display': 'flex',
    'alignItems': 'center',
    // This only work for 6 chars hex colors. If we need more colors we will have to use a package
    // that can handle different types of colors
    'backgroundColor': ({color, noBackground}) => (noBackground ? 'none' : `${color}05`),
    'border': ({color, noBackground}) => (noBackground ? 'none' : `1px solid ${color}`),
  },
  icon: ({color, rotate}) => ({
    'width': '1em',
    'height': '1em',
    'marginRight': '.5em',
    '& svg': {fill: color},
    'transform': rotate ? 'rotate(180deg)' : ' none',
  }),
})

const iconMap = {
  'exclamation': exclamation,
  'info': exclamation,
}

type iconType = keyof typeof iconMap;

interface errorProps {
  icon?: iconType
  inline?: boolean
  color?: string
  noBackground?: boolean
  className?: any
  children?: React.ReactNode
}

interface IconProps {
  icon?: iconType
  color?: string
}

const Icon: FC<IconProps> = ({icon = null, color = cherry}) => {
  const classes = useStyles({color, rotate: icon === 'exclamation'})

  if (icon) {
    return (
      <div className={classes.icon}>
        {React.createElement(iconMap[icon])}
      </div>
    )
  }
  return null
}

const ErrorMessage: FC<errorProps> = ({
  icon = null,
  inline = false,
  color = cherry,
  noBackground = false,
  className = null,
  children,
}) => {
  const classes = useStyles({color, noBackground})
  const Tag = inline ? 'span' : 'div'

  return (
    <Tag className={combine(classes.error, className)}>
      <Icon icon={icon} />
      <Tag>{children}</Tag>
    </Tag>
  )
}

export default ErrorMessage
