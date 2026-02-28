import type {DeepReadonly} from 'ts-essentials'

import {useMultiRepoContext} from '../../editor/multi-repo-context'
import {useSelector} from '../../hooks'
import type {IGit} from '../g8-dto'
import {useCurrentRepoId} from '../repo-id-context'
import {getRepoState} from '../repo-state'
import {EXPANSE_FILE_PATH} from '../../studio/common/studio-files'

type GitSelector<T> = (git: DeepReadonly<IGit>) => T

function useOpenGits(): IGit[]
// eslint-disable-next-line no-redeclare
function useOpenGits<T>(selector: GitSelector<T>): T[]
// eslint-disable-next-line no-redeclare
function useOpenGits<T>(selector?: GitSelector<T>) {
  const context = useMultiRepoContext()
  // NOTE(johnny): This is used for the module editor.
  const curRepoId = useCurrentRepoId()
  return useSelector((s) => {
    const allRepoIds = context
      ? [context.primaryRepoId].concat(Array.from(context.subRepoIds))
      : [curRepoId]
    const allGits = []
    allRepoIds.forEach((repoId) => {
      const git = getRepoState(s, repoId)
      if (git.progress.load === 'DONE') {
        allGits.push(selector ? selector(git) : git)
      }
    })
    return allGits
  })
}

type NeedsSaveOptions = {
  ignoreExpanse?: boolean
}

// See note about caveat of using this method in use-current-git.ts
// This only works when there are no changesets... i.e. only the "working" pseudo-changeset
// exists. Cloud editor changesets are ephemeral and are used strictly for landing, but if
// this ever changes, this logic will need to be fixed because saving the client does not
// clear the dirty bits in changesets. If this returns true even after saving, check to see
// if there are lingering changesets.
const useGitsNeedsSave = ({ignoreExpanse}: NeedsSaveOptions = {}) => {
  const openGits = useOpenGits((git) => {
    const {changesets} = git
    return changesets && Object.values(changesets).some(cs => cs.files?.some(f => (
      f.dirty && (!ignoreExpanse || f.path !== EXPANSE_FILE_PATH)
    )))
  })
  return openGits.some(Boolean)
}

export {
  useOpenGits,
  useGitsNeedsSave,
}

export type {
  NeedsSaveOptions,
}
