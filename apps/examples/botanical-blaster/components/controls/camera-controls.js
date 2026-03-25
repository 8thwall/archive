import * as ecs from '@8thwall/ecs'
import {PointerLockEvents, MouseState} from './pointer-lock'
import {
  AngalogMovedEvent,
  ViritualGamepadManager,
} from './virtual-gamepad-controls'

class CameraRig {
  constructor() {
    this.parent = null
    this.camera = null
    /**
     * @type {import("three").Object3D} pitchObject
     */
    this.pitchObject = new THREE.Object3D()
    /**
     * @type {import("three").Object3D} yawObject
     */
    this.yawObject = new THREE.Object3D()
    this.yawObject.add(this.pitchObject)
  }

  setCamera(camera) {
    this.camera = camera
    this.parent = camera.parent.parent
    if (this.parent) {
      this.parent.remove(camera.parent)
      this.pitchObject.add(camera.parent)
      this.parent.add(this.yawObject)
    }
  }

  /**
   * @param {number} startX
   * @param {number} startY
   * @param {number} startZ
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  setTarget(startX, startY, startZ, x, y, z) {
    const targetPosition = new THREE.Vector3(x, y, z)
    const cameraWorldPosition = new THREE.Vector3(startX, startY, startZ)
    // this.parent.getWorldPosition(cameraWorldPosition);

    // Calculate the direction vector from the camera to the target
    const direction = targetPosition
      .clone()
      .sub(cameraWorldPosition)
      .normalize()

    // Calculate the yaw rotation
    const yaw = Math.atan2(direction.x, direction.z)

    // Calculate the pitch rotation
    const pitch = Math.asin(direction.y)

    // Set the yaw and pitch rotations
    this.yawObject.rotation.y = yaw
    this.pitchObject.rotation.x = pitch
  }

  remove() {
    if (this.parent) {
      this.parent.remove(this.yawObject)
      this.pitchObject.remove(this.camera.parent)
      this.parent.add(this.camera.parent)
    }
  }
}

class CameraLookControls {
  /**
   * @param {CameraRig} cameraRig
   * @param {boolean} invertVertical
   */
  constructor(cameraRig, invertVertical) {
    this.cameraRig = cameraRig
    this.sensitivity = 0.002
    this.invertVertical = invertVertical
  }

  /**
   * @param {MouseState} event
   */
  update(event) {
    if (!this.cameraRig.camera) return

    const deltaX = event.movementX
    const deltaY = event.movementY

    // Rotate yaw object for horizontal rotation
    this.cameraRig.yawObject.rotation.y -= deltaX * this.sensitivity
    // Rotate pitch object for vertical rotation
    this.cameraRig.pitchObject.rotation.x -=
      deltaY * (this.invertVertical ? -1 : 1) * this.sensitivity

    // Clamp the x rotation to avoid flipping the camera upside down
    this.cameraRig.pitchObject.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.cameraRig.pitchObject.rotation.x)
    )
  }
}

const CameraManagerEvents = Object.freeze({
  CameraSet: 'camera-set',
  CanvasSet: 'canvas-set',
})

/**
 * Helper class for handling camera operations.
 */
class CameraManagerClass extends EventTarget {
  constructor() {
    super()
    /**
     * @type {HTMLCanvasElement} canvas
     */
    this.canvas = null
    /**
     * @type {import('three').Camera} camera
     */
    this.camera = null

    /**
     * @type {CameraRig} cameraRig
     */
    this.cameraRig = null

    /**
     * @type {CameraManagerEvents} events
     */
    this.events = CameraManagerEvents
  }

  createLookControls(invertVertical) {
    return new CameraLookControls(this.cameraRig, invertVertical)
  }

  setCanvas(canvas) {
    this.canvas = canvas
    this.dispatchEvent(
      new CustomEvent(CameraManagerEvents.CanvasSet, {
        detail: canvas,
      })
    )
  }

  setCamera(camera) {
    this.camera = camera

    this.cameraRig = new CameraRig()
    this.cameraRig.setCamera(this.camera)

    this.dispatchEvent(
      new CustomEvent(CameraManagerEvents.CameraSet, {
        detail: camera,
      })
    )
  }

  /**
   * Gets the forward direction of the camera.
   * @returns {import('three').Vector3}
   */
  getForwardDirection() {
    const direction = new THREE.Vector3(0, 0, -1)
    if (!this.camera) return direction
    this.camera.updateMatrixWorld(true)
    direction.applyMatrix4(this.camera.matrixWorld)
    direction.normalize()
    return this.camera.getWorldDirection(direction)
  }

