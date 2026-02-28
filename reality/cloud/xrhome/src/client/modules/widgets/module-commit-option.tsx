import React from 'react'

import type {ModuleVersionTarget} from '../../../shared/module/module-target'
import type {BuildInfo} from '../../../shared/module/module-target-api'
import {getVersionSpecifier} from '../../../shared/module/module-version-patches'
import {timeSince} from '../../common/time-since'
import {Badge} from '../../ui/components/badge'
import {ModuleTargetOption} from './module-target-option'

interface ITargetBadge {
  target: ModuleVersionTarget
}

const TargetBadge: React.FC<ITargetBadge> = ({target}) => (
  target.pre
    ? <Badge color='mango' variant='pastel'>Pre-Release v{getVersionSpecifier(target)}</Badge>
    : <Badge color='blue' variant='pastel'>v{getVersionSpecifier(target)}</Badge>
)

interface IModuleCommitOption {
  buildInfo: BuildInfo
  selected: boolean
  targets: ModuleVersionTarget[]
  first: boolean
}

const ModuleCommitOption: React.FC<IModuleCommitOption> = ({
  buildInfo, selected, targets, first,
}) => (
  <ModuleTargetOption
    selected={selected}
    description={buildInfo.commitMessage}
    badges={(
      <>
        {first &&
          <Badge color='purple'>Latest Commit</Badge>
          }
        {targets?.length && targets.map(
          t => <TargetBadge key={getVersionSpecifier(t)} target={t} />
        )}
      </>
    )}
    rightContent={`Last Update: ${timeSince(buildInfo.buildTime)} ago`}
  />
)

export {ModuleCommitOption}
