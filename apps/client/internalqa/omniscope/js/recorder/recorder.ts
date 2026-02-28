// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

import * as capnp from 'capnp-ts'

import RECORDER8 from 'apps/client/internalqa/omniscope/js/recorder/recorder-wasm'

import {
  CoordinateSystemConfiguration,
  RealityResponse,
  XRConfiguration,
  XRRequestMask,
} from 'reality/engine/api/reality.capnp'
import {XrTrackingState} from 'reality/engine/api/response/pose.capnp'
import {Sensors} from 'reality/app/xr/js/src/sensors'
import type {CompressionFormat} from 'reality/app/xr/js/src/types/recorder'
import {ensureXr8Loaded} from 'c8/ecs/src/runtime/xr/xr-helpers'

let recorder8 = null
const recorder8Async = RECORDER8().then((r) => {
  recorder8 = r
  return recorder8
})
// Initialize in RecorderFactory
let deviceInfo

declare const XR8: any

// Configs for XR
const ENABLE_LIGHTING = false
// TODO(dat): Does ENABLE_CAMERA = false still allow intrinsic to flow through to XRRequest
const ENABLE_CAMERA = false
const ENABLE_SURFACES = false
const ENABLE_VERTICAL_SURFACES = false
const ENABLE_CAMERA_AUTOFOCUS = true
const ENABLE_FEATURE_SET = false
const DISABLE_WORLD_TRACKING = true
const ENABLE_VPS = true

const MIRRORED_DISPLAY = false

// data interface where data from recorder.cc is assigned into
// and read back on the typescript side
interface C8Recorder {
  queryResponse?: number
  queryResponseSize?: number
  reality?: number
  realitySize?: number
  isAllZeroes?: boolean
  wasEverNonZero?: number
  recorderRecord?: number
  recorderRecordSize?: number
}

declare global {
  interface Window { _recorder8: C8Recorder }
}
window._recorder8 = window._recorder8 || {}

type OnDataAvailableCallback = (data: Uint8Array) => void

// TODO(dat): Refactor out this method from engine.js so we can use it
const getQuaternion = (alpha, beta, gamma) => {
  const degToRad = Math.PI / 180

  const _x = beta * degToRad || 0
  const _y = gamma * degToRad || 0
  const _z = alpha * degToRad || 0

  const cX = Math.cos(_x / 2)
  const cY = Math.cos(_y / 2)
  const cZ = Math.cos(_z / 2)
  const sX = Math.sin(_x / 2)
  const sY = Math.sin(_y / 2)
  const sZ = Math.sin(_z / 2)

  const w = cX * cY * cZ - sX * sY * sZ
  const x = sX * cY * cZ - cX * sY * sZ
  const y = cX * sY * cZ + sX * cY * sZ
  const z = cX * cY * sZ + sX * sY * cZ

  return {x, y, z, w}
}

interface WorldPoint {
  id: number
  confidence: number
  position: {
    x: number
    y: number
    z: number
  }
}

