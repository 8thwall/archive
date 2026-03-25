let currentRow
let registerOnce = true
let watchScale = false
let selectedNode
let colorOptions

const watchColors = ['#EABF8B', '#322FF5', '#D4DBED', 'LUXWATCHMAIN']
const slenderWatchColors = ['#151313', '#6F675C', '#B29270', 'STANDARDSURFACE6SG']

const cuffColors = ['#8D8783', '#9B793C', '#8D583F', 'GOLD1']
const maleBangleColors = ['#9C8969', '#7E7E7E', '#161616', 'GOLD1']
const femaleBangleColors = ['#9F8259', '#918B87', '#9B5F44', 'GOLD6']

const diamondColors = ['#98753A', '#89827F', '#85513A', 'GOLD1']
const emeraldColors = ['#98753A', '#89827F', '#85513A', 'GOLD1']
const marquiseColors = ['#98753A', '#89827F', '#85513A', 'GOLD1']
const bandColors = ['#9C783C', '#827D79', '#060606', 'GOLD2']
const signetColors = ['#9C784C', '#827D71', '#060607', 'METAL']

let fingerOptions
let currentRing
const diamondFingers = ['ring', 'pinky', 'middle', 'index', 'thumb']
const emeraldFingers = ['middle', 'pinky', 'ring', 'index', 'thumb']
const marquiseFingers = ['index', 'pinky', 'ring', 'middle', 'thumb']
const bandFingers = ['thumb', 'pinky', 'middle', 'ring', 'index']
const signetFingers = ['pinky', 'ring', 'middle', 'index', 'thumb']

