const artGalleryFrameComponent = () => ({
  schema: {
    name: {type: 'string'},
    rotated: {type: 'bool'},
    metadata: {type: 'string'},
  },
  init() {
    const {object3D, sceneEl} = this.el
    // Hide the image target until it is found
    object3D.visible = false

    const frameEl = document.createElement('a-entity')
    frameEl.setAttribute('scale', '0.95 0.95 0.95')
    frameEl.setAttribute('gltf-model', '#frame-model')
    if (this.data.rotated) {
      // Rotate the frame for a landscape target
      frameEl.setAttribute('rotation', '0 0 90')
    }
    this.el.appendChild(frameEl)

    // showImage handles displaying and moving the virtual object to match the image
    const showImage = ({detail}) => {
      // Updating position/rotation/scale using object3D is more performant than setAttribute
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)
      object3D.visible = true
    }
    // hideImage handles hiding the virtual object when the image target is lost
    const hideImage = () => {
      object3D.visible = false
    }
    
    // These events are routed and dispatched from the 'simultaneous-targets' componenet on the <a-scene>
    this.el.addEventListener('xrimagefound', showImage)
    this.el.addEventListener('xrimageupdated', showImage)
    this.el.addEventListener('xrimagelost', hideImage)
  },
})

// xrextras-generate-image-targets uses this primitive to populate multiple image targets
const artGalleryPrimitive = () => ({
  defaultComponents: {
    artgalleryframe: {},
  },
  mappings: {
    name: 'artgalleryframe.name',
    rotated: 'artgalleryframe.rotated',
    metadata: 'artgalleryframe.metadata',
  },
})
export {artGalleryFrameComponent, artGalleryPrimitive}
