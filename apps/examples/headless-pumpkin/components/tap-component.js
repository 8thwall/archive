export const tapPlaceComponent = {
  init() {
    
    window.addEventListener('click', (event) => {
      let gl = document.getElementById('gl')
      let pl = document.getElementById('pl')
      let tx = document.getElementById('tx')
      
      gl.setAttribute('visible', true)
      pl.setAttribute('visible', true)
      tx.setAttribute('visible', true)
      console.log('next')
    })
  },
}

