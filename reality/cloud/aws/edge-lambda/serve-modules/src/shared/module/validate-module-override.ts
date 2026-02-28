import type {ModuleOverrideSettings} from './module-override-settings'
import type {ModuleTarget} from './module-target'
import {isValidTarget} from './validate-module-target'

const isFilledString = (t: any) => typeof t === 'string' && t.length > 0

const isValidModuleTargetOverrides =
(s: Record<string, ModuleTarget> | any) => {
  if (s === null || s === undefined) {
    return true
  }
  if (typeof s !== 'object') {
    return false
  }

  return Object.entries(s).every(
    ([key, value]) => (isFilledString(key) && isValidTarget(value))
  )
}

const isValidOverrideSettings = (settings: ModuleOverrideSettings | any):
settings is ModuleOverrideSettings => {
  if (!settings || typeof settings !== 'object') {
    return false
  }
  if (!isValidModuleTargetOverrides(settings.moduleTargetOverrides)) {
    return false
  }
  return true
}

export {
  isValidOverrideSettings,
}
