import React from 'react'
import type {DeepReadonly} from 'ts-essentials'
import type {StudioComponentError, StudioComponentMetadata} from '@ecs/shared/studio-component'

import {useOpenGits} from '../git/hooks/use-open-gits'
import type {IGitFile} from '../git/g8-dto'
import {JS_FILES} from '../common/editor-files'
import {fileExt} from '../editor/editor-common'
import {
  EditorFileLocation,
  deriveLocationFromKey,
  deriveLocationKey,
  editorFileLocationEqual,
  stripPrimaryRepoId,
} from '../editor/editor-file-location'
import * as StudioComponents from './studio-components-reducer'
import {getStudioComponents} from '../editor/tooling/eslint'
import {getBuiltinComponentMetadata} from './built-in-schema'
import {useMonaco} from '../../third_party/react-monaco/src'
import {useCurrentRepoId} from '../git/repo-id-context'
import {getMonacoModel} from '../editor/texteditor/monaco-git-sync'
import {useTextEditorContext} from '../editor/texteditor/texteditor-context'

interface IStudioComponentsContext {
  getComponentSchema: (name: string) => DeepReadonly<StudioComponentMetadata> |
  undefined
  listComponents: () => DeepReadonly<string[]>
  getComponentLocation: (name: string) => DeepReadonly<EditorFileLocation> | undefined
  getComponentsFromLocation: (location: EditorFileLocation) => DeepReadonly<string[]>
  errors: DeepReadonly<Record<string, StudioComponentError[]>>
}

const StudioComponentsContext = React.createContext<IStudioComponentsContext>(null)

const MonacoErrorSync = () => {
  const monaco = useMonaco()
  const primaryRepoId = useCurrentRepoId()

  const {errors} = React.useContext(StudioComponentsContext)

  React.useEffect(() => {
    if (!monaco) {
      return undefined
    }

    const buildErrorMarkerList = (locationKey: string) => {
      const locationErrors = errors[locationKey].filter(error => error.location)

      return locationErrors.map((error) => {
        const {message, severity, location} = error
        return {
          startLineNumber: location.startLine,
          endLineNumber: location.endLine,
          startColumn: location.startColumn + 1,
          endColumn: location.endColumn + 1,
          message,
          severity: severity === 'warning'
            ? monaco.MarkerSeverity.Warning
            : monaco.MarkerSeverity.Error,
          source: 'studio-component',
        }
      })
    }

    Object.keys(errors).forEach((locationKey) => {
      const model = getMonacoModel(monaco, deriveLocationFromKey(locationKey), primaryRepoId)
      if (model) {
        monaco.editor.setModelMarkers(model, 'studio-component',
          buildErrorMarkerList(locationKey))
      }
    })

    return () => {
      monaco.editor.getModelMarkers({owner: 'studio-component'}).forEach((marker) => {
        monaco.editor.setModelMarkers(monaco.editor.getModel(marker.resource),
          'studio-component', [])
      })
    }
  }, [monaco, errors])

  return null
}

const StudioComponentsContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const textEditorContext = useTextEditorContext()
  const [{studioComponents, parsingFileCount, errors}, dispatch] = React.useReducer(
    StudioComponents.reducer,
    {
      studioComponents: {},
      parsingFileCount: 0,
      errors: {},
    }
  )

  const primaryRepoId = useCurrentRepoId()
  const gitFiles = useOpenGits(git => git.files)
  const prevJsFileMapRef = React.useRef<Record<string, IGitFile>>({})
  const pendingFilesRef = React.useRef<Record<string, {
    fileContent: string, isParsing: boolean, parseAgain: boolean
  }>>({})

  const removeComponentsFromLocation = (locationKey: string) => {
    dispatch(StudioComponents.addComponents(locationKey, [], []))
  }

  const maybeAddComponentsFromContent = async (locationKey: string, fileContent: string) => {
    if (pendingFilesRef.current[locationKey]?.isParsing) {
      pendingFilesRef.current[locationKey].fileContent = fileContent
      pendingFilesRef.current[locationKey].parseAgain = true
      return
    }
    pendingFilesRef.current[locationKey] = {fileContent, isParsing: true, parseAgain: false}
    dispatch(StudioComponents.incrementParsingFileCount())
    const {componentData, errors: fileErrors} = await getStudioComponents(fileContent)
    dispatch(StudioComponents.decrementParsingFileCount())

    pendingFilesRef.current[locationKey].isParsing = false
    if (pendingFilesRef.current[locationKey].parseAgain) {
      pendingFilesRef.current[locationKey].parseAgain = false
      maybeAddComponentsFromContent(locationKey, pendingFilesRef.current[locationKey].fileContent)
      return
    }
    delete pendingFilesRef.current[locationKey]
    dispatch(StudioComponents.addComponents(locationKey, componentData, fileErrors))
  }

  React.useEffect(() => {
    const jsFileMap: Record<string, IGitFile> = {}

    gitFiles.forEach((files) => {
      const jsFiles = files.filter(
        file => JS_FILES.includes(fileExt(file.filePath))
      )
      jsFiles.forEach((file) => {
        jsFileMap[deriveLocationKey({filePath: file.filePath, repoId: file.repoId})] = file
      })
    })

    // NOTE(johnny) Compare the previous state of the files to the current state to see if
    // anything changed.
    const allKeys = new Set([...Object.keys(jsFileMap), ...Object.keys(prevJsFileMapRef.current)])
    Array.from(allKeys).forEach(async (key) => {
      const contents = jsFileMap[key]?.content
      const prevContents = prevJsFileMapRef.current[key]?.content

      if ((contents !== undefined) !== (prevContents !== undefined)) {
        // NOTE(johnny): The file either got added or removed.
        if (contents === undefined) {
          // NOTE(johnny): Remove the components from that file.
          removeComponentsFromLocation(key)
        } else {
          // NOTE(johnny): Add the components from that file.
          await maybeAddComponentsFromContent(key, contents)
        }
      } else if (contents !== prevContents) {
        // NOTE(johnny): The file got updated. Remove the old components and add the new ones.
        await maybeAddComponentsFromContent(key, contents)
      }
    })
    prevJsFileMapRef.current = jsFileMap
  }, [gitFiles])

  const value = {
    getComponentSchema: (name: string) => (
      getBuiltinComponentMetadata(name) || studioComponents[name]?.metadata
    ),
    listComponents: () => Object.keys(studioComponents),
    getComponentLocation: (name: string) => {
      const locationKey = studioComponents[name]?.locationKey
      return locationKey
        ? stripPrimaryRepoId(deriveLocationFromKey(locationKey), primaryRepoId)
        : undefined
    },
    getComponentsFromLocation: (location: EditorFileLocation) => (
      Object.keys(studioComponents).filter(c => editorFileLocationEqual(
        deriveLocationFromKey(studioComponents[c].locationKey), location
      ))
    ),
    isLoading: parsingFileCount > 0,
    errors,
  }

  return (
    <StudioComponentsContext.Provider value={value}>
      {textEditorContext.editorToUse === 'Monaco' && <MonacoErrorSync />}
      {children}
    </StudioComponentsContext.Provider>
  )
}

const useStudioComponentsContext = () => React.useContext(StudioComponentsContext)

export {
  StudioComponentsContext,
  StudioComponentsContextProvider,
  useStudioComponentsContext,
}

export type {
  IStudioComponentsContext,
}
