import '../style/app.scss'
import {ROVER} from '../components/rover'
import {EXTRAS} from '../components/extras'

declare let AFRAME: any
declare let React: any

const LEGACY_ENTER_VR = false

let once = true

function RoverView() {
  React.useEffect(() => {
    if (once) {
      ROVER.primitives.forEach(({name, val}) => AFRAME.registerPrimitive(name, val))
      ROVER.components.forEach(({name, val}) => AFRAME.registerComponent(name, val))

      EXTRAS.primitives.forEach(({name, val}) => AFRAME.registerPrimitive(name, val))
      EXTRAS.components.forEach(({name, val}) => AFRAME.registerComponent(name, val))
      once = false
    }
    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../fragments/rover-scene.html'))

    // Cleanup
    return () => {
      const ascene = document.getElementsByTagName('a-scene')[0]
      ascene.parentNode.removeChild(ascene)
      html.className = origHtmlClass
    }
  }, [])

  const enterVr = () => (document.getElementsByTagName('a-scene')[0] as any).sceneEl.enterVR()

  return (
    <React.Fragment>
      <div id='loadcover'>
        <h2>Loading...</h2>
      </div>
      {!LEGACY_ENTER_VR &&
        <div className='coverart'>
          <div id='square' onClick={enterVr}>
            <h2 id='almostvr'>Visit<br/>8th.io/rovr<br/>in a VR Headset</h2>
            {/* ROVR RUN LOGO */}
            <img id='logotitle' src={require('../assets/images/title-1.png')} />
            {/* Powered by 8th Wall logo */}
            <h2 id="enterVrMessage">Click to Enter VR</h2>
          </div>
        </div>}
    </React.Fragment>
  )
}

export {RoverView}
