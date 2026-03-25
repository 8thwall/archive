const radToDeg = rad => rad * (180.0 / Math.PI)
const degToRad = degrees => degrees * Math.PI / 180

// Component that places trees where the ground is clicked
const objectImportComponent = {
  init() {
    const scene = this.el.sceneEl
    const camera = document.getElementById('camera').object3D
    const loadImg = document.getElementById('loadImage')
    const newElement = document.getElementById('model')
    this.hasModel = false

    const getWorldPosition = (object) => {
      const position = new THREE.Vector3()
      position.setFromMatrixPosition(object.matrixWorld)
      return position
    }

    document.getElementById('file').addEventListener('change', () => {
      if (this.hasModel) {
        this.el.emit('clear-model')
      }
      loadImg.style.display = 'block'
      newElement.setAttribute('visible', false)

      const file = document.getElementById('file').files[0]
      const reader = new FileReader()

      scene.emit('recenter')
      newElement.object3D.position.set(0, 0, -3)
      newElement.object3D.rotation.set(0, camera.rotation.y, 0)

      // TODO: scale to fit within bounding box
      newElement.setAttribute('scale', '4 4 4')

      // add interactions
      newElement.classList.add('cantap')
      newElement.setAttribute('xrextras-pinch-scale', '')
      newElement.setAttribute('xrextras-two-finger-rotate', '')
      newElement.setAttribute('xrextras-hold-drag', '')

      // add lighting components
      newElement.setAttribute('shadow', {
        receive: false,
      })
      newElement.setAttribute('reflections', 'type: realtime')

      // TODO: animate in?

      reader.onload = (e) => {
        newElement.setAttribute('gltf-model', e.target.result)
        newElement.setAttribute('visible', true)
      }
      reader.readAsDataURL(file)

      newElement.addEventListener('model-loaded', () => {
        this.hasModel = true
        newElement.setAttribute('model-ui', '')
        loadImg.style.display = 'none'
      })
    })
  },
}

