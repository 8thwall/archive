type StageEnum = 'local' | 'dev' | 'staging' | 'prod'

// e.g. a GCP key
interface SigningKey {
/* eslint-disable camelcase */
  client_email: string
  private_key: string
/* eslint-enable camelcase */
}

export type {
  SigningKey,
  StageEnum,
}
