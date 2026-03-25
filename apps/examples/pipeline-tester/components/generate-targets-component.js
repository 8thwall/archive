const generateTargetsComponent = () => ({
  init() {
    const generateTargets = ({detail}) => {
      const {sceneEl} = this.el

      // Uncomment the line below if you want to get geometry for new targets
      // console.log(detail)

      detail.imageTargets.forEach(({name}) => {
        const frameEl = document.createElement('xrextras-named-image-target')
        frameEl.setAttribute('name', name)
        const mesh = document.createElement('xrextras-target-mesh')
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
        mesh.setAttribute('material', `color: ${randomColor}; opacity: 0.4;`)
        frameEl.appendChild(mesh)
        // Can add this back if you want to test the container
        const container = document.createElement('xrextras-curved-target-container')
        container.setAttribute('color', '#d3d3d3')
        frameEl.appendChild(container)
        this.el.appendChild(frameEl)
      })
    }

    const logEvent = ({detail}) => {
      console.log(`${JSON.stringify(detail)}`)
    }

    this.el.sceneEl.addEventListener('xrimagescanning', generateTargets)
    this.el.sceneEl.addEventListener('xrimagefound', logEvent)
  },
})

export {generateTargetsComponent}
