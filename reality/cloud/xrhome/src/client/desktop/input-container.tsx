import React from 'react'
import {createUseStyles} from 'react-jss'

import {WHITE_10, WHITE_15, WHITE_20, WHITE_5} from './colors'
import {blueberry} from '../static/styles/settings'
import {combine} from '../common/styles'

const useStyles = createUseStyles({
  inputContainer: {
    'position': 'relative',
    'boxSizing': 'border-box',
    'background': WHITE_10,
    'borderRadius': '0.5rem',
    'boxShadow': `inset 0 0 0 1px ${WHITE_5}`,
    'backdropFilter': 'blur(5px)',
    '&:hover': {
      background: WHITE_20,
      boxShadow: `inset 0 0 0 1px ${WHITE_15}`,
    },
    '&:focus-within': {
      boxShadow: `inset 0 0 0 1px ${blueberry}`,
    },
  },
  grow: {
    display: 'flex',
    flexGrow: 1,
  },
})

interface IInputContainer {
  children?: React.ReactNode
  grow?: boolean
}

const InputContainer: React.FC<IInputContainer> = ({children, grow = false}) => {
  const classes = useStyles()

  return (
    <div className={combine(classes.inputContainer, grow && classes.grow)}>
      {children}
    </div>
  )
}

export {
  InputContainer,
}
