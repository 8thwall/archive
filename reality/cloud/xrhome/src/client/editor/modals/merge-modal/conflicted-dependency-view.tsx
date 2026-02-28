import type {DeepReadonly} from 'ts-essentials'
import React from 'react'
import type {ParameterValue} from '@nia/reality/shared/gateway/gateway-types'
import type {ModuleConfigValue} from '@nia/reality/shared/module/module-dependency'

import type {MergePhase} from '../MergePhase'

import type {ModuleTarget} from '../../../../shared/module/module-target'
import coreGitActions from '../../../git/core-git-actions'
import useActions from '../../../common/use-actions'
import {ConflictedAliasDetail} from './conflicted-alias-detail'
import {ConflictedConfigDetail} from './conflicted-config-detail'
import {ConflictedTargetDetail} from './conflicted-target-detail'
import {DependencyConflictDetails, resolveDependencyConflicts} from '../../dependency-conflicts'
import {useAbandonableFunction} from '../../../hooks/use-abandonable-function'
import {useCurrentGit} from '../../../git/hooks/use-current-git'
import {ConflictedSlotValueDetail} from './conflicted-slot-value-detail'

interface IConflictedDependencyView {
  mergePhase: DeepReadonly<MergePhase>
  applyMergePhaseUpdate: (update: DeepReadonly<Partial<MergePhase>>) => void
}

const ConflictedDependencyView: React.FC<IConflictedDependencyView> = ({
  mergePhase,
  applyMergePhaseUpdate,
}) => {
  const {dependencyConflictDetails: details} = mergePhase
  const {
    conflictedAlias, conflictedTarget, conflictedConfigEntries, conflictedBackendSlotValues,
  } = details

  const repo = useCurrentGit(git => git.repo)
  const createBlob = useAbandonableFunction(useActions(coreGitActions).createBlob)

  // When all conflicts have been resolved, produce the output resolution blob.
  const updateDetails = async (detailUpdate: Partial<DependencyConflictDetails>) => {
    const newDetails = {...details, ...detailUpdate}

    const resolution = resolveDependencyConflicts(newDetails)
    if (!resolution) {
      applyMergePhaseUpdate({dependencyConflictDetails: newDetails})
      return
    }
    const dependencyFileContents = JSON.stringify(resolution, null, 2)
    const {id} = await createBlob(repo, dependencyFileContents)

    if (id === mergePhase.editBlobId) {
      return
    }

    applyMergePhaseUpdate({
      dependencyConflictDetails: newDetails,
      editBlobId: id,
      choice: 'edit',
      choiceMade: true,
    })
  }

  const resolveConfigValue = (configName: string, value: ModuleConfigValue) => {
    updateDetails({
      conflictedConfigEntries: {
        ...details.conflictedConfigEntries,
        [configName]: {
          ...details.conflictedConfigEntries[configName],
          resolution: value,
        },
      },
    })
  }

  const resolveSlotValue = (slotId: string, value: ParameterValue) => {
    updateDetails({
      conflictedBackendSlotValues: {
        ...details.conflictedBackendSlotValues,
        [slotId]: {
          ...details.conflictedBackendSlotValues[slotId],
          resolution: value,
        },
      },
    })
  }

  const resolveAlias = (alias: string) => {
    updateDetails({
      conflictedAlias: {
        ...details.conflictedAlias,
        resolution: alias,
      },
    })
  }

  const resolveTarget = (target: ModuleTarget) => {
    updateDetails({
      conflictedTarget: {
        ...details.conflictedTarget,
        resolution: target,
      },
    })
  }

  return (
    <div>
      {conflictedAlias &&
        <ConflictedAliasDetail
          conflictedAlias={details.conflictedAlias}
          resolveAliasConflict={resolveAlias}
        />
      }
      {conflictedTarget &&
        <ConflictedTargetDetail
          conflictedTarget={conflictedTarget}
          resolveTargetConflict={resolveTarget}
        />
      }
      {Object.keys(conflictedConfigEntries).map(configKey => (
        <ConflictedConfigDetail
          key={configKey}
          details={details}
          configName={configKey}
          resolveValueConflict={resolveConfigValue}
        />
      ))}
      {Object.keys(conflictedBackendSlotValues).map(slotId => (
        <ConflictedSlotValueDetail
          key={slotId}
          details={details}
          slotId={slotId}
          resolveValueConflict={resolveSlotValue}
        />
      ))}
    </div>
  )
}

export {
  ConflictedDependencyView,
}
