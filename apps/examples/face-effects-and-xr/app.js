// Copyright (c) 2020 8th Wall, Inc.

// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {runComboPipeline} from './main'

window.XR8 ? runComboPipeline() : window.addEventListener('xrloaded', runComboPipeline)
