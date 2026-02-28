import type {IG8ChangesetFile} from '../g8-dto'
import {useCurrentGit} from './use-current-git'

type IChangesetFileStatus = Pick<IG8ChangesetFile, 'status'| 'dirty'>

const useChangesetStatus = (filePath: string) => {
  const fileState = useCurrentGit((git): IChangesetFileStatus => {
    let previousState: IChangesetFileStatus

    const changesets = Object.values(git.changesets)

    for (let i = 0; i < changesets?.length; i++) {
      const changeset = changesets[i]
      for (let j = 0; j < changeset.files.length; j++) {
        const file = changeset.files[j]
        if (file.path === filePath) {
          return file
        } else if (file.previousPath === filePath) {
          previousState = file
        }
      }
    }

    return previousState || {status: 0, dirty: false}
  })

  return fileState
}

export {
  useChangesetStatus,
}
