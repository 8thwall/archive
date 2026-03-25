// Copyright (c) 2019 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import curvedMeshComponent from './extras/curved-mesh'
import overrideImageTargetsComponent from './extras/override-image-targets'

AFRAME.registerComponent('xrextras-curved-mesh', curvedMeshComponent)
AFRAME.registerComponent('xrextras-override-image-targets', overrideImageTargetsComponent)


AFRAME.registerState({
  initialState: {
    targetName: 'flower',
    targetGeometry: 'label',
  },
})
