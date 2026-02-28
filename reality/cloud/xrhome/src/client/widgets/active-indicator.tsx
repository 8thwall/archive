import React from 'react'
import {createUseStyles} from 'react-jss'

import {combine} from '../common/styles'
import {mint} from '../static/styles/settings'

const useStyles = createUseStyles({
  activeIndicator: {
    'height': '0.6em',
    'width': '0.6em',
    'background-color': mint,
    'border-radius': '50%',
    'display': 'inline-block',
  },
})

interface Props {
  className?: string
}

const ActiveIndicator: React.FC<Props> = ({className = ''}) => {
  const classes = useStyles()
  return (
    <span className={combine(classes.activeIndicator, className)} />
  )
}

export default ActiveIndicator
