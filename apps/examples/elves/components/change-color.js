const changeColorComponent = {
  init() {
    const colorArray = ['#F5CAB0', '#C88C6A', '#A27A5F', '#C88B6F', '#FDB49B', '#F1B286', '#DFAA8A']
    const leftEar = document.getElementById('leftElfEar')
    const rightEar = document.getElementById('rightElfEar')
    let count = 0

    const changeColor = (color) => {
      if (count === 7) {
        count = 0
      }

      const leftEarMesh = leftEar.getObject3D('mesh')
      leftEarMesh.traverse((node) => {
        if (node.material) {
          node.material.color = new THREE.Color(colorArray[count]).convertSRGBToLinear()
        }
      })

      const rightEarMesh = rightEar.getObject3D('mesh')
      rightEarMesh.traverse((node) => {
        if (node.material) {
          node.material.color = new THREE.Color(colorArray[count]).convertSRGBToLinear()
        }
      })

      count += 1
    }

    window.addEventListener('click', () => {
      changeColor()
    })
  },
}

export {changeColorComponent}
