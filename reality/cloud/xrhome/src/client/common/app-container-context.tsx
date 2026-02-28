import React from 'react'
import {useRouteMatch} from 'react-router-dom'

import {useSelector} from '../hooks'
import {
  AccountRootSpecifier,
  AppOrName,
  AppPathEnum,
  getGeospatialBrowserPath,
  getPathForApp,
  getPathForDependency,
  getPathForFile,
  getPathForLicensePurchase,
  getPathPrefixForLicensePurchase,
  getRouteExternalAccount,
} from './paths'
import {GetEditorFileRoute, getEditorFileRoute} from '../editor/editor-route'
import {useCurrentMemberAccount} from './use-current-member-account'
import useCurrentApp from './use-current-app'
import {getStudioRoute} from '../studio/studio-route'
import {StudioComponentsContextProvider} from '../studio/studio-components-context'
import {isCloudStudioApp} from '../../shared/app-utils'
import {SaveSemaphoreContextProvider} from '../editor/hooks/save-challenge-semaphore'
import {EnclosedAppProvider} from '../apps/enclosed-app-context'
import {AppPreviewWindowContextProvider} from './app-preview-window-context'
import {DismissibleModalContextProvider} from '../editor/dismissible-modal-context'
import {RepoIdProvider} from '../git/repo-id-context'
import {DependencyContextProvider} from '../editor/dependency-context'
import {MultiRepoContextProvider} from '../editor/multi-repo-context'
import {TextEditorContextProvider} from '../editor/texteditor/texteditor-context'
import type {IApp} from './types/models'

const getFileRoute: GetEditorFileRoute = (account, app, params) => {
  const {hostingType} = app
  return hostingType === 'CLOUD_STUDIO'
    ? getStudioRoute(account, app, params, AppPathEnum.studio)
    : getEditorFileRoute(account, app, params)
}

const APP_PATH_FUNCS = {
  getPathForApp,
  getPathForLicensePurchase,
  getPathPrefixForLicensePurchase,
  getPathForFile,
  getPathForDependency,
  getGeospatialBrowserPath,
  getFileRoute,
  getStudioRoute,
  getExitRepoPath: getPathForApp,
} as const

type PathFn<T extends Array<any>> = (...args: T) => string
type RawAppPathFn = (
  root: AccountRootSpecifier, app: AppOrName, ...args: any
) => string
type RawAppPathFns = Record<string, RawAppPathFn>
type WrappedParams<T> =
  T extends (root: AccountRootSpecifier, app: AppOrName, ...args: infer P) => any ? P : never
type WrappedAppPathFn<T extends RawAppPathFn> = PathFn<WrappedParams<T>>
type WrappedAppPathFns<T extends RawAppPathFns> = {
  [K in keyof T]: WrappedAppPathFn<T[K]>
}
type AppPathsContextValue = WrappedAppPathFns<typeof APP_PATH_FUNCS>
type IAppContainerContextProvider = React.PropsWithChildren<{
  app: IApp
  appPathsContextValue?: AppPathsContextValue
}>

const wrapFn = <T extends RawAppPathFn>(
  root: AccountRootSpecifier,
  app: AppOrName,
  func: T
): WrappedAppPathFn<T> => (...args: any) => func(root, app, ...args)

const AppPathsContext = React.createContext<AppPathsContextValue| null>(null)

const DefaultAppPathsContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const match = useRouteMatch()
  const member = useCurrentMemberAccount()
  const external = useSelector(state => getRouteExternalAccount(state, match))
  const app = useCurrentApp()

  const value = React.useMemo(() => {
    const rootSpecifier: AccountRootSpecifier = {member}
    if (external) {
      rootSpecifier.external = external
    }

    return Object.keys(APP_PATH_FUNCS).reduce((acc, key) => {
      acc[key] = wrapFn(rootSpecifier, app, APP_PATH_FUNCS[key])
      return acc
    }, {} as WrappedAppPathFns<typeof APP_PATH_FUNCS>)
  }, [member, app, external])

  return (
    <AppPathsContext.Provider value={value}>
      {children}
    </AppPathsContext.Provider>
  )
}

const useAppPathsContext = () => React.useContext(AppPathsContext)

const AppContainerContextProvider: React.FC<IAppContainerContextProvider> = ({
  app, appPathsContextValue, children,
}) => {
  const innerContextProviders = (
    <AppPreviewWindowContextProvider>
      <DismissibleModalContextProvider>
        {app.repoId
          ? (
            <RepoIdProvider value={app.repoId}>
              <DependencyContextProvider>
                <MultiRepoContextProvider>
                  <TextEditorContextProvider>
                    {isCloudStudioApp(app)
                      ? (
                        <StudioComponentsContextProvider>
                          {children}
                        </StudioComponentsContextProvider>
                      )
                      : (
                        children
                      )}
                  </TextEditorContextProvider>
                </MultiRepoContextProvider>
              </DependencyContextProvider>
            </RepoIdProvider>
          )
          : (
            children
          )}
      </DismissibleModalContextProvider>
    </AppPreviewWindowContextProvider>
  )

  return (
    <SaveSemaphoreContextProvider>
      <EnclosedAppProvider value={app}>
        {appPathsContextValue
          ? (
            <AppPathsContext.Provider value={appPathsContextValue}>
              {innerContextProviders}
            </AppPathsContext.Provider>
          )
          : (
            <DefaultAppPathsContextProvider>
              {innerContextProviders}
            </DefaultAppPathsContextProvider>
          )}
      </EnclosedAppProvider>
    </SaveSemaphoreContextProvider>
  )
}

export {
  AppContainerContextProvider,
  DefaultAppPathsContextProvider,
  AppPathsContext,
  useAppPathsContext,
}

export type {
  WrappedAppPathFn,
}
