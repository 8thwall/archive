const loopAnimationComponent = () => ({
  init() {
    const animationList = ['idle', 'pockets', 'hiphop', 'chicken']

    const {el} = this
    const clipInfo = document.getElementById('clipInfo')
    clipInfo.style.display = 'block'

    let idx = 1  // Start with the 2nd animation because the model starts with idle animation
    const nextAnimation = () => {
      el.setAttribute('animation-mixer', {
        clip: animationList[idx],
        loop: 'once',
      })
      // Update text to display new animation clip name
      clipInfo.innerHTML = `Playing clip: ${animationList[idx]}`

      idx = (idx + 1) % animationList.length
    }

    // Emitted when all loops of an animation clip have finished.
    // See https://github.com/n5ro/aframe-extras/tree/master/src/loaders#animation
    el.addEventListener('animation-finished', () => {
      // Start the next animation in the list once the previous has completed.
      nextAnimation()
    })
  },
})

export {loopAnimationComponent}