// Function to handle the click event on accessory options
const handleAccessoryOptionClick = (event, selectionRow) => {
  const selectedButton = event.target
  const selectedID = selectedButton.id
  let selectedName
  if (selectedButton.attributes.name) {
    selectedName = selectedButton.attributes.name.value
  }

  const backButton = document.getElementById('backButton')
  const model = document.getElementById('model')
  const ringModel = document.getElementById('ringModel')
  const indexModel = document.getElementById('indexModel')
  const pinkyModel = document.getElementById('pinkyModel')
  const thumbModel = document.getElementById('thumbModel')
  const middleModel = document.getElementById('middleModel')

  const mainSelection = document.getElementById('mainSelection')
  const watchSelection = document.getElementById('watchSelection')
  const ringSelection = document.getElementById('ringSelection')
  const braceletSelection = document.getElementById('braceletSelection')

  const variationUI = document.getElementById('variationUI')
  const variationOptions = document.getElementById('variationOptions')

  let currentModel
  const fingerOptionsUI = document.getElementById('fingerOptions')
  const fingerUI = document.getElementById('fingerUI')

  const pinkyTexture = require('../assets/UI/pinkyImg.png')
  const ringTexture = require('../assets/UI/ringImg.png')
  const middleTexture = require('../assets/UI/middleImg.png')
  const indexTexture = require('../assets/UI/indexImg.png')
  const thumbTexture = require('../assets/UI/thumbImg.png')

  const fingerMappings = {
    'pinky': {
      texture: pinkyTexture,
      model: pinkyModel,
    },
    'ring': {
      texture: ringTexture,
      model: ringModel,
    },
    'middle': {
      texture: middleTexture,
      model: middleModel,
    },
    'index': {
      texture: indexTexture,
      model: indexModel,
    },
    'thumb': {
      texture: thumbTexture,
      model: thumbModel,
    },
  }

  // untoggles none option if another ring is selected
  if (selectionRow.id === 'ringSelection') {
    if (selectedName === 'diamond') {
      currentRing = 'diamond'
      currentModel = fingerMappings[diamondFingers[0]].model
    } else if (selectedName === 'emerald') {
      currentRing = 'emerald'
      currentModel = fingerMappings[emeraldFingers[0]].model
    } else if (selectedName === 'marquise') {
      currentRing = 'marquise'
      currentModel = fingerMappings[marquiseFingers[0]].model
    } else if (selectedName === 'band') {
      currentRing = 'band'
      currentModel = fingerMappings[bandFingers[0]].model
    } else if (selectedName === 'signet') {
      currentRing = 'signet'
      currentModel = fingerMappings[signetFingers[0]].model
    }
    if (selectedID === 'noneRing') {
      const ringArray = [ringModel, middleModel, pinkyModel, indexModel, thumbModel]
      Array.from(ringArray).forEach((child) => {
        if (child.getAttribute('gltf-model')) {
          child.removeAttribute('gltf-model')
        }
      })
    } else {
      currentModel.removeAttribute('gltf-model')
    }
    if (selectedButton.classList.contains('optionSelected') && !selectedButton.classList.contains('noneOption')) {
      // do nothing
    } else if (!selectedButton.classList.contains('noneOption')) {
      document.getElementById('noneRing').classList.remove('optionSelected')
      currentModel.setAttribute('gltf-model', `#${selectedName}`)
      currentModel.setAttribute('scale-to-hand', {size: 16, adjustment: 0.8})  // THIS DIDNT BREAK??
    } else {
      Array.from(selectionRow.children).forEach((child) => {
        if (child.classList.contains('optionSelected')) {
          child.classList.remove('optionSelected')
        }
      })
    }
  }

  const watchScaletoHand = () => {
    currentModel.setAttribute('scale-to-hand', {size: 4, adjustment: 0.65})
    currentModel.removeEventListener('model-loaded', watchScaletoHand)
  }

  // const ringScaletoHand = () => {
  //   currentModel.setAttribute('scale-to-hand', {size: 16, adjustment: 0.8})
  //   currentModel.removeEventListener('model-loaded', ringScaletoHand)
  // }

  // disable multi-selection if it's watches or bracelets
  if (selectionRow.id === 'watchSelection' || selectionRow.id === 'braceletSelection') {
    currentModel = model
    Array.from(selectionRow.children).forEach((child) => {
      if (child.classList.contains('optionSelected')) {
        child.classList.remove('optionSelected')
      }
    })
    currentModel.removeAttribute('gltf-model')
    if (!selectedButton.classList.contains('noneOption')) {
      currentModel.setAttribute('gltf-model', `#${selectedName}`)
      if (!watchScale) {
        currentModel.addEventListener('model-loaded', watchScaletoHand)
        watchScale = true
      }
    }
  }

  if (selectionRow.id === 'watchSelection') {
    Array.from(braceletSelection.children).forEach((child) => {
      if (child.classList.contains('optionSelected')) {
        child.classList.remove('optionSelected')
      }
    })
    document.getElementById('noneBracelet').classList.add('optionSelected')
  } else if (selectionRow.id === 'braceletSelection') {
    Array.from(watchSelection.children).forEach((child) => {
      if (child.classList.contains('optionSelected')) {
        child.classList.remove('optionSelected')
      }
    })
    document.getElementById('noneWatch').classList.add('optionSelected')
  }

  if (!selectedButton.classList.contains('back') && !selectedButton.classList.contains('variation') && !selectedButton.classList.contains('finger')) {
    selectedButton.classList.toggle('optionSelected')
  }

  // back button functionality
  backButton.addEventListener('click', () => {
    currentRow.style.opacity = '0'
    currentRow.style.pointerEvents = 'none'

    variationUI.style.opacity = '0'
    variationUI.style.pointerEvents = 'none'

    fingerUI.style.opacity = '0'
    fingerUI.style.pointerEvents = 'none'

    backButton.style.opacity = '0'
    backButton.style.pointerEvents = 'none'

    setTimeout(() => {
      currentRow.style.position = 'absolute'
      mainSelection.style.opacity = '1'
      mainSelection.style.pointerEvents = 'all'
      mainSelection.style.position = 'relative'
    }, 500)
  })

  // finger selection functionality

  const primaryFinger = document.getElementById('primaryFinger')
  const finger1 = document.getElementById('finger1')
  const finger2 = document.getElementById('finger2')
  const finger3 = document.getElementById('finger3')
  const finger4 = document.getElementById('finger4')

  const setFingerOptions = (currentFinger) => {
    primaryFinger.style.backgroundImage = `url(${fingerMappings[currentFinger[0]].texture})`
    finger1.style.backgroundImage = `url(${fingerMappings[currentFinger[1]].texture})`
    finger2.style.backgroundImage = `url(${fingerMappings[currentFinger[2]].texture})`
    finger3.style.backgroundImage = `url(${fingerMappings[currentFinger[3]].texture})`
    finger4.style.backgroundImage = `url(${fingerMappings[currentFinger[4]].texture})`
  }

  const swapFingers1 = () => {
    const oldModel = fingerMappings[fingerOptions[0]].model
    oldModel.removeAttribute('gltf-model')

    const tempFinger = fingerOptions[0]
    fingerOptions[0] = fingerOptions[1]
    fingerOptions[1] = tempFinger

    const newModel = fingerMappings[fingerOptions[0]].model
    newModel.removeAttribute('gltf-model')
    newModel.setAttribute('gltf-model', `#${currentRing}`)
    fingerOptionsUI.classList.toggle('awake')

    setFingerOptions(fingerOptions)
  }

  const swapFingers2 = () => {
    const oldModel = fingerMappings[fingerOptions[0]].model
    oldModel.removeAttribute('gltf-model')

    const tempFinger = fingerOptions[0]
    fingerOptions[0] = fingerOptions[2]
    fingerOptions[2] = tempFinger

    const newModel = fingerMappings[fingerOptions[0]].model
    newModel.removeAttribute('gltf-model')
    newModel.setAttribute('gltf-model', `#${currentRing}`)

    setFingerOptions(fingerOptions)
    fingerOptionsUI.classList.toggle('awake')
  }

  const swapFingers3 = () => {
    const oldModel = fingerMappings[fingerOptions[0]].model
    oldModel.removeAttribute('gltf-model')

    const tempFinger = fingerOptions[0]
    fingerOptions[0] = fingerOptions[3]
    fingerOptions[3] = tempFinger

    const newModel = fingerMappings[fingerOptions[0]].model
    newModel.removeAttribute('gltf-model')
    newModel.setAttribute('gltf-model', `#${currentRing}`)

    setFingerOptions(fingerOptions)
    fingerOptionsUI.classList.toggle('awake')
  }

  const swapFingers4 = () => {
    const oldModel = fingerMappings[fingerOptions[0]].model
    oldModel.removeAttribute('gltf-model')

    const tempFinger = fingerOptions[0]
    fingerOptions[0] = fingerOptions[4]
    fingerOptions[4] = tempFinger

    const newModel = fingerMappings[fingerOptions[0]].model
    newModel.removeAttribute('gltf-model')
    newModel.setAttribute('gltf-model', `#${currentRing}`)

    setFingerOptions(fingerOptions)
    fingerOptionsUI.classList.toggle('awake')
  }

  // variation functionality
  const primaryVariation = document.getElementById('primaryVariation')
  const variant1 = document.getElementById('variation1')
  const variant2 = document.getElementById('variation2')
  const loader = new THREE.TextureLoader()

  // load textures
  const luxWatchBlue = loader.load(require('../assets/textures/luxWatchBlue.png'))
  const luxWatchGold = loader.load(require('../assets/textures/luxWatchGold.png'))
  const luxWatchSilver = loader.load(require('../assets/textures/luxWatchSilver.png'))

  const leatherWatchTan = loader.load(require('../assets/textures/leatherWatchTan.png'))
  const leatherWatchBlack = loader.load(require('../assets/textures/leatherWatchBlack.png'))
  const leatherWatchBrown = loader.load(require('../assets/textures/leatherWatchBrown.png'))

  const cuffGold = loader.load(require('../assets/textures/cuffGold.png'))
  const cuffRoseGold = loader.load(require('../assets/textures/cuffRoseGold.png'))
  const cuffSilver = loader.load(require('../assets/textures/cuffSilver.png'))

  const maleBangleDark = loader.load(require('../assets/textures/maleBangleDark.png'))
  const maleBangleGold = loader.load(require('../assets/textures/maleBangleGold.png'))
  const maleBangleSilver = loader.load(require('../assets/textures/maleBangleSilver.png'))

  const femaleBangleRoseGold = loader.load(require('../assets/textures/femaleBangleRoseGold.png'))
  const femaleBangleGold = loader.load(require('../assets/textures/femaleBangleGold.png'))
  const femaleBangleSilver = loader.load(require('../assets/textures/cuffSilver.png'))

  const diamondGold = loader.load(require('../assets/textures/diamondGold.png'))
  const diamondSilver = loader.load(require('../assets/textures/diamondSilver.png'))
  const diamondRoseGold = loader.load(require('../assets/textures/diamondRoseGold.png'))

  const bandGold = loader.load(require('../assets/textures/bandGold.png'))
  const bandSilver = loader.load(require('../assets/textures/bandSilver.png'))
  const bandSilverDark = loader.load(require('../assets/textures/bandSilverDark.png'))

  const signetGold = loader.load(require('../assets/textures/signetGold.png'))
  const signetSilver = loader.load(require('../assets/textures/signetSilver.png'))
  const signetDark = loader.load(require('../assets/textures/signetDark.png'))

  let selectedMesh

  if (selectedName === 'luxWatch') {
    colorOptions = watchColors
  } else if (selectedName === 'slenderWatch') {
    colorOptions = slenderWatchColors
  } else if (selectedName === 'cuff') {
    colorOptions = cuffColors
  } else if (selectedName === 'maleBangle') {
    colorOptions = maleBangleColors
  } else if (selectedName === 'femaleBangle') {
    colorOptions = femaleBangleColors
  } else if (selectedName === 'diamond') {
    colorOptions = diamondColors
    fingerOptions = diamondFingers
    setFingerOptions(fingerOptions)
  } else if (selectedName === 'emerald') {
    colorOptions = emeraldColors
    fingerOptions = emeraldFingers
    setFingerOptions(fingerOptions)
  } else if (selectedName === 'marquise') {
    colorOptions = marquiseColors
    fingerOptions = marquiseFingers
    setFingerOptions(fingerOptions)
  } else if (selectedName === 'band') {
    colorOptions = bandColors
    fingerOptions = bandFingers
    setFingerOptions(fingerOptions)
  } else if (selectedName === 'signet') {
    colorOptions = signetColors
    fingerOptions = signetFingers
    setFingerOptions(fingerOptions)
  }

  const colorMappings = {
    '#EABF8B': {
      texture: luxWatchGold,
      hexColor: '#EABF8B',
      materialName: 'LUXWATCHMAIN',
    },
    '#322FF5': {
      texture: luxWatchBlue,
      hexColor: '#322FF5',
      materialName: 'LUXWATCHMAIN',
    },
    '#D4DBED': {
      texture: luxWatchSilver,
      hexColor: '#D4DBED',
      materialName: 'LUXWATCHMAIN',
    },
    '#B29270': {
      texture: leatherWatchTan,
      hexColor: '#B29270',
      materialName: 'STANDARDSURFACE6SG',
    },
    '#151313': {
      texture: leatherWatchBlack,
      hexColor: '#151313',
      materialName: 'STANDARDSURFACE6SG',
    },
    '#6F675C': {
      texture: leatherWatchBrown,
      hexColor: '#6F675C',
      materialName: 'STANDARDSURFACE6SG',
    },
    '#9B793C': {
      texture: cuffGold,
      hexColor: '#9B793C',
      materialName: 'GOLD1',
    },
    '#8D583F': {
      texture: cuffRoseGold,
      hexColor: '#8D583F',
      materialName: 'GOLD1',
    },
    '#8D8783': {
      texture: cuffSilver,
      hexColor: '#8D8783',
      materialName: 'GOLD1',
    },
    '#161616': {
      texture: maleBangleDark,
      hexColor: '#161616',
      materialName: 'GOLD1',
    },
    '#9C8969': {
      texture: maleBangleGold,
      hexColor: '#9C8969',
      materialName: 'GOLD1',
    },
    '#7E7E7E': {
      texture: maleBangleSilver,
      hexColor: '#7E7E7E',
      materialName: 'GOLD1',
    },
    '#9B5F44': {
      texture: femaleBangleRoseGold,
      hexColor: '#9B5F44',
      materialName: 'GOLD6.002',
    },
    '#9F8259': {
      texture: femaleBangleGold,
      hexColor: '#9F8259',
      materialName: 'GOLD6.002',
    },
    '#918B87': {
      texture: femaleBangleSilver,
      hexColor: '#918B87',
      materialName: 'GOLD6.002',
    },
    '#98753A': {
      texture: diamondGold,
      hexColor: '#98753A',
      materialName: 'GOLD1',
    },
    '#89827F': {
      texture: diamondSilver,
      hexColor: '#89827F',
      materialName: 'GOLD1',
    },
    '#85513A': {
      texture: diamondRoseGold,
      hexColor: '#85513A',
      materialName: 'GOLD1',
    },
    '#9C783C': {
      texture: bandGold,
      hexColor: '#9C783C',
      materialName: 'GOLD2',
    },
    '#827D79': {
      texture: bandSilver,
      hexColor: '#827D79',
      materialName: 'GOLD2',
    },
    '#060606': {
      texture: bandSilverDark,
      hexColor: '#060606',
      materialName: 'GOLD2',
    },
    '#9C784C': {
      texture: signetGold,
      hexColor: '#9C783C',
      materialName: 'METAL',
    },
    '#827D71': {
      texture: signetSilver,
      hexColor: '#827D79',
      materialName: 'METAL',
    },
    '#060607': {
      texture: signetDark,
      hexColor: '#060606',
      materialName: 'METAL',
    },
  }

  const setButtonColors = (currentColors) => {
    selectedNode.material.map = colorMappings[currentColors[0]].texture
    selectedNode.material.map.flipY = false
    selectedNode.material.map.encoding = 3001  // color corrects map
    primaryVariation.style.background = colorMappings[currentColors[0]].hexColor
    variant1.style.background = colorMappings[currentColors[1]].hexColor
    variant2.style.background = colorMappings[currentColors[2]].hexColor
  }

  if (currentModel) {
    currentModel.addEventListener('model-loaded', () => {
      selectedMesh = currentModel.getObject3D('mesh')
      let first = true
      selectedMesh.traverse((node) => {
        if (node.material && node.material.name.includes(colorOptions[3]) && first) {
          selectedNode = node
          first = false
        }
      })
      setButtonColors(colorOptions)
    })
  }

  const swapColors1 = () => {
    const primaryColor = primaryVariation.style.background
    const variantColor = variant1.style.background

    primaryVariation.style.background = variantColor
    variant1.style.background = primaryColor

    const tempColor = colorOptions[0]
    colorOptions[0] = colorOptions[1]
    colorOptions[1] = tempColor
    variationOptions.classList.toggle('awake')

    setButtonColors(colorOptions)
  }

  const swapColors2 = () => {
    const primaryColor = primaryVariation.style.background
    const variantColor = variant2.style.background

    primaryVariation.style.background = variantColor
    variant2.style.background = primaryColor

    const tempColor = colorOptions[0]
    colorOptions[0] = colorOptions[2]
    colorOptions[2] = tempColor
    variationOptions.classList.toggle('awake')

    setButtonColors(colorOptions)
  }

  if (registerOnce) {
    variant1.addEventListener('click', swapColors1)
    variant2.addEventListener('click', swapColors2)
    primaryVariation.addEventListener('click', () => {
      variationOptions.classList.toggle('awake')
    })
    primaryFinger.addEventListener('click', () => {
      fingerOptionsUI.classList.toggle('awake')
    })
    finger1.addEventListener('click', swapFingers1)
    finger2.addEventListener('click', swapFingers2)
    finger3.addEventListener('click', swapFingers3)
    finger4.addEventListener('click', swapFingers4)
    registerOnce = false
  }

  if (selectedName) {
    variationUI.style.opacity = 1
    variationUI.style.pointerEvents = 'all'
    if (variationOptions.classList.contains('awake')) {
      variationOptions.classList.remove('awake')
    }
  }
  if (selectedButton.classList.contains('noneOption')) {
    variationUI.style.opacity = 0
    variationUI.style.pointerEvents = 'none'
    fingerUI.style.opacity = 0
    fingerUI.style.pointerEvents = 'none'
  }
  if (selectedButton.classList.contains('ring')) {
    fingerUI.style.opacity = 1
    fingerUI.style.pointerEvents = 'all'

    if (fingerOptionsUI.classList.contains('awake')) {
      fingerOptionsUI.classList.remove('awake')
    }
  }

  // main selection buttons functionality
  const isInitialOption = ['watchOption', 'ringOption', 'braceletOption'].includes(selectedID)
  if (isInitialOption) {
    selectionRow.style.pointerEvents = 'none'
    // Fade out the accessory options after 1 second
    setTimeout(() => {
      selectionRow.style.opacity = '0'
      setTimeout(() => {
        selectedButton.classList.toggle('optionSelected')

        backButton.style.opacity = 1
        backButton.style.pointerEvents = 'all'
        selectionRow.style.position = 'absolute'
        if (selectedID === 'watchOption') {
          currentRow = watchSelection
          watchSelection.style.position = 'relative'
          watchSelection.style.pointerEvents = 'all'
          watchSelection.style.opacity = 1
        } else if (selectedID === 'ringOption') {
          currentRow = ringSelection
          ringSelection.style.position = 'relative'
          ringSelection.style.pointerEvents = 'all'
          ringSelection.style.opacity = 1
        } else if (selectedID === 'braceletOption') {
          currentRow = braceletSelection
          braceletSelection.style.position = 'relative'
          braceletSelection.style.pointerEvents = 'all'
          braceletSelection.style.opacity = 1
        }
      }, 500)
    }, 350)
  }
}

const uiManagerComponent = {
  init() {
    const selectionParent = document.getElementById('selectionParent')
    const cart = document.getElementById('cartUI')
    const cartIcon = require('../assets/UI/cartIcon.svg')
    const cart2Icon = require('../assets/UI/cart2Icon.svg')
    let cartIndex = 1

    cart.addEventListener('click', () => {
      if (cartIndex === 0) {
        cart.style.backgroundImage = ''
        cartIndex += 1
      } else if (cartIndex === 1) {
        cart.style.backgroundImage = `url(${cartIcon})`
        cartIndex += 1
      } else if (cartIndex === 2) {
        cart.style.backgroundImage = `url(${cart2Icon})`
        cartIndex = 0
      }
    })

    const switchHands = (e) => {
      // console.log(e.detail)
    }

    this.el.sceneEl.addEventListener('xrhandupdated', switchHands)
    // Add a click event listener to each accessory option
    Array.from(selectionParent.children).forEach((child) => {
      if (child.id !== 'variationParent' && child.id !== 'fingerParent') {
        Array.from(child.children).forEach((button) => {
          button.addEventListener('click', (e) => {
            handleAccessoryOptionClick(e, button.parentElement)
          })
        })
      }
    })
  },
}

export {uiManagerComponent}
