import type {GatewayDefinition, SlotValues} from '../gateway/gateway-types'
import type {ResourceConfigField} from './module-config'
import type {ModuleTarget} from './module-target'

type ResourceConfigValue = ResourceConfigField['default']

// TODO(christoph): ModuleConfigValue will include number, boolean, and compound
// data types as we add more field types
type ModuleConfigValue = string | boolean | number | ResourceConfigValue

type ModuleDependencyConfig = Record<string, ModuleConfigValue>

type ModuleDependency = {
  type: 'module',
  dependencyId: string
  moduleId: string
  alias: string
  target: ModuleTarget
  accessToken?: string
  config?: ModuleDependencyConfig
  backendSlotValues?: SlotValues
  backendTemplates?: GatewayDefinition[]
}

type DependenciesById = Record<string, ModuleDependency>

export type {
  ResourceConfigValue,
  ModuleDependency,
  ModuleConfigValue,
  ModuleDependencyConfig,
  DependenciesById,
}
