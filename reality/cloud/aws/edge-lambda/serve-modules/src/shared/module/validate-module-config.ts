import type {DeepReadonly as RO} from 'ts-essentials'

import type {ModuleConfig, ModuleConfigField, ModuleConfigGroup} from './module-config'

const isPlainObject = (t: any) => !!t && typeof t === 'object' && !Array.isArray(t)
const isFilledString = (t: any) => typeof t === 'string' && t.length > 0
const isOptionalString = (v: any) => v === undefined || typeof v === 'string'
const isOptionalFilledString = (t: any) => t === undefined || isFilledString(t)
const isOptionalBoolean = (v: any) => v === undefined || typeof v === 'boolean'
const isOptionalNumber = (v: any) => v === undefined || typeof v === 'number'

const isValidResourceExtensions = (extensions: any) => {
  if (extensions === undefined) {
    return true
  }
  if (!Array.isArray(extensions)) {
    return false
  }
  return extensions.every(isFilledString)
}

const isValidResourceValue = (value: any) => {
  if (value === undefined || value === null) {
    return true
  }
  if (!isPlainObject(value)) {
    return false
  }

  switch (value.type) {
    case 'url':
      return value.url === null || typeof value.url === 'string'
    case 'asset':
      return value.asset === undefined || value.asset === null || typeof value.asset === 'string'
    default:
      return false
  }
}

const isValidModuleField = (field: RO<ModuleConfigField | any>): field is ModuleConfigField => {
  if (!isPlainObject(field)) {
    return false
  }

  const isBaseValid = isFilledString(field.fieldName) &&
                      isOptionalFilledString(field.groupId) &&
                      isOptionalNumber(field.order) &&
                      typeof field.label === 'string'

  if (!isBaseValid) {
    return false
  }

  switch (field.type) {
    case 'boolean':
      return isOptionalBoolean(field.default) &&
             isOptionalString(field.trueDescription) &&
             isOptionalString(field.falseDescription)
    case 'number':
      return isOptionalNumber(field.default) &&
             isOptionalNumber(field.min) &&
             isOptionalNumber(field.max)
    case 'string':
      return isOptionalString(field.default)
    case 'resource':
      return isValidResourceValue(field.default) &&
             isOptionalString(field.labelForDefault) &&
             isValidResourceExtensions(field.extensions)
    default:
      return false
  }
}

const isValidModuleGroup = (group: ModuleConfigGroup | any): group is ModuleConfigGroup => {
  if (!isPlainObject(group)) {
    return false
  }

  return typeof group.name === 'string' &&
         typeof group.order === 'number' &&
         isFilledString(group.groupId)
}

const isValidGroups = (groups: any) => {
  if (groups === undefined) {
    return true
  }

  if (!isPlainObject(groups)) {
    return false
  }

  return Object.entries(groups).every(([key, group]) => (
    isValidModuleGroup(group) && group.groupId === key
  ))
}

const isValidFields = (fields: any) => {
  if (fields === undefined) {
    return true
  }

  if (!isPlainObject(fields)) {
    return false
  }

  return Object.entries(fields).every(([key, field]) => (
    isValidModuleField(field) && field.fieldName === key
  ))
}

const isValidModuleConfig = (config: ModuleConfig | any): config is ModuleConfig => {
  if (config === undefined) {
    return true
  }
  if (!isPlainObject(config)) {
    return false
  }

  return isValidGroups(config.groups) && isValidFields(config.fields)
}

export {
  isValidModuleConfig,
}
