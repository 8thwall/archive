import type {DeepReadonly} from 'ts-essentials'

type ExternalSignInIdsKeys = 'CLIENT_ID_APPLE' | 'REDIRECT_URI_APPLE' | 'CLIENT_ID_GOOGLE'

type ExternalSignInIds = {[key in ExternalSignInIdsKeys]: string}

// TODO(johnny): These are temp ids for development purposes. Replace with permanent ones.
const QA_IDS: ExternalSignInIds = {
  'CLIENT_ID_APPLE': 'com.<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.dev',
  // NOTE(johnny): We might need to use an exact url for the redirect instead of a domain.
  'REDIRECT_URI_APPLE': 'https://www-cd.qa.8thwall.com',
  // eslint-disable-next-line max-len
  'CLIENT_ID_GOOGLE': '<REMOVED_BEFORE_OPEN_SOURCING>-<REMOVED_BEFORE_OPEN_SOURCING>.apps.googleusercontent.com',
} as const

const PROD_IDS: ExternalSignInIds = {
  'CLIENT_ID_APPLE': 'com.<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>.prod',
  'REDIRECT_URI_APPLE': BuildIf.MATURE ? 'https://www-cd.8thwall.com' : 'https://www.8thwall.com',
  // eslint-disable-next-line max-len
  'CLIENT_ID_GOOGLE': '<REMOVED_BEFORE_OPEN_SOURCING>-<REMOVED_BEFORE_OPEN_SOURCING>.apps.googleusercontent.com',
} as const

const getExternalSignInIds = (): DeepReadonly<ExternalSignInIds> => (
  BuildIf.EXPERIMENTAL ? QA_IDS : PROD_IDS
)

export {
  getExternalSignInIds,
}
