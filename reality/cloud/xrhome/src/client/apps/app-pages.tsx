import React from 'react'
import {Redirect} from 'react-router-dom'

import {
  isEditorVisible,
  isCloudEditorEnabled,
  hasPendingCancellation,
  isCloudStudioEnabled,
  isWebAccount,
} from '../../shared/account-utils'
import type {IAccount, IApp} from '../common/types/models'
import type {IContainerPage} from '../widgets/container-sidebar'
import {AppPathEnum} from '../common/paths'
import {FILE_NAME_WITH_PATH_ALLOWED_CHARS} from '../../shared/app-constants'
import FeaturedIcon from './widgets/featured-icon'
import {isShowcaseSettingsVisible} from '../../shared/account-utils'
import {
  is8thWallHosted, canSelfHostWithModules, isCloudStudioApp, isSelfHosted,
} from '../../shared/app-utils'
import ProjectModulesIcon from './widgets/project-modules-icon'
import {StudioIcon} from './widgets/studio-icon'
import {useAppPathsContext} from '../common/app-container-context'

const ProjectPage = React.lazy(() => import('./project-page'))
const ShowcaseProjectPage = React.lazy(() => import('./showcase-project-page'))
const GeospatialBrowserPage = React.lazy(() => import('./geospatial-browser-page'))
const ImageTargetPage = React.lazy(() => import('./imagetarget-page'))
const CameraContainer = React.lazy(() => import('./camera-container'))
const PurchaseLicenseContainer = React.lazy(() => import('./purchase-license-container'))
const WebAppSettings = React.lazy(() => import('./web-app-settings'))
const EditorUpsell = React.lazy(() => import('./editor-upsell'))
const FileEditorView = React.lazy(() => import('./file-editor-view'))
const StudioRepoView = React.lazy(() => import('./studio-repo-view'))
const SelfHostedModulePage = React.lazy(() => import('./self-hosted-module-page'))
const SimulatorPage = React.lazy(() => import('./simulator-page'))
const ScenePage = React.lazy(() => import('./scene-page'))
const CodeEditorPage = React.lazy(() => import('./code-editor-page'))

export interface IAppPage extends IContainerPage{
  path: AppPathEnum | ''
  a8?: string
  shownOn?: (account?: IAccount, app?: IApp) => boolean
  disabled?: boolean
  disabledMessage?: string  // required if disabled
}

// TODO(wayne): Add an error message when redirecting this
const RedirectToProjectComponent = () => {
  const {getPathForApp} = useAppPathsContext()
  return <Redirect to={getPathForApp()} />
}

const projectPage: IAppPage = {
  name: 'app_pages.responsive_sidebar.project',
  icon: 'cube',
  path: AppPathEnum.project,
  routeComponent: ProjectPage,
  a8: 'click;cloud-editor-navigation;project-dashboard-button',
}

const showcaseProjectPage: IAppPage = {
  name: 'app_pages.responsive_sidebar.feature_project',
  iconComponent: FeaturedIcon,
  path: AppPathEnum.featureProject,
  routeComponent: ShowcaseProjectPage,
  a8: 'click;cloud-editor-navigation;showcase-project-button',
  shownOn: isShowcaseSettingsVisible,
}

const imageTargetPage: IAppPage = {
  name: 'app_pages.responsive_sidebar.image_targets',
  icon: 'target' as const,
  path: AppPathEnum.targets,
  routePath: 'targets/:routeTarget?',
  routeComponent: ImageTargetPage,
  a8: 'click;cloud-editor-navigation;image-targets-button',
}

const geospatialBrowserPage: IAppPage = {
  name: 'app_pages.responsive_sidebar.geospatial_browser',
  icon: 'map',
  path: AppPathEnum.geospatialBrowser,
  // Some examples of these pages
  // eslint-disable max-len
  // landing map page /geospatial-browser
  // lat lng page /geospatial-browser/-123.1923,34.2131
  // lat lng zoom /geospatial-browser/-123.1923,34.2131,14
  // specific node page /geospatial-browser/-123.1923,34.2131,14,1B32A5A508B74CB092F46F459ECEDDCB
  // specific node attached to a POI /geospatial-browser/51.509755999999996,-0.119073,17,F906FC5D528E4251ABC131EAE58B3AF2,0a4eb655659f45b98f86462d2191a472.16
  // create a new wayspot dialog /geospatial-browser/123.45,9.22,13,...,.../new-wayspot
  // eslint-enable max-len
  routePath: 'geospatial-browser/:browseInfo?',
  routeComponent: GeospatialBrowserPage,
  a8: 'click;cloud-editor-navigation;geospatial-browser-button',
}

const gsbUpsell = {...geospatialBrowserPage, routeComponent: EditorUpsell}

const settingsPage: IAppPage = {
  name: 'app_pages.responsive_sidebar.settings',
  icon: 'setting',
  path: AppPathEnum.settings,
  routeComponent: WebAppSettings,
  a8: 'click;cloud-editor-navigation;project-settings-button',
}

