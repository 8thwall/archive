// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'
import {textFontComponent, troikaTextComponent, msdfTextComponent} from './font-components'

AFRAME.registerComponent('text-font', textFontComponent())
AFRAME.registerComponent('troika-text-custom', troikaTextComponent())
AFRAME.registerComponent('msdf-font', msdfTextComponent())
