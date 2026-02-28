import React from 'react'
import {useTranslation} from 'react-i18next'

import {MonogramProfilePicture} from './monogram-profile-picture'
import {useCurrentUser} from '../user/use-current-user'
import {createCustomUseStyles} from '../common/create-custom-use-styles'

const useStyles = createCustomUseStyles<{size: number}>()({
  profilePicture: {
    width: ({size}) => (size ? `${size}px` : '100%'),
    height: ({size}) => (size ? `${size}px` : '100%'),
    objectFit: 'cover',
  },
})

interface ILoggedInProfileIcon {
  size?: number
}

const LoggedInProfileIcon: React.FC<ILoggedInProfileIcon> = ({size}) => {
  const {t} = useTranslation('navigation')
  const classes = useStyles({size})
  const {givenName, familyName, profileIcon} = useCurrentUser().loggedInUser

  return (
    <>
      {!!profileIcon &&
        <img
          alt={t('profile_icon.alt')}
          className={classes.profilePicture}
          src={profileIcon}
        />
      }
      {!profileIcon &&
        <MonogramProfilePicture
          name={`${givenName} ${familyName}`}
          size={size}
        />
      }
    </>
  )
}

export {LoggedInProfileIcon}
