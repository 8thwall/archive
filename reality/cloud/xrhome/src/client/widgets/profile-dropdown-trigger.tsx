import React from 'react'
import {createUseStyles} from 'react-jss'

import {useSelector} from '../hooks'
import {LoggedInProfileIcon} from './logged-in-profile-icon'
import {mobileViewOverride} from '../static/styles/settings'

const useStyles = createUseStyles({
  profileContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    [mobileViewOverride]: {
      margin: 0,
    },
  },
  profileIcon: {
    height: '2.25em',
    width: '2.25em',
    overflow: 'hidden',
    borderRadius: '50%',
    marginRight: '0.5em',
    [mobileViewOverride]: {
      margin: 0,
    },
  },
  profileName: {
    [mobileViewOverride]: {
      display: 'none',
    },
  },
})

interface ITrigger {
  givenName: string
  familyName: string
}

const ProfileDropdownTrigger: React.FC<ITrigger> = ({givenName, familyName}) => {
  const isSmallScreen = useSelector(state => state.common.isSmallScreen)
  const classes = useStyles()

  return (
    <span className={classes.profileContainer}>
      <div className={classes.profileIcon}>
        <LoggedInProfileIcon size={36} />
      </div>
      {!isSmallScreen && <div className={classes.profileName}>{givenName} {familyName}</div>}
    </span>
  )
}

export default ProfileDropdownTrigger
