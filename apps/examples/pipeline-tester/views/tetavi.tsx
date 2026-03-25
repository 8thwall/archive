declare const React: any
declare const XR8: any

function TetaviView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/tetavi-aframe.html'))

    // Cleanup
    return () => {
      const ascene = document.getElementById('ascene')
      ascene.parentNode.removeChild(ascene)
      const overlay = document.getElementById('overlay')
      overlay.parentNode.removeChild(overlay)
      html.className = origHtmlClass
    }
  }, [])

  return (
    <></>
  )
}

export {TetaviView}
