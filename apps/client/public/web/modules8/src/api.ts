import type {DeepReadonly as RO} from 'ts-essentials'

import type {DependencySpecifier} from './dependency'
import type {ModuleRuntimeConfig} from './shared/module/module-runtime-config'
import type {GatewayHandle} from './shared/gateway/gateway-types'

// An API exported by a module.
type ModuleApi = RO<Record<string, any>>

type ModuleResult = {
  api: ModuleApi
}

type ModuleInstance = ModuleApi & {
  config: ConfigProvider
}

type ConfigChangeHandler = (onChange: ModuleRuntimeConfig) => void
interface ConfigProvider {
  subscribe: (onChange: ConfigChangeHandler) => {unsubscribe: () => void}
  update: (newConfig: ModuleRuntimeConfig) => void
  reset: (...configFieldNames: string[]) => void
}

// The setup function used to instantiate a module. The result of the function is what is made
// available to API consumers.
type ModuleProvider = (context: RO<ModuleContext>) => ModuleResult

// ImportProvider is a surface that can be imported against. To support transitive dependencies,
// each module would get a separate instance that resolves dependencies relative to the module's
// location in the tree.
interface ImportProvider {
  getModule(specifier: DependencySpecifier): ModuleInstance
  // TODO(christoph): Async and on-demand module loading
}

// This is how module can hook into the registry, for example subscribing to configuration
// or triggering on-demand loads if the user requests additional functionality.
interface ModuleContext {
  config: ConfigProvider
  getGateway: (name: string) => GatewayHandle
  // TODO(christoph): Add transitive/peer dependencies
}

export {
  ModuleApi,
  ModuleInstance,
  ModuleResult,
  ConfigProvider,
  ModuleProvider,
  ModuleContext,
  ImportProvider,
}
