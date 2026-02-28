import React from 'react'
import {Helmet} from 'react-helmet'
import {useI18next} from 'gatsby-plugin-react-i18next'

import siteMetadataLogo from '../../img/8thWallSocial.png'

const siteUrl = 'https://www.8thwall.com'
const getTitle = (title: string, usePrefix: boolean) => {
  if (!title) {
    return '8th Wall'
  }
  if (usePrefix) {
    return `8th Wall | ${title}`
  }
  return `${title} | 8th Wall`
}

const SiteMetadata = ({
  title = 'Augmented Reality',
  metaImage,
  description = '',
  pathname,
  usePrefix,
  fromNotFoundPage = false,
}) => {
  const {i18n} = useI18next()
  const pathNameNoSlash = (pathname.endsWith('/')) ? pathname.substring(0, pathname.length - 1) : pathname
  const url = `${siteUrl}${pathNameNoSlash}`
  const useTitle = getTitle(title, usePrefix)
  const metaImageUrl = (metaImage &&
    (metaImage.startsWith('https://cdn.8thwall.com') ? metaImage : siteUrl + metaImage)) ||
    'https://cdn.8thwall.com/web/share/8th_Wall_Metadata_SocialCover-mbn6660v.png'
  return (
    <Helmet defer={false} htmlAttributes={{lang: i18n.resolvedLanguage}}>
      <title>{useTitle}</title>
      <meta property='og:title' content={useTitle} />
      <meta name='twitter:title' content={useTitle} />
      {description && [
        (<meta name='description' content={description} key='description' />),
        (<meta property='og:description' content={description} key='og:description' />),
        (<meta name='twitter:description' content={description} key='twitter:description' />),
      ]}
      {fromNotFoundPage && <meta name='robots' content='noindex' />}
      <meta name='image' content={metaImageUrl} />
      <meta property='og:url' content={`${url}`} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='8th Wall' />
      <meta property='og:image' content={metaImageUrl} />
      <meta property='og:image:alt' content='8th Wall Cover Image' />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta name='twitter:image' content={metaImageUrl} />
      <meta name='twitter:card' content='summary_large_image' />
      <img src={metaImageUrl} alt='8th Wall Cover Image' style={{display: 'none'}} />
      <script type='application/ld+json'>
        {`{
          "@context": "https://schema.org",
          "@type": "ImageObject",
          "contentUrl": "${siteMetadataLogo}",
          "alternativeHeadline": "8th Wall Logo",
          "width": "1200",
          "height": "1200",
          "copyrightNotice": "8th Wall",
          "creditText": "8th Wall"
        }`}
      </script>
    </Helmet>
  )
}

export default SiteMetadata
