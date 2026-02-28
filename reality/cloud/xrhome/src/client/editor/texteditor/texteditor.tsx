import React from 'react'
import Measure from 'react-measure'

import {Monaco8} from './monaco8'
import {useTextEditorContext} from './texteditor-context'
import AceEditor from '../../../third_party/react-ace/ace'
import {useTheme} from '../../user/use-theme'
import {useUserEditorSettings} from '../../user/use-user-editor-settings'
import {fileNameToEditorMode} from '../editor-common'
import {useAceSessionRetention} from '../../../third_party/react-ace/use-ace-session-retention'
import {ScrollTo, useAceScroll} from '../hooks/use-ace-scroll'
import {combine} from '../../common/styles'
import type {SwitchTab} from '../hooks/use-tab-actions'

interface ITextEditor {
  activePath: string
  value: string
  onValueChange: (value: string) => void
  onFilePathChange?: SwitchTab

  // Called when focus is lost e.g. onBlur.
  flush: () => void
  handleLint: () => void

  saveDirtyAndBuild?: (evt?: Event) => void
  scrollTo: ScrollTo
  currentTabId: number
}

const TextEditor: React.FC<ITextEditor> = ({
  activePath, value, onValueChange, onFilePathChange, flush, handleLint,
  saveDirtyAndBuild, scrollTo, currentTabId,
}) => {
  const context = useTextEditorContext()
  const themeName = useTheme()
  const userEditorSettings = useUserEditorSettings()

  const aceRef = React.useRef(null)
  const textEditorContext = useTextEditorContext()

  React.useEffect(() => {
    aceRef.current?.editor.focus()
  }, [textEditorContext.focusCounter])

  const {updateAceRef} = useAceSessionRetention({
    aceRef,
    activePath,
    content: value,
  })

  useAceScroll(aceRef, scrollTo)

  const handleResize = () => {
    if (aceRef.current) {
      aceRef.current.editor.resize()
      // NOTE(pawel) ace binds this by default
      // so we get rid of it so it wouldn't interfere with land modal
      delete aceRef.current.editor.commands.commandKeyBinding['cmd-l']
    }
  }

  const renderAce = () => (
    <AceEditor
      mode={fileNameToEditorMode(activePath)}
      theme={`${themeName}8`}
      keyboardHandler={userEditorSettings.keyboardHandler}
      onChange={onValueChange}
      name='content'
      width='100%'
      height='100%'
      onBlur={flush}
      value={value}
      ref={updateAceRef}
      saveDirtyAndBuild={saveDirtyAndBuild}
      lintFile={handleLint}
    />
  )

  const renderMonaco = () => (
    <Monaco8
      activePath={activePath}
      value={value}
      onFilePathChange={onFilePathChange}
      lintFile={handleLint}
      scrollTo={scrollTo}
      currentTabId={currentTabId}
    />
  )

  return (
    <div className={combine(context.editorToUse === 'Ace' && 'code-editor', 'vertical expand-1')}>
      <Measure onResize={handleResize}>
        {({measureRef}) => (
          <div className='expand-1 measure-container' ref={measureRef}>
            {context.editorToUse === 'Ace' && renderAce()}
            {context.editorToUse === 'Monaco' && renderMonaco()}
          </div>
        )}
      </Measure>
    </div>
  )
}

export {
  TextEditor,
}
