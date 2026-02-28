import {matchPath} from 'react-router-dom/cjs/react-router-dom.min'

import type {IG8ChangesetFile} from '../g8-dto'
import {useCurrentGit} from './use-current-git'

const hasChanged = (file: IG8ChangesetFile): boolean => (
  (file.status && file.status !== 2 && file.status !== 7) || file.dirty
)

const isDirty = (file: IG8ChangesetFile): boolean => file.dirty

type INestedStatus = Pick<IG8ChangesetFile, 'status'| 'dirty'>

const useCollapsedStatus = (folderPath: string, isHidingChildren: boolean) => (
  useCurrentGit((git): INestedStatus => {
    if (!isHidingChildren) {
      return {status: 0, dirty: false}
    }

    const changedDescendants: IG8ChangesetFile[] = []

    Object.values(git.changesets).forEach((changeset) => {
      changeset.files.forEach((file) => {
        if (matchPath(file.path, folderPath)) {
          changedDescendants.push(file)
        }
      })
    })

    return {
      status: changedDescendants.some(hasChanged) ? 3 : 0,
      dirty: changedDescendants.some(isDirty),
    }
  })
)

export {
  useCollapsedStatus,
}
