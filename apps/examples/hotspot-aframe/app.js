// Copyright (c) 2020 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall web app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './css/index.css'

import {recenterButtonComponent} from './components/recenter.js'
import {tapHotspotComponent} from './components/tap-hotspot.js'
import {tapCloseComponent} from './components/tap-close.js'

window.hideAll = () => {
  document.getElementById('container').classList.add('collapsed')
  const hotspotChildren = document.querySelectorAll('a-text')
  hotspotChildren.forEach(element => element.setAttribute('visible', false))
}

AFRAME.registerComponent('recenter-button', recenterButtonComponent)
AFRAME.registerComponent('tap-hotspot', tapHotspotComponent)
AFRAME.registerComponent('tap-close', tapCloseComponent)
