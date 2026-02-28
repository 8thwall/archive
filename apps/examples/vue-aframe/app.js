// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
import './index.css'

Vue.config.ignoredElements = [
  'a-scene',
  'a-assets',
  'a-sky',
  'a-camera',
  'a-cursor',
  'a-animation',
  'a-entity',
  'a-box',
  'a-sphere',
]

const sceneVue = new Vue({
  data: {
    // you can store app state here
  },
  template: `
  <a-scene id="scene" xrextras-loading xrextras-gesture-detector xrextras-runtime-error renderer="colorManagement: true" xrweb="allowedDevices: any">
    <a-camera id="camera" position="0 3 3"></a-camera>
    <a-entity 
      id="model" 
      gltf-model=${require("./assets/sand-castle.glb")}
      class="cantap" 
      xrextras-two-finger-rotate 
      xrextras-pinch-scale 
      scale="2 2 2" 
      shadow="receive: false">
    </a-entity>
    <a-box id="ground" scale="100 2 100" position="0 -1 0" material="shader: shadow" shadow></a-box>
  </a-scene>
`,
})

const sceneRoot = document.createElement('div')
sceneRoot.id = 'scene'
document.body.appendChild(sceneRoot)
sceneVue.$mount('#scene')

const overlayVue = new Vue({
  data: {
    text: 'Recenter',
    showOverlay: true,
  },
  methods: {
    recenter() {
      document.getElementById('scene').emit('recenter')
    },
  },
  template: `
    <button v-if="showOverlay" v-on:click="recenter">{{ text }}</button>
  `,
})

const overlayRoot = document.createElement('div')
overlayRoot.id = 'overlay'
document.body.appendChild(overlayRoot)
overlayVue.$mount('#overlay')
