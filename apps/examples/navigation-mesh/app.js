// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'

import {characterMoveComponent} from './character-movement'
AFRAME.registerComponent('character-move', characterMoveComponent)

import {responsiveImmersiveComponent} from './responsive-immersive'
AFRAME.registerComponent('responsive-immersive', responsiveImmersiveComponent)

import {navMeshComponent} from './nav-mesh'
AFRAME.registerComponent('navmesh-constraint', navMeshComponent)
