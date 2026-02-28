import type {DeepReadonly} from 'ts-essentials'

import type {ModuleConfigValue} from './module-dependency'

const moduleConfigValueEqual = (
  left: DeepReadonly<ModuleConfigValue>,
  right: DeepReadonly<ModuleConfigValue>
) => {
  if (!left || !right) {
    return left === right
  }
  switch (typeof left) {
    case 'boolean':
    case 'number':
    case 'string':
      return left === right
    case 'object': {
      if (typeof right !== 'object') {
        return false
      }
      if (!left.type || !right.type) {
        throw new Error('Unexpected value in moduleConfigValueEqual')
      }
      // Find types above ResourceConfigField in module-config.ts
      switch (left.type) {
        case 'asset':
          return right.type === 'asset' && left.asset === right.asset
        case 'url':
          return right.type === 'url' && left.url === right.url
        default:
          throw new Error(`Unexpected type ${(left as any).type} in moduleConfigValueEqual`)
      }
    }
    default:
      throw new Error('Unexpected type in moduleConfigValueEqual')
  }
}

const moduleConfigValueOrSymbolEqual = (
  left: DeepReadonly<ModuleConfigValue> | Symbol,
  right: DeepReadonly<ModuleConfigValue> | Symbol
) => {
  if (typeof left === 'symbol' || typeof right === 'symbol') {
    return left === right
  }
  return moduleConfigValueEqual(left as ModuleConfigValue, right as ModuleConfigValue)
}

export {
  moduleConfigValueEqual,
  moduleConfigValueOrSymbolEqual,
}
