import type {CallableAction} from '../../common/types/actions'
import {getMonacoLintMarkers} from '../tooling/eslint'
import type {ModelState} from './monaco-git-sync'
import type {ITextModel, Monaco} from './monaco-types'
import type {SaveSemaphore} from '../hooks/save-challenge-semaphore'
import {fileExt} from '../editor-common'
import {JS_FILES, isDependencyPath} from '../../common/editor-files'
import type {IGitFile} from '../../git/g8-dto'

const SAVE_DEBOUNCE_DELAY = 750 as const

const attachModelListeners = (
  model: ITextModel,
  monaco: Monaco,
  key: string,
  modelStates: Record<string, ModelState>,
  saveFiles: CallableAction<any>,
  saveSemaphore: SaveSemaphore,
  file: IGitFile
) => {
  let needsRelint = false
  let isLinting = false

  const maybeLint = async () => {
    const {path} = model.uri
    if (!JS_FILES.includes(fileExt(path))) {
      return
    }
    if (isLinting) {
      needsRelint = true
      return
    }
    isLinting = true
    const data = await getMonacoLintMarkers(model.getValue(), path)

    monaco.editor.setModelMarkers(model, 'eslint', data.markers)
    isLinting = false
    if (needsRelint) {
      needsRelint = false
      maybeLint()
    }
  }

  const modelState = modelStates[key]
  const maybeFlush = async () => {
    // NOTE(johnny): If there is already an active save, we debounce the pending save.
    if (modelState.activeSave) {
      clearTimeout(modelState.debounceTimer)
      modelState.debounceTimer = setTimeout(maybeFlush, SAVE_DEBOUNCE_DELAY)
      return
    }

    const latestFile = modelState.latestGitFile
    const initialContentToSave = model.getValue()
    if (latestFile.content === initialContentToSave) {
      modelState.pendingSave = false
      return
    }

    modelState.pendingSave = false
    modelState.activeSave = true
    modelState.activeSavePromise = (async () => {
      await saveFiles(latestFile.repoId, [
        {filePath: latestFile.filePath, content: initialContentToSave},
      ])
      if (modelState.needsDispose && model.getValue() !== initialContentToSave) {
        await saveFiles(latestFile.repoId, [
          {filePath: latestFile.filePath, content: model.getValue()},
        ])
      }
      modelState.activeSave = false
      modelState.needsDispose = false
    })()
    await modelState.activeSavePromise
  }

  if (!isDependencyPath(file.filePath)) {
    model.onDidChangeContent(() => {
      clearTimeout(modelState.debounceTimer)
      maybeLint()
      modelState.debounceTimer = setTimeout(maybeFlush, SAVE_DEBOUNCE_DELAY)
      modelState.pendingSave = true
    })
  }

  const disposeSave = async () => {
    clearTimeout(modelState.debounceTimer)
    if (modelState.activeSave) {
      modelState.needsDispose = true
      modelState.pendingSave = false
      await modelState.activeSavePromise
    } else if (modelState.pendingSave) {
      await maybeFlush()
    }
  }

  modelState.saveSemaphoreSubscription = saveSemaphore.subscribe(disposeSave)

  model.onWillDispose(async () => {
    saveSemaphore.unsubscribe(modelState.saveSemaphoreSubscription)
    await disposeSave()
    delete modelStates[key]
  })

  maybeLint()
}

export {
  attachModelListeners,
}
