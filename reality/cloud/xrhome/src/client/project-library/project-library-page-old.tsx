import React, {useRef, useState, useEffect} from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import ErrorMessage from '../home/error-message'
import Page from '../widgets/page'
import Icons from '../apps/icons'
import {useSelector} from '../hooks'
import SelectDropDown from '../widgets/select-dropdown'
import {useAbandonableEffect} from '../hooks/abandonable-effect'
import useActions from '../common/use-actions'
import projectLibraryActions from './project-library-actions'
import ProjectLibrary from '../browse/project-library'
import blankProfilePage from '../static/blankProfilePage.svg'
import ProjectCardPlaceholder from '../widgets/project-card-placeholder'
import {CodeSearchResultsPlaceholder} from '../widgets/code-search-results-placeholder'
import {Footer} from '../widgets/web8-footer'
import {useLibraryStyles} from './library-styles'
import {ProjectModuleLibraryHeader} from './project-module-library-header'
import {isUpgradedWebAccount} from '../../shared/account-utils'
import type {AppHostingType} from '../common/types/db'
import {useUserHasSession} from '../user/use-current-user'
import {withAccountsLoaded} from '../common/with-state-loaded'
import {useCancelableDebounce} from '../common/use-debounce'
import {StandardInlineToggleField} from '../ui/components/standard-inline-toggle-field'
import {ProjectLibraryCodeResults} from './project-library-code-results'
import {useStringConsumedUrlParamEffect} from '../hooks/use-consumed-url-param-effect'
import userActions from '../user/user-actions'
import {Loader} from '../ui/components/loader'

const E8_SEARCH_DELAY = 1000
const MIN_SEARCH_CHAR_COUNT = 3

