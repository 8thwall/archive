// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Christoph Bartschat (christoph@8thwall.com)

/* eslint-disable no-console */

import * as capnp from 'capnp-ts'

import OMNI8 from 'apps/client/internalqa/omniscope/js/core/omniscope-wasm'

import {Sensors} from 'reality/app/xr/js/src/sensors'

import {C8Omni8, OmniDom} from 'apps/client/internalqa/omniscope/js/core/omni-types'

import {
  ImageTargetMetadata,
  ImageTargetTypeMsg,
} from 'reality/engine/api/reality.capnp'

declare const XR8: any
declare let _c8Omni8: C8Omni8

const ImageTargetType = {
  PLANAR: 'PLANAR',
  CYLINDER: 'CYLINDER',
  UNSPECIFIED: 'UNSPECIFIED',
}

let omni8 = null
const initializedPromise = OMNI8().then((result) => {
  omni8 = result
  return omni8
})

// We can't call into omni8 until the context has been registered in onStart.
let resolveContextPromise
const contextPromise = new Promise((resolve) => {
  resolveContextPromise = resolve
})

let deviceInfo
let omni8Ready = false
const omni8Promise = Promise.all([initializedPromise, contextPromise]).then(() =>
  XR8.XrDevice.deviceInfo()
).then((info) => {
  deviceInfo = info
  omni8Ready = true
})

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

const allocAndCopy = (s) => {
  const ptr = omni8._malloc(s.length + 1)
  omni8.stringToUTF8(s, ptr, s.length + 1)
  return ptr
}

const readImageDetectionTarget = (im, img, GLctx) => {
  if (!omni8Ready) {
    omni8Promise.then(() => readImageDetectionTarget(im, img, GLctx))
    return
  }
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  console.log(`[index] finished loading image ${im.name} with size ${iw}x${ih}`)

  const os = allocAndCopy(deviceInfo.os)
  const osVersion = allocAndCopy(deviceInfo.osVersion)
  const manufacturer = allocAndCopy(deviceInfo.manufacturer)
  const model = allocAndCopy(deviceInfo.model)

  const message = new capnp.Message()
  const imageTargetMetadata = message.initRoot(ImageTargetMetadata)
  imageTargetMetadata.setName(im.name)
  imageTargetMetadata.setImageWidth(iw)
  imageTargetMetadata.setImageHeight(ih)
  imageTargetMetadata.setOriginalImageWidth(im.originalImageWidth || iw)
  imageTargetMetadata.setOriginalImageHeight(im.originalImageHeight || ih)
  imageTargetMetadata.setCropOriginalImageX(im.cropOriginalImageX || 0)
  imageTargetMetadata.setCropOriginalImageY(im.cropOriginalImageY || 0)
  imageTargetMetadata.setCropOriginalImageWidth(im.cropOriginalImageWidth || iw)
  imageTargetMetadata.setCropOriginalImageHeight(im.cropOriginalImageHeight || ih)
  imageTargetMetadata.setIsRotated(!!im.isRotated)
  if (im.type === ImageTargetType.CYLINDER) {
    imageTargetMetadata.setType(ImageTargetTypeMsg.CURVY)
    const curvyGeometry = imageTargetMetadata.getCurvyGeometry()
    curvyGeometry.setCurvyCircumferenceTop(im.cylinderCircumferenceTop)
    curvyGeometry.setCurvyCircumferenceBottom(im.cylinderCircumferenceBottom)
    curvyGeometry.setCurvySideLength(im.cylinderSideLength)
    curvyGeometry.setTargetCircumferenceTop(im.targetCircumferenceTop)
  } else {
    imageTargetMetadata.setType(ImageTargetTypeMsg.PLANAR)
  }

  const buffer = message.toArrayBuffer()
  const ptr = omni8._malloc(buffer.byteLength)
  omni8.writeArrayToMemory(new Uint8Array(buffer), ptr)
  omni8._c8EmAsm_addNewDetectionImageTexture(
    ptr, buffer.byteLength, os, osVersion, manufacturer, model
  )
  omni8._free(ptr)

  omni8._free(os)
  omni8._free(osVersion)
  omni8._free(manufacturer)
  omni8._free(model)

  const name = allocAndCopy(im.name)
  GLctx.bindTexture(GLctx.TEXTURE_2D, _c8Omni8.imageTargetTexture)
  GLctx.texImage2D(GLctx.TEXTURE_2D, 0, GLctx.RGBA, GLctx.RGBA, GLctx.UNSIGNED_BYTE, img)
  omni8._c8EmAsm_processNewDetectionImageTexture(name)
  omni8._free(name)
}

