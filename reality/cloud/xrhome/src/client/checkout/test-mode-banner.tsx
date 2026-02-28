import React from 'react'
import {createUseStyles} from 'react-jss'

import {hexColorWithAlpha} from '../../shared/colors'
import {mango} from '../static/styles/settings'

const useStyles = createUseStyles({
  bannerContainer: {
    position: 'absolute',
    top: '0px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  banner: {
    fontSize: '1.16em',
    background: hexColorWithAlpha(mango, 0.33),
    textAlign: 'center',
    width: '100%',
    borderRadius: '2px',
    lineHeight: '1.67em',
    fontWeight: '600',
    maxWidth: 'calc(400px - 3em)',
    marginTop: '1.5em',
  },
})

const TestModeBanner: React.FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.bannerContainer}>
      <div className={classes.banner}>Test Mode</div>
    </div>
  )
}

export default TestModeBanner
