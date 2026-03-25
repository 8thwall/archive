const traverseParents = (el) => {
  let currentElement = el

  while (currentElement) {
    const containerName = currentElement.nodeName.toLowerCase()
    if (containerName === 'xrextras-hand-attachment') {
      return currentElement.components['xrextras-hand-attachment'].attrValue.point
    }

    currentElement = currentElement.parentElement
  }
  console.log('no attachment point found in hierarchy')
  return null  // Return null if the no attachment point was found
}

const scaleToHandComponent = {
  schema: {
    'adjustment': {type: 'number', default: 1.0},
    'size': {type: 'number', default: 1.0},
  },
  init() {
    let point
    let apt
    let adjustedScaleFactor
    let scaleFactor

    const scaleToHand = ({detail}) => {
      point = traverseParents(this.el)
      apt = detail.attachmentPoints[point]
      // scale to fingers
      if (apt.radius) {
        // divide finger diameter in cm by diameter of asset in cm
        scaleFactor = (apt.radius * 2 * 100) / this.data.size
      // scale to wrist
      } else if (apt.majorRadius) {
        // divide wrist diameter in cm by diameter of asset in cm
        scaleFactor = (apt.majorRadius * 2 * 100) / this.data.size
      }
      adjustedScaleFactor = scaleFactor * this.data.adjustment
      this.el.object3D.scale.multiplyScalar(adjustedScaleFactor)
      console.log('scale')
      this.data.size *= adjustedScaleFactor  // update size so it works when xrhandfound fires again
      this.el.sceneEl.removeEventListener('xrhandupdated', scaleToHand)
    }
    this.el.sceneEl.addEventListener('xrhandupdated', scaleToHand)
  },
}

export {scaleToHandComponent}
