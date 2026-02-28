import type {DeepReadonly as RO} from 'ts-essentials'

import type {IApp} from './types/models'
import type {IGit} from '../git/g8-dto'
import {getSinglePath} from '../../shared/asset-pointer'
import {basename} from '../editor/editor-common'
import {isAssetPath} from './editor-files'
import {
  SOCKET_URL,
  EDITOR_SOCKET_BRANCHES,
} from './websocket-constants'
import type {SocketSpecifier} from '../websockets/websocket-pool'
import {makeHostedClientUrl} from '../../shared/hosting-urls'

type RepoContext = RO<{
  git: Pick<IGit, 'clients' | 'repo'>
  app: Pick<IApp, 'appName'>
}>

interface IRepoSpec {
  workspace: string
  appName: string
  handle: string
  client: string
  repositoryName?: string
}

const repoSpec = ({git, app}: RepoContext): IRepoSpec => ({
  workspace: git?.repo?.workspace || '',
  appName: app?.appName || '',
  handle: git?.repo?.handle || '',
  client: git?.clients?.find(e => e.active)?.name || '',
  repositoryName: git?.repo?.repositoryName,
})

const repoUrlSpec = (ctx: RepoContext): IRepoSpec => {
  const {workspace, appName, handle, client} = repoSpec(ctx)
  return {
    // TODO(nb): This casing is for urls. Locale-specific lower-casing seems like it doesn't make
    // sense.
    workspace: workspace.toLocaleLowerCase(),
    appName,  // Doesn't need lower case
    handle: handle.toLocaleLowerCase(),
    client: client.toLocaleLowerCase(),
  }
}

const newUserBranchUrl = (spec: IRepoSpec) => {
  const {workspace, appName, handle, client} = spec
  if (!workspace || !appName || !handle || !client) {
    return null
  }
  return makeHostedClientUrl(workspace, appName, handle, client)
}

const userBranchUrl = (ctx: RepoContext) => newUserBranchUrl(repoUrlSpec(ctx))

const getAssetUrl = (assetPathOnS3: string): string => {
  if (!assetPathOnS3) {
    return null
  }

  return `https://static.8thwall.app${assetPathOnS3}`
}

const getAssetDownloadUrl = (filePath: string, fileContent: string): string => {
  if (!isAssetPath(filePath)) {
    return null
  }

  const assetPathOnS3 = getSinglePath(fileContent)
  if (!assetPathOnS3) {
    return null
  }

  const assetUrl = getAssetUrl(`/download${assetPathOnS3}`)

  return `${assetUrl}?name=${basename(filePath)}`
}

const getWebsocketChannelName = (context: RepoContext, branch: string) => {
  const {workspace, appName, client, handle} = repoUrlSpec(context)

  let remainder
  if (branch === 'editor-chat-channel') {
    if (!handle) {
      return null
    }
    remainder = `${handle}.${branch}`
  } else if (branch === 'current-client') {
    if (!handle || !client) {
      return null
    }
    remainder = `${handle}-${client}`
  } else {
    // Handles master, staging, and production which don't need client/handle customization
    remainder = branch
  }

  if (!workspace || !appName || !remainder) {
    return null
  }

  return `${workspace}.${appName}.${remainder}`
}

const getEditorSocketSpecifier = (context: RepoContext, branch: string): SocketSpecifier => {
  const channel = getWebsocketChannelName(context, branch)
  if (!channel) {
    return null
  }

  const baseUrl = SOCKET_URL

  return {
    baseUrl,
    params: {
      channel,
    },
  }
}

const getEditorSocketSpecifiers = (context: RepoContext): SocketSpecifier[] => (
  EDITOR_SOCKET_BRANCHES.map(branch => getEditorSocketSpecifier(context, branch)).filter(e => e)
)

export {
  repoSpec,
  newUserBranchUrl,
  userBranchUrl,
  getAssetUrl,
  getAssetDownloadUrl,
  getEditorSocketSpecifier,
  getEditorSocketSpecifiers,
  getWebsocketChannelName,
}
