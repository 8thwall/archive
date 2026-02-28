import React from 'react'

import '../static/styles/corner-ribbons.scss'
import {combine} from '../common/styles'

interface ICornerRibbonProps {
  children?: any
  location?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  color?: 'white' | 'black' | 'grey' | 'blue' | 'green' | 'turquoise' | 'purple' | 'red' |
    'orange' | 'yellow'
  size?: 'tiny' | 'small' | 'medium'
  className?: string
}

const CornerRibbon: React.FC<ICornerRibbonProps> = ({
  children, location, color, size, className,
}) => (
  <div className={combine(className, 'corner-ribbon sticky', location, color, size)}>
    {children}
  </div>
)

export {
  CornerRibbon,
}
