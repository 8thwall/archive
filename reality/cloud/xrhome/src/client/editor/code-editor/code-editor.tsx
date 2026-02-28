import React from 'react'

import type {PersistentEditorSession} from '../hooks/use-persistent-editor-session'
import {getNewestTabbedPaneId, handleSplitPane} from '../pane-state'
import * as EditorTabState from '../tab-state'
import {useTabActions} from '../hooks/use-tab-actions'
import type {MonacoEditor} from '../texteditor/monaco-types'
import {FileStateContextProvider} from '../file-state-context'
import {PaneDisplay} from './pane-display'
import {ITabPaneContext, TabPaneContext} from './tab-pane-context'

interface ICodeEditor {
  editorSession: PersistentEditorSession
  focusedEditor: React.RefObject<MonacoEditor>
  disableSplit?: boolean
  isStandAlone?: boolean
  onPopout?: () => void
}

const CodeEditor: React.FC<ICodeEditor> = ({
  editorSession, focusedEditor, disableSplit, isStandAlone, onPopout,
}) => {
  const {
    tabState, setTabState, paneState, setPaneState, scrollTo, currentFileLocation,
  } = editorSession

  const {
    closeTabsInPane, closeOtherTabsInPane, closeTabsInDirection, switchTab, updateTabState,
  } = useTabActions(editorSession)

  const draggingTab = React.useRef<boolean>()
  const dragTargetPaneId = React.useRef<number>(-1)

  const tabPaneContext: ITabPaneContext = {
    mode: 'app',
    paneState,
    setPaneState,
    tabState,
    setTabState,
    focusedEditor,
    draggingTab,
    dragTargetPaneId,
    updateTabCustomState: updateTabState,
    splitPane: (paneId) => {
      setPaneState((ps) => {
        switchTab(currentFileLocation, null, paneId)
        const newPaneState = handleSplitPane(ps, paneId)
        switchTab(currentFileLocation, {persistent: true}, getNewestTabbedPaneId(newPaneState))
        return newPaneState
      })
    },
    onFocus: (tabId) => {
      setTabState(ts => EditorTabState.handleTabSelect(ts, tabId))
    },
    onDropTab: (oldIndex: number, newIndex: number, srcPaneId: number, targetPaneId: number) => {
      setTabState(
        ts => EditorTabState.handleReorder(ts, oldIndex, newIndex, srcPaneId, targetPaneId)
      )
    },
    scrollTo,  // TODO(johnny): Make this work with multi pane
    closeTabsInPane,
    closeOtherTabsInPane,
    closeTabsInDirection,
    disableSplit,
    isStandAlone,
    onPopout,
  }

  return (
    <div className='main-pane'>
      <TabPaneContext.Provider value={tabPaneContext}>
        <FileStateContextProvider>
          <PaneDisplay />
        </FileStateContextProvider>
      </TabPaneContext.Provider>
    </div>
  )
}

export {CodeEditor}
