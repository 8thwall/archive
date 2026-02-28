const spawnerComponent = {
  schema: {
    template: {default: ''},
  },

  init() {
    const ground = document.getElementById('ground')

    ground.addEventListener('click', (event) => {
      console.log('spawn')
      const newElement = document.createElement('a-entity')

      // The raycaster gives a location of the touch in the scene
      const touchPoint = event.detail.intersection.point
      newElement.setAttribute('position', `${touchPoint.x} 0.5 ${touchPoint.z}`)

      newElement.setAttribute('networked', {template: this.data.template})
      this.el.sceneEl.appendChild(newElement)
    })
  },
}
export {spawnerComponent}
