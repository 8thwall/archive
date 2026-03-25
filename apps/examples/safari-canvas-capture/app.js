// Copyright (c) 2020 8th Wall, Inc.
//
// Elicits an issue where WebKit sometimes appears to fail to draw canvas data to another source.
// In this example, we use
//
//    captureCanvas_.getContext('2d').drawImage(srcCanvas_, ...)
//
// but we have also seen the same behavior with populating a different texture in the same
// WebGlContext with texImage2D, e.g.
//
//    gl.bindTexture(gl.TEXTURE_2D, captureTex)
//    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
//
// When drawing the canvas fails, the destination image is black, including the alpha channel.
// One workaround solution is to detect this trasnparent black image and retry capture until we
// have image data. This workaround is imperfect for a number of reasons:
//
// * It adds expense to read back pixel values to perform the test.
// * Whenever drawing fails, the canvas flashes white, leading to a strobing effect on one or more
//   retries.  To work around this, in production, we always need to show a full screen white div
//   that fades out after capture succeeds or ultimately fails so that at least the effect appears
//   intentional.
// * Capturing multiple frames in sequence (for example to capture a gif) gives inconsistent frame
//   delay, leading to a jumpy video with poor quality.
// * Sometimes capture fails even after 10 tries, and the user is ultimately unable to receive an
//   image, which is a poor and confusing experience.


const MAX_REPEAT_TRIES = 4
const MAX_DIMENSION = 1280
const JPG_COMPRESSION = 75

const updateStatusText = (text) => {
  document.querySelector('#status').innerHTML = text
}

const canvasScreenshot = (canvas) => {
  let canvas_ = canvas
  let captureCanvas_ = document.createElement('canvas')
  let captureContext_ = captureCanvas_.getContext('2d')
  let repeatTries_ = 0

  // Returns base64 string of image data upon success, null upon failure
  const getCanvasData = () => {
    let captureWidth = canvas_.width
    let captureHeight = canvas_.height

    if (captureWidth > captureHeight && captureWidth > MAX_DIMENSION) {
      captureHeight = Math.round(MAX_DIMENSION / captureWidth * captureHeight)
      captureWidth = MAX_DIMENSION
    } else if (captureHeight > captureWidth && captureHeight > MAX_DIMENSION) {
      captureWidth = Math.round(MAX_DIMENSION / captureHeight * captureWidth)
      captureHeight = MAX_DIMENSION
    }

    captureCanvas_.width = captureWidth
    captureCanvas_.height = captureHeight

    captureContext_.drawImage(canvas_, 0, 0, captureWidth, captureHeight)

    // drawImage can fail on iOS which leaves the canvas transparent.
    // We return null so we can retry later.
    const firstPixel = captureContext_.getImageData(0, 0, 1, 1)
    if (firstPixel.data[3] === 0) {
      return null
    }

    const dataWithHeader = captureCanvas_.toDataURL('image/jpeg', JPG_COMPRESSION / 100)

    return dataWithHeader.substring('data:image/jpeg;base64,'.length)
  }

  const takeScreenshot = (repeatTries = 0) => new Promise((resolve, reject) => 
    window.requestAnimationFrame(() => {
      repeatTries_ = repeatTries
      const imageData = getCanvasData()

      if (repeatTries < MAX_REPEAT_TRIES && !imageData) {
        
        repeatTries_++
        setTimeout(() => takeScreenshot(repeatTries + 1).then(resolve, reject), 60)
      } else {
        if (imageData) {
          updateStatusText(`OK after ${repeatTries} tries.`)
          resolve(imageData)
        } else {
          updateStatusText(`Failed ${repeatTries} times.`)
          reject(new Error('Unable to read pixels from canvas.'))
        }
      }
    })
  )

  return {
    // Returns a Promise that when resolved, provides a buffer containing the JPEG compressed image.
    // When rejected, an error message is provided.
    takeScreenshot,
  }
}

