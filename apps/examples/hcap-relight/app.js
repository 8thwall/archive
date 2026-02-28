// Copyright (c) 2021 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
import {hcapComponent, hcapPrimitive} from './hcap'
import {tapLightsComponent} from './components'

AFRAME.registerComponent('hcap', hcapComponent())
AFRAME.registerPrimitive('holo-cap', hcapPrimitive())
AFRAME.registerComponent('tap-lights', tapLightsComponent)
