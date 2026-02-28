import React from 'react'

import type {IApp} from '../../common/types/models'
import AppCardGroup from '../../apps/widgets/app-card-group'
import {NoResultsText} from './no-results-text'

type ISearchableAppsList = React.ComponentProps<typeof AppCardGroup> & {
  searchValue: string
}

const filterApps = (searchValue: string, apps: IApp[]) => {
  const lowerSearch = searchValue.toLowerCase()
  return apps.filter(app => (app.appTitle && app.appTitle.toLowerCase().includes(lowerSearch)) ||
    (app.appName && app.appName.toLowerCase().includes(lowerSearch)) ||
    (app.appKey && app.appKey.toLowerCase() === lowerSearch))
}

const FilteredAppCards: React.FC<ISearchableAppsList> = ({searchValue, apps, ...rest}) => {
  const filteredApps = React.useMemo(() => {
    if (searchValue) {
      return filterApps(searchValue, apps)
    } else {
      return apps
    }
  }, [searchValue, apps])

  if (filteredApps.length === 0) {
    return <NoResultsText />
  }

  return <AppCardGroup apps={filteredApps} {...rest} />
}

export {
  FilteredAppCards,
}
