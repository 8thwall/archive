import {HideablePre} from '../components/hideable-pre'
import {Checked} from '../components/checked'
import {getRenderer} from '../lib/renderer'

declare const React: any
declare const XR8: any
declare const UAParser: any
interface C8 {
  deviceModel: string
  focalLength: number
  performanceIndex: number
}
declare const _c8: C8

declare global {
  interface Navigator {
    xr: any
  }
}

interface Intrinsic {
  principalPtX: number
  principalPtY: number
  focalLengthInPixelsX: number,
  focalLengthInPixelsY: number,
  skewFactorInPixel: number,
  viewportWidth: number
  viewportHeight: number
}

const getCameraIntrinsics = (projectionMatrix, viewport): Intrinsic => {
  const p = projectionMatrix;

  // Principal point in pixels (typically at or near the center of the viewport)
  const u0 = (1 - p[8]) * viewport.width / 2 + viewport.x;
  const v0 = (1 - p[9]) * viewport.height / 2 + viewport.y;

  // Focal lengths in pixels (these are equal for square pixels)
  const ax = viewport.width / 2 * p[0];
  const ay = viewport.height / 2 * p[5];

  // Skew factor in pixels (nonzero for rhomboid pixels)
  const gamma = viewport.width / 2 * p[4];
  return {
    principalPtX: u0,
    principalPtY: v0,
    focalLengthInPixelsX: ax,
    focalLengthInPixelsY: ay,
    skewFactorInPixel: gamma,
    viewportWidth: viewport.width,
    viewportHeight: viewport.height,
  }
}

