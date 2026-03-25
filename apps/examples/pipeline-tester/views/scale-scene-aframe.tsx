import {trackingStatusModule} from '../modules/tracking-status'

declare const React: any
declare const XR8: any

function ScaleSceneAFrameView() {
  const [scale, setScale] = React.useState('responsive')
  const [disableWorldTracking, setDisableWorldTracking] = React.useState(false)

  const toggleScale = () => {
    const newScale = scale === 'responsive' ? 'absolute' : 'responsive'
    setScale(newScale)
  }

  const toggleWorldTracking = () => {
    setDisableWorldTracking(!disableWorldTracking)
  }

  const recenter = () => {
    XR8.XrController.recenter()
  }

  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    XR8.addCameraPipelineModules([
      trackingStatusModule(),
    ])

    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className

    document.body.insertAdjacentHTML('beforeend', require('../scenes/scale-scene-aframe.html'))

    // Cleanup
    return () => {
      const ascene = document.getElementById('ascene')
      ascene.parentNode.removeChild(ascene)
      document.getElementsByTagName('html')[0].className = origHtmlClass
    }
  }, [])

  React.useEffect(() => {
    const scene = document.querySelector('a-scene')
    scene.removeAttribute('xrweb')
    scene.setAttribute(
      'xrweb',
      `allowedDevices: any; scale: ${scale}; ` +
      `disableWorldTracking: ${disableWorldTracking ? 'true' : 'false'}`
    )
  }, [scale, disableWorldTracking])

  return (
    <React.Fragment>
      <div className='hud top-right'>
        <button onClick={toggleScale} >
          Current scale: "{scale}"
        </button>
        <button onClick={toggleWorldTracking} >
          Disable World Tracking <br /> current: "{disableWorldTracking ? 'true' : 'false'}"
        </button>
        <button onClick={recenter} >
          Recenter
        </button>
      </div>
    </React.Fragment>
  )
}

export {ScaleSceneAFrameView}
