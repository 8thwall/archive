import {
  MAX_URL_LENGTH, MAX_IDENTIFIER_LENGTH, MAX_LITERAL_LENGTH, URL_CHARACTER_REGEX,
  MAX_BACKEND_NAME_LENGTH,
} from './limits'

const getFieldError = (
  value: string, maxLength: number, regex: RegExp = null, required = false
) => {
  if (required && !value) {
    return 'editor_page.backend_config.error.empty'
  }

  if (value && value.length > maxLength) {
    return 'editor_page.backend_config.error.max_length'
  }

  if (regex && !regex.test(value || '')) {
    return 'editor_page.backend_config.error.invalid_characters'
  }

  return ''
}

const getBaseUrlError = (baseUrl: string) => {
  const basicFieldError = getFieldError(baseUrl, MAX_URL_LENGTH, URL_CHARACTER_REGEX, true)
  if (basicFieldError) {
    return basicFieldError
  }

  try {
    const url = new URL(baseUrl)
    if (url.protocol !== 'https:') {
      return 'editor_page.backend_config.error.url.protocol'
    }
  } catch (err) {
    return 'editor_page.backend_config.error.url.format'
  }

  return ''
}

const getRouteUrlError = (routeUrl: string, baseUrl: string) => {
  const basicFieldError = getFieldError(routeUrl, MAX_URL_LENGTH, URL_CHARACTER_REGEX)
  if (basicFieldError) {
    return basicFieldError
  }

  try {
    const targetUrl = `${baseUrl}${routeUrl}`
    const targetOrigin = new URL(targetUrl).origin
    if (targetOrigin !== new URL(baseUrl).origin) {
      return 'editor_page.backend_config.error.url.origin'
    }
  } catch (err) {
    return 'editor_page.backend_config.error.url.format'
  }

  return ''
}

const getRouteNameError = (routeName: string) => (
  getFieldError(routeName, MAX_IDENTIFIER_LENGTH, /^[a-zA-Z0-9_$]+$/, true)
)

const getHeaderNameError = (headerName: string) => (
  getFieldError(headerName, MAX_IDENTIFIER_LENGTH, /^[a-zA-Z0-9-_]+$/, true)
)

const getEnvVariableKeyError = (envVarKey: string) => getFieldError(
  envVarKey, MAX_IDENTIFIER_LENGTH, /^[a-zA-Z0-9-_]+$/, true
)

const getLiteralError = (value: string) => getFieldError(value, MAX_LITERAL_LENGTH)

const getSlotLabelError = (label: string) => getFieldError(label, MAX_IDENTIFIER_LENGTH)

const getPrefixError = (prefix: string) => getFieldError(prefix, MAX_IDENTIFIER_LENGTH)

const getTitleError = (title: string) => getFieldError(title, MAX_IDENTIFIER_LENGTH)

const getFileNameError = (fileName: string) => (
  getFieldError(fileName, MAX_BACKEND_NAME_LENGTH, /^[a-z0-9-]+$/, true)
)

// TODO(kyle): Validate the entry path. May end up deleting this if entry path is a dropdown.
const getEntryErrors = (entryPath: string) => {
  const errors = []
  errors.push(getFieldError(entryPath, Infinity, /^[a-zA-Z0-9-_./]+$/, true))
  if (entryPath && !entryPath.toLowerCase().endsWith('.ts')) {
    errors.push('editor_page.backend_config.error.entry_path_extension')
  }
  return errors.filter(Boolean)
}

const validateEnvVarKey = (envVarKey: string) => {
  const error = getEnvVariableKeyError(envVarKey)
  if (error) {
    throw new Error(`Invalid environment variable key: ${envVarKey}`)
  }
}

const validateEnvVarValue = (envVarValue: string) => {
  const error = getFieldError(envVarValue, MAX_LITERAL_LENGTH)
  if (error) {
    throw new Error(`Environment variable value '${envVarValue}' is too long`)
  }
}

export {
  getBaseUrlError,
  getRouteUrlError,
  getRouteNameError,
  getHeaderNameError,
  getLiteralError,
  getSlotLabelError,
  getPrefixError,
  getTitleError,
  getFileNameError,
  getEntryErrors,
  getEnvVariableKeyError,
  validateEnvVarKey,
  validateEnvVarValue,
}
