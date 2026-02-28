const flipBtnComponent = {
  init() {
    const btn = document.getElementById('face')
    const bg = document.getElementById('void')
    const mouth = document.getElementById('mouthObj')
    const eyeLeft = document.getElementById('eyeL')
    const eyeRight = document.getElementById('eyeR')

    let voidMode = false

    btn.addEventListener('click', () => {
      if (!voidMode) {
        voidMode = true
        // show void sky
        bg.setAttribute('visible', 'true')

        // set positions head objects
        mouth.setAttribute('position', '0 0.53 0.1')
        eyeLeft.setAttribute('position', '0.3 0 0')
        eyeRight.setAttribute('position', '-0.3 0 0')
      } else {
        voidMode = false
        // hide void sky
        bg.setAttribute('visible', 'false')

        // set positions head objects
        mouth.setAttribute('position', '0 0 0')
        eyeLeft.setAttribute('position', '0 0 0')
        eyeRight.setAttribute('position', '0 0 0')
      }
    })
  },
}

export {flipBtnComponent}
