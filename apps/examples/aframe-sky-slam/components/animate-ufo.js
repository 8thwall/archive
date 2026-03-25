const animateUFOComponent = {
  init() {
    const beamVideo = document.getElementById('beamVideo')
    const beam = document.getElementById('beam')
    const light = document.getElementById('light')
    let ufo
    const ufoHeight = 11
    const ufoDepth = -10
    const risingAnimation = document.getElementById('risingModel')

    const animate = () => {
      setTimeout(() => {
        // Animates UFO going up
        this.el.setAttribute('animation-mixer', {clip: 'ufoAction', loop: 'repeat', clampWhenFinished: true})
        this.el.setAttribute('animation', {property: 'position', from: `0 0 ${ufoDepth}`, to: `0 ${ufoHeight} ${ufoDepth}`, dur: 12000, easing: 'easeOutElastic', loop: false})

        // Animates UFO moving right
        this.el.setAttribute('animation__rotateRight', {property: 'rotation', from: '0 0 0', to: '0 0 -30', dur: 1500, delay: 4200, easing: 'easeInOutSine', loop: false})
        this.el.setAttribute('animation__translateRight', {property: 'position', from: `0 ${ufoHeight} ${ufoDepth}`, to: `6 ${ufoHeight} ${ufoDepth}`, dur: 2000, delay: 4400, easing: 'easeInOutSine', loop: false})
        this.el.setAttribute('animation__rotateLeft', {property: 'rotation', from: '0 0 -30', to: '0 0 0', dur: 1500, delay: 5400, easing: 'easeInOutSine', loop: false})

        // Animates UFO moving left
        this.el.setAttribute('animation__turnLeft', {property: 'rotation', from: '0 0 0', to: '0 0 30', dur: 1000, delay: 7200, easing: 'easeInOutSine', loop: false})
        this.el.setAttribute('animation__moveLeft', {property: 'position', from: `6 ${ufoHeight} ${ufoDepth}`, to: `-2 ${ufoHeight} ${ufoDepth}`, dur: 2000, delay: 7400, easing: 'easeInOutSine', loop: false})
        this.el.setAttribute('animation__turnr', {property: 'rotation', from: '0 0 30', to: '0 0 0', dur: 1000, delay: 8400, easing: 'easeInOutSine', loop: false})

        // Animates UFO moving right again
        this.el.setAttribute('animation__rightAgain', {property: 'rotation', from: '0 0 0', to: '0 0 -30', dur: 1000, delay: 9700, easing: 'easeInOutSine', loop: false})
        this.el.setAttribute('animation__turnAgain', {property: 'position', from: `-2 ${ufoHeight} ${ufoDepth}`, to: `8 ${ufoHeight} ${ufoDepth}`, dur: 2000, delay: 9900, easing: 'easeInOutSine', loop: false})
        this.el.setAttribute('animation__normalize', {property: 'rotation', from: '0 0 -30', to: '0 0 0', dur: 1000, delay: 11200, easing: 'easeInOutSine', loop: false})

        // Animates Beam and play rising animation and then fade out beam
        setTimeout(() => {
          beam.setAttribute('animation', {property: 'material.alpha', from: '0', to: '.4', dur: 1000, delay: 100, easing: 'linear', loop: false})
          beamVideo.play()
          beam.setAttribute('animation__fadeOut', {property: 'material.alpha', from: '.4', to: '0', dur: 1000, delay: 7500, easing: 'linear', loop: false})
          setTimeout(() => {
            beam.setAttribute('visible', false)
          }, 9000)

          risingAnimation.setAttribute('animation', {property: 'position', from: '0 -15 0', to: '0 0.2 0', dur: 4000, delay: 0, easing: 'linear', loop: false})
          risingAnimation.setAttribute('animation__scaleUp', {property: 'scale', from: '.001 .001 .001', to: '.8 .8 .8', dur: 100, delay: 0, easing: 'linear', loop: false})
          risingAnimation.setAttribute('animation-mixer', {clip: '*', timeScale: 0.9, loop: 'once', clampWhenFinished: true})
        }, 13000)

        // Move UFO Forward and into SLAM Scene
        this.el.addEventListener('animation-finished', () => {
          beamVideo.pause()
          risingAnimation.setAttribute('visible', false)
          this.el.setAttribute('animation__rotateForward', {property: 'rotation', from: '0 0 0', to: '45 0 30', dur: 1500, delay: 0, easing: 'easeInSine', loop: false})
          this.el.setAttribute('animation__translateFwd', {property: 'position', from: `8 ${ufoHeight} ${ufoDepth}`, to: '5 8 -8', dur: 1500, delay: 500, easing: 'linear', loop: false})
          setTimeout(() => {
            this.el.sceneEl.addEventListener('transition-end', (event) => {
              ufo = event.detail.newEntity
              ufo.setAttribute('reflections', {type: 'static'})
              ufo.setAttribute('id', 'newUFO')
              ufo.setAttribute('animation', {property: 'position', from: '5 8 -8', to: '0 4.22 -6', dur: 3500, delay: 0, easing: 'easeOutSine', loop: false})
              ufo.setAttribute('animation__turn', {property: 'rotation', from: '45 0 30', to: '30 0 45', dur: 1000, delay: 0, easing: 'easeInOutSine', loop: false})
              ufo.setAttribute('animation__normal', {property: 'rotation', from: '30 0 45', to: '0 140 0', dur: 2000, delay: 1000, easing: 'easeInOutSine', loop: false})

              // Add Shadwos to new UFO Entity
              ufo.setAttribute('shadow', {receive: true})
              light.setAttribute('xrextras-attach', {target: 'newUFO', offset: '8 15 4'})
              light.setAttribute('light', {target: '#newUFO'})
            })
            // Needs to be after event listener because original entity gets deleted
            this.el.setAttribute('transition-scene', {direction: 'skyToSlam'})
          }, 2000)

          // Play falling animation
          setTimeout(() => {
            ufo.setAttribute('animation-mixer', {clip: '*', loop: 'once', clampWhenFinished: true})
          }, 5500)
        })
      }, 1000)

      this.el.sceneEl.removeEventListener('sky-coaching-overlay.hide', animate)
    }
    this.el.sceneEl.addEventListener('sky-coaching-overlay.hide', animate)
  },
}
export {animateUFOComponent}
