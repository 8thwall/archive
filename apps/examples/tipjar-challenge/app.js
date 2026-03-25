// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './index.css'

import {holostreamComponent, holostreamPrimitive} from './holostream-component'
import {accessPassComponent} from './access-pass/aframe-component'
const {showAccessPassModal} = require('./access-pass/access-pass-modal')

AFRAME.registerComponent('access-pass', accessPassComponent)
// AFRAME.registerComponent('holostream-component', holostreamComponent())
// AFRAME.registerPrimitive('holostream-hologram', holostreamPrimitive())

AFRAME.registerComponent('glass-material', {
  init: function () {
    // Wait for model to load.
    this.el.addEventListener('model-loaded', () => {
      var model = this.el.getObject3D('mesh'); // Get the Three.js object here
      if (!model) {
        console.error('Model not found');
        return;
      }
      this.applyGlassMaterial(model);
    });
  },

  applyGlassMaterial: function (model) {
    model.traverse((node) => {
      if (node.isMesh && node.name === 'jar') {
        // Assuming hdrEquirect is already defined and loaded
        node.material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          transparent:true,
          opacity:0.4,
          roughness:0.01,
        });
      }
    });
  }
});



AFRAME.registerComponent('jar-listener', {
  init: function () {
    var el = this.el; 
      el.addEventListener('click', function () {
        console.log('User tapped the jar');
        showAccessPassModal()
    });
  }
});

