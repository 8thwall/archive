const arrowsComponent = {
  init() {
    const {el} = this
    const dotyModel = el.object3D
    let walkingInterval
    let walkingInterval2

    // The current value of the 'position' attribute
    let currentSkyPosition
    // The updated value of the 'position' attribute
    let updatedSkyPosition

    const bottomBar = document.getElementById('bottomBar')
    bottomBar.style.display = 'grid'

    const rightButton = document.getElementById('rightButton')

    rightButton.addEventListener('touchstart', (e) => {
      walkingInterval = setInterval(() => {
        currentSkyPosition = el.getAttribute('sky-position')

        // Add 1 to the 'x' property of the sky-position
        updatedSkyPosition = {
          x: currentSkyPosition.x + 1,
          y: currentSkyPosition.y,
          z: currentSkyPosition.z,
        }
        // Set the updated 'sky-position' attribute
        this.el.setAttribute('sky-position', updatedSkyPosition)
      }, 25)
      dotyModel.rotation.y = Math.PI / 3
      this.el.setAttribute('animation-mixer', {clip: 'walk'})
      e.returnValue = false
    })

    rightButton.addEventListener('touchend', () => {
      this.el.setAttribute('animation-mixer', {clip: 'idle'})
      dotyModel.rotation.y = 0
      clearInterval(walkingInterval)
    })

    const leftButton = document.getElementById('leftButton')
    leftButton.addEventListener('touchstart', (e) => {
      walkingInterval2 = setInterval(() => {
        currentSkyPosition = el.getAttribute('sky-position')

        // Add 1 to the 'y' property of the sky-position
        updatedSkyPosition = {
          x: currentSkyPosition.x - 1,
          y: currentSkyPosition.y,
          z: currentSkyPosition.z,
        }
        // Set the updated 'sky-position' attribute
        this.el.setAttribute('sky-position', updatedSkyPosition)
      }, 25)
      dotyModel.rotation.y = -(Math.PI / 3)
      this.el.setAttribute('animation-mixer', {clip: 'walk'})
      e.returnValue = false
    })

    leftButton.addEventListener('touchend', () => {
      this.el.setAttribute('animation-mixer', {clip: 'idle'})
      clearInterval(walkingInterval2)
      dotyModel.rotation.y = 0
    })

    // Prevent double tap zoom
    document.ondblclick = function (e) {
      e.preventDefault()
    }
  },
}

export {arrowsComponent}
