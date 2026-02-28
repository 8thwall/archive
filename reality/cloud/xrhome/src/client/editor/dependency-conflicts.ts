import type {DeepReadonly} from 'ts-essentials'

import type {ModuleDependency, ModuleConfigValue} from '../../shared/module/module-dependency'
import type {ModuleTarget} from '../../shared/module/module-target'
import {moduleConfigValueEqual} from '../../shared/module/compare-module-config-value'
import {moduleTargetsEqual} from '../../shared/module/compare-module-target'
import type {ParameterValue} from '../../shared/gateway/gateway-types'
import {parameterValueEqual} from '../../shared/gateway/compare-parameter-value'

type Conflict<T> = {mine: T, theirs: T, resolution: T | symbol} | undefined | null

interface DependencyConflictDetails {
  mine: ModuleDependency
  theirs: ModuleDependency

  // Set if there is an alias conflict.
  conflictedAlias: Conflict<string>

  // Set if there is a target conflict.
  conflictedTarget: Conflict<ModuleTarget>

  // Represents only config keys that are different between yours and theirs.
  // Empty if no config values conflict.
  conflictedConfigEntries: Record<string, Conflict<ModuleConfigValue>>

  conflictedBackendSlotValues: Record<string, Conflict<ParameterValue>>

  // prepareMergePhases() returns the parts of this that are not conflicted.
  // Resolve individual conflicts and then add them in here to complete resolution.
  dependencyWithoutConflicts: DeepReadonly<Partial<ModuleDependency>>

  // This means that a choice has not been made. Setting a value to undefined is a valid option.
  // Setting a resolution to undefined deletes the config entry.
  symbolForIndecision: Readonly<symbol>
}

const autoMergeDependencies = (
  yours: DeepReadonly<ModuleDependency>,
  theirs: DeepReadonly<ModuleDependency>,
  original: DeepReadonly<ModuleDependency>
): DeepReadonly<ModuleDependency> => {
  if (yours.alias !== theirs.alias || !moduleTargetsEqual(yours.target, theirs.target)) {
    return null
  }

  const yoursTheirsKeys = [...new Set([
    ...Object.keys(yours.config || {}),
    ...Object.keys(theirs.config || {}),
  ])]

  const hasConflictedKey = yoursTheirsKeys.some((key) => {
    const yourValue = yours.config?.[key]
    const theirValue = theirs.config?.[key]
    const originalValue = original.config?.[key]

    const yoursChanged = !moduleConfigValueEqual(originalValue, yourValue)
    const theirsChanged = !moduleConfigValueEqual(originalValue, theirValue)
    const bothAgree = moduleConfigValueEqual(yourValue, theirValue)

    return yoursChanged && theirsChanged && !bothAgree
  })

  if (hasConflictedKey) {
    return null
  }

  const yoursTheirsSlotIds = [...new Set([
    ...Object.keys(yours.backendSlotValues || {}),
    ...Object.keys(theirs.backendSlotValues || {}),
  ])]

  const hasSlotValueConflict = yoursTheirsSlotIds.some((slotId) => {
    const yourValue = yours.backendSlotValues?.[slotId]
    const theirValue = theirs.backendSlotValues?.[slotId]
    const originalValue = original.backendSlotValues?.[slotId]

    const yoursChanged = !parameterValueEqual(originalValue, yourValue)
    const theirsChanged = !parameterValueEqual(originalValue, theirValue)
    const bothAgree = parameterValueEqual(yourValue, theirValue)

    return yoursChanged && theirsChanged && !bothAgree
  })

  if (hasSlotValueConflict) {
    return null
  }

  const combinedBackendSlotValues = (yours.backendSlotValues || theirs.backendSlotValues)
    ? {...yours.backendSlotValues, ...theirs.backendSlotValues}
    : undefined

  return {
    ...theirs,
    config: {
      ...yours.config,
      ...theirs.config,
    },
    backendSlotValues: combinedBackendSlotValues,
  }
}

