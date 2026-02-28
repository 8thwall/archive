import * as React from 'react'
import {Helmet} from 'react-helmet-async'

import {PageHeader, PageHeaderVariant} from './page-header'
import PageFooter from './page-footer'
import Title from './title'
import {combine} from '../common/styles'
import {COMMON_PREFIX, COMMON_SUFFIX} from '../../shared/page-titles'
import type {PageHeaderThemes} from './page-header/page-header-theme-provider'
import {useThemedGlobalStyles} from '../ui/globals'
import {SunsetAnnouncement} from '../messages/sunset-announcement'

interface IPage {
  children: React.ReactNode
  hasFooter?: boolean
  hasHeader?: boolean
  headerVariant?: PageHeaderVariant
  headerTheme?: PageHeaderThemes
  customHeader?: React.ReactNode
  customFooter?: React.ReactNode
  centered?: boolean
  className?: string
  title?: string
  commonPrefixed?: boolean
  description?: string
  fromNotFoundPage?: boolean
  image?: string
  url?: string
  type?: string
}

const Page: React.FunctionComponent<IPage> = ({
  className = '',
  children,
  hasFooter = true,
  hasHeader = true,
  headerVariant,
  headerTheme = 'light',
  customHeader,
  customFooter,
  centered = true,
  title,
  commonPrefixed = false,
  description,
  image,
  url = typeof window !== 'undefined' ? window.location.href : null,
  type = 'website',
  fromNotFoundPage = false,
}) => {
  useThemedGlobalStyles()
  const mainClasses = combine(
    'page-content',
    hasFooter && 'main-before-footer',
    // eslint-disable-next-line local-rules/hardcoded-copy
    centered && 'section centered'
  )

  let useTitle = '8th Wall'
  if (title) {
    useTitle = commonPrefixed ? `${COMMON_PREFIX}${title}` : `${title}${COMMON_SUFFIX}`
  }

  const twitterTypes = (t: string) => {
    const typesMap = {
      'website': 'summary_large_image',
      'article': 'summary_large_image',
    }
    return typesMap[t] || 'summary_large_image'
  }

  return (
    <div className={`page ${className}`}>
      {BuildIf.SUNSET_ANNOUNCEMENT_20250917 && <SunsetAnnouncement />}
      {title && <Title commonPrefixed={commonPrefixed}>{title}</Title>}
      {/* Head tags */}
      <Helmet>
        {/* Helmet doesn't support fragments, so we use arrays here. */}
        {title && [
          <meta key='0' property='title' content={useTitle} />,
          <meta key='1' property='og:title' content={useTitle} />,
          <meta key='2' name='twitter:title' content={useTitle} />,
        ]}
        {description && [
          (<meta key='0' name='description' content={description} />),
          (<meta key='1' property='og:description' content={description} />),
          (<meta key='2' name='twitter:description' content={description} />),
        ]}
        {image && [
          <meta key='0' property='og:image' content={image} />,
          <meta key='1' property='twitter:image' content={image} />,
        ]}
        <meta property='og:type' content={type} />
        <meta property='twitter:card' content={twitterTypes(type)} />
        {url && [
          <meta key='0' property='twitter:url' content={url} />,
          <meta key='1' property='og:url' content={url} />,
        ]}
        {/* eslint-disable-next-line local-rules/hardcoded-copy */}
        {fromNotFoundPage && <meta name='robots' content='noindex' />}
      </Helmet>
      {/* End head tags */}
      {hasHeader && (customHeader || <PageHeader theme={headerTheme} variant={headerVariant} />)}
      <main className={mainClasses}>
        {children}
      </main>
      {hasFooter && (customFooter || <PageFooter />)}
    </div>
  )
}

export default Page
