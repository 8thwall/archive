// Copyright (c) 2020 8th Wall, Inc.

(() => {

  document.head.insertAdjacentHTML('beforeend', `
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  `)
  
   if (!window.DeviceMotionEvent) {
        document.body.textContent = 'Device motion not supported'
        return
   }

  const waitForEvents = () => {
     const pre = document.createElement('pre')
     const code = document.createElement('code')
     code.textContent = '[Event data will show here]'
     pre.appendChild(code)
     document.body.appendChild(pre)
    
    window.addEventListener('devicemotion', event => {
      window.prevEvent = event
      const plainData = {}
      if (event.acceleration) {
        plainData.acceleration = {
          x: event.acceleration.x, 
          y: event.acceleration.y, 
          z: event.acceleration.z,
        }
      } else {
        plainData.acceleration = '(Missing)'
      }
      
      if (event.rotationRate) {
        plainData.rotationRate = {
          alpha: event.rotationRate.alpha,
          beta: event.rotationRate.beta,
          gamma: event.rotationRate.gamma, 
        }
      } else {
        plainData.rotationRate = '(Missing)'
      }
      
      if (event.accelerationIncludingGravity) {
        plainData.accelerationIncludingGravity = {
          x: event.accelerationIncludingGravity.x, 
          y: event.accelerationIncludingGravity.y, 
          z: event.accelerationIncludingGravity.z,
        }
      } else {
        plainData.accelerationIncludingGravity = '(Missing)'
      }
      window.prevData = plainData
      code.textContent = JSON.stringify(plainData, null, 2)
    })
  }
  
  if (!window.DeviceMotionEvent.requestPermission) {
    console.log('doesnt request')
    waitForEvents()
    return
  }
  
  console.log('should request')

    
  const button = document.createElement('button')
  
  button.textContent = 'Start'
  
  document.body.appendChild(button)
  
  button.addEventListener('click', () => {
     window.DeviceMotionEvent.requestPermission()
     .then(() => {
       waitForEvents()
       button.parentNode.removeChild(button)
     })
     .catch(() => {
      alert('Permissions were denied.')
    })
  })
})()