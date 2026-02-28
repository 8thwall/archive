import React from 'react'
import {useTranslation} from 'react-i18next'

import {MonogramProfilePicture} from '../widgets/monogram-profile-picture'
import {createCustomUseStyles} from '../common/create-custom-use-styles'

const useStyles = createCustomUseStyles<{size: number}>()({
  profilePicture: {
    width: ({size}) => (size ? `${size}px` : '100%'),
    height: ({size}) => (size ? `${size}px` : '100%'),
    objectFit: 'cover',
  },
})

interface ITeamMemberProfileIcon {
  fullName: string
  profilePhotoUrl: string
  size?: number
}

const TeamMemberProfileIcon: React.FC<ITeamMemberProfileIcon> = ({
  fullName, profilePhotoUrl, size,
}) => {
  const {t} = useTranslation('navigation')
  const classes = useStyles({size})
  const photoURL = profilePhotoUrl && new URL(profilePhotoUrl)
  // eslint-disable-next-line local-rules/hardcoded-copy
  const expirationTime = new Date(parseInt(photoURL?.searchParams.get('Expires'), 10) * 1000)
  const currentTime = new Date()
  const isExpired = currentTime.getTime() > expirationTime.getTime()
  const showProfilePhoto = !!profilePhotoUrl && !isExpired

  return (
    <>
      {showProfilePhoto &&
        <img
          alt={t('profile_icon.alt')}
          className={classes.profilePicture}
          src={profilePhotoUrl}
        />
      }
      {!showProfilePhoto &&
        <MonogramProfilePicture
          name={fullName}
          size={size}
        />
      }
    </>
  )
}

export {TeamMemberProfileIcon}
