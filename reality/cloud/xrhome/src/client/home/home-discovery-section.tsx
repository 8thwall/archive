import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'

import {SEARCH_INDEX_NAME, ServeDocumentsRequestBody} from '../../shared/home-types'
import {
  moonlight, brandPurple, brandWhite, brandHighlight, smallMonitorViewOverride, tinyViewOverride,
  bodySanSerif, headerSanSerif, gray4,
} from '../static/styles/settings'
import ProjectCardPlaceholder from '../widgets/project-card-placeholder'
import ProjectLibrary from '../browse/project-library'
import blankProfilePage from '../static/blankProfilePage.svg'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import homeActions from './home-actions'
import useActions from '../common/use-actions'
import {TOP_FEATURED_CATEGORIES} from './home-constants'
import {useSelector} from '../hooks'

const CATEGORY_PROJECT_AMOUNT = 10

const useStyles = createUseStyles({
  section: {
    backgroundColor: moonlight,
    padding: '4em 0',
  },
  heading: {
    fontFamily: headerSanSerif,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: '2em',
    margin: '1em',
  },
  subHeading: {
    fontFamily: bodySanSerif,
    fontSize: '1.25em',
    margin: '1em',
    textAlign: 'center',
  },
  categorySection: {
    maxWidth: 'calc(3000px + 4*2.4rem)',
    margin: '3.5em auto',
  },
  ctaLink: {
    'backgroundColor': brandPurple,
    'color': `${brandWhite} !important`,
    'fontSize': '1.125em',
    'LightHeight': '1.625em',
    'fontWeight': 'bold',
    'width': '200px',
    'height': '56px',
    'borderRadius': '28px',
    'margin': '2em auto 0',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    '&:hover': {
      backgroundColor: brandHighlight,
    },
  },
  nullContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '4em 0',
    gap: '1em',
  },
  nullText: {
    fontFamily: headerSanSerif,
    fontWeight: 500,
    fontSize: '1.25em',
    color: gray4,
  },
  homePageCardGrid: {
    'display': 'grid',
    'gridTemplateColumns': 'repeat(5, 1fr)',
    'rowGap': '1.25em',
    'columnGap': '0.75em',
    'justifyContent': 'center',
    'padding': '0 1.5em',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    [smallMonitorViewOverride]: {
      gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))',
      justifyContent: 'inherit',
      overflowX: 'scroll',
      rowGap: '3em',
      margin: '0 auto',
    },
    [tinyViewOverride]: {
      justifyContent: 'inherit',
      overflowX: 'scroll',
      rowGap: '2.7em',
    },
  },
})

const HomeDiscoverySection: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation('public-featured-pages')
  const apps = useSelector(state => state.home.searchResults)
  const searchPending = useSelector(state => state.home.searchPending)
  const categorySearchPending = searchPending[TOP_FEATURED_CATEGORIES[0].keyword]
  const preload = useSelector(state => state.home?.preload)
  const {setPreload, fetchApps, clearApps} = useActions(homeActions)
  // TODO(kim): Get correct query for apps
  const categoryApps = apps[TOP_FEATURED_CATEGORIES[0].keyword]

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

  const projectLibraryView = (discoveryApps: any) => (
    discoveryApps.length > 0
      ? (
        <ProjectLibrary
          className={classes.homePageCardGrid}
          pageName='homepage'
          apps={discoveryApps.slice(0, CATEGORY_PROJECT_AMOUNT)}
          showAgency
          showIcons={false}
        />
      )
      : (
        <div className={classes.nullContainer}>
          <img
            // eslint-disable-next-line local-rules/hardcoded-copy
            alt='blank profile page'
            src={blankProfilePage}
          />
          <div className={classes.nullText}>
            {t('home_page.null_text')}
          </div>
        </div>
      )
  )

  return (
    <div className={classes.section}>
      <div className={classes.heading}>{t('home_page.discovery_section.heading')}</div>
      <div className={classes.subHeading}>{t('home_page.discovery_section.subheading')}</div>
      <div className={classes.categorySection}>
        {(categorySearchPending || categorySearchPending === undefined)
          ? (
            <ProjectCardPlaceholder
              showAccountIcon
              count={CATEGORY_PROJECT_AMOUNT}
              className={classes.homePageCardGrid}
            />)
          : projectLibraryView(categoryApps)
        }
      </div>
      <div>
        <Link
          className={classes.ctaLink}
          to='/discover'
          a8='click;homepage;click-discovery-footer'
        >{t('home_page.redirect.discover_all')}
        </Link>
      </div>
    </div>
  )
}

export {
  HomeDiscoverySection,
}
