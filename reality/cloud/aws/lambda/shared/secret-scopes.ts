// @attr(visibility = ["//visibility:public"])

import {SecretsManagerClient, GetSecretValueCommand} from '@aws-sdk/client-secrets-manager'

type ScopeOptions = {
  region: string
  name: string
  prefix?: string
  version: string
}

type SecretScope<T extends string> = {
  load: () => Promise<Record<T, string>>
}

const fetchSecret = async <T extends string>(options: ScopeOptions): Promise<Record<T, string>> => {
  const id = options.prefix ? `/${options.prefix}/${options.name}` : options.name

  const res = await new SecretsManagerClient({
    region: options.region,
  }).send(new GetSecretValueCommand({
    SecretId: id,
    VersionId: options.version,
  }))

  if (res.SecretString) {
    return JSON.parse(res.SecretString)
  } else {
    throw new Error('No secret string returned')
  }
}

const createSecretScope = <T extends string = never>(options: ScopeOptions): SecretScope<T> => {
  let loadPromise: Promise<Record<T, string>> | null = null

  const load = async () => {
    if (!loadPromise) {
      loadPromise = fetchSecret(options)
    }
    return loadPromise
  }

  return {
    load,
  }
}

export {
  createSecretScope,
}

export type {
  SecretScope,
  ScopeOptions,
}
