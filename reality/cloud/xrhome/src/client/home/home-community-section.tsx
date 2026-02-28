import React from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'

import {mobileViewOverride, mobileWidthBreakpoint} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'
import {useSelector} from '../hooks'
import {TOP_FEATURED_CATEGORIES} from './home-constants'
import useActions from '../common/use-actions'
import homeActions from './home-actions'
import {SEARCH_INDEX_NAME, ServeDocumentsRequestBody} from '../../shared/home-types'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import {HomeCommunityCarousel} from './home-community-carousel'
import type {IBrowseApp} from '../common/types/models'
import {SecondaryButton} from '../ui/components/secondary-button'
import {HomeVideoSection} from './home-video-section'

const CATEGORY_PROJECT_AMOUNT = 10

const useStyles = createThemedStyles(theme => ({
  section: {
    padding: '2em',
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    gap: '0.75em',
    position: 'relative',
    overflow: 'hidden',
    marginTop: '-5em',
    [mobileViewOverride]: {
      padding: '2em 1em',
    },
  },
  headingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5em',
    maxWidth: mobileWidthBreakpoint,
    alignItems: 'center',
  },
  heading: {
    color: theme.fgMain,
    fontFamily: theme.headingFontFamily,
    fontSize: '2em',
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: '1em',
  },
  subheading: {
    fontFamily: theme.subHeadingFontFamily,
    color: theme.fgMuted,
  },
}))

const HomeCommunitySection: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])
  const apps = useSelector(state => state.home.searchResults)
  const searchPending = useSelector(state => state.home.searchPending)
  const carouselPending = searchPending[TOP_FEATURED_CATEGORIES[0].keyword]
  const preload = useSelector(state => state.home?.preload)
  const {setPreload, fetchApps, clearApps} = useActions(homeActions)
  // TODO(kim): Get correct query for apps
  const carouselApps = apps[TOP_FEATURED_CATEGORIES[0].keyword]

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

  return (
    <div className={classes.section}>
      <HomeVideoSection />
      <div className={classes.headingContainer}>
        <div className={classes.heading}>
          {t('home_page.community_carousel.heading')}
        </div>
        <div className={classes.subheading}>
          {t('home_page.community_carousel.subheading')}
        </div>
      </div>
      <HomeCommunityCarousel
        pending={carouselPending}
        apps={carouselApps as IBrowseApp[]}
        appCount={CATEGORY_PROJECT_AMOUNT}
      />
      <Link
        to='/discover'
        a8='click;homepage;click-discovery-footer'
      >
        <SecondaryButton spacing='wide'>
          {t('home_page.community_carousel.button.view_all')}
        </SecondaryButton>
      </Link>
    </div>
  )
}

export {HomeCommunitySection}
