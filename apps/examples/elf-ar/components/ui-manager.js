const uiManagerComponent = {
  init() {
    document.getElementById('mobile-only').style.display = 'flex'
    //const accept = document.getElementById('accept')
    const okay = document.getElementById('okay')
    const gotIt = document.getElementById('gotIt')
    //const introContainer = document.getElementById('introContainer')
    const introContainer2 = document.getElementById('introContainer2')
    const introContainer3 = document.getElementById('introContainer3')

    this.leftPlant = document.getElementById('leftPlant')
    this.rightPlant = document.getElementById('rightPlant')
    this.leftGift = document.getElementById('leftGift')
    this.rightGift = document.getElementById('rightGift')

    this.recorder = document.getElementById('recorder')

    /*accept.addEventListener('touchstart', () => {
      //introContainer.style.opacity = 0
      introContainer2.style.display = 'block'
      introContainer2.style.opacity = 1
      setTimeout(() => {
        //introContainer.style.display = 'none'
      }, 250)
      accept.style.transform = 'translateY(3px)'
    })*/

    okay.addEventListener('touchstart', () => {
      introContainer2.style.opacity = 0
      introContainer3.style.display = 'block'
      introContainer3.style.opacity = 1
      setTimeout(() => {
        introContainer2.style.display = 'none'
      }, 250)
      okay.style.transform = 'translateY(3px)'
    })

    gotIt.addEventListener('touchstart', () => {
      introContainer3.style.opacity = 0
      setTimeout(() => {
        introContainer3.style.display = 'none'
      }, 250)
      showBellButton()

      this.tapHoldText = document.getElementById('tapAndHoldText')
      this.tapHoldText.innerHTML = 'Tap + hold to save'
      this.shareIcon = document.getElementById('actionButtonImg')
      this.shareIcon.src = document.getElementById('i-share').src
    })

    const showBellButton = () => {
      setTimeout(() => {
        this.leftPlant.style.transform = 'translate(-21%, 21%) rotate(24deg)'
        this.rightPlant.style.transform = 'translate(10%, 1%) rotate(2deg)'
      }, 250)
      setTimeout(() => {
        this.leftGift.style.transform = 'translate(-25%, 34%) rotate(18deg)'
        this.rightGift.style.transform = 'translate(-17%, 28%) rotate(-14deg)'
      }, 500)

      this.recorder.style.transform = 'translateX(-50%) scale(1)'
    }
  },

}

const loadingScreenComponent = {
  init() {
    const scene = this.el
    const gradient = document.getElementById('gradient')
    const decline = document.getElementById('decline')

    const dismissLoadScreen = () => {
      scene.removeEventListener('realityready', dismissLoadScreen)

      setTimeout(() => {
        gradient.style.opacity = 0
      }, 3000)

      setTimeout(() => {
        gradient.style.display = 'none'
      }, 3250)
    }

    scene.addEventListener('realityready', dismissLoadScreen)

    const handleError = () => {
      const spinner = document.querySelector('.spinner')
      const parent = spinner.parentElement
      spinner.remove()
      parent.innerHTML = 'Permissions were denied. Please refresh and allow permissions.'
    }

    // if inital prompt or motion prompt is denied
    this.el.addEventListener('realityerror', handleError)

    /*decline.addEventListener('touchstart', () => {
      const introContainer = document.getElementById('introContainer2')
      gradient.style.display = 'block'
      gradient.style.opacity = 1
      introContainer.style.opacity = 0
      setTimeout(() => {
        introContainer.style.display = 'none'
      }, 250)
      handleError()
    })*/

    // if camera permissions are denied
    XR8.addCameraPipelineModule({
      name: 'camerastartupmodule',
      onCameraStatusChange: ({status}) => {
        if (status === 'failed') {
          handleError()
        }
      },
    })
  },
}

const soundManager = {
  init() {
    window.addEventListener('blur', this.mute, false)
    window.addEventListener('focus', this.unmute, false)
  },
  mute() {
    const sounds = document.querySelectorAll('audio')
    console.log('muted audio')
    for (let i = 0; i < sounds.length; i++) {
      sounds[i].muted = true
    }
  },
  unmute() {
    const sounds = document.querySelectorAll('audio')
    console.log('unmuted audio')
    for (let i = 0; i < sounds.length; i++) {
      sounds[i].muted = false
    }
  },
}

export {uiManagerComponent, loadingScreenComponent, soundManager}
