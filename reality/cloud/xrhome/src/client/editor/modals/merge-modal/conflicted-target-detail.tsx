import React from 'react'

import type {DependencyConflictDetails} from '../../dependency-conflicts'
import {moduleTargetOrSymbolEqual} from '../../../../shared/module/compare-module-target'
import type {ModuleTarget} from '../../../../shared/module/module-target'
import {ConflictDisplay} from './conflict-display'

// TODO(pawel) Make better UI element for target.
const Target: React.FC<{target: ModuleTarget}> = ({target}) => (
  <pre>{JSON.stringify(target, null, 2)}</pre>
)

interface IConflictedTargetDetail {
  conflictedTarget: DependencyConflictDetails['conflictedTarget']
  resolveTargetConflict: (target: ModuleTarget) => void
}

const ConflictedTargetDetail: React.FC<IConflictedTargetDetail> = ({
  conflictedTarget,
  resolveTargetConflict,
}) => {
  const mySelected = moduleTargetOrSymbolEqual(conflictedTarget.resolution, conflictedTarget.mine)
  const theirSelected = moduleTargetOrSymbolEqual(
    conflictedTarget.resolution,
    conflictedTarget.theirs
  )

  return (
    <ConflictDisplay
      baseButtonId='conflicted-target'
      title='Target'
      left={<Target target={conflictedTarget.mine} />}
      right={<Target target={conflictedTarget.theirs} />}
      leftChecked={mySelected}
      rightChecked={theirSelected}
      onSelectLeft={() => resolveTargetConflict(conflictedTarget.mine)}
      onSelectRight={() => resolveTargetConflict(conflictedTarget.theirs)}
    />
  )
}

export {
  ConflictedTargetDetail,
}
