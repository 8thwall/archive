import React, {forwardRef, ButtonHTMLAttributes} from 'react'

import {combine} from '../styles/classname-utils'
import * as classes from './button8.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean
  className?: string
}

const Button8 = forwardRef<HTMLButtonElement, Props>((
  {
    secondary = false,
    className = '',
    children,
    ...rest
  },
  ref
) => (
  <button
    className={combine(
      className,
      secondary ? classes.secondary : classes.primary
    )}
    type='button'
    ref={ref}
    {...rest}
  >
    {children}
  </button>
))

export default Button8
