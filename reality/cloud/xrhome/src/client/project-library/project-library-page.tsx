import React, {useRef, useState, useEffect} from 'react'
import {useLocation, useHistory, Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {createThemedStyles} from '../ui/theme'
import ErrorMessage from '../home/error-message'
import Page from '../widgets/page'
import {useSelector} from '../hooks'
import SelectDropDown from '../widgets/select-dropdown'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import useActions from '../common/use-actions'
import {combine, bool} from '../common/styles'
import projectLibraryActions from './project-library-actions'
import ProjectLibrary from '../browse/project-library'
import blankProfilePage from '../static/blankProfilePage.svg'
import ProjectCardPlaceholder from '../widgets/project-card-placeholder'
import {CodeSearchResultsPlaceholder} from '../widgets/code-search-results-placeholder'
import {Footer} from '../widgets/web8-footer'
import type {AppHostingType} from '../common/types/db'
import {useCancelableDebounce} from '../common/use-debounce'
import {StandardTextInput} from '../ui/components/standard-text-input'
import {ProjectLibraryCodeResults} from './project-library-code-results'
import {useStringConsumedUrlParamEffect} from '../hooks/use-consumed-url-param-effect'
import userActions from '../user/user-actions'
import {Loader} from '../ui/components/loader'
import {Icon} from '../ui/components/icon'
import {IconButton} from '../ui/components/icon-button'
import {mobileViewOverride, tinyViewOverride} from '../static/styles/settings'

const E8_SEARCH_DELAY = 1000
const MIN_SEARCH_CHAR_COUNT = 3

const useStyles = createThemedStyles(theme => ({
  page: {
    'backgroundColor': theme.bgMain,
    '& > .page-content': {
      paddingTop: '0',
      marginBottom: '80px',
    },
  },
  content: {
    'fontSize': '14px',
    'height': '100%',
    'padding': '3em 6em',
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '1.6em',
    'fontFamily': theme.bodyFontFamily,
    'lineHeight': '1.571em',
    'fontWeight': '400',
    'color': theme.fgMain,
    [mobileViewOverride]: {
      padding: '3em',
    },
    [tinyViewOverride]: {
      padding: '3em 1em',
    },
  },
  topContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    width: '100%',
    minHeight: '40px',
    justifyContent: 'space-between',
  },
  tabsContainer: {
    height: '40px',
    background: theme.sfcBackgroundDefault,
    border: `1px solid ${theme.sfcBorderDefault}`,
    borderRadius: '8px',
    padding: '4px',
    display: 'flex',
    gap: '4px',
    [tinyViewOverride]: {
      width: '100%',
    },
  },
  tab: {
    'color': theme.fgMain,
    'display': 'flex',
    'width': '160px',
    'borderRadius': '6px',
    'justifyContent': 'center',
    'alignItems': 'center',
    'gap': '8px',
    'flex': '1 0 0',
    'whiteSpace': 'nowrap',
    '&:hover': {
      color: theme.fgMain,
      background: theme.tagHoverBg,
    },
    [tinyViewOverride]: {
      width: 'unset',
    },
  },
  tabActive: {
    'background': theme.bgMuted,
    'boxShadow': theme.secondaryBtnBoxShadow,
    '&:hover': {
      background: theme.secondaryBtnHoverBg,
    },
  },
  inputsContainer: {
    'display': 'flex',
    'flexWrap': 'wrap',
    'gap': '8px',
    'width': 'fit-content',
    'justifyContent': 'space-between',
    '& > div': {
      flex: '1 0 auto',
    },
    '& > button': {
      'display': 'none',
    },
    [mobileViewOverride]: {
      'width': '100%',
      '& > button': {
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'center',
        'width': '40px',
        'height': '40px',
        'background': theme.sfcBackgroundDefault,
        'boxShadow': theme.secondaryBtnBoxShadow,
        'borderRadius': '8px',
        '&:hover': {
          background: theme.secondaryBtnHoverBg,
        },
      },
    },
  },
  filtersShown: {
    [mobileViewOverride]: {
      '& > button': {
        'background': theme.bgMuted,
      },
    },
  },
  searchContainer: {
    'display': 'flex',
    'flexDirection': 'row',
    'width': '280px',
    'border': `1px solid ${theme.sfcBorderDefault}`,
    'borderRadius': '8px',
    'background': theme.sfcBackgroundDefault,
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'padding': '0 4px',
    '& > :nth-child(2)': {
      flex: 1,
    },
    '& > div': {
      'background': 'transparent',
      'border': 'none',
      'borderRadius': 0,
      'boxShadow': 'none',
      '&:hover': {
        background: 'transparent',
      },
      '&:focus-within': {
        boxShadow: 'none',
      },
    },
    '& > svg': {
      margin: '0 8px',
    },
    '& input': {
      padding: 0,
    },
    '& > button': {
      'width': '32px',
      'height': '32px',
      'borderRadius': '6px',
      'display': 'flex',
      'justifyContent': 'center',
      'alignItems': 'center',
      '&:hover': {
        background: theme.secondaryBtnHoverBg,
      },
    },
    '&:hover': {
      background: theme.tagHoverBg,
    },
    '&:focus-within': {
      border: `1px solid ${theme.sfcBorderFocus}`,
    },
    [mobileViewOverride]: {
      flex: 1,
    },
  },
  codeSearchActive: {
    '& > button': {
      'background': theme.modalContentBg,
      '&:hover': {
        background: theme.secondaryBtnHoverBg,
      },
    },
  },
  dropDownsContainer: {
    'display': 'flex',
    'gap': '8px',
    [mobileViewOverride]: {
      width: '100%',
    },
    [tinyViewOverride]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  dropDown: {
    height: '40px',
    width: '160px',
    [tinyViewOverride]: {
      width: '100%',
    },
  },
  cardContainer: {
    'marginTop': '1em',
    'display': 'grid',
    'gap': '2em 0.75em',
    'gridTemplateColumns': 'repeat(auto-fill, minmax(320px, 1fr))',
    'gridAutoRows': 'minmax(min-content, max-content)',
    'paddingBottom': '1em',
    [tinyViewOverride]: {
      gap: '0.75em 0',
    },
  },
  wideCardContainer: {
    'gridTemplateColumns': 'repeat(auto-fill, minmax(400px, 1fr))',
  },
  noProject: {
    'display': 'flex',
    'flexDirection': 'column',
    'flex': '1',
    'alignItems': 'center',
    'gap': '1em',
    'justifyContent': 'center',
    '& p': {
      color: theme.fgMuted,
    },
    '& img': {
      width: '300px',
      opacity: '1',
    },
  },
  resultsCount: {
    fontFamily: theme.subHeadingFontFamily,
    marginTop: '-0.75em',
    marginBottom: '-1.75em',
    fontSize: '14px',
    color: theme.fgMuted,
  },
  resultsCountHidden: {
    visibility: 'hidden',
  },
  codeSearchResultsContainer: {
    marginTop: '1em',
    gap: '2em',
    display: 'flex',
    flexDirection: 'column',
  },
}))

const ProjectLibraryPage = () => {
  const isDesktop = Build8.PLATFORM_TARGET === 'desktop'
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])
  const apps = useSelector(state => state.projectLibrary?.searchApps)
  const loading = useSelector(state => state.projectLibrary?.pending.getSearchApps)
  const {clearSearchApps, getSearchApps} = useActions(projectLibraryActions)
  const latestAbortController = useRef<AbortController>()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false)
  const isTinyScreen = useSelector(state => state.common.isTinyScreen)
  const [showFilters, setShowFilters] = useState(!isTinyScreen)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const shouldForcePushHistory = useRef(false)
  const isUserInteraction = useRef(false)

  /* eslint-disable local-rules/hardcoded-copy */
  const projectLibraryTabs = [
    {
      name: t('project_library_page.tab.game_packs'),
      value: 'game_packs',
      link: '/projects?tag=game-pack',
      showDescription: true,
      showCTAs: true,
      showTags: true,
      hasWideCards: true,
    },
    {
      name: t('project_library_page.tab.ar_starters'),
      value: 'ar_starters',
      link: '/projects?tag=ar-starter',
      showTags: true,
      hasWideCards: true,
    },
    {
      name: t('project_library_page.tab.all_templates'),
      value: 'all_templates',
      link: '/projects',
    },
  ]

  const techTypes = [
    t('project_library_page.dropdown.option.all_types'),
    'World Effects',
    'VPS',
    'Image Targets - Curved',
    'Image Targets - Flat',
    'Face Effects',
    'Hand Tracking',
    'Sky Effects',
    'Shared AR',
    'Holograms',
    'Avatars',
  ]

  const frameworks = [
    t('project_library_page.dropdown.option.all_frameworks'),
    'Studio',
    'A-Frame',
    'Three.js',
    'Babylon.js',
  ]

  const communities = [
    {name: t('project_library_page.dropdown.option.by_8th_wall'), value: '8thwall'},
    {name: t('project_library_page.dropdown.option.by_community'), value: 'community'},
    {name: t('project_library_page.dropdown.option.all_templates'), value: 'all'},
  ]
  /* eslint-enable local-rules/hardcoded-copy */

  const location = useLocation()
  const history = useHistory()
  const [query, setQuery] = useState('')
  const [techType, setTechType] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState(projectLibraryTabs[2].value)
  const selectedTab = projectLibraryTabs.find(e => e.value === activeTab) || projectLibraryTabs[0]
  const [tag, setTag] = useState<string[]>([])
  const [framework, setFramework] = useState<string[]>([])
  const [community, setCommunity] = useState<string[]>([])
  const [codeSearch, setCodeSearch] = useState<boolean>(false)
  const didInitialRedirect = useRef(false)

  const {setDesktopDuplicateProjectReturnUrl} = useActions(userActions)
  useStringConsumedUrlParamEffect('desktopRedirect', (value) => {
    setDesktopDuplicateProjectReturnUrl(value)
  })

  const getStates = (searchParams: URLSearchParams) => {
    const queryState = searchParams.get('q') || ''
    const techTypeState: string[] = []
    const tech = searchParams.get('tech')
    if (tech) {
      tech.split(',').forEach((te) => {
        if (techTypes.includes(te)) {
          techTypeState.push(te)
        }
      })
    }
    const tagParam = searchParams.get('tag')
    const tagState = tagParam ? tagParam.split(',') : []
    const frameworkParam = searchParams.get('framework')
    const frameworkState = frameworkParam ? [frameworkParam] : []
    const communityValue =
      communities.find(({value}) => value === searchParams.get('community'))?.value
    const communityState = communityValue ? [communityValue] : []
    const codeSearchState = searchParams.get('codeSearch') === 'true'

    return {
      query: queryState,
      techType: !isDesktop ? techTypeState : [],
      tag: tagState,
      framework: !isDesktop ? frameworkState : [],
      community: communityState,
      codeSearch: codeSearchState,
    }
  }

  useEffect(() => {
    // Redirect /projects to /projects?tag=game-pack only once on the initial load
    if (!didInitialRedirect.current) {
      if (location.pathname === '/projects' && !location.search) {
        history.replace('/projects?tag=game-pack')
      }
      didInitialRedirect.current = true
    }
  }, [location.pathname, location.search, history])

  useEffect(() => {
    // Update URL params only if the filters were changed by user interaction
    if (!isUserInteraction.current) {
      return
    }

    const searchParams = new URLSearchParams()
    if (query) {
      searchParams.append('q', query)
    }

    if (tag.length) {
      searchParams.append('tag', tag.join(','))
    }

    if (community.length) {
      searchParams.append(
        'community', communities.find(({value}) => community.includes(value)).value
      )
    }

    if (codeSearch) {
      searchParams.append('codeSearch', 'true')
    }

    if (!isDesktop) {
      const tech: string[] = []
      techType.forEach(tt => tech.push(tt))
      if (tech.length) {
        searchParams.append('tech', tech.join(','))
      }

      if (framework.length) {
        searchParams.append('framework', framework[0])  // Single selection
      }
    }

    if (!isSearchInputFocused || shouldForcePushHistory.current) {
      history.push({search: searchParams.toString()})
    } else {
      history.replace({search: searchParams.toString()})
    }
  }, [query, techType, tag, framework, community, codeSearch])

  useAbandonableEffect(async (executor) => {
    const searchParams = new URLSearchParams(location.search)

    // Set active tab based on the path
    const tabValue =
      projectLibraryTabs.find(({link}) => link === location.pathname + location.search)
    setActiveTab(tabValue ? tabValue.value : projectLibraryTabs[2].value)

    // Only update the states if the filters were NOT changed by user interaction
    if (!isUserInteraction.current) {
      const newStates = getStates(searchParams)
      setQuery(newStates.query)
      setTechType(newStates.techType)
      setTag(newStates.tag)
      setFramework(newStates.framework)
      setCommunity(newStates.community)
      setCodeSearch(newStates.codeSearch)
    }

    // Set back to default values after handling each location change
    shouldForcePushHistory.current = false
    isUserInteraction.current = false

    const hasStudioParam = searchParams.get('framework') === frameworks[1]
    if (hasStudioParam) {
      searchParams.delete('framework')
    }
    const type = hasStudioParam ? 'CLOUD_STUDIO' as AppHostingType : undefined
    if (type) {
      searchParams.append('type', type)
    }

    if (!searchParams.get('community')) {
      searchParams.set('community', communities[0].value)
    }

    if (latestAbortController.current) {
      latestAbortController.current.abort()
    }
    latestAbortController.current = new AbortController()

    await executor(getSearchApps(searchParams, latestAbortController.current.signal))

    if (isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [location.search])

  useEffect(() => {
    clearSearchApps()

    const searchInputElement = searchInputRef.current

    if (searchInputElement) {
      const handleFocus = () => setIsSearchInputFocused(true)
      const handleBlur = () => setIsSearchInputFocused(false)

      searchInputElement.addEventListener('focus', handleFocus)
      searchInputElement.addEventListener('blur', handleBlur)

      // Cleanup event listeners on component unmount
      return () => {
        searchInputElement.removeEventListener('focus', handleFocus)
        searchInputElement.removeEventListener('blur', handleBlur)
      }
    }
  }, [])

  useEffect(() => {
    setShowFilters(!isTinyScreen)
  }, [isTinyScreen])

  const eventQuery = query.trim()

  const trackUserInteraction = (
    searchQuery: string,
    searchCodeSearch: boolean
  ) => {
    shouldForcePushHistory.current = true

    window.dataLayer.push({
      event: 'projectLibrarySearch',
      projectLibrarySearch: {
        query: searchQuery,
        codeSearch: searchCodeSearch,
      },
    })
  }

  const trackUserInteractionRef = useRef(trackUserInteraction)
  const [debouncedTrackUserInteraction, cancelDebouncedTrackUserInteraction] =
    useCancelableDebounce(trackUserInteractionRef, E8_SEARCH_DELAY)

  useEffect(() => {
    if (
      eventQuery.length >= MIN_SEARCH_CHAR_COUNT || techType.length || framework.length
    ) {
      debouncedTrackUserInteraction(
        eventQuery,
        techType,
        framework.join(', '),
        codeSearch
      )
    }
    return () => {
      cancelDebouncedTrackUserInteraction()
    }
  }, [eventQuery, techType, framework, codeSearch])

  const onChangeHandler = (type: string, newValue: any, remove = false) => {
    isUserInteraction.current = true

    if (type === 'query') {
      setQuery(newValue)
    } else if (type === 'tech') {
      if (remove) {
        setTechType(techType.filter(tt => tt !== newValue))
      } else {
        // techTypes[0] is 'All'
        setTechType(newValue === techTypes[0]
          ? []
          : techType.concat([newValue]))
      }
    } else if (type === 'framework') {
      // frameworks[0] is 'All'
      setFramework(newValue === frameworks[0] ? [] : [newValue])
    } else if (type === 'community') {
      setCommunity(communities.filter(({value}) => value === newValue).flatMap(({value}) => value))
    } else if (type === 'codeSearch') {
      setCodeSearch(newValue)
    }
  }

  const getProjectCardsView = () => {
    if (isInitialLoad) {
      return codeSearch
        ? <CodeSearchResultsPlaceholder count={5} className={classes.codeSearchResultsContainer} />
        : (
          <ProjectCardPlaceholder
            count={24}
            className={combine(
              classes.cardContainer, bool(selectedTab.hasWideCards, classes.wideCardContainer)
            )}
          />
        )
    }

    if (!apps?.length && !loading) {
      return (
        <div className={classes.noProject}>
          <img alt='blank profile page' src={blankProfilePage} />
          <p>{t('project_library_page.no_projects_found')}</p>
        </div>
      )
    }

    return (
      codeSearch && apps.some(app => app.innerHits?.code?.hits?.length)
    )
      ? (
        <ProjectLibraryCodeResults
          className={classes.codeSearchResultsContainer}
          apps={apps}
          pageName='project-library-code-search'
          showAgency
        />
      )
      : (
        <ProjectLibrary
          className={combine(
            classes.cardContainer, bool(selectedTab.hasWideCards, classes.wideCardContainer)
          )}
          apps={apps}
          pageName='project-library'
          showAgency
          showIcons={false}
          showDescription={selectedTab.showDescription}
          showCTAs={selectedTab.showCTAs}
          showTags={selectedTab.showTags}
        />
      )
  }

  const getResultsCount = () => {
    if (!apps?.length) {
      return 0
    }

    return codeSearch
      // If code search is enabled, count the total number of code matches across all apps
      ? apps.reduce((acc, app) => {
        const hitSum = app.innerHits?.code?.hits.reduce(
          (hitAcc, hit) => hitAcc + hit.fileContentHighlights.length,
          0
        ) || 0
        return acc + hitSum
      }, 0)
      // Otherwise, just count the number of apps
      : apps.length
  }

  return (
    <Page
      centered={false}
      title={t('project_library_page.title')}
      className={classes.page}
      hasFooter={false}
    >
      <ErrorMessage />
      <div className={classes.content}>
        <div className={classes.topContainer}>
          <div className={classes.tabsContainer}>
            {projectLibraryTabs.map(tab => (
              <Link
                className={combine(classes.tab, activeTab === tab.value && classes.tabActive)}
                key={tab.value}
                to={tab.link}
              >
                {tab.name}
              </Link>
            ))}
          </div>
          {activeTab === 'all_templates' &&
            <div
              className={combine(classes.inputsContainer, bool(showFilters, classes.filtersShown))}
            >
              <div
                className={
                  combine(classes.searchContainer, bool(codeSearch, classes.codeSearchActive))
                }
              >
                <Icon stroke='search' />
                <StandardTextInput
                  ref={searchInputRef}
                  id='search-input'
                  placeholder={
                    codeSearch
                      ? t('project_library_page.input.placeholder.search_by_code')
                      : t('project_library_page.input.placeholder.search_by_keyword')
                  }
                  aria-label={t('project_library_page.input.search_label')}
                  onChange={e => onChangeHandler('query', e.target.value)}
                  value={query}
                />
                {loading && <Loader size='tiny' inline centered />}
                <IconButton
                  stroke='code'
                  onClick={() => onChangeHandler('codeSearch', !codeSearch)}
                  text={t('project_library_page.input.code_search_toggle')}
                />
              </div>
              <IconButton
                stroke='filter'
                onClick={() => setShowFilters(!showFilters)}
                text={t('project_library_page.input.filter_toggle')}
              />
              {showFilters &&
                <div className={classes.dropDownsContainer}>
                  {!isDesktop &&
                    <>
                      <SelectDropDown
                        className={classes.dropDown}
                        type='tech'
                        selected={techType}
                        options={techTypes}
                        onClickOption={onChangeHandler}
                        isMultiSelect='types'
                      />
                      <SelectDropDown
                        className={classes.dropDown}
                        type='framework'
                        selected={framework}
                        options={frameworks}
                        onClickOption={onChangeHandler}
                      />
                    </>
                  }
                  <SelectDropDown
                    className={classes.dropDown}
                    type='community'
                    selected={community}
                    options={communities.map(({value}) => value)}
                    onClickOption={onChangeHandler}
                  />
                </div>
        }
            </div>
          }
        </div>
        <div className={combine(classes.resultsCount, bool(loading, classes.resultsCountHidden))}>
          {t('project_library_page.results_found_count', {
            count: getResultsCount(),
          })}
        </div>
        {getProjectCardsView()}
      </div>
      <Footer />
    </Page>
  )
}

export default ProjectLibraryPage
