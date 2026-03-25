const tapComponent = {
  init() {
    const lighter = document.getElementById('lighterEntity')
    const fire = document.getElementById('fireEntity')
    document.body.addEventListener('click', () => {
      lighter.setAttribute('animation-mixer', {clip: '*', loop: 'once', clampWhenFinished: 'true'})
      setTimeout(() => {
        fire.setAttribute('visible', true)
      }, 1200)
    })
  },
}

export {tapComponent}
