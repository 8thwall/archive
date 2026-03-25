/**
 * This component hides the scene while the reality engine is not tracking.
 */

const showWhenTracking = {
  init() {
    const updatedStatus = (event) => {
      this.el.object3D.visible = event.detail.status === 'NORMAL'
    }

    this.el.sceneEl.addEventListener('xrtrackingstatus', updatedStatus)
  },
}

export {showWhenTracking}
