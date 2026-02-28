/* eslint-disable no-bitwise */
import React from 'react'
import uuidv4 from 'uuid/v4'
import {createUseStyles} from 'react-jss'

import type {editor, Monaco} from './monaco-types'
import MonacoEditor, {useMonaco} from '../../../third_party/react-monaco/src'
import {initVimMode} from '../../../third_party/monaco-vim/src'
import {
  enableGlobalKeybindings,
  addAceKeybindings,
  addVimCommands,
  clearAceCommands,
} from './monaco-keybindings'
import type {ScrollTo} from '../hooks/use-ace-scroll'
import dark8 from './themes/dark8.json'
import light8 from './themes/light8.json'
import {useTextEditorContext} from './texteditor-context'
import {isLintablePath} from '../../common/editor-files'
import {FileActionsContext, useFileActionsContext} from '../files/file-actions-context'
import {useEvent} from '../../hooks/use-event'
import DeveloperPreferenceSettingsModal from '../modals/developer-preferences-settings-modal'
import {autoCloseTag} from './completion/auto-close-tag'
import {MONACO_THEME_LOADERS, MonacoTheme} from './monaco-themes'
import {useUserEditorSettings} from '../../user/use-user-editor-settings'
import {useTabPaneContext} from '../code-editor/tab-pane-context'
import {getTopTabInStack} from '../tab-state'
import {maybeWireFormatter} from './maybe-wire-formatter'
import {bindAddCommandContext} from './monaco-bind-command'
import {useUpdateFileContent} from '../file-state-context'
import {deriveLocationFromKey} from '../editor-file-location'
import type {SwitchTab} from '../hooks/use-tab-actions'
import {isBuiltInMonacoFile} from '../is-built-in-monaco-file'
import {useAbandonableEffect} from '../../hooks/abandonable-effect'

interface IMonaco8 {
  activePath: string
  value: string
  onFilePathChange?: SwitchTab
  lintFile: () => void
  scrollTo: ScrollTo
  currentTabId: number
}

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  statusBar: {
    // height of standard input field
    minHeight: '19.8px',
    display: 'flex',
    alignItems: 'center',
  },
})

interface EditorModeObject {
  dispose: () => void
}

type AmdRequire = {
  <T = unknown>(modules: [string], callback: (library: T) => void): void
  config: (config: {paths?: Record<string, string>}) => void
}

interface MonacoEmacs {
  EmacsExtension: {
    new (monaco: editor.IStandaloneCodeEditor): EditorModeObject & {
      start: () => void
    }
  }
}

