declare const React: any
declare const XR8: any
declare const AFRAME: any
declare const THREE: any

let once = true

const logHand = (event) => {
  console.log(`Hit ${JSON.stringify(event.detail)} and event.type ${event.type}`)
}

const handLoggerComponent = {
  init() {
    const scene = this.el.sceneEl

    console.log('hit handLoggerComponent')

    scene.addEventListener('xrhandloading', logHand)
    scene.addEventListener('xrhandscanning', logHand)
    scene.addEventListener('xrhandlost', logHand)
    scene.addEventListener('xrhandfound', logHand)
    scene.addEventListener('xrhandupdated', logHand)
  },
}

function HandTrackingAframeView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    if (once) {
      AFRAME.registerComponent('hand-logger', handLoggerComponent)
    }
    once = false

    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/hand-aframe.html'))

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

export {HandTrackingAframeView}