  /**
   * Gets the side direction of the camera.
   * @returns {import('three').Vector3}
   */
  getSideDirection() {
    const right = new THREE.Vector3()
    if (!this.camera) return right
    this.camera.updateMatrixWorld()
    const matrix = this.camera.matrixWorld
    right
      .set(matrix.elements[0], matrix.elements[1], matrix.elements[2])
      .normalize()
    return right
  }

  /**
   * Picks objects in the scene using the camera and mouse position.
   * @param {MouseEvent} event - The mouse event.
   * @param {import('three').Scene}  scene - The scene to check for intersections.
   */
  pick(event, scene) {
    if (!this.camera) {
      console.error('Camera is not set.')
      return []
    }

    const rect = this.canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    // Calculate normalized device coordinates (NDC) for the mouse
    const mouse = new THREE.Vector2()
    mouse.x = (mouseX / rect.width) * 2 - 1
    mouse.y = -(mouseY / rect.height) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, this.camera)

    const intersects = raycaster.intersectObjects(scene.children, true)

    return intersects
  }

  /**
   * Picks objects in the scene using the camera from the center of the canvas.
   * @param {import('three').Scene} scene - The scene to check for intersections.
   * @returns {Array} - The list of intersected objects.
   */
  pickFromCenter(scene) {
    if (!this.camera) {
      console.error('Camera is not set.')
      return []
    }

    // Calculate the center of the canvas
    const rect = this.canvas.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate normalized device coordinates (NDC) for the center of the canvas
    const mouse = new THREE.Vector2()
    mouse.x = (centerX / rect.width) * 2 - 1
    mouse.y = -(centerY / rect.height) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, this.camera)

    const intersects = raycaster.intersectObjects(scene.children, true)

    return intersects
  }
}

export const CameraManager = new CameraManagerClass()

let controlInstance = null

const mouseListener = (e) => {
  if (!controlInstance) return
  const mouseState = e.data
  controlInstance.update(mouseState)
}

/**
 *
 * @param {AngalogMovedEvent} e
 * @returns
 */
const gamepadListener = (e) => {
  if (!controlInstance) return

  controlInstance.update(e)
}

let cleanUp = () => {}
let foundCamera = false

const worldMat = ecs.math.mat4.i()
const trs = {
  t: ecs.math.vec3.zero(),
  r: ecs.math.quat.zero(),
  s: ecs.math.vec3.zero(),
}

const CameraControls = ecs.registerComponent({
  name: 'CameraControls',
  schema: {
    invertVertical: ecs.boolean,
    targetX: ecs.f32,
    targetY: ecs.f32,
    targetZ: ecs.f32,
  },
  schemaDefaults: {
    invertVertical: true,
    targetX: -8,
    targetY: 0,
    targetZ: -5,
  },
  add: (world, component) => {
    CameraManager.setCanvas(world.three.renderer.domElement)
  },
  tick: (world, component) => {
    if (foundCamera) return
    let sceneCamera
    world.scene.traverse((node) => {
      if (node.isCamera) {
        sceneCamera = node
      }
    })

    if (!sceneCamera) return
    foundCamera = true
    CameraManager.setCamera(sceneCamera)
    controlInstance = CameraManager.createLookControls(
      component.schema.invertVertical
    )

    world.events.addListener(
      world.events.globalId,
      PointerLockEvents.MouseMove,
      mouseListener
    )

    ViritualGamepadManager.addEventListener(
      ViritualGamepadManager.events.AnaglogMove,
      gamepadListener
    )

    world.getWorldTransform(component.eid, worldMat)
    worldMat.decomposeTrs(trs)

    controlInstance.cameraRig.setTarget(
      trs.t.x,
      trs.t.y,
      trs.t.z,
      component.schema.targetX,
      component.schema.targetY,
      component.schema.targetZ
    )

    cleanUp = () => {
      world.events.removeListener(
        world.events.globalId,
        PointerLockEvents.MouseMove,
        mouseListener
      )
      ViritualGamepadManager.removeEventListener(
        ViritualGamepadManager.events.AnaglogMove,
        gamepadListener
      )

      controlInstance = null
    }
  },
  remove: (world, component) => {
    cleanUp()
  },
})

export {CameraControls}
