// Component that places cacti where the ground is clicked
export const tapPlaceComponent = {
  schema: {
    min: {default: 1},
    max: {default: 3},
  },
  init() {
    this.prompt = document.getElementById('promptText')
    const ground = document.getElementById('ground')

    ground.addEventListener('click', (event) => {
      // Dismiss the prompt text.
      this.prompt.style.display = 'none'

      // Create new entity for the new object
      const newElement = document.createElement('a-entity')
      // The raycaster gives a location of the touch in the scene
      const touchPoint = event.detail.intersection.point
      newElement.setAttribute('position', `${touchPoint.x} 4 ${touchPoint.z}`)
      const randomYRotation = Math.random() * 360
      newElement.setAttribute('rotation', `0 ${randomYRotation} 0`)
      const randomScale = Math.floor(Math.random() * (Math.floor(this.data.max) - Math.ceil(this.data.min)) + Math.ceil(this.data.min))
      const randomHeight = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(1) + Math.ceil(1)))

      newElement.setAttribute('visible', 'false')
      newElement.setAttribute('scale', '0.0001 0.0001 0.0001')
      newElement.setAttribute('shadow', {
        receive: false,
      })
      newElement.setAttribute('gltf-model', '#heart')
      newElement.classList.add('heart')
      newElement.classList.add('cantap')
      this.el.sceneEl.appendChild(newElement)

      // remove hearts on click
      newElement.addEventListener('click', () => {
        newElement.setAttribute('animation', {
          property: 'scale',
          to: '0.0001 0.0001 0.0001',
          easing: 'easeOutQuad',
          dur: 800,
        })
        setTimeout(() => {
          newElement.remove()
        }, 800)
      })

      newElement.addEventListener('model-loaded', () => {
        // Once the model is loaded, we are ready to show it popping in using an animation
        newElement.setAttribute('visible', 'true')
        newElement.setAttribute('animation', {
          property: 'scale',
          to: `${randomScale} ${randomScale} ${randomScale}`,
          easing: 'easeOutElastic',
          dur: 800,
        })
        newElement.setAttribute('animation__fall', {
          property: 'position',
          to: `${touchPoint.x} ${randomHeight} ${touchPoint.z}`,
          easing: 'easeOutQuad',
          dur: 1500,
        })
      })
    })
  },
}
