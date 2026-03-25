/* eslint-disable no-console */

import {discoWireframeMaterial} from './shaders'

// Detects a VPS node, downloads its mesh and places it on top of the real world
const detectMeshComponent = {
  init() {
    const scene = this.el.sceneEl
    const sliderSection = document.getElementById('slider-section')
    const shaderToggle = document.getElementById('shader-toggle')
    const slider = document.getElementById('opacity-slider')
    const mapBtn = document.getElementById('map-btn')
    let meshFound = false
    let mesh = null

    this.swapScene = () => {
      const stopAr = new CustomEvent('stopar')
      window.dispatchEvent(stopAr)
    }

    mapBtn.addEventListener('click', this.swapScene)

    this.el.setAttribute('vps-coaching-overlay', {
      wayspotName: window._startAR ? window._startAR.title : null,
      hintImage: window._startAR ? window._startAR.imageUrl : null,
    })

    const foundMesh = ({detail}) => {
      if (meshFound === true) {
        return
      }
      const {bufferGeometry, position, rotation} = detail

      const texture = null
      this.threeMaterial = new THREE.MeshBasicMaterial({
        vertexColors: !texture,
        wireframe: false,
        visible: true,
        transparent: true,
        map: texture,
      })

      mesh = new THREE.Mesh(bufferGeometry, this.threeMaterial)  // construct VPS mesh

      // add mesh to A-Frame scene
      this.meshEl = document.createElement('a-entity')
      this.meshEl.id = 'vps-mesh'
      this.meshEl.object3D.add(mesh)
      this.meshEl.object3D.position.copy(position)
      this.meshEl.object3D.quaternion.copy(rotation)
      scene.prepend(this.meshEl)

      meshFound = true
    }

    // Updates mesh opacity
    const updateOpacity = (e) => {
      this.meshEl.object3D.children[0].material.opacity = e.target.value
    }
    slider.addEventListener('input', updateOpacity)

    shaderToggle.addEventListener('change', (e) => {
      if (shaderToggle.checked) {
        // DISCO WIREFRAME SELECTED
        slider.setAttribute('disabled', '')
        mesh.material = discoWireframeMaterial
        mesh.material.needsUpdate = true
      } else {
        // COLOR SELECTED
        slider.removeAttribute('disabled')
        mesh.material = this.threeMaterial
        mesh.material.needsUpdate = true
      }
    })

    const overlayHidden = () => {
      if (!this.meshEl) {
        return
      }
      document.getElementById('vps-mesh').object3D.visible = true
      sliderSection.style.display = 'block'
    }

    const overlayVisible = () => {
      if (!this.meshEl) {
        return
      }
      document.getElementById('vps-mesh').object3D.visible = false
      sliderSection.style.display = 'none'
    }

    // xrmesh events
    this.el.sceneEl.addEventListener('xrmeshfound', foundMesh)

    // vps-coaching-overlay events
    window.XR8.addCameraPipelineModule({
      name: 'vps-coaching-overlay-listen',
      listeners: [
        {event: 'vps-coaching-overlay.hide', process: overlayHidden},
        {event: 'vps-coaching-overlay.show', process: overlayVisible},
      ],
    })
  },
  tick(t) {
    discoWireframeMaterial.uniforms.timeMsec.value = t / 1000
  },
}

export {detectMeshComponent}
