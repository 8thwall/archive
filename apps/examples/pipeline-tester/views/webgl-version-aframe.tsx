/* eslint-disable no-console */
/* eslint-disable max-len */

declare const React: any
declare const XR8: any

function WebGLVersionAframe() {
  const params = new URLSearchParams(document.location.search)
  const useWebGL2 = !params.get('webgl1')

  const [isWebGl2, setIsWebGl2] = React.useState(true)
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.
    const webglSelect = `renderer="webgl2: ${useWebGL2 ? 'true' : 'false'};"`
    const aframeSceneHtml = require('../scenes/webgl-version-aframe.html')
      .replace("{WEBGL_SELECT}", webglSelect)
        const html = document.getElementsByTagName('html')[0]
  
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', aframeSceneHtml)
    setIsWebGl2((document.querySelector('a-scene') as any)?.renderer?.capabilities?.isWebGL2)

    // Cleanup
    return () => {
      const ascene = document.getElementsByTagName('a-scene')[0]
      ascene.parentNode.removeChild(ascene)
      html.className = origHtmlClass
    }
  }, [])


  return (
    <React.Fragment>
      <div className='hud top-right'
        style={{
          color: 'black',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <div>
          <p>Your A-Scene uses WebGL {isWebGl2 ? '2' : '1'}</p>
        </div>
      </div>
    </React.Fragment>
  )
}

export {WebGLVersionAframe}
