import {qrcode} from '../third-party/jsqrcode/qrcode'

// Define a custom pipeline module. This module scans the camera feed for qr codes, and makes the
// result available to other modules in onUpdate. It requires that the CameraPixelArray module is
// installed and configured to provide a luminance (black and white) image.
const qrprocessPipelineModule = () => ({
  name: 'qrprocess',
  onProcessCpu: ({processGpuResult}) => {
    // Check whether there is any data ready to process.
    if (!processGpuResult.camerapixelarray || !processGpuResult.camerapixelarray.pixels) {
      return {found: false}
    }

    try {
      // Set input variables on the global qrcode object before calling qrcode.process().
      const {rows, cols} = processGpuResult.camerapixelarray
      qrcode.width = cols
      qrcode.height = rows
      qrcode.grayscale = () => processGpuResult.camerapixelarray.pixels
      const res = qrcode.process()  // Scan the image for a QR code.
      res.points = res.points.map(
        ({x: x_, y: y_}) => ({x: x_ / (cols - 1), y: y_ / (rows - 1)})
      )
      return res
    } catch (e) {
      return {found: false}  // jsqrcode throws errors when qr codes are not found in an image.
    }
  },
})

// Define a custom pipeline module. This module updates UI elements with the result of the QR code
// scanning, and navigates to the found url on any tap to the screen.
const qrdisplayPipelineModule = () => {
  let url_ = null
  let canvas2d_ = null
  let ctx_ = null
  let lastSeen_ = 0
  let canvas_ = null

  // if the window is touched anywhere, navigate to the URL that was detected.
  window.addEventListener('touchstart', () => {
    if (!url_ || !url_.href || !url_.href.startsWith('http')) {
      return
    }
    XR8.pause()
    url_.innerHTML = `Navigating to ${url_.href}`
    window.location.href = url_.href
  })

  // Keep the 2d drawing canvas in sync with the camera feed.
  const onCanvasSizeChange = () => {
    if (!canvas_) {
      return
    }
    canvas2d_.width = canvas_.clientWidth
    canvas2d_.height = canvas_.clientHeight
  }

  const drawCircle = (pt) => {
    if (!ctx_) {
      return
    }

    ctx_.beginPath()
    ctx_.arc(pt.x, pt.y, 9 /* radius */, 0, 2 * Math.PI, false)
    ctx_.fillStyle = '#AD50FF'
    ctx_.fill()
    ctx_.strokeStyle = '#7611B7'
    ctx_.lineWidth = 2
    ctx_.stroke()
  }

  const mapToTextureViewport = (pt, vp) => {
    const sc = canvas_.clientWidth / canvas_.width
    return {x: sc * (pt.x * vp.width + vp.offsetX), y: sc * (pt.y * vp.height + vp.offsetY)}
  }

  return {
    name: 'qrdisplay',
    onAttach: ({canvas}) => {
      canvas_ = canvas
      url_ = document.getElementById('url')
      canvas2d_ = document.getElementById('overlay2d')
      ctx_ = canvas2d_.getContext('2d')
      lastSeen_ = 0
      url_.style.visibility = 'visible'  // Show the card that displays the url.
      onCanvasSizeChange()
    },
    onDetach: () => {
      url_ = null
      canvas2d_ = null
      ctx_ = null
      lastSeen_ = 0
      canvas_ = null
    },
    onUpdate: ({processGpuResult, processCpuResult}) => {
      if (!processCpuResult.qrprocess) {
        return
      }

      canvas2d_.width = canvas2d_.width  // Clears canvas
      const {found, foundText, points} = processCpuResult.qrprocess
      const {viewport} = processGpuResult.gltexturerenderer

      // Toggle display text based on whether a qrcode result was found.
      if (found) {
        url_.innerHTML = `<u>${foundText}</u>`
        url_.href = foundText
        lastSeen_ = Date.now()
        points.forEach((pt) => {
          drawCircle(mapToTextureViewport(pt, viewport))
        })
      } else if (Date.now() - lastSeen_ > 5000) {
        url_.innerHTML = 'Scanning for QR Code...'
        url_.href = ''
      }
    },
    onCanvasSizeChange,
  }
}

export {qrprocessPipelineModule, qrdisplayPipelineModule}
