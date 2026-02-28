type VersionChannel = {
  name: string
  build: string
}

type AppInfo = {
  version: string
  AccountUuid: string
}

type DevTokenInfo = Partial<{
  uuid: string
  version: string
  AccountUuid: string
  engineUrl: string
  names: string[]
}>

type XrwebVersion = {
  name?: string  // name is undefined if the chosen version is a direct build number.
  build: string
  url: string
  simdUrl: string
  workerScriptUrl?: string  // url where a pthread worker script can load
  chunkPrefix?: string | undefined
  inDevMode: boolean
}

type HostedTokenInfo = {
  appKey: string
  appName: string
}

export type {
  AppInfo,
  DevTokenInfo,
  XrwebVersion,
  VersionChannel,
  HostedTokenInfo,
}
