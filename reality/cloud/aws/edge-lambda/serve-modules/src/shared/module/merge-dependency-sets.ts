import type {DeepReadonly} from 'ts-essentials'

import {moduleConfigValueEqual} from './compare-module-config-value'
import {moduleTargetsEqual} from './compare-module-target'
import type {ModuleDependency} from './module-dependency'
import type {DependenciesById} from './validate-app-dependencies'

/*
  The purpose of this function is to apply all my changes made between "original" and "yours"
  on top of the latest state.

  original: The state when the edits started
  yours: The current state after making edits
  theirs: The latest state that's been modified/saved separately from our edits
*/
const mergeTripleDependencyState = (
  original: DeepReadonly<ModuleDependency>,
  yours: DeepReadonly<ModuleDependency>,
  theirs: DeepReadonly<ModuleDependency>
) => {
  const merged = {...theirs, config: {...theirs.config}}

  if (original.alias !== yours.alias) {
    merged.alias = yours.alias
  }

  if (!moduleTargetsEqual(original.target, yours.target)) {
    merged.target = yours.target
  }

  const allConfigKeys = [...new Set([
    ...Object.keys(merged.config || {}),
    ...Object.keys(yours.config || {}),
  ])]

  allConfigKeys.forEach((key) => {
    const yourValue = yours.config && yours.config[key]
    const originalValue = original.config && original.config[key]

    if (!moduleConfigValueEqual(originalValue, yourValue)) {
      if (yourValue === undefined) {
        delete merged.config[key]
      } else {
        merged.config[key] = yourValue
      }
    }
  })

  return merged
}

const mergeDependencyState = (
  original: DeepReadonly<ModuleDependency>,
  yours: DeepReadonly<ModuleDependency>,
  theirs: DeepReadonly<ModuleDependency>
): DeepReadonly<ModuleDependency> | null => {
  if (original && yours && theirs) {          // Dependency always existed
    return mergeTripleDependencyState(original, yours, theirs)
  } else if (!original && yours && theirs) {  // Both added it, simple merge is fine
    return {
      ...theirs,
      ...yours,
      config: {...theirs.config, ...yours.config},
    }
  } else if (!original && yours && !theirs) {  // We added it
    return yours
  } else if (!original && !yours && theirs) {  // They added it, we didn't
    return theirs
  } else {                                     // Module was deleted by us or them
    return null
  }
}

// Merge a set of dependencies  such that any changes made between original and yours
// are applied to "theirs", excluding modules deleted by theirs
const mergeDependencySets = (
  original: DeepReadonly<DependenciesById>,
  yours: DeepReadonly<DependenciesById>,
  theirs: DeepReadonly<DependenciesById>
) => {
  const merged: Record<string, DeepReadonly<ModuleDependency>> = {}

  const allIds = [...new Set([
    ...Object.keys(original),
    ...Object.keys(yours),
    ...Object.keys(theirs),
  ])]

  allIds.forEach((id) => {
    const resolvedDependency = mergeDependencyState(original[id], yours[id], theirs[id])
    if (resolvedDependency) {
      merged[id] = resolvedDependency
    }
  })

  return merged
}

export {
  mergeDependencySets,
}
