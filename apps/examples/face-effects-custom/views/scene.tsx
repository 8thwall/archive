import {AFrameScene} from '../lib/aframe-components'
import {FloatingButton} from '../lib/material-ui-components'
import {CustomShaders} from '../custom-shaders'

declare let React: any

const FilterType = {
  CUSTOM_SHADER: 'shader',
  PBR_MATERIAL: 'material',
  TEXTURE: 'texture',
  VIDEO: 'video',
}

const filters = [
  {
    name: 'Cosmic Waves - Custom Shader (1/4)',
    type: FilterType.CUSTOM_SHADER,
    material: 'shader: cosmic-waves; alphaTexture: #alpha-hero-eyes; transparent: true;',
  }, {
    name: 'Flat Disco [Mouth] - Custom Shader (2/4)',
    type: FilterType.CUSTOM_SHADER,
    material: 'shader: flat-disco; alphaTexture: #alpha-mouth-fill; transparent: true;',
  }, {
    id: 'shader-lava',
    name: 'Lava - Custom Shader (3/4)',
    type: FilterType.CUSTOM_SHADER,
    material: 'shader: lava; texture1: #smoke-tex; texture2: #lava-tex; repeat: 2 2; alphaTexture: #alpha-soft-mouth; transparent: true;',
  }, {
    name: 'Texture Vortex - Custom Shader (4/4)',
    type: FilterType.CUSTOM_SHADER,
    material: 'shader: texture-vortex; diffuseTexture: #vortex-tex; repeat: 2 2; alphaTexture: #alpha-soft-eyes; transparent: true;',
  }, {
    name: 'Cracked - PBR (1/7)',
    type: FilterType.PBR_MATERIAL,
    resource: '#cracked',
  }, {
    name: 'Gross Gray - PBR (2/7)',
    type: FilterType.PBR_MATERIAL,
    resource: '#gray',
  }, {
    name: 'Porcelain Koi - PBR (3/7)',
    type: FilterType.PBR_MATERIAL,
    resource: '#koi',
  }, {
    name: 'Porcelain Sakura - PBR (4/7)',
    type: FilterType.PBR_MATERIAL,
    resource: '#sakura',
  }, {
    name: 'Porcelain Waves - PBR (5/7)',
    type: FilterType.PBR_MATERIAL,
    resource: '#waves',
  }, {
    name: 'Rock Ice - PBR (6/7)',
    type: FilterType.PBR_MATERIAL,
    resource: '#ice',
  }, {
    name: 'Lip Gloss - PBR (7/7)',
    type: FilterType.PBR_MATERIAL,
    resource: '#lips',
  }, {
    name: 'UV Black - Tattoo (1/3)',
    type: FilterType.TEXTURE,
    resource: '#black',
  }, {
    name: 'UV Bright - Tattoo (2/3)',
    type: FilterType.TEXTURE,
    resource: '#bright',
  }, {
    name: '8 Tat - Tattoo (3/3)',
    type: FilterType.TEXTURE,
    resource: '#tattoo',
  }, {
    name: 'Beach - Video (1/4)',
    type: FilterType.VIDEO,
    resource: '#beach',
  }, {
    name: 'Silky Blue - Video (2/4)',
    type: FilterType.VIDEO,
    resource: '#blue',
  }, {
    name: 'Tunnel Dodeca - Video (3/4)',
    type: FilterType.VIDEO,
    resource: '#dodeca',
  }, {
    name: 'Tunnel Tri - Video (4/4)',
    type: FilterType.VIDEO,
    resource: '#tri',
  },
]

const updateScene = (filter) => {
  if (filter.type === FilterType.CUSTOM_SHADER) {
    document.querySelector('xrextras-face-mesh').setAttribute('material', filter.material)
    document.querySelector('xrextras-face-mesh').removeAttribute('material-resource')
  } else if (filter.type === FilterType.PBR_MATERIAL) {
    document.querySelector('xrextras-face-mesh').removeAttribute('material')
    document.querySelector('xrextras-face-mesh').setAttribute('material-resource', filter.resource)
  } else if (filter.type === FilterType.TEXTURE) {
    document.querySelector('xrextras-face-mesh').removeAttribute('material')
    document.querySelector('xrextras-face-mesh').setAttribute('material-resource', filter.resource)
  } else if (filter.type === FilterType.VIDEO) {
    document.querySelector('xrextras-face-mesh').removeAttribute('material')
    document.querySelector('xrextras-face-mesh').setAttribute('material-resource', filter.resource)
  }
}

// Renders an AFrame Scene and Material UI, and binds interaction between them.
const Scene = () => {
  // Store the currently selected color as react state.
  const [filterIdx, setFilterIdx] = React.useState(0)

  // When the user clicks the button...
  const nextFilter = () => {
    // Update react state.
    const nextIdx = (filterIdx + 1) % filters.length
    setFilterIdx(nextIdx)

    // Update aframe scene.
    updateScene(filters[nextIdx])
  }

  // click button on eyebrow raise
  React.useEffect(() => {
    const scene = document.querySelector('a-scene')
    const buttonRef = React.createRef()

    buttonRef.current =  document.querySelector('button[type="button"]')

    scene.addEventListener('xrlefteyebrowraised', () => {
      console.log('boop')
    // Click the button using the reference.
      buttonRef.current.click()
    })

    return () => {
    // Clean up the event listener when the component unmounts.
      scene.removeEventListener('xrlefteyebrowraised', () => {
        buttonRef.current.click()
      })
    }
  }, [])

  // Render the aframe scene and Material UI.
  return (
    <React.Fragment>
      <FloatingButton onClick={nextFilter} description={filters[filterIdx].name} />
      <AFrameScene
        sceneHtml={require('./scene.html')}
        shaders={CustomShaders}/>
    </React.Fragment>
  )
}

export {Scene}
