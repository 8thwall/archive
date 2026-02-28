import type {ModuleTarget} from './module-target'

// NOTE(christoph): We only honor the "development" target if the base target is the
// "latest commit". This means syncing changes that switch to a different target will
// pull you out of development mode, instead of remaining in development mode while the base target
// is a version for example. This prevents issues with super land where you think you're
// landing changes that will take effect on the project, but actually won't, because it's pinned
// to something else.
const isOpenForDevelopment = (baseTarget: ModuleTarget, targetOverride?: ModuleTarget) => (
  !!targetOverride &&
  targetOverride.type === 'development' &&
  baseTarget.type === 'branch' &&
  baseTarget.branch === 'master'
)

// NOTE(christoph): baseTarget comes from the dependency file, targetOverride comes
// from .client.json
const targetOverrideApplies = (baseTarget: ModuleTarget, targetOverride?: ModuleTarget) => {
  if (!targetOverride) {
    return false
  }
  if (targetOverride.type === 'development') {
    return isOpenForDevelopment(baseTarget, targetOverride)
  }

  return true
}

export {
  isOpenForDevelopment,
  targetOverrideApplies,
}
