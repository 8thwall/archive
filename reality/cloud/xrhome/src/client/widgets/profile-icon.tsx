import React from 'react'
import {useTranslation} from 'react-i18next'
import type {DeepReadonly} from 'ts-essentials'

import {MonogramProfilePicture} from './monogram-profile-picture'
import {createCustomUseStyles} from '../common/create-custom-use-styles'
import type {LoggedInUserState} from '../user-niantic/user-niantic-types'

const useStyles = createCustomUseStyles<{size: number}>()({
  profilePicture: {
    width: ({size}) => (size ? `${size}px` : '100%'),
    height: ({size}) => (size ? `${size}px` : '100%'),
    objectFit: 'cover',
  },
})

interface IProfileIcon {
  size?: number
  user?: DeepReadonly<LoggedInUserState>
  icon?: string
}

const ProfileIcon: React.FC<IProfileIcon> = ({size, user, icon}) => {
  const {t} = useTranslation('navigation')
  const classes = useStyles({size})
  const {givenName, familyName} = user

  return (
    <>
      {!!icon &&
        <img
          alt={t('profile_icon.alt')}
          className={classes.profilePicture}
          src={icon}
        />
      }
      {!icon &&
        <MonogramProfilePicture
          name={`${givenName} ${familyName}`}
          size={size}
        />
      }
    </>
  )
}

export {ProfileIcon}
