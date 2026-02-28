// @inliner-off
import type {DeepReadonly} from 'ts-essentials'

import type {HeadersConfig, ParameterValue, ValidationOptions} from './gateway-types'
import {validateString} from './validate-string'
import {MAX_HEADER_COUNT, MAX_IDENTIFIER_LENGTH, MAX_LITERAL_LENGTH, MAX_URL_LENGTH} from './limits'

const isValidHeader = (name: string) => validateString(name, {
  min: 1,
  max: MAX_IDENTIFIER_LENGTH,
  regex: /^[a-zA-Z0-9-_]+$/,
})

const validateId = (id: string) => validateString(id, {min: 1, max: MAX_IDENTIFIER_LENGTH})

const validateParameterValue = (
  value: DeepReadonly<ParameterValue> | any,
  options: ValidationOptions
): value is ParameterValue => {
  if (!value || typeof value !== 'object') {
    return false
  }

  switch (value.type) {
    case 'literal':
      return validateString(value.value, {max: MAX_LITERAL_LENGTH})
    case 'secret': {
      if (!options.allowSecret) {
        return false
      }

      if (!validateId(value.secretId)) {
        return false
      }

      return (
        value.allowedOrigin === undefined ||
        validateString(value.allowedOrigin, {max: MAX_URL_LENGTH})
      )
    }
    case 'secretslot': {
      if (options.allowSecretSlot === false) {
        return false
      }
      const prefixIsValid = value.prefix === undefined || validateString(value.prefix, {
        max: MAX_IDENTIFIER_LENGTH,
      })

      if (!prefixIsValid) {
        return false
      }
    }
    // eslint-disable-next-line no-fallthrough
    case 'literalslot':
      return options.allowSlot &&
             validateId(value.slotId) &&
             validateString(value.label, {max: MAX_IDENTIFIER_LENGTH})
    case 'passthrough':
      return true
    default:
      return false
  }
}

const validateGatewayHeaders = (
  headers: DeepReadonly<HeadersConfig> | any, options: ValidationOptions
): headers is HeadersConfig => {
  if (headers === undefined || headers === null) {
    return true
  }
  if (typeof headers !== 'object') {
    return false
  }
  const entries = Object.entries(headers)

  if (entries.length > MAX_HEADER_COUNT) {
    return false
  }

  if (new Set(entries.map(e => e[0].toLowerCase())).size !== entries.length) {
    return false
  }
  return entries.every(([header, value]) => (
    isValidHeader(header) && validateParameterValue(value, options)
  ))
}

export {
  isValidHeader,
  validateGatewayHeaders,
  validateParameterValue,
}
