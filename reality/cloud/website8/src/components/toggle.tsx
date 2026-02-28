import React from 'react'

import {combine} from '../styles/classname-utils'
import * as classes from './toggle.module.scss'

type ToggleBkgColors = 'white' | 'blueberry'
type BkgColors = 'white' | 'moonlight'

interface IToggle {
  id: string
  showToggledState: boolean
  onToggleClick: () => void
  toggledText: string | React.ReactNode
  untoggledText: string | React.ReactNode
  toggleBkgColor?: ToggleBkgColors
  bkgColor?: BkgColors
}

const Toggle: React.FC<IToggle> = ({
  id,
  showToggledState,
  onToggleClick,
  toggledText,
  untoggledText,
  toggleBkgColor = 'white',
  bkgColor = 'white',
}) => (
  <label
    className={combine(classes.toggleContainer, classes[bkgColor])}
    htmlFor={`toggle-${id}`}
  >
    <input
      type='checkbox'
      className={classes.toggleInput}
      onClick={onToggleClick}
      id={`toggle-${id}`}
      checked={!showToggledState}
    />
    <div className={combine(classes.toggleWrapper, classes[bkgColor])}>
      <div className={combine(classes.toggle, classes[toggleBkgColor])} />
    </div>
    <div className={classes.options}>{toggledText}</div>
    <div className={classes.options}>{untoggledText}</div>
  </label>
)

export default Toggle
