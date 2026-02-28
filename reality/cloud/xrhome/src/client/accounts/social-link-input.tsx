import React from 'react'
import {useTranslation} from 'react-i18next'

import {SocialLinkType} from './socials-name-parser'

import useStyles from './account-profile-page-jss'
import icons from '../apps/icons'

interface SocialLinkInputProps {
  type: SocialLinkType
  onChange: (value: string) => void
  value: string
}

interface SocialLinkInputAttributes {
  src: string
  alt: string
  inputName: string
  inputPlaceholderKey: string
}

const getSocialLinkIcon = (type: SocialLinkType): SocialLinkInputAttributes => {
  switch (type) {
    case SocialLinkType.Twitter:
      return {
        src: icons.Twitter,
        // eslint-disable-next-line local-rules/hardcoded-copy
        alt: 'twitter icon',
        // eslint-disable-next-line local-rules/hardcoded-copy
        inputName: 'twitter Handle',
        inputPlaceholderKey: 'profile_page.input.placeholder.twitter_url',
      }
    case SocialLinkType.LinkedIn:
      return {
        src: icons.Linkedin,
        // eslint-disable-next-line local-rules/hardcoded-copy
        alt: 'linkedin icon',
        // eslint-disable-next-line local-rules/hardcoded-copy
        inputName: 'linkedin Handle',
        inputPlaceholderKey: 'profile_page.input.placeholder.linkedin_url',
      }
    case SocialLinkType.Youtube:
      return {
        src: icons.Youtube,
        // eslint-disable-next-line local-rules/hardcoded-copy
        alt: 'youtube icon',
        // eslint-disable-next-line local-rules/hardcoded-copy
        inputName: 'youtube Handle',
        inputPlaceholderKey: 'profile_page.input.placeholder.youtube_url',
      }
    default:
      throw new Error(`Unknown social link type: ${type}`)
  }
}

const SocialLinkInput: React.FC<SocialLinkInputProps> = ({type, onChange, value}) => {
  const classes = useStyles()
  const {t} = useTranslation(['account-pages'])
  const {src, alt, inputName, inputPlaceholderKey} = getSocialLinkIcon(type)

  const urlPatterns: Record<SocialLinkType, string> = {
    linkedin: '^(?:https?:\\/\\/)?(www\\.)?linkedin\\.com\\/(in\\/|company\\/)([^\\/?#]+).*$',
    // eslint-disable-next-line max-len
    youtube: '^(?:https?:\\/\\/)?(?:www\\.)?youtube\\.com\\/(c\\/|channel\\/|user\\/|@)([a-zA-Z0-9_]{1,30})$',
    twitter: '^(?:https?:\\/\\/)?(?:www\\.)?twitter\\.com\\/([a-zA-Z0-9_]{1,15})',
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className={classes.socialLinkField}>
      <div className={classes.socialLinkImage}>
        <img src={src} alt={alt} />
      </div>
      <input
        className={classes.socialLinkInput}
        name={inputName}
        type='url'
        value={value}
        onChange={handleInputChange}
        placeholder={t(inputPlaceholderKey)}
        pattern={urlPatterns[type]}
        title={t('profile_page.input.title.social_media_platform', {type})}
      />
    </div>

  )
}

export {SocialLinkInput}
