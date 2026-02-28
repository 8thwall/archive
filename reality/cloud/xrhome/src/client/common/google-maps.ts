import {Loader} from '@googlemaps/js-api-loader'
import type React from 'react'

import {GOOGLE_MAPS_API_KEY} from '../../shared/google-config'

/* global google */

const ADDRESS_TYPES = {
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'short_name',
}

const PLACE_DETAILS_REQUESTED_FIELDS = [
  'address_components',
  'formatted_address',
]
const AUTOCOMPLETE_REQUESTED_FIELDS = [
  'place_id',
  'formatted_address',
]
const AUTOCOMPLETE_OPTIONS = {
  types: ['(cities)'],
  fields: AUTOCOMPLETE_REQUESTED_FIELDS,
}

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places'],
})

const defaultMapOptions = {
  center: {
    lat: 0,
    lng: 0,
  },
  zoom: 4,
}

// Only load the script once
const loadAPIScript = (() => {
  let loaded = false
  return async () => {
    if (!loaded) {
      await loader.load()
      loaded = true
    }
  }
})()

const getMap = (() => {
  let map_: google.maps.Map

  return async () => {
    try {
      if (map_) {
        return map_
      }

      await loadAPIScript()
      const newMap = new window.google.maps.Map(
        document.getElementById('default-map'),
        defaultMapOptions
      )

      map_ = newMap

      return newMap
    } catch (err) {
      throw new Error(`Map is not instantiated with error: ${err.message}`)
    }
  }
})()

const getPlaceDetailsWithPlaceId = async (placeId: string) => {
  if (!placeId) {
    throw new Error('Cannot get place details; missing place_id')
  }
  const map = await getMap()
  const placesService = new window.google.maps.places.PlacesService(map)
  const request = {
    placeId,
    fields: PLACE_DETAILS_REQUESTED_FIELDS,
  }

  return new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
    placesService.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(place)
      } else {
        reject(new Error(`Fail to get place details with place id: ${placeId}, status: ${status}`))
      }
    })
  })
}

type AddressDisplayTypes = {
  [key: string]: string
}

const addressWithPlaceDetails = async (
  place: google.maps.places.PlaceResult,
  types: AddressDisplayTypes = null
) => {
  if (place?.address_components) {
    const a = place.address_components.reduce((address, ac) => {
      if (!types) {
        // list the full address and use long_name by default
        return address ? `${address}, ${ac.short_name}` : ac.long_name
      } else {
        const type = ac.types.find(t => Object.prototype.hasOwnProperty.call(types, t))
        if (type) {
          const nameType = types[type]
          return address ? `${address}, ${ac[nameType]}` : ac[nameType]
        }
      }
      return address
    }, '')
    return a
  } else {
    throw new Error(`Cannot get address info with place details: ${place}`)
  }
}

const addressWithPlaceId = async (placeId, types: AddressDisplayTypes = null) => {
  if (placeId) {
    const place = await getPlaceDetailsWithPlaceId(placeId)
    return addressWithPlaceDetails(place, types)
  } else {
    throw new Error('Cannot get address info; missing place_id')
  }
}

const formattedAddressWithPlaceId = async (placeId: string) => {
  if (placeId) {
    const {formatted_address: formattedAddress} = await getPlaceDetailsWithPlaceId(placeId)
    return formattedAddress
  } else {
    throw new Error('Cannot get address info; missing place_id')
  }
}

const setAutoCompleteWidget = async (
  handlePlaceSelect: (autoComplete: google.maps.places.Autocomplete) => void,
  autoCompleteRef: React.RefObject<HTMLInputElement>
) => {
  await loadAPIScript()
  const autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    AUTOCOMPLETE_OPTIONS
  )
  autoComplete.addListener('place_changed', () => handlePlaceSelect(autoComplete))
}

export {
  ADDRESS_TYPES,
  addressWithPlaceId,
  formattedAddressWithPlaceId,
  setAutoCompleteWidget,
}