let omniGlCtx = null
const loadImage = (im) => {
  console.log(`[index] start loading image ${im.name}`)
  const img = document.createElement('img')
  img.onload = () => { readImageDetectionTarget(im, img, omniGlCtx) }
  img.src = im.imageUrl
}

let appConfig = {
  GLctx: null,
  orientation: 0,
  videoWidth: 0,
  videoHeight: 0,
}

let omniDom = null

const handleResize = ({GLctx, orientation, videoWidth, videoHeight}) => {
  if (!omni8Ready) {
    omni8Promise.then(() => handleResize({GLctx, orientation, videoWidth, videoHeight}))
    return
  }
  appConfig = {
    GLctx,
    orientation,
    videoWidth,
    videoHeight,
  }
  const ww = window.innerWidth
  const wh = window.innerHeight

  // Wait for orientation change to take effect before handling resize.
  if (XR8.XrDevice.isDeviceBrowserCompatible({allowedDevices: XR8.XrConfig.device().MOBILE}) &&
    (((orientation === 0 || orientation === 180) && ww > wh) ||
      ((orientation === 90 || orientation === -90) && wh > ww))) {
    window.requestAnimationFrame(
      () => handleResize({GLctx, orientation, videoWidth, videoHeight})
    )
    return
  }

  const os = allocAndCopy(deviceInfo.os)
  const osVersion = allocAndCopy(deviceInfo.osVersion)
  const manufacturer = allocAndCopy(deviceInfo.manufacturer)
  const model = allocAndCopy(deviceInfo.model)

  const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
  omni8._c8EmAsm_onOrientationChange(
    orientation,
    videoWidth,
    videoHeight,
    os,
    osVersion,
    manufacturer,
    model
  )
  XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)

  omni8._free(os)
  omni8._free(osVersion)
  omni8._free(manufacturer)
  omni8._free(model)

  if (!omniDom) {
    console.warn('Need to updateViewLayout but no UI to update.')
    return
  }
  omniDom.updateViewLayout(_c8Omni8)

  console.log(`[index] orientation: ${orientation}`)
}

const goNext = () => {
  if (!omni8Ready) {
    omni8Promise.then(() => goNext())
    return
  }
  omni8._c8EmAsm_goNext()
  handleResize(appConfig)
}

const goViewId = (groupName, viewId) => {
  if (!omni8Ready) {
    omni8Promise.then(() => goNext())
    return
  }
  omni8.goViewId(groupName, viewId)
  handleResize(appConfig)
}

