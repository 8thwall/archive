import '../style/demo-photomode.scss'
import {PHOTOMODE} from '../modules/demo-photomode'

declare const AFRAME: any
declare const React: any
declare const XR8: any

let once = true

function DemoPhotomodeView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    if (once) {
      PHOTOMODE.primitives.forEach(({name, val}) => AFRAME.registerPrimitive(name, val))
      PHOTOMODE.components.forEach(({name, val}) => AFRAME.registerComponent(name, val))
      once = false
    }
    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/demo-photomode.html'))

    // Cleanup
    return () => {
      const ascene = document.getElementsByTagName('a-scene')[0]
      ascene.parentNode.removeChild(ascene)
      html.className = origHtmlClass
    }
  }, [])

  return (
    <React.Fragment>
      <div id='photoModeContainer' style={{display: 'none'}}>
        <img id='photoModeImage' />
        <div id='flash'></div>
        <div id='shutterButton'></div>
        <div id='closeButton'></div>
      </div>
    </React.Fragment>
  )
}

export {DemoPhotomodeView}