const resolveDependencyConflicts = (details: DeepReadonly<DependencyConflictDetails>) => {
  const {
    conflictedAlias, conflictedTarget, conflictedConfigEntries, symbolForIndecision,
    conflictedBackendSlotValues,
  } = details

  if (conflictedAlias?.resolution === symbolForIndecision) {
    return null
  }
  if (conflictedTarget?.resolution === symbolForIndecision) {
    return null
  }
  if (Object.values(conflictedConfigEntries).some(e => e.resolution === symbolForIndecision)) {
    return null
  }
  if (Object.values(conflictedBackendSlotValues).some(e => e.resolution === symbolForIndecision)) {
    return null
  }

  const resolution = {
    ...details.dependencyWithoutConflicts,
  }

  if (conflictedAlias) {
    resolution.alias = conflictedAlias.resolution as string
  }
  if (conflictedTarget) {
    resolution.target = conflictedTarget.resolution as ModuleTarget
  }

  const configEntriesToResolve = Object.entries(conflictedConfigEntries)

  if (configEntriesToResolve.length) {
    const newConfig = {...resolution.config}
    configEntriesToResolve.forEach(([key, configEntry]) => {
      if (typeof configEntry.resolution === 'symbol') {
        throw new Error('symbol found when making resolved dependency file')
      }
      newConfig[key] = configEntry.resolution
    })
    resolution.config = newConfig
  }

  const backendValuesEntriesToResolve = Object.entries(conflictedBackendSlotValues)
  if (backendValuesEntriesToResolve.length) {
    const newValues = {...resolution.backendSlotValues}
    backendValuesEntriesToResolve.forEach(([key, valueEntry]) => {
      if (typeof valueEntry.resolution === 'symbol') {
        throw new Error('symbol found when making resolved dependency file')
      }
      newValues[key] = valueEntry.resolution
    })
    resolution.backendSlotValues = newValues
  }

  const dependencyOfFinalTarget = moduleTargetsEqual(resolution.target, details.mine.target)
    ? details.mine
    : details.theirs

  if (dependencyOfFinalTarget.backendTemplates) {
    resolution.backendTemplates = dependencyOfFinalTarget.backendTemplates
  } else {
    delete resolution.backendTemplates
  }

  return resolution
}

const generateDependencyConflictDetails = (
  yours: ModuleDependency,
  theirs: ModuleDependency,
  original: ModuleDependency
): DependencyConflictDetails => {
  const symbolForIndecision = Symbol('indecision')

  const conflictedAlias = ((yours.alias !== theirs.alias) && {
    mine: yours.alias,
    theirs: theirs.alias,
    resolution: symbolForIndecision,
  }) || null

  const conflictedTarget = (!moduleTargetsEqual(yours.target, theirs.target) && {
    mine: yours.target,
    theirs: theirs.target,
    resolution: symbolForIndecision,
  }) || null

  const conflictedConfigEntries: DependencyConflictDetails['conflictedConfigEntries'] = {}

  const yoursTheirsKeys = [...new Set([
    ...Object.keys(yours.config || {}),
    ...Object.keys(theirs.config || {}),
  ])]

  yoursTheirsKeys.forEach((key) => {
    const yourValue = yours.config?.[key]
    const theirValue = theirs.config?.[key]
    const originalValue = original.config?.[key]

    const yoursChanged = !moduleConfigValueEqual(originalValue, yourValue)
    const theirsChanged = !moduleConfigValueEqual(originalValue, theirValue)
    const bothAgree = moduleConfigValueEqual(yourValue, theirValue)

    if (!yoursChanged || !theirsChanged || bothAgree) {
      return
    }

    conflictedConfigEntries[key] = {
      mine: yourValue,
      theirs: theirValue,
      resolution: symbolForIndecision,
    }
  })

  const conflictedBackendSlotValues: DependencyConflictDetails['conflictedBackendSlotValues'] = {}

  const yoursTheirsSlotIds = [...new Set([
    ...Object.keys(yours.backendSlotValues || {}),
    ...Object.keys(theirs.backendSlotValues || {}),
  ])]

  yoursTheirsSlotIds.forEach((slotId) => {
    const yourValue = yours.backendSlotValues?.[slotId]
    const theirValue = theirs.backendSlotValues?.[slotId]
    const originalValue = original.backendSlotValues?.[slotId]

    const yoursChanged = !parameterValueEqual(originalValue, yourValue)
    const theirsChanged = !parameterValueEqual(originalValue, theirValue)
    const bothAgree = parameterValueEqual(yourValue, theirValue)

    if (!yoursChanged || !theirsChanged || bothAgree) {
      return
    }

    conflictedBackendSlotValues[slotId] = {
      mine: yourValue,
      theirs: theirValue,
      resolution: symbolForIndecision,
    }
  })

  const dependencyWithoutConflicts: Partial<ModuleDependency> = {...yours, ...theirs}
  if (yours.config) {
    dependencyWithoutConflicts.config = {...dependencyWithoutConflicts.config, ...yours.config}
  }
  if (yours.backendSlotValues) {
    dependencyWithoutConflicts.backendSlotValues = {
      ...dependencyWithoutConflicts.backendSlotValues,
      ...yours.backendSlotValues,
    }
  }

  if (conflictedAlias) {
    delete dependencyWithoutConflicts.alias
  }
  if (conflictedTarget) {
    delete dependencyWithoutConflicts.target
  }
  Object.keys(conflictedConfigEntries).forEach((key) => {
    delete dependencyWithoutConflicts.config[key]
  })
  Object.keys(conflictedBackendSlotValues).forEach((slotId) => {
    delete dependencyWithoutConflicts.backendSlotValues[slotId]
  })

  return {
    mine: yours,
    theirs,
    conflictedAlias,
    conflictedTarget,
    conflictedConfigEntries,
    conflictedBackendSlotValues,
    dependencyWithoutConflicts,
    symbolForIndecision,
  }
}

export {
  autoMergeDependencies,
  resolveDependencyConflicts,
  generateDependencyConflictDetails,
}

export type {
  DependencyConflictDetails,
}
