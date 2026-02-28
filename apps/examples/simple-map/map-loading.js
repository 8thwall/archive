const mapLoadingScreenComponent = {
  init() {
    const scene = this.el.sceneEl
    const gradient = document.getElementById('gradient')
    const dismissLoadScreen = () => {
      setTimeout(() => {
        gradient.classList.add('fade-out')
      }, 1500)
      setTimeout(() => {
        gradient.style.display = 'none'
      }, 2000)
    }
    const getPosition = options => new Promise(((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    }))
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
