// Component that places trees at cursor location when screen is tapped
const startBtnComponent = {

  init() {
    const clickHandler = (e) => {
      document.getElementById('landing').style.display = 'none'
      const scene = this.el.sceneEl
      scene.emit('recenter')
    }

    const btn = document.getElementById('StartExperience')
    btn.addEventListener('click', clickHandler)
  },
}

export {startBtnComponent}
