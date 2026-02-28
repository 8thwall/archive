import React from 'react'

import type {IPublicAccount, IBrowseModule} from '../common/types/models'
import {sortFeaturedApps} from '../../shared/app-utils'
import ModuleCard from './module-card'

interface IModuleLibrary {
  className?: string
  account?: IPublicAccount
  modules: readonly IBrowseModule[]
  pageName: string
  limit?: number
  sortByLatest?: boolean
  showAgency?: boolean
}

const ModuleLibrary: React.FC<IModuleLibrary> = ({
  className = undefined, account = null, modules, pageName, limit = null,
  sortByLatest = false, showAgency = false,
}) => {
  // TODO(Dale) switch to sortFeaturedModules when we get publishedAt on Module
  let sortedModules = sortByLatest ? sortFeaturedApps(modules) : modules
  if (limit) {
    sortedModules = sortedModules.slice(0, limit)
  }

  return (
    <div className={className}>
      {sortedModules.map(m => (
        <ModuleCard
          key={m.uuid}
          account={account}
          module={m}
          pageName={pageName}
          showAgency={showAgency}
        />
      ))}
    </div>
  )
}

export default ModuleLibrary
