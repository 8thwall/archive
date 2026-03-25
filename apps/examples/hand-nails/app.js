// Copyright (c) 2023 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

AFRAME.registerComponent('color-change', {
  init() {
    // Get the entity of the current component (the GLTF model entity)
    const entity = this.el

    // Function to generate a random color in hexadecimal format
    function getRandomColor() {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }

    // Function to traverse the model and change material colors
    function changeModelColors(model) {
      model.traverse((node) => {
        if (node.isMesh) {
          const {material} = node
          if (material) {
            // Update the color property of the material to a random color
            material.color.set(getRandomColor())
          }
        }
      })
    }

    // Wait for the GLTF model to load
    // entity.addEventListener('model-loaded', (event) => {
    const model = this.el.getObject3D('mesh')
    changeModelColors(model)

    // Call the changeModelColors function every 500 milliseconds (half second)
    setInterval(() => {
      changeModelColors(model)
    }, 700)
    // })
  },
})

AFRAME.registerComponent('tap', {
  init() {
    const nail1 = document.getElementById('nailEntity1')
    const nail2 = document.getElementById('nailEntity2')
    const nail3 = document.getElementById('nailEntity3')
    const nail4 = document.getElementById('nailEntity4')
    const nail5 = document.getElementById('nailEntity5')

    document.body.addEventListener('click', () => {
      nail1.setAttribute('color-change', '')
      nail2.setAttribute('color-change', '')
      nail3.setAttribute('color-change', '')
      nail4.setAttribute('color-change', '')
      nail5.setAttribute('color-change', '')
    })
  },
})
