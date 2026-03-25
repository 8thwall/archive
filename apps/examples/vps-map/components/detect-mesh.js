/* eslint-disable no-console */

const discoWireframeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    timeMsec: {value: 1.0},
  },
  vertexShader:
  `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
  fragmentShader:
  ` 
  uniform float timeMsec;
  varying vec2 vUv;
  
  void main(void) {
    vec2 position = - 1.0 + 2.0 * vUv;
    
    float red = abs(sin(position.x * position.y + timeMsec / 5.0));
    float green = abs(sin(position.x * position.y + timeMsec / 4.0));
    float blue = abs(sin(position.x * position.y + timeMsec / 3.0));
    gl_FragColor = vec4(red, green, blue, 0.5);
  }
  `,
  transparent: true,
  wireframe: true,
})

// Detects a VPS node, downloads its mesh and places it on top of the real world
const detectMeshComponent = {
  init() {
    const scene = this.el.sceneEl
    const sliderSection = document.getElementById('slider-section')
    const shaderToggle = document.getElementById('shader-toggle')
    const slider = document.getElementById('opacity-slider')
    const mapBtn = document.getElementById('map-btn')
    let mesh = null

    this.swapScene = () => {
      window.location.assign(window.location.href.split('?')[0])
    }

    mapBtn.addEventListener('click', this.swapScene)

    const foundMesh = ({detail}) => {
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

      sliderSection.style.display = 'block'
    }

    // update position and rotation of downloaded mesh to match detected VPS mesh transform
    const updateMesh = ({detail}) => {
      if (this.meshEl === null) {
        return
      }
      this.meshEl.object3D.position.copy(detail.position)
      this.meshEl.object3D.quaternion.copy(detail.rotation)
      this.meshEl.visible = true
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

    // xrmesh events
    this.el.sceneEl.addEventListener('xrmeshfound', foundMesh)
    this.el.sceneEl.addEventListener('xrmeshupdated', updateMesh)
  },
  tick(t) {
    discoWireframeMaterial.uniforms.timeMsec.value = t / 1000
  },
}

export {detectMeshComponent}
