import React from 'react'

import {combine} from '../styles/classname-utils'

import * as styles from './tooltip.module.scss'

const Tooltip = ({className = '', text = '', children, ...rest}) => (
  <div className={combine(styles.toolTip, className)} {...rest}>
    {children}
    <div className={styles.toolTipText}>{text}</div>
  </div>
)

export default Tooltip
