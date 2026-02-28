const addVideosComponent = {
  init() {
    setTimeout(() => {
      // Create the first a-entity element
      const entity1 = document.createElement('a-entity')
      entity1.setAttribute('play-video', 'video: #alpha-video')
      entity1.setAttribute('material', 'shader: chromakey; src: #alpha-video; color: 0.54 0.54 0.54; side: double; depthWrite: false;')
      entity1.setAttribute('geometry', 'primitive: plane; height: 1; width: 1;')
      entity1.setAttribute('position', '-0.1 0.95 0.15')
      entity1.setAttribute('look-at', 'tilt: false; target: #camera')

      // Create the second a-entity element
      const entity2 = document.createElement('a-entity')
      entity2.setAttribute('play-video', 'video: #alpha-asdf; delay: 2500')
      entity2.setAttribute('material', 'shader: chromakey; src: #alpha-asdf; color: 0.54 0.54 0.54; side: double; depthWrite: false')
      entity2.setAttribute('geometry', 'primitive: plane; height: 1; width: 1;')
      entity2.setAttribute('position', '0.1 0.8 0')
      entity2.setAttribute('look-at', 'tilt: false; target: #camera')

      // Append the created entities to the a-scene
      const model = document.getElementById('model')
      model.appendChild(entity1)
      model.appendChild(entity2)
    }, 1000)
  },
}

const playVideoComponent = {
  schema: {
    video: {type: 'string'},
    delay: {type: 'number', default: 0},
    fade: {type: 'number', default: 1250},  // fade speed in ms
    videoDuration: {type: 'number', default: 5000},  // total video duration in ms
  },
  init() {
    const v = document.querySelector(this.data.video)
    const {el} = this

    v.loop = false

    let fadeOutTimeoutId; let
      fadeInTimeoutId

    const fadeOut = () => {
      el.removeAttribute('animation__fadeout')
      el.setAttribute('animation__fadeout', {
        property: 'material.opacity',
        from: 1,
        to: 0,
        easing: 'easeInOutQuad',
        dur: this.data.fade,
      })
    }

    const fadeIn = () => {
      el.removeAttribute('animation__fadein')
      el.setAttribute('animation__fadein', {
        property: 'material.opacity',
        from: 0,
        to: 1,
        easing: 'easeInOutQuad',
        dur: this.data.fade,
      })
    }

    const scheduleFadeOut = () => {
      clearTimeout(fadeOutTimeoutId)  // Clear any previous timeout
      fadeOutTimeoutId = setTimeout(fadeOut, this.data.videoDuration - this.data.fade)
    }

    // Event listener for when the video ends
    v.addEventListener('ended', () => {
      fadeInTimeoutId = setTimeout(() => {
        fadeIn()
        v.play()
        scheduleFadeOut()  // Schedule fade out for the next loop
      }, this.data.fade)  // Start playing and fading in after fade duration
    })

    // Start playing video with initial delay if present
    if (this.data.delay > 0) {
      setTimeout(() => {
        v.play()
        scheduleFadeOut()  // Schedule fade out for the first loop
      }, this.data.delay)
    } else {
      v.play()
      scheduleFadeOut()  // Schedule fade out for the first loop
    }

    // Clear timeouts when the component is removed or video ends
    this.clearTimeoutsAndIntervals = () => {
      clearTimeout(fadeOutTimeoutId)
      clearTimeout(fadeInTimeoutId)
    }

    // Add this function to the component for external access if needed
    this.el.clearTimeoutsAndIntervals = this.clearTimeoutsAndIntervals
  },

  remove() {
    // Clear all timeouts when component is removed
    this.clearTimeoutsAndIntervals()
  },
}

export {addVideosComponent, playVideoComponent}
