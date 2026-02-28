import type {Location} from 'history'
import {useLocation} from 'react-router-dom'

import type {SwitchTab} from '../../editor/hooks/use-tab-actions'
import type {EditorTab} from '../../editor/tab-state'
import {useMultiRepoContext} from '../../editor/multi-repo-context'
import {useDependencyContext} from '../../editor/dependency-context'
import {
  deriveEditorRouteParams, editorFileLocationEqual, resolveEditorFileLocation,
} from '../../editor/editor-file-location'
import {parseStudioLocation} from '../studio-route'
import {useLayoutChangeEffect} from '../../hooks/use-change-effect'
import {parseHashFragment} from '../../editor/editor-utils'

type StudioUrlSyncLayoutDeps = [EditorTab, Location<unknown>]

const useStudioUrlSync = (
  curFileLocation: EditorTab,
  isTabsFromLocalForageLoaded: boolean,
  switchTab: SwitchTab,
  setFileUrlParam: (file: string | undefined) => void,
  setModuleUrlParam: (module: string | undefined) => void
) => {
  const location = useLocation()
  const multiRepoContext = useMultiRepoContext()
  const dependencyContext = useDependencyContext()
  const pathLocation = resolveEditorFileLocation(parseStudioLocation(location),
    multiRepoContext, dependencyContext)

  useLayoutChangeEffect<StudioUrlSyncLayoutDeps>(
    ([prevFileLocation, prevLocation]) => {
      if (!isTabsFromLocalForageLoaded || !prevLocation) {
        return
      }

      const prevPathLocation = resolveEditorFileLocation(parseStudioLocation(prevLocation),
        multiRepoContext, dependencyContext)

      const {line, column} = parseHashFragment(location.hash)

      const hashChanged = location.hash &&
      ((location.hash !== prevLocation.hash) || (location.key !== prevLocation.key))

      const paramsNeedsUpdate = !editorFileLocationEqual(curFileLocation, prevFileLocation)
      const editorFileNeedsUpdate = !editorFileLocationEqual(pathLocation, prevPathLocation)

      if (paramsNeedsUpdate) {
        const params = deriveEditorRouteParams(curFileLocation, multiRepoContext,
          dependencyContext)
        if (params === '') {
          return
        }
        if (typeof params === 'string') {
          setFileUrlParam(params)
          setModuleUrlParam(undefined)
        } else {
          // for module manifest jsons and other module files
          setFileUrlParam(params.filePath)
          setModuleUrlParam(params.moduleAlias)
        }
      }

      if (editorFileNeedsUpdate || hashChanged) {
        switchTab(pathLocation, {line, column})
      }
    }, [curFileLocation, location]
  )
}

export {useStudioUrlSync}
