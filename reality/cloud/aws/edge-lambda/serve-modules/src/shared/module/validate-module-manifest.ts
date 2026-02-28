import type {ModuleManifest} from './module-manifest'
import {isValidModuleConfig} from './validate-module-config'

const isValidManifest = (manifest: ModuleManifest | any): manifest is ModuleManifest => {
  if (!manifest || typeof manifest !== 'object') {
    return false
  }

  return manifest.version === 1 &&
         isValidModuleConfig(manifest.config)
}

export {
  isValidManifest,
}
