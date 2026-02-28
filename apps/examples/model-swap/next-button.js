const nextButtonComponent = () => ({
  init() {
    const modelList = ['mixamoModel', 'duckModel', 'foxModel', 'truckModel', 'treeModel']

    const model = document.getElementById('model')
    const nextButton = document.getElementById('nextbutton')
    nextButton.style.display = 'block'

    const bg1 = require('./assets/images/one.jpg')
    const bg2 = require('./assets/images/two.jpg')
    let buttonBackground = bg1

    let idx = 1  // Start with the 2nd model as 1st is already in the scene on page load
    const nextModel = () => {
      // Update button style
      if (buttonBackground === bg1) buttonBackground = bg2
      else buttonBackground = bg1
      nextButton.style.backgroundImage = `url(${buttonBackground})`

      // Need to remove gltf-component first due to AFrame regression: https://github.com/aframevr/aframe/issues/4341
      model.removeAttribute('gltf-model')
      // Switch to next model in the list
      model.setAttribute('gltf-model', `#${modelList[idx]}`)

      idx = (idx + 1) % modelList.length
    }
    nextButton.onclick = nextModel  // Switch to the next model when the button is pressed.
  },
})

export {nextButtonComponent}
