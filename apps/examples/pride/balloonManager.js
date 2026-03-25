const balloonManager = {
  init() {
    const p = document.getElementById('p')
    const r = document.getElementById('r')
    const i = document.getElementById('i')
    const d = document.getElementById('d')
    const e = document.getElementById('e')

    setTimeout(() => {
      r.setAttribute('bob', '')
    }, 100)

    setTimeout(() => {
      i.setAttribute('bob', '')
    }, 300)

    setTimeout(() => {
      d.setAttribute('bob', '')
    }, 200)

    setTimeout(() => {
      e.setAttribute('bob', '')
    }, 400)
  }
}

export {balloonManager}
