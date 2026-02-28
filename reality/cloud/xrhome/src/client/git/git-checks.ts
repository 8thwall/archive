import type {DeepReadonly} from 'ts-essentials'

import {isLandablePath} from '../common/editor-files'
import type {IG8Changeset, IGit as IGit_} from './g8-dto'

type IGit = DeepReadonly<IGit_>

const getActiveClient = (git: IGit) => git.clients?.find(c => c.active)

const doesRepoNeedSync = (git: IGit) => {
  const client = getActiveClient(git)
  const {logs} = git
  return (
    client && logs && logs[0]?.id !== client.forkId
  )
}

const doesRepoHaveConflicts = (git: IGit) => (git.conflicts.some(c => c.status === 1))
const isRepoLoaded = (git: IGit) => (git.progress.load === 'DONE')

const countLandableChanges = (git: IGit) => {
  let count = 0

  if (git.changesets) {
    Object.values(git.changesets).forEach((changeset) => {
      changeset.files.forEach((file) => {
        if (file.status > 0 && isLandablePath(file.path)) {
          count += 1
        }
      })
    })
  }

  return count
}

const changesetNeedsLand = (cs: DeepReadonly<IG8Changeset>) => (
  cs.files?.some(f => (f.status >= 1) && isLandablePath(f.path))
)

const gitNeedsLand = (git: Pick<IGit, 'changesets'>) => {
  const {changesets} = git
  return !!changesets && Object.values(changesets).some(changesetNeedsLand)
}

export {
  getActiveClient,
  doesRepoNeedSync,
  doesRepoHaveConflicts,
  isRepoLoaded,
  countLandableChanges,
  changesetNeedsLand,
  gitNeedsLand,
}
