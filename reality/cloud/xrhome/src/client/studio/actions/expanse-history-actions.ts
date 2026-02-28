import type {Expanse, SceneGraph} from '@ecs/shared/scene-graph'

import {stringToBytes} from '@ecs/shared/data'

import type {DeepReadonly} from 'ts-essentials'

import {loadSceneDoc} from '@ecs/shared/crdt'

import {dispatchify} from '../../common'
import type {AsyncThunk, DispatchifiedActions} from '../../common/types/actions'
import {rawActions as gitActions, showErr} from '../../git/core-git-actions'
import {EXPANSE_FILE_PATH, EXPANSE_FILE_REGEX} from '../common/studio-files'
import {downloadHistory, uploadHistory} from './automerge-storage-actions'
import type {IRepo} from '../../git/g8-dto'
import {getRepoState} from '../../git/repo-state'

const uploadExpanseHistoryBeforeLand = (
  repo: IRepo
): AsyncThunk => async (dispatch, getState) => {
  try {
    const git = getRepoState(getState(), repo.repoId)
    const {forkId} = git.clients.find(client => client.active)
    const expanseFile = git.filesByPath[EXPANSE_FILE_PATH]?.content
    const {inspectFiles, saveFiles} = gitActions

    // get last history version from fork point expanse file
    const forkPointFiles = await dispatch(
      inspectFiles(repo, {
        inspectPoint: forkId,
        inspectRegex: EXPANSE_FILE_REGEX,
      })
    )
    const forkPointContents = forkPointFiles[0]?.contents
    let forkPointHistoryVersion: string, forkPointHistory: string
    if (forkPointContents) {
      const forkPointExpanse: Expanse = JSON.parse(forkPointContents)
      forkPointHistoryVersion = forkPointExpanse.historyVersion
      forkPointHistory = forkPointExpanse.history
    }
    if (!forkPointHistoryVersion && !forkPointHistory) {
      throw new Error('Unable to find history version or history in fork point expanse file')
    }

    // download the history file at fork point
    // if history version is specified but fails to download, abort pre-land.
    // if no history version is specified, it's the first land to create history version.
    let lastHistoryFile: Uint8Array
    if (forkPointHistoryVersion) {
      lastHistoryFile = await dispatch(downloadHistory(repo.repoId, forkPointHistoryVersion))
    } else {
      lastHistoryFile = stringToBytes(forkPointHistory)
    }
    if (!lastHistoryFile) {
      throw new Error('Failed to get last expanse history file')
    }

    // get scene from expanse file
    let sceneFromFile: DeepReadonly<SceneGraph>
    if (expanseFile) {
      const expanseData: Expanse = JSON.parse(expanseFile)
      delete expanseData.history
      delete expanseData.historyVersion
      sceneFromFile = expanseData
    } else {
      throw new Error('Scene file not found')
    }
    // create new history doc with current scene
    const newHistoryDoc = loadSceneDoc(lastHistoryFile, '')
    newHistoryDoc.update(() => sceneFromFile)
    const newHistoryBinary = newHistoryDoc.save()

    // upload new history doc to automerge storage service
    const newHistoryVersion = await dispatch(uploadHistory(repo.repoId, newHistoryBinary))
    if (!newHistoryVersion) {
      throw new Error('Failed to upload new scene history')
    }

    // update expanse file with new historyVersion and save file
    const newExpanse: DeepReadonly<Expanse> = {
      ...sceneFromFile,
      historyVersion: newHistoryVersion,
    }
    const newExpanseData = JSON.stringify(newExpanse, null, 2)
    await dispatch(saveFiles(repo, [{filePath: EXPANSE_FILE_PATH, content: newExpanseData}]))
  } catch (err) {
    // eslint-disable-next-line local-rules/hardcoded-copy
    dispatch(showErr(repo.repoId, 'Unable to land scene changes. Please try again.'))
    throw err
  }
}

const rawActions = {
  uploadExpanseHistoryBeforeLand,
}

type ExpanseHistoryActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)

export {
  ExpanseHistoryActions,
  rawActions,
}
