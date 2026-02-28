import type {ModuleDependency} from './module-dependency'

interface ModuleExportRequest {
  appUuid: string
  appKey: string
  accountUuid: string
  dependenciesById: Record<string, ModuleDependency>
}

export type {
  ModuleExportRequest,
}
