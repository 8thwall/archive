import * as React from 'react'

import '../static/styles/messages.scss'
import {combine} from '../common/styles'

export interface IMessageProps {
  children: React.ReactNode
  error?: boolean
  info?: boolean
  warning?: boolean
  className?: string
}

export const InlineMessage: React.FC<IMessageProps> = ({
  children, error, info, warning, className,
}) => (
  <div
    className={combine(
      'eight-w', className, error && 'error', info && 'info', warning && 'warning'
    )}
  >
    {children}
  </div>
)
