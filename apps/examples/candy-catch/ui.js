import * as gameOverHtml from './game-over.html'

const uiComponent = {
  init() {
    // start dropping candy once hand is detected
    const greenCandy = document.getElementById('greenCandy')
    const orangeCandy = document.getElementById('orangeCandy')
    const redCandy = document.getElementById('redCandy')

    const countEl = document.getElementById('score').lastElementChild
    const filledEl = document.getElementById('filled')
    const outlineEl = document.getElementById('outline')

    let count = 0
    let lives = 3

    const startFall = () => {
      setTimeout(() => {
        greenCandy.setAttribute('fall', '')
        setTimeout(() => {
          orangeCandy.setAttribute('fall', '')
        }, 250)
        setTimeout(() => {
          redCandy.setAttribute('fall', '')
        }, 500)
      }, 100)
    }

    this.el.sceneEl.addEventListener('xrhandfound', startFall)

    const pulseAnimation = () => {
      countEl.classList.add('pulse-once')
      setTimeout(() => {
        countEl.classList.remove('pulse-once')
      }, 200)
    }

    // increment count when candy is caught
    this.el.sceneEl.addEventListener('caught', () => {
      count += 1
      countEl.textContent = count
      pulseAnimation()
    })

    // decrement lives when candy is missed
    this.el.sceneEl.addEventListener('miss', () => {
      if (lives === 0) {
        document.body.insertAdjacentHTML('beforeend', gameOverHtml)

        this.el.sceneEl.removeEventListener('xrhandfound', startFall)

        // stop the candies from falling
        document.querySelectorAll('[fall]').forEach((el) => {
          el.removeAttribute('fall')
        })

        this.el.sceneEl.removeAttribute('hand-coaching-overlay')

        document.querySelector('.liquid').addEventListener('animationend', () => {
          console.log('done')
          document.querySelectorAll('.blob').forEach((el) => {
            el.remove()
          })
        })
        return
      }
      filledEl.children[lives - 1].classList.add('hidden')
      outlineEl.children[lives - 1].classList.remove('hidden')
      lives -= 1
    })
  },
}
export {uiComponent}
