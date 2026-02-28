import type {DeepReadonly} from 'ts-essentials'

import type {ModuleDependency} from '../../../shared/module/module-dependency'

/* eslint-disable arrow-parens */
const getOrderedDependencies = <T extends DeepReadonly<ModuleDependency>>(
  dependencies: Record<string, T>
): T[] => Object.values(dependencies).sort((left, right) => left.alias.localeCompare(right.alias))

export {
  getOrderedDependencies,
}
