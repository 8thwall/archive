import type {SecretValue} from './gateway-types'

const getSecretDisplayText = (secret: SecretValue) => {
  if (secret.length && secret.lastCouple) {
    return secret.lastCouple.padStart(secret.length, '*')
  } else if (secret.length !== undefined) {
    return '*'.repeat(secret.length)
  } else {
    return '*'.repeat(10)
  }
}

export {
  getSecretDisplayText,
}
