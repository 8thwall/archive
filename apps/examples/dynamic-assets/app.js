/* eslint-disable max-len */
// Copyright (c) 2022 8th Wall, Inc.
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import * as desktopScene from './desktop-scene.html'
import * as mobileScene from './mobile-scene.html'

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

if (isMobile) {
  document.body.insertAdjacentHTML('afterbegin', mobileScene)
} else {
  document.body.insertAdjacentHTML('afterbegin', desktopScene)
}