const purchaseLicensePage: IAppPage = {
  name: 'app_pages.responsive_sidebar.purchase_license',
  icon: 'plus',
  path: AppPathEnum.purchase,
  hideInSidebar: true,
  routeComponent: PurchaseLicenseContainer,
}

const selfHostedModulePage: IAppPage = {
  name: 'app_pages.responsive_sidebar.modules',
  iconComponent: ProjectModulesIcon,
  path: AppPathEnum.selfHostedModules,
  routeComponent: SelfHostedModulePage,
  shownOn: (_, app) => canSelfHostWithModules(app),
}

const cameraPages: IAppPage[] = [
  projectPage,
  {
    name: 'Edit',
    icon: 'edit',
    path: AppPathEnum.edit,
    routeComponent: CameraContainer,
  },
  settingsPage,
]

const codeBranchPage: IAppPage = {
  name: 'app_pages.responsive_sidebar.source_control',
  icon: 'code branch',
  path: AppPathEnum.history,
  routeComponent: StudioRepoView,
  a8: 'click;cloud-editor-navigation;project-history-button',
}

const simulatorPage: IAppPage = {
  name: 'simulator_page.page_title',
  path: AppPathEnum.simulator,
  routeComponent: SimulatorPage,
  hideInSidebar: true,
  hideSidebar: true,
}

const studioPage: IAppPage = {
  name: 'studio_page.page_title',
  iconComponent: StudioIcon,
  path: AppPathEnum.studio,
  routeComponent: ScenePage,
  hideSidebar: true,
}

const editorPages: IAppPage[] = [
  {
    name: 'app_pages.responsive_sidebar.editor',
    icon: 'code',
    path: AppPathEnum.files,
    alternatePaths: [AppPathEnum.modules],
    routePath: `\
:editorPrefix(${AppPathEnum.files}|${AppPathEnum.modules})/\
:editorSuffix(${FILE_NAME_WITH_PATH_ALLOWED_CHARS}{0,})?`,
    routeComponent: FileEditorView,
    a8: 'click;cloud-editor-navigation;cloud-editor-button',
  },
  codeBranchPage,
  simulatorPage,
]

const codeEditorPage: IAppPage = {
  name: 'code_editor_page.page_title',
  path: AppPathEnum.codeEditor,
  routeComponent: CodeEditorPage,
  hideInSidebar: true,
  hideSidebar: true,
}

const studioPages: IAppPage[] = [
  studioPage,
  simulatorPage,
  codeEditorPage,
]

const editorUpsellPages = editorPages.map(p => ({...p, routeComponent: EditorUpsell}))

const editorDisabledPages: IAppPage[] = editorPages.map(p => ({
  ...p,
  disabled: true,
  disabledMessage: 'app_pages.responsive_sidebar.for_cloud_hosting_only',
  routeComponent: RedirectToProjectComponent,
}))

const webAppPages = (withGsb: boolean): IAppPage[] => (
  [
    imageTargetPage,
    withGsb ? geospatialBrowserPage : gsbUpsell,
    showcaseProjectPage,
    settingsPage,
  ].filter(Boolean)
)

const webAppWithEditorPages: IAppPage[] = [
  projectPage,
  ...editorPages,
  ...webAppPages(true),
]

const webAppWithStudioPages: IAppPage[] = [
  projectPage,
  ...studioPages,
  showcaseProjectPage,
  settingsPage,
]

const webAppWithEditorUpsellPages: IAppPage[] = [
  projectPage,
  selfHostedModulePage,
  ...editorUpsellPages,
  ...webAppPages(false),
]

const webAppWithEditorDisabledPages: IAppPage[] = [
  projectPage,
  selfHostedModulePage,
  ...editorDisabledPages,
  ...webAppPages(true),
]

const webAppWithoutEditorPages: IAppPage[] = [
  projectPage,
  selfHostedModulePage,
  ...webAppPages(true),
]

const filterAppPages = (pages: any, account: IAccount, app: IApp) => pages.filter(
  p => p.shownOn === undefined || p.shownOn(account, app)
)

const getPagesForApp = (app: IApp, account: IAccount): IAppPage[] => {
  if (app.isCamera) {
    return cameraPages
  }

  let res = []

  if (isCloudStudioEnabled(account) && isCloudStudioApp(app)) {
    res = webAppWithStudioPages
  } else if (isCloudEditorEnabled(account)) {
    if (!is8thWallHosted(app)) {
      res = webAppWithEditorDisabledPages
    } else {
      res = webAppWithEditorPages
    }
  } else if (isSelfHosted(app)) {
    res = webAppWithEditorDisabledPages
  } else if (isEditorVisible(account)) {
    res = webAppWithEditorUpsellPages
  } else {
    res = webAppWithoutEditorPages
  }

  if (isWebAccount(account)) {
    res = [...res, purchaseLicensePage]
  }

  return filterAppPages(res, account, app)
}

export default getPagesForApp
