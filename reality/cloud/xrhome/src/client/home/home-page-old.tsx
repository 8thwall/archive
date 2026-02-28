import React from 'react'
import {createUseStyles} from 'react-jss'
import {Redirect} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {TOP_FEATURED_CATEGORIES} from './home-constants'
import {SignUpPathEnum} from '../common/paths'
import {HomePageHero} from './home-page-hero-old'
import {useSelector} from '../hooks'
import {
  brandPurple, brandHighlight, brandWhite, gray4, headerSanSerif,
  mobileViewOverride, smallMonitorViewOverride, tinyViewOverride, moonlight, brandBlack,
} from '../static/styles/settings'
import Page from '../widgets/page'
import {SEARCH_INDEX_NAME, ServeDocumentsRequestBody} from '../../shared/home-types'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import homeActions from './home-actions'
import useActions from '../common/use-actions'
import {Footer} from '../widgets/web8-footer'
import {SocialProofSection} from './social-proof-section'
import type {IAccount} from '../common/types/models'
import {HomeServiceSection} from './home-service-section'
import {HomeDiscoverySection} from './home-discovery-section'

const CATEGORY_PROJECT_AMOUNT = 10

const useStyles = createUseStyles({
  page: {
    'background': brandWhite,
    '& .main-before-footer': {
      marginBottom: '0',
    },
  },
  pageOld: {
    '& .main-before-footer': {
      marginBottom: '0',
    },
  },
  categorySection: {
    margin: '3.5em 0',
    minHeight: '480px',
  },
  heroGraphic: {
    background: `linear-gradient(180.64deg, #000000 -5.04%, #7611B6 12.84%, #9F58CC 25.11%,
      #B883D9 31.36%, #C9A0E2 34.79%, #D9BEEB 39.71%, #E6D3F2 44.25%, #EDE0F5 48%,
      #F5EEFA 52.44%, #FBF9FD 59.03%, ${moonlight} 65.18%)`,
    position: 'absolute',
    top: '-20px',
    height: '800px',
    width: '100%',
    zIndex: '-10',
    [mobileViewOverride]: {
      height: '900px',
    },
  },
  graphicContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    opacity: '65%',
    overflow: 'hidden',
    mixBlendMode: 'lighten',
  },
  graphicLeft: {
    position: 'absolute',
    top: '20px',
    right: '55%',
    [mobileViewOverride]: {
      right: '30%',
    },
    [tinyViewOverride]: {
      left: '-30%',
    },
  },
  graphicRight: {
    position: 'absolute',
    top: '20px',
    left: '65%',
    transform: 'scale(1.2)',
    [mobileViewOverride]: {
      display: 'none',
    },
  },
  heroFade: {
    background: `linear-gradient(${brandBlack} 10%, ${brandPurple}, transparent)`,
  },
  categoryContainer: {
    'maxWidth': 'calc(3000px + 4*2.4rem)',
    'margin': '0 auto',
    '& > h2': {
      fontSize: '1.25em',
      fontWeight: 900,
      marginBottom: '0.2em',
    },
    '& > p': {
      fontWeight: 500,
      marginBottom: '1.25em',
    },
  },
  nullContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '4em 0',
  },
  nullText: {
    'alignSelf': 'center',
    'textAlign': 'center',
    'maxWidth': '500px',
    '& > h2': {
      fontFamily: `${headerSanSerif} !important`,
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '1.5em',
      color: gray4,
      marginBottom: '8px',
      [tinyViewOverride]: {
        fontSize: '16px',
      },
    },
  },
  blankProfilePage: {
    'width': '300px',
    'marginBottom': '1.5em',
    'textAlign': 'center',
    'alignSelf': 'center',
    '& p': {
      color: gray4,
    },
    [tinyViewOverride]: {
      'width': '200px',
    },
  },
  homePageCardGrid: {
    'display': 'grid',
    'gridTemplateColumns': 'repeat(5, 1fr)',
    'rowGap': '3.5em',
    'columnGap': '2.4em',
    'justifyContent': 'center',
    'padding': '0 4.5em',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    [smallMonitorViewOverride]: {
      gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))',
      justifyContent: 'inherit',
      overflowX: 'scroll',
      rowGap: '3em',
      margin: '0 auto',
      padding: '0 2em',
    },
    [tinyViewOverride]: {
      justifyContent: 'inherit',
      overflowX: 'scroll',
      rowGap: '2.7em',
    },
  },
  descriptionContainer: {
    margin: '0 4.5em 1.25em',
    [mobileViewOverride]: {
      margin: '0 2em 1.25em',
    },
  },
  categoryHeader: {
    fontFamily: headerSanSerif,
    fontSize: '1.5em',
    fontWeight: 700,
    marginBottom: '0.5em',
  },
  categoryDesc: {
    fontSize: '1.15em',
  },
  discoverySection: {
    margin: '3.5em 4.5em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoveryLink: {
    'backgroundColor': brandPurple,
    'color': `${brandWhite} !important`,
    'fontSize': '1.125em',
    'LightHeight': '1.625em',
    'fontWeight': 'bold',
    'width': '200px',
    'height': '56px',
    'borderRadius': '28px',
    'margin': '1.5em 0',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    '&:hover': {
      backgroundColor: brandHighlight,
    },
  },
})

const HomePageOld = () => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])
  // Note(Brandon): redux state for accounts is readonly and utility functions don't account for
  // that. This is a quick patch for a larger issue.
  const accounts = useSelector(state => state.accounts.allAccounts) as unknown as IAccount[]
  const preload = useSelector(state => state.home?.preload)
  const {setPreload, fetchApps, clearApps} = useActions(homeActions)

  useAbandonableEffect(async (executor) => {
    if (preload) {
      setPreload(false)
      return
    }
    clearApps()

    const fetchAppPromises = TOP_FEATURED_CATEGORIES.map(category => fetchApps(category.keyword, {
      indexName: SEARCH_INDEX_NAME.Apps,
      keywords: [category.keyword],
      // NOTE(wayne): # of projects might be inconsistent, so we need a number > 10
      size: 2 * CATEGORY_PROJECT_AMOUNT,
      from: 0,
    } as ServeDocumentsRequestBody))

    await executor(Promise.allSettled(fetchAppPromises))
  }, [])

  if (accounts.find(a => a.status === 'ACTIVATING') && accounts.length === 1) {
    return <Redirect to={SignUpPathEnum.step1Register} />
  }

  return (
    <Page
      centered={false}
      title={t('home_page.title')}
      className={classes.page}
      customFooter={<Footer />}
      headerTheme='light'
    >
      <HomePageHero />
      <HomeServiceSection />
      <SocialProofSection />
      <HomeDiscoverySection />
    </Page>
  )
}

export default HomePageOld
