import type {ModuleTarget} from './module-target'

type ModuleOverrideSettings = {
  moduleTargetOverrides?: Record<string, ModuleTarget>
}

export type {
  ModuleOverrideSettings,
}
