import React from 'react'
import type {MutableRefObject} from 'react'

import type {EditorTabs, CustomState} from '../tab-state'
import type {EditorPanes} from '../pane-state'
import type {ScrollTo} from '../hooks/use-ace-scroll'
import type {MonacoEditor} from '../texteditor/monaco-types'

/* NOTE(johnny):

Outstanding TODOs before launching to 8w workspaces:

3. When splitting panes, figure out what is suppose to happen to the ephemeral tab.
4. Fix loading multiple 3D model tabs on reload.
5. Figure out what to do with module tabs.

*/

interface ITabPaneContext {
  mode: 'app' | 'module'
  tabState: EditorTabs
  paneState: EditorPanes
  focusedEditor: MutableRefObject<MonacoEditor>
  // NOTE(Johnny): We need this still because @dnd-kit/react useDroppable stops
  // working after dropping ~5 tabs into it.
  draggingTab: MutableRefObject<boolean>
  dragTargetPaneId: MutableRefObject<number>
  setTabState: (updateFn: (latest: EditorTabs) => EditorTabs) => void
  setPaneState: (updateFn: (latest: EditorPanes) => EditorPanes) => void
  updateTabCustomState: (tabId: number, cs: CustomState) => void
  splitPane: (paneId: number) => void
  onFocus: (tabId: number) => void
  onDropTab: (oldIndex: number, newIndex: number, srcPaneId: number, targetPaneId: number) => void
  scrollTo: ScrollTo

  closeTabsInPane: (paneId: number) => void
  closeOtherTabsInPane: (tabId: number) => void
  closeTabsInDirection: (tabId: number, direction: 'left' | 'right') => void

  disableSplit?: boolean
  isStandAlone?: boolean
  onPopout?: () => void
}

const TabPaneContext = React.createContext<ITabPaneContext>(null)

const useTabPaneContext = () => React.useContext(TabPaneContext)

export {
  TabPaneContext,
  useTabPaneContext,
}

export type {
  ITabPaneContext,
}
