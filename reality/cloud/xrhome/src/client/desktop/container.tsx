import React from 'react'
import {createUseStyles} from 'react-jss'

import {combine} from '../common/styles'
import {WHITE_10, WHITE_5} from './colors'

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    boxSizing: 'border-box',
    background: WHITE_10,
    borderRadius: '0.5rem',
    border: '1px solid',
    borderColor: WHITE_5,
  },
  tiny: {
    padding: '0.25rem',
  },
  small: {
    padding: '0.5rem',
  },
  medium: {
    padding: '1rem',
  },
  large: {
    padding: '1.5rem',
  },
})

interface IContainer {
  padding?: 'tiny' | 'small' | 'medium' | 'large'
  children?: React.ReactNode
}

const Container: React.FC<IContainer> = ({padding = 'medium', children}) => {
  const classes = useStyles()

  return (
    <div className={combine(classes.container, classes[padding])}>
      {children}
    </div>
  )
}

export {
  Container,
}

export type {
  IContainer,
}
