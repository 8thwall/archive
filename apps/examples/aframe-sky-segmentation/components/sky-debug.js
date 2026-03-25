let invertMaskBoolean = false
let swapTextureBoolean = true

const swapTextureIcon = require('../assets/UI/swapTexture.png')
const invertMaskIcon = require('../assets/UI/invertMask.png')
const recenterIcon = require('../assets/UI/recenter.png')

const handleInvertMask = () => {
  invertMaskBoolean = !invertMaskBoolean
  XR8.LayersController.configure({layers: {sky: {invertLayerMask: invertMaskBoolean}}})
}

const handleSwapTexture = (el) => {
  swapTextureBoolean = !swapTextureBoolean
  el.setAttribute('skybox', {transparent: swapTextureBoolean})
}

const handleRecenter = () => {
  XR8.LayersController.recenter()
}

const debugComponent = {
  schema: { },
  init() {
    const {el} = this

    const debugOptions = document.createElement('div')
    debugOptions.style.width = '100%'
    debugOptions.style.height = '100%'
    debugOptions.style.display = 'grid'
    debugOptions.style.position = 'absolute'
    debugOptions.style.top = '0'
    debugOptions.style.right = '0'
    debugOptions.style.gridTemplateColumns = '26fr 3fr 1fr'
    debugOptions.style.gridTemplateRows = '5fr 1fr 1fr 1fr 5fr'
    debugOptions.style.zIndex = '10'
    debugOptions.style.alignItems = 'center'
    debugOptions.id = 'debugOptions'
    debugOptions.style.zIndex = '10'

    document.body.appendChild(debugOptions)

    // Swap Texture Button
    const swapTextureGrid = document.createElement('div')
    debugOptions.appendChild(swapTextureGrid)
    swapTextureGrid.style.width = '100%'
    swapTextureGrid.style.height = '100%'
    swapTextureGrid.style.display = 'grid'
    swapTextureGrid.style.gridTemplateRows = '1fr 1fr'
    swapTextureGrid.style.gridTemplateColumns = '1fr'
    swapTextureGrid.style.gridRow = 2
    swapTextureGrid.style.gridColumn = 2
    swapTextureGrid.style.rowGap = '.5vh'
    swapTextureGrid.id = 'swapTextureGrid'

    const swapTextureImg = document.createElement('div')
    swapTextureGrid.appendChild(swapTextureImg)
    swapTextureImg.style.width = '100%'
    swapTextureImg.style.height = '100%'
    swapTextureImg.style.gridRow = 1
    swapTextureImg.style.gridColumn = 1
    swapTextureImg.style.backgroundRepeat = 'no-repeat'
    swapTextureImg.style.backgroundSize = 'contain'
    swapTextureImg.style.backgroundPosition = 'bottom'
    swapTextureImg.style.backgroundImage = `url('${swapTextureIcon}')`

    const swapTextureTxt = document.createElement('p')
    swapTextureGrid.appendChild(swapTextureTxt)
    swapTextureTxt.innerHTML = 'Swap <br> Texture'
    swapTextureTxt.style.gridRow = 2
    swapTextureTxt.style.gridColumn = 1
    swapTextureTxt.style.fontFamily = 'Nunito, sans-serif'
    swapTextureTxt.style.fontSize = '2vh'
    swapTextureTxt.style.color = 'white'
    swapTextureTxt.style.textAlign = 'center'
    swapTextureTxt.style.marginTop = 0
    swapTextureTxt.style.textShadow = '2px 2px 2px rgba(0, 0, 0, 0.5)'

    // Invert Mask Button
    const invertMaskGrid = document.createElement('div')
    debugOptions.appendChild(invertMaskGrid)
    invertMaskGrid.style.width = '100%'
    invertMaskGrid.style.height = '100%'
    invertMaskGrid.style.display = 'grid'
    invertMaskGrid.style.gridTemplateRows = '1fr 1fr'
    invertMaskGrid.style.gridTemplateColumns = '1fr'
    invertMaskGrid.style.gridRow = 3
    invertMaskGrid.style.gridColumn = 2
    invertMaskGrid.style.rowGap = '.5vh'

    const invertMaskImg = document.createElement('div')
    invertMaskGrid.appendChild(invertMaskImg)
    invertMaskImg.style.width = '100%'
    invertMaskImg.style.height = '100%'
    invertMaskImg.style.gridRow = 1
    invertMaskImg.style.gridColumn = 1
    invertMaskImg.style.backgroundRepeat = 'no-repeat'
    invertMaskImg.style.backgroundSize = 'contain'
    invertMaskImg.style.backgroundPosition = 'bottom'
    invertMaskImg.style.backgroundImage = `url('${invertMaskIcon}')`

    const invertMaskTxt = document.createElement('p')
    invertMaskGrid.appendChild(invertMaskTxt)
    invertMaskTxt.innerHTML = 'Invert <br> Mask'
    invertMaskTxt.style.gridRow = 2
    invertMaskTxt.style.gridColumn = 1
    invertMaskTxt.style.fontFamily = 'Nunito, sans-serif'
    invertMaskTxt.style.fontSize = '2vh'
    invertMaskTxt.style.color = 'white'
    invertMaskTxt.style.textAlign = 'center'
    invertMaskTxt.style.marginTop = 0
    invertMaskTxt.style.textShadow = '2px 2px 2px rgba(0, 0, 0, 0.5)'

    // Pin Camera Button
    const recenterGrid = document.createElement('div')
    debugOptions.appendChild(recenterGrid)
    recenterGrid.style.width = '100%'
    recenterGrid.style.height = '100%'
    recenterGrid.style.display = 'grid'
    recenterGrid.style.gridTemplateRows = '1fr 1fr'
    recenterGrid.style.gridTemplateColumns = '1fr'
    recenterGrid.style.gridRow = 4
    recenterGrid.style.gridColumn = 2
    recenterGrid.style.rowGap = '.5vh'
    recenterGrid.id = 'recenterGrid'

    const recenterImg = document.createElement('div')
    recenterGrid.appendChild(recenterImg)
    recenterImg.style.width = '100%'
    recenterImg.style.height = '100%'
    recenterImg.style.gridRow = 1
    recenterImg.style.gridColumn = 1
    recenterImg.style.backgroundRepeat = 'no-repeat'
    recenterImg.style.backgroundSize = 'contain'
    recenterImg.style.backgroundPosition = 'bottom'
    recenterImg.style.backgroundImage = `url('${recenterIcon}')`

    const recenterTxt = document.createElement('p')
    recenterGrid.appendChild(recenterTxt)
    recenterTxt.innerHTML = 'Recenter<br> Scene'
    recenterTxt.style.gridRow = 2
    recenterTxt.style.gridColumn = 1
    recenterTxt.style.fontFamily = 'Nunito, sans-serif'
    recenterTxt.style.fontSize = '2vh'
    recenterTxt.style.color = 'white'
    recenterTxt.style.textAlign = 'center'
    recenterTxt.style.marginTop = 0
    recenterTxt.style.textShadow = '2px 2px 2px rgba(0, 0, 0, 0.5)'

    invertMaskGrid.addEventListener('touchstart', handleInvertMask)
    recenterGrid.addEventListener('touchstart', handleRecenter)
    swapTextureGrid.addEventListener('touchstart', () => {
      handleSwapTexture(el)
    })
  },
}
export {debugComponent}
