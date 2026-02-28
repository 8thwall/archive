import {toAttributes} from '../typed-attributes'
import {getModuleTargetParts, ModuleTarget, parseModuleTarget} from './module-target'

const pkForModule = (moduleId: string) => `module:${moduleId}`

const skForTarget = (target: ModuleTarget) => (
  `target:${getModuleTargetParts(target).join(':')}`
)

const parseSkForTarget = (target: string) => {
  const parts = target.split(':')
  const parsedTarget = parseModuleTarget(parts.slice(1))
  if (parts[0] !== 'target' || parsedTarget.remainder.length !== 0) {
    return null
  }
  return parsedTarget.target
}

const parseSkForVersion = (target: string) => {
  const targetObj = parseSkForTarget(target)
  if (!targetObj || targetObj.type !== 'version') {
    return null
  }
  return targetObj
}

const keyForBuild = (moduleId: string, target: ModuleTarget) => toAttributes({
  pk: pkForModule(moduleId),
  sk: skForTarget(target),
})

export {
  pkForModule,
  skForTarget,
  parseSkForTarget,
  parseSkForVersion,
  keyForBuild,
}
