import type {DeepReadonly} from 'ts-essentials'

import {dispatchify} from '../common'
import {
  CLIENT_FILE_PATH,
  isAssetPath,
  JS_FILES,
} from '../common/editor-files'
import {rawActions as rawCoreGitActions} from '../git/core-git-actions'
import type {AsyncThunk, DispatchifiedActions} from '../common/types/actions'
import type {IGitFile, IRepo} from '../git/g8-dto'
import type {ModuleDependency} from '../../shared/module/module-dependency'
import type {ModuleOverrideSettings} from '../../shared/module/module-override-settings'
import type {ModuleManifest} from '../../shared/module/module-manifest'
import authenticatedFetch from '../common/authenticated-fetch'
import type {IPublicAccount, IPublicModule} from '../common/types/models'
import {pathForDependencyImport} from '../common/paths'
import {replaceAlias} from './replace-dependency-alias'
import {fileExt} from './editor-common'
import {getModuleTargetParts, ModuleTarget} from '../../shared/module/module-target'
import {updateTargetsModuleAction} from '../modules/action-types'
import {errorAction} from '../common/error-action'
import {getRepoState} from '../git/repo-state'
import type {ModuleVersionsResponse} from '../../shared/module/module-target-api'
import type {DependenciesById} from '../../shared/module/validate-app-dependencies'
import type {GatewayDefinition} from '../../shared/gateway/gateway-types'

const updateAliasImports =
(repo: IRepo, oldAlias: string, newAlias: string) => async (dispatch, getState) => {
  if (!newAlias || newAlias === '') {
    return
  }

  const curGit = getRepoState(getState, repo)

  // Scan only JS files
  const textFiles = curGit.files.filter(
    f => JS_FILES.includes(fileExt(f.filePath)) && !isAssetPath(f.filePath)
  )

  const filesToSave = textFiles.map((f) => {
    const newContent = replaceAlias(f.content, oldAlias, newAlias)
    if (newContent !== f.content) {
      return {filePath: f.filePath, content: newContent}
    } else {
      return null
    }
  }).filter(Boolean)

  await dispatch(rawCoreGitActions.saveFiles(repo, filesToSave))
}

const changeDependencyAlias = (repo: IRepo, dependencyPath: string, newAlias: string) => (
  async (dispatch) => {
    let oldAlias: string
    // TODO(christoph): Validate alias and ensure not already in use
    await dispatch(rawCoreGitActions.mutateFile(repo, {
      filePath: dependencyPath,
      transform: (latestFile: IGitFile) => {
        const dep: ModuleDependency = JSON.parse(latestFile.content)
        oldAlias = dep.alias
        dep.alias = newAlias
        return JSON.stringify(dep, null, 2)
      },
    }))
    return {oldAlias}
  }
)

const updateDependencyBackends = (
  repo: IRepo,
  dependencyPath: string, backendTemplates: GatewayDefinition[]
) => (rawCoreGitActions.mutateFile(repo, {
  filePath: dependencyPath,
  transform: (latestFile: IGitFile) => {
    const dep: ModuleDependency = JSON.parse(latestFile.content)
    if (!backendTemplates || backendTemplates.length === 0) {
      delete dep.backendTemplates
    } else {
      dep.backendTemplates = backendTemplates
    }
    return JSON.stringify(dep, null, 2)
  },
}))

const updateDependencyTarget = (
  repo: IRepo, dependencyPath: string, newTarget: ModuleTarget
): AsyncThunk<void> => async (dispatch) => {
  await dispatch(rawCoreGitActions.transformFile(repo, dependencyPath, (file: IGitFile) => {
    const latestDep = JSON.parse(file.content) as ModuleDependency
    latestDep.target = newTarget
    return JSON.stringify(latestDep, null, 2)
  }))
}

const fetchModuleImportDependency = (
  moduleUuid: string, appUuid: string
): AsyncThunk<ModuleDependency> => async (dispatch) => {
  const {dependency} = await dispatch(authenticatedFetch<{dependency: ModuleDependency}>(
    pathForDependencyImport(appUuid, moduleUuid),
    {method: 'POST'}
  ))
  return dependency
}

const clearTargetOverride = (repo: IRepo | string, dependencyId: string): AsyncThunk<void> => (
  rawCoreGitActions.mutateFile(repo, {
    filePath: CLIENT_FILE_PATH,
    transform: (latestFile: IGitFile) => {
      const overrides: ModuleOverrideSettings = JSON.parse(latestFile.content)
      if (overrides.moduleTargetOverrides) {
        delete overrides.moduleTargetOverrides[dependencyId]
      }
      return JSON.stringify(overrides, null, 2)
    },
    generate: () => null,  // Don't create the file if it doesn't exist
  })
)

const updateTargetOverride = (
  repo: IRepo | string, dependencyId: string, target: ModuleTarget
): AsyncThunk<void> => {
  const applyUpdate = (latestClient: ModuleOverrideSettings) => {
    // Instantiate moduleTargetOverrides in settings file
    latestClient.moduleTargetOverrides = latestClient.moduleTargetOverrides || {}
    latestClient.moduleTargetOverrides[dependencyId] = target
    return JSON.stringify(latestClient, null, 2)
  }

  return rawCoreGitActions.mutateFile(repo, {
    filePath: CLIENT_FILE_PATH,
    // If client.json exists
    transform: (latestFile: IGitFile) => applyUpdate(JSON.parse(latestFile.content)),
    // Create new .client.json file
    generate: () => applyUpdate({}),
  })
}

