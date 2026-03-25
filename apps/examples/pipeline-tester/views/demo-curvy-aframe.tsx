declare const React: any
declare const XR8: any

function DemoCurvyAFrameView() {
  React.useEffect(() => {
    const targets = require('../targets.json')
    const imageTargets = []
    for (let i = 0; i < targets.length; i++) {
      imageTargets.push(targets[i].name)
    }
    console.log('[demo-curvy-aframe] imageTargets', imageTargets)
    XR8.XrController.configure({
      allowedDevices: XR8.XrConfig.device().ANY,
      disableWorldTracking: true,
      imageTargets,
      verbose: true,
    })

    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/demo-curvy-aframe.html'))

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

export {DemoCurvyAFrameView}
