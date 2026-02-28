import type {ModuleTarget, ModuleVersionTarget} from './module-target'

type IsVersionFinalizedProvider = (
  target: ModuleVersionTarget) => Promise<boolean>

const isUnsafeModuleTarget = async (
  target: ModuleTarget, isVersionFinalizedProvider?: IsVersionFinalizedProvider
): Promise<boolean> => {
  switch (target.type) {
    case 'branch':
      return true
    case 'version':
      if (!target.pre) {
        return false
      }
      if (!isVersionFinalizedProvider) {
        return true
      }
      return !await isVersionFinalizedProvider(target)
    default:
      return false
  }
}

export {
  isUnsafeModuleTarget,
}
