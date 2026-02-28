import React from 'react'
import {SplitPane} from 'react-multi-split-pane'
import {createUseStyles} from 'react-jss'
import {DragDropProvider} from '@dnd-kit/react'

import {useTabPaneContext} from './tab-pane-context'
import {flattenPanes} from '../pane-state'
import {TabbedEditorPane} from './tabbed-editor-pane'

const MIN_SPLIT_PANE_SIZE = 200

const useStyles = createUseStyles({
  paneContainer: {
    overflow: 'auto !important',
  },
  pane: {
    height: '100%',
    width: '100%',
  },
})

interface ISplit {
  paneIds: number[]
}

const Split: React.FC<ISplit> = ({paneIds}) => {
  const classes = useStyles()

  return (
    <SplitPane
      split='vertical'
      minSize={MIN_SPLIT_PANE_SIZE}
      className={classes.paneContainer}
    >
      {paneIds.map(paneId => (
        <div className={classes.pane} key={paneId}>
          {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
          <Pane paneId={paneId} />
        </div>
      ))}
    </SplitPane>
  )
}

interface IPane {
  paneId: number
}

const Pane: React.FC<IPane> = ({paneId}) => {
  const {panes} = useTabPaneContext()?.paneState
  const self = panes[paneId]

  if (self.type === 'root') {
    return <Pane paneId={self.childrenIds[0]} />
  }

  if (self.type === 'tabbed-editor') {
    return <TabbedEditorPane paneId={paneId} />
  }

  if (self.type === 'split') {
    const paneIds = flattenPanes(paneId, panes)
    return <Split paneIds={paneIds} />
  }

  return null
}

const PaneDisplay: React.FC = () => {
  const {draggingTab, dragTargetPaneId, paneState, onDropTab} = useTabPaneContext()
  const startingIndex = React.useRef<number>(-1)

  return (
    <DragDropProvider
      // NOTE(johnny): Types are broken in @dnd-kit/react
      onDragStart={(event: any) => {
        const {source} = event.operation
        draggingTab.current = true
        startingIndex.current = source.index
      }}
      // NOTE(johnny): Types are broken in @dnd-kit/react
      onDragOver={(event: any) => {
        const {source, target} = event.operation
        if (!source || !target ||
          source.sortable.group !== target.sortable.group ||
          source.index === target.index) {
          return
        }
        onDropTab(source.index, target.index, source.sortable.group, target.sortable.group)
      }}
      // NOTE(johnny): Types are broken in @dnd-kit/react
      onDragEnd={(event: any) => {
        const {source} = event.operation
        if (event.canceled) {
          onDropTab(
            source.index, startingIndex.current, source.sortable.group, source.sortable.group
          )
        } else if (dragTargetPaneId.current > -1 &&
          dragTargetPaneId.current !== source.sortable.group) {
          onDropTab(source.index, null, source.sortable.group, dragTargetPaneId.current)
        }
        startingIndex.current = -1
        draggingTab.current = false
        dragTargetPaneId.current = -1
      }}
    >
      <Pane paneId={paneState.rootId} />
    </DragDropProvider>
  )
}

export {
  PaneDisplay,
}
