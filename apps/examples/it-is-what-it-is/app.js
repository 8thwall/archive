// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import * as googleTagManagerHtml from './gtm.html'
document.body.insertAdjacentHTML('afterbegin', googleTagManagerHtml)

import {customShaders} from './custom-shaders'
const registerShaders = shaders => Object.keys(shaders).map(k => AFRAME.registerShader(k, shaders[k]))
registerShaders(customShaders())

import {flipBtnComponent} from './components'
AFRAME.registerComponent('flip-button', flipBtnComponent)


