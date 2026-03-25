import '../style/vps-threejs.scss'

declare const React: any
declare const XR8: any
declare const SkyCoachingOverlay: any

let skyCube
let nonSkyCube

function SkyAframeView() {
  const [autoShowHide, setAutoShowHide] = React.useState(true)
  const [invertLayerMask, setInvertLayerMask] = React.useState(true)
  // TODO(dat): Add controls for edgeSmoothness and percentage
  const [edgeSmoothness, setEdgeSmoothness] = React.useState(0.5)
  const [percentage, setPercentage] = React.useState(0)

  const [showNonSkyCube, setShowNonSkyCube] = React.useState(true)
  const [showSkyCube, setShowSkyCube] = React.useState(true)

  React.useEffect(() => {
    XR8.LayersController.configure({layers: {sky: {invertLayerMask}}})
  }, [invertLayerMask, edgeSmoothness])

  React.useEffect(() => {
    XR8.LayersController.configure({layers: {sky: {invertLayerMask}}})

    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/sky-aframe.html'))

    nonSkyCube = document.querySelector('#non-sky-cube')
    skyCube = document.querySelector('#sky-cube')
    nonSkyCube && setShowNonSkyCube(!nonSkyCube.getAttribute('visible'))
    skyCube && setShowSkyCube(!skyCube.getAttribute('visible'))

    // Cleanup
    return () => {
      const ascene = document.getElementsByTagName('a-scene')[0]
      ascene.parentNode.removeChild(ascene)
      html.className = origHtmlClass
      nonSkyCube = null
      skyCube = null
    }
  }, [])

  return (
    <>
      <div className='hud top-right'>
        <div className='segment'>
          Turn off Auto when perform manual control
        </div>
        <div className='segment'>
          <button onClick={() => {
            SkyCoachingOverlay.control.show()
          }}>Show Overlay</button>
        </div>
        <div className='segment'>
          <button onClick={() => {
            SkyCoachingOverlay.control.hide()
          }}>Hide Overlay</button>
        </div>
        <div className='segment'>
          <button onClick={() => {
            SkyCoachingOverlay.control.cleanup()
          }}>Clean Up</button>
        </div>
        <div className='segment'>
          <button onClick={() => {
            SkyCoachingOverlay.control.setAutoShowHide(!autoShowHide)
            setAutoShowHide(!autoShowHide)
          }}>
            Toggle Auto. Currently {autoShowHide ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className='segment'>
          Percentage <span id='sky-percentage'>{percentage?.toFixed(2)}</span>
        </div>
        <div className='segment'>
          <button onClick={() => {
            setInvertLayerMask(!invertLayerMask)
          }}>Invert Layer Mask</button>
        </div>
        <div className='segment'>
          <button onClick={() => {
            skyCube.setAttribute('visible', !showSkyCube)
            setShowSkyCube(!showSkyCube)
          }}>Sky cube is {showSkyCube ? 'showing' : 'hidden'}</button>
        </div>
        <div className='segment'>
          <button onClick={() => {
            nonSkyCube.setAttribute('visible', !showNonSkyCube)
            setShowNonSkyCube(!showNonSkyCube)
          }}>Non-sky cube is {showNonSkyCube ? 'showing' : 'hidden'}</button>
        </div>
      </div>
    </>
  )
}

export {SkyAframeView}
