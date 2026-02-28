import type {DataRealm} from '../../data-realm'
import {entry} from '../../registry'

type SecretsProviderRequest = {
  name: string
  versionId?: string
  raw?: boolean
  versionIdsByRealm?: Record<DataRealm, string>
}

type SecretsProviderApi = {
  getParameter: (opt: SecretsProviderRequest) => Promise<string>
  getSecret: (opt: SecretsProviderRequest) => Promise<any>
  addScope: (name: string, opt: SecretsProviderRequest) => void
  getScope: (name: string) => Promise<any>
  getCachedScope: (name: string) => any
}

const SecretsProvider = entry<SecretsProviderApi>('secrets-provider')

export {
  SecretsProvider,
}

export type {
  SecretsProviderRequest,
}
