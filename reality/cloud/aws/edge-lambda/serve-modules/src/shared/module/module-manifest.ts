import type {GatewayDefinition} from '../gateway/gateway-types'
import type {ModuleConfig} from './module-config'

type ModuleManifest = {
  version: 1
  config?: ModuleConfig
  backendTemplates?: GatewayDefinition[]
}

export type {
  ModuleManifest,
}