const deleteDependency = (repo: IRepo, dependencyPath: string) => async (dispatch, getState) => {
  const file = getRepoState(getState, repo).filesByPath[dependencyPath]
  if (!file) {
    return
  }

  try {
    const {dependencyId} = JSON.parse(file.content) as ModuleDependency

    // Clean up any overrides for the module
    await dispatch(clearTargetOverride(repo, dependencyId))
  } catch {
    // NOTE(johnny): Deleting invalid dependency file, if there was a client override
    // it will be dead data.
  }

  await dispatch(rawCoreGitActions.deleteFile(repo, dependencyPath))
}

type FetchModuleManifestArgs = Pick<
ModuleDependency, 'dependencyId' | 'target' | 'moduleId'
>

type FetchModuleManifestResult = {
  manifest: ModuleManifest
  readme: string
}

const fetchModuleManifest = (
  args: FetchModuleManifestArgs
): AsyncThunk<FetchModuleManifestResult> => (
  async (dispatch) => {
    const {target, dependencyId, moduleId} = args
    const query = new URLSearchParams({
      target: getModuleTargetParts(target).join('/'),
      dependencyId,
    })
    const apiPath = `/v1/module-dependency/manifest/${moduleId}`
    return dispatch(
      authenticatedFetch<FetchModuleManifestResult>(`${apiPath}?${query}`)
    )
  }
)

type ModuleDependencyMetadata = {
  module: IPublicModule
  account: IPublicAccount
}

const fetchModuleMetadata = (
  args: Pick<ModuleDependency, 'dependencyId' | 'moduleId'>
): AsyncThunk<ModuleDependencyMetadata> => (dispatch) => {
  const {dependencyId, moduleId} = args
  const query = new URLSearchParams({dependencyId})
  const apiPath = `/v1/module-dependency/metadata/${moduleId}`
  return dispatch(authenticatedFetch<ModuleDependencyMetadata>(`${apiPath}?${query}`))
}

const pathForTargetsApi = (
  moduleUuid: string, searchParams: URLSearchParams
) => `/v1/module-dependency/targets/${moduleUuid}?${searchParams}`

type FetchModuleTargetsArgs = Pick<ModuleDependency, 'dependencyId' | 'moduleId'>
const fetchModuleTargets = (
  args: FetchModuleTargetsArgs
): AsyncThunk<ModuleVersionsResponse> => async (dispatch) => {
  try {
    const {dependencyId, moduleId} = args
    const params = new URLSearchParams({
      dependencyId,
    })
    const res = await dispatch(
      authenticatedFetch<ModuleVersionsResponse>(pathForTargetsApi(moduleId, params))
    )
    dispatch(updateTargetsModuleAction(moduleId, res))
    return res
  } catch (err) {
    dispatch(errorAction(err.message))
    throw err
  }
}

const fetchModuleExportDependencyHtml = (
  appUuid: string, dependenciesById: Record<string, ModuleDependency>
) => async (dispatch) => {
  const body = JSON.stringify({dependenciesById})
  const apiPath = `/v1/module-dependency/export/${appUuid}`
  return dispatch(authenticatedFetch(apiPath, {method: 'POST', body}))
}

type ProjectDependencies = {
  dependenciesById: DependenciesById
}

const pathForProjectDependencies = (appUuid: string) => `/v1/module-dependency/manage/${appUuid}`

const fetchProjectDependencies = (
  appUuid: string
): AsyncThunk<ProjectDependencies> => async (dispatch) => {
  const apiPath = pathForProjectDependencies(appUuid)
  return dispatch(authenticatedFetch<ProjectDependencies>(apiPath))
}

const updateProjectDependencies = (
  appUuid: string,
  dependenciesById: DeepReadonly<DependenciesById>,
  previousDependenciesById?: DeepReadonly<DependenciesById>
): AsyncThunk<ProjectDependencies> => async (dispatch) => {
  const apiPath = pathForProjectDependencies(appUuid)
  const body = JSON.stringify({dependenciesById, previousDependenciesById})
  return dispatch(authenticatedFetch<ProjectDependencies>(apiPath, {method: 'PATCH', body}))
}

const rawActions = {
  changeDependencyAlias,
  updateDependencyBackends,
  deleteDependency,
  fetchModuleImportDependency,
  fetchModuleTargets,
  updateAliasImports,
  fetchModuleManifest,
  fetchModuleMetadata,
  fetchModuleExportDependencyHtml,
  clearTargetOverride,
  updateTargetOverride,
  updateDependencyTarget,
  fetchProjectDependencies,
  updateProjectDependencies,
}

type DependencyActions = DispatchifiedActions<typeof rawActions>

const dependencyActions = dispatchify(rawActions)

export {
  dependencyActions as default,
  rawActions,
}

export type {
  DependencyActions,
  ModuleDependencyMetadata,
}
