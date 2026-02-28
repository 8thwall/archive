import React from 'react'

import {hasUserSession} from '../../user/has-user-session'
import WorkspaceSelectPageHeader from './workspace-select-page-header'
import LoggedInPageHeaderOld from './logged-in-page-header-old'
import {PublicPageHeader} from './public-page-header'
import {PageHeaderThemeProvider, type PageHeaderThemes} from './page-header-theme-provider'
import LoggedOutPageHeaderOld from './logged-out-page-header-old'
import {usePrivateNavigationEnabled, usePublicNavigationEnabled} from '../../brand8/brand8-gating'
import {useSelector} from '../../hooks'

type PageHeaderVariant = 'default' | 'workspace'

interface IPageHeader {
  theme?: PageHeaderThemes
  variant?: PageHeaderVariant
}

const PageHeaderOld: React.FC<{theme?: PageHeaderThemes}> = ({theme}) => {
  const isLoggedIn = useSelector(hasUserSession)
  return (
    <PageHeaderThemeProvider mode={theme}>
      {isLoggedIn ? <LoggedInPageHeaderOld /> : <LoggedOutPageHeaderOld />}
    </PageHeaderThemeProvider>
  )
}

const PageHeader: React.FunctionComponent<IPageHeader> = ({
  theme, variant,
}) => {
  const isWorkspaceNavigationEnabled = usePrivateNavigationEnabled()
  const isPublicNavigationEnabled = usePublicNavigationEnabled()
  switch (variant) {
    case 'workspace':
      if (isWorkspaceNavigationEnabled) {
        return <WorkspaceSelectPageHeader />
      } else {
        return <PageHeaderOld theme={theme} />
      }
    default:
      if (isPublicNavigationEnabled) {
        return <PublicPageHeader />
      } else {
        return <PageHeaderOld theme={theme} />
      }
  }
}

export {
  PageHeader,
}

export type {
  PageHeaderVariant,
}
