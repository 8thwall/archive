import * as ecs from '@8thwall/ecs'
import {logger} from './Misc/logger'
import XRControllerManager from './Controllers/xr-controller'
import {getXRInputSourceForSide, getSideAtUnorderedIndex, getInputsForSide} from './Controllers/xr-controller'
import {ApplicationControl} from './application-control'
import {notifyChanged} from './Rendering/manual-matrix-update'
import {VRButton} from './enable-vr-button'
import {Platform} from './Misc/platform'

const {THREE} = (window as any)
const {XRRigidTransform} = (window as any)

let xrControllerManager
let xrMode = 'none'
let initialized: boolean = false

const FLOOR_OFFSET = 1.165  // distance from origin to the basket floor
const CONTROLLERS_RENDERORDER = 100010

const recenter = (world) => {
  // so i want a transform that will mean the current worldMatrix of the camera is facing
  // down z positive and is positioned at (0,0,0)
  // so basically the inverse of the current camera matrix. But i don't want roll or pitch
  // so maybe i just decompose and do it euler style

  const cameraLocalMat = world.three.activeCamera.matrix

  cameraLocalMat.invert()
  const p = new THREE.Vector3()
  const r = new THREE.Quaternion()
  const s = new THREE.Vector3()
  cameraLocalMat.decompose(p, r, s)

  const rotationEuler = new THREE.Euler()
  rotationEuler.setFromQuaternion(r, 'YXZ')

  // rotate by 180 as three wants forward to be negative-z
  const flatRotateWithY180 = new THREE.Quaternion()
  flatRotateWithY180.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationEuler.y + Math.PI)

  // then we will use this pose to establish our camera frame of reference
  const cameraEid = world.camera.getActiveEid()
  ecs.Position.set(world, cameraEid, p)
  ecs.Quaternion.set(world, cameraEid, {
    x: flatRotateWithY180.x,
    y: flatRotateWithY180.y,
    z: flatRotateWithY180.z,
    w: flatRotateWithY180.w,
  })
}

const printCameraDebug = (message: string, world) => {
  const cameraEid = world.camera.getActiveEid()
  const cameraRootObject = world.three.entityToObject.get(cameraEid)
  let c = world.three.activeCamera
  logger.log(message)
  const p = new THREE.Vector3()
  const r = new THREE.Quaternion()
  const s = new THREE.Vector3()
  logger.log(`camera.ThreeObject - ${cameraRootObject.uuid}`)
  let t = 0
  while (c) {
    c.matrix.decompose(p, r, s)
    const e = new THREE.Euler()
    e.setFromQuaternion(r, 'YXZ', false)
    logger.log(`${'.'.repeat(t)}${c.uuid} - (${p.x}, ${p.y}, ${p.z}) - (${(e.x / Math.PI) * 180}, ${(e.y / Math.PI) * 180}, ${(e.z / Math.PI) * 180})`)
    c = c.parent
    t++
  }
}

type SessionEventListener = (xrEvent: string) => void
const sessionEventListeners = new Array<SessionEventListener>()
const addSessionListener = (listener: SessionEventListener) => sessionEventListeners.push(listener)

const setRefreshRate = (xrSession, desiredRefreshRate: number) => {
  if (xrSession.supportedFrameRates) {
    const {length} = xrSession.supportedFrameRates
    for (let i = 0; i < length; i++) {
      // eslint-disable-next-line eqeqeq
      if (xrSession.supportedFrameRates[i] == desiredRefreshRate) {
        xrSession.updateTargetFrameRate(xrSession.supportedFrameRates[i])
        logger.log(`Updated target framerate to ${desiredRefreshRate}`)
      }
    }
  }
}

