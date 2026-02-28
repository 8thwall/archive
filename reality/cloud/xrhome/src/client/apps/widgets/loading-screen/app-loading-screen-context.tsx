import React from 'react'
import {useTranslation} from 'react-i18next'

import {useSelector} from '../../../hooks'
import type {IG8GitProgressLoad} from '../../../git/g8-dto'
import {useAbandonableEffect} from '../../../hooks/abandonable-effect'
import {MonacoSetup} from '../../../editor/texteditor/monaco-setup'
import useActions from '../../../common/use-actions'
import appsActions, {type NewAppData} from '../../apps-actions'
import type {IApp} from '../../../common/types/models'

type LazyComponentWithPreload = React.LazyExoticComponent<React.ComponentType<any>> & {
  preload: () => Promise<any>
}

const ScenePageImport = () => import('../../scene-page')
const ScenePage = React.lazy(ScenePageImport) as unknown as LazyComponentWithPreload
ScenePage.preload = ScenePageImport

const NAMESPACES_TO_PRELOAD = [
  'cloud-studio-pages', 'cloud-editor-pages', 'common', 'geospatial-browser',
]

interface IAppLoadingScreenContext {
  appUuid: string
  loadCoverImage: string
  isAppLoading: boolean
  clearLoadingApp: () => void
  startAppLoading: (loadingCoverImage: string, appToDuplicate: NewAppData) => Promise<IApp>
}

const AppLoadingScreenContext = React.createContext<IAppLoadingScreenContext | null>(null)

interface IAppLoadingScreenContextProvider {
  children: React.ReactNode
}

const AppLoadingScreenContextProvider = ({children}: IAppLoadingScreenContextProvider) => {
  const {i18n} = useTranslation([])
  const {newApp} = useActions(appsActions)
  const [appUuid, setAppUuid] = React.useState<string>(null)
  const [loadCoverImage, setLoadCoverImage] = React.useState<string>(null)
  const isAppLoading = !!appUuid && !!loadCoverImage

  const startAppLoading = async (loadingCoverImage: string, appToDuplicate: NewAppData) => {
    setLoadCoverImage(loadingCoverImage)
    const app = await newApp(appToDuplicate)
    setAppUuid(app.uuid)
    return app
  }

  const value = {
    appUuid,
    loadCoverImage,
    isAppLoading,
    clearLoadingApp: () => {
      setAppUuid(null)
      setLoadCoverImage(null)
    },
    startAppLoading,
  }

  useAbandonableEffect(async () => {
    if (isAppLoading) {
      await i18n.loadNamespaces(NAMESPACES_TO_PRELOAD)
      await ScenePage.preload()
    }
  }, [isAppLoading])

  return (
    <AppLoadingScreenContext.Provider value={value}>
      {isAppLoading && Build8.PLATFORM_TARGET !== 'desktop' && <MonacoSetup />}
      {children}
    </AppLoadingScreenContext.Provider>
  )
}

const useAppLoadingScreenContext = () => {
  const context = React.useContext(AppLoadingScreenContext)
  if (!context) {
    throw new Error(
      'useAppLoadingScreenContext must be used within an AppLoadingScreenContextProvider'
    )
  }
  return context
}

const useLoadingApp = () => {
  const {appUuid} = useAppLoadingScreenContext()
  const app = useSelector(s => s.apps.find(a => a.uuid === appUuid))
  return app
}

const useAppLoadingProgress = (): IG8GitProgressLoad => {
  const app = useLoadingApp()
  return useSelector(s => (app ? s.git.byRepoId[app?.repoId]?.progress.load : 'UNSPECIFIED'))
}

const useAppLoadingCoverImage = () => {
  const {loadCoverImage} = useAppLoadingScreenContext()
  return loadCoverImage
}

export {
  AppLoadingScreenContext,
  AppLoadingScreenContextProvider,
  useAppLoadingScreenContext,
  useLoadingApp,
  useAppLoadingProgress,
  useAppLoadingCoverImage,
}
