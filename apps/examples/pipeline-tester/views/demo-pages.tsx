import {PAGES} from '../modules/demo-pages'

declare const AFRAME: any
declare const React: any
declare const XR8: any

let once = true

function DemoPagesView() {
  React.useEffect(() => {
    if (once) {
      PAGES.primitives.forEach(({name, val}) => AFRAME.registerPrimitive(name, val))
      PAGES.components.forEach(({name, val}) => AFRAME.registerComponent(name, val))
      once = false
    }
    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/demo-pages.html'))

    // Cleanup
    return () => {
      const ascene = document.getElementsByTagName('a-scene')[0]
      ascene.parentNode.removeChild(ascene)
      html.className = origHtmlClass
    }
  }, [])

  return (
    <React.Fragment>
      <div id='indexElement' style={{color: 'white', position: 'absolute', bottom: '0px', left: '0px', zIndex: 15}}>
        ...
      </div>
    </React.Fragment>
  )
}

export {DemoPagesView}
