/* globals THREE:readonly AFRAME:readonly */

import {arButton} from '../webxr-threejs/webxr-session'
import {CreateControllers} from '../webxr-threejs/create-controllers'

function ResponsiveImmersiveComponent() {
  const schema = {
    textStart: {default: 'START'},
    textStop: {default: 'STOP'},
    textNotSupported: {default: 'NOT SUPPORTED'},
  }
  let harmfulDefaultsWereRemoved_ = false
  let el_ = null
  let initialSceneCameraPosition_ = null
  let sceneScale_ = 0
  let controllers_ = null
  const originTransform_ = new THREE.Matrix4()
  let needsRecenter_ = false
  let sessionType_ = ''
  let onSelect_ = null
  let environmentVisible_ = false
  let backgroundElements_ = []

  const select = () => onSelect_ && onSelect_()

  const removeHarmfulDefaultsIfNeeded = () => {
    if (harmfulDefaultsWereRemoved_) {
      return
    }

    const camEl = el_.camera.el

    if (!camEl) {
      return
    }

    harmfulDefaultsWereRemoved_ = true

    camEl.object3D.updateMatrix()
    initialSceneCameraPosition_ = camEl.object3D.matrix.clone()

    // Always remove vr-mode-ui.
    if (el_.components['vr-mode-ui']) {
      el_.removeComponent('vr-mode-ui')
    }

    // We want explicit control of the camera, remove the default look-controls & wasd-controls.
    if (camEl.components['look-controls']) {
      camEl.removeAttribute('look-controls')
    }
    if (camEl.components['wasd-controls']) {
      camEl.removeAttribute('wasd-controls')
    }
  }

  const groundRotation = (quat) => {
    const e = new THREE.Euler(0, 0, 0, 'YXZ')
    e.setFromQuaternion(quat)
    return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, e.y, 0, 'YXZ'))
  }

  const updateOrigin = (obj) => {
    if (!(obj && sceneScale_)) {
      return
    }
    obj.matrix.premultiply(originTransform_)
    obj.matrix.decompose(obj.position, obj.rotation, obj.scale)
  }

  const updateScale = obj => obj && obj.setScale(sceneScale_)

  const recenter = (currentXrExtrinsic) => {
    // Get the current XR transform parameters.
    const xrTransform = new THREE.Matrix4().fromArray(currentXrExtrinsic)
    const xrPos = new THREE.Vector3()
    const xrRot = new THREE.Quaternion()
    const unusedScale = new THREE.Vector3()
    xrTransform.decompose(xrPos, xrRot, unusedScale)

    // Find the parameters of the desired initial scene camera.
    const initPos = new THREE.Vector3()
    const initRot = new THREE.Quaternion()
    initialSceneCameraPosition_.decompose(initPos, initRot, unusedScale)

    // Find scale needed to transform between the current XR height and the desired scene height.
    sceneScale_ = initPos.y / xrPos.y

    // Get the ground rotation needed to go from the current XR camera to the desired scene camera.
    const rotY = groundRotation(initRot).multiply(groundRotation(xrRot).invert())

    // Translate xr camera to desired scene x/z with height 0.
    xrPos.applyQuaternion(rotY)
    initPos.setX(initPos.x - xrPos.x)
    initPos.setY(0)
    initPos.setZ(initPos.z - xrPos.z)

    // Put it all together.
    originTransform_.compose(
      initPos, rotY, new THREE.Vector3(sceneScale_, sceneScale_, sceneScale_)
    )

    needsRecenter_ = false
  }

  // Adjust the scale and orientation of the scene based on the initial height of the camera.
  const fixScale = (frame) => {
    if (sessionType_ === 'XR8') {
      return
    }

    if (!frame) {
      return
    }

    const {renderer} = el_

    const referenceSpace = renderer.xr.getReferenceSpace()
    const pose = frame.getViewerPose(referenceSpace)

    if (!pose) {
      return
    }

    const {views} = pose

    if (!views.length) {
      return
    }

    views.forEach((view, idx) => {
      if (!sceneScale_ || needsRecenter_) {
        recenter(view.transform.matrix)
      }

      if (!sceneScale_) {
        return
      }

      // camera parameter here is different from three.js
      updateOrigin(renderer.xr.getCamera(el_.camera).cameras[idx])
    })

    if (!sceneScale_) {
      return
    }

    updateOrigin(renderer.xr.getCamera(el_.camera))

    renderer.xr.getSession().inputSources.forEach(
      (input, idx) => {
        updateOrigin(renderer.xr.getController(idx))
      }
    )

    renderer.xr.getSession().inputSources.forEach((input, idx) => {
      const hand = renderer.xr.getHand(idx)
      if (!hand) {
        return
      }
      Object.values(hand.joints).forEach(joint => updateOrigin(joint))
    })

    renderer.xr.getSession().inputSources.forEach(
      (input, idx) => updateOrigin(renderer.xr.getControllerGrip(idx))
    )

    updateScale(controllers_.left.hand.motionController)
    updateScale(controllers_.right.hand.motionController)
  }

  const onSessionStarted = () => {
    sceneScale_ = 0
    const obj = el_.camera.el.object3D
    obj.matrix.copy(new THREE.Matrix4())
    obj.matrix.decompose(obj.position, obj.rotation, obj.scale)
    obj.updateMatrixWorld(true)

    environmentVisible_ = sessionType_ === 'XR8' || el_.xrSession.environmentBlendMode !== 'opaque'
    if (environmentVisible_) {
      backgroundElements_ =
        Array.from(document.getElementsByTagName('responsive-immersive-background'))
      backgroundElements_.forEach((e) => { e.object3D.visible = false })
    }
  }

  const onSessionEnded = () => {
    if (sessionType_ !== 'XR8') {
      el_.removeEventListener('exit-vr', onSessionEnded)
    }
    const obj = el_.camera.el.object3D
    obj.matrix.copy(initialSceneCameraPosition_)
    obj.matrix.decompose(obj.position, obj.rotation, obj.scale)
    obj.updateMatrixWorld(true)

    if (environmentVisible_) {
      backgroundElements_.forEach((e) => { e.object3D.visible = true })
      backgroundElements_ = []
    }
    sessionType_ = ''
  }

  const startSession = async (sessionType, closeElement) => {
    sessionType_ = sessionType
    if (sessionType_ === 'XR8') {
      onSessionStarted()
      return  // TODO: implement waiting for XR8 to start
    }
    el_.addEventListener('exit-vr', onSessionEnded)
    const {webxr} = el_.systems
    webxr.sessionReferenceSpaceType = 'local-floor'
    webxr.sessionConfiguration.requiredFeatures = ['local-floor']
    webxr.sessionConfiguration.optionalFeatures =
      ['hand-tracking', 'dom-overlay', 'plane-detection']
    webxr.sessionConfiguration.domOverlay = {root: closeElement}
    if (sessionType === 'immersive-vr') {
      await el_.enterVR()
    } else {
      await el_.enterAR()
    }
    onSessionStarted()
  }

  const stopSession = listener => () => {
    if (sessionType_ !== 'XR8') {
      el_.exitVR()
      return
    }
    listener()  // TODO: don't manually invoke here, and remove it from args.
    onSessionEnded()  // TODO: don't manually invoke here, invoke from pipeline.
  }

  const addSessionEndListener = (listener) => {
    if (sessionType_ !== 'XR8') {
      const fireAndRemove = () => {
        listener()
        el_.removeEventListener('exit-vr', fireAndRemove)
      }
      el_.addEventListener('exit-vr', fireAndRemove)
    }
  }

  function init() {
    el_ = this.el
    el_.addEventListener('recenter-8w', () => { needsRecenter_ = true })
    const startButtonText = {
      start: this.data.textStart,
      stop: this.data.textStart,
      notSupported: this.data.textNotSupported,
    }
    document.body.appendChild(
      arButton(startButtonText, startSession, stopSession, addSessionEndListener)
    )

    // TODO: move to immersive session start
    onSelect_ = () => el_.emit('select-8w')
    controllers_ = CreateControllers(el_.renderer, el_.object3D)
    controllers_.left.controller.addEventListener('select', select)
    controllers_.right.controller.addEventListener('select', select)
  }

  function play() {
    removeHarmfulDefaultsIfNeeded()
  }

  function tick() {
    removeHarmfulDefaultsIfNeeded()
    fixScale(el_.frame)
  }

  return {
    schema,
    init,
    play,
    tick,
    removeHarmfulDefaultsIfNeeded,
  }
}

const responsiveImmersiveBackgroundPrimitive = {}

const ResponsiveImmersiveComponents = {
  'responsive-immersive': new ResponsiveImmersiveComponent(),
}

const ResponsiveImmersivePrimitives = {
  'responsive-immersive-background': responsiveImmersiveBackgroundPrimitive,
}

// If AFrame javascript is loaded before us, automatically register components and primitives. If
// not, export them so others can register them.
if (window.AFRAME) {
  Object.entries(ResponsiveImmersiveComponents).forEach(([k, v]) => AFRAME.registerComponent(k, v))
  Object.entries(ResponsiveImmersivePrimitives).forEach(([k, v]) => AFRAME.registerPrimitive(k, v))
}

export {
  ResponsiveImmersiveComponents,
  ResponsiveImmersivePrimitives,
}
