import '../style/demo-artgallery.scss'
import {ARTGALLERY} from '../modules/demo-artgallery'
import {trackingStatusModule} from '../modules/tracking-status'

declare const AFRAME: any
declare const React: any
declare const XR8: any

let once = true

function DemoArtgalleryView() {
  const [scale, setScale] = React.useState('responsive')
  const [disableWorldTracking, setDisableWorldTracking] = React.useState(true)

  const toggleWorldTracking = () => {
    setDisableWorldTracking(!disableWorldTracking)
  }

  const toggleScale = () => {
    const newScale = scale === 'responsive' ? 'absolute' : 'responsive'
    setScale(newScale)
  }

  React.useEffect(() => {
    XR8.stop()
    XR8.addCameraPipelineModules([
      trackingStatusModule(),
    ])
    XR8.XrController.configure({
      imageTargets: [
        'gallery-davinci',
        'gallery-monet',
        'gallery-renoir',
        'gallery-seurat',
        'gallery-vangogh',
      ],
      scale,
      disableWorldTracking
    })
    if (once) {
      ARTGALLERY.primitives.forEach(({name, val}) => AFRAME.registerPrimitive(name, val))
      ARTGALLERY.components.forEach(({name, val}) => AFRAME.registerComponent(name, val))
      once = false
    }
    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/demo-artgallery.html'))

    // Cleanup
    return () => {
      const ascene = document.getElementsByTagName('a-scene')[0]
      ascene.parentNode.removeChild(ascene)
      html.className = origHtmlClass
    }
  }, [scale, disableWorldTracking])

  return (
    <React.Fragment>
      <div className='hud top-right'>
        <div>
          <button onClick={toggleScale} >
            Toggle Scale <br /> current: "{scale}"
          </button>
        </div>
        <div>
          <button onClick={toggleWorldTracking} >
            Disable World Tracking <br /> current: "{disableWorldTracking ? 'true' : 'false'}"
          </button>
        </div>
      </div>

      <div id='container' className='collapsed'>
        <div className='outer'>
          <div id='closeButton' onClick={() => document.getElementById('container').classList.add('collapsed')}>close</div>
        </div>
        <div id='contents'></div>
        <div className='outer'>Article provided by Wikipedia</div>
      </div>
    </React.Fragment>
  )
}

export {DemoArtgalleryView}
