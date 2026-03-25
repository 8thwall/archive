declare const React: any
declare const XR8: any

function MRCSView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/mrcs-aframe.html'))

    // Cleanup
    return () => {
      const ascene = document.getElementById('ascene')
      ascene.parentNode.removeChild(ascene)
      const buttons = document.getElementById('buttons')
      buttons.parentNode.removeChild(buttons)
      html.className = origHtmlClass
    }
  }, [])

  return (
    <></>
  )
}

export {MRCSView}
