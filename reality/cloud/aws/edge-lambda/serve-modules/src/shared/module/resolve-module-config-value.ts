import {escapeAssetPath} from '@nia/reality/shared/studio/escape-asset-path'
import type {ModuleConfigValue} from './module-dependency'
import type {ModuleRuntimeConfigPrimitive} from './module-runtime-config'
import {getPath} from '@nia/reality/shared/asset-pointer'

// NOTE: Turning asset paths into CDN paths will need to access the filesystem.
//   The editor will also be able to dispatch primitive updates directly to a device, so
//   getFileContents is a handle to access redux/filesystem state.
const resolveModuleConfigValue = async (
  value: ModuleConfigValue,
  getFileContents: (filePath: string) => Promise<string> | string,
  assetBase = ''
): Promise<ModuleRuntimeConfigPrimitive> => {
  switch (typeof value) {
    case 'string':
    case 'boolean':
    case 'number':
      return value
    case 'undefined':
      return null
    case 'object':
      if (value === null) {
        return null
      }
      switch (value.type) {
        case 'asset': {
          if (!value.asset) {
            return null
          }
          const fileContents = (await getFileContents(value.asset)).trim()
          const path = getPath(fileContents)
          const escapedPath = escapeAssetPath(path)
          return `${assetBase}${escapedPath}`
        }
        case 'url':
          return value.url
        default:
          throw new Error(`Unknown config object value: ${value}`)
      }
    default:
      throw new Error(`Unknown config value: ${value}`)
  }
}

export {
  resolveModuleConfigValue,
}