ecs.registerComponent({
  name: 'XRManager',
  schema: {
    skybox: ecs.eid,
  },
  data: {
    sessionUpdate: ecs.boolean,
    checkSessionUpdate: ecs.boolean,
  },
  add: (world, component) => {
    const {eid, dataAttribute} = component
    component.data.sessionUpdate = false

    const vrButton = VRButton.createButton(world.three.renderer, false, 'calc(50% - 50px)')

    if (vrButton) {
      document.body.appendChild(vrButton)
      if (Platform.isNativeQuest) {
        vrButton.click()
        xrMode = 'vr'
      } else {
        vrButton.addEventListener('pointerdown', () => {
          xrMode = 'vr'
        })
      }
    }

    const webXrManager = world.three.renderer.xr
    webXrManager.setReferenceSpaceType('local-floor')
    webXrManager.enabled = true
    webXrManager.setFramebufferScaleFactor(1.0)

    xrControllerManager = XRControllerManager(world.three.renderer, (model) => {
      sessionEventListeners.forEach((listener) => {
        listener('controller_model_loaded')
      })
      // set controllers to be in the transparent pass and set
      // renderorder higher than the fade effect, so they remain present
      model.traverse((node) => {
        if (node.isMesh) node.material.transparent = true
      })
      model.renderOrder = CONTROLLERS_RENDERORDER
    })
    const parentObject = world.three.activeCamera.parent ?? world.three.scene
    const [leftController, rightController] = xrControllerManager.unorderedControllers

    parentObject.add(
      leftController.controllerGrip,
      leftController.controller,
      rightController.controllerGrip,
      rightController.controller
    )
    notifyChanged(parentObject)
    leftController.controllerGrip.addEventListener('connected', (event) => {
      sessionEventListeners.forEach((listener) => {
        listener('controller_connected')
      })
    })
    rightController.controllerGrip.addEventListener('connected', (event) => {
      sessionEventListeners.forEach((listener) => {
        listener('controller_connected')
      })
    })

    world.events.addListener(world.events.globalId, 'active-camera-change', (eventData) => {
      // camera changed, we should attach our controllers to this new space
      // even on init the main camera can sometimes not be setup yet
      const {camera} = eventData.data as any
      // printCameraDebug('CameraChanged', world)

      logger.log(`Camera changed to type = ${camera.userData?.xr?.xrCameraType}`)
      const parent = camera.parent ?? world.three.scene
      parent.add(
        xrControllerManager.unorderedControllers[0].controllerGrip,
        xrControllerManager.unorderedControllers[0].controller,
        xrControllerManager.unorderedControllers[1].controllerGrip,
        xrControllerManager.unorderedControllers[1].controller
      )
      notifyChanged(parent)

      if (webXrManager.setUserCamera) {
        webXrManager.setUserCamera(world.three.activeCamera)
      }
    })

    const {skybox} = component.schema
    webXrManager.addEventListener('sessionstart', () => {
      logger.log('XR Session Started')
      dataAttribute.set(eid, {sessionUpdate: true})

      const xrSession = webXrManager.getSession()

      const onVisibilityChanged = (event) => {
        logger.log(`xrSession.visibilityState = ${xrSession.visibilityState}`)
        // pause when application is backgrounded
        ApplicationControl.setPaused(world, xrSession.visibilityState !== 'visible')
      }

      xrSession.addEventListener('visibilitychange', onVisibilityChanged)
      ApplicationControl.setPaused(world, false)

      const onSessionEnd = (event) => {
        xrSession.removeEventListener('visibilitychange', onVisibilityChanged)
        xrSession.removeEventListener('end', onSessionEnd)
      }
      xrSession.addEventListener('end', onSessionEnd)

      if (xrMode === 'none') {
        xrMode = 'vr'
      }

      // check if this is ar and we need to disable our skybox
      if (xrMode === 'ar') {
        // ActiveState.setActive(world, skybox, false)
      }

      sessionEventListeners.forEach((listener) => {
        listener('sessionstart')
      })

      // // load into our splash scene when the session starts
      // if (SceneManager.currentSceneName() === 'boot') {
      //   SceneManager.loadSceneByName('splash')
      // }
    })

    initialized = true
  },
  tick: (world, component) => {
    const {sessionUpdate} = component.data

    if (sessionUpdate) {
      // three.js has a bug in that it doesn't apply it's own yflip to change from the
      // webxr space of z-positive being forward to three where z-negative is forward
      // so rotate the reference space
      const webXrManager = world.three.renderer.xr
      // null out any previous custom reference space
      webXrManager.getReferenceSpace(null)
      const referenceSpace = webXrManager.getReferenceSpace()

      const rotateY180 = ecs.math.quat.axisAngle({x: 0, y: Math.PI, z: 0})
      const transform = new XRRigidTransform({x: 0, y: FLOOR_OFFSET, z: 0}, rotateY180)
      const rotatedReferenceSpace = referenceSpace.getOffsetReferenceSpace(transform)
      webXrManager.setReferenceSpace(rotatedReferenceSpace)

      // force our refresh rate to 72hz
      setRefreshRate(webXrManager.getSession(), 72)
      component.data.sessionUpdate = false
    }
  },
})

const getXrMode = () => xrMode

const getIsInXRMode = () => xrMode !== 'none'

const isInitialized = () => initialized

const XRManager = {
  recenter,
  getXrMode,
  getIsInXRMode,
  addSessionListener,
  isInitialized,
  getXRInputSourceForSide,
  getSideAtUnorderedIndex,
  getInputsForSide,
  setRefreshRate,
}
export {xrControllerManager, XRManager}