const showJpg = (imData) => new Promise((resolve) => {
  let imdiv = document.querySelector('#screenshot')
  if (!imdiv) {
    imdiv = document.createElement('div')
    imdiv.id = 'screenshot'
    imdiv.style = `
      position: fixed;
      z-index: 1;
      left: 10%;
      top: 10%;
      width: 80%;
      height: 80%;
      overflow: none;
      padding: 0px;
      background-color: rgb(255, 255, 255);
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);`
    document.body.appendChild(imdiv)
  }
  
  let drawImg = document.querySelector('#screenshot-img')
  if (!drawImg) {
    drawImg = document.createElement('img')
    drawImg.id = 'screenshot-img'
  }

  drawImg.onload = () => {
    const nh = drawImg.naturalHeight
    const nw = drawImg.naturalWidth
    const dw = imdiv.clientWidth
    const dh = imdiv.clientHeight
    const sw = dw / drawImg.naturalWidth
    const sh = dh / drawImg.naturalHeight
    const s = Math.max(sw, sh)
  
    console.log(`[canvas-screenshot(js)] Scaling by ${s} to make ${nw}x${nh} cover ${dw}x${dh}`)
  
    drawImg.width = drawImg.naturalWidth * s
    drawImg.height = drawImg.naturalHeight * s
    imdiv.appendChild(drawImg)
    console.log('src loaded')
    resolve()
  }
  
  console.log('changing src')
  drawImg.src = `data:image/jpeg;base64,${imData}`
  drawImg.setAttribute('download', 'screenshot.jpg')

  imdiv.onclick = () => {
    updateStatusText('')
    imdiv.parentNode.removeChild(imdiv)
  }
})


document.head.insertAdjacentHTML('beforeend', `
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <style type="text/css">
    body {margin: 0; border: 0; padding: 0;}
    button {width: 80%; font-size: 18px;}
    .debuginfo {
      position: fixed; z-index: 1000; vertical-align: middle;
      left: 5%; top: 3%; width: 90%; min-height: 12%;
      color: #AD50FF; background-color: #323232; opacity: 1.0;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      font-family: mono; font-size: 5vh; text-align: center;
    }
    canvas #camera {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;  z-index: 500;
      margin: 0; border: 0; padding: 0; width: 100%; height: 100%;
    }
    .info {
      position: fixed; z-index: 1000; vertical-align: middle;
      color: #FFFFFF; background-color: #323232; opacity: 1.0;
      left: 5%; bottom: 3%; width: 90%; min-height: 12%;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      font-family: sans-serif; font-size: 2vh; text-align: left;
    }
    .info a {color: #AD50FF;}
    .info a:visited {color: #AD50FF;}
  </style>
`)

// Add a canvas to the document for our xr scene.
document.body.insertAdjacentHTML('beforeend', `
<canvas id="camera" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
<div class="debuginfo">
  <button onclick="takeCanvasScreenshot()">Capture Canvas</button>
  <br><span id="status"></span>
</div>
<div class="info">
Try this demo by navigating to this page (<a href="https://8th.io/3usye">8th.io/3usye</a>) on 
Safari on your iOS device. This demo elicits an effect where webkit fails to write canvas data to
another canvas or to a texture in the context of the same canvas, and flashes the canvas white
when this occurs. In this demo, we attempt to capture several times until we detect that capture
succeeds, or fail after 4 attempts.</div>`)

const CanvasScreenshot = canvasScreenshot(document.querySelector('#camera'))

const takeCanvasScreenshot = () => CanvasScreenshot.takeScreenshot().then(jpg => showJpg(jpg))

const onxrloaded = () => {
  // Use a sepia visual effect when drawing the camera feed to the canvas.
  XR8.GlTextureRenderer.configure({fragmentSource: ` 
    precision mediump float;  // Sepia.
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() {
      vec4 c = texture2D(sampler, texUv);
      gl_FragColor.r = dot(c.rgb, vec3(.393, .769, .189));
      gl_FragColor.g = dot(c.rgb, vec3(.349, .686, .168));
      gl_FragColor.b = dot(c.rgb, vec3(.272, .534, .131));
      gl_FragColor.a = c.a;
    }
  `})
  XR8.addCameraPipelineModules([                                   // Add camera pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),                        // Draws the camera feed.
  ])
  XR8.run({canvas: document.getElementById('camera')})  // Open the camera and start the run loop.
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
window.takeCanvasScreenshot = takeCanvasScreenshot
