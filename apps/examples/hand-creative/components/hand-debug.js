const handDebugComponent = {
  init() {
    const show = () => {
      console.log('Hand found')
    }

    const updated = () => {
      console.log('Hand updated')
    }

    const hide = () => {
      console.log('Hand lost')
    }

    this.el.sceneEl.addEventListener('xrhandfound', show)
    // this.el.sceneEl.addEventListener('xrhandupdated', updated)
    this.el.sceneEl.addEventListener('xrhandlost', hide)
  },
}

export {handDebugComponent}
