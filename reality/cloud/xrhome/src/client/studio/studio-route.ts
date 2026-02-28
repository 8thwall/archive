import type {Location} from 'history'

import type {EditorRouteParams, GetEditorFileRoute} from '../editor/editor-route'
import {getPathForApp} from '../common/paths'

const parseStudioLocation = (location: Location<unknown>): EditorRouteParams => {
  if (!location) {
    return ''
  }
  const params = new URLSearchParams(location.search)
  const fileParam = params.get('file')
  const moduleParam = params.get('module')
  if (fileParam && moduleParam) {
    // is a file in module
    return {filePath: fileParam, moduleAlias: moduleParam}
  }
  if (moduleParam) {
    // is a module manifest json
    return {isDependencyFile: true, moduleAlias: moduleParam}
  }
  if (fileParam) {
    // is a file in project
    return fileParam
  }
  return ''
}

const extractRemainingUrlParams = (
  queryParams: string, toExclude: string[]
): Record<string, string> => {
  const params = new URLSearchParams(queryParams)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    if (!toExclude.includes(key)) {
      result[key] = value
    }
  })
  return result
}

const shouldReturnBasePath = (
  editorParams: EditorRouteParams, stateParams: Record<string, string>
): boolean => editorParams === '' && (!stateParams || Object.keys(stateParams).length === 0)

const getStudioRoute: GetEditorFileRoute = (account, app, editorParams, page, stateParams) => {
  const basePath = getPathForApp(account, app, page)
  if (shouldReturnBasePath(editorParams, stateParams)) {
    return basePath
  }
  const urlParams = new URLSearchParams(stateParams)
  if (editorParams) {
    if (typeof editorParams === 'string') {
      urlParams.set('file', editorParams)
    } else if (editorParams.isDependencyFile) {
      urlParams.set('module', editorParams.moduleAlias)
    } else {
      urlParams.set('module', editorParams.moduleAlias)
      urlParams.set('file', editorParams.filePath)
    }
  }
  return `${basePath}?${urlParams.toString()}`
}

export {
  parseStudioLocation,
  extractRemainingUrlParams,
  getStudioRoute,
}
