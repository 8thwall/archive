// @inliner-off
import type {DeepReadonly} from 'ts-essentials'

import type {
  FunctionDefinition, GatewayDefinition, ProxyDefinition, ValidationOptions,
} from './gateway-types'
import {validateGatewayRoute} from './validate-gateway-route'
import {validateGatewayHeaders} from './validate-gateway-headers'
import {validateString} from './validate-string'
import {
  MAX_DESCRIPTION_LENGTH, MAX_IDENTIFIER_LENGTH, MAX_URL_LENGTH, URL_CHARACTER_REGEX,
} from './limits'
import {validateEntry} from './validate-gateway-entry'

const validateProxyDefinition = (
  definition: DeepReadonly<ProxyDefinition> | any,
  options: ValidationOptions
): definition is ProxyDefinition => {
  if (!definition || typeof definition !== 'object') {
    return false
  }

  const {headers, name, baseUrl, title, description, routes, type} = definition

  if (type && type !== 'proxy') {
    return false
  }

  if (options.expectName) {
    if (!validateString(name, {min: 1, max: 256, regex: /^[a-zA-Z0-9-_]+$/})) {
      return false
    }
  } else if (name !== undefined) {
    return false
  }

  if (!validateGatewayHeaders(headers, options)) {
    return false
  }

  if (!validateString(baseUrl, {min: 1, max: MAX_URL_LENGTH, regex: URL_CHARACTER_REGEX})) {
    return false
  }

  if (title !== undefined && !validateString(title, {max: MAX_IDENTIFIER_LENGTH})) {
    return false
  }

  if (description !== undefined && !validateString(description, {max: MAX_DESCRIPTION_LENGTH})) {
    return false
  }

  try {
    const url = new URL(baseUrl)
    if (url.protocol !== 'https:') {
      return false
    }
  } catch (err) {
    return false
  }

  if (!Array.isArray(routes)) {
    return false
  }

  return routes.every(e => validateGatewayRoute(e, options))
}

const validateFunctionDefinition = (
  definition: DeepReadonly<FunctionDefinition> | any,
  options: ValidationOptions
): definition is FunctionDefinition => {
  if (!definition || typeof definition !== 'object') {
    return false
  }

  const {name, headers, title, description, entry, type} = definition

  if (type !== 'function') {
    return false
  }

  if (options.expectName) {
    if (!validateString(name, {min: 1, max: 256, regex: /^[a-zA-Z0-9-_]+$/})) {
      return false
    }
  } else if (name !== undefined) {
    return false
  }

  if (!validateGatewayHeaders(headers, {...options, allowSecret: false, allowSecretSlot: false})) {
    return false
  }

  if (title !== undefined && !validateString(title, {max: MAX_IDENTIFIER_LENGTH})) {
    return false
  }

  if (description !== undefined && !validateString(description, {max: MAX_DESCRIPTION_LENGTH})) {
    return false
  }

  if (entry !== undefined && !validateEntry(entry)) {
    return false
  }

  return true
}

const validateGatewayDefinition = (
  definition: DeepReadonly<GatewayDefinition> | any,
  options: ValidationOptions
): definition is GatewayDefinition => {
  if (!definition || typeof definition !== 'object') {
    return false
  }

  if (definition.type === 'function') {
    return validateFunctionDefinition(definition, options)
  }

  return validateProxyDefinition(definition, options)
}

const validateOptionalGatewayDefinitions = (
  definitions: DeepReadonly<GatewayDefinition[]>,
  options: ValidationOptions
) => {
  if (definitions === undefined) {
    return true
  }

  if (!Array.isArray(definitions)) {
    return false
  }

  return definitions.every(e => validateGatewayDefinition(e, options))
}

export {
  // Exported for testing purposes.
  validateProxyDefinition as _validateProxyDefinition,
  validateFunctionDefinition as _validateFunctionDefinition,

  validateGatewayDefinition,
  validateOptionalGatewayDefinitions,
}

export type {
  ValidationOptions,
}
