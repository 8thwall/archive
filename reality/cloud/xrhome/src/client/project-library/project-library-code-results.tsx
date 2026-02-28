import React from 'react'

import ProjectCardCondensed from '../browse/project-card-condensed'
import type {IBrowseAccount, IDiscoveryApp} from '../common/types/models'
import {CodeResultsBlock} from './code-results-block'
import {tinyViewOverride} from '../static/styles/settings'
import {getPublicPathForApp} from '../common/paths'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
    overflowX: 'hidden',
    flexGrow: 1,
  },
  appCard: {
    width: theme.appCardCondensedWidth,
    flexShrink: 0,
    border: theme.appCardBorder,
    borderRadius: theme.codeSearchResultBorderRadius,
    padding: theme.codeSearchResultAppCardPadding,

    [tinyViewOverride]: {
      width: '100%',
    },
  },
  fileMatches: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
}))

// TODO: Pull this out to a shared utility function as it is used in multiple files
const getShortName = (account: IBrowseAccount | null, app: IDiscoveryApp): string => {
  if (account) {
    return account.shortName
  }

  if (!app.Account) {
    throw new Error('Passed IBrowseAccount without account')
  }

  if (typeof app.Account === 'string') {
    throw new Error('Passed normalized IPublicApp without IPublicAccount')
  }

  return app.Account.shortName
}

interface IProjectLibraryCodeResults {
  className?: string
  account?: IBrowseAccount
  apps: readonly IDiscoveryApp[]
  pageName: string
  limit?: number | null  // Limit the number of apps displayed, or show all if null
  darkMode?: boolean
  projectCardClickEvent?: Function
  showAgency?: boolean
  showIcons?: boolean
}

const ProjectLibraryCodeResults: React.FC<IProjectLibraryCodeResults> = ({
  className = undefined, account = null, apps, pageName, limit = null,
  darkMode = false, projectCardClickEvent = null,
  showAgency = false, showIcons = true,
}) => {
  const classes = useStyles()
  const slicedApps = limit !== null ? apps.slice(0, limit) : apps

  const displayResultsForApp = (app: IDiscoveryApp) => (
    <div className={classes.resultsContainer}>
      <div className={classes.appCard}>
        <ProjectCardCondensed
          key={app.uuid}
          account={account}
          app={app}
          pageName={pageName}
          showAgency={showAgency}
          darkMode={darkMode}
          customClickEvent={projectCardClickEvent}
          showIcons={showIcons}
        />
      </div>
      <div className={classes.fileMatches}>
        {app.innerHits.code.hits.map(({relativePath, fileContent, fileContentHighlights}) => (
          <CodeResultsBlock
            key={relativePath}
            fileName={relativePath}
            fileContent={fileContent}
            matches={fileContentHighlights}
            publicPathToFile={
              `${getPublicPathForApp(getShortName(account, app), app)}/code/${relativePath}`
            }
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className={className}>
      {slicedApps.map(a => displayResultsForApp(a))}
    </div>
  )
}

export {
  ProjectLibraryCodeResults,
}
