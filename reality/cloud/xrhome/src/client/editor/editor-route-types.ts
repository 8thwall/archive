import type {AppPathEnum} from '../common/paths'

type AppEditorParams = {
  account: string
  routeAppName: string
  editorPrefix: AppPathEnum.modules | AppPathEnum.files
  editorSuffix: string
}

type ModuleEditorParams = {
  account: string
  moduleName: string
  filename: string
}

type EditorParams = AppEditorParams | ModuleEditorParams

const isAppEditorParams = (params: EditorParams): params is AppEditorParams => (
  'routeAppName' in params
)

const isModuleEditorParams = (params: EditorParams): params is ModuleEditorParams => (
  'moduleName' in params
)

export type {
  EditorParams,
  AppEditorParams,
  ModuleEditorParams,
}

export {
  isAppEditorParams,
  isModuleEditorParams,
}
