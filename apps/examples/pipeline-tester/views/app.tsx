/* eslint-disable max-len */
import '../style/app.scss'
import {AspectRatioView} from './aspect-ratio'
import {CoreAssetsView} from './core-assets'
import {CoreView} from './core'
import {CubeAFrameView} from './cube-aframe'
import {CubeBabylonjsView} from './cube-babylonjs'
import {CubeThreejsView} from './cube-threejs'
import {CubeWebGlView} from './cube-webgl'
import {CurvyTargetsSceneView} from './curvy-targets-scene'
import {DemoArtgalleryView} from './demo-artgallery'
import {DemoCurvyAFrameView} from './demo-curvy-aframe'
import {DemoCurvyThreejsView} from './demo-curvy-threejs'
import {DemoFlyerFrontView} from './demo-flyer-front'
import {DemoFlyerThreejsView} from './demo-flyer-threejs'
import {DemoFlyerView} from './demo-flyer'
import {DemoManipulateView} from './demo-manipulate'
import {DemoPagesView} from './demo-pages'
import {DemoPhotomodeView} from './demo-photomode'
import {DemoScanView} from './demo-scan'
import {DemoTextureView} from './demo-large-texture'
import {DeviceGetUserMediaView} from './device-getUserMedia'
import {DeviceInfoView} from './device-info'
import {DeviceMotionView} from './device-motion'
import {DeviceLocationView} from './device-location'
import {EstimateScaleView} from './estimate-scale'
import {FaceAFrameView} from './face-aframe'
import {FaceThreejsView} from './face-threejs'
import {MultiFaceThreejsView} from './multiface-threejs'
import {HandTrackingThreejsView} from './hand-threejs'
import {HandTrackingAframeView} from './hand-aframe'
import {MediaRecorderAudioTestsView} from './media-recorder-audio'
import {RuntimeErrorView} from './runtime-error'
import {ScaleSceneAFrameView} from './scale-scene-aframe'
import {TapPlaceAFrameView} from './tapplace-aframe'
import {TapPlaceBabylonjsView} from './tapplace-babylonjs'
import {TapPlaceThreejsView} from './tapplace-threejs'
import {WebGLVersionAframe} from './webgl-version-aframe'
import {WorldPointsThreejsView} from './world-points-threejs'
import {VpsThreejsView} from './vps-threejs'
import {VpsAFrameView} from './vps-aframe'
import {SkyThreejsView} from './sky-threejs'
import {ScanTargetView} from './scan-target'
import {SkyAframeView} from './sky-aframe'
import {DeviceWebXr} from './device-webxr'

declare let React: any
declare let ReactDOM: any
declare let ReactRouterDOM: any
declare const XR8: any

const {BrowserRouter, Route, Link} = ReactRouterDOM

const base = location.pathname.startsWith('/pipeline-tester') ? '/pipeline-tester' : ''

