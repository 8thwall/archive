import React from 'react'
import {Route, useLocation, useRouteMatch} from 'react-router-dom'

import {withAppsLoaded} from '../common/with-state-loaded'
import ContainerSidebar from '../widgets/container-sidebar'
import ContainerSwitch from '../widgets/container-switch'
import NotFoundPage from '../home/not-found-page'
import {isEditorEnabled, isUnityAccount} from '../../shared/account-utils'
import {isDeleted, is8thWallHosted} from '../../shared/app-utils'
import getPagesForApp from './app-pages'
import type {IAccount, IApp, IUserAccount} from '../common/types/models'
import {useCurrentRouteApp} from '../common/use-current-app'
import useCurrentAccount from '../common/use-current-account'
import {useScopedGit} from '../git/hooks/use-current-git'
import useActions from '../common/use-actions'
import {actions as gitActions} from '../git/git-actions'
import appsActions from './apps-actions'
import {useSelector} from '../hooks'
import {useCurrentMemberAccount} from '../common/use-current-member-account'
import {makeProjectSpecifier} from '../../shared/project-specifier'
import {useDependencyContext} from '../editor/dependency-context'
import {InAppHelpCenter} from '../editor/product-tour/in-app-help-center'
import {useDismissibleModalContext} from '../editor/dismissible-modal-context'
import {useChangeEffect} from '../hooks/use-change-effect'
import backendServicesActions from '../editor/backend-services-actions'
import {useCurrentUser} from '../user/use-current-user'
import {AppContainerContextProvider} from '../common/app-container-context'
import {useLogActions} from '../editor/logs/use-log-actions'
import {usePrivateNavigationEnabled} from '../brand8/brand8-gating'

type GetHasExpectedRepoArgs = {
  repoName: string
  memberAccount: IAccount
  account: IAccount
  app: IApp
  userAccount: IUserAccount
}

const getHasExpectedRepo = ({
  repoName, memberAccount, account, app, userAccount,
}: GetHasExpectedRepoArgs): boolean => {
  if (!repoName) {
    return false
  }
  const externalSuffix = memberAccount.uuid !== account.uuid
    ? `_${userAccount?.handle}-${memberAccount.shortName}`
    : ''
  const expectedRepoName = `${makeProjectSpecifier(account, app)}${externalSuffix}`
  return repoName === expectedRepoName
}

interface IInnerAppContainer {
  app: IApp
  account: IAccount
}

const InnerAppContainer: React.FC<IInnerAppContainer> = ({app, account}) => {
  const match = useRouteMatch()
  const memberAccount = useCurrentMemberAccount()
  const user = useCurrentUser()
  const userAccount = memberAccount.Users && memberAccount.Users.find(u => u.UserUuid === user.uuid)
  const {updateAppAccessDate} = useActions(appsActions)
  const brand8NavigationEnabled = usePrivateNavigationEnabled()

  const pages = getPagesForApp(app, account)

  const {dismissModals} = useDismissibleModalContext()

  useChangeEffect(([prevApp]) => {
    if (prevApp?.uuid !== app.uuid) {
      updateAppAccessDate(app.uuid)
    }
  }, [app, updateAppAccessDate] as const)

  React.useEffect(() => {
    dismissModals()
  }, [useLocation()])

  // TODO(pawel) After migration period for not calling bootstrapRepo() on self-hosted apps,
  // make the git-controller return 400 when trying to get repo info for a self hosted app.
  const editorEnabled = isEditorEnabled(account) && is8thWallHosted(app)
  const git = useScopedGit(app.repoId)

  const hasExpectedRepo = getHasExpectedRepo({
    repoName: git?.repo?.repositoryName,
    memberAccount,
    account,
    app,
    userAccount,
  })

  const {requestAccount} = useActions(backendServicesActions)
  const {bootstrapAppRepo, populateDeployments} = useActions(gitActions)

  const dependencyContext = useDependencyContext()
  const repoIdToGit = useSelector(s => s.git.byRepoId)

  useLogActions(app, editorEnabled)

  useChangeEffect(([prevDependencyContext]) => {
    if (
      repoIdToGit[app.repoId]?.progress.load !== 'DONE' ||
      !prevDependencyContext ||
      !dependencyContext
    ) {
      return
    }

    const previouslyHadBackend = Object.values(prevDependencyContext.dependenciesByPath)
      .some(dep => dep.backendTemplates?.length)

    const hasBackend = Object.values(dependencyContext.dependenciesByPath)
      .some(dep => dep.backendTemplates?.length)

    if (!previouslyHadBackend && hasBackend) {
      requestAccount(app.uuid)
    }
  }, [dependencyContext])

  React.useEffect(() => {
    if (!editorEnabled) {
      return
    }

    if (!hasExpectedRepo) {
      // If it's convenient, preload git repo info. The repo must exist both on the server and in
      // the user's indexed db. Otherwise, this determines what needs to be done so that the repo
      // can be created by the user, or cloned to the user's indexed db when needed by the ui.
      // NOTE(pawel) This clones the repo if it exists, which may not be necessary if we are not
      // the active browser or if the user will not use the editor/history view.
      // TODO(pawel) Optimize so that cloning repo happens when editor or history view is opened.
      if (app.repoId) {
        populateDeployments(app.uuid, app.repoId)
        bootstrapAppRepo(app.uuid)
      }
    }
  }, [
    app.uuid, editorEnabled, hasExpectedRepo, bootstrapAppRepo,
  ])

  return (
    <div className='with-sidebar'>
      {!brand8NavigationEnabled &&
        <ContainerSidebar
          pages={pages}
          size='thin'
          iconSize='large'
          showText={false}
        >
          <InAppHelpCenter />
        </ContainerSidebar>
      }
      <ContainerSwitch pages={pages}>
        <Route path={match.path}>
          <NotFoundPage />
        </Route>
      </ContainerSwitch>
    </div>
  )
}

const AppContainer = withAppsLoaded(() => {
  const app = useCurrentRouteApp()
  const account = useCurrentAccount()

  if (!app || isDeleted(app) || !account || isUnityAccount(account)) {
    return <NotFoundPage />
  }

  return (
    <AppContainerContextProvider app={app}>
      <InnerAppContainer key={app.uuid} app={app} account={account} />
    </AppContainerContextProvider>
  )
})

export {
  AppContainer,
}
