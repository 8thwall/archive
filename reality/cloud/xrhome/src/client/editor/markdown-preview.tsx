import React from 'react'

import {MarkdownButtonBar} from './markdown-button-bar'
import {UiThemeProvider} from '../ui/theme'
import {useFileContent} from './file-state-context'
import type {EditorFileLocation} from './editor-file-location'
import {RawMarkdownPreview} from './raw-markdown-preview'
import {getMarkdownContent} from './get-markdown-content'
import {useCurrentGit} from '../git/hooks/use-current-git'

interface IMarkdownPreview {
  activeEditorLocation: EditorFileLocation
  previewTheme: string
  toggleRichPreviewTheme: () => void
  toggleRichPreview: () => void
}

const MarkdownPreview: React.FC<IMarkdownPreview> = ({
  activeEditorLocation,
  previewTheme,
  toggleRichPreviewTheme,
  toggleRichPreview,
}) => {
  const fileContent = useFileContent(activeEditorLocation)
  const git = useCurrentGit()
  const content = getMarkdownContent(git.filesByPath, fileContent)
  const theme = previewTheme === 'dark' ? 'dark' : 'light'

  return (
    <UiThemeProvider mode={theme}>
      <MarkdownButtonBar
        isShowingRichPreview
        previewTheme={previewTheme}
        toggleRichPreviewTheme={toggleRichPreviewTheme}
        toggleRichPreview={toggleRichPreview}
      />
      <RawMarkdownPreview content={content} />
    </UiThemeProvider>
  )
}

export {MarkdownPreview}
