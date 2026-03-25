declare const React: any
declare const XR8: any

function FireworksView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/fireworks-aframe.html'))

    // Cleanup
    return () => {
      const ascene = document.getElementById('ascene')
      ascene.parentNode.removeChild(ascene)

      const launchBtn = document.getElementById('launchBtn')
      launchBtn.parentNode.removeChild(launchBtn)
      html.className = origHtmlClass
    }
  }, [])

  return (
    <></>
  )
}

export {FireworksView}
