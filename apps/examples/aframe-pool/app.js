// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall web app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {laserComponent} from './aframe-components/laser'
import {spaceshipComponent} from './aframe-components/spaceship'
import {poolMessageComponent} from './aframe-components/update-pool-message'

AFRAME.registerComponent('laser', laserComponent)
AFRAME.registerComponent('spaceship', spaceshipComponent)
AFRAME.registerComponent('update-pool-message', poolMessageComponent)