const DeviceInfoView = () => {
  const [compatibility, setCompatibility] = React.useState(null)
  const [deviceEstimate, setDeviceEstimate] = React.useState(null)
  const [userAgent, setUserAgent] = React.useState(null)
  const [highEntropyUserAgent, setHighEntropyUserAgent] = React.useState(null)
  const [hasDeviceInfo, setHasDeviceInfo] = React.useState(false)
  const [uaParserData, setUaParserData] = React.useState(null)

  const [hasWebXr, setHasWebXr] = React.useState(false)
  const [hasImmersiveAr, setHasImmersiveAr] = React.useState(false)
  const [hasImmersiveVr, setHasImmersiveVr] = React.useState(false)
  const [webxrIntrinsic, setWebXrIntrinsic] = React.useState(null)

  React.useEffect(async () => {
    setCompatibility(XR8.XrDevice.compatibilities())
    setDeviceEstimate(XR8.XrDevice.deviceEstimate())
    setUserAgent(navigator.userAgent)

    const userAgentData = (navigator as any).userAgentData
    // Webkit does not have high entropy values
    userAgentData?.getHighEntropyValues([
      "architecture",
      "bitness",
      "model",
      "platformVersion",
      "fullVersionList",
    ]).then(
      ua => setHighEntropyUserAgent(ua)
    )

    if (XR8.XrDevice.deviceInfo) {
      XR8.XrDevice.deviceInfo().then((info) => {
        setDeviceEstimate(info)
        setHasDeviceInfo(true)
      })
    }

    const uaParser = new UAParser()
    uaParser.getResult().withClientHints().then((result) => {
      // NOTE(datchu): The version on cdnjs does not have feature check
      // const result2 = result.withFeatureCheck()
      setUaParserData(result)
    })

    // Logging the user agent so we can copy it from 8th Wall editor into ua-parser-js/browser-test.json
    console.log("User Agent:", navigator.userAgent)

    if (navigator.xr) {
      setHasWebXr(true)

      setHasImmersiveAr(await navigator.xr.isSessionSupported('immersive-ar'))
      setHasImmersiveVr(await navigator.xr.isSessionSupported('immersive-vr'))
    }
  }, [])

  const getIntrinsic = async () => {
    console.log('Requesting Immersive AR with camera access')
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['camera-access']
    });
    console.log('Getting local xr reference space')
    const xrRefSpace = await session.requestReferenceSpace('viewer')

    console.log('Getting gl context')
    const glCanvas = document.getElementById('webxr-intrinsic') as HTMLCanvasElement
    const gl = glCanvas.getContext('webgl')
    console.log('Making context xr compatible')
    // @ts-ignore
    await gl.makeXRCompatible()
    console.log('Setting gl base layer for xr session')
    // @ts-ignore
    const xrWebGLLayer = new XRWebGLLayer(session, gl)
    session.updateRenderState({baseLayer: xrWebGLLayer})

    const intrinsicPromise = new Promise((resolve, reject) => {
      console.log('Requesting animation frame')
      session.requestAnimationFrame((t: DOMHighResTimeStamp, xrFrame) => {
        console.log('Getting viewer poses')
        let viewerPose = xrFrame.getViewerPose(xrRefSpace)
        for (const view of viewerPose.views) {
          if (view.camera) {
            const viewport = xrWebGLLayer.getViewport(view)
            console.log(`Found view port height=${viewport.height} width=${viewport.width} x=${viewport.x} y=${viewport.y}`)
            console.log('Found a view with a camera. Getting its intrinsic')
            resolve(getCameraIntrinsics(view.projectionMatrix, viewport))
          }
        }

        reject()
      })
    })

    const intrinsic = await intrinsicPromise
    session.end()
    setWebXrIntrinsic(intrinsic)
  }

  const [renderInfo, setRenderInfo] = React.useState(null)
  const [renderInfo51Degree, setRenderInfo51Degree] = React.useState(null)
  React.useEffect(() => {
    // GPU Renderer check
    const gpuRendererCanvas = document.getElementById('51degree-render') as HTMLCanvasElement
    const context = gpuRendererCanvas.getContext('webgl') ||
      gpuRendererCanvas.getContext('experimental-webgl')
    if (context) {
      // @ts-ignore
      const info = context.getExtension("WEBGL_debug_renderer_info")
      if (info) {
        // @ts-ignore
        setRenderInfo(context.getParameter(info.UNMASKED_RENDERER_WEBGL))
      }
    }

    try {
      getRenderer(r => setRenderInfo51Degree(r))
    } catch (e) {
      console.error('51 degree getRenderer error', e)
    }
  }, [])

  return (
    <div className="container">
      <h1>XR Device (v{XR8.version()})</h1>
      <h2>Compatibility Check</h2>
      <HideablePre name='Compatibility' content={compatibility} />
      <ul>
        <li>
          <Checked val={compatibility?.hasDevice} /> Has Mobile Device
        </li>
        <li>
          <Checked val={compatibility?.hasBrowser} /> Has Compatible Browser
        </li>
        <li>
          <Checked val={compatibility?.hasUserMedia} /> Has getUserMedia
        </li>
        <li>
          <HideablePre name='In-app browser' content={compatibility?.inAppBrowser} />
        </li>
      </ul>
      <h2>Device Info API (v23.2+) </h2>
      <ul>
        <li>
          <Checked val={!!hasDeviceInfo} /> Has Device Info
        </li>
        <li>
          <Checked val={hasDeviceInfo && deviceEstimate.features?.hasSimd} /> Has SIMD support
        </li>
        <li>
          <Checked val={hasDeviceInfo && deviceEstimate.features?.hasThreads} /> Has WASM Thread support
        </li>
        <li>
          <Checked val={hasDeviceInfo && deviceEstimate.features?.hasGetUserMedia} /> Has getUserMedia
        </li>
        <li>
          <Checked val={hasDeviceInfo && deviceEstimate.features?.hasDeviceOrientation} /> Has deviceOrientation
        </li>
      </ul>

      <h2>Device Estimate</h2>
      <ul>
        <li>Operating System: <span id='os'>{deviceEstimate?.os}</span></li>
        <li>OS Version: <span id='os_version'>{deviceEstimate?.osVersion}</span></li>
        <li>Device Manufacturer: <span id='manufacturer'>{deviceEstimate?.manufacturer}</span></li>
        <li>Device Model: <span id='model'>{deviceEstimate?.model}</span></li>
        <li>Locale: <span id='locale'>{deviceEstimate?.locale}</span></li>
        <li>Type: <span id='locale'>{deviceEstimate?.type}</span></li>
        <li>
          <HideablePre name='Browser' content={deviceEstimate?.browser} startOpened />
        </li>
      </ul>
      <HideablePre name='Device Estimate / Device Info' content={deviceEstimate} />

      <h2>Engine Provided Info</h2>
      <ul>
        <li>Device Name: {globalThis._c8?.deviceModel || deviceEstimate?.deviceModel}</li>
        <li>Focal Length: {globalThis._c8?.focalLength || deviceEstimate?.focalLength}</li>
        <li>Performance Index: {globalThis._c8?.performanceIndex || deviceEstimate?.performanceIndex}</li>
      </ul>
      <hr />
      <h1>Raw Data</h1>
      <h2>UA Parser</h2>
      <p>
        <HideablePre name='UA Parser ' content={uaParserData} />
      </p>

      <h2>User Agent</h2>
      <p>{userAgent}</p>

      <h2>High Entropy User Agent / Client Hints (only in Chrome)</h2>
      <p>
        <HideablePre name='HE User Agent' content={highEntropyUserAgent} />
      </p>

      <h2>WebXR</h2>
      <ul>
        <li>
          <Checked val={!!hasWebXr} /> Has WebXR
        </li>
        <li>
          <Checked val={!!hasImmersiveAr} /> Has Immersive AR
        </li>
        <li>
          <Checked val={!!hasImmersiveVr} /> Has Immersive VR
        </li>
        <li>
          <button onClick={getIntrinsic}>Get intrinsic</button>
          <HideablePre name='webxr intrinsic' content={webxrIntrinsic} startOpened />
        </li>
        <li>
          Focal length in 8th Wall 640x480 from WebXR: <br />
          {webxrIntrinsic?.focalLengthInPixelsY && webxrIntrinsic.focalLengthInPixelsY * 640 / webxrIntrinsic.viewportHeight}
        </li>
      </ul>
      <canvas id='webxr-intrinsic'></canvas>

      <h2>iOS Detection</h2>
      <ul>
        <li>
          <HideablePre name='Render Info' content={renderInfo} startOpened />
        </li>
        <li>
          <HideablePre name='Render Info 51Degree' content={renderInfo51Degree} startOpened />
        </li>
      </ul>
      <canvas id='51degree-render'></canvas>

      <h2>Screen details</h2>
      <p>Screen * devicePixelRatio: <br />
        width: {window.screen.width * window.devicePixelRatio} <br />
        height: {window.screen.height * window.devicePixelRatio}
      </p>
    </div>
  )
}

export {DeviceInfoView}
