import {SecretsManager, SSM} from 'aws-sdk'

import {DataRealm, Environment, getDataRealmForEnvironment} from '../../data-realm'
import type {SecretsProviderRequest} from './secrets-provider-api'

const DEFAULT_PREFIX_BY_REALM: Record<DataRealm, string> = {
  prod: '/Prod/',
  qa: '/Dev/',
} as const

const createSecretsProvider = (env: Environment) => {
  const ssmClient = new SSM()
  const secretsManagerClient = new SecretsManager()

  const scopeDefinitions: Record<string, SecretsProviderRequest> = {}
  const ssmCache: Record<string, ReturnType<typeof getParameterInternal>> = {}
  const secretsCache: Record<string, ReturnType<typeof getSecretInternal>> = {}
  const resolvedSecretsCache: Record<string, any> = {}

  const dataRealm = getDataRealmForEnvironment(env)
  const defaultPrefix = DEFAULT_PREFIX_BY_REALM[dataRealm]
  if (!defaultPrefix) {
    throw new Error(`Unsupported data realm: ${dataRealm}`)
  }

  const deriveFullName = (opts: SecretsProviderRequest) => {
    if (opts.raw) {
      return opts.name
    }
    return `${defaultPrefix}${opts.name}`
  }

  const deriveVersionId = (opts: SecretsProviderRequest) => (
    opts.versionId || opts.versionIdsByRealm?.[dataRealm]
  )

  const deriveSsmFullName = (opts: SecretsProviderRequest) => {
    const versionId = deriveVersionId(opts)
    if (!versionId) {
      return deriveFullName(opts)
    }
    // To query by parameters use "Name": "name:version"
    // eslint-disable-next-line
    // https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_GetParameters.html#systemsmanager-GetParameters-request-Names
    return `${deriveFullName(opts)}:${versionId}`
  }

  const getParameterInternal = async (fullName: string) => {
    const result = await ssmClient.getParameter({
      Name: fullName,
      WithDecryption: true,
    }).promise()
    if (!result.Parameter?.Value) {
      throw new Error(`Did not find parameter with full name: ${fullName}`)
    }
    return result.Parameter.Value
  }

  const getParameter = (opts: SecretsProviderRequest) => {
    const fullName = deriveSsmFullName(opts)
    ssmCache[fullName] = ssmCache[fullName] || getParameterInternal(fullName)
    return ssmCache[fullName]
  }

  const getSecretInternal = async (fullName: string, versionId: string) => {
    const result = await secretsManagerClient.getSecretValue({
      SecretId: fullName,
      VersionId: versionId,
    }).promise()
    if (!result.SecretString) {
      throw new Error(`Did not find secret name: ${fullName}`)
    }
    return JSON.parse(result.SecretString)
  }

  const getAndCacheSecret = async (fullName: string, versionId: string, cacheKey: string) => {
    const val = await getSecretInternal(fullName, versionId)
    resolvedSecretsCache[cacheKey] = val
    return val
  }

  const deriveSecretValues = (opts: SecretsProviderRequest) => {
    const fullName = deriveFullName(opts)
    const versionId = deriveVersionId(opts)
    const cacheKey = versionId ? `${fullName}:${versionId}` : fullName
    return {fullName, versionId, cacheKey}
  }

  const getSecret = (opts: SecretsProviderRequest) => {
    const {fullName, versionId, cacheKey} = deriveSecretValues(opts)
    secretsCache[cacheKey] = secretsCache[cacheKey] ||
                             getAndCacheSecret(fullName, versionId, cacheKey)
    return secretsCache[cacheKey]
  }

  const addScope = (name: string, opts: SecretsProviderRequest) => {
    if (scopeDefinitions[name]) {
      throw new Error(`Cannot define scope: ${name} twice.`)
    }
    if (!deriveVersionId(opts)) {
      throw new Error('Cannot define scope without versionId/versionIdsByRealm.')
    }
    scopeDefinitions[name] = opts
  }

  const getScope = async (name: string) => {
    const opts = scopeDefinitions[name]
    if (!opts) {
      throw new Error(`Scope: ${name} not defined.`)
    }
    return getSecret(opts)
  }

  const getCachedScope = (name: string) => {
    const opts = scopeDefinitions[name]
    if (!opts) {
      throw new Error(`Scope: ${name} not defined.`)
    }
    const {cacheKey} = deriveSecretValues(opts)
    const resolvedValue = resolvedSecretsCache[cacheKey]
    if (!resolvedValue) {
      throw new Error(`Scope: ${name} has not been pre-cached by calling getScope ahead of time.`)
    }
    return resolvedValue
  }

  return {
    getParameter,
    getSecret,
    addScope,
    getScope,
    getCachedScope,
  }
}

export {
  createSecretsProvider,
}
