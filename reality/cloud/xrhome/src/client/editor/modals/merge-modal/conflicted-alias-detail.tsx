import React from 'react'

import type {DependencyConflictDetails} from '../../dependency-conflicts'
import {ConflictDisplay} from './conflict-display'

interface IConflictedAliasDetail {
  conflictedAlias: DependencyConflictDetails['conflictedAlias']
  resolveAliasConflict: (alias: string) => void
}

const ConflictedAliasDetail: React.FC<IConflictedAliasDetail> = ({
  conflictedAlias,
  resolveAliasConflict,
}) => {
  const mySelected = conflictedAlias.resolution === conflictedAlias.mine
  const theirSelected = conflictedAlias.resolution === conflictedAlias.theirs

  return (
    <ConflictDisplay
      baseButtonId='conflicted-alias'
      title='Alias'
      left={conflictedAlias.mine}
      right={conflictedAlias.theirs}
      leftChecked={mySelected}
      rightChecked={theirSelected}
      onSelectLeft={() => resolveAliasConflict(conflictedAlias.mine)}
      onSelectRight={() => resolveAliasConflict(conflictedAlias.theirs)}
    />
  )
}

export {
  ConflictedAliasDetail,
}
