import * as googleTagManagerHtml from './gtm.html'
document.body.insertAdjacentHTML('afterbegin', googleTagManagerHtml)

import './index.css'

import {changeColorComponent} from './js/color-change'
AFRAME.registerComponent('change-color', changeColorComponent)

import {gradientSkyShader, gradientSkyPrimitive} from './js/gradient-sky'
AFRAME.registerShader('gradient', gradientSkyShader)
AFRAME.registerPrimitive('gradient-sky', gradientSkyPrimitive)

import {orbitControlsComponent} from './js/orbit-controls'
AFRAME.registerComponent('orbit-controls', orbitControlsComponent)

import {absPinchScaleComponent} from './js/abs-pinch-scale'
AFRAME.registerComponent('absolute-pinch-scale', absPinchScaleComponent)

import {adFlowComponent} from './js/temp-ad-logic'
AFRAME.registerComponent('ad-flow', adFlowComponent)

import {cubeMapRealtimeComponent} from './js/cubemap-realtime'
AFRAME.registerComponent('cubemap-realtime', cubeMapRealtimeComponent)

import {cubeEnvMapComponent} from './js/cubemap-static'
AFRAME.registerComponent('cubemap-static', cubeEnvMapComponent)

import {xrLightComponent, xrLightSystem} from './js/xrlight'
AFRAME.registerComponent('xr-light', xrLightComponent)
AFRAME.registerSystem('xr-light', xrLightSystem)
