import type {
  ModuleDependency, ModuleDependencyConfig, ModuleConfigValue,
} from '../../../shared/module/module-dependency'

type ConfigState = {
  onTopOf: string
  expectedNewFile?: string
  config: Record<string, any>
  needsSave: boolean
}

const fileChangeAction = (content: string) => ({type: 'FILE_CHANGE'as const, content})
const saveStartAction = (content: string) => ({type: 'SAVE_START'as const, content})
const resetFieldAction = (fieldName: string) => ({type: 'RESET_FIELD' as const, fieldName})
const editFieldAction = (fieldName: string, value: ModuleConfigValue) => ({
  type: 'EDIT_FIELD' as const,
  fieldName,
  value,
})

type FileChangeAction = ReturnType<typeof fileChangeAction>
type SaveStartAction = ReturnType<typeof saveStartAction>
type EditFieldAction = ReturnType<typeof editFieldAction>
type ResetFieldAction = ReturnType<typeof resetFieldAction>

type ConfigAction = FileChangeAction |SaveStartAction | ResetFieldAction | EditFieldAction

const safeParseConfig = (content: string): ModuleDependencyConfig => {
  try {
    const dependency: ModuleDependency = JSON.parse(content)
    if (dependency.config && typeof dependency.config === 'object') {
      return dependency.config
    }
  } catch (err) {
    // Ignore
  }
  return {}
}

const configReducer = (state: ConfigState, action: ConfigAction): ConfigState => {
  switch (action.type) {
    case 'FILE_CHANGE': {
      if (state.expectedNewFile === action.content) {
        return {...state, onTopOf: action.content, expectedNewFile: undefined}
      } else {
        return {
          ...state,
          onTopOf: action.content,
          config: safeParseConfig(action.content),
          needsSave: false,
        }
      }
    }
    case 'SAVE_START':
      return {...state, expectedNewFile: action.content, needsSave: false}
    case 'RESET_FIELD': {
      const newConfig = {...state.config}
      delete newConfig[action.fieldName]
      return {...state, config: newConfig, needsSave: true}
    }
    case 'EDIT_FIELD': {
      return {
        ...state,
        config: {...state.config, [action.fieldName]: action.value},
        needsSave: true,
      }
    }
    default:
      throw new Error(`Unexpected action in configReducer: ${(action as any).type}`)
  }
}

const initConfigState = (fileContent: string): ConfigState => ({
  config: safeParseConfig(fileContent),
  onTopOf: fileContent,
  needsSave: false,
})

export {
  fileChangeAction,
  saveStartAction,
  resetFieldAction,
  editFieldAction,
  configReducer,
  initConfigState,
}
