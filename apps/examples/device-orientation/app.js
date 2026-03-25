// Copyright (c) 2020 8th Wall, Inc.

(() => {

  document.head.insertAdjacentHTML('beforeend', `
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  `)
  
   if (!window.DeviceOrientationEvent) {
        document.body.textContent = 'Device orientation not supported'
        return
   }

  const waitForEvents = () => {
     const pre = document.createElement('pre')
     const code = document.createElement('code')
     code.textContent = '[Event data will show here]'
     pre.appendChild(code)
     document.body.appendChild(pre)
    
    window.addEventListener('deviceorientation', event => {
      window.prevEvent = event
      const plainData = {}
      if (event.alpha) {
        plainData.alpha = event.alpha 
      } else {
        plainData.alpha = '(Missing)'
      }
      if (event.beta) {
        plainData.beta = event.beta 
      } else {
        plainData.beta = '(Missing)'
      }
      if (event.gamma) {
        plainData.gamma = event.gamma 
      } else {
        plainData.gamma = '(Missing)'
      }
      
      window.prevData = plainData
      code.textContent = JSON.stringify(plainData, null, 2)
    })
  }
  
  if (!window.DeviceOrientationEvent.requestPermission) {
    console.log('doesnt request')
    waitForEvents()
    return
  }
  
  console.log('should request')

    
  const button = document.createElement('button')
  
  button.textContent = 'Start'
  
  document.body.appendChild(button)
  
  button.addEventListener('click', () => {
     window.DeviceOrientationEvent.requestPermission()
     .then(() => {
       waitForEvents()
       button.parentNode.removeChild(button)
     })
     .catch(() => {
      alert('Permissions were denied.')
    })
  })
})()