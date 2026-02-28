import {Client, Language} from '@googlemaps/google-maps-services-js'

import {THIRD_PARTY_SCOPE} from '../../../server/secret-scopes'
import {SecretsProvider} from '../secrets-provider/secrets-provider-api'

const createGoogleMapsClient = () => {
  const googleMapsClient = new Client()

  return {
    getPlaceDetails: async (placeId: string, fields: string[], language: Language) => (
      googleMapsClient.placeDetails({
        params: {
          language,
          place_id: placeId,
          fields,
          key: (await SecretsProvider.use().getScope(THIRD_PARTY_SCOPE)).googleMapsApiKey,
        },
      })
    ),
  }
}

export {
  createGoogleMapsClient,
}
