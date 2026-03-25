const changeColorComponent = {
  init() {
    const container = document.getElementById('container')

    // These hex colors are used by the UI buttons and car
    // default: purple, orange, green, blue, black
    const colorList = ['#ffcc00', '#007aff', '#000', '#FFF']

    this.el.addEventListener('model-loaded', () => {
      // Named the specified mesh within the 3D model 'Chair' (The mesh for the cars exterior/paint)
      this.setColor = ({newColor, button}) => {
        const modelMesh = this.el.getObject3D('mesh').getObjectByName('Mesh_2')
        modelMesh.traverse((node) => {
          node.material.color = new THREE.Color(newColor)
        })
        button.focus()
      }

      const modelLegs = this.el.getObject3D('mesh').getObjectByName('Mesh_1')
      modelLegs.material.polygonOffset = true
      modelLegs.material.polygonOffsetUnits = -100

      // create a UI button for each color in the list that changes the car color
      for (let i = 0; i < colorList.length; i++) {
        const colorButton = document.createElement('button')
        colorButton.classList.add('color-picker')
        colorButton.style.backgroundColor = colorList[i]
        container.appendChild(colorButton)

        colorButton.addEventListener('click', () => this.setColor({
          newColor: colorList[i],
          button: colorButton,
        }))
      }
    })

    // support horizontal scroll for more than 5 colors
    if (colorList.length > 5) {
      container.style.pointerEvents = 'auto'
    }
  },
}

export {changeColorComponent}
