import type {AccessLevelType, DependencyTokenPayload} from './dependency-token-payload'
import type {ModuleDependencyData} from './module-dependency-data'

type AccessLevelRequirement = 'full' | 'read'

const levelApplies = (level: AccessLevelType, requiredLevel: AccessLevelRequirement) => {
  switch (requiredLevel) {
    case 'full':
      return level === 'owned'
    case 'read':
      return ['owned', 'public', 'purchased'].includes(level)
    default:
      throw new Error('Unexpected requiredLevel in levelApplies')
  }
}

type ValidationRequest = {
  moduleId: string
  payload?: DependencyTokenPayload  // payload is from a signed token
  data?: Pick<ModuleDependencyData, 'moduleId' | 'accessLevel'>  // data is from the database
  requiredLevel: AccessLevelRequirement
}

const validateAccessLevel = (request: ValidationRequest) => {
  let data: ValidationRequest['data'] | DependencyTokenPayload

  if (request.payload) {
    if (request.payload.sub !== 'dep') {
      return false
    }
    data = request.payload
  } else if (request.data) {
    data = request.data
  } else {
    return false
  }

  if (data.moduleId !== request.moduleId) {
    return false
  }

  return levelApplies(data.accessLevel, request.requiredLevel)
}

export {
  AccessLevelRequirement,
  ValidationRequest,
  validateAccessLevel,
}
