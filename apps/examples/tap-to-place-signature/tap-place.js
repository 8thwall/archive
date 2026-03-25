// Component that places trees where the ground is clicked

export const tapPlaceComponent = {
  init: function() {
    const ground = document.getElementById('ground')
    ground.addEventListener('click', event => {
      // Create new entity for the new object
      const newElement = document.createElement('a-entity')

      // The raycaster gives a location of the touch in the scene
      const touchPoint = event.detail.intersection.point
      newElement.setAttribute('position', {
       x: touchPoint.x, 
       y: touchPoint.y + 0.1, 
       z: touchPoint.z
      })

      const randomYRotation = Math.random() * 360
      newElement.setAttribute('rotation', '-90 ' + randomYRotation + ' 0')

      newElement.setAttribute('visible', 'false')
      newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

      newElement.setAttribute('geometry', { 
        primitive: 'plane', 
        height: 0.381,
        width: 1
      } )
      newElement.setAttribute('material', { src: '#signature', transparent: true} )
      this.el.sceneEl.appendChild(newElement)

      newElement.setAttribute('visible', 'true')
      newElement.setAttribute('animation', {
        property: 'scale',
        to: '10 10 10',
        easing: 'easeOutElastic',
        dur: 800,
      })
    })
  }
}
