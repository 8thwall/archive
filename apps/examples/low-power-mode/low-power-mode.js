const lowPowerModeComponent = {
  init() {
    const vid = document.getElementById('vid')

    const message = document.getElementById('message')
    vid.play().catch((error) => {
      if (error.name === 'NotAllowedError') {
        console.warn('Low power mode enabled, autoplay not allowed')

        // low power mode is enabled
        message.innerText = 'Low Power Mode: Enabled 🪫'
        message.style.color = '#FFC700'

        // display some UI to prompt the user to
        // click the screen to play the video
        this.el.insertAdjacentHTML('afterbegin', `
          <a-plane
            scale="0.2 0.2 0.2"
            transparent="true"
            position="0 0 0.01"
            src=${require('./assets/play.svg')}
          ></a-plane>
        `)

        // on tap, play video and remove play ui
        this.el.addEventListener('click', () => {
          vid.play()
          this.el.children[0].remove()
        })
      }
    })
  },
}
export {lowPowerModeComponent}