const ProjectLibraryPage = () => {
  const classes = useLibraryStyles()
  const {t} = useTranslation(['public-featured-pages'])
  const isLoggedIn = useUserHasSession()
  const apps = useSelector(state => state.projectLibrary?.searchApps)
  const accounts = useSelector(state => state.accounts.allAccounts)
  const loading = useSelector(state => state.projectLibrary?.pending.getSearchApps)
  const {clearSearchApps, getSearchApps} = useActions(projectLibraryActions)
  const latestAbortController = useRef<AbortController>()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const shouldForcePushHistory = useRef(false)
  const isUserInteraction = useRef(false)

  /* eslint-disable local-rules/hardcoded-copy */
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
    {name: t('project_library_page.dropdown.option.all_projects'), value: 'all'},
    {name: t('project_library_page.dropdown.option.official_projects'), value: '8thwall'},
    {name: t('project_library_page.dropdown.option.community_projects'), value: 'community'},
  ]
  /* eslint-enable local-rules/hardcoded-copy */

  const location = useLocation()
  const history = useHistory()
  const [query, setQuery] = useState('')
  const [techType, setTechType] = useState<string[]>([])
  const [tag, setTag] = useState<string[]>([])
  const [framework, setFramework] = useState<string[]>([])
  const [community, setCommunity] = useState<string[]>([])
  const [codeSearch, setCodeSearch] = useState<boolean>(false)
  const studioProjectsOnly = isLoggedIn && !accounts?.some(acct => isUpgradedWebAccount(acct))

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
    const communityName =
      communities.find(({value}) => value === searchParams.get('community'))?.name
    const communityState = communityName ? [communityName] : []
    const codeSearchState = searchParams.get('codeSearch') === 'true'

    return {
      query: queryState,
      techType: techTypeState,
      tag: tagState,
      framework: frameworkState,
      community: communityState,
      codeSearch: codeSearchState,
    }
  }

  useEffect(() => {
    // Update URL params only if the filters were changed by user interaction
    if (!isUserInteraction.current) {
      return
    }

    const searchParams = new URLSearchParams()
    if (query) {
      searchParams.append('q', query)
    }

    const tech: string[] = []
    techType.forEach(tt => tech.push(tt))
    if (tech.length) {
      searchParams.append('tech', tech.join(','))
    }

    if (tag.length) {
      searchParams.append('tag', tag.join(','))
    }

    if (framework.length) {
      searchParams.append('framework', framework[0])  // Single selection
    }

    if (community.length) {
      searchParams.append('community', communities.find(({name}) => community.includes(name)).value)
    }

    if (codeSearch) {
      searchParams.append('codeSearch', 'true')
    }

    if (!isSearchInputFocused || shouldForcePushHistory.current) {
      history.push({search: searchParams.toString()})
    } else {
      history.replace({search: searchParams.toString()})
    }
  }, [query, techType, tag, framework, community, codeSearch])

  useAbandonableEffect(async (executor) => {
    const searchParams = new URLSearchParams(location.search)

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
    const type = hasStudioParam || studioProjectsOnly ? 'CLOUD_STUDIO' as AppHostingType : undefined
    if (type) {
      searchParams.append('type', type)
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

    return null
  }, [])

  const eventQuery = query.trim()

  const trackUserInteraction = (
    searchQuery: string,
    searchTechTypes: string[],
    searchFrameworks: string,
    searchCodeSearch: boolean
  ) => {
    shouldForcePushHistory.current = true

    window.dataLayer.push({
      event: 'projectLibrarySearch',
      projectLibrarySearch: {
        query: searchQuery,
        techTypes: searchTechTypes.join(', '),
        frameworks: searchFrameworks,
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

  const onChangeHandler = (type: string, value: any, remove = false) => {
    isUserInteraction.current = true

    if (type === 'query') {
      setQuery(value)
    } else if (type === 'tech') {
      if (remove) {
        setTechType(techType.filter(tt => tt !== value))
      } else {
        // techTypes[0] is 'All'
        setTechType(value === techTypes[0]
          ? []
          : techType.concat([value]))
      }
    } else if (type === 'framework') {
      // frameworks[0] is 'All'
      setFramework(value === frameworks[0] ? [] : [value])
    } else if (type === 'community') {
      // communities[0] is 'All'
      setCommunity(communities.filter(({name}) => name === value).flatMap(({name}) => name))
    } else if (type === 'codeSearch') {
      setCodeSearch(value)
    }
  }

  const getProjectCardsView = () => {
    if (isInitialLoad) {
      return codeSearch
        ? <CodeSearchResultsPlaceholder count={5} className={classes.codeSearchResultsContainer} />
        : <ProjectCardPlaceholder count={24} className={classes.cardContainer} />
    }

    if (!apps?.length && !loading) {
      return (
        <div className={classes.noProject}>
          {/* eslint-disable-next-line local-rules/hardcoded-copy */}
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
          className={classes.cardContainer}
          apps={apps}
          pageName='project-library'
          showAgency
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
        <ProjectModuleLibraryHeader />
        <div className={classes.inputsContainer}>
          <div className={classes.searchContainer}>
            <img
              className={classes.searchIcon}
              src={Icons.search}
              alt={t('project_library_page.input.search_label')}
            />
            <input
              id='project-library-search'
              ref={searchInputRef}
              className={classes.searchInput}
              type='text'
              placeholder={
                codeSearch
                  ? t('project_library_page.input.placeholder.search_by_code')
                  : t('project_library_page.input.placeholder.search_by_keyword')
              }
              aria-label={t('project_library_page.input.search_label')}
              onChange={e => onChangeHandler('query', e.target.value)}
              value={query}
            />
            {/* eslint-disable-next-line local-rules/ui-component-styling */}
            {loading && <Loader size='tiny' inline centered className={classes.loader} />}
            <div className={classes.codeSearchToggle}>
              <StandardInlineToggleField
                checked={codeSearch}
                onChange={() => onChangeHandler('codeSearch', !codeSearch)}
                id='codeSearchToggle'
                label={t('project_library_page.input.code_search_toggle')}
                reverse
                nowrap
              />
            </div>
          </div>
          <div className={classes.dropDownsContainer}>
            <SelectDropDown
              className={classes.dropDown}
              type='tech'
              selected={techType}
              options={techTypes}
              onClickOption={onChangeHandler}
              isMultiSelect='types'
            />
            {!studioProjectsOnly &&
              <SelectDropDown
                className={classes.dropDown}
                type='framework'
                selected={framework}
                options={frameworks}
                onClickOption={onChangeHandler}
              />
            }
            <SelectDropDown
              className={classes.dropDown}
              type='community'
              selected={community}
              options={communities.map(({name}) => name)}
              onClickOption={onChangeHandler}
            />
          </div>
        </div>
        <div className={classes.resultsCount}>
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

const WrappedProjectLibraryPage = withAccountsLoaded(ProjectLibraryPage)

const Wrapper = () => {
  const isLoggedIn = useUserHasSession()

  if (isLoggedIn) {
    return <WrappedProjectLibraryPage />
  } else {
    return <ProjectLibraryPage />
  }
}

export default Wrapper
