import * as ecs from '@8thwall/ecs'

import {addCleanup, doCleanup} from '../helpers/cleanup'

// Register the EndGameOverlay component
const EndGameOverlay = ecs.registerComponent({
  name: 'EndGameOverlay',
  schema: {
    level: ecs.i32,  // Level reached
  },
  schemaDefaults: {
    level: 1,
  },
  add: (world, component) => {
    // Create the overlay container
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '100%'
    overlay.style.height = '100%'
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    overlay.style.display = 'flex'
    overlay.style.flexDirection = 'column'
    overlay.style.justifyContent = 'center'
    overlay.style.alignItems = 'center'
    overlay.style.zIndex = '900000000'
    document.body.appendChild(overlay)

    // Create the level text element
    const levelText = document.createElement('div')
    levelText.innerText = `Level Reached: ${component.schema.level}`
    levelText.style.color = 'white'
    levelText.style.fontSize = '24px'
    levelText.style.marginBottom = '20px'
    overlay.appendChild(levelText)

    // Create the restart button
    const restartButton = document.createElement('button')
    restartButton.innerText = 'Restart'
    restartButton.style.padding = '10px 20px'
    restartButton.style.fontSize = '18px'
    restartButton.style.cursor = 'pointer'
    restartButton.onclick = () => {
      window.location.reload()
    }
    overlay.appendChild(restartButton)

    const cleanup = () => {
      // Remove the overlay when the component is removed
      overlay.remove()
    }
    addCleanup(component, cleanup)
  },
  remove: (world, component) => {
    doCleanup(component)
  },
})

export {EndGameOverlay}
