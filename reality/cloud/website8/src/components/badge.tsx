import * as React from 'react'

import * as classes from './badge.module.scss'
import {combine} from '../styles/classname-utils'

type BadgeColors = 'primary' | 'mango' | 'mint'
interface IBadge {
  color?: BadgeColors
  className?: string
  height?: 'small' | 'tiny'
  title?: string
  children?: React.ReactNode
}

const Badge: React.FC<IBadge> = (
  {children, color = 'primary', className = '', height = 'tiny', title = ''}
) => (
  <span
    className={combine(classes.badge, classes[color], classes[height], className)}
    title={title}
  >{children}
  </span>
)

export default Badge
