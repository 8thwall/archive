import {TAPPLACE} from '../modules/tapplace-aframe'

declare const AFRAME: any
declare const React: any
declare const XR8: any

let once = true

function TapPlaceAFrameView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    if (once) {
      TAPPLACE.primitives.forEach(({name, val}) => AFRAME.registerPrimitive(name, val))
      TAPPLACE.components.forEach(({name, val}) => AFRAME.registerComponent(name, val))
      once = false
    }
    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/tapplace-aframe.html'))

    // Cleanup
    return () => {
      const ascene = document.getElementsByTagName('a-scene')[0]
      ascene.parentNode.removeChild(ascene)
      html.className = origHtmlClass
    }
  }, [])

  return (
    <></>
  )
}

export {TapPlaceAFrameView}
