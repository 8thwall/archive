declare const React: any
declare const XR8: any
declare const AFRAME: any
declare const THREE: any

const hiderMaterialComponent = {
  init() {
    this.el.addEventListener('model-loaded', () => {
      const mesh = this.el.getObject3D('mesh')
      if (!mesh) {
        return
      }
      mesh.traverse((node) => {
        if (node.isMesh) {
          const mat = new THREE.MeshStandardMaterial()
          mat.colorWrite = false
          node.material = mat
        }
      })
    })
  },
}

let once = true

function FaceAFrameView() {
  React.useEffect(() => {
    XR8.XrController.configure({imageTargets: []})  // Disable default image targets.

    if (once) {
      AFRAME.registerComponent('hider-material', hiderMaterialComponent)
    }
    once = false

    const html = document.getElementsByTagName('html')[0]
    const origHtmlClass = html.className
    document.body.insertAdjacentHTML('beforeend', require('../scenes/face-aframe.html'))

    // Cleanup
    return () => {
      const ascene = document.getElementsByTagName('a-scene')[0]
      ascene.parentNode.removeChild(ascene)
      html.className = origHtmlClass
    }
  }, [])

  const showRawVideo = () => {
    const rawVideoElement = document.querySelector('video')
    rawVideoElement.style.width = null
    rawVideoElement.style.height = null
    rawVideoElement.width = 300
    rawVideoElement.height = 400
    rawVideoElement.style.opacity = '1'
  }

  return (
    <>
      <button onClick={showRawVideo} style={{position: 'absolute', zIndex: 1000}}>Show Video</button>
    </>
  )
}

export {FaceAFrameView}
