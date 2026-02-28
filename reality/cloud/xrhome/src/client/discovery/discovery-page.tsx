import React, {useState} from 'react'
import {useLocation, useParams, Redirect} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import ErrorMessage from '../home/error-message'
import {useSelector} from '../hooks'
import {mobileViewOverride, tinyViewOverride} from '../static/styles/settings'
import Page from '../widgets/page'
import Hero from './hero'
import Keywords from './keywords'
import {
  ALL_KEYWORD,
  VIEW_ALL_KEYWORD,
  APPS_PATH_PREFIX,
  PREDETERMINED_PATH,
  KEYWORD_PATHS_SET,
  DEFAULT_FEATURED_EXCLUDES,
} from '../../shared/discovery-constants'
import {DiscoveryContext} from './discovery-context'
import TechnologyTypeDropdown from './technology-type-dropdown'
import TryItOutCheckbox from './try-it-out-checkbox'
import {constructRequestBody} from '../../shared/discovery-utils'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import discoveryActions from './discovery-actions'
import useActions from '../common/use-actions'
import ProjectLibrary from '../browse/project-library'
import ProjectCardPlaceholder from '../widgets/project-card-placeholder'
import BackToTopButton from '../uiWidgets/back-to-top-button'
import blankProfilePage from '../static/blankProfilePage.svg'
import ViewMore from '../widgets/view-more'
import {useDiscoveryKey} from '../hooks/use-discovery-key'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  page: {
    '& > .page-content': {
      paddingTop: '0',
      marginBottom: '80px',
      [tinyViewOverride]: {
        marginBottom: '24px',
      },
    },
  },
  section: {
    margin: '0 auto',
    padding: '0 88px',
    [mobileViewOverride]: {
      padding: '0 40px 24px 40px',
    },
    [tinyViewOverride]: {
      padding: '0 24px 24px 24px',
    },
  },
  searchParamContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    flexWrap: 'wrap',
    marginBottom: '32px',
    [tinyViewOverride]: {
      gap: '24px',
    },
  },
  loader: {
    marginTop: '8rem !important',
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
      fontFamily: `${theme.headingFontFamily} !important`,
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '1.5em',
      color: theme.fgMuted,
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
      color: theme.fgMuted,
    },
    [tinyViewOverride]: {
      'width': '200px',
    },
  },
  viewMore: {
    paddingTop: '2em',
  },
  cardGrid: {
    'display': 'grid',
    'gridTemplateColumns': 'repeat(auto-fill, minmax(280px, 1fr))',
    'gap': '2em 0.75em',
    'justifyContent': 'center',
    [mobileViewOverride]: {
      gridTemplateColumns: '1fr 1fr',
      maxWidth: '720px',
      margin: '0 auto',
    },
    [tinyViewOverride]: {
      gridTemplateColumns: '1fr',
      gap: '0.75em 0',
      padding: '0 6px',
      maxWidth: '380px',
    },
  },
}))

const DiscoveryPage = () => {
  const classes = useStyles()
  const location = useLocation()
  const {keyword} = useParams<{keyword: string}>()
  const {t} = useTranslation(['public-featured-pages'])
  const apps = useSelector(state => state.discovery.searchResults)
  const searchPending = useSelector(state => state.discovery.pending.search)
  const preloaded = useSelector(state => state.discovery?.preload)
  const preloadFrom = useSelector(state => state.discovery?.preloadFrom) || 0
  const activeKeyword = useDiscoveryKey()
  const {fetchApps, clearApps, setPreload} = useActions(discoveryActions)
  const [from, setFrom] = useState(0)
  const [loading, setLoading] = useState(false)

  const shouldRedirect = keyword && !KEYWORD_PATHS_SET.has(keyword)

  useAbandonableEffect(async (executor) => {
    if (loading) {
      const isViewAll = activeKeyword.name === VIEW_ALL_KEYWORD.name
      const searchParams = new URLSearchParams(location.search)
      if (!isViewAll) {
        searchParams.set('featured', 'true')  // only fetch partner, enterprise, or whitelabel apps
      }
      const body = constructRequestBody({
        searchParams,
        from,
        ...(
          isViewAll
            ? {excludes: {superDev: true}}  // excludes only 8th Wall apps
            : {excludes: DEFAULT_FEATURED_EXCLUDES, keyword}
        ),
      })
      setFrom(await executor(fetchApps(body)))
      setLoading(false)
    }
  }, [loading])

  useAbandonableEffect(async (executor) => {
    if (shouldRedirect) {
      return
    }
    if (preloaded) {
      setFrom(preloadFrom)
      setPreload(false)
      return
    }
    const isViewAll = activeKeyword.name === VIEW_ALL_KEYWORD.name
    const searchParams = new URLSearchParams(location.search)
    if (!isViewAll) {
      searchParams.set('featured', 'true')  // only fetch partner, enterprise, or whitelabel apps
    }
    const body = constructRequestBody({
      searchParams,
      from: 0,
      ...(
        isViewAll
          ? {excludes: {superDev: true}}  // excludes only 8th Wall apps
          : {excludes: DEFAULT_FEATURED_EXCLUDES, keyword}
      ),
    })
    clearApps()
    setFrom(await executor(fetchApps(body)))
  }, [location.pathname, location.search])

  const pageName = (!activeKeyword || activeKeyword === ALL_KEYWORD)
    ? PREDETERMINED_PATH
    : `${PREDETERMINED_PATH}-${activeKeyword.name}`
  const pageTitle = (!activeKeyword || activeKeyword === ALL_KEYWORD)
    ? t('discovery_page.keyword.all.page_title')
    : t(activeKeyword.pageTitleTranslationKey)
  if (shouldRedirect) {
    return <Redirect to={`/${PREDETERMINED_PATH}`} />
  }

  const projectLibraryView = apps.length > 0
    ? (
      <ProjectLibrary
        className={classes.cardGrid}
        pageName={pageName}
        apps={apps}
        showAgency
      />
    )
    : (
      <section className={classes.nullContainer}>
        <img alt='blank profile page' src={blankProfilePage} className={classes.blankProfilePage} />
        <div className={classes.nullText}>
          <h2>{t('discovery_page.could_not_find_results')}</h2>
        </div>
      </section>
    )

  return (
    <Page
      centered={false}
      title={pageTitle}
      className={classes.page}
    >
      <ErrorMessage />
      <Hero activeKeyword={activeKeyword} />
      <DiscoveryContext.Provider value={{pageName}}>
        <Keywords
          allPathPrefix={PREDETERMINED_PATH}
          allKeyword={ALL_KEYWORD}
          pathPrefix={APPS_PATH_PREFIX}
        />
        <section className={classes.section}>
          <div className={classes.searchParamContainer}>
            <TechnologyTypeDropdown />
            <TryItOutCheckbox />
          </div>
          {/* TODO(kim): Add logic to calculate number of placeholders by window size */}
          {(searchPending || searchPending === undefined) && !apps.length
            ? <ProjectCardPlaceholder showAccountIcon count={24} className={classes.cardGrid} />
            : projectLibraryView
          }
        </section>
        {from > 0 &&
          <div className={classes.viewMore}>
            <ViewMore
              isLoading={searchPending}
              onLoad={() => { setLoading(true) }}
              offset={20}
            />
          </div>
        }
      </DiscoveryContext.Provider>
      <BackToTopButton showAfterY={600} />
    </Page>
  )
}

export default DiscoveryPage