const Monaco8: React.FC<IMonaco8> = ({
  activePath, value, onFilePathChange, lintFile, scrollTo, currentTabId,
}) => {
  const styles = useStyles()
  const textEditorContext = useTextEditorContext()
  const tabPaneContext = useTabPaneContext()
  const {onFormat} = useFileActionsContext()
  const monacoInitalized = useMonaco()
  const {build, onClose} = React.useContext(FileActionsContext)
  const lintableRulers = isLintablePath(activePath) ? [100] : []

  const setFileState = useUpdateFileContent(deriveLocationFromKey(activePath))

  const [activeEditor, setActiveEditor] = React.useState<editor.IStandaloneCodeEditor>(null)
  const [activeMonaco, setActiveMonaco] = React.useState<Monaco>(null)

  const [isSettingsModalShown, setIsSettingsModalShown] = React.useState(false)

  const blurActiveElement = () => {
    const element = document.activeElement as HTMLElement
    element.blur()
  }

  const editorSettings = useUserEditorSettings()

  const themeName = editorSettings.monacoTheme
  const themeProvider = MONACO_THEME_LOADERS[themeName]

  useAbandonableEffect(async (abandon) => {
    if (activeMonaco && themeProvider) {
      const theme = await abandon(themeProvider())
      activeMonaco.editor.defineTheme(themeName, theme)
      activeMonaco.editor.setTheme(themeName)
    }
  }, [activeMonaco, themeName, themeProvider])

  const showSettingsModal = () => {
    setIsSettingsModalShown(true)
    blurActiveElement()
  }

  const hideSettingsModal = () => {
    setIsSettingsModalShown(false)
    activeEditor?.focus()
  }

  React.useEffect(() => {
    tabPaneContext.focusedEditor.current?.focus()
  }, [textEditorContext.focusCounter])

  const topTab = getTopTabInStack(tabPaneContext.tabState)

  // NOTE(johnny): When we select a tab that is already selected in a pane, only the stackIndex
  // is updated. This effect is used to capture that change and focus on the editor.
  React.useEffect(() => {
    if (topTab.id === currentTabId) {
      activeEditor?.focus()
    }
  }, [topTab.stackIndex, topTab.id, currentTabId, activeEditor])

  const editorModeRef = React.useRef<EditorModeObject>(null)
  const latestLintFileRef = React.useRef<() => void>(null)
  const statusRef = React.useRef(null)

  React.useEffect(() => {
    latestLintFileRef.current = lintFile
  }, [lintFile])

  React.useEffect(() => {
    if (activeEditor && scrollTo) {
      const model = activeEditor.getModel()
      if (model && scrollTo.line <= model.getLineCount() &&
      scrollTo.column <= model.getLineMaxColumn(scrollTo.line)) {
        activeEditor.revealPositionInCenter({
          lineNumber: scrollTo.line, column: scrollTo.column,
        })
      }
    }
  }, [scrollTo, activeEditor])

  const closeCurrentTab = useEvent(() => {
    // NOTE(dale): We have a separate vimMode in monaco8 instance for each pane,
    // but to define a vim command, we rely on global VimMode in monaco-keybindings,
    // so currentTabId is continuously rewritten with multiple panes.
    onClose(getTopTabInStack(tabPaneContext.tabState).id)
  })

  const updateKeyboardHandler = (monacoEditor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    const previousActiveElement = document.activeElement as HTMLElement
    if (editorModeRef.current) {
      editorModeRef.current.dispose()
    }
    switch (editorSettings.keyboardHandler) {
      case 'vim': {
        const vimMode = initVimMode(monacoEditor, statusRef.current)
        editorModeRef.current = vimMode
        addVimCommands(build, closeCurrentTab)
        break
      }
      case 'emacs': {
        // eslint-disable-next-line local-rules/commonjs
        const amdRequire: AmdRequire = (window as any).require
        amdRequire.config({
          paths: {
            'monaco-emacs': '/static/public/monaco-keybindings/monaco-emacs.js',
          },
        })
        amdRequire<MonacoEmacs>(['monaco-emacs'], ({EmacsExtension}) => {
          const emacsMode = new EmacsExtension(monacoEditor)
          emacsMode.start()
          editorModeRef.current = emacsMode
        })
        break
      }
      case 'vscode':
        // eslint-disable-next-line no-bitwise
        monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD,
          () => { monacoEditor.trigger('', 'editor.action.addSelectionToNextFindMatch', '') })
        editorModeRef.current = {
          dispose: () => {
            monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {})
          },
        }
        break
      default:
        addAceKeybindings(monacoEditor, monaco)
        editorModeRef.current = {dispose: () => clearAceCommands(monacoEditor)}
    }
    blurActiveElement()
    previousActiveElement?.focus()
  }

  const activateKeybinding = async (monacoEditor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    updateKeyboardHandler(monacoEditor, monaco)
    enableGlobalKeybindings(monacoEditor, monaco, latestLintFileRef, showSettingsModal)
  }

  const initializeEditor = (monacoEditor: editor.IStandaloneCodeEditor) => {
    const editorContextKeyName = `editor-${uuidv4()}`
    const isEditorFocused = monacoEditor.createContextKey(editorContextKeyName, false)
    monacoEditor.onDidBlurEditorWidget(() => isEditorFocused.set(false))
    monacoEditor.onDidFocusEditorWidget(() => {
      tabPaneContext.focusedEditor.current = monacoEditor
      isEditorFocused.set(true)
    })
    bindAddCommandContext(monacoEditor, editorContextKeyName)
  }

  React.useEffect(() => {
    if (activeEditor && activeMonaco && monacoInitalized) {
      updateKeyboardHandler(activeEditor, activeMonaco)
    }
  }, [editorSettings?.keyboardHandler, activeEditor, activeMonaco, monacoInitalized])

  const onFormatEvent = useEvent(onFormat)

  return (
    <>
      {isSettingsModalShown && <DeveloperPreferenceSettingsModal onClose={hideSettingsModal} />}
      <div className={styles.container}>
        <MonacoEditor
          path={activePath}
          defaultValue={value}
          beforeMount={(monaco: Monaco) => {
            // NOTE(johnny): The json files for these themes were generated using
            // https://vsctim.vercel.app/. The tool translates a vscode theme to a monaco
            // compatible theme. However it keeps all of the tokens even if it doesn't exist
            // in the default monaco tokenizer so the json files are bloated with unused token
            // rules.
            monaco.editor.defineTheme('8th-wall-dark', dark8 as MonacoTheme)
            monaco.editor.defineTheme('8th-wall-light', light8 as MonacoTheme)
          }}
          onMount={(monacoEditor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            maybeWireFormatter(monaco, onFormatEvent)
            setActiveEditor(monacoEditor)
            setActiveMonaco(monaco)
            monacoEditor.onKeyDown(e => autoCloseTag(monaco, monacoEditor, e))
            initializeEditor(monacoEditor)
            if (getTopTabInStack(tabPaneContext.tabState).id === currentTabId) {
              monacoEditor.focus()
            }
            activateKeybinding(monacoEditor, monaco)
          }}
          theme={editorSettings.monacoTheme}
          position={scrollTo}
          options={{
            'smoothScrolling': true,
            'tabSize': 2,
            'renderWhitespace': 'none',
            'guides': {
              indentation: false,
            },
            'fixedOverflowWidgets': true,
            'rulers': lintableRulers,
            'minimap': {
              enabled: editorSettings.minimap,
            },
            'bracketPairColorization.enabled': true,
            'readOnly': isBuiltInMonacoFile(activePath),
          }}
          onChange={setFileState}
          onFilePathChange={onFilePathChange}
          keepCurrentModel
        />
        {editorSettings.keyboardHandler === 'vim' &&
          <code ref={statusRef} className={styles.statusBar} />
      }
      </div>
    </>
  )
}

export {
  Monaco8,
}
