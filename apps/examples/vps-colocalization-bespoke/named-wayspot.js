// Updates a single a-entity to track a Wayspot with the given name.
const namedWayspotComponent = {
  schema: {
    name: {type: 'string'},
  },
  init() {
    const status = document.getElementById('status')
    const {object3D} = this.el
    const {name} = this.data

    this.el.sceneEl.addEventListener('realityready', () => {
      object3D.visible = false
    })
    const foundWayspot = ({detail}) => {
      if (name !== detail.name) {
        return
      }
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.visible = true

      status.innerHTML = 'localized'
      status.style.background = 'rgb(52, 199, 89)'
    }
    const lostWayspot = ({detail}) => {
      if (name !== detail.name) {
        return
      }
      status.innerHTML = 'not localized'
      status.style.background = 'rgb(255, 59, 48)'

      object3D.visible = false
    }
    this.el.sceneEl.addEventListener('xrprojectwayspotfound', foundWayspot)
    this.el.sceneEl.addEventListener('xrprojectwayspotlost', lostWayspot)
  },
}
export {namedWayspotComponent}
