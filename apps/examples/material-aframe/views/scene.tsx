import {AFrameScene} from '../lib/aframe-components'
import {FloatingButton} from '../lib/material-ui-components'
import {COLORS} from '../lib/colors'

declare let React: any

const colorKeys = Object.keys(COLORS)

// Renders an AFrame Scene and Material UI, and binds interaction between them.
const Scene = () => {
  // Store the currently selected color as react state.
  const [colorIdx, setColorIdx] = React.useState(0)

  // When the user clicks the button...
  const nextColor = () => {
    // Update react state.
    const nextIdx = (colorIdx + 1) % colorKeys.length
    setColorIdx(nextIdx)

    // Update aframe scene.
    const color = colorKeys[nextIdx]
    document.querySelector('a-box').setAttribute('material', `color: ${COLORS[color]};`)
  }

  // Render the aframe scene and Material UI.
  return (
    <React.Fragment>
      <FloatingButton onClick={nextColor} />
      <AFrameScene sceneHtml={require('./cube.html')} />
    </React.Fragment>
  )
}

export {Scene}
