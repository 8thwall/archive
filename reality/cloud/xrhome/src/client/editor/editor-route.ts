import {join} from 'path'
import {useParams} from 'react-router-dom'

import {isDependencyPath} from '../common/editor-files'
import {
  AccountRootSpecifier, AppPathEnum, getPathForDependency, getPathForFile,
  HostingTypeApp, ModulePathEnum,
} from '../common/paths'
import {basename} from './editor-common'
import {EditorParams, isAppEditorParams} from './editor-route-types'

const parseEditorRouteParams = (params: EditorParams) => {
  if (isAppEditorParams(params)) {
    if (params.editorPrefix === AppPathEnum.files) {
      return params.editorSuffix
    } else if (params.editorPrefix === AppPathEnum.modules) {
      if (params.editorSuffix.includes('/')) {
        const parts = params.editorSuffix.split('/')
        if (parts.length >= 3 && parts[1] === ModulePathEnum.files) {
          return {moduleAlias: parts[0], filePath: parts.slice(2).join('/')}
        }
      }
      return {
        isDependencyFile: true,
        moduleAlias: params.editorSuffix,
      }
    } else {
      return ''
    }
  } else {
    // NOTE(johnny): module route only has files/ currently so suffix
    // is always the filename
    return params.filename
  }
}

type EditorRouteParams = ReturnType<typeof parseEditorRouteParams>

type GetEditorFileRoute = (
  account: AccountRootSpecifier, app: HostingTypeApp, paramsOrPath: EditorRouteParams,
  page?: AppPathEnum, paramsToPreserve?: Record<string, string>
) => string

const getEditorFileRoute: GetEditorFileRoute = (account, app, paramsOrPath) => {
  let filePath: string
  if (typeof paramsOrPath === 'string') {
    filePath = paramsOrPath
  } else {
    filePath = paramsOrPath.filePath

    if (paramsOrPath.isDependencyFile) {
      return getPathForDependency(account, app, paramsOrPath.moduleAlias)
    }

    if (paramsOrPath.moduleAlias) {
      return join(
        getPathForDependency(account, app, paramsOrPath.moduleAlias),
        ModulePathEnum.files,
        paramsOrPath.filePath
      )
    }
  }

  return isDependencyPath(filePath)
    ? getPathForDependency(account, app, basename(filePath).split('.')[0])
    : getPathForFile(account, app, filePath)
}

const routeMatchFalsy = (match: EditorRouteParams) => !(
  typeof match === 'object' ? (match?.filePath || match?.isDependencyFile) : match
)

const editorRouteMatchEqual = (left: EditorRouteParams, right: EditorRouteParams) => {
  const leftFalsy = routeMatchFalsy(left)
  const rightFalsy = routeMatchFalsy(right)

  if (leftFalsy || rightFalsy) {
    return leftFalsy === rightFalsy
  }

  if (typeof left === 'string') {
    return left === right
  } else {
    if (typeof right === 'string') {
      return false
    }
    if (left.moduleAlias !== right.moduleAlias) {
      return false
    }
    if (left.isDependencyFile) {
      return right.isDependencyFile
    }
    return left.filePath === right.filePath
  }
}

const useEditorParams = () => useParams<EditorParams>()

export {
  parseEditorRouteParams,
  getEditorFileRoute,
  editorRouteMatchEqual,
  useEditorParams,
}

export type {
  GetEditorFileRoute,
  EditorRouteParams,
}
