import type {DeepReadonly} from 'ts-essentials'

import type {ParameterValue} from './gateway-types'

const parameterValueEqual = (
  left: DeepReadonly<ParameterValue>,
  right: DeepReadonly<ParameterValue>
) => {
  if (!left || !right) {
    return !left === !right
  }
  switch (left.type) {
    case 'secret':
      return right.type === 'secret' && left.secretId === right.secretId
    case 'literal':
      return right.type === 'literal' && left.value === right.value
    case 'secretslot':
    case 'literalslot':
      return left.type === right.type && left.slotId === right.slotId && left.label === right.label
    default:
      throw new Error('Unexpected type in parameterValueEqual')
  }
}

export {
  parameterValueEqual,
}
