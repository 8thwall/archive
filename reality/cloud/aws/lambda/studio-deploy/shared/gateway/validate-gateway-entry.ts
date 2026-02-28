import path from 'path'

import {validateString} from './validate-string'

const NAME_REGEX = /^[a-zA-Z0-9-_]+$/
const ALLOWED_EXTENSIONS = ['.js', '.ts']

const validateEntry = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false
  }

  const parsedPath = path.parse(value)

  if (parsedPath.dir) {
    const dirNames = parsedPath.dir.split('/')
    // Validate directory names.
    if (dirNames.some(dirName => !validateString(dirName, {regex: NAME_REGEX}))) {
      return false
    }
  }
  // Validate file name.
  if (!validateString(parsedPath.name, {regex: NAME_REGEX})) {
    return false
  }
  // Validate extension type.
  if (!parsedPath.ext || !ALLOWED_EXTENSIONS.includes(parsedPath.ext)) {
    return false
  }

  return true
}

export {
  validateEntry,
}
