import React from 'react'
import {createUseStyles} from 'react-jss'

import dither from '../static/brandrefresh/dither.svg'
import gradients from '../static/brandrefresh/gradients.png'

const useStyles = createUseStyles({
  dither: {
    position: 'fixed',
    zIndex: -1,
    mixBlendMode: 'soft-light',
    left: '50%',
    top: '0',
    transform: 'translateX(-50%)',
    maskImage: 'linear-gradient(180deg, black 80%, transparent)',
  },
  gradients: {
    position: 'fixed',
    zIndex: -2,
    left: '50%',
    top: '0',
    transform: 'translateX(-50%)',
  },
})

const WelcomeBackground: React.FunctionComponent = () => {
  const classes = useStyles()

  return (
    <>
      <img
        alt=''
        src={dither}
        className={classes.dither}
        draggable='false'
      />
      <img
        alt=''
        src={gradients}
        className={classes.gradients}
        draggable='false'
      />
    </>
  )
}

export {WelcomeBackground}
