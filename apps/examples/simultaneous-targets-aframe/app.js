// Copyright (c) 2021 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {simultaneousTargetComponent} from './simultaneous-targets'
import {artGalleryFrameComponent, artGalleryPrimitive} from './artgallery-components'

AFRAME.registerComponent('simultaneous-targets', simultaneousTargetComponent())
AFRAME.registerComponent('artgalleryframe', artGalleryFrameComponent())
AFRAME.registerPrimitive('artgallery-frame', artGalleryPrimitive())
