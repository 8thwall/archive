import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {Helmet} from 'react-helmet-async'

import {combine} from '../../common/styles'
import {
  brandBlack, white, brandGray3, brandBlue,
} from '../../static/arcade/arcade-settings'
import PageFooter from './page-footer'
import PageHeader from './page-header'
import {SHOULD_SKIP_ARK, useArkLoaded} from '../../hooks/use-ark-loaded'
import {hexColorWithAlpha} from '../../../shared/colors'
import {Loader} from '../../ui/components/loader'
import {UiThemeProvider} from '../../ui/theme'

const useStyles = createUseStyles({
  'page': {
    minHeight: '100vh',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  'main': {
    flex: 1,
  },
  'cookieBar': {
    'font-family': 'inherit',
    'borderTop': `1px solid ${brandGray3}`,
    'color': white,
    'backdropFilter': 'blur(7.5px)',
    'background': `linear-gradient(273deg, ${hexColorWithAlpha(brandBlack, 0.35)} -19.77%, ` +
    `${hexColorWithAlpha(brandBlue, 0.17)} 84.29%, ` +
    `${hexColorWithAlpha(brandBlack, 0.35)} 99.15%), ${brandBlack}`,
    'boxShadow': `0px -3px 15px 5px ${hexColorWithAlpha(brandBlack, 0.65)}`,
    '& .ark-cookiebar-buttons': {
      justifyContent: 'center',
    },
    '& .ark-cookiebar-content': {
      maxWidth: '60em',
    },
    '& a': {
      color: white,
    },
    '& button': {
      'minWidth': '10rem',
      'background': hexColorWithAlpha(white, 0.05),
      'color': white,
      'borderRadius': '30px',
      'background-clip': 'padding-box',
      'boxSizing': 'border-box',
      'padding': '0.625rem 1.5rem',
      'fontSize': '0.875em',
      'lineHeight': '1.25rem',
      'textDecoration': 'none',
      'boxShadow': `0px 1px 1px 0px ${hexColorWithAlpha(white, 0.3)} inset, ` +
        `0px 0px 0px 1px ${hexColorWithAlpha(white, 0.05)} inset`,
      'border': 'none',
      '&:hover': {
        background: hexColorWithAlpha(white, 0.1),
      },
    },
  },
})

interface IPage {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  fromNotFoundPage?: boolean
  isHeaderFloating?: boolean
  isHeaderVisible?: boolean
  isFooterVisible?: boolean
}

const Page: React.FunctionComponent<IPage> = ({
  className = '',
  children,
  title,
  description,
  image,
  url,
  type = 'website',
  fromNotFoundPage = false,
  isHeaderFloating = false,
  isHeaderVisible = true,
  isFooterVisible = true,
}) => {
  const classes = useStyles()
  const arkLoaded = useArkLoaded()

  if (!arkLoaded && !SHOULD_SKIP_ARK) {
    return (
      <div className={classes.page}>
        <UiThemeProvider mode='dark'>
          <Loader />
        </UiThemeProvider>
      </div>
    )
  }

  return (
    <div className={combine(classes.page, className)}>
      {/* Head tags */}
      <Helmet>
        {/* Helmet doesn't support fragments, so we use arrays here. */}
        {title && [
          <meta key='0' property='title' content={title} />,
          <meta key='1' property='og:title' content={title} />,
          <meta key='2' name='twitter:title' content={title} />,
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
        <meta property='twitter:card' content='summary_large_image' />
        {url && [
          <meta key='0' property='twitter:url' content={url} />,
          <meta key='1' property='og:url' content={url} />,
        ]}
        {fromNotFoundPage && <meta name='robots' content='noindex' />}
      </Helmet>
      {/* End head tags */}
      {isHeaderVisible && <PageHeader isFloating={isHeaderFloating} />}
      <div className={classes.main}>
        {children}
      </div>
      {isFooterVisible && <PageFooter />}
      {/* @ts-ignore */}
      {!SHOULD_SKIP_ARK && <ark-cookiebar id='ark-cookiebar' class={classes.cookieBar} />}
    </div>
  )
}

export default Page
