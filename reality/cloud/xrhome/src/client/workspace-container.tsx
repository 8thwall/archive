import React from 'react'
import localForage from 'localforage'
import {Route, useParams, useRouteMatch, Redirect} from 'react-router-dom'
import {join} from 'path'

import {useSelector} from './hooks'
import userActions from './user/user-actions'
import moduleActions from './modules/actions'
import accountActions from './accounts/account-actions'
import AccountContainer from './accounts/account-container'
import {AppContainer} from './apps/app-container'
import useTopBar from './messages/top-bar/use-top-bar'
import {
  useWorkspaceContainerTopBarMessage,
} from './accounts/use-workspace-container-top-bar-message'
import useActions from './common/use-actions'
import useCurrentAccount from './common/use-current-account'
import {AccountPathEnum, getPathForAccount} from './common/paths'
import {usePendoAccountEffect} from './common/use-pendo'
import {isModuleAuthorAllowed} from '../shared/account-module-access'
import CrossAccountContainer from './cross-account-permissions/cross-account-container'
import {useIncompleteAccountPlan} from './hooks/use-incomplete-account-plan'
import {useUserUuid} from './user/use-current-user'
import {
  useMaybeRedirectToAccountOnboarding,
} from './hooks/use-maybe-redirect-to-account-onboarding'
import type {IAccount} from './common/types/models'
import {useFreeCreditAllowance} from './accounts/use-free-credit-allowance'

const ModuleCreatePage = React.lazy(
  () => import('./modules/module-create-page').then(m => ({default: m.ModuleCreatePage}))
)
const NotFoundPage = React.lazy(() => import('./home/not-found-page'))
const NewAppPage = React.lazy(() => import('./apps/new-app-page'))
const DuplicateAppPage = React.lazy(() => import('./apps/duplicate-app-page'))
const ModuleImportPage = React.lazy(() => import('./modules/module-import-page'))
const ModuleContainer = React.lazy(() => import('./modules/module-container'))

const WorkspaceContainer = () => {
  const {appNameOrPage} = useParams<{appNameOrPage: AccountPathEnum & string}>()
  const match = useRouteMatch()
  const pathWithoutAppNameOrPage = match.path.split('/').slice(0, -1).join('/')
  const currentAccount: IAccount | undefined = useCurrentAccount()
  const selectedAccount = useSelector(state => state.accounts.selectedAccount)
  const incompletePlan = useIncompleteAccountPlan()
  const topBarMessage = useWorkspaceContainerTopBarMessage(currentAccount, incompletePlan)
  const {expandSidebarAccount, setShowBadges} = useActions(userActions)
  const {loadAppsForAccount} = useActions(accountActions)
  const {listModulesForAccount} = useActions(moduleActions)
  const userUuid = useUserUuid()
  const isSidebarExpandedForAccount = useSelector(
    state => state.common.sidebarExpandedAccounts[currentAccount?.uuid]
  )
  useMaybeRedirectToAccountOnboarding()

  usePendoAccountEffect(currentAccount)

  React.useEffect(() => {
    if (currentAccount) {
      localForage.setItem('mru-workspace', {user: userUuid, workspace: currentAccount.uuid})
      if (!isSidebarExpandedForAccount) {
        expandSidebarAccount(currentAccount.uuid)
      }
    }
  }, [currentAccount?.uuid])

  useTopBar(() => topBarMessage, [currentAccount, incompletePlan])

  React.useEffect(() => {
    if (currentAccount && selectedAccount !== currentAccount.uuid) {
      loadAppsForAccount(currentAccount.uuid)
      listModulesForAccount(currentAccount.uuid)
    }
  }, [selectedAccount, currentAccount?.uuid])

  useFreeCreditAllowance(currentAccount?.uuid)

  React.useEffect(() => {
    setShowBadges(true)

    return () => {
      setShowBadges(false)
    }
  }, [])

  if (!currentAccount) {
    return <NotFoundPage />
  }

  let routeContent
  if (!appNameOrPage || Object.values(AccountPathEnum).includes(appNameOrPage)) {
    switch (appNameOrPage) {
      case (AccountPathEnum.createProject):
        routeContent = <Route path={pathWithoutAppNameOrPage} component={NewAppPage} />
        break
      case (AccountPathEnum.duplicateProject):
        routeContent = (
          <Route
            path={join(
              pathWithoutAppNameOrPage,
              `${AccountPathEnum.duplicateProject}/:fromAccount/:routeAppName`
            )}
            component={DuplicateAppPage}
          />
        )
        break
      case (AccountPathEnum.importModule):
        routeContent = (
          <Route
            path={join(
              pathWithoutAppNameOrPage,
              `${AccountPathEnum.importModule}/:fromAccount/:moduleName`
            )}
            component={ModuleImportPage}
          />
        )
        break
      case (AccountPathEnum.module):
        if (isModuleAuthorAllowed(currentAccount)) {
          routeContent = (
            <Route
              path={join(
                pathWithoutAppNameOrPage, AccountPathEnum.module, ':moduleName'
              )}
              component={ModuleContainer}
            />
          )
          break
        }
        routeContent = <Redirect to={getPathForAccount(currentAccount)} />
        break
      case (AccountPathEnum.createModule):
        routeContent = <Route path={pathWithoutAppNameOrPage} component={ModuleCreatePage} />
        break
      case (AccountPathEnum.external):
        routeContent = (
          <Route
            path={join(
              pathWithoutAppNameOrPage,
              AccountPathEnum.external,
              ':externalAccount?/:routeAppName?'
            )}
            component={CrossAccountContainer}
          />
        )
        break
      default:
        routeContent = <Route path={pathWithoutAppNameOrPage} component={AccountContainer} />
    }
  } else {
    routeContent = (
      <Route
        path={join(pathWithoutAppNameOrPage, ':routeAppName')}
        component={AppContainer}
      />
    )
  }

  return routeContent
}

export {
  WorkspaceContainer,
}
