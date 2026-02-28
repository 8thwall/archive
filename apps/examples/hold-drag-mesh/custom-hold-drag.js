const holdDragAroundEntityComponent = {
  schema: {
    cameraId: {default: 'camera'},
    targetId: {default: 'ground'},
    dragDelay: {default: 300},
  },
  init() {
    this.camera = document.getElementById(this.data.cameraId)
    if (!this.camera) {
      throw new Error(`[hold-drag-around-entity] Couldn't find camera with id '${this.data.cameraId}'`)
    }
    this.threeCamera = this.camera.getObject3D('camera')
    this.target = document.getElementById(this.data.targetId)
    if (!this.target) {
      throw new Error(`[hold-drag-around-entity] Couldn't find target with id '${this.data.targetId}'`)
    }

    this.internalState = {
      fingerDown: false,
      dragging: false,
      startDragTimeout: null,
      raycaster: new THREE.Raycaster(),
    }

    this.fingerDown = this.fingerDown.bind(this)
    this.startDrag = this.startDrag.bind(this)
    this.fingerMove = this.fingerMove.bind(this)
    this.fingerUp = this.fingerUp.bind(this)

    this.el.addEventListener('mousedown', this.fingerDown)
    this.el.sceneEl.addEventListener('onefingermove', this.fingerMove)
    this.el.sceneEl.addEventListener('onefingerend', this.fingerUp)
    this.el.classList.add('cantap')  // Needs "objects: .cantap" attribute on raycaster.
  },
  tick() {
    if (this.internalState.dragging) {
      let desiredPosition = null
      let faceNormal = null

      if (this.internalState.positionRaw) {
        const screenPositionX = this.internalState.positionRaw.x / document.body.clientWidth * 2 - 1
        const screenPositionY = this.internalState.positionRaw.y / document.body.clientHeight * 2 - 1
        const screenPosition = new THREE.Vector2(screenPositionX, -screenPositionY)

        this.threeCamera = this.threeCamera || this.camera.getObject3D('camera')

        this.internalState.raycaster.setFromCamera(screenPosition, this.threeCamera)
        const intersects = this.internalState.raycaster.intersectObject(this.target.object3D, true)

        if (intersects.length > 0) {
          const intersect = intersects[0]
          desiredPosition = intersect.point
          faceNormal = intersect.face.normal.normalize()
        }
      }

      if (desiredPosition) {
        this.el.object3D.position.lerp(desiredPosition, 0.2)
      }
      if (faceNormal) {
        const faceQuaternion = new THREE.Quaternion()
        faceQuaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), faceNormal)
        this.el.object3D.quaternion.slerp(faceQuaternion, 0.2)
      }
    }
  },
  remove() {
    this.el.removeEventListener('mousedown', this.fingerDown)
    this.el.sceneEl.removeEventListener('onefingermove', this.fingerMove)
    this.el.sceneEl.removeEventListener('onefingerend', this.fingerUp)
    if (this.internalState.fingerDown) {
      this.fingerUp()
    }
  },
  fingerDown(event) {
    this.internalState.fingerDown = true
    this.internalState.startDragTimeout = setTimeout(this.startDrag, this.data.dragDelay)
    this.internalState.positionRaw = event.detail.positionRaw
  },
  startDrag(event) {
    if (!this.internalState.fingerDown) {
      return
    }
    this.internalState.dragging = true
  },
  fingerMove(event) {
    this.internalState.positionRaw = event.detail.positionRaw
  },
  fingerUp(event) {
    this.internalState.fingerDown = false
    clearTimeout(this.internalState.startDragTimeout)

    this.internalState.positionRaw = null
    this.internalState.dragging = false
  },
}

export {holdDragAroundEntityComponent}
