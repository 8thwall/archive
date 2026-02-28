// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

AFRAME.registerComponent('animate-texture', {
  init() {
    this.offset = 0
  },
  tick() {
    const mesh = this.el.getObject3D('mesh')
    if (!mesh) {
      return
    }
    mesh.traverse((node) => {
      if (node.isMesh) {
        node.material.map.offset.x = this.offset
        node.material.needsUpdate = true
      }
    })
    this.offset += 0.001
  },
})

AFRAME.registerComponent('animate-cape', {
  init() {
    this.offset = 0
  },
  tick() {
    const mesh = this.el.getObject3D('mesh')
    if (!mesh) {
      return
    }
    mesh.getObjectByName('Cylinder001_0').material.map.repeat.x = 0.5
    mesh.getObjectByName('Cylinder001_0').material.map.repeat.y = 0.5
    mesh.getObjectByName('Cylinder001_0').material.map.offset.x = this.offset
    this.offset += 0.002
  },
})
