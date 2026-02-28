import type {ModuleTarget, ModuleVersionTarget} from './module-target'

type BuildInfo = {
  buildTime: number,
  refHead: string,
  commitId: string,
  commitMessage?: string
  license: string
}

type VersionInfo = {
  publishTime: number
  buildTime: number
  // TODO(christoph): Are we going to need a separate public-facing route for channels, or are
  // we ok with "leaking" commitId to external users of a channel?
  commitId: string
  patchTarget: ModuleVersionTarget
  versionMessage: string
  versionDescription: string
  deprecated?: boolean,
  license?: string,
}

type ChannelInfo = {
  deployTime: number
  buildTime: number
  // TODO(christoph): Are we going to need a separate public-facing route for channels, or are
  // we ok with "leaking" commitId to external users of a channel?
  commitId: string
  deployMessage: string
}

type VersionPushBody = {
  repoId?: string  // TODO(Johnny): Remove `?` once we update the callers.
  versionMessage: string
  versionDescription: string
  version: ModuleTarget
  target: ModuleTarget
}

type VersionPatchBody = {
  deprecated?: boolean
}

type ModuleVersionsResponse = {
  versions: VersionInfo[]
  preVersions: VersionInfo[]
}

type DependencyTargetsResponse = {
  versions: VersionInfo[]
  preVersions?: VersionInfo[]
  betaChannel?: ChannelInfo
  commits?: BuildInfo[]
}

type ModuleHistoryResponse = {
  history: BuildInfo[]
}

export type {
  BuildInfo,
  ChannelInfo,
  ModuleVersionsResponse,
  DependencyTargetsResponse,
  ModuleHistoryResponse,
  VersionInfo,
  VersionPatchBody,
  VersionPushBody,
}
