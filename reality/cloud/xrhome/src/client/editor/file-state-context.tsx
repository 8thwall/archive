import React from 'react'

import {
  EditorFileLocation, deriveLocationKey, extractFilePath, extractRepoId,
} from './editor-file-location'
import {useCurrentRepoId} from '../git/repo-id-context'
import {useScopedGitFile} from '../git/hooks/use-current-git'
import {useEvent} from '../hooks/use-event'

type FileState = {
  content: string
}

interface IFileStateContext {
  getFileState: (key: string, gitContent: string) => string
  updateFileState: (key: string, gitContent: string, content: string) => void
  addSubscriber: (key: string) => void
  removeSubscriber: (key: string) => void
}

const FileStateContext = React.createContext<IFileStateContext>(null)

const FileStateContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const fileSubscribersRef = React.useRef<Record<string, number>>({})
  const fileStatesRef = React.useRef<Record<string, FileState>>({})
  // NOTE(johnny): Used to trigger a rerender since refs don't trigger a rerender.
  const setTriggerRerender = React.useState(false)[1]

  // NOTE(johnny): updateFileState triggers a rerender
  const updateFileState = (key: string, gitContent: string, latestContent: string) => {
    if (!key) {
      return
    }

    const newContent = (latestContent && latestContent !== gitContent) ? latestContent : null

    fileStatesRef.current[key] = {
      content: newContent,
    }

    setTriggerRerender(prevTrigger => !prevTrigger)
  }

  // NOTE(johnny): getFileState does not trigger rerender
  const getFileState = (key: string, gitContent: string) => {
    if (!key) {
      return null
    }

    return fileStatesRef.current[key]?.content ?? gitContent
  }

  // NOTE(johnny): addListener does not trigger rerender
  const addSubscriber = (key: string) => {
    if (!key) {
      return
    }

    fileSubscribersRef.current[key] = (fileSubscribersRef.current[key] ?? 0) + 1
  }

  // NOTE(johnny): removeListener does not trigger rerender
  const removeSubscriber = (key: string) => {
    if (!key) {
      return
    }

    fileSubscribersRef.current[key] -= 1

    if (fileSubscribersRef.current[key] === 0) {
      delete fileSubscribersRef.current[key]
      delete fileStatesRef.current[key]
    }
  }

  const value: IFileStateContext = {
    getFileState,
    updateFileState,
    addSubscriber,
    removeSubscriber,
  }

  return (
    <FileStateContext.Provider value={value}>
      {children}
    </FileStateContext.Provider>
  )
}

const useFileContent = (fileLocation: EditorFileLocation): string => {
  const context = React.useContext(FileStateContext)

  const primaryRepoId = useCurrentRepoId()
  const activeFilePath = extractFilePath(fileLocation)
  const repoId = extractRepoId(fileLocation) || primaryRepoId
  const gitContent = useScopedGitFile(repoId, activeFilePath)?.content
  const key = deriveLocationKey(fileLocation)
  const fileContent = context.getFileState(key, gitContent)

  React.useEffect(() => {
    context.updateFileState(key, gitContent, fileContent)
  }, [key, gitContent, fileContent])

  React.useEffect(() => {
    context.addSubscriber(key)
    return () => context.removeSubscriber(key)
  }, [key])

  return fileContent
}

const useUpdateFileContent = (fileLocation: EditorFileLocation): (content: string) => void => {
  const context = React.useContext(FileStateContext)

  const primaryRepoId = useCurrentRepoId()
  const activeFilePath = extractFilePath(fileLocation)
  const repoId = extractRepoId(fileLocation) || primaryRepoId
  const gitContent = useScopedGitFile(repoId, activeFilePath)?.content
  const key = deriveLocationKey(fileLocation)

  React.useEffect(() => {
    context.addSubscriber(key)
    return () => context.removeSubscriber(key)
  }, [key])

  const updateFileState = useEvent(
    (content: string) => context.updateFileState(key, gitContent, content)
  )

  return updateFileState
}

export {
  FileStateContextProvider,
  useFileContent,
  useUpdateFileContent,
}
