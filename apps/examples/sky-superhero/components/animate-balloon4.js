const animateBalloon4Component = {
  init() {
    let balloon
    const light = document.getElementById('light')

    const animate = () => {
      this.el.setAttribute('animation', {
        property: 'position',
        from: '0 -7 -13',
        to: '0 10 -11',
        dur: 6000,
        delay: 3500,
        easing: 'easeInOutQuad',
        loop: false,
      })
      this.el.setAttribute('animation__forward', {
        property: 'position',
        from: '0 10 -11',
        to: '0 8 -9',
        dur: 2000,
        delay: 9500,
        easing: 'easeInSine',
        loop: false,
      })

      this.el.sceneEl.addEventListener('transition-end', (event) => {
        if (event.detail.id === 'balloon4') {
          balloon = event.detail.newEntity  // Grab the handle to the new Balloon Entity after it transitions from Sky Scene to World Scene

          balloon.setAttribute('id', 'newBalloon4')
          balloon.setAttribute('shadow', {receive: true, cast: true})

          // Animate the balloon from the transition point to the ground
          balloon.setAttribute('animation', {
            property: 'position',
            from: '0 8 -9',
            to: '0 3 -5',
            dur: 5000,
            delay: 0,
            easing: 'easeOutQuad',
            loop: false,
          })
        }
      })

      setTimeout(() => {
        this.el.setAttribute('transition-scene', {direction: 'skyToSlam', id: 'balloon4'})  // Time transition with animation speeds
      }, 11500)

      // Animate Balloon when Sky is Found
      this.el.sceneEl.removeEventListener('sky-coaching-overlay.hide', animate)
    }
    this.el.sceneEl.addEventListener('sky-coaching-overlay.hide', animate)
  },
}
export {animateBalloon4Component}
