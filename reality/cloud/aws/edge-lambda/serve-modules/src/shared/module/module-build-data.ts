type ModuleBuildData = {
  buildTime: number
  refHead: string  // TODO(christoph): This matches project builds, but do we prefer "branch" here?
  buildLocation: string
  commitId: string
  commitMessage?: string
  previousBuildLocation?: string
  crossOriginAssets?: boolean
  license?: string
}

type ModuleChannelData = {
  deployTime: number
  deployMessage: string
  buildTime: number
  buildLocation: string
  commitId: string
  sourceTarget: string
}

type ModuleVersionData = {
  buildTime: number
  publishTime: number
  patchTarget: string
  versionMessage: string
  versionDescription: string
  buildLocation: string
  commitId: string
  sourceTarget: string
  deprecated?: boolean
  crossOriginAssets?: boolean
  license?: string
}

export type {
  ModuleBuildData,
  ModuleChannelData,
  ModuleVersionData,
}