const omniscopeCoreModule = ({render, updateViewLayout}: OmniDom) => {
  omniDom = {
    render,
    updateViewLayout,
  }

  let lastGeolocation_ = {latitude: 0, longitude: 0, horizontalAccuracy: 0}
  let watchPositionId_ = 0

  const updateDeviceGeolocation = ({coords}) => {
    lastGeolocation_ = {
      latitude: coords.latitude, longitude: coords.longitude, horizontalAccuracy: coords.accuracy,
    }
  }

  const sensors = Sensors(initializedPromise)
  let lastDevicePose = {
    alpha: 0,
    beta: 0,
    gamma: 0,
  }

  const updateDeviceOrientation = ({alpha, beta, gamma}) => {
    lastDevicePose = {alpha, beta, gamma}
  }

  window.addEventListener('deviceorientation', updateDeviceOrientation, true)
  window.addEventListener('devicemotion', sensors.updateDeviceMotion, true)

  const requiredPermissions = () => {
    const permissions = {
      CAMERA: 'camera',
      DEVICE_MOTION: 'devicemotion',
      DEVICE_ORIENTATION: 'deviceorientation',
    }
    return [permissions.CAMERA, permissions.DEVICE_ORIENTATION, permissions.DEVICE_MOTION]
  }

  const cameraTextureIds = {}
  return {
    name: 'omniscope',
    onProcessGpu: ({frameStartResult}) => {
      const {cameraTexture, GLctx, videoTime, frameTime} = frameStartResult

      if (!cameraTexture.name) {
        console.error('[index] Camera texture does not have a name')
      }

      if (!cameraTextureIds[cameraTexture.name]) {
        const cameraTextureId = omni8.GL.getNewId(omni8.GL.textures)
        omni8.GL.textures[cameraTextureId] = cameraTexture
        cameraTextureIds[cameraTexture.name] = cameraTextureId
      }

      const {alpha, beta, gamma} = lastDevicePose
      const devicePose = getQuaternion(alpha, beta, gamma)
      const timeNanos = window.performance.now() * 1000 * 1000

      const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
      sensors.setEventQueue()
      omni8._c8EmAsm_glProcess(
        cameraTextureIds[cameraTexture.name],
        devicePose.w,
        devicePose.x,
        devicePose.y,
        devicePose.z,
        videoTime,
        frameTime,
        timeNanos,
        lastGeolocation_.latitude,
        lastGeolocation_.longitude,
        lastGeolocation_.horizontalAccuracy
      )
      XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
    },
    onProcessCpu: ({frameStartResult}) => {
      const {GLctx} = frameStartResult

      const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
      omni8._c8EmAsm_cpuProcessAndRenderDisplay()
      XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
      return {
        displayTexture: _c8Omni8.displayTexture,
      }
    },
    onUpdate: ({processCpuResult}) => {
      const {omniscope} = processCpuResult
      if (!omniscope || !omniscope.displayTexture) {
        return
      }
      omniDom.render(omniscope.displayTexture)
    },
    onStart: (config) => {
      omniGlCtx = config.GLctx

      watchPositionId_ = navigator.geolocation.watchPosition(updateDeviceGeolocation)

      const majorVersion = omniGlCtx.PIXEL_PACK_BUFFER ? 2 : 1
      const glHandle = omni8.GL.registerContext(
        omniGlCtx, {majorVersion, ...omniGlCtx.getContextAttributes()}
      )
      omni8.GL.makeContextCurrent(glHandle)
      handleResize(config)
      resolveContextPromise()
    },
    onDetach: () => {
      lastGeolocation_ = {latitude: 0, longitude: 0, horizontalAccuracy: 0}
      navigator.geolocation.clearWatch(watchPositionId_)
      watchPositionId_ = 0
    },
    onDeviceOrientationChange: handleResize,
    requiredPermissions,
  }
}

const gotTouchCount = count => omni8Promise.then(() => omni8._c8EmAsm_gotTouches(count))

const embindVecToJsArr = (embindVec) => {
  const jsArr = []
  for (let i = 0; i < embindVec.size(); i++) {
    jsArr.push(embindVec.get(i))
  }
  return jsArr
}

const getViewNames = () => omni8Promise.then(() => {
  const viewNames = omni8.getViewNames()
  return embindVecToJsArr(viewNames)
})

const getViewGroups = () => omni8Promise.then(() => {
  const viewGroupsMap = omni8.getViewGroups()
  const viewGroups = {}
  const keys = viewGroupsMap.keys()
  for (let i = 0; i < keys.size(); i++) {
    const key = keys.get(i)
    viewGroups[key] = embindVecToJsArr(viewGroupsMap.get(key))
  }
  return viewGroups
})

export {
  // Switch to the next omniscope view in the current group.
  goNext,
  // Switch to a specific view id of a specific group
  goViewId,
  // Get the list of view names in their order
  getViewNames,
  // Get view groups, map<group name, vector<view names>>
  getViewGroups,
  // Tell omniscope that the UI received a specified number of touches.
  gotTouchCount,
  // Add the image with the given metadata to the set being analyized.
  loadImage,
  // Construct a camera pipeline module that interfaces with omniscope. This needs to be given
  // callbacks for rendering a texture, and for updating the view layout whenever the view changes.
  omniscopeCoreModule,
  // promise that will resolve if Omni WASM has been loaded
  initializedPromise,
  // Enum specifying image target metadata.
  ImageTargetType,
}
