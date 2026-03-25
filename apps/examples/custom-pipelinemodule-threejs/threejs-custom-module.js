// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)
//
// ThreeJS based renderer

function CustomThreejsModule() {
  let scene3
  let engaged = false

  function pipelineModule() {
    if (!window.THREE) {
      throw new Error('window.THREE does not exist but is required by the ThreeJS pipeline module')
    }
    const engage = ({canvas, canvasWidth, canvasHeight, GLctx}) => {
      if (engaged) {
        return
      }

      const scene = new window.THREE.Scene()
      const camera = new window.THREE.PerspectiveCamera(
        60.0, /* initial field of view; will get set based on device info later. */
        canvasWidth / canvasHeight,
        0.01,
        1000.0,
      )
      scene.add(camera)

      const renderer = new window.THREE.WebGLRenderer({
        canvas,
        context: GLctx,
        alpha: false,
        antialias: true,
      })
      renderer.autoClear = false
      renderer.setSize(canvasWidth, canvasHeight)

      scene3 = {scene, camera, renderer}
      
      engaged = true
    }
    return {
      name: 'customthree',
      onStart: (args) => engage(args),
      onAttach: (args) => engage(args),
      onDetach: () => {engaged = false},
      onUpdate: ({processCpuResult}) => {
        if (!processCpuResult.reality) {
          return
        }
        const {rotation, position, intrinsics} = processCpuResult.reality
        const {camera} = scene3

        for (let i = 0; i < 16; i++) {
          camera.projectionMatrix.elements[i] = intrinsics[i]
        }

        // Fix for broken raycasting in r103 and higher. Related to:
        //   https://github.com/mrdoob/three.js/pull/15996
        // Note: camera.projectionMatrixInverse wasn't introduced until r96 so check before calling
        // getInverse()
        if (camera.projectionMatrixInverse) {
          camera.projectionMatrixInverse.getInverse(camera.projectionMatrix)
        }

        if (rotation) {
          camera.setRotationFromQuaternion(rotation)
        }
        if (position) {
          camera.position.set(position.x, position.y, position.z)
        }
      },
      onCanvasSizeChange: ({canvasWidth, canvasHeight}) => {
        if (!engaged) {
          return
        }
        const {renderer} = scene3
        renderer.setSize(canvasWidth, canvasHeight)
      },
      onRender: () => {
        const {scene, renderer, camera} = scene3
        renderer.clearDepth()
        renderer.render(scene, camera)
      },
    }
  }

  // Get a handle to the xr scene, camera and renderer. Returns:
  // {
  //   scene: The Threejs scene.
  //   camera: The Threejs main camera.
  //   renderer: The Threejs renderer.
  // }
  const xrScene = () => scene3

  return {
    pipelineModule,
    xrScene,
  }
}

export {CustomThreejsModule}
