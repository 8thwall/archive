import React from 'react'
import {createUseStyles} from 'react-jss'

import MonogramProfilePicture from './monogram-profile-picture'
import {UserAttributes} from '../common/user-config'

interface IProfileIcon {
  user: UserAttributes
  size: number
}

const useStyles = createUseStyles({
  profilePhoto: {
    objectFit: 'cover',
  },
})

const ProfileIcon: React.FC<IProfileIcon> = ({user, size}) => {
  const classes = useStyles()

  return (
    user.profilePhotoUrl
      ? (
        <img
          alt='User avatar'
          className={classes.profilePhoto}
          src={user.profilePhotoUrl}
          height={size}
          width={size}
        />
      ) : (
        <MonogramProfilePicture
          name={`${user.givenName} ${user.familyName}`}
          size={size}
        />
      )
  )
}

export default ProfileIcon
