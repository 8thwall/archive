import {logLifecyclePipelineModule} from '../modules/log-lifecycle'
import {cubeThreejsPipelineModule} from '../modules/cube-threejs'
import {accelerationsModule} from '../modules/accelerations'
import {trackingStatusModule} from '../modules/tracking-status'
import {meshUpdateModule} from '../modules/mesh-update'
import {vpsWayspotModule} from '../modules/vps-wayspot'
import {sleepModule} from '../modules/sleep'
import '../style/vps-threejs.scss'

declare const React: any
declare const XR8: any
declare const XRExtras: any
declare const VpsCoachingOverlay: any

const HEIGHTS = [1.0, 2.0, 5.0, 25.0]
const XZ_OFFSETS = [{x: 0.0, z: 0.0}, {x: -1.0, z: 1.0}, {x: 1.0, z: -1.0}]
const FACING = {
  'forward': {w: 1.0, x: 0.0, y: 0.0, z: 0.0},
  '45° right': {w: 0.923880, x: 0.0, y: -0.382683, z: 0.0},
  '45° left': {w: 0.923880, x: 0.0, y: 0.382683, z: 0.0},
}
const OVERLAY_CONFIG = {
  'default': {},
  'specific [Eagles]': {
    wayspotName: 'Eagles',
  },
  'custom': {
    hintImage: 'https://lh3.googleusercontent.com/09zGWmcy1aYBscYqp6ewvigP-afyrgKnMbMEEktTpEb1cPlsTAOxy3DDZIaW8uGTat29DQZyvbVJr4J-EXQIxO6w3RTPmNMM-wjHwecY',
    promptColor: 'pink',
    animationColor: 'blue',
    animationDuration: 1000,
    promptPrefix: 'custom1',
    promptSuffix: 'custom2',
    statusText: 'auto',
  },
  'missing': {
    wayspotName: 'Disneyland',
  },
}

