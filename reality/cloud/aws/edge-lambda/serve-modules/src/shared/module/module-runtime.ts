import type {ModuleRuntimeConfig} from './module-runtime-config'

type ModuleRuntimeDependency = {
  moduleId: string
  alias: string
  config: ModuleRuntimeConfig
}

type ModuleRuntimeInfo = {
  appKey: string
  dependencies: ModuleRuntimeDependency[]
}

export type {
  ModuleRuntimeDependency,
  ModuleRuntimeInfo,
}