const modelUiComponent = {
  schema: {
    url: {type: 'string'},
  },

  init() {
    const {el} = this
    const {sceneEl} = this.el

    // Initialize dat.GUI
    const gui = new lil.GUI()
    this.gui = gui

    this.cameraCtrl = null
    this.cameraFolder = null
    this.animFolder = null
    this.animCtrls = []
    this.morphFolder = null
    this.morphCtrls = []
    this.skeletonHelpers = []
    this.gridHelper = null
    this.axesHelper = null
    this.content = this.el.object3D

    // Create a settings object
    const settings = {
      envMap: 'basic',
      wireframe: false,
      ambientIntensity: 1,
      ambientColor: '#ffffff',
      directIntensity: 1,
      directColor: '#ffffff',
      playbackSpeed: 1.0,
      actionStates: {},
    }

    const traverseMaterials = (object, callback) => {
      object.traverse((node) => {
        if (!node.isMesh) return
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material]
        materials.forEach(callback)
      })
    }

    gui.add(settings, 'wireframe').onChange(() => {
      traverseMaterials(el.object3D, (material) => {
        material.wireframe = settings.wireframe
      })
    })

    // Add lighting controls
    const lightFolder = gui.addFolder('Scene Lighting')

    const setStaticReflections = (type) => {
      if (type === 'none') {
        el.removeAttribute('reflections')
      } else {
        el.setAttribute('reflections', {
          type: 'static',
          posx: `${type}-px`,
          posy: `${type}-py`,
          posz: `${type}-pz`,
          negx: `${type}-nx`,
          negy: `${type}-ny`,
          negz: `${type}-nz`,
        })
      }
    }

    lightFolder.add(settings, 'envMap', {
      'None': 'none',
      'Basic': 'basic',
      'Room': 'room',
      'Mountain': 'mountain',
      'Ocean': 'ocean',
    }).onChange(() => {
      setStaticReflections(settings.envMap)
    })

    setStaticReflections(settings.envMap)

    const directLightEl = sceneEl.querySelector('#directionalLight')
    lightFolder.add(settings, 'directIntensity', 0, 2).onChange((value) => {
      directLightEl.setAttribute('light', 'intensity', value)
    })

    lightFolder.addColor(settings, 'directColor').onChange((value) => {
      directLightEl.setAttribute('light', 'color', value)
    })

    const ambientLightEl = sceneEl.querySelector('a-light[type="ambient"]')
    lightFolder.add(settings, 'ambientIntensity', 0, 2).onChange((value) => {
      ambientLightEl.setAttribute('intensity', value)
    })

    lightFolder.addColor(settings, 'ambientColor').onChange((value) => {
      ambientLightEl.setAttribute('color', value)
    })
    lightFolder.close()

    const setClips = () => {
      if (this.mixer) {
        this.mixer.stopAllAction()
        this.mixer.uncacheRoot(this.mixer.getRoot())
        this.mixer = null
      }

      this.clips = this.el.object3D?.children?.[0]?.animations || []
      if (!this.clips.length) return

      this.mixer = new THREE.AnimationMixer(this.content)
    }

    const playAllClips = () => {
      this.clips.forEach((clip) => {
        this.mixer.clipAction(clip).reset().play()
        settings.actionStates[clip.name] = true
      })
    }

    // Morph target controls.
    this.morphFolder = gui.addFolder('Morph Targets')
    this.morphFolder.domElement.style.display = 'none'
    this.morphFolder.close()

    // Animation controls.
    this.animFolder = gui.addFolder('Animation')
    this.animFolder.domElement.style.display = 'none'
    const playbackSpeedCtrl = this.animFolder.add(settings, 'playbackSpeed', 0, 1)
    playbackSpeedCtrl.onChange((speed) => {
      if (this.mixer) this.mixer.timeScale = speed
    })
    this.animFolder.add({playAll: () => playAllClips()}, 'playAll')

    const updateGui = () => {
      setClips()

      this.morphCtrls.forEach(ctrl => ctrl.remove())
      this.morphCtrls.length = 0
      this.morphFolder.domElement.style.display = 'none'

      this.animCtrls.forEach(ctrl => ctrl.remove())
      this.animCtrls.length = 0
      this.animFolder.domElement.style.display = 'none'

      const cameraNames = []
      const morphMeshes = []
      this.content.traverse((node) => {
        if (node.isMesh && node.morphTargetInfluences) {
          morphMeshes.push(node)
        }
        if (node.isCamera) {
          node.name = node.name || `VIEWER__camera_${cameraNames.length + 1}`
          cameraNames.push(node.name)
        }
      })

      if (morphMeshes.length) {
        this.morphFolder.domElement.style.display = ''
        morphMeshes.forEach((mesh) => {
          if (mesh.morphTargetInfluences.length) {
            const nameCtrl = this.morphFolder.add({name: mesh.name || 'Untitled'}, 'name')
            this.morphCtrls.push(nameCtrl)
          }
          for (let i = 0; i < mesh.morphTargetInfluences.length; i++) {
            const ctrl = this.morphFolder.add(mesh.morphTargetInfluences, i, 0, 1, 0.01).listen()
            Object.keys(mesh.morphTargetDictionary).forEach((key) => {
              if (key && mesh.morphTargetDictionary[key] === i) ctrl.name(key)
            })
            this.morphCtrls.push(ctrl)
          }
        })
      }

      if (this.clips.length) {
        this.animFolder.domElement.style.display = ''
        settings.actionStates = {}
        const {actionStates} = settings
        this.clips.forEach((clip, clipIndex) => {
          clip.name = `${clipIndex + 1}. ${clip.name}`

          // Autoplay the first clip.
          let action
          if (clipIndex === 0) {
            actionStates[clip.name] = true
            action = this.mixer.clipAction(clip)
            action.setEffectiveTimeScale(1)
            setTimeout(() => {
              action.play()
            }, 100)
          } else {
            actionStates[clip.name] = false
          }

          // Play other clips when enabled.
          const ctrl = this.animFolder.add(actionStates, clip.name).listen()
          ctrl.onChange((playAnimation) => {
            action = action || this.mixer.clipAction(clip)
            action.setEffectiveTimeScale(1)
            playAnimation ? action.play() : action.stop()
          })
          this.animCtrls.push(ctrl)
        })
      }
    }

    const clear = () => {
      if (!this.content) return

      sceneEl.remove(this.content)

      // dispose geometry
      this.content.traverse((node) => {
        if (!node.isMesh) return

        node.geometry.dispose()
      })

      // dispose textures
      traverseMaterials(this.content, (material) => {
        for (const key in material) {
          if (key !== 'envMap' && material[key] && material[key].isTexture) {
            material[key].dispose()
          }
        }
      })

      updateGui()
    }
    this.updateGui = updateGui

    sceneEl.addEventListener('clear-model', clear)
    el.addEventListener('model-loaded', this.updateGui)

    try {
      updateGui()
    } catch (err) {
      console.error('caught', err)
    }
  },

  remove() {
    // Remove the dat.GUI interface when the component is detached
    const {gui} = this
    if (gui) {
      gui.destroy()
    }
    this.el.removeEventListener('model-loaded', this.updateGui)
  },

  tick(time) {
    const dt = (time - this.prevTime) / 1000
    this.mixer && this.mixer.update(dt)
    this.prevTime = time
  },

}

export {objectImportComponent, modelUiComponent}
