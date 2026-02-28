const pumpkinSpawnComponent = {
  init() {
    const {object3D} = this.el
    let found = false

    const createObjects = ({detail}) => {
      if (!found) {
        const absPos = new THREE.Vector3().copy(
          detail.position
        )

        setTimeout(() => {
          const punkin1 = document.createElement('a-entity')
          punkin1.setAttribute('visible', 'false')
          punkin1.setAttribute('gltf-model', require('./assets/Models/punkin-yellow.glb'))
          punkin1.setAttribute('shadow', {receive: false})
          punkin1.setAttribute('scale', '0.01 0.01 0.01')
          punkin1.object3D.position.set(absPos.x + 0.1, 0, absPos.z + 0.8)
          this.el.sceneEl.appendChild(punkin1)

          punkin1.addEventListener('model-loaded', () => {
            // Once the model is loaded, we are ready to show it popping in using an animation
            punkin1.setAttribute('visible', 'true')
            punkin1.setAttribute('animation', {
              property: 'scale',
              to: '0.2 0.2 0.2',
              easing: 'easeOutElastic',
              dur: 1200,
            })
          })

          const punkin2 = document.createElement('a-entity')
          punkin2.setAttribute('visible', 'false')
          punkin2.setAttribute('gltf-model', require('./assets/Models/punkin-red.glb'))
          punkin2.setAttribute('shadow', {receive: false})
          punkin2.setAttribute('scale', '0.01 0.01 0.01')
          punkin2.object3D.position.set(absPos.x - 0.2, 0, absPos.z + 0.5)
          this.el.sceneEl.appendChild(punkin2)

          punkin2.addEventListener('model-loaded', () => {
            punkin2.setAttribute('visible', 'true')
            punkin2.setAttribute('animation', {
              property: 'scale',
              to: '0.22 0.22 0.22',
              easing: 'easeOutElastic',
              dur: 800,
            })
          })

          const punkin3 = document.createElement('a-entity')
          punkin3.setAttribute('visible', 'false')
          punkin3.setAttribute('gltf-model', require('./assets/Models/punkin-pink.glb'))
          punkin3.setAttribute('shadow', {receive: false})
          punkin3.setAttribute('scale', '0.01 0.01 0.01')
          punkin3.object3D.position.set(absPos.x + 0.4, 0, absPos.z + 0.5)
          this.el.sceneEl.appendChild(punkin3)

          punkin3.addEventListener('model-loaded', () => {
            punkin3.setAttribute('visible', 'true')
            punkin3.setAttribute('animation', {
              property: 'scale',
              to: '0.25 0.25 0.25',
              easing: 'easeOutElastic',
              dur: 1000,
            })
          })
        }, 1000)

        found = true
      }
    }

    this.el.sceneEl.addEventListener('xrimagefound', createObjects)
  },
}

export {pumpkinSpawnComponent}
