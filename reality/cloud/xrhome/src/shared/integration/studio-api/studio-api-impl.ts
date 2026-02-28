import aws4 from 'aws4'
import AWS from 'aws-sdk'
import type {Response} from 'express'

import {getModuleTargetParts, ModuleTarget} from '../../module/module-target'
import type {ModuleManifest} from '../../module/module-manifest'
import type {ModuleDependencyData} from '../../module/module-dependency-data'
import type {
  ChannelInfo, ModuleHistoryResponse, ModuleVersionsResponse,
  VersionInfo, VersionPatchBody, VersionPushBody,
} from '../../module/module-target-api'
import {createAuthenticatedApiGateway, FetchResult} from '../../signed-api-gateway'
import type {DependencyHtmlData} from '../../module/dependency-html-data'
import type {ModuleExportRequest} from '../../module/module-export-request'
import type {IRepo} from '../../../client/git/g8-dto'
import type {NaeBuilderRequest} from '../../nae/nae-types'

const createStudioApi = (gatewayUrl: string, prefix: string) => {
  const gateway = createAuthenticatedApiGateway(gatewayUrl, prefix)

  const getUrl = () => gatewayUrl
  const getPrefix = () => prefix

  const signOpts = async preSignOpts => new Promise((resolve, reject) => {
    AWS.config.getCredentials((err, credentials) => {
      if (err) {
        reject(err)
      } else {
        resolve(aws4.sign(preSignOpts, credentials))
      }
    })
  })

  type Deployment = {
    buildTime: number
    commitId: string
    stage: string
  }

  const getDeploy = (repositoryName: string, environment: string) => gateway
    .fetchJson<Deployment>({path: `deploy/${repositoryName}/${environment}`, method: 'GET'})
    .then(r => (r.statusCode === 404 ? {...r, statusCode: 200} : r))  // Rewrite not-found.

  const postDeploy = (repositoryName, environment, commitId) => gateway
    .fetchJson<Omit<Deployment, 'buildTime'>>({
    path: `deploy/${repositoryName}/${environment}`,
    method: 'POST',
    body: {commitId},
  })

  const deleteDeploy = (repositoryName, environment) => gateway
    .fetch({path: `deploy/${repositoryName}/${environment}`, method: 'DELETE'})

  type User = {
    email: string
    // eslint-disable-next-line camelcase
    given_name: string
    // eslint-disable-next-line camelcase
    family_name: string
  }

  const postLand = (
    // eslint-disable-next-line camelcase
    repo: string, branch: string, {email, given_name, family_name}: User, commitMessage: string
  ) => gateway.fetchJson<string>({
    path: `land/${repo}/${branch}`,
    method: 'POST',
    body: {author: {givenName: given_name, familyName: family_name, email}, commitMessage},
  })

  const postNae = (buildRequest: NaeBuilderRequest) => gateway.fetchJson<string>({
    path: 'nae/build', method: 'POST', body: buildRequest,
  })

  const postWebapps = (appKey: string, userUuid: string) => gateway.fetchJson<IRepo>(
    {path: 'webapps', method: 'POST', body: {appKey, userUuid}}
  )

  const getWebapps = (appKey: string, userUuid: string) => gateway.fetchJson<IRepo>({
    path: `webapps?appKey=${appKey}&userUuid=${userUuid}`,
    method: 'GET',
  })

  const send = (res: Response) => (studio: FetchResult<unknown>) => (
    res.status(studio.statusCode).send(studio.data)
  )

  const getRepo = (repoId: string) => gateway.fetchJson<IRepo>({
    path: `repo/${repoId}`,
    method: 'GET',
  })

  const renameRepo = (repositoryName: string, newRepositoryName: string) => gateway.fetch({
    path: `repo/${repositoryName}`,
    method: 'PATCH',
    body: {newRepositoryName},
  })

  const deleteRepo = (repositoryName: string) => gateway.fetch({
    path: `repo/${repositoryName}`,
    method: 'DELETE',
  })

  const createRepo = (repoId: string) => gateway.fetchJson<IRepo>({
    path: `repo/${repoId}`,
    method: 'POST',
  })

  const pathForModuleChannel = (moduleId: string, channelName: string) => (
    `deploy/module/${moduleId}/channel/${channelName}`
  )

  const pathForModuleVersion = (moduleId: string) => (
    `deploy/module/${moduleId}/version`
  )

  const pathForModuleHistory = (moduleId: string) => (
    `module/history/${moduleId}/master`
  )

  const getModuleChannel = (moduleId: string, channelName: string) => (
    gateway.fetchJson<ChannelInfo>({
      method: 'GET',
      path: pathForModuleChannel(moduleId, channelName),
    })
  )

  const postModuleChannel = (moduleId: string, channelName: string, target: ModuleTarget) => (
    gateway.fetchJson<ChannelInfo>({
      method: 'POST',
      path: pathForModuleChannel(moduleId, channelName),
      body: target,
    })
  )

  const getModuleVersions = (moduleId: string) => (
    gateway.fetchJson<ModuleVersionsResponse>({
      method: 'GET',
      path: pathForModuleVersion(moduleId),
    })
  )

  const postModuleVersion = (moduleId: string, body: VersionPushBody) => (
    gateway.fetchJson<VersionInfo>({
      method: 'POST',
      path: pathForModuleVersion(moduleId),
      body,
    })
  )

  const getModuleHistory = (moduleId: string) => (
    gateway.fetchJson<ModuleHistoryResponse>({
      method: 'GET',
      path: pathForModuleHistory(moduleId),
    })
  )

  type GetModuleTargetOptions = {
    includeManifest: boolean
    includeReadme: boolean
  }

  type GetModuleResponse = {
    manifest?: ModuleManifest
    readme?: string
  }

  const getModuleTarget = (
    moduleId: string, target: ModuleTarget, options?: GetModuleTargetOptions
  ) => {
    const query = new URLSearchParams()
    if (options?.includeManifest) {
      query.set('includeManifest', 'true')
    }
    if (options?.includeReadme) {
      query.set('includeReadme', 'true')
    }
    return gateway.fetchJson<GetModuleResponse>({
      method: 'GET',
      path: `module/target/${moduleId}/${getModuleTargetParts(target).join('/')}?${query}`,
    })
  }

  const patchModuleTarget = (
    moduleId: string, target: ModuleTarget, body: VersionPatchBody
  ) => gateway.fetchJson<VersionInfo>({
    method: 'PATCH',
    path: `module/target/${moduleId}/${getModuleTargetParts(target).join('/')}`,
    body,
  })

  const putModuleDependency = (dependencyId: string, importInfo: ModuleDependencyData) => (
    gateway.fetchJson<ModuleDependencyData>({
      method: 'PUT',
      path: `dependency/${dependencyId}`,
      body: importInfo,
    })
  )

  const ensureModuleDependency = (importInfo: ModuleDependencyData) => (
    gateway.fetchJson<ModuleDependencyData & {dependencyId: string}>({
      method: 'PUT',
      path: 'dependency',
      body: importInfo,
    })
  )

  const fetchDependencyData = (dependencyId: string) => gateway.fetchJson<ModuleDependencyData>({
    method: 'GET',
    path: `dependency/${dependencyId}`,
  })

  const postModuleExportDependency = (body: ModuleExportRequest) => (
    gateway.fetchJson<DependencyHtmlData>({method: 'POST', path: 'dependencies/export', body})
  )

  type CreateSecretRequest = {
    secretValue: string
    appUuid: string
    accountUuid: string
  }

  type CreateSecretResponse = {
    secretId: string
  }

  const addBackendSecret = (body: CreateSecretRequest) => (
    gateway.fetchJson<CreateSecretResponse>({method: 'POST', path: 'backend/secrets', body})
  )

  type CreateAccountRequest = {
    accountUuid: string
    createOrIgnore?: boolean
  }

  type CreateAccountResponse = {
    email: string
    accountName: string
  }

  const createBackendAccount = (body: CreateAccountRequest) => (
    gateway.fetchJson<CreateAccountResponse>({method: 'POST', path: 'backend/account', body})
  )

  return {
    getUrl,
    getPrefix,
    deleteDeploy,
    getDeploy,
    getWebapps,
    postDeploy,
    postLand,
    postNae,
    postWebapps,
    send,
    signOpts,
    getRepo,
    renameRepo,
    deleteRepo,
    createRepo,
    getModuleChannel,
    postModuleChannel,
    getModuleVersions,
    postModuleVersion,
    getModuleHistory,
    getModuleTarget,
    patchModuleTarget,
    putModuleDependency,
    ensureModuleDependency,
    fetchDependencyData,
    postModuleExportDependency,
    addBackendSecret,
    createBackendAccount,
  }
}

export {
  createStudioApi,
}
