import * as ecs from '@8thwall/ecs'

// Create an SVG filter and add it to the document
const svgNS = 'http://www.w3.org/2000/svg'
const filter = document.createElementNS(svgNS, 'filter')
filter.setAttribute('id', 'outline-filter-green')

const feMorphology = document.createElementNS(svgNS, 'feMorphology')
feMorphology.setAttribute('in', 'SourceAlpha')
feMorphology.setAttribute('operator', 'dilate')
feMorphology.setAttribute('radius', '2')
feMorphology.setAttribute('result', 'dilated')

const feColorMatrix = document.createElementNS(svgNS, 'feColorMatrix')
feColorMatrix.setAttribute('in', 'dilated')
feColorMatrix.setAttribute('type', 'matrix')
// Green color transformation
feColorMatrix.setAttribute('values', '0 0 0 0 0 0 1 0 0 0.5 0 0 0 0 0 0 0 0 1 0')

const feMerge = document.createElementNS(svgNS, 'feMerge')
const feMergeNode1 = document.createElementNS(svgNS, 'feMergeNode')
const feMergeNode2 = document.createElementNS(svgNS, 'feMergeNode')
feMergeNode2.setAttribute('in', 'SourceGraphic')

feMerge.appendChild(feMergeNode1)
feMerge.appendChild(feMergeNode2)

filter.appendChild(feMorphology)
filter.appendChild(feColorMatrix)
filter.appendChild(feMerge)

const defs = document.createElementNS(svgNS, 'defs')
defs.appendChild(filter)

const svg = document.createElementNS(svgNS, 'svg')
svg.style.height = '0'
svg.style.width = '0'
svg.appendChild(defs)

document.body.appendChild(svg)

const TrayMenu = ecs.registerComponent({
  name: 'TrayMenu',
  schema: {
    // @asset
    buildIcon: ecs.string,
    // @asset
    structureIcon1: ecs.string,
    // @asset
    structureIcon2: ecs.string,
    // @asset
    structureIcon3: ecs.string,
  },
  add: (world, component) => {
    let selectedButton = null
    let menuVisible = false

    // Function to update button styles based on selection
    const updateButtonStyles = (button) => {
      if (selectedButton) {
        selectedButton.firstChild.style.filter = 'none'  // Reset previous selection
      }
      button.firstChild.style.filter = 'url(#outline-filter-green)'  // Add outline to selected button
      selectedButton = button
    }

    // Create the menu container
    const menuContainer = document.createElement('div')
    menuContainer.style.position = 'absolute'
    menuContainer.style.bottom = '10px'
    menuContainer.style.right = '10px'
    menuContainer.style.zIndex = '100000000'
    menuContainer.style.display = 'flex'
    menuContainer.style.flexDirection = 'row'
    menuContainer.style.gap = '10px'  // Space between buttons

    // Helper function to create structure buttons
    const createStructureButton = (icon) => {
      const button = document.createElement('button')
      button.style.backgroundColor = 'transparent'
      button.style.border = 'none'
      button.style.outline = 'none'  // Remove default outline on focus
      button.style.padding = '0'
      button.style.display = 'none'  // Start out hidden

      const img = document.createElement('img')
      img.src = icon
      img.style.maxWidth = '200px'
      img.style.maxHeight = '200px'
      img.style.width = '100%'
      img.style.height = '100%'
      img.style.transition = 'width 0.3s, height 0.3s'

      button.appendChild(img)
      menuContainer.appendChild(button)
      return button
    }

    // Create structure buttons
    const structureButton1 = createStructureButton(component.schema.structureIcon1)
    const structureButton2 = createStructureButton(component.schema.structureIcon2)
    const structureButton3 = createStructureButton(component.schema.structureIcon3)

    // Create the build button
    const buildButton = document.createElement('button')
    buildButton.style.backgroundColor = 'transparent'
    buildButton.style.border = 'none'
    buildButton.style.outline = 'none'
    buildButton.style.padding = '0'

    const buildImg = document.createElement('img')
    buildImg.src = component.schema.buildIcon
    buildImg.style.maxWidth = '200px'
    buildImg.style.maxHeight = '200px'
    buildImg.style.width = '100%'
    buildImg.style.height = '100%'
    buildImg.style.transition = 'width 0.3s, height 0.3s'

    buildButton.appendChild(buildImg)
    menuContainer.appendChild(buildButton)
    document.body.append(menuContainer)

    // Toggle menu visibility on build button click
    buildButton.addEventListener('click', () => {
      menuVisible = !menuVisible
      const display = menuVisible ? 'block' : 'none'
      structureButton1.style.display = display
      structureButton2.style.display = display
      structureButton3.style.display = display
      const eventName = menuVisible ? 'createGrid' : 'destroyGrid'
      world.events.dispatch(world.events.globalId, eventName, {})
    })

    // Add event listeners for structure buttons
    structureButton1.addEventListener('click', () => {
      updateButtonStyles(structureButton1)
      world.events.dispatch(component.eid, 'setStructure1', {})
    })

    structureButton2.addEventListener('click', () => {
      updateButtonStyles(structureButton2)
      world.events.dispatch(component.eid, 'setStructure2', {})
    })

    structureButton3.addEventListener('click', () => {
      updateButtonStyles(structureButton3)
      world.events.dispatch(component.eid, 'setStructure3', {})
    })

    // Responsive adjustments
    const adjustButtonSize = () => {
      const viewportWidth = window.innerWidth
      let size = '200px'
      if (viewportWidth <= 600) {
        size = '80px'
      }
      if (viewportWidth <= 400) {
        size = '60px'
      }

      [buildImg, structureButton1.firstChild, structureButton2.firstChild, structureButton3.firstChild].forEach((img: HTMLImageElement) => {
        if (!img) return
        img.style.maxWidth = size
        img.style.maxHeight = size
      })
    }

    window.addEventListener('resize', adjustButtonSize)
    adjustButtonSize()  // Adjust sizes initially
  },
  remove: (world, component) => {
    // Clean up DOM elements and event listeners here if needed
  },
})

export {TrayMenu}
