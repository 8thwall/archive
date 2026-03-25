// Copyright (c) 2020 8th Wall, Inc.
//
// Elicits an issue where Safari appears to never increment the currentTime property of the video 
// element from a getUserMedia stream.

document.head.insertAdjacentHTML('beforeend', `
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
`)


// Add a canvas to the document for our xr scene.
document.body.insertAdjacentHTML('beforeend', `
    <h1>Video CurrentTime Tester</h1>
    
    <video muted playsinline="true" autoplay="true" style="max-width: 50vw; max-height: 50vh"></video>
    
    <pre id="detail"></pre>
`)


  const video = document.querySelector('video')

const updateStatus = () => {
  document.getElementById('detail').textContent = JSON.stringify({width: video.videoWidth, height: video.videoHeight, currentTime: video.currentTime}, null, 2)
  requestAnimationFrame(updateStatus)
}

updateStatus()

if (!window.navigator || !window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) {
  alert('No getUserMedia')
} else {
    window.navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}}).then(stream => {
      video.srcObject = stream
    }).catch(err => {
      alert('Error:' + err.toString())    
    })  
    
}
