import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {cubeThreejsPipelineModule} from '../modules/cube-threejs'

declare const React: any
declare const XR8: any
declare const XRExtras: any

function AspectRatioView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
      XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
      XRExtras.AlmostThere.pipelineModule(),       // Detects unsupported browsers and gives hints.
      // XRExtras.FullWindowCanvas.pipelineModule(),  // Do NOT fill the window
      XR8.CameraPixelArray.pipelineModule(),
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      XRExtras.PauseOnHidden.pipelineModule(),     // Shows an error image on runtime error.
      // Custom pipeline modules.
      logLifecyclePipelineModule(),
      // cubeThreejsPipelineModule(),
      {
        name: "canvasNaturalSize",
        onAttach: ({videoWidth, videoHeight, canvas}) => {
          // Set canvas size to video size so we can see what is the aspect ratio of our video
          canvas.style.width = '50vw'
          canvas.width = videoWidth / window.devicePixelRatio
          canvas.height = videoHeight / window.devicePixelRatio
        }
      },
    ])

    XR8.addCameraPipelineModule({
      name: 'camera-pixel-array-output-module',
      onProcessCpu: ({processGpuResult}) => {
        const {camerapixelarray} = processGpuResult
        if (!camerapixelarray || !camerapixelarray.pixels) {
          return
        }
        const {rows, cols, rowBytes, pixels} = camerapixelarray
        const canvasEl = document.getElementById('camera-pixel-array-output') as HTMLCanvasElement
        const targetWidth = 240
        const scaleByWidth = targetWidth / cols
        canvasEl.width = targetWidth
        canvasEl.height = rows * scaleByWidth
        console.log('[aspect-ratio] rows', rows, 'cols', cols, 'Scaling by width', scaleByWidth,
        'canvas width', canvasEl.width, 'canvas height', canvasEl.height)
        const ctx = canvasEl.getContext('2d')
        const iData = new ImageData(new Uint8ClampedArray(pixels), cols, rows)
        ctx.scale(scaleByWidth, scaleByWidth)
        createImageBitmap(iData).then(imageBitMap => {
          ctx.drawImage(imageBitMap, 0, 0)
        })
      },
    })

    XR8.run({
      canvas: document.getElementById('camerafeed'),
      verbose: true,
      webgl2: true,
      allowedDevices: 'any',
      glContextConfig: {
        alpha: false,
        desynchronized: true,
        powerPreference: 'high-performance',
      },
    })

    // Cleanup
    return () => {
      XR8.stop()
      XR8.clearCameraPipelineModules()
    }
  }, [])

  return (
    <div class='container'>
      <h1>Camera Pixel Array</h1>
      <p>The canvas below shows the camera pixel array output</p>
      <canvas id='camera-pixel-array-output'></canvas>

      <h1>Full size camera feed</h1>
      <p>The camera feed is shown without FullWindowCanvas. It is shown in the same aspect ratio of 
      the camera feed that we are capturing. Verify that you are getting 3:4 aspect ratio. If you are
      on a Pixel device, you should get a 9:16 aspect ratio.
      </p>
      <canvas id="camerafeed"></canvas>
    </div>
  )
}

export {AspectRatioView}
