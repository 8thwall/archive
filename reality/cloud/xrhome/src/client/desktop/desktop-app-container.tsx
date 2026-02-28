import React from 'react'

import {Redirect} from 'react-router-dom'

import {useSelector} from '../hooks'
import {getStudioPath, HOME_PATH} from './desktop-paths'
import {useChangeEffect} from '../hooks/use-change-effect'
import accountActions from '../accounts/account-actions'
import useActions from '../common/use-actions'
import {EnclosedAccountProvider} from '../accounts/enclosed-account-context'
import {Loader} from '../ui/components/loader'
import {actions as gitActions} from '../git/git-actions'
import {AppContainerContextProvider} from '../common/app-container-context'
import {withAccountsLoaded} from '../common/with-state-loaded'
import {useLogActions} from '../editor/logs/use-log-actions'
import type {IApp} from '../common/types/models'
import {getDisplayNameForApp, isCloudStudioApp} from '../../shared/app-utils'
import appsActions from '../apps/apps-actions'
import {usePendoAccountEffect} from '../common/use-pendo'
import {useFreeCreditAllowance} from '../accounts/use-free-credit-allowance'

interface IInnerDesktopAppContainer {
  app: IApp
  children: React.ReactElement
}

interface IDesktopAppContainer {
  appKey: string
  setWindowTitle: (name: string | undefined) => void
  children: React.ReactElement
}

const InnerDesktopAppContainer: React.FC<IInnerDesktopAppContainer> = ({
  app, children,
}) => {
  useLogActions(app, true)
  return children
}

const DesktopAppContainer = withAccountsLoaded(({
  appKey, setWindowTitle, children,
}: IDesktopAppContainer) => {
  const {loadAppsForAccount} = useActions(accountActions)
  const {bootstrapAppRepo} = useActions(gitActions)
  const account = useSelector(s => s.accounts.allAccounts.find(a => a.Apps.some(
    app => app.appKey === appKey && app.status !== 'DELETED'
  )))
  const selectedAccount = useSelector(s => s.accounts.selectedAccount)
  const app = useSelector(s => s.apps.find(a => a.appKey === appKey))
  const {updateAppAccessDate} = useActions(appsActions)
  usePendoAccountEffect(account)

  useChangeEffect(([prevApp]) => {
    if (app?.uuid && prevApp?.uuid !== app.uuid) {
      updateAppAccessDate(app.uuid)
    }
  }, [app, updateAppAccessDate] as const)

  React.useEffect(() => {
    if (account?.uuid && account.uuid !== selectedAccount) {
      loadAppsForAccount(account.uuid)
    }
  }, [account?.uuid, selectedAccount])

  useChangeEffect(([prevAppUuid]) => {
    if (app?.uuid && app.uuid !== prevAppUuid) {
      bootstrapAppRepo(app.uuid, {ensureLocalClone: true})
    }
  }, [app?.uuid])

  React.useEffect(() => {
    if (app?.appName) {
      setWindowTitle(getDisplayNameForApp(app))
    }
    return () => {
      setWindowTitle(undefined)
    }
  }, [app, setWindowTitle])

  useFreeCreditAllowance(account?.uuid)

  const appPathsContext = React.useMemo(() => ({
    getPathForApp: () => getStudioPath(appKey),
    getPathForLicensePurchase: () => getStudioPath(appKey),
    getPathPrefixForLicensePurchase: () => getStudioPath(appKey),
    getPathForFile: () => getStudioPath(appKey),
    getPathForDependency: () => getStudioPath(appKey),
    getGeospatialBrowserPath: () => getStudioPath(appKey),
    getFileRoute: () => getStudioPath(appKey),
    getStudioRoute: () => getStudioPath(appKey),
    getExitRepoPath: () => HOME_PATH,
  }), [appKey])

  if (!account) {
    return <Redirect to={HOME_PATH} />
  }

  if (!app) {
    return <Loader />
  }

  if (!isCloudStudioApp(app)) {
    return <Redirect to={HOME_PATH} />
  }

  return (
    <AppContainerContextProvider
      app={app}
      appPathsContextValue={appPathsContext}
    >
      <EnclosedAccountProvider value={account}>
        <InnerDesktopAppContainer app={app}>
          {children}
        </InnerDesktopAppContainer>
      </EnclosedAccountProvider>
    </AppContainerContextProvider>
  )
})

export {
  DesktopAppContainer,
}
