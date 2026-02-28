import React, {useMemo} from 'react'
import type {ModuleDependency} from '@nia/reality/shared/module/module-dependency'

import {useTabPaneContext} from './tab-pane-context'
import {useCurrentRepoId} from '../../git/repo-id-context'
import {useSelector} from '../../hooks'
import {useDependencyContext} from '../dependency-context'
import {useMultiRepoContext} from '../multi-repo-context'
import {useFileActionsContext} from '../files/file-actions-context'
import {canCloseTabsInDirection, getPaneTabCount, type EditorTab} from '../tab-state'
import {fileExistsInGit} from '../browsable-multitab-editor-view-helpers'
import {TabbedEditor} from './tabbed-editor'
import {NEW_TAB_PATH} from '../editor-utils'
import {deriveEditableLocationFromKey, extractFilePath} from '../editor-file-location'
import {isBackendPath, isDependencyPath} from '../../common/editor-files'
import type {FileTabInfo} from './sortable-file-tabs'
import {extractBackendFilename} from '../backend-config/backend-config-files'

interface ITabbedEditorPane {
  paneId: number
}

const TabbedEditorPane: React.FC<ITabbedEditorPane> = ({paneId}) => {
  const globalGit = useSelector(s => s.git)
  const repoId = useCurrentRepoId()
  const dependencyContext = useDependencyContext()
  const multiRepoContext = useMultiRepoContext()
  const {
    tabState, paneState, updateTabCustomState, scrollTo,
    closeTabsInPane, closeOtherTabsInPane, closeTabsInDirection,
  } = useTabPaneContext()
  const self = paneState.panes[paneId]
  const {onSelect, onClose} = useFileActionsContext()

  const myTabs = useMemo(() => tabState.tabs.filter(t => t.paneId === self.id), [tabState, self])

  const activeTab: EditorTab = useMemo(() => {
    let highestStackIndex = -1
    let tab
    myTabs.forEach((t) => {
      if (t.stackIndex > highestStackIndex) {
        tab = t
        highestStackIndex = t.stackIndex
      }
    })
    return tab
  }, [myTabs])

  // NOTE(pawel): If there is no tab found at all... do we just display the new tab path?

  const sortableTabs = myTabs.map((tab, index): FileTabInfo => {
    const filePath = extractFilePath(tab)

    let shortFilePath: string
    if (isDependencyPath(filePath)) {
      try {
        const git = globalGit.byRepoId[repoId]
        const parsed = JSON.parse(git.filesByPath[filePath].content) as ModuleDependency
        shortFilePath = parsed.alias
      } catch (err) {
        // Ignore, this isn't critical because we just fallback to displaying path with ".json".
      }
    }
    if (isBackendPath(filePath)) {
      shortFilePath = extractBackendFilename(filePath)
    }

    return {
      paneId,
      filePath,
      repoId: tab.repoId,
      index,
      shortFilePath,
      active: activeTab?.id === tab.id,
      ephemeral: tab.ephemeral,
      deleted: filePath && !fileExistsInGit(globalGit, repoId, tab, multiRepoContext?.subRepoIds),
      onClick: () => onSelect(tab, null, paneId),
      onClose: (e) => { e.stopPropagation(); onClose(tab.id) },
      onCloseAll: getPaneTabCount(tabState, tab.paneId) > 1 &&
        ((e) => { e.stopPropagation(); closeTabsInPane(tab.paneId) }),
      onCloseOther: getPaneTabCount(tabState, tab.paneId) > 1 &&
        ((e) => { e.stopPropagation(); closeOtherTabsInPane(tab.id) }),
      onCloseRight: canCloseTabsInDirection(tabState, tab.id, tab.paneId, 'right') &&
        ((e) => { e.stopPropagation(); closeTabsInDirection(tab.id, 'right') }),
      onCloseLeft: canCloseTabsInDirection(tabState, tab.id, tab.paneId, 'left') &&
        ((e) => { e.stopPropagation(); closeTabsInDirection(tab.id, 'left') }),
    }
  }).filter(t => !!t)

  return (
    <TabbedEditor
      paneId={paneId}
      activeEditorLocation={activeTab}
      tabs={sortableTabs}
      makeNewTab={() => onSelect(NEW_TAB_PATH, null, paneId)}
      scrollTo={scrollTo}  // TODO(pawel) figure this out
      onFilePathChange={(path, options) => {
        onSelect(deriveEditableLocationFromKey(path, dependencyContext, multiRepoContext),
          options)
      }}
      currentTab={activeTab}
      onTabStateChange={cs => updateTabCustomState(activeTab?.id, cs)}
    />
  )
}

export {
  TabbedEditorPane,
}
