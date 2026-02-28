import type {IDependencyContext} from './dependency-context'
import type {EditorRouteParams} from './editor-route'
import type {IMultiRepoContext} from './multi-repo-context'
import {
  BACKEND_FOLDER_PREFIX, isDependencyPath, MANIFEST_FILE_PATH, isBackendPath, BACKEND_FILE_EXT,
} from '../common/editor-files'
import {resolveBackendFileLocation} from './backend-config/backend-config-files'

type BaseFileLocation = string

type ScopedFileLocation = {
  filePath: string
  repoId?: string
}

type EditorFileLocation = BaseFileLocation | ScopedFileLocation

const extractFilePath = (location: EditorFileLocation) => (
  typeof location === 'object' ? location?.filePath || '' : location
)

const extractRepoId = (location: EditorFileLocation) => (
  typeof location === 'object' ? location?.repoId || null : null
)

// eslint-disable-next-line arrow-parens
const falsyCompare = <T>(left: T, right: T) => (!left && !right) || left === right

const editorFileLocationEqual = (left: EditorFileLocation, right: EditorFileLocation) => (
  falsyCompare(extractFilePath(left), extractFilePath(right)) &&
  falsyCompare(extractRepoId(left), extractRepoId(right))
)

const maybeAddImplicitExtension = (filepath: string) => {
  if (filepath.startsWith(BACKEND_FOLDER_PREFIX)) {
    return resolveBackendFileLocation(filepath)
  }
  return filepath
}
const maybeRemoveImplicitExtension = (filepath: string) => (
  isBackendPath(filepath) ? filepath.replace(BACKEND_FILE_EXT, '') : filepath
)

const resolveEditorFileLocation = (
  parsedMatch: EditorRouteParams,
  multiRepoContext?: IMultiRepoContext,
  dependencyContext?: IDependencyContext
): EditorFileLocation => {
  if (!parsedMatch) {
    return ''
  }
  if (typeof parsedMatch === 'string') {
    return maybeAddImplicitExtension(parsedMatch)
  }

  if (!multiRepoContext || !dependencyContext) {
    return ''
  }

  if (parsedMatch.isDependencyFile) {
    return dependencyContext.aliasToPath[parsedMatch.moduleAlias]
  }

  // We don't allow resolving a path like /module/my-module/files/manifest.json to the direct JSON
  // file.
  if (parsedMatch.filePath === MANIFEST_FILE_PATH) {
    return ''
  }

  const dependencyPath = dependencyContext.aliasToPath[parsedMatch.moduleAlias]
  const dependencyId = dependencyContext.dependenciesByPath[dependencyPath]?.dependencyId
  const repoId = multiRepoContext.openDependencies[dependencyId]

  if (!repoId) {
    return ''
  }

  return {
    filePath: maybeAddImplicitExtension(parsedMatch.filePath),
    repoId,
  }
}

const deriveEditorRouteParams = (
  location: EditorFileLocation,
  multiRepoContext?: IMultiRepoContext,
  dependencyContext?: IDependencyContext
): EditorRouteParams => {
  const filePath = extractFilePath(location)

  if (isDependencyPath(filePath)) {
    const alias = dependencyContext.dependenciesByPath[filePath]?.alias
    if (alias) {
      return {
        isDependencyFile: true,
        moduleAlias: alias,
      }
    }
  }

  const repoId = extractRepoId(location)
  if (!repoId) {
    return filePath
  }

  const dependencyId = repoId && multiRepoContext.repoIdToDependencyId[repoId]
  const dependencyPath = dependencyId && dependencyContext.dependencyIdToPath[dependencyId]
  const moduleAlias = dependencyPath && dependencyContext.dependenciesByPath[dependencyPath]?.alias
  return {
    filePath: maybeRemoveImplicitExtension(filePath),
    moduleAlias,
  }
}

const extractScopedLocation = (location: EditorFileLocation): ScopedFileLocation => ({
  filePath: extractFilePath(location),
  repoId: extractRepoId(location),
})

const extractTopLevelPath = (location: EditorFileLocation): string => {
  if (typeof location === 'string') {
    return location
  } else if (location.repoId) {
    return ''
  } else {
    return location.filePath
  }
}

// NOTE(christoph): If there's a location that includes the primary repo ID as the repoId,
// we need to remove it, because the canonical form of locations in the primary repo is unset.
// That way an unscoped file path like "my-file.ts" is equivalent to {filePath: "my-file.ts"}.
const stripPrimaryRepoId = (location: EditorFileLocation, primaryRepoId: string) => {
  const result = extractScopedLocation(location)
  if (result.repoId === primaryRepoId) {
    result.repoId = null
  }
  return result
}

const deriveLocationKey = (location: EditorFileLocation): string => {
  const {filePath, repoId} = extractScopedLocation(location)
  return repoId ? `.repos/${repoId}/${filePath}` : filePath
}

const deriveLocationFromKey = (key: string): EditorFileLocation => {
  const match = key?.match(/^.repos\/([^/]+)\/(.*)$/)
  if (match) {
    return {
      repoId: match[1],
      filePath: match[2],
    }
  } else {
    return key || ''
  }
}

// This allows modules to import {subscribe} from 'config'.
const MODULE_CONFIG_MODEL_PATH = 'node_modules/config.ts'

const deriveEditableLocationFromKey = (
  key: string, dependencyContext?: IDependencyContext, multiRepoContext?: IMultiRepoContext
): EditorFileLocation => {
  const location = deriveLocationFromKey(key)
  const filePath = extractFilePath(location)

  if (filePath === MODULE_CONFIG_MODEL_PATH) {
    const repoId = extractRepoId(location)
    const dependencyId = repoId && multiRepoContext?.repoIdToDependencyId[repoId]
    const dependencyPath = dependencyId && dependencyContext?.dependencyIdToPath[dependencyId]

    // If the module is in context of a project, we open the dependency path because we don't render
    // the manifest.json for a module when it is in context.
    if (repoId) {
      return dependencyPath || ''
    } else {
      return MANIFEST_FILE_PATH
    }
  }

  return location
}

export {
  deriveEditorRouteParams,
  extractFilePath,
  extractRepoId,
  editorFileLocationEqual,
  resolveEditorFileLocation,
  extractScopedLocation,
  extractTopLevelPath,
  stripPrimaryRepoId,
  deriveLocationKey,
  deriveLocationFromKey,
  deriveEditableLocationFromKey,
  maybeRemoveImplicitExtension,
  MODULE_CONFIG_MODEL_PATH,
}

export type {
  EditorFileLocation,
  ScopedFileLocation,
}
