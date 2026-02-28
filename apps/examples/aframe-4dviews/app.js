// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
import {hologram4dsComponent, hologram4dsPrimitive} from './hologram-4ds'
AFRAME.registerComponent('holo4ds', hologram4dsComponent())
AFRAME.registerPrimitive('hologram-4ds', hologram4dsPrimitive())
