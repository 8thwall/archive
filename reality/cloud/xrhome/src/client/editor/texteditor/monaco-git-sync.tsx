import React from 'react'
import type {DeepReadonly} from 'ts-essentials'

import {useMonaco} from '../../../third_party/react-monaco/src'
import useActions from '../../common/use-actions'
import coreGitActions from '../../git/core-git-actions'
import type {IGitFile} from '../../git/g8-dto'
import {useOpenGits} from '../../git/hooks/use-open-gits'
import {useCurrentRepoId} from '../../git/repo-id-context'
import {
  deriveLocationKey, EditorFileLocation, extractScopedLocation,
  MODULE_CONFIG_MODEL_PATH, ScopedFileLocation,
} from '../editor-file-location'
import {useFileCompletionProvider} from './maybe-configure-monaco'
import {useSaveSemaphoreContext} from '../hooks/save-challenge-semaphore'
import {attachModelListeners} from './attach-model-listeners'
import type {Monaco} from './monaco-types'
import {
  EDITOR_DEFINITION_MODALS, MANIFEST_FILE_PATH, STUDIO_DEFINITION_MODALS,
} from '../../common/editor-files'
import {isModuleRepoId} from '../../../shared/repo-id'
import {isCloudStudioApp} from '../../../shared/app-utils'
import {useEnclosedApp} from '../../apps/enclosed-app-context'

const deriveFileKey = (
  file: ScopedFileLocation, primaryRepoId: string
) => deriveLocationKey({
  filePath: file.filePath,
  // NOTE(pawel): Editor locations in browsable-multitab keep repoId null for the primary repo.
  // This ensures uniform model keying between this sync logic and the browsable-multitab locations.
  repoId: file.repoId !== primaryRepoId && file.repoId,
})

const getMonacoModel = (
  monaco: Monaco, file: EditorFileLocation, primaryRepoId: string
) => {
  const key = deriveFileKey(extractScopedLocation(file), primaryRepoId)
  return monaco.editor.getModel(monaco.Uri.file(key))
}

const maybeAddConfigModel = (
  monaco: Monaco, file: IGitFile, uriPaths: Set<string>, primaryRepoId: string
) => {
  if (file.filePath !== MANIFEST_FILE_PATH || !isModuleRepoId(file.repoId)) {
    return
  }

  const key = deriveFileKey({...file, filePath: MODULE_CONFIG_MODEL_PATH}, primaryRepoId)
  const uri = monaco.Uri.file(key)
  uriPaths.add(uri.path)

  if (monaco.editor.getModel(uri)) {
    // NOTE(christoph): In the future we can use the config declarations to inform the typing.
    return
  }

  monaco.editor.createModel(`\
type ConfigChangeHandler = (newConfig: any) => void
interface ConfigProvider {
  subscribe: (onChange: ConfigChangeHandler) => {unsubscribe: () => void}
  update: (newConfig: any) => void
}

const subscribe = null as ConfigProvider['subscribe']
const update = null as ConfigProvider['update']

export {
  subscribe,
  update,
}
`, 'typescript', uri)
}

type ModelState = {
  debounceTimer: ReturnType<typeof setTimeout>
  latestGitFile: IGitFile
  activeSave: boolean
  pendingSave: boolean
  needsDispose: boolean
  activeSavePromise: Promise<void>
  saveSemaphoreSubscription: number
}

const MonacoGitSync: React.FunctionComponent = () => {
  const monaco = useMonaco()
  const primaryRepoId = useCurrentRepoId()
  const gitFiles = useOpenGits(git => git.files)
  const {saveFiles} = useActions(coreGitActions)
  const saveSemaphore = useSaveSemaphoreContext()

  const modelStatesRef = React.useRef<Record<string, ModelState>>({})
  const prevGitFilesRef = React.useRef<DeepReadonly<IGitFile[][]>>(undefined)

  const app = useEnclosedApp()

  React.useEffect(() => {
    if (!monaco) {
      return
    }
    const filesContentChanged = !prevGitFilesRef.current ||
    gitFiles.length !== prevGitFilesRef.current.length ||
    gitFiles.some(
      (files, i) => files.length !== prevGitFilesRef.current[i].length ||
        files.some((file, j) => {
          const prevFile = prevGitFilesRef.current[i][j]
          return !prevFile || file.content !== prevFile.content ||
        file.filePath !== prevFile.filePath
        })
    )
    if (!filesContentChanged) {
      return
    }

    prevGitFilesRef.current = gitFiles

    const definitionModals = app && isCloudStudioApp(app)
      ? STUDIO_DEFINITION_MODALS
      : EDITOR_DEFINITION_MODALS
    const uriPaths = new Set<string>(definitionModals)

    gitFiles.forEach(repo => repo.forEach((file) => {
      if (file.isDirectory) {
        return
      }

      const key = deriveFileKey(file, primaryRepoId)
      const fileUri = monaco.Uri.file(key)
      uriPaths.add(fileUri.path)

      maybeAddConfigModel(monaco, file, uriPaths, primaryRepoId)

      const existingModel = monaco.editor.getModel(fileUri)
      if (existingModel) {
        modelStatesRef.current[key].latestGitFile = file
        const modelNotDirty = file.content === existingModel.getValue() ||
        modelStatesRef.current[key].activeSave || modelStatesRef.current[key].pendingSave
        if (modelNotDirty) {
          return
        }
        existingModel.pushEditOperations(
          [],
          [{
            range: existingModel.getFullModelRange(),
            text: file.content,
          }],
          null
        )
      } else {
        const model = monaco.editor.createModel(file.content, null, fileUri)
        model.setEOL(monaco.editor.EndOfLineSequence.LF)
        if (!modelStatesRef.current[key]) {
          modelStatesRef.current[key] = {
            debounceTimer: undefined,
            latestGitFile: file,
            activeSave: false,
            pendingSave: false,
            needsDispose: false,
            activeSavePromise: Promise.resolve(),
            saveSemaphoreSubscription: null,
          }
        }
        attachModelListeners(
          model, monaco, key, modelStatesRef.current, saveFiles, saveSemaphore, file
        )
      }
    }))
    monaco.editor.getModels().forEach((model) => {
      const {path} = model.uri
      if (!uriPaths.has(path)) {
        model.dispose()
      }
    })
  }, [monaco, gitFiles])

  React.useEffect(() => () => {
    if (monaco) {
      monaco.editor.getModels().forEach(model => model.dispose())
    }
  }, [monaco])

  useFileCompletionProvider(monaco)

  return null
}

export type {ModelState}

export {
  MonacoGitSync,
  getMonacoModel,
}
