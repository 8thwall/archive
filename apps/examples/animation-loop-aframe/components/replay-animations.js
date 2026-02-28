const nextButtonComponent = () => ({
  init() {
    const animationList = ['pockets', 'hiphop', 'chicken', 'idle']

    const model = document.getElementById('model')
    const nextButton = document.getElementById('nextbutton')
    const playAgainButton = document.getElementById('playagain')

    model.addEventListener('animation-loop', () => {
      model.setAttribute('animation-mixer', {
        timeScale: 0,
      })
      playAgainButton.classList.remove('inactive')
    })

    nextButton.style.display = 'block'

    let idx = 1  // Start with the 2nd animation because the model starts with idle animation
    const nextAnimation = () => {
      playAgainButton.classList.add('inactive')
      model.setAttribute('animation-mixer', {
        clip: animationList[idx],
        timeScale: 1,
        loop: 'repeat',
        crossFadeDuration: 0.4,
      })
      idx = (idx + 1) % animationList.length
    }
    nextButton.onclick = nextAnimation  // Switch to the next animation when the button is pressed.

    const playAgain = () => {
      playAgainButton.classList.add('inactive')
      model.setAttribute('animation-mixer', {
        timeScale: 1,
      })
    }

    playAgainButton.onclick = playAgain
  },
})

export {nextButtonComponent}
