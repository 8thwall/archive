import {basename} from 'path'

import {BACKEND_FILE_EXT, isBackendPath, BACKEND_FOLDER_PREFIX} from '../../common/editor-files'

const extractBackendFilename = (filepath: string) => {
  if (isBackendPath(filepath)) {
    return basename(filepath).replace(BACKEND_FILE_EXT, '')
  }
  return ''
}

const resolveBackendFileLocation = (path: string) => {
  if (path.startsWith(BACKEND_FOLDER_PREFIX)) {
    return path.includes('.') ? path : `${path}${BACKEND_FILE_EXT}`
  }
  return ''
}

const getPathForBackend = (name: string) => `${BACKEND_FOLDER_PREFIX}${name}${BACKEND_FILE_EXT}`

export {
  extractBackendFilename,
  resolveBackendFileLocation,
  getPathForBackend,
}
