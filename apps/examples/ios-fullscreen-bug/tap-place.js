// Component that places trees where the ground is clicked

export const tapPlaceComponent = {
  init: function() {
    const ground = document.getElementById('ground')
    ground.addEventListener('click', event => {
      // Create new entity for the new object
      const newElement = document.createElement('a-entity')

      // The raycaster gives a location of the touch in the scene
      const touchPoint = event.detail.intersection.point
      newElement.setAttribute('position', touchPoint)

      const randomYRotation = Math.random() * 360
      newElement.setAttribute('rotation', '0 ' + randomYRotation + ' 0')

      newElement.setAttribute('visible', 'false')
      newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

      newElement.setAttribute('gltf-model', '#treeModel')
      this.el.sceneEl.appendChild(newElement)

      newElement.addEventListener('model-loaded', () => {
        // Once the model is loaded, we are ready to show it popping in using an animation
        newElement.setAttribute('visible', 'true')
        newElement.setAttribute('animation', {
          property: 'scale',
          to: '7 7 7',
          easing: 'easeOutElastic',
          dur: 800,
        })
      })
    })
  }
}


AFRAME.registerComponent('fullscreen-button', {
    init: function() {
        
      function launchIntoFullscreen(element) {
      if(element.requestFullscreen) {
        element.requestFullscreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
    
    // Launch fullscreen for browsers that support it!
    const fsBtn = document.querySelector('#fullscreen-btn')
    
    fsBtn.addEventListener('click', () => { 
      launchIntoFullscreen(document.documentElement); // the whole page
    })
    

    }
})