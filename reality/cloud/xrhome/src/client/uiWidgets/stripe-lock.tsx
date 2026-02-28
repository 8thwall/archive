import React from 'react'
import {createUseStyles} from 'react-jss'

import stripeImg from '../static/stripe.svg'
import {Icon} from '../ui/components/icon'

const useStyles = createUseStyles({
  container: {
    display: 'flex',
  },
  stripe: {
    width: '120px',
  },
  lockIcon: {
    margin: 'auto 0.5em !important',
  },
})

const StripeLock = () => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <img src={stripeImg} className={classes.stripe} alt='Stripe' />
      <span className={classes.lockIcon}>
        <Icon inline stroke='lock' />
      </span>
    </div>
  )
}

export default StripeLock
