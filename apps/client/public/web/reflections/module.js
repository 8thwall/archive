// module.js is the main entry point for your 8th Wall module.
// Code here will execute before the project is loaded.

import {reflectionsComponent} from './reflections'
AFRAME.registerComponent('reflections', reflectionsComponent)

import {xrLightComponent, xrLightSystem} from './xrlight'
AFRAME.registerComponent('xr-light', xrLightComponent)
AFRAME.registerSystem('xr-light', xrLightSystem)
