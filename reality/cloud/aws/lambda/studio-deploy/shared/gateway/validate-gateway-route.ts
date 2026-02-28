// @inliner-off
import type {DeepReadonly} from 'ts-essentials'

import type {RouteConfig, RouteMethod, ValidationOptions} from './gateway-types'
import {validateGatewayHeaders} from './validate-gateway-headers'
import {validateString} from './validate-string'
import {MAX_IDENTIFIER_LENGTH, MAX_URL_LENGTH, URL_CHARACTER_REGEX, VALID_METHODS} from './limits'

const validateMethods = (methods: DeepReadonly<RouteMethod[]> | any): methods is RouteMethod[] => {
  if (!Array.isArray(methods)) {
    return false
  }

  if (!methods.length) {
    return false
  }

  if (!methods.every(e => VALID_METHODS.has(e))) {
    return false
  }

  if (new Set(methods).size !== methods.length) {
    return false
  }

  return true
}

const validateGatewayRoute = (
  route: DeepReadonly<RouteConfig> | any, options: ValidationOptions
): route is RouteConfig => {
  if (!route || typeof route !== 'object') {
    return false
  }

  if (!validateString(route.url, {max: MAX_URL_LENGTH, regex: URL_CHARACTER_REGEX})) {
    return false
  }

  if (!validateString(route.id, {min: 1, max: MAX_IDENTIFIER_LENGTH})) {
    return false
  }

  if (!validateString(route.name, {
    min: 1,
    max: MAX_IDENTIFIER_LENGTH,
    regex: /^[a-zA-Z0-9_$]+$/,
  })) {
    return false
  }

  if (!validateMethods(route.methods)) {
    return false
  }

  if (route.headers !== undefined && !validateGatewayHeaders(route.headers, options)) {
    return false
  }

  return true
}

export {
  validateGatewayRoute,
}
