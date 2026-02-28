import React from 'react'

import useActions from '../common/use-actions'
import {useCurrentGit} from '../git/hooks/use-current-git'
import {CommitHistoryView} from '../editor/commit-history-view'
import moduleDeploymentActions from './module-deployment-actions'
import type {IModule} from '../common/types/models'
import {useSelector} from '../hooks'

interface IModuleHistoryView {
  module: IModule
}

const ModuleHistoryView: React.FC<IModuleHistoryView> = ({module}) => {
  const masterCommit = useCurrentGit(g => g.logs[0]?.id)
  const {fetchModuleChannels} = useActions(moduleDeploymentActions)

  React.useEffect(() => {
    fetchModuleChannels(module.uuid)
  }, [module.uuid])

  const channels = useSelector(s => s.modules.channels[module.uuid])

  const betaCommit = channels?.beta?.commitId
  const releaseCommit = channels?.release?.commitId

  const targets = [
    masterCommit && {
      key: 'latest',
      commitId: masterCommit,
      text: 'Latest',
    },
    betaCommit && {
      key: 'beta',
      commitId: betaCommit,
      text: 'Beta',
      className: 'staging-link',
    },
    releaseCommit && {
      key: 'release',
      commitId: releaseCommit,
      text: 'Release',
      className: 'prod-link',
    },
  ]

  return (
    <CommitHistoryView
      annotatedTargets={targets}
      clientHref={null}
    />
  )
}

export {
  ModuleHistoryView,
}
