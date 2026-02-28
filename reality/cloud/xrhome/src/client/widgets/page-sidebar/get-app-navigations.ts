import type {TFunction} from 'i18next'

import type {IAccount, IApp} from '../../common/types/models'
import type {INavigationLink} from '../page-header/use-site-navigations'
import {AppPathEnum, getPathForApp} from '../../common/paths'
import {
  isCloudEditorEnabled, isCloudStudioEnabled, isEditorVisible, isShowcaseSettingsVisible,
} from '../../../shared/account-utils'
import {
  canSelfHostWithModules, is8thWallHosted, isCloudStudioApp, isSelfHosted,
} from '../../../shared/app-utils'
import type {IconStroke} from '../../ui/components/icon'

const projectPage = (account: IAccount, app: IApp, t: TFunction): INavigationLink => ({
  url: getPathForApp(account, app, AppPathEnum.project),
  iconStroke: 'home',
  text: t('site_navigations.link.project_dashboard'),
  a8: 'click;cloud-editor-navigation;project-dashboard-button',
})

const settingsPage = (account: IAccount, app: IApp, t: TFunction): INavigationLink => ({
  url: getPathForApp(account, app, AppPathEnum.settings),
  iconStroke: 'settings',
  text: t('site_navigations.link.settings'),
  a8: 'click;cloud-editor-navigation;project-settings-button',
})

const imageTargetPage = (account: IAccount, app: IApp, t: TFunction): INavigationLink => ({
  url: getPathForApp(account, app, AppPathEnum.targets),
  iconStroke: 'imageTarget',
  text: t('site_navigations.link.image_targets'),
  a8: 'click;cloud-editor-navigation;image-targets-button',
})

const geospatialBrowserPage = (account: IAccount, app: IApp, t: TFunction): INavigationLink => ({
  url: getPathForApp(account, app, AppPathEnum.geospatialBrowser),
  iconStroke: 'mapOutline',
  text: t('site_navigations.link.geospatial_browser'),
  a8: 'click;cloud-editor-navigation;geospatial-browser-button',
})

const showcasePage = (account: IAccount, app: IApp, t: TFunction): INavigationLink => ({
  url: getPathForApp(account, app, AppPathEnum.featureProject),
  // TODO(kim): replace icon
  iconStroke: 'team',
  text: t('site_navigations.link.feature_project'),
  a8: 'click;cloud-editor-navigation;showcase-project-button',
})

const studioPage = (account: IAccount, app: IApp, t: TFunction): INavigationLink => ({
  url: getPathForApp(account, app, AppPathEnum.studio),
  // TODO(kim): replace icon
  iconStroke: 'smiley',
  text: t('site_navigations.link.studio'),
})

const selfHostedModulePage = (account: IAccount, app: IApp, t: TFunction): INavigationLink => ({
  url: getPathForApp(account, app, AppPathEnum.selfHostedModules),
  // TODO(kim): replace Icon
  iconStroke: 'lightning',
  text: t('site_navigations.link.modules'),
})

const webAppPages = (
  account: IAccount, app: IApp, t: TFunction, withGsb: boolean
): INavigationLink[] => [
  imageTargetPage(account, app, t),
  ...withGsb ? [geospatialBrowserPage(account, app, t)] : [],
  showcasePage(account, app, t),
  settingsPage(account, app, t),
].filter(Boolean)

const editorPages = (
  account: IAccount, app: IApp, t: TFunction, isDisabled?: boolean
): INavigationLink[] => [
  {
    url: getPathForApp(account, app, isDisabled ? AppPathEnum.project : AppPathEnum.files),
    iconStroke: 'code',
    text: t('site_navigations.link.editor'),
    isDisabled,
  },
  ...!isDisabled
    ? [{
      url: getPathForApp(account, app, AppPathEnum.history),
      iconStroke: 'codeBranch' as IconStroke,
      text: t('site_navigations.link.source_control'),
    }]
    : [],
]

const getAppNavigations = (account: IAccount, app: IApp, t: TFunction): INavigationLink[] => {
  if (isCloudStudioEnabled(account) && isCloudStudioApp(app)) {
    return [
      projectPage(account, app, t),
      studioPage(account, app, t),
      isShowcaseSettingsVisible && showcasePage(account, app, t),
      settingsPage(account, app, t),
    ]
  } else if (isCloudEditorEnabled(account)) {
    if (!is8thWallHosted(app)) {
      return [
        projectPage(account, app, t),
        canSelfHostWithModules && selfHostedModulePage(account, app, t),
        ...editorPages(account, app, t, true),  // disabled editor
        ...webAppPages(account, app, t, true),
      ]
    } else {
      return [
        projectPage(account, app, t),
        ...editorPages(account, app, t),
        ...webAppPages(account, app, t, true),
      ]
    }
  } else if (isSelfHosted(app)) {
    return [
      projectPage(account, app, t),
      selfHostedModulePage(account, app, t),
      ...editorPages(account, app, t, true),  // disabled editor
      ...webAppPages(account, app, t, true),
    ]
  } else if (isEditorVisible(account)) {
    return [
      projectPage(account, app, t),
      selfHostedModulePage(account, app, t),
      ...editorPages(account, app, t, true),  // disabled editor
      ...webAppPages(account, app, t, false),
    ]
  } else {
    return [
      projectPage(account, app, t),
      selfHostedModulePage(account, app, t),
      ...webAppPages(account, app, t, true),
    ]
  }
}

export {getAppNavigations}