// You should not call create directly. It is called after recorder8 has been
// resolved.
function create() {
  const sensors = Sensors(recorder8Async)

  let lastDevicePose = {alpha: 0, beta: 0, gamma: 0}

  let scale_ = 1.0
  const origin_ = {x: 0, y: 2, z: 0}
  const facing_ = {w: 1, x: 0, y: 0, z: 0}

  let lastGeolocation_ = {latitude: 0, longitude: 0, accuracy: 0}
  // The id of the navigator.geolocation.watchPosition() call. Used to stop it.
  let watchPositionId_ = 0
  const cam_ = {
    pixelRectWidth: 0,
    pixelRectHeight: 0,
    nearClipPlane: 0.01,
    farClipPlane: 1000.0,
  }
  // when true, we will call the data callback every time we process a frame
  let isSendingData_ = false
  let onDataCb_: OnDataAvailableCallback
  // Should we record camera image into capnp
  let isRecordCameraImage_ = false
  // Time when the recording starts
  let startTime_ = 0

  // scratch space for getting YUV data from yuv-pixels-array into WASM
  let yuvBufferInitialized_ = false
  let yuvBuffer_: number  // offset into WASM heap for yuvBuffer
  let yuvBufferArray_: Uint8Array
  const initializeYuvBuffer = (size) => {
    yuvBuffer_ = recorder8._malloc(size)
    yuvBufferArray_ = new Uint8Array(recorder8.HEAPU8.buffer, yuvBuffer_, size)
    yuvBufferInitialized_ = true
  }

  const updateDeviceOrientation = ({alpha, beta, gamma}) => {
    lastDevicePose = {alpha, beta, gamma}
  }

  const updateDeviceGeolocation = ({coords}) => {
    lastGeolocation_ = {
      latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy,
    }
  }

  const onProcessGpu = ({frameStartResult}) => {
    const {
      computeCtx,
      cameraTexture,
      textureWidth,
      textureHeight,
      orientation,
      repeatFrame,
      videoTime,
      frameTime,
    } = frameStartResult
    if (repeatFrame) {
      return
    }
    const {alpha, beta, gamma} = lastDevicePose
    const devicePose = getQuaternion(alpha, beta, gamma)
    // window.performance.now() is from the start time of this page load.
    // what we want is from the start time of the recording session
    const timeNanos = (window.performance.now() - startTime_) * 1000 * 1000

    // TODO(paris): This data could just be passed in with _c8EmAsm_stageFrame.
    sensors.setEventQueue()

    computeCtx.pixelStorei(computeCtx.UNPACK_FLIP_Y_WEBGL, false)
    computeCtx.disable(computeCtx.BLEND)
    recorder8._c8EmAsm_stageFrame(
      cameraTexture.name,
      textureWidth,
      textureHeight,
      orientation,
      alpha,
      beta,
      gamma,
      devicePose.w,
      devicePose.x,
      devicePose.y,
      devicePose.z,
      videoTime,
      frameTime,
      timeNanos,
      lastGeolocation_.latitude,
      lastGeolocation_.longitude,
      lastGeolocation_.accuracy
    )
  }

  const onProcessCpu = ({frameStartResult, processGpuResult}) => {
    const {computeCtx, repeatFrame} = frameStartResult

    const {yuvpixelsarray} = processGpuResult
    if (!yuvpixelsarray || !yuvpixelsarray.pixels) {
      // there is no data on the first frame
      return null
    }
    const {cols, rows, rowBytes, pixels} = yuvpixelsarray

    if (!yuvBufferInitialized_) {
      initializeYuvBuffer(rows * rowBytes)
    }
    if (!repeatFrame) {
      yuvBufferArray_.set(pixels)
      if (isRecordCameraImage_) {
        recorder8._c8EmAsm_cpuYuvConversion(rows, cols, rowBytes, yuvBuffer_)
      }

      computeCtx.pixelStorei(computeCtx.UNPACK_FLIP_Y_WEBGL, false)
      computeCtx.disable(computeCtx.BLEND)
      const hasFrame = recorder8._c8EmAsm_processStagedFrame()

      if (isSendingData_ && hasFrame && onDataCb_) {
        const recordBuffer = recorder8.HEAPU8.subarray(window._recorder8.recorderRecord,
          window._recorder8.recorderRecord + window._recorder8.recorderRecordSize)
        onDataCb_(recordBuffer)
      }
    }

    if (!window._recorder8.reality) {
      return null
    }

    const byteBuffer = recorder8.HEAPU8.subarray(window._recorder8.reality,
      window._recorder8.reality + window._recorder8.realitySize)

    const message = new capnp.Message(byteBuffer, false).getRoot(RealityResponse)
    const camera = message.getXRResponse().getCamera()
    const intrinsics = camera.getIntrinsic().getMatrix44f().toArray()
    const extrinsic = camera.getExtrinsic()
    const xrq = extrinsic.getRotation()
    const xrp = extrinsic.getPosition()
    const rotation = {x: xrq.getX(), y: xrq.getY(), z: xrq.getZ(), w: xrq.getW()}
    const position = {x: xrp.getX(), y: xrp.getY(), z: xrp.getZ()}

    let lighting
    if (ENABLE_LIGHTING) {
      const lightingMessage = message.getXRResponse().getLighting().getGlobal()
      lighting = {
        exposure: lightingMessage.getExposure(),
        temperature: lightingMessage.getTemperature(),
      }
    }

    const cameraTrackingStateReason = camera.getTrackingState().getReason()
    const trackingReason = XrTrackingState.XrTrackingStatusReason[cameraTrackingStateReason]

    let worldPoints: WorldPoint[] = []
    // TODO(nb): rNext -- this goes to the returns docs.
    //   surfaces: [{id, width, height, type: {UNSPECIFIED|HORIZONTAL_PLANE|VERTICAL_PLANE},
    //     vertices: [[x,y,z]], position: [x, y, z]}]
    //     An array of surfaces in the world at their location in the scene.  Only filled if
    //     XrController is configured to return surfaces and trackingReason != INITIALIZING.
    //  let surfaces = []
    if (trackingReason !== 'INITIALIZING') {
      const points = message.getFeatureSet().getPoints()
      worldPoints = Array.from({length: points.getLength()}, (_, i) => {
        const pt = points.get(i)  // { id, confidence, position }
        const pos = pt.getPosition()
        return {
          id: pt.getId().toNumber(),
          confidence: pt.getConfidence(),
          position: {
            x: pos.getX(),
            y: pos.getY(),
            z: pos.getZ(),
          },
        }
      })
    }

    // TODO(dat): Remove all computation in CPU here once I have verified that the needed
    // .          data has been serialized for sending on the network
    return {
      rotation,
      position,
      intrinsics,
      trackingStatus: XrTrackingState.XrTrackingStatus[camera.getTrackingState().getStatus()],
      trackingReason,
      worldPoints,
      lighting,
    }
  }

  const onStart = ({canvasWidth, canvasHeight, computeCtx}) => {
    if (!cam_.pixelRectWidth) {
      cam_.pixelRectWidth = canvasWidth
    }
    if (!cam_.pixelRectHeight) {
      cam_.pixelRectHeight = canvasHeight
    }

    if (ENABLE_VPS) {
      watchPositionId_ = navigator.geolocation.watchPosition(updateDeviceGeolocation)
    }

    const glHandle = recorder8.GL.registerContext(
      computeCtx, {majorVersion: 1, ...computeCtx.getContextAttributes()}
    )
    recorder8.GL.makeContextCurrent(glHandle)
  }

  const allocAndCopy = (s) => {
    const ptr = recorder8._malloc(s.length + 1)
    recorder8.stringToUTF8(s, ptr, s.length + 1)
    return ptr
  }

  const onAttach = ({videoWidth, videoHeight, canvasWidth, canvasHeight, rotation}) => {
    if (!cam_.pixelRectWidth) {
      cam_.pixelRectWidth = canvasWidth
    }
    if (!cam_.pixelRectHeight) {
      cam_.pixelRectHeight = canvasHeight
    }

    const os = allocAndCopy(deviceInfo.os)
    const osVersion = allocAndCopy(deviceInfo.osVersion)
    const manufacturer = allocAndCopy(deviceInfo.manufacturer)
    const model = allocAndCopy(deviceInfo.model)

    recorder8._c8EmAsm_recorderInit(videoWidth, videoHeight, rotation, os, osVersion, manufacturer, model)
    recorder8._free(os)
    recorder8._free(osVersion)
    recorder8._free(manufacturer)
    recorder8._free(model)
  }

  const onDetach = () => {
    recorder8._c8EmAsm_recorderCleanup()
    lastDevicePose.alpha = 0
    lastDevicePose.beta = 0
    lastDevicePose.gamma = 0
    scale_ = 1.0
    origin_.x = 0
    origin_.y = 2
    origin_.z = 0
    facing_.w = 1
    facing_.x = 0
    facing_.y = 0
    facing_.z = 0
    cam_.pixelRectWidth = 0
    cam_.pixelRectHeight = 0
    cam_.nearClipPlane = 0.01
    cam_.farClipPlane = 1000.0
    yuvBufferInitialized_ = false
    recorder8._free(yuvBuffer_)
    yuvBuffer_ = null
    yuvBufferArray_ = null

    // we have set the EngineData singleton inside engine.cc to nullptr.  Therefore each _c8 value
    // that references the singleton should be set to null
    window._recorder8.isAllZeroes = null
    window._recorder8.wasEverNonZero = null
    window._recorder8.queryResponse = null
    window._recorder8.queryResponseSize = null
    window._recorder8.reality = null
    window._recorder8.realitySize = null

    // data to be recorded. A single XrRemoteApp capnp message
    window._recorder8.recorderRecord = null
    window._recorder8.recorderRecordSize = null

    if (ENABLE_VPS) {
      navigator.geolocation.clearWatch(watchPositionId_)
      watchPositionId_ = 0
    }

    lastGeolocation_.latitude = 0
    lastGeolocation_.longitude = 0
    lastGeolocation_.accuracy = 0
  }

  const configureXR = ({cam, origin = null, facing = null, scale = null}) => {
    const _configureXr = (msg) => {
      const configBuffer = msg.toArrayBuffer()
      const configPtr = recorder8._malloc(configBuffer.byteLength)
      recorder8.writeArrayToMemory(new Uint8Array(configBuffer), configPtr)
      recorder8._c8EmAsm_configureXr(configPtr, configBuffer.byteLength)
      recorder8._free(configPtr)
    }

    // Set compute mask and camera config.
    if (cam) {
      const message = new capnp.Message()
      const config = message.initRoot(XRConfiguration)

      const configMask = config.getMask()
      configMask.setLighting(ENABLE_LIGHTING)
      configMask.setCamera(ENABLE_CAMERA)
      configMask.setSurfaces(ENABLE_SURFACES)
      configMask.setVerticalSurfaces(ENABLE_VERTICAL_SURFACES)
      configMask.setFeatureSet(ENABLE_FEATURE_SET)
      configMask.setDisableVio(DISABLE_WORLD_TRACKING)
      configMask.setVpsMode(ENABLE_VPS ? XRRequestMask.VpsMode.SERVER : XRRequestMask.VpsMode.OFF)

      config.getCameraConfiguration().setAutofocus(ENABLE_CAMERA_AUTOFOCUS)

      const graphicsIntrinsicsConfig = config.getGraphicsIntrinsics()
      graphicsIntrinsicsConfig.setTextureWidth(cam.pixelRectWidth)
      graphicsIntrinsicsConfig.setTextureHeight(cam.pixelRectHeight)
      graphicsIntrinsicsConfig.setNearClip(cam.nearClipPlane)
      graphicsIntrinsicsConfig.setFarClip(cam.farClipPlane)
      graphicsIntrinsicsConfig.setDigitalZoomHorizontal(1.0)
      graphicsIntrinsicsConfig.setDigitalZoomVertical(1.0)

      _configureXr(message)
    }

    // Set coordinate system.
    if (facing && origin && scale) {
      const message = new capnp.Message()
      const config = message.initRoot(XRConfiguration)

      const coords = config.getCoordinateConfiguration()

      coords.setAxes(CoordinateSystemConfiguration.CoordinateAxes.X_LEFT_YUP_ZFORWARD)

      coords.setMirroredDisplay(MIRRORED_DISPLAY)
      const r = coords.getOrigin().getRotation()
      r.setW(facing.w)
      r.setX(facing.x)
      r.setY(facing.y)
      r.setZ(facing.z)
      const p = coords.getOrigin().getPosition()
      p.setX(origin.x)
      p.setY(origin.y)
      p.setZ(origin.z)
      coords.setScale(scale)

      _configureXr(message)
    }
  }

  // Reset the scene's display geometry and the camera's starting position in the scene. The display
  // geometry is needed to properly overlay the position of objects in the virtual scene on top of
  // their corresponding position in the camera image. The starting position specifies where the
  // camera will be placed and facing at the start of a session.
  //
  // Inputs:
  // {
  //   cam [Optional] {
  //     pixelRectWidth: The width of the canvas that displays the camera feed.
  //     pixelRectHeight: The height of the canvas that displays the camera feed.
  //     nearClipPlane: The closest distance to the camera at which scene objects are visibile.
  //     farClipPlane: The farthest distance to the camera at which scene objects are visibile.
  //   }
  //   origin {x, y, z}: [Optional] The starting position of the camera in the scene.
  //   facing {w, x, y, z}: [Optional] The starting direction (quaternion) of the camera in the
  //     scene.
  // }
  const updateCameraProjectionMatrix = ({cam, origin, facing}) => {
    Object.assign(cam_, cam)
    Object.assign(origin_, origin)
    Object.assign(facing_, facing)
    scale_ = origin_.y
    // Only configure cam if it was provided as an arg.
    configureXR({cam: cam_, origin: origin_, facing: facing_, scale: scale_})
  }

  const onCanvasSizeChange = ({canvasWidth, canvasHeight}) => {
    cam_.pixelRectWidth = canvasWidth
    cam_.pixelRectHeight = canvasHeight
    configureXR({cam: cam_})
  }

  const requiredPermissions = () => {
    const permissions = {
      CAMERA: 'camera',
      DEVICE_MOTION: 'devicemotion',
      DEVICE_ORIENTATION: 'deviceorientation',
      MICROPHONE: 'microphone',
      DEVICE_GPS: 'geolocation',
    }
    return [
      permissions.CAMERA,
      permissions.DEVICE_ORIENTATION,
      permissions.DEVICE_MOTION,
      permissions.DEVICE_GPS,
    ]
  }

  const setRunning = (isSendingData: boolean) => {
    isSendingData_ = isSendingData
  }

  const setDataCompression = (compressionFormat: CompressionFormat) => {
    recorder8._c8EmAsm_setCompressedFormat(compressionFormat)
  }

  const setRecordCameraImage = (isRecordCameraImage: boolean) => {
    isRecordCameraImage_ = isRecordCameraImage
    recorder8._c8EmAsm_setIncludeCameraImage(isRecordCameraImage)
  }

  const setDataAvailableCb = (cb: OnDataAvailableCallback) => {
    onDataCb_ = cb
  }

  let gumStream_: MediaStream
  const onCameraStatusChange = ({status, stream}) => {
    if (status === 'hasStream') {
      gumStream_ = stream
    }
  }

  const getGumStream = () => gumStream_

  const markStartRecording = () => {
    startTime_ = window.performance.now()
    // There are already existing pipeline data in wasm with the old time. We need to flush these.
    // Otherwise, when we start sending our data, we will get 2 old frames with data captured before
    // we start recording on MediaRecorder
    recorder8._c8EmAsm_clearPipeline()
  }

  // Creates a camera pipeline module that, when installed, receives callbacks on when
  // the camera has started, camera processing events, and other state changes. These are used
  // to calculate the camera's position.
  const pipelineModule = () => ({
    name: 'recorder',
    onStart,
    onAttach,
    onDetach,
    onProcessGpu,
    onProcessCpu,
    onCanvasSizeChange,
    requiredPermissions,
    setRunning,
    setDataAvailableCb,
    setDataCompression,
    setRecordCameraImage,
    onCameraStatusChange,
    getGumStream,
    markStartRecording,
  })

  const addWindowListener = (name, callback, useCapture = true) => {
    window.addEventListener(name, callback, useCapture)
  }

  // TODO(nb): make device updates stop on pause.
  addWindowListener('deviceorientation', updateDeviceOrientation)
  addWindowListener('devicemotion', sensors.updateDeviceMotion)

  return {

    // Creates a camera pipeline module that, when installed, receives callbacks on when
    // the camera has started, camera processing events, and other state changes. These are used
    // to calculate the camera's position.
    pipelineModule,

    // Reset the scene's display geometry and the camera's starting position in the scene. The
    // display geometry is needed to properly overlay the position of objects in the virtual scene
    // on top of their corresponding position in the camera image. The starting position specifies
    // where the camera will be placed and facing at the start of a session.
    updateCameraProjectionMatrix,
  }
}

// The created recorder should be treated as a singleton
const RecorderFactory = async () => {
  await ensureXr8Loaded
  await recorder8Async
  deviceInfo = await XR8.XrDevice.deviceInfo()
  return create()
}

type RecorderModule = ReturnType<ReturnType<typeof create>['pipelineModule']>

export {
  OnDataAvailableCallback,
  RecorderFactory,
  RecorderModule,
}
