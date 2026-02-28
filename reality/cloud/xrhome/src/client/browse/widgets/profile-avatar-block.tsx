import React from 'react'
import {Link} from 'react-router-dom'

import {getPublicPathForAccount} from '../../common/paths'
import ResponsiveImage from '../../common/responsive-image'
import type {IAccount, IPublicAccount} from '../../common/types/models'
import {CheckedCertificateIcon} from '../public-icons'
import {gray3, gray4} from '../../static/styles/settings'
import {combine} from '../../common/styles'
import {
  fixAccountUrl, is8thWallAccountUuid, isPartner, stripAccountUrl,
} from '../../../shared/account-utils'
import {createThemedStyles} from '../../ui/theme'
import {responsiveAccountIcons} from '../../../shared/responsive-account-icons'

const useStyles = createThemedStyles(theme => ({
  profileAvatarBlock: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  withAvatar: {
    paddingLeft: '3rem',
    minHeight: '2.5rem',
  },
  externalLink: {
    'color': gray4,
    '&:hover': {
      color: gray4,
      textDecoration: 'underline',
    },
  },
  internalLink: {
    color: theme.fgPrimary,
  },
  avatar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '2.5em',
    height: '2.5em',
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: `0 0 1px 1px ${gray3}`,
  },
}))

interface IProfileAvatarBlock {
  account: IAccount | IPublicAccount
  hideImage?: boolean
}

const ProfileAvatarBlock: React.FC<IProfileAvatarBlock> = ({account, hideImage = false}) => {
  const classes = useStyles()
  const fixedUrl = fixAccountUrl(account.url)
  const strippedUrl = stripAccountUrl(fixedUrl)
  const showCheckBadge = isPartner(account) || is8thWallAccountUuid(account.uuid)

  const sizeSet = responsiveAccountIcons(account)

  return (
    <div className={combine(
      classes.profileAvatarBlock,
      account.icon && !hideImage && classes.withAvatar
    )}
    >
      <Link className={classes.internalLink} to={getPublicPathForAccount(account)}>
        {
          !hideImage &&
            <ResponsiveImage
              width={24}
              alt=''
              className={classes.avatar}
              sizeSet={sizeSet}
            />
        }
        {account.name}
        {' '}
        {showCheckBadge && <CheckedCertificateIcon />}
      </Link>
      {fixedUrl &&
        <a
          href={fixedUrl}
          target='_blank'
          rel='noopener noreferrer'
          className={classes.externalLink}
        >{strippedUrl}
        </a>
      }
    </div>
  )
}

export default ProfileAvatarBlock
