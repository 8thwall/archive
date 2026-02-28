const mapLoadingScreenComponent = {
  init() {
    const scene = this.el.sceneEl
    const gradient = document.getElementById('gradient')
    const poweredby = document.getElementById('poweredby')
    const dismissLoadScreen = () => {
      setTimeout(() => {
        poweredby.classList.add('fade-out')
        gradient.classList.add('fade-out')
      }, 1500)
      setTimeout(() => {
        poweredby.style.display = 'none'
        gradient.style.display = 'none'
      }, 2000)
    }

    const getPosition = function (options) {
      return new Promise(((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      }))
    }

    getPosition()
      .then((position) => {
        scene.hasLoaded ? dismissLoadScreen() : scene.addEventListener('loaded', dismissLoadScreen)
      })
      .catch((err) => {
        console.error(err.message)
      })
  },
}

export {mapLoadingScreenComponent}
