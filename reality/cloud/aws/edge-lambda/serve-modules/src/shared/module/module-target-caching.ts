import type {ModuleTarget} from './module-target'

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_YEAR = 31536000

const getCacheDurationInSeconds = (target: ModuleTarget) => {
  switch (target.type) {
    case 'development':
      return 0
    case 'branch':
      return target.branch === 'master' ? SECONDS_PER_MINUTE : 0
    case 'channel':
      return SECONDS_PER_MINUTE
    case 'commit':
      return SECONDS_PER_YEAR
    case 'version':
      return (!target.pre && target.level === 'patch') ? SECONDS_PER_YEAR : SECONDS_PER_MINUTE
    default:
      throw new Error(`No caching logic present for type: ${(target as any).type}`)
  }
}

export {
  getCacheDurationInSeconds,
}
