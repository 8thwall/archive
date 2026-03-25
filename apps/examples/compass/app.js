// Copyright (c) 2022 8th Wall, Inc.
/* eslint-disable no-console, max-len */

import './index.css'
import {compassComponent} from './compass'
import {mapLoadingScreenComponent} from './map-loading'

AFRAME.registerComponent('compass', compassComponent)
AFRAME.registerComponent('map-loading-screen', mapLoadingScreenComponent)

// Check Location Permissions at beginning of session
const errorCallback = (error) => {
  if (error.code === error.PERMISSION_DENIED) {
    alert('LOCATION PERMISSIONS DENIED. PLEASE ALLOW AND TRY AGAIN.')
  }
}
navigator.geolocation.getCurrentPosition((pos) => {}, errorCallback)
