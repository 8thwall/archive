import Hubspot from 'hubspot'

import {THIRD_PARTY_SCOPE} from '../../../server/secret-scopes'
import {SecretsProvider} from '../secrets-provider/secrets-provider-api'

const createAccessTokenHubspot = (): Hubspot => (
  new Hubspot({
    accessToken: SecretsProvider.use().getCachedScope(THIRD_PARTY_SCOPE).hubspotAccessToken,
    checkLimit: true,
  })
)

export {
  createAccessTokenHubspot,
}
