const AttachComponent = {
  schema: {
    target: {default: ''},
    yOffset: {default: 0},
  },
  update() {
    const targetElement = document.getElementById(this.data.target)
    if (!targetElement) {
      return
    }
    this.target = targetElement.object3D
  },
  tick() {
    if (this.target) {
      this.el.object3D.lookAt(this.el.sceneEl.camera.position.x, 1.5, this.el.sceneEl.camera.position.z)
      this.el.object3D.scale.set(10, 10, 10)
      this.el.object3D.position.set(this.target.position.x, this.target.position.y + this.data.yOffset, this.target.position.z)
    }
  },
}

const browserDetectComponent = {
  init() {
    if (navigator.userAgent.includes('VR')) {
      document.getElementById('almostvr').style.display = 'none'
      document.getElementById('enterVrMessage').style.display = 'flex'
    } else {
      document.getElementById('square').style.pointerEvents = 'none'
      document.getElementById('almostvr').style.display = 'flex'
      document.getElementById('almostvr').style.textAlign = 'center'
      document.getElementById('enterVrMessage').style.display = 'none'
    }
  },
}

const AttachToHeadComponent = {
  schema: {
    target: {default: ''},
  },
  update() {
    const targetElement = document.getElementById(this.data.target)
    if (!targetElement) {
      return
    }
    this.target = targetElement.object3D
  },
  tick() {
    if (this.target) {
      this.el.object3D.lookAt(this.target.position.x, this.target.position.y, this.target.position.z)
      this.el.object3D.position.set(this.target.position.x, this.target.position.y - 0.5, this.target.position.z - 0.5)
    }
  },
}

const SpinComponent = {
  init() {
    const {el} = this

    el.setAttribute('animation__spinner', {
      property: 'object3D.rotation.y',
      from: 0,
      to: 360,
      easing: 'linear',
      dur: 5000,
      loop: true,
    })
  },
}

const LaserControlsComponent = {
  schema: {
    hand: {default: 'right'},
    model: {default: true},
    defaultModelColor: {type: 'color', default: 'grey'},
  },

  init() {
    const {config} = this
    const {data} = this
    const {el} = this
    const self = this
    const modelEnabled = this.data.model && !this.el.sceneEl.hasWebXR
    const controlsConfiguration = {hand: data.hand, model: modelEnabled}

    // Set all controller models.
    el.setAttribute('daydream-controls', controlsConfiguration)
    el.setAttribute('gearvr-controls', controlsConfiguration)
    el.setAttribute('oculus-go-controls', controlsConfiguration)
    el.setAttribute('oculus-touch-controls', controlsConfiguration)
    el.setAttribute('vive-controls', controlsConfiguration)
    el.setAttribute('vive-focus-controls', controlsConfiguration)
    el.setAttribute('windows-motion-controls', controlsConfiguration)

    // WebXR doesn't allow to discriminate between controllers, a default model is used.
    if (this.data.model && this.el.sceneEl.hasWebXR) {
      this.initDefaultModel()
    }

    // Wait for controller to connect, or have a valid pointing pose, before creating ray
    el.addEventListener('controllerconnected', createRay)
    el.addEventListener('controllerdisconnected', hideRay)
    el.addEventListener('controllermodelready', (evt) => {
      createRay(evt)
      self.modelReady = true
    })

    function createRay(evt) {
      const controllerConfig = config[evt.detail.name]

      if (!controllerConfig) {
        return
      }

      // Show the line unless a particular config opts to hide it, until a controllermodelready
      // event comes through.
      const raycasterConfig = AFRAME.utils.extend({
        showLine: true,
      }, controllerConfig.raycaster || {})

      // The controllermodelready event contains a rayOrigin that takes into account
      // offsets specific to the loaded model.
      if (evt.detail.rayOrigin) {
        raycasterConfig.origin = evt.detail.rayOrigin.origin
        raycasterConfig.direction = evt.detail.rayOrigin.direction
        raycasterConfig.showLine = true
      }

      // Only apply a default raycaster if it does not yet exist. This prevents it overwriting
      // config applied from a controllermodelready event.
      if (evt.detail.rayOrigin || !self.modelReady) {
        el.setAttribute('raycaster', raycasterConfig)
      } else {
        el.setAttribute('raycaster', 'showLine', true)
      }

      el.setAttribute('cursor', AFRAME.utils.extend({
        fuse: false,
      }, controllerConfig.cursor))
    }

    function hideRay() {
      el.setAttribute('raycaster', 'showLine', false)
    }
  },

  config: {
    'daydream-controls': {
      cursor: {downEvents: ['trackpaddown', 'triggerdown'], upEvents: ['trackpadup', 'triggerup']},
    },

    'gearvr-controls': {
      cursor: {downEvents: ['triggerdown'], upEvents: ['triggerup']},
      raycaster: {origin: {x: 0, y: 0.0005, z: 0}},
    },

    'oculus-go-controls': {
      cursor: {downEvents: ['triggerdown'], upEvents: ['triggerup']},
      raycaster: {origin: {x: 0, y: 0.0005, z: 0}},
    },

    'oculus-touch-controls': {
      cursor: {downEvents: ['triggerdown'], upEvents: ['triggerup']},
    },

    'vive-controls': {
      cursor: {downEvents: ['triggerdown'], upEvents: ['triggerup']},
    },

    'vive-focus-controls': {
      cursor: {downEvents: ['trackpaddown', 'triggerdown'], upEvents: ['trackpadup', 'triggerup']},
    },

    'windows-motion-controls': {
      cursor: {downEvents: ['triggerdown'], upEvents: ['triggerup']},
      raycaster: {showLine: false},
    },
  },

  initDefaultModel() {
    const modelEl = this.modelEl = document.createElement('a-entity')
    modelEl.setAttribute('geometry', {
      primitive: 'sphere',
      radius: 0.03,
    })
    modelEl.setAttribute('material', {color: this.data.color})
    this.el.appendChild(modelEl)
  },
}

const EXTRAS = {
  components: [
    {name: 'attach', val: AttachComponent},
    {name: 'browser-detect', val: browserDetectComponent},
    {name: 'attach-to-head', val: AttachToHeadComponent},
    {name: 'spin', val: SpinComponent},
    {name: 'custom-laser-controls', val: LaserControlsComponent},
  ],
  primitives: [],
}

export {EXTRAS}
