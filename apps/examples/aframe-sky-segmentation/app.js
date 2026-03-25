// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall web app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {debugComponent} from './components/sky-debug'
AFRAME.registerComponent('sky-debug', debugComponent)

import {skyBoxComponent} from './components/skybox'
AFRAME.registerComponent('skybox', skyBoxComponent)

import {positioningComponent} from './components/sky-position'
AFRAME.registerComponent('sky-position', positioningComponent)

import {arrowsComponent} from './components/sky-arrows'
AFRAME.registerComponent('sky-arrows', arrowsComponent)

import {recenterComponent} from './components/sky-recenter'
AFRAME.registerComponent('sky-recenter', recenterComponent)

import './index.css'