function VpsThreejsView() {
  const [height, setHeight] = React.useState(HEIGHTS[0])
  const [offsetIdx, setOffsetIdx] = React.useState(0)
  const [orientation, setOrientation] = React.useState('forward')
  const [projWayspots, setProjWayspots] = React.useState(null)
  const [wayspotStatus, setWayspotStatus] = React.useState({})
  const [overlayConfig, setOverlayConfig] = React.useState('default')
  const [projectWayspotNames, setProjectWayspotNames] = React.useState([])

  const start = () => {
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
  }

  const onWayspotScanning = ({wayspots}) => {
    setProjWayspots(wayspots)
  }

  const onWayspotStatus = (statusName, detail) => {
    setWayspotStatus(waS => ({
      ...waS,
      [detail.name]: statusName,
    }))
  }

  React.useEffect(() => {
    console.log(`Configuring wayspot anchors: ${JSON.stringify(projectWayspotNames)}`)
    XR8.XrController.configure({
      scale: 'responsive',
      enableVps: true,
      imageTargets: [],  // Disable default image targets.
      verbose: true,
      projectWayspots: projectWayspotNames,
      // anchorageUrl: 'https://vps-frontend-staging.eng.nianticlabs.com/web/anchorage.Anchorage/',
      // vpsUrl: 'https://vps-frontend-staging.eng.nianticlabs.com/web/vps_frontend.protogen.Localizer/',
    })

    // Sample VpsCoachingOverlay inputs.
    // const overlayConfigA = {
    //   hintImage: 'https://lh3.googleusercontent.com/09zGWmcy1aYBscYqp6ewvigP-afyrgKnMbMEEktTpEb1cPlsTAOxy3DDZIaW8uGTat29DQZyvbVJr4J-EXQIxO6w3RTPmNMM-wjHwecY',
    //   wayspotName: 'Monta Vista Park',
    // }

    // VpsCoachingOverlay.configure(overlayConfigA)
    // VpsCoachingOverlay.configure(overlayConfigB)
    // VpsCoachingOverlay.configure(overlayConfigC)
    VpsCoachingOverlay.configure(OVERLAY_CONFIG[overlayConfig])

    XR8.addCameraPipelineModules([                 // Add camera pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
      XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      // logLifecyclePipelineModule(),
      vpsWayspotModule({onWayspotScanning, onWayspotStatus}),
      meshUpdateModule(),
      VpsCoachingOverlay.pipelineModule(),
    ])
    document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')

    // Cleanup
    return () => {
      const canvas = document.getElementById('camerafeed')
      canvas.parentNode.removeChild(canvas)
      XR8.stop()
      XR8.clearCameraPipelineModules()
    }
  }, [])

  React.useEffect(() => {
    XR8.stop()
    XR8.XrController.configure({
      scale: 'responsive',
      enableVps: true,
      allowedDevices: 'ANY',
      imageTargets: [],  // Disable default image targets.
      verbose: true,
      // anchorageUrl: 'https://vps-frontend-staging.eng.nianticlabs.com/web/anchorage.Anchorage/',
      // vpsUrl: 'https://vps-frontend-staging.eng.nianticlabs.com/web/vps_frontend.protogen.Localizer/',
    })
    start()
  }, [])

  // Whenever x, y, or z offset changes, update the camera projection matrix and call recenter.
  React.useEffect(() => {
    const {x, z} = XZ_OFFSETS[offsetIdx]
    const origin = {x, y: height, z}
    const facing = FACING[orientation]

    console.log(`setting overlay to ${JSON.stringify(OVERLAY_CONFIG[overlayConfig])} with overlay config ${overlayConfig}`)
    XR8.removeCameraPipelineModule('vps-coaching-overlay')
    VpsCoachingOverlay.configure(OVERLAY_CONFIG[overlayConfig])
    XR8.addCameraPipelineModule(VpsCoachingOverlay.pipelineModule())

    XR8.XrController.updateCameraProjectionMatrix({origin, facing})
    XR8.XrController.recenter()
  },
  [offsetIdx, height, orientation, overlayConfig])

  React.useEffect(() => {
    console.log(`Updated projectWayspotNames with ${JSON.stringify(projectWayspotNames)}`)
    XR8.stop()
    XR8.XrController.configure({
      scale: 'responsive',
      enableVps: true,
      allowedDevices: 'ANY',
      imageTargets: [],  // Disable default image targets.
      verbose: true,
      projectWayspots: projectWayspotNames,
    })
    start()
  },
  [projectWayspotNames])

  const toggleCameraHeight = () => {
    // Select the following height in the list.
    const newHeight = HEIGHTS[(HEIGHTS.indexOf(height) + 1) % HEIGHTS.length]
    setHeight(newHeight)
  }

  const tapSetOverlayConfig = (event) => {
    console.log(`changing overlay to ${event.target.value}`)
    setOverlayConfig(event.target.value)
  }

  const layoutOverlayConfig = () => {
    const radioButtons = Object.keys(OVERLAY_CONFIG).map((key, index) => (
      <div key={index}>
        <input type='radio' value={key} name='xzoffset' />
        <span>{key}</span>
      </div>
    ))

    return (
      <div onChange={tapSetOverlayConfig}>
        {radioButtons}
      </div>
    )
  }

  const tapSetWayspotNames = (event) => {
    console.log(`Checked ${event.target.checked} - name ${event.target.value}`)
    const names = [...projectWayspotNames]

    if (event.target.checked) {
      names.push(event.target.value)
    } else {
      const index = names.indexOf(event.target.value)
      names.splice(index, 1)
    }

    setProjectWayspotNames(names)
  }

  const layoutWayspotNames = () => {
    const wayspotNames = ['ted-thompson', 'college-ave'].map(wayspotName => (
      <div key={wayspotName}>
        <input type='checkbox' value={wayspotName} name='wayspot-name' />
        <span>{wayspotName}</span>
      </div>
    ))

    return (
      <div onChange={tapSetWayspotNames}>
        {wayspotNames}
      </div>
    )
  }

  const setXZOffset = (event) => {
    setOffsetIdx(event.target.value)
  }

  const layoutXZOffsets = () => {
    const radioButtons = XZ_OFFSETS.map((xzOffset, index) => (
      <div key={index}>
        <input type='radio' value={index} name='xzoffset' />
        <span>x: {xzOffset.x}, z: {xzOffset.z}</span>
      </div>
    ))

    return (
      <div onChange={setXZOffset}>
        {radioButtons}
      </div>
    )
  }

  const setStartingDirection = (event) => {
    setOrientation(event.target.value)
  }

  const layoutStartingDirection = () => {
    const radioButtons = Object.keys(FACING).map((key, index) => (
      <div key={index}>
        <input type='radio' value={key} name='direction' />
        <span>{key}</span>
      </div>
    ))

    return (
      <div onChange={setStartingDirection}>
        {radioButtons}
      </div>
    )
  }

  const wayspotStatuses = Object.entries(wayspotStatus)
  console.log(JSON.stringify(wayspotStatuses))
  return (
    <React.Fragment>
      <div className='hud top-right'
        style={{
          color: 'black',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* <div className='segment'>
          <button onClick={() => {
            XR8.XrController.recenter()
          }} >
            Recenter
          </button>
        </div>

        <div className='segment'>
          <button onClick={toggleCameraHeight}>
            Toggle Cam Height <br /> current: "{height}"
          </button>
        </div>

        <div className='segment'>
          <h4>XZ offset:</h4>
          {layoutXZOffsets()}
        </div>

        <div className='segment'>
          <h4>VPS Overlay Config:</h4>
          {layoutOverlayConfig()}
        </div>

        <div className='segment'>
          <h4>Specified Wayspots:</h4>
          {layoutWayspotNames()}
        </div>

        <div className='segment'>
          <h4>Starting direction:</h4>
          {layoutStartingDirection()}
        </div>
        {projWayspots &&
          <div className='segment'>
            <h4>Project Wayspots [{projWayspots.length}]</h4>
            <div className='wayspot-list'>
              {projWayspots.map(wa => (
                <div key={wa.id}>{wa.name}</div>
              ))}
            </div>
          </div>
        }
        <div className='segment'>
          <h4>Wayspot Statuses [{wayspotStatuses.length}]</h4>
          <div className='status-list'>
            {wayspotStatuses.map(([name, status]) => (
              <>
                <div key={name} className='reference'>{name}</div>
                <div key={`${name}status`} className='status'>{status}</div>
              </>
            ))}
          </div>
        </div> */}
      </div>
    </React.Fragment>
  )
}

export {VpsThreejsView}
