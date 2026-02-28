import {
  SecretsProvider, SecretsProviderRequest,
} from './integration/secrets-provider/secrets-provider-api'

const applyServerEnv = async ({vars, ...opt}: SecretsProviderRequest & {vars: string[]}) => {
  const secret = await SecretsProvider.use().getSecret(opt)

  vars.forEach((name) => {
    if (typeof secret[name] !== 'string') {
      throw new Error(`Missing or invalid secret for: ${name}`)
    }

    // NOTE(christoph): While migrating we can assert that any existing env variables have been
    // mirrored to the secret store accurately. This ensures we've cleaned up the old keys from
    // config before rotating the keys within Secrets Manager.
    if (process.env[name]) {
      if (secret[name] !== process.env[name]) {
        throw new Error(`Mismatch detected between secret env and existing env: ${name}`)
      }
    } else {
      process.env[name] = secret[name]
    }
  })
}

export {
  applyServerEnv,
}
