import React from 'react'

import * as styles from './premier-label.module.scss'
import {combine} from '../styles/classname-utils'

interface IPremierLabel {
  top?: boolean,
  bottom?: boolean,
  right?: boolean,
  left?: boolean,
}

const PremierLabel: React.FunctionComponent<IPremierLabel> = ({
  top, bottom, right, left,
}) => (
  <div
    className={combine(
      styles.premierLabel,
      top && styles.top,
      bottom && styles.bottom,
      right && styles.right,
      left && styles.left
    )}
  >
    <p>PREMIER</p>
  </div>
)

export default PremierLabel
