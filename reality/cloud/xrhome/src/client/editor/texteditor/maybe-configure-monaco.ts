import React from 'react'
import type {DeepReadonly} from 'ts-essentials'
import {loadWASM} from 'onigasm'

import type {IDisposable, Monaco} from './monaco-types'
import {getAFrameCompletionProvider} from './completion/aframe/aframe-completion-provider'
import {getFileCompletionProvider} from './completion/file-completion-provider'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import type {IGitFile} from '../../git/g8-dto'
import {ECS_DEF_FILE_PATH, GLOBAL_DEF_FILE_PATH} from '../../common/editor-files'

let configuredSet: WeakSet<Monaco>

const updateTypescriptOptions = (monaco: Monaco, ecsDefPath: string | undefined) => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    jsx: monaco.languages.typescript.JsxEmit.React,
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    esModuleInterop: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    paths: ecsDefPath ? {'@8thwall/ecs': [ecsDefPath]} : {},
  })
}

const maybeConfigureMonaco = (monaco: Monaco) => {
  if (!configuredSet) {
    configuredSet = new WeakSet()
  }
  if (configuredSet.has(monaco)) {
    return
  }

  const staticPath = Build8.PLATFORM_TARGET === 'desktop'
    ? 'desktop://dist/static'
    : '/static'
  loadWASM(`${staticPath}/public/onigasm-2.2.5.wasm`)

  configuredSet.add(monaco)

  updateTypescriptOptions(monaco, undefined)

  monaco.languages.registerCompletionItemProvider(['html'],
    getAFrameCompletionProvider(monaco))

  // NOTE(christoph): This was added to hide errors related to importing modules or module config
  // from typescript.
  // TODO(christoph): Solve the errors and remove
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    diagnosticCodesToIgnore: [2307],
  })
}

const useFileCompletionProvider = (monaco: Monaco) => {
  // TODO(johnny): Change to open gits
  const gitFiles = useCurrentGit(git => git.files)
  const prevGitFiles = React.useRef<DeepReadonly<IGitFile[]>>([])
  const disposable = React.useRef<IDisposable>(undefined)

  React.useEffect(() => {
    if (!monaco) {
      return
    }

    // NOTE(johnny): The FileCompletionProvider only needs filePaths
    // and does not care about contents.
    const fileListDifferent = (gitFiles.length !== prevGitFiles.current?.length) ||
    gitFiles?.some(
      (file, idx) => file.filePath !== prevGitFiles.current[idx].filePath
    )
    prevGitFiles.current = gitFiles
    if (!fileListDifferent) {
      return
    }
    // NOTE(johnny): Dispose of the previous item provider before adding the new one.
    disposable.current?.dispose()
    disposable.current = monaco.languages.registerCompletionItemProvider(
      ['html', 'javascript', 'typescript'],
      getFileCompletionProvider(monaco, gitFiles)
    )
  }, [monaco, gitFiles])

  React.useEffect(() => () => {
    disposable.current?.dispose()
  }, [])
}

const injectStudioDefinitions = (monaco: Monaco, ecsDefinitionFile: string) => {
  const ecsDefUri = monaco.Uri.parse(ECS_DEF_FILE_PATH)
  monaco.editor.createModel(ecsDefinitionFile, 'typescript', ecsDefUri)

  // NOTE(johnny): ECS is not a global variable. yet...
  const globalDefUri = monaco.Uri.parse(GLOBAL_DEF_FILE_PATH)
  monaco.editor.createModel(
    // eslint-disable-next-line local-rules/hardcoded-copy
    `// Import type information from '@ecs/runtime'
      import ECS from '@ecs/runtime';

      // Declare a global variable of the type of the default export from the ECS namespace
      declare global {
        var ecs: typeof ECS;
      }`, 'typescript', globalDefUri
  )

  updateTypescriptOptions(monaco, ecsDefUri.toString())
}

const removeStudioDefinitions = (monaco: Monaco) => {
  monaco.editor.getModel(monaco.Uri.parse(ECS_DEF_FILE_PATH))?.dispose()
  monaco.editor.getModel(monaco.Uri.parse(GLOBAL_DEF_FILE_PATH))?.dispose()
  updateTypescriptOptions(monaco, undefined)
}

export {
  maybeConfigureMonaco,
  useFileCompletionProvider,
  injectStudioDefinitions,
  removeStudioDefinitions,
}
