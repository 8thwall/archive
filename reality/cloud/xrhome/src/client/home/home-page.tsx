import React from 'react'
import {Redirect} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {TOP_FEATURED_CATEGORIES} from './home-constants'
import {mobileViewOverride} from '../static/styles/settings'
import {SignUpPathEnum} from '../common/paths'
import {useSelector} from '../hooks'
import Page from '../widgets/page'
import {SEARCH_INDEX_NAME, ServeDocumentsRequestBody} from '../../shared/home-types'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import homeActions from './home-actions'
import useActions from '../common/use-actions'
import {Footer} from '../widgets/web8-footer'
import type {IAccount} from '../common/types/models'
import {createThemedStyles} from '../ui/theme'
import {HomeMetricsSection} from './home-metrics-section'
import {HomeEngineSection} from './home-engine-section'
import {CreateForFreeCtaSection} from './create-for-free-cta-section'
import {SocialProofBanner} from './social-proof-banner'
import {HomePageHero} from './home-page-hero'
import {HomeCommunitySection} from './home-community-section'
import {HomeReachBanner} from './home-reach-banner'

const CATEGORY_PROJECT_AMOUNT = 10

const useStyles = createThemedStyles(theme => ({
  page: {
    'background': theme.bgMain,
    '& .main-before-footer': {
      marginBottom: '0',
      display: 'flex',
      flexDirection: 'column',
      gap: '4em',
      [mobileViewOverride]: {
        gap: '1.75em',
      },
    },
  },
}))

const HomePage = () => {
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
    >
      <HomePageHero />
      <HomeCommunitySection />
      <HomeEngineSection />
      <HomeReachBanner />
      <HomeMetricsSection />
      <SocialProofBanner />
      <CreateForFreeCtaSection />
    </Page>
  )
}

export default HomePage
