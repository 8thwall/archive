import type {Location, LocationDescriptor} from 'history'
import {useHistory, useLocation} from 'react-router-dom'

import type {EditorTab} from '../tab-state'
import {useLayoutChangeEffect} from '../../hooks/use-change-effect'
import {parseHashFragment} from '../editor-utils'
import {
  EditorFileLocation, editorFileLocationEqual, resolveEditorFileLocation,
} from '../editor-file-location'
import {removeRichSuffixScoped} from '../browsable-multitab-editor-view-helpers'
import type {EditorParams} from '../editor-route-types'
import {editorRouteMatchEqual, parseEditorRouteParams, useEditorParams} from '../editor-route'
import {useMultiRepoContext} from '../multi-repo-context'
import {useDependencyContext} from '../dependency-context'
import type {SwitchTab} from './use-tab-actions'

type UrlSyncLayoutDeps = [EditorTab, EditorParams, Location<unknown>]

const useUrlSync = (
  curFileLocation: EditorTab,
  isTabsFromLocalForageLoaded: boolean,
  switchTab: SwitchTab,
  getLocationFromFile: (file: EditorFileLocation) => LocationDescriptor<unknown>
) => {
  const history = useHistory()
  const location = useLocation()
  const params = useEditorParams()
  const multiRepoContext = useMultiRepoContext()
  const dependencyContext = useDependencyContext()
  const pathLocation = resolveEditorFileLocation(parseEditorRouteParams(params),
    multiRepoContext, dependencyContext)

  useLayoutChangeEffect<UrlSyncLayoutDeps>(
    ([prevFileLocation, prevParams, prevLocation]) => {
      if (!isTabsFromLocalForageLoaded || !prevParams) {
        return
      }

      // This returns the string path for /files routes or an object containing path and moduleAlias
      // when editing module in a project context.
      const curRouteMatch = parseEditorRouteParams(params)
      const prevRouteMatch = parseEditorRouteParams(prevParams)

      // NOTE(christoph): Internally, currentEditorFile.filePath contains ;rich-preview at
      // the end to indicate when a markdown file is in preview mode.
      const currentEditorFile = removeRichSuffixScoped(curFileLocation)
      const previousEditorFile = removeRichSuffixScoped(prevFileLocation)

      const {line, column} = parseHashFragment(location.hash)

      const hashChanged = location.hash &&
      ((location.hash !== prevLocation.hash) || (location.key !== prevLocation.key))

      const pathAndStateMatch = editorFileLocationEqual(pathLocation, currentEditorFile)
      const pathChanged = !editorRouteMatchEqual(prevRouteMatch, curRouteMatch)
      const editorFileChanged = !editorFileLocationEqual(currentEditorFile, previousEditorFile)

      const editorFileNeedsUpdate = !pathAndStateMatch && pathChanged
      const urlNeedsUpdate = !pathAndStateMatch && editorFileChanged

      if (urlNeedsUpdate) {
        history.push(getLocationFromFile(currentEditorFile))
        return
      }

      if (editorFileNeedsUpdate || hashChanged) {
        switchTab(pathLocation, {line, column})
      }
    }, [curFileLocation, params, location]
  )
}

export {
  useUrlSync,
}
