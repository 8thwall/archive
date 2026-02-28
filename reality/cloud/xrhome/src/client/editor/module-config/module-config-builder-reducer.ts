import uuid from 'uuid/v4'

import type {
  ModuleConfig, ModuleConfigField, ModuleConfigFieldPatch, ModuleConfigGroup,
} from '../../../shared/module/module-config'
import type {ModuleManifest} from '../../../shared/module/module-manifest'

type ConfigState = {
  onTopOf: string
  expectedNewFile?: string
  needsSave: boolean
  config: ModuleConfig
}

const fileChangeAction = (content: string) => ({type: 'FILE_CHANGE' as const, content})
const saveStartAction = (content: string) => ({type: 'SAVE_START' as const, content})
const newFieldAction = (field: ModuleConfigField) => ({type: 'NEW_FIELD' as const, field})
const deleteFieldAction = (fieldName: string) => ({type: 'DELETE_FIELD' as const, fieldName})
const setFieldAction = (field: ModuleConfigField) => ({type: 'SET_FIELD' as const, field})
const patchFieldAction = (fieldName: string, update: ModuleConfigFieldPatch) => (
  {type: 'UPDATE_FIELD' as const, fieldName, update}
)
const newGroupAction = (group: {name: string}) => ({type: 'NEW_GROUP' as const, group})
const deleteGroupAction = (groupId: string) => ({type: 'DELETE_GROUP' as const, groupId})
const captureUngroupedAction = (name: string) => ({type: 'CAPTURE_UNGROUPED' as const, name})
const patchGroupAction = (groupId: string, update: {order?: number, name?: string}) => (
  {type: 'UPDATE_GROUP' as const, groupId, update}
)
const sortGroupAction = (groupId: string, beforeId: string, afterId: string) => (
  {type: 'SORT_GROUP' as const, groupId, beforeId, afterId}
)
const sortFieldAction = (fieldName: string, beforeFieldName: string, afterFieldName: string) => (
  {type: 'SORT_FIELD' as const, fieldName, beforeFieldName, afterFieldName}
)
const moveFieldAction = (fieldName: string, groupId: string) => (
  {type: 'MOVE_FIELD' as const, fieldName, groupId}
)

type FileChangeAction = ReturnType<typeof fileChangeAction>
type SaveStartAction = ReturnType<typeof saveStartAction>
type NewFieldAction = ReturnType<typeof newFieldAction>
type DeleteFieldAction = ReturnType<typeof deleteFieldAction>
type SetFieldAction = ReturnType<typeof setFieldAction>
type PatchFieldAction = ReturnType<typeof patchFieldAction>
type NewGroupAction = ReturnType<typeof newGroupAction>
type DeleteGroupAction = ReturnType<typeof deleteGroupAction>
type PatchGroupAction = ReturnType<typeof patchGroupAction>
type CaptureUngroupedAction = ReturnType<typeof captureUngroupedAction>
type SortGroupAction = ReturnType<typeof sortGroupAction>
type SortFieldAction = ReturnType<typeof sortFieldAction>
type MoveFieldAction = ReturnType<typeof moveFieldAction>

type ConfigAction = FileChangeAction | SaveStartAction | NewFieldAction | SortFieldAction |
                    DeleteFieldAction | SetFieldAction | PatchFieldAction | SortGroupAction |
                    NewGroupAction | DeleteGroupAction | PatchGroupAction | CaptureUngroupedAction |
                    MoveFieldAction

const safeParseConfig = (content: string): ModuleConfig => {
  try {
    const manifest: ModuleManifest = JSON.parse(content)
    if (manifest.config.fields && typeof manifest.config.fields === 'object') {
      return manifest.config
    }
  } catch (err) {
    // TODO(christoph): Handle this better
  }
  return {fields: {}}
}

// Include randomness to avoid ties
const getBeforeGroupOrder = (groups: Record<string, ModuleConfigGroup>) => (groups
  ? Object.values(groups).reduce((a, g) => Math.min(a, g.order), 0)
  : 0) - 1 - Math.random()

// Include randomness to avoid ties
const getAfterGroupOrder = (groups: Record<string, ModuleConfigGroup>) => (groups
  ? Object.values(groups).reduce((a, g) => Math.max(a, g.order), 0)
  : 0) + 1 + Math.random()

const getBeforeFieldOrder = (fields: Record<string, ModuleConfigField>, groupId: string) => {
  const fieldsInGroup = fields && Object.values(fields).filter(
    f => (f?.groupId === (groupId || undefined))
  )
  return (fieldsInGroup
    ? fieldsInGroup.reduce(
      (a, f) => Math.min(a, f.order), 0
    )
    : 0) - 1 - Math.random()
}

const getAfterFieldOrder = (fields: Record<string, ModuleConfigField>, groupId: string) => {
  const fieldsInGroup = fields && Object.values(fields).filter(
    f => (f?.groupId === (groupId || undefined))
  )
  return (fieldsInGroup
    ? fieldsInGroup.reduce(
      (a, f) => Math.max(a, f.order), 0
    )
    : 0) + 1 + Math.random()
}

