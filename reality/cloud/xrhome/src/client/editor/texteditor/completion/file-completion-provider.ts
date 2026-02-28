import type {DeepReadonly} from 'ts-essentials'
import * as path from 'path'

import type {editor, IRange, languages, Monaco} from '../monaco-types'
import type {IGitFile} from '../../../git/g8-dto'
import {isHiddenPath} from '../../../common/editor-files'
import {getTextUntilPosition} from './completion-tools'

const getCurrentFilePath = (model: editor.ITextModel) => model.uri.path.slice(1)

const getRelativePath = (fromFilePath: string, toFilePath: string, isHtmlFile: boolean) => {
  const relativePath = path.relative(fromFilePath, toFilePath).slice(3)
  return relativePath.includes('../') || isHtmlFile
    ? relativePath
    : `./${relativePath}`
}

const getInsertText = (relativeFilePath: string, isHtmlFile: boolean) => (
  isHtmlFile ? relativeFilePath : relativeFilePath.replace(/\.(j|t)sx?$/, '')
)

const getAvailableFiles = (
  monaco: Monaco,
  range: IRange,
  currentFilePath: string,
  typed: string,
  gitFiles: DeepReadonly<IGitFile[]>,
  isHtmlFile: boolean
) => {
  const suggestions = []
  gitFiles.filter(
    file => file.filePath !== currentFilePath && !file.isDirectory && !isHiddenPath(file.filePath)
  ).forEach((file) => {
    const relativeFilePath = getRelativePath(currentFilePath, file.filePath, isHtmlFile)

    if (relativeFilePath.startsWith(typed)) {
      suggestions.push({
        label: relativeFilePath,
        insertText: getInsertText(relativeFilePath, isHtmlFile),
        range,
        kind: monaco.languages.CompletionItemKind.File,
      })
    }
  })
  return suggestions
}

const getFileCompletionProvider = (
  monaco: Monaco, gitFiles: DeepReadonly<IGitFile[]>
): languages.CompletionItemProvider => ({
  provideCompletionItems: (model, position) => {
    // TODO(johnny): Add file completion for modules
    if (model.uri.path.startsWith('/.repos/')) {
      return null
    }
    const textUntilPosition = getTextUntilPosition(model, position)
    const currentFilePath = getCurrentFilePath(model)
    const isHtmlFile = currentFilePath.endsWith('.html')
    const isFileImport = isHtmlFile
      ? /(?:src|href)=("|')/.test(textUntilPosition)
      : /import\s+|(([\s|\n]+from\s+)|(\brequire\b\s*\())["|'][^'^"]*$/.test(textUntilPosition)

    if (!isFileImport) {
      return null
    }

    if (textUntilPosition.endsWith('.') || textUntilPosition.endsWith('/') || isHtmlFile) {
      const typed = textUntilPosition.split(/'|"/).pop()
      const replaceRange: IRange = {
        startLineNumber: position.lineNumber,
        startColumn: position.column - typed.length,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      }
      return {
        suggestions: getAvailableFiles(
          monaco, replaceRange, currentFilePath, typed, gitFiles, isHtmlFile
        ),
      }
    } else {
    // TODO(johnny): Suggest dependency imports here.
      return null
    }
  },
  triggerCharacters: ['\'', '"', '.', '/'],
})

export {
  getFileCompletionProvider,
}
