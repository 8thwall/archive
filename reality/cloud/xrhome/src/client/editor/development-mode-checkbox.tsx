import React from 'react'

import type {ModuleTarget} from '../../shared/module/module-target'

import type {IPublicModule} from '../common/types/models'

import useActions from '../common/use-actions'
import {useCurrentGit} from '../git/hooks/use-current-git'
import {StandardCheckboxField} from '../ui/components/standard-checkbox-field'
import dependencyActions from './dependency-actions'
import {useMultiRepoContext} from './multi-repo-context'
import {useDependencyContext} from './dependency-context'
import {useSelector} from '../hooks'
import {useId} from '../hooks/use-id'

interface IDevelopmentModeCheckBox {
  module: IPublicModule
  dependencyId: string
}

const DevelopmentModeCheckBox: React.FC<IDevelopmentModeCheckBox> = ({module, dependencyId}) => {
  const {
    updateTargetOverride, clearTargetOverride, updateDependencyTarget,
  } = useActions(dependencyActions)
  const repo = useCurrentGit(git => git.repo)

  const dependencyContext = useDependencyContext()
  const multiRepoContext = useMultiRepoContext()
  const isInDevelopment = multiRepoContext?.subRepoIds.has(module.repoId)

  const userHandle = useSelector(s => s.team.roles.find(r => r.uuid === s.user.uuid)?.handle)

  const devModeId = useId()

  const updateClientJson = async () => {
    if (!isInDevelopment) {
      const newTarget: ModuleTarget = {type: 'development', handle: userHandle}

      await Promise.all([
        updateTargetOverride(repo, dependencyId, newTarget),
        updateDependencyTarget(
          repo, dependencyContext.dependencyIdToPath[dependencyId],
          {type: 'branch', branch: 'master'}
        ),
      ])
    } else {
      await clearTargetOverride(repo, dependencyId)
    }
  }

  return (
    <StandardCheckboxField
      checked={isInDevelopment}
      onChange={updateClientJson}
      id={`dev-mode-${devModeId}`}
      label='Development Mode'
    />
  )
}

export {
  DevelopmentModeCheckBox,
}
