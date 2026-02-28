import type {DeepReadonly as RO} from 'ts-essentials'

import type {ImportProvider, ModuleProvider} from './api'
import type {DependencySpecifier} from './dependency'
import {createHandle, Handle} from './handle'
import type {ModuleRuntimeDependency, ModuleRuntimeInfo} from './shared/module/module-runtime'
import type {ModuleRuntimeConfig} from './shared/module/module-runtime-config'

type ModuleRegistration = DependencySpecifier & {
  module: ModuleProvider
  defaultConfig: ModuleRuntimeConfig
}

const findMatchingModule = <T extends DependencySpecifier>(
  specifier: DependencySpecifier, modules: RO<T[]>
) => (
    modules.find(e => e.moduleId === specifier.moduleId)
  )

interface Registry extends ImportProvider {
  registerModule(registration: ModuleRegistration): void
}

const createRegistry = (tree: RO<ModuleRuntimeInfo>): Registry => {
  const handles_ = [] as Handle[]
  const handleMap_ = new Map<RO<ModuleRuntimeDependency>, Handle>()

  tree.dependencies.forEach((dependency) => {
    const handle = createHandle(dependency)
    handles_.push(handle)
    handleMap_.set(dependency, handle)
    return handle
  })

  const resolveModule = (specifier: DependencySpecifier) => {
    const mod = findMatchingModule(specifier, tree.dependencies)
    if (!mod) {
      throw new Error(`[Modules8] Unexpected module ID: ${specifier.moduleId}`)
    }
    return mod
  }

  const getHandle = (spec: DependencySpecifier) => {
    const module = resolveModule(spec)
    return handleMap_.get(module)
  }

  const getModule = (specifier: DependencySpecifier) => getHandle(specifier).getInstance()

  const registerModule = ({module, defaultConfig = {}, ...specifier}: ModuleRegistration) => {
    const handle = getHandle(specifier)
    handle.registerProvider(module, defaultConfig)
    handle.initialize()
  }

  return {
    registerModule,
    getModule,
  }
}

export {
  createRegistry,
}
