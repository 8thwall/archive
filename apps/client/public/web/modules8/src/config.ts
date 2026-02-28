import type {DeepReadonly as RO} from 'ts-essentials'

import type {ConfigProvider} from './api'
import type {ModuleRuntimeConfig} from './shared/module/module-runtime-config'

const createConfigManager = (initialConfig: RO<ModuleRuntimeConfig>) => {
  let default_: RO<ModuleRuntimeConfig> = null  // Null until the module registers
  const runtime_ = {...initialConfig}  // Updated programmatically using configure()
  let current_: RO<ModuleRuntimeConfig> = null  // All of them joined together, null until ready

  const subscriptions_: ((config: ModuleRuntimeConfig) => void)[] = []

  const subscribe = (changeHandler: (newState: ModuleRuntimeConfig) => void) => {
    // NOTE(christoph): Using .bind(null) gives us unique function references to use in
    //   subscriptions_, even if the changeHandler is being used multiple times. Since consumers
    //   call unsubscribe() to cancel the subscription, it seems like our logic should use solely
    //   that, instead of being affected by the referential equality between changeHandlers.
    const handler = changeHandler.bind(null)

    subscriptions_.push(handler)

    if (current_) {
      handler(current_)
    }

    return {
      unsubscribe: () => {
        subscriptions_.splice(subscriptions_.indexOf(handler), 1)
      },
    }
  }

  const dispatchConfigChange = () => {
    if (!default_) {
      return
    }
    current_ = {...default_, ...runtime_}
    subscriptions_.forEach((handler) => {
      try {
        handler(current_)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    })
  }

  const update = (newConfig: ModuleRuntimeConfig) => {
    Object.entries(newConfig).forEach(([key, value]) => {
      if (value !== undefined) {
        runtime_[key] = value
      }
    })
    dispatchConfigChange()
  }

  const reset = (...configFieldNames: string[]) => {
    configFieldNames.forEach((configFieldName) => {
      delete runtime_[configFieldName]
    })
    dispatchConfigChange()
  }

  const setDefault = (config: ModuleRuntimeConfig) => {
    default_ = config
    dispatchConfigChange()
  }

  const provider: ConfigProvider = {
    subscribe,
    update,
    reset,
  }

  return {
    provider,
    setDefault,
  }
}

export {
  createConfigManager,
}
