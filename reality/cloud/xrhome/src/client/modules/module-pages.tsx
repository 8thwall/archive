import React from 'react'

import {ModulePathEnum} from '../common/paths'
import type {IAccount, IModule} from '../common/types/models'
import type {IContainerPage} from '../widgets/container-sidebar'
import {FILE_NAME_WITH_PATH_ALLOWED_CHARS} from '../../shared/app-constants'

const ModuleFileEditorPage = React.lazy(() => import('./module-file-editor-page'))
const ModuleSettingsPage = React.lazy(() => import('./module-settings-page'))
const ModuleHistoryPage = React.lazy(() => import('./module-history-page'))

interface IModulePage extends IContainerPage{
  path: ModulePathEnum | ''
  a8?: string
  availableOn?: (account?: IAccount, module?: IModule) => boolean
}

const settingsPage: IModulePage = {
  name: 'Settings',
  icon: 'setting',
  path: ModulePathEnum.settings,
  routeComponent: ModuleSettingsPage,
  a8: 'click;cloud-editor-navigation;module-settings-button',
}

const editorPage: IModulePage = {
  name: 'Editor',
  icon: 'code',
  path: ModulePathEnum.files,
  routePath: `${ModulePathEnum.files}/:filename(${FILE_NAME_WITH_PATH_ALLOWED_CHARS}{0,})?`,
  routeComponent: ModuleFileEditorPage,
  a8: 'click;cloud-editor-navigation;cloud-editor-button',
}

const historyPage: IModulePage = {
  name: 'History',
  icon: 'code branch',
  path: ModulePathEnum.history,
  routeComponent: ModuleHistoryPage,
}

const getPagesForModule = (): IModulePage[] => [editorPage, historyPage, settingsPage]

export {
  getPagesForModule as default,
  IModulePage,
}
