import React from 'react'
import {createUseStyles} from 'react-jss'
import {useQuery} from '@tanstack/react-query'
import type {DeepReadonly} from 'ts-essentials'

import {useTranslation} from 'react-i18next'

import type {ListProjectsResponse} from '../../shared/studiohub/local-sync-types'
import type {IApp} from '../common/types/models'
import {SpaceBetween} from '../ui/layout/space-between'
import {ProjectListItem} from './project-list-item'
import AutoHeading from '../widgets/auto-heading'
import {combine} from '../common/styles'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import {listProjects} from '../studio/local-sync-api'
import {isCloudStudioApp, isDashboardVisible} from '../../shared/app-utils'
import {SimpleTextInput} from './text-input'
import {StandardDropdownField} from '../ui/components/standard-dropdown-field'
import {SrOnly} from '../ui/components/sr-only'
import {sortByDescAccessDate} from '../apps/app-user-specific'
import {useSelector} from '../hooks'
import {Loader} from '../ui/components/loader'

const useStyles = createUseStyles({
  projectList: {
    'overflowY': 'auto',
    'display': 'grid',
    'gridTemplateColumns': 'repeat(auto-fit, minmax(40rem, 1fr))',
    // NOTE(johnny): Hide scrollbar but keep scrolling functionality
    'scrollbarWidth': 'none',  // Firefox
    'msOverflowStyle': 'none',  // IE and Edge
    '&::-webkit-scrollbar': {
      display: 'none',  // Chrome, Safari, Opera
    },
  },
  heading: {
    fontFamily: 'Geist Mono',
    fontSize: '1rem',
    letterSpacing: '0.075rem',
    flexGrow: 0,
  },
  searchInput: {
    display: 'flex',
    height: '3rem',
    width: '24rem',
  },
  sortDropdown: {
    width: '11rem',
  },
  emptyState: {
    paddingTop: '4rem',
  },
})

const filterApps = (apps: DeepReadonly<IApp[]>, appSearch: string, sortBy: string) => {
  const searchTerm = appSearch.toLowerCase()
  const filteredApps = apps.filter(a => isDashboardVisible(a) && isCloudStudioApp(a))
    .filter(a => a.appTitle?.toLowerCase().includes(searchTerm) ||
    a.appName.toLowerCase().includes(searchTerm))

  switch (sortBy) {
    case 'name':
      return filteredApps.sort((a, b) => a.appName.localeCompare(b.appName))
    case 'created':
      return filteredApps.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    case 'lastModified':
    default:
      return filteredApps.sort(sortByDescAccessDate)
  }
}

const ProjectList: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['studio-desktop-pages'])
  const [appSearch, setAppSearch] = React.useState('')
  const [appSort, setAppSort] = React.useState('lastModified')
  const apps = useSelector(state => state.apps)
  const isAppsLoading = useSelector(state => state.apps.loading)
  const filteredApps = filterApps(apps, appSearch, appSort)

  const sortByOptions = [
    {
      content: t('project_list_page.sort.option.last_modified'),
      value: 'lastModified',
    }, {
      content: t('project_list_page.sort.option.name'),
      value: 'name',
    },
    {
      content: t('project_list_page.sort.option.created'),
      value: 'created',
    },
  ]

  const listProjectsQuery = useQuery<ListProjectsResponse>({
    queryKey: ['listProjects'],
    queryFn: listProjects,
  })

  return (
    <AutoHeadingScope>
      <SpaceBetween direction='vertical' narrow grow>
        <SpaceBetween between centered>
          <AutoHeading className={classes.heading}>
            {t('project_list_page.heading.projects')}
          </AutoHeading>
          <SpaceBetween>
            <div className={classes.searchInput}>
              <SimpleTextInput
                grow
                id='app-search'
                iconStroke='search'
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                placeholder={t('project_list_page.search.placeholder.search_apps')}
                label={t('project_list_page.search.label.search_apps')}
              />
            </div>
            <div className={classes.sortDropdown}>
              <StandardDropdownField
                options={sortByOptions}
                onChange={value => setAppSort(value)}
                value={appSort}
                label={<SrOnly>{t('project_list_page.sort.label.sort_by')}</SrOnly>}
              />
            </div>
          </SpaceBetween>
        </SpaceBetween>
        {isAppsLoading &&
          <div className={classes.emptyState}>
            <SpaceBetween centered justifyCenter>
              <Loader inline />
            </SpaceBetween>
          </div>}
        {!isAppsLoading && filteredApps.length > 0 &&
          <ul className={combine('style-reset', classes.projectList)}>
            {filteredApps.map(app => (
              <ProjectListItem
                key={app.uuid}
                app={app}
                project={listProjectsQuery.data?.projectByAppKey?.[app.appKey]}
              />
            ))}
          </ul>}
        {!isAppsLoading && filteredApps.length === 0 &&
          <div className={classes.emptyState}>
            <SpaceBetween direction='vertical' centered>
              <AutoHeading>
                {t('project_list_page.text.no_projects_found')}
              </AutoHeading>
            </SpaceBetween>
          </div>
        }
      </SpaceBetween>
    </AutoHeadingScope>
  )
}

export {
  ProjectList,
}
