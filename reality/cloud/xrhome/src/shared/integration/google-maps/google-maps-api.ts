import type {PlaceDetailsResponse, Language} from '@googlemaps/google-maps-services-js'

import {entry} from '../../registry'

interface IGoogleMaps {
  getPlaceDetails: (
    placeId: string,
    fields: string[],
    language: Language
  ) => Promise<PlaceDetailsResponse>
}
const GoogleMaps = entry<IGoogleMaps>('GoogleMaps')

export {GoogleMaps}
