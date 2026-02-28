// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

// loop animations component
import {loopAnimationComponent} from './components/loop-animations'
AFRAME.registerComponent('loop-animations', loopAnimationComponent())

// replay animations component
import {nextButtonComponent} from './components/replay-animations'
AFRAME.registerComponent('next-button', nextButtonComponent())

// // sample URL: https://playground.8thwall.app/animation-loop-aframe/?scene=replay
const params = new URLSearchParams(document.location.search.substring(1))
const s = params.get('scene') ? params.get('scene') : 'replay'
document.body.insertAdjacentHTML('beforeend', require(`./scenes/${s}.html`))
