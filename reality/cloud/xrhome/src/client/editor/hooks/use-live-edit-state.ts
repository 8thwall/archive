import React from 'react'

import {
  useScopedGitFile, useScopedGitActiveClient,
} from '../../git/hooks/use-current-git'
import coreGitActions from '../../git/core-git-actions'
import useActions from '../../common/use-actions'
import type {IGitFile} from '../../git/g8-dto'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'
import {EditorFileLocation, extractFilePath, extractRepoId} from '../editor-file-location'
import {useCurrentRepoId} from '../../git/repo-id-context'

const SAVE_DEBOUNCE_DELAY = 750

interface FileRecord {
  filePath: string
  content: string
  repoId: string

  // The g8 client the record belongs to
  baseClient: string

  // The file state when we started making changes
  originalContent: string
}

const stateNeedsSave = (record: FileRecord) => (
  record.content !== record.originalContent
)

const isStateValid = (
  record: FileRecord, file: IGitFile, currentClient: string, savesInProgress: number
) => {
  if (!record || !file) {
    return false
  }

  // The record has to match the current active file.
  if (record.filePath !== file.filePath) {
    return false
  }

  // Even if the base file didn't change, we need to throw away any pending changes if the client
  // changes.
  if (record.baseClient !== currentClient) {
    return false
  }

  // We could be looking at the same file in a child repo.
  if (record.repoId !== file.repoId) {
    return false
  }

  // NOTE(johnny): If there are any saves in progress for the active file.
  // Use the currentEditorFile contents until the last save finishes.
  if (savesInProgress > 0) {
    return true
  }

  return record.originalContent === file.content
}

interface LiveEditState {
  liveFile: null | {filePath: string, content: string}
  dirty: boolean
  onChange: (content: string) => void
  flush: () => Promise<void>
}

const useLiveEditState = (activeLocation: EditorFileLocation): LiveEditState => {
  const primaryRepoId = useCurrentRepoId()
  const activeFilePath = extractFilePath(activeLocation)
  const repoId = extractRepoId(activeLocation) || primaryRepoId

  const recordKey = `${repoId}:${activeFilePath}`

  const activeReduxFile = useScopedGitFile(repoId, activeFilePath)
  const activeClient = useScopedGitActiveClient(repoId)

  const {saveFiles} = useActions(coreGitActions)

  const saveFilesAbandonable = useAbandonableFunction(saveFiles)

  const [currentEditorFile, setCurrentEditorFile] = React.useState<FileRecord>(null)
  // NOTE(johnny): Stores the number of saves in progress per file.
  const [savesInProgress, setSavesInProgress] = React.useState<Record<string, number>>({})

  // If the "currentEditorFile" applies to a different file, or the file has changed on disk,
  // we should render using the redux state.
  const usingInternalState = isStateValid(
    currentEditorFile, activeReduxFile, activeClient?.name, savesInProgress[recordKey]
  )

  const liveFile = usingInternalState ? currentEditorFile : activeReduxFile
  const dirty = usingInternalState && stateNeedsSave(currentEditorFile)

  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>()
  const flush = React.useCallback(async () => {
    clearTimeout(debounceRef.current)

    // If internal state isn't being used for render, or isn't dirty, skip the save.
    if (!dirty) {
      return
    }

    setSavesInProgress((s) => {
      const newSave = s[recordKey] ? s[recordKey] + 1 : 1
      return ({...s, [recordKey]: newSave})
    })
    try {
      await saveFilesAbandonable(currentEditorFile.repoId, [currentEditorFile])
    } finally {
      setSavesInProgress((s) => {
        const newSave = s[recordKey] - 1
        if (newSave < 0) {
          // eslint-disable-next-line no-console
          console.error('Save count below zero')
          return {...s, [recordKey]: 0}
        }
        return {...s, [recordKey]: newSave}
      })
    }
  }, [usingInternalState, saveFilesAbandonable, currentEditorFile, dirty, recordKey])

  React.useEffect(() => {
    debounceRef.current = setTimeout(flush, SAVE_DEBOUNCE_DELAY)
    return () => clearTimeout(debounceRef.current)
  }, [flush])

  const updateCurrentFileContent = (content: string) => {
    if (usingInternalState) {
      // If we're already using internal state, updates can directly update internal state
      setCurrentEditorFile(s => ({...s, content, repoId}))
    } else if (liveFile) {
      // If we're using the redux state directly, start internal state based on the current state
      // of redux
      setCurrentEditorFile({
        filePath: liveFile.filePath,
        repoId: liveFile.repoId,
        content,
        baseClient: activeClient?.name,
        originalContent: liveFile.content,
      })
    }
  }

  const previousActiveReduxRef = React.useRef<IGitFile>()
  React.useEffect(() => {
    const previous = previousActiveReduxRef.current
    previousActiveReduxRef.current = activeReduxFile

    if (!activeReduxFile || previous === activeReduxFile) {
      return
    }

    if (!usingInternalState) {
      return
    }

    // When the file redux state updates, but we continue to use internal state for the render,
    // we are safe to base our new state on top of the new content.
    setCurrentEditorFile(s => ({
      ...s,
      originalContent: activeReduxFile.content,
      repoId: activeReduxFile.repoId,
    }))
  }, [setCurrentEditorFile, usingInternalState, activeReduxFile])

  return {
    liveFile,
    dirty,
    onChange: updateCurrentFileContent,
    flush,
  }
}

export {
  useLiveEditState,
}
