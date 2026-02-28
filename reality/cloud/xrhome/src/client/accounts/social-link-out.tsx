import React from 'react'
import {Icon} from 'semantic-ui-react'

import LinkOut from '../uiWidgets/link-out'
import {
  constructPlatformUrl,
  SocialLinkType,
} from './socials-name-parser'

interface ISocialLinkOut {
  type: SocialLinkType
  handle: string
  className?: string
  a8?: string
}

const SocialLinkOut: React.FC<ISocialLinkOut> = ({
  type,
  handle,
  className = null,
  a8 = null,
}) => {
  const url = constructPlatformUrl(handle, type)
  return (
    <LinkOut url={url} className={className} a8={a8}>
      <Icon size='large' name={type} />
    </LinkOut>
  )
}

export {
  SocialLinkOut,
}
