import React, {FC, useEffect, useState} from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {fixAccountUrl, stripAccountUrl} from '../../shared/account-utils'
import {addressWithPlaceId, ADDRESS_TYPES} from '../common/google-maps'
import {combine} from '../common/styles'
import type {IAccount} from '../common/types/models'
import {gray2, gray3, gray4} from '../static/styles/settings'
import {LoadingImage} from '../uiWidgets/loading-image'
import useAccountProfileStyles from './account-profile-page-jss'
import LinkOut from '../uiWidgets/link-out'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import {SocialLinkOut} from './social-link-out'
import {SocialLinkType} from './socials-name-parser'
import {Loader} from '../ui/components/loader'
import {Icon} from '../ui/components/icon'

const useStyles = createUseStyles({
  logo: {
    margin: '0 auto',
  },
  spaceBelow: {
    marginBottom: '0.5em',
  },
  centerText: {
    textAlign: 'center',
  },
  linkOrLocation: {
    color: gray4,
  },
  noInfo: {
    color: gray3,
  },
  bioUnavailable: {
    extend: ['noInfo', 'centerText'],
    marginTop: '3em',
    marginBottom: '8em !important',
  },
  bio: {
    'display': 'flex',
    'justifyContent': 'center',
    'marginBottom': '1.5em',
    '& > p': {
      maxWidth: '64ch',
    },
  },
  linkOuts: {
    '& a:not(:last-child)': {
      marginRight: '0.5em',
    },
    '& i': {
      'color': gray4,
      '&:hover': {
        color: gray2,
      },
    },
  },
})

interface Props {
  account: IAccount
}

const AccountProfileNonAdminContent: FC<Props> = ({account}) => {
  const accountProfileClasses = useAccountProfileStyles()
  const classes = useStyles()
  const {t} = useTranslation(['account-pages'])
  const [isAddressLoading, setIsAddressLoading] = useState(false)
  const [address, setAddress] = useState('')

  const accountContactUrl = fixAccountUrl(account.contactUrl)

  useEffect(() => {
    setAddress('')
  }, [account.uuid])

  useAbandonableEffect(async (executor) => {
    setIsAddressLoading(true)
    const addr = await executor(addressWithPlaceId(account.googleMapsPlaceId, ADDRESS_TYPES))
    setAddress(addr)
    setIsAddressLoading(false)
  }, [account.googleMapsPlaceId, address])

  return (
    <>
      <div className={combine(accountProfileClasses.logo, classes.logo)}>
        {account.icon && <LoadingImage src={account.icon[200]} alt={`${account.name} logo`} />}
      </div>
      <h4 className={
        combine(accountProfileClasses.sectionTitle, classes.spaceBelow, classes.centerText)
      }
      >
        {account.name}
      </h4>
      <p
        className={combine(
          classes.centerText,
          classes.spaceBelow,
          account.url ? classes.linkOrLocation : classes.noInfo
        )}
      >
        <Icon stroke='link' />
        {account.url
          ? <LinkOut url={account.url}>{stripAccountUrl(account.url)}</LinkOut>
          : t('profile_page.input.label.website_url')
        }
      </p>
      <p
        className={combine(
          classes.centerText,
          account.googleMapsPlaceId ? classes.linkOrLocation : classes.noInfo
        )}
      >
        {isAddressLoading
          ? <Loader inline size='tiny' />
          : (
            <>
              <Icon inline stroke='location' />
              {address || t('profile_page.input.label.primary_location')}
            </>
          )
        }
      </p>
      <div className={account.bio ? classes.bio : classes.bioUnavailable}>
        <p>
          {account.bio || t('profile_page.not_activated')}
        </p>
      </div>
      <p className={combine(classes.centerText, classes.linkOuts)}>
        {accountContactUrl &&
          <LinkOut url={accountContactUrl}>
            <Icon inline stroke='email' size={1.5} color='gray4' />
          </LinkOut>
        }
        {account.twitterHandle &&
          <SocialLinkOut type={SocialLinkType.Twitter} handle={account.twitterHandle} />
        }
        {account.linkedInHandle &&
          <SocialLinkOut type={SocialLinkType.LinkedIn} handle={account.linkedInHandle} />
        }
        {account.youtubeHandle &&
          <SocialLinkOut type={SocialLinkType.Youtube} handle={account.youtubeHandle} />
        }
      </p>
    </>
  )
}

export default AccountProfileNonAdminContent