const Home = () => (
  <React.Fragment>
    <div className='home-header'>
      <h1>Pipeline Tester<br />XR8 QA</h1>
    </div>
    <div className='home'>
      <h3>Informational | v{XR8.version()}</h3>
      <nav>
        <Link to={`${base}/device-info`}>Device Info</Link>
        <Link to={`${base}/device-motion`}>Device Motion</Link>
        <Link to={`${base}/device-location`}>Device Location</Link>
        <Link to={`${base}/device-getUserMedia`}>Device getUserMedia</Link>
        <Link to={`${base}/device-webXr`}>Device WebXR</Link>
        <Link to={`${base}/aspect-ratio`}>Camera Aspect Ratio</Link>
      </nav>
      <h3>Core</h3>
      <nav>
        <Link to={`${base}/core`}>Core</Link>
        <Link to={`${base}/runtime-error`}>💣 Runtime Error</Link>
        <Link to={`${base}/core/assets`}>Core Assets</Link>
        <a className='link-out' target='_blank' href='https://8th.io/scan'>QR Code Scanner (link out)</a>
      </nav>
      <h3>SLAM</h3>
      <nav>
        <Link to={`${base}/cube-aframe`}>🧊 Cube: AFrame</Link>
        <Link to={`${base}/cube-threejs`}>🧊 Cube: ThreeJS</Link>
        <Link to={`${base}/cube-babylonjs`}>🧊 Cube: babylon.js</Link>
        <Link to={`${base}/cube-webgl`}>🧊 Cube: WebGL</Link>
        <Link to={`${base}/estimate-scale`}>Estimate Scale: ThreeJS</Link>
        <Link to={`${base}/scale-scene-aframe`}>Scale Scene: AFrame</Link>
        <Link to={`${base}/world-points-threejs`}>World Points: ThreeJS</Link>
        <Link to={`${base}/tapplace-aframe`}>Tap Place: AFrame</Link>
        <Link to={`${base}/tapplace-threejs`}>Tap Place: ThreeJS</Link>
        <Link to={`${base}/tapplace-babylonjs`}>Tap Place: babylon.js</Link>
        <a className='link-out' href='https://www.8thwall.com/8thwall/placeground-aframe'>Metaversal Tap Place: AFrame</a>
        <a className='link-out' href='https://www.8thwall.com/8thwall/world-effects/project'>Studio: World Effects</a>
      </nav>
      <h3>Ads</h3>
      <nav>
        <a className='link-out' href='https://8w.8thwall.app/tri-test-3d/'>3D on Mobile: AFrame (link out)</a>
        <a className='link-out' href='https://8w.8thwall.app/unitcube-threejs-3dsession/'>3D on Mobile: ThreeJS (link out)</a>
      </nav>
      <h3>WebGL</h3>
      <nav>
        <Link to={`${base}/webgl-version-aframe`}>WebGL 2: AFrame</Link>
        <Link to={`${base}/webgl-version-aframe?webgl1=true`}>WebGL 1: AFrame</Link>
      </nav>
      <h3>VPS 🏞</h3>
      <nav>
        <Link to={`${base}/vps-aframe`}>VPS: AFrame</Link>
        <Link to={`${base}/vps-threejs`}>VPS: ThreeJS</Link>
        <a className='link-out' href='https://8th.io/6gxsk'>VPS World Explorer (link out)</a>
      </nav>
      <h3>Human Pose 💁</h3>
      <nav>
        <Link to={`${base}/face-aframe`}>Face: AFrame</Link>
        <Link to={`${base}/face-threejs`}>Face: ThreeJS 🐴</Link>
        <Link to={`${base}/multiface-threejs`}>👥 MultiFace: ThreeJS</Link>
        <a className='link-out' href='https://www.8thwall.com/8thwall/face-effects/project'>Studio: Face Effects (link out)</a>
        <Link to={`${base}/hand-threejs`}>👋 Hand: ThreeJS</Link>
        <Link to={`${base}/hand-aframe`}>👋 Hand: AFrame</Link>
      </nav>
      <h3>Sky 🎇</h3>
      <nav>
        <Link to={`${base}/sky-aframe`}>Sky: AFrame</Link>
        <Link to={`${base}/sky-threejs`}>Sky: ThreeJS</Link>
        <a className='link-out' href='https://playcanv.as/p/9QWbt7IB/'>Sky: PlayCanvas (link out)</a>
      </nav>
      <h3>Targets</h3>
      <p>Make sure to test with Pixel (4, 5a, 6) as they have 16:9 aspect ratio camera feed</p>
      <p>
        <a className='red-pill' href='https://docs.google.com/document/d/1qo5PvLuhncoRtkDUmJ3tsXJuUvxYBnRCkI82LDiMTE0/edit#heading=h.2mujl69w4nk1'>
          Flat Image Target Docs
        </a>
        &nbsp;
        <Link to={`${base}/curvy-targets-scene`}>Curvy Targets Scene - Contains simulated targets to test against</Link>
      </p>
      <h4>Flat & Curve Targets</h4>
      <nav>
        <Link to={`${base}/demo-artgallery`}>🖼 Art Gallery: AFrame</Link>
        <Link to={`${base}/demo-flyer`}>Flyer: AFrame</Link>
        <Link to={`${base}/demo-flyer-threejs`}>Flyer: ThreeJS</Link>
        <Link to={`${base}/demo-flyer-front`}>Front Flyer: AFrame</Link>
        <Link to={`${base}/demo-pages`}>Pages: AFrame</Link>
        <Link to={`${base}/demo-curvy-aframe`}>🍾 Curvy: AFrame</Link>
        <Link to={`${base}/demo-curvy-threejs`}>🍾 Curvy: ThreeJS</Link>
        <a className='link-out' href='https://8thwall.8thwall.app/curved-aframe/'>Curvy Cat (link out)</a>
      </nav>
      <h4>Scan Targets 🧸</h4>
      <nav>
        <Link to={`${base}/scan-target-threejs`}>Scan Target: ThreeJS</Link>
      </nav>
      <h3>Demos</h3>
      <nav>
        <Link to={`${base}/demo-scan`}>Scan: ThreeJS</Link>
        <Link to={`${base}/demo-manipulate`}>Manipulate: AFrame</Link>
        <Link to={`${base}/demo-large-texture`}>Large Texture: AFrame</Link>
        <Link to={`${base}/demo-photomode`}>Photo Mode: AFrame</Link>
        <Link to={`${base}/media-recorder-audio`}>Media Recorder Audio: ThreeJS</Link>
        <a className='link-out' href='https://8w.8thwall.app/portal-pipeline-tester?xrweb-any-device'>Portal (link out)</a>
        <a className='link-out' href='https://8w.8thwall.app/fireworks-pipeline-tester?xrweb-any-device'>Fireworks (link out)</a>
        <a className='link-out' href='https://8w.8thwall.app/mrcs-pipeline-tester?xrweb-any-device'>MRCS (link out)</a>
        <a className='link-out' href='https://8w.8thwall.app/tetavi-pipeline-tester?xrweb-any-device'>Tetavi (link out)</a>
        <a className='link-out' href='https://8thwall.8thwall.app/inline-ar?xrweb-any-device'>Inline AR (link out)</a>
        <a className='link-out' href='https://summitscramble.com/?xrweb-any-device'>Summit Scramble (link out)</a>
      </nav>
      <h3>External</h3>
      <nav>
        <a className='link-out' href='https://playcanv.as/p/M6qoWsRz/'>PlayCanvas (link out)</a>
        <a className='link-out' href='https://8th.io/cq6rv'>ESPN Cricket (link out)</a>
        <a className='link-out' href='https://byte.8thwall.app/spring-ca/'>C&A Spring 2023 (link out)</a>
        <a className='link-out' href='https://lensthat.8thwall.app/m-and-m-s-find-the-crew/'>M&Ms Find the Crew (link out)</a>
      </nav>
    </div>
  </React.Fragment>
)

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path={`${base}/`} component={Home} />
        <Route exact path={`${base}/core`} component={CoreView} />
        <Route exact path={`${base}/runtime-error`} component={RuntimeErrorView} />
        <Route path={`${base}/core/assets`} component={CoreAssetsView} />
        <Route path={`${base}/aspect-ratio`} component={AspectRatioView} />
        <Route path={`${base}/cube-aframe`} component={CubeAFrameView} />
        <Route path={`${base}/cube-babylonjs`} component={CubeBabylonjsView} />
        <Route path={`${base}/cube-threejs`} component={CubeThreejsView} />
        <Route path={`${base}/cube-webgl`} component={CubeWebGlView} />
        <Route path={`${base}/face-aframe`} component={FaceAFrameView} />
        <Route path={`${base}/face-threejs`} component={FaceThreejsView} />
        <Route path={`${base}/multiface-threejs`} component={MultiFaceThreejsView} />
        <Route path={`${base}/hand-threejs`} component={HandTrackingThreejsView} />
        <Route path={`${base}/hand-aframe`} component={HandTrackingAframeView} />
        <Route path={`${base}/estimate-scale`} component={EstimateScaleView} />
        <Route path={`${base}/world-points-threejs`} component={WorldPointsThreejsView} />
        <Route path={`${base}/vps-threejs`} component={VpsThreejsView} />
        <Route path={`${base}/scan-target-threejs`} component={ScanTargetView} />
        <Route path={`${base}/vps-aframe`} component={VpsAFrameView} />
        <Route path={`${base}/sky-threejs`} component={SkyThreejsView} />
        <Route path={`${base}/sky-aframe`} component={SkyAframeView} />
        <Route path={`${base}/scale-scene-aframe`} component={ScaleSceneAFrameView} />
        <Route path={`${base}/demo-artgallery`} component={DemoArtgalleryView} />
        <Route path={`${base}/demo-curvy-aframe`} component={DemoCurvyAFrameView} />
        <Route path={`${base}/demo-curvy-threejs`} component={DemoCurvyThreejsView} />
        <Route path={`${base}/demo-flyer-front`} component={DemoFlyerFrontView} />
        <Route path={`${base}/demo-flyer-threejs`} component={DemoFlyerThreejsView} />
        <Route path={`${base}/demo-flyer`} component={DemoFlyerView} />
        <Route path={`${base}/demo-manipulate`} component={DemoManipulateView} />
        <Route path={`${base}/demo-large-texture`} component={DemoTextureView} />
        <Route path={`${base}/demo-pages`} component={DemoPagesView} />
        <Route path={`${base}/demo-photomode`} component={DemoPhotomodeView} />
        <Route path={`${base}/demo-scan`} component={DemoScanView} />
        <Route path={`${base}/curvy-targets-scene`} component={CurvyTargetsSceneView} />
        <Route path={`${base}/device-info`} component={DeviceInfoView} />
        <Route path={`${base}/device-getUserMedia`} component={DeviceGetUserMediaView} />
        <Route path={`${base}/device-webXr`} component={DeviceWebXr} />
        <Route path={`${base}/device-motion`} component={DeviceMotionView} />
        <Route path={`${base}/device-location`} component={DeviceLocationView} />
        <Route path={`${base}/tapplace-aframe`} component={TapPlaceAFrameView} />
        <Route path={`${base}/tapplace-babylonjs`} component={TapPlaceBabylonjsView} />
        <Route path={`${base}/tapplace-threejs`} component={TapPlaceThreejsView} />
        <Route path={`${base}/webgl-version-aframe`} component={WebGLVersionAframe} />
        <Route path={`${base}/media-recorder-audio`} component={MediaRecorderAudioTestsView} />
      </BrowserRouter>
    )
  }
}

const render = () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  )
}

export {render}
