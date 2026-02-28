import type {DeepReadonly as RO} from 'ts-essentials'

import {ModuleInstance, ModuleProvider} from './api'
import {createConfigManager} from './config'
import type {ModuleRuntimeDependency} from './shared/module/module-runtime'
import type {ModuleRuntimeConfig} from './shared/module/module-runtime-config'

type HandleStatus = 'pending' | 'registered' | 'initialized' | 'failed'

interface Handle {
  getStatus(): HandleStatus
  getInstance(): ModuleInstance
  registerProvider(p: ModuleProvider, defaultConfig: ModuleRuntimeConfig): void
  initialize(): void
}

const createHandle = (
  module: RO<ModuleRuntimeDependency>
): Handle => {
  let provider_: ModuleProvider = null
  let status_: HandleStatus = 'pending'
  let instance_: ModuleInstance = null
  const config_ = createConfigManager(module.config)

  const registerProvider = (inputProvider: ModuleProvider, defaultConfig: ModuleRuntimeConfig) => {
    if (status_ !== 'pending') {
      throw new Error(`Can't register ${module.alias} in status: ${status_}`)
    }
    if (typeof inputProvider !== 'function') {
      throw new Error(`Invalid provider: ${module.alias}, must export a function`)
    }

    config_.setDefault(defaultConfig)
    provider_ = inputProvider
    status_ = 'registered'
  }

  const initialize = () => {
    if (status_ !== 'registered') {
      throw new Error(`Can't initialize ${module.alias} in status: ${status_}`)
    }
    try {
      const result = provider_({
        config: config_.provider,
        getGateway: (name: string) => {
          const gateway = (window as any)._app8?.gateway?.getGatewayForModule
          if (gateway) {
            return gateway(module.moduleId, name)
          } else {
            // NOTE(christoph): Even if the current page isn't set up to host gateways, don't
            // error out on import. This could come into play if a self hosted-compatible module
            // has conditional logic that doesn't always require the gateway.
            return {}
          }
        },
      })
      instance_ = {...result.api, config: config_.provider}
      status_ = 'initialized'
    } catch (err) {
      status_ = 'failed'
      throw err
    }
  }

  const getInstance = () => {
    if (status_ !== 'initialized') {
      throw new Error(`Can't import ${module.alias} in status: ${status_}`)
    }
    return instance_
  }

  return {
    getStatus: () => status_,
    getInstance,
    registerProvider,
    initialize,
  }
}

export {
  HandleStatus,
  Handle,
  ModuleProvider,
  createHandle,
}