const configBuilderReducer = (state: ConfigState, action: ConfigAction): ConfigState => {
  switch (action.type) {
    case 'FILE_CHANGE': {
      if (state.expectedNewFile === action.content) {
        return {...state, onTopOf: action.content, expectedNewFile: undefined}
      } else {
        try {
          return {
            ...state,
            onTopOf: action.content,
            config: safeParseConfig(action.content),
            needsSave: false,
          }
        } catch (err) {
          return state
        }
      }
    }
    case 'SAVE_START':
      return {...state, expectedNewFile: action.content, needsSave: false}
    case 'NEW_FIELD': {
      const {fieldName, groupId} = action.field
      if (state.config.fields[fieldName]) {
        return state
      }
      const newOrder = getAfterFieldOrder(state.config.fields, groupId)
      const newField = {...action.field, order: newOrder}
      const newFields = {...state.config.fields, [fieldName]: newField}
      const newConfig = {...state.config, fields: newFields}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'DELETE_FIELD': {
      const newFields = {...state.config.fields}
      delete newFields[action.fieldName]
      const newConfig = {...state.config, fields: newFields}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'UPDATE_FIELD': {
      const {fieldName, update} = action
      const newField = {...state.config.fields[fieldName], ...update} as ModuleConfigField
      const newFields = {...state.config.fields, [fieldName]: newField}
      const newConfig = {...state.config, fields: newFields}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'SET_FIELD': {
      const {field} = action
      const newFields = {...state.config.fields, [field.fieldName]: field}
      const newConfig = {...state.config, fields: newFields}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'SORT_FIELD': {
      const {fieldName, beforeFieldName, afterFieldName} = action
      const beforeField = beforeFieldName && state.config.fields?.[beforeFieldName]
      const afterField = afterFieldName && state.config.fields?.[afterFieldName]
      const existingField = state.config.fields?.[fieldName]
      if (!existingField) {
        return state
      }

      let newOrder = 0
      if (!beforeField) {
        newOrder = getBeforeFieldOrder(state.config.fields, existingField.groupId)
      } else if (!afterField) {
        newOrder = getAfterFieldOrder(state.config.fields, existingField.groupId)
      } else {  // NOTE(johnny): Moving field between 2 other fields
        // NOTE(johnny): Returns a number between minOrder and maxOrder
        newOrder = Math.random() * (afterField.order - beforeField.order) + beforeField.order
      }
      const newField = {...existingField, order: newOrder}
      const newFields = {...state.config.fields, [existingField.fieldName]: newField}
      const newConfig = {...state.config, fields: newFields}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'MOVE_FIELD': {
      const {fieldName, groupId} = action
      const newOrder = getAfterFieldOrder(state.config.fields, groupId)
      const newField = {...state.config.fields[fieldName], order: newOrder, groupId}
      if (!groupId) {
        delete newField.groupId
      }
      const newFields = {...state.config.fields, [fieldName]: newField}
      const newConfig = {...state.config, fields: newFields}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'NEW_GROUP': {
      const groupId = uuid()
      const newOrder = getAfterGroupOrder(state.config.groups)
      const newGroup = {order: newOrder, ...action.group, groupId}
      const newGroups = {...state.config.groups, [groupId]: newGroup}
      const newConfig = {...state.config, groups: newGroups}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'DELETE_GROUP': {
      const {groupId} = action
      if (!state.config.groups) {
        return state
      }
      const newGroups = {...state.config.groups}
      delete newGroups[groupId]
      const newConfig = {...state.config, groups: newGroups}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'UPDATE_GROUP': {
      const {groupId, update} = action
      const existingGroup = state.config.groups?.[groupId]
      if (!existingGroup) {
        return state
      }
      const newGroup = {...existingGroup, ...update}
      const newGroups = {...state.config.groups, [groupId]: newGroup}
      const newConfig = {...state.config, groups: newGroups}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'SORT_GROUP': {
      const {groupId, beforeId, afterId} = action
      const beforeGroup = beforeId && state.config.groups?.[beforeId]
      const afterGroup = afterId && state.config.groups?.[afterId]

      const existingGroup = state.config.groups?.[groupId]
      if (!existingGroup) {
        return state
      }

      let newOrder = 0
      if (!beforeGroup) {
        newOrder = getBeforeGroupOrder(state.config.groups)
      } else if (!afterGroup) {
        newOrder = getAfterGroupOrder(state.config.groups)
      } else {  // NOTE(johnny): Moving group between 2 other groups
        // NOTE(johnny): Returns a number between minOrder and maxOrder
        newOrder = Math.random() * (afterGroup.order - beforeGroup.order) + beforeGroup.order
      }
      const newGroup = {...existingGroup, order: newOrder}
      const newGroups = {...state.config.groups, [groupId]: newGroup}
      const newConfig = {...state.config, groups: newGroups}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'CAPTURE_UNGROUPED': {
      const groupId = uuid()
      const {name} = action
      const newFields = {...state.config.fields}
      Object.entries(newFields).forEach(([key, field]) => {
        if (!field.groupId || !state.config.groups[field.groupId]) {
          newFields[key] = {...field, groupId}
        }
      })
      const newOrder = getBeforeGroupOrder(state.config.groups)
      const newGroup: ModuleConfigGroup = {order: newOrder, name, groupId}
      const newGroups = {...state.config.groups, [groupId]: newGroup}
      const newConfig = {...state.config, groups: newGroups, fields: newFields}
      return {...state, config: newConfig, needsSave: true}
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
  newFieldAction,
  deleteFieldAction,
  setFieldAction,
  patchFieldAction,
  sortFieldAction,
  moveFieldAction,
  newGroupAction,
  deleteGroupAction,
  patchGroupAction,
  sortGroupAction,
  captureUngroupedAction,
  configBuilderReducer,
  initConfigState,
}
