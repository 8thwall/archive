import {toAttributes} from '../typed-attributes'
import {pkForModule} from './module-build'
import {getModuleTargetParts, ModuleTarget} from './module-target'

const skForSlug = (target: ModuleTarget, slug: string) => (
  `slug:${getModuleTargetParts(target).join(':')}:${slug}`
)

const keyForSlug = (moduleId: string, target: ModuleTarget, slug: string) => toAttributes({
  pk: pkForModule(moduleId),
  sk: skForSlug(target, slug),
})

const skForPrimarySlug = (target: ModuleTarget) => (
  `slug-primary:${getModuleTargetParts(target).join(':')}`
)

const keyForPrimarySlug = (moduleId: string, target: ModuleTarget) => toAttributes({
  pk: pkForModule(moduleId),
  sk: skForPrimarySlug(target),
})

type ModuleSlugData = {
  slug: string
  status: 'ACTIVE' | 'DEPRECATED'
}

export {
  pkForModule,
  skForSlug,
  skForPrimarySlug,
  keyForPrimarySlug,
  keyForSlug,
  ModuleSlugData,
}
