const config_ = {
  renderCameraTexture: true,
}
let engaged = false

let mirroredDisplay_ = false
let cameraFeedRenderer = null
// Opts used to create a renderer
let rendererCreateOpt_ = {}
let canvasWidth_ = null
let canvasHeight_ = null
let videoWidth_ = null
let videoHeight_ = null
let texProps = null
let GLctx_ = null
let cameraTexture_ = null

function pipelineModule({scene, camera, renderer}) {
  const updateSize = ({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx}) => {
    // scale texture output width, height to never be bigger than videoWidth, videoHeight
    let width = canvasWidth
    let height = canvasHeight
    if (width > videoWidth) {
      const scale = videoWidth / width
      width *= scale
      height *= scale
    }
    if (height > videoHeight) {
      const scale = videoHeight / height
      width *= scale
      height *= scale
    }
    if (!cameraFeedRenderer ||
        rendererCreateOpt_.width !== width ||
        rendererCreateOpt_.height_ !== height ||
        rendererCreateOpt_.mirroredDisplay !== mirroredDisplay_
    ) {
      if (cameraFeedRenderer) {
        cameraFeedRenderer.destroy()
      }
      cameraFeedRenderer = window.XR8.GlTextureRenderer.create({
        GLctx,
        toTexture: {width, height},
        flipY: false,
        mirroredDisplay: mirroredDisplay_,
      })
      rendererCreateOpt_ = {
        width,
        height,
        mirroredDisplay: mirroredDisplay_,
      }
    }

    // Save original passed in data
    canvasWidth_ = canvasWidth
    canvasHeight_ = canvasHeight
    videoWidth_ = videoWidth
    videoHeight_ = videoHeight
    GLctx_ = GLctx
  }

  const engage = ({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx}) => {
    if (engaged) {
      return
    }
    updateSize({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx})

    renderer.autoClear = false

    cameraTexture_ = new window.THREE.Texture()
    // scene.background = cameraTexture_
    engaged = true
    const {_w: w, _x: x, _y: y, _z: z} = camera.quaternion
    window.XR8.XrController.updateCameraProjectionMatrix(
      {origin: camera.position, facing: {w, x, y, z}}
    )
  }

  const processCameraConfigured = (event) => {
    const {mirroredDisplay} = event.detail
    if (mirroredDisplay === mirroredDisplay_ || mirroredDisplay === undefined || !GLctx_) {
      return
    }

    mirroredDisplay_ = mirroredDisplay
    updateSize({
      videoWidth: videoWidth_,
      videoHeight: videoHeight_,
      canvasWidth: canvasWidth_,
      canvasHeight: canvasHeight_,
      GLctx: GLctx_,
    })
  }

  return {
    name: 'threejsrenderer',
    onStart: args => engage(args),
    onAttach: args => engage(args),
    onDetach: () => {
      engaged = false
      cameraFeedRenderer.destroy()
      cameraFeedRenderer = null
    },
    onUpdate: ({processCpuResult}) => {
      const realitySource = processCpuResult.reality || processCpuResult.facecontroller ||
      processCpuResult.handcontroller || processCpuResult.layerscontroller

      // TODO(nb): remove intrinsics check once facecontroller provides it.
      if (!(realitySource && realitySource.intrinsics)) {
        return
      }

      const realityTexture = realitySource.realityTexture || realitySource.cameraFeedTexture

      if (config_.renderCameraTexture) {
        texProps.__webglTexture = cameraFeedRenderer.render({
          renderTexture: realityTexture,
          viewport: window.XR8.GlTextureRenderer.fillTextureViewport(
            videoWidth_,
            videoHeight_,
            canvasWidth_,
            canvasHeight_
          ),
        })
      }

      const {rotation, position, intrinsics} = realitySource

      for (let i = 0; i < 16; i++) {
        camera.projectionMatrix.elements[i] = intrinsics[i]
      }

      // Fix for broken raycasting in r103 and higher. Related to:
      //   https://github.com/mrdoob/three.js/pull/15996
      // Note: camera.projectionMatrixInverse wasn't introduced until r96 so check before setting
      // the inverse
      if (camera.projectionMatrixInverse) {
        if (camera.projectionMatrixInverse.invert) {
          // window.THREE 123 preferred version
          camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()
        } else {
          // Backwards compatible version
          camera.projectionMatrixInverse.getInverse(camera.projectionMatrix)
        }
      }

      if (rotation) {
        camera.setRotationFromQuaternion(rotation)
      }
      if (position) {
        camera.position.set(position.x, position.y, position.z)
      }
    },
    onProcessCpu: () => {
      // force initialization
      texProps = renderer.properties.get(cameraTexture_)
    },
    onDeviceOrientationChange: ({videoWidth, videoHeight, GLctx}) => {
      updateSize({videoWidth, videoHeight, canvasWidth_, canvasHeight_, GLctx})
    },
    onVideoSizeChange: ({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx}) => {
      updateSize({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx})
    },
    onCanvasSizeChange: ({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx}) => {
      if (!engaged) {
        return
      }
      updateSize({videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx})
    },
    onRender: () => {
      renderer.render(scene, camera)
    },
    listeners: [
      {event: 'reality.cameraconfigured', process: processCameraConfigured},
      {event: 'facecontroller.cameraconfigured', process: processCameraConfigured},
      {event: 'handcontroller.cameraconfigured', process: processCameraConfigured},
      {event: 'layerscontroller.cameraconfigured', process: processCameraConfigured},
    ],
  }
}

export {
  pipelineModule,
}
