/* eslint-disable no-bitwise */
import type React from 'react'

import type {MonacoEditor, editor, Monaco} from './monaco-types'

import {VimMode} from '../../../third_party/monaco-vim/src'

const aceKeybindingsActions: {[key: string]: string} = {}

const generateAceKeybindingsMap = (monaco: Monaco) => {
  const KM = monaco.KeyMod
  const KC = monaco.KeyCode

  const addAction = (keys: number, action: string) => {
    aceKeybindingsActions[keys] = action
  }

  addAction(KM.CtrlCmd | KC.KeyD, 'editor.action.deleteLines')
  addAction(KM.CtrlCmd | KM.Shift | KC.KeyD, 'editor.action.duplicateSelection')
  addAction(KM.WinCtrl | KM.Alt | KC.UpArrow, 'editor.action.insertCursorAbove')
  addAction(KM.WinCtrl | KM.Alt | KC.DownArrow, 'editor.action.insertCursorBelow')
  addAction(KM.WinCtrl | KM.Alt | KC.RightArrow, 'editor.action.addSelectionToNextFindMatch')
  addAction(
    KM.WinCtrl | KM.Alt | KC.LeftArrow, 'editor.action.addSelectionToPreviousFindMatch'
  )
  addAction(KM.WinCtrl | KM.Shift | KC.KeyL, 'editor.action.selectHighlights')
  addAction(KM.CtrlCmd | KM.Alt | KC.KeyL, 'editor.fold')
  addAction(KM.CtrlCmd | KC.F1, 'editor.fold')
  addAction(KM.CtrlCmd | KM.Alt | KM.Shift | KC.KeyL, 'editor.unfold')
  addAction(KM.CtrlCmd | KM.Shift | KC.F1, 'editor.unfold')
  addAction(KM.CtrlCmd | KM.Alt | KC.Digit0, 'editor.foldAll')
  addAction(KM.CtrlCmd | KM.Alt | KM.Shift | KC.Digit0, 'editor.unfoldAll')
  addAction(KM.WinCtrl | KM.Shift | KC.KeyU, 'editor.action.transformToLowercase')
  addAction(KM.WinCtrl | KC.KeyU, 'editor.action.transformToUppercase')
}

const addAceKeybindings = (monacoEditor: MonacoEditor, monaco: Monaco) => {
  const defineKeybinding = (keys: number, action: string) => {
    // trigger source: string and payload: any arguments can be left blank
    // (and likely should be optional props)
    monacoEditor.addCommand(keys, () => monacoEditor.trigger('', action, ''))
  }

  if (Object.keys(aceKeybindingsActions).length === 0) {
    generateAceKeybindingsMap(monaco)
  }

  Object.entries(aceKeybindingsActions).forEach(([key, action]) => {
    defineKeybinding(Number(key), action)
  })
}

const enableGlobalKeybindings = (
  monacoEditor: editor.IStandaloneCodeEditor, monaco: Monaco,
  latestLintFileRef: React.MutableRefObject<() => void>,
  showSettingsModal: () => void
) => {
  const KM = monaco.KeyMod
  const KC = monaco.KeyCode

  monacoEditor.addCommand(KM.CtrlCmd | KC.KeyL, () => {})

  monacoEditor.addCommand(
    KM.Alt | KM.Shift | KC.KeyF, () => {
      latestLintFileRef.current?.()
    }
  )
  monacoEditor.addCommand(KM.CtrlCmd | KM.Shift | KC.KeyP,
    () => { monacoEditor.trigger('', 'editor.action.quickCommand', '') })
  monacoEditor.addAction({
    id: 'open-editor-settings',
    label: 'Open Editor Settings',
    run: showSettingsModal,
  })
}

const addVimCommands = (
  build: () => void,
  closeCurrentTab: () => void
) => {
  const defineCommand = (commandName: string, key: string, actions: () => void) => {
    VimMode.Vim.defineEx(commandName, key, actions)
  }
  defineCommand('write', 'w', () => { build() })
  defineCommand('quit', 'q', () => { closeCurrentTab() })
  defineCommand('wq save + quit', 'wq', () => {
    build()
    closeCurrentTab()
  })
  defineCommand('x save + quit', 'x', () => {
    build()
    closeCurrentTab()
  })
}

const clearAceCommands = (monacoEditor: MonacoEditor) => {
  Object.keys(aceKeybindingsActions).map(Number).forEach((keys) => {
    monacoEditor.addCommand(keys, () => {})
  })
}

export {
  addAceKeybindings,
  enableGlobalKeybindings,
  addVimCommands,
  clearAceCommands,
}
