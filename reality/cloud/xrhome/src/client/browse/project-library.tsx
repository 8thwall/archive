import React from 'react'

import type {IBrowseAccount, IBrowseApp} from '../common/types/models'
import {sortFeaturedApps} from '../../shared/app-utils'
import ProjectCard from './project-card'
import {PROJECT_LIBRARY_PATH} from '../common/paths'

interface IProjectLibrary {
  className?: string
  account?: IBrowseAccount
  apps: readonly IBrowseApp[]
  pageName: string
  limit?: number
  sortByLatest?: boolean
  projectCardClickEvent?: Function
  showAgency?: boolean
  showIcons?: boolean
  showDescription?: boolean
  showCTAs?: boolean
  showTags?: boolean
  getTagUrl?: (tagName: string) => string
}

const getDefaultTagUrl = (tagName: string): string => {
  if (!tagName) {
    return null
  }

  const tagUrlParam = new URLSearchParams({
    community: 'all',
    tag: tagName,
  })

  return `${PROJECT_LIBRARY_PATH}?${tagUrlParam.toString()}`
}

const ProjectLibrary: React.FC<IProjectLibrary> = ({
  className = undefined,
  account = null,
  apps,
  pageName,
  limit = null,
  sortByLatest = false,
  projectCardClickEvent = null,
  showAgency = false,
  showIcons = true,
  showDescription = false,
  showCTAs = false,
  showTags = false,
  getTagUrl = getDefaultTagUrl,
}) => {
  let sortedApps = sortByLatest ? sortFeaturedApps(apps) : apps
  if (limit) {
    sortedApps = sortedApps.slice(0, limit)
  }

  return (
    <div className={className}>
      {sortedApps.map(a => (
        <ProjectCard
          key={a.uuid}
          account={account}
          app={a}
          pageName={pageName}
          customClickEvent={projectCardClickEvent}
          showAgency={showAgency}
          showIcons={showIcons}
          showDescription={showDescription}
          showCTAs={showCTAs}
          showTags={showTags}
          getTagUrl={getTagUrl}
        />
      ))}
    </div>
  )
}

export default ProjectLibrary
