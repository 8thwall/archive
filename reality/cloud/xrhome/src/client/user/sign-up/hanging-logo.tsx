import React from 'react'
import {createUseStyles} from 'react-jss'

import NavLogo from '../../widgets/nav-logo'

const useStyles = createUseStyles({
  hangingLogo: {
    position: 'relative',
    margin: '0 0 2em 0',
    paddingLeft: 0,
  },
  hangingLogoContainer: {
    minHeight: '1.5rem',  // Reserve space above the content when the logo is fixed-positioned
  },
})

const HangingLogo = () => {
  const classes = useStyles()
  return (
    <div className={classes.hangingLogoContainer}>
      <NavLogo className={classes.hangingLogo} />
    </div>
  )
}

export default HangingLogo
