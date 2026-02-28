import React from 'react'
import {createUseStyles} from 'react-jss'

import icons from '../apps/icons'
import {gray3} from '../static/styles/settings'

const useStyles = createUseStyles({
  squarePosition: {
    display: 'block',
    margin: '3.8rem auto 6rem auto',
  },
  icon: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '8px',
  },
  message: {
    'display': 'block',
    'marginTop': '0.5rem',
    'fontWeight': '600',
    'fontSize': '14px',
    'textAlign': 'center',
    'color': gray3,
    '& > p': {
      marginBottom: 0,
    },
  },
})

const RecommendedContentError = () => {
  const classes = useStyles()
  return (
    <div className={classes.squarePosition}>
      <img
        className={classes.icon}
        src={icons.errorSquare}
        alt='Error loading apps'
        title='Error square'
      />
      <div className={classes.message}>
        <p>
          The information didn’t load 😞.
        </p>
        <p>
          Please try refreshing your page.
        </p>
      </div>
    </div>
  )
}

export {
  RecommendedContentError,
}
