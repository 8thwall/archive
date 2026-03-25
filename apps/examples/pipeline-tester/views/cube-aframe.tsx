declare const React: any
declare const XR8: any
declare const AFRAME: any
declare const THREE: any

let once = true
let mesh = null

const meshEventComponent = {
  init() {
    this.el.addEventListener('xrmeshfound', ({detail}) => {
      const {bufferGeometry, position, rotation} = detail

      const texture = null
      const threeMaterial = new THREE.MeshBasicMaterial({
        vertexColors: !texture,
        wireframe: false,
        visible: true,
        map: texture,
      })

      mesh = new THREE.Mesh(bufferGeometry, threeMaterial)
      mesh.material.transparent = true
      mesh.visible = true

      mesh.position.copy(position)
      mesh.quaternion.copy(rotation)
      this.el.setObject3D('mesh', mesh)
    })

    this.el.addEventListener('xrmeshupdated', ({detail}) => {
      const {position, rotation} = detail

      mesh.position.copy(position)
      mesh.quaternion.copy(rotation)
    })
  },
}

function CubeAFrameView() {
  const [scale, setScale] = React.useState('responsive')
  const [enableVps, setEnableVps] = React.useState(false)
  const [opacity, setOpacity] = React.useState(0.5)

  const toggleScale = () => {
    const newScale = scale === 'responsive' ? 'absolute' : 'responsive'
    setScale(newScale)
  }

  const toggleVps = () => {
    setEnableVps(!enableVps)
  }

  const opacitySliderChanged = (e) => {
    const val = parseFloat(e.target.value)
    setOpacity(val)
    if (mesh) {
      mesh.material.opacity = val
    }
  }

  const recenter = () => {
    XR8.XrController.recenter()
  }

  React.useEffect(() => {
    XR8.XrController.configure({
      imageTargets: [],  // Disable default image targets.
      enableVps,
      scale,
    })

    const origHtmlClass = document.getElementsByTagName('html')[0].className

    document.body.insertAdjacentHTML('beforeend', require('../scenes/cube-aframe.html'))

    if (once) {
      AFRAME.registerComponent('xr-mesh', meshEventComponent)
      once = false
    }

    // Cleanup
    return () => {
      const ascene = document.getElementById('ascene')
      ascene.parentNode.removeChild(ascene)
      document.getElementsByTagName('html')[0].className = origHtmlClass
    }
  }, [])

  React.useEffect(() => {
    const scene = document.querySelector('a-scene')
    scene.removeAttribute('xrweb')
    scene.setAttribute(
      'xrweb',
      `allowedDevices: any; scale: ${scale}; enableVps: ${enableVps ? 'true' : 'false'}; verbose: true;`
    )
  }, [scale, enableVps])

  return (
    <React.Fragment>
      <div className='hud top-right'>
        <div>
          <label>Current scale</label>
          <button onClick={toggleScale}>{scale}</button>
        </div>
        <div>
          <label>Current VPS status</label>
          <button onClick={toggleVps}>{enableVps ? 'on' : 'off'}</button>
        </div>
        <div>
          <button onClick={recenter} >
            Recenter
          </button>
        </div>
        <div>
          <label>Opacity</label>
          <span>
            <input id='opacity-slider' type='range' value={opacity} max={1.0} step={0.01} onChange={opacitySliderChanged} />
            {opacity}
          </span>
        </div>
      </div>
    </React.Fragment>
  )
}
export {CubeAFrameView}
