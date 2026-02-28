import type {ModuleVersionTarget} from './module-target'

type Levels = 'major' | 'minor' | 'patch'

const updateVersionTarget = (
  target: ModuleVersionTarget,
  newLevel: Levels
): ModuleVersionTarget => {
  if (target.type !== 'version') {
    throw new Error('Encountered unexpected type in updateVersionTarget')
  }

  if (target.level === newLevel) { return target }

  switch (newLevel) {
    case 'major':
      return {...target, level: 'major'}
    case 'minor':
      return {...target, level: 'minor', minor: Number.isInteger(target.minor) ? target.minor : 0}
    case 'patch':
      return {
        ...target,
        level: 'patch',
        minor: Number.isInteger(target.minor) ? target.minor : 0,
        patch: Number.isInteger(target.patch) ? target.patch : 0,
      }
    default:
      return target
  }
}

export {
  updateVersionTarget,
  Levels,
}
