import type {DeepReadonly} from 'ts-essentials'

import type {IModule} from '../common/types/models'
import {SOCKET_URL} from '../common/websocket-constants'
import {ModuleEditorSocketBranchEnum as BranchEnum} from './module-editor-constants'
import type {IGit as IGit_} from '../git/g8-dto'
import type {SocketSpecifier} from '../websockets/websocket-pool'

type IGit = DeepReadonly<IGit_>

interface RepoSpec {
  key
  handle
  client
  repoId?
}

const repoSpec = (module: IModule, git: IGit): RepoSpec => {
  const activeClientNames = git?.clients?.filter(({active}) => active).map(({name}) => name) || []
  const cname = (activeClientNames ? activeClientNames[0] : '')
  return {
    key: module?.repoId || '',
    handle: git?.repo?.handle || '',
    client: cname || '',
    repoId: git?.repo?.repoId || '',
  }
}

const repoUrlSpec = (module: IModule, git: IGit): RepoSpec => {
  const {key, handle, client, repoId} = repoSpec(module, git)
  return {
    // TODO(nb): This casing is for urls. Locale-specific lower-casing seems like it doesn't make
    // sense.
    key,  // Doesn't need lower case
    handle: handle.toLocaleLowerCase(),
    client: client.toLocaleLowerCase(),
    repoId,
  }
}

const getWsChannelName = (module: IModule, git: IGit, branch: BranchEnum): string => {
  const {repoId, handle, client} = repoUrlSpec(module, git)

  switch (branch) {
    case (BranchEnum.currentClient):
      if (![repoId, handle, client].every(Boolean)) {
        return null
      }
      return `${repoId}.${handle}-${client}`
    case (BranchEnum.chatChannel):
      if (![repoId, handle].every(Boolean)) {
        return null
      }
      return `${repoId}.${handle}.${branch}`
    default:
      if (!repoId || !branch) {
        return null
      }
      return `${repoId}.${branch}`
  }
}

const getModuleSpecifier = (module: IModule, git: IGit, branch: BranchEnum): SocketSpecifier => {
  const channel = getWsChannelName(module, git, branch)
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

const getModuleBranchSpecifier = (module: IModule, git: IGit) => (branch: BranchEnum) => (
  getModuleSpecifier(module, git, branch)
)

const getModuleSpecifiers = (module: IModule, git: IGit): SocketSpecifier[] => {
  if (!module || !git) {
    return []
  }

  return [
    getModuleSpecifier(module, git, BranchEnum.chatChannel),
    getModuleSpecifier(module, git, BranchEnum.currentClient),
    getModuleSpecifier(module, git, BranchEnum.master),
  ].filter(Boolean)
}

export {
  getModuleSpecifier,
  getModuleSpecifiers,
  getModuleBranchSpecifier,
}
