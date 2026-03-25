const swapSceneComponent = {
  init() {
    const {el} = this
    const btn = document.getElementById('swapBtn')
    const iframe = document.getElementById('arScene')

    let mapOpen = true
    const swapScene = () => {
      if (mapOpen) {
        // swap to AR
        el.style.display = 'none'
        btn.innerHTML = 'Return to map'
        el.pause()
      } else {
        // swap to map
        el.style.display = 'flex'
        btn.innerHTML = 'Start AR'
        el.play()
      }
      mapOpen = !mapOpen
    }

    const addAR = () => {
      iframe.setAttribute('src', 'https://8w.8thwall.app/inner-ar')
      btn.removeEventListener('click', addAR)
      btn.addEventListener('click', swapScene)
      setTimeout(swapScene, 500)
    }

    btn.addEventListener('click', addAR)
  },
}
export {swapSceneComponent}
