// Copyright (c) 2019 8th Wall, Inc.
const nativeGetUserMedia = navigator.mediaDevices.getUserMedia
navigator.mediaDevices.getUserMedia = (args) => {
  return window.Promise.resolve().then(() => { return 'this is not a stream' })
}

const canvasProvider = {
  canvas: () => {return null}
}

const nativeCreateElement = document.createElement
document.createElement = (elem) => {
  if (elem == 'VIDEO') {
    const c = nativeCreateElement.call(document, 'canvas')
    c.videoWidth = c.width
    c.videoHeight = c.height
    c.currentTime = 0

    const updateVideoTime = () => {
      window.requestAnimationFrame(() => { updateVideoTime()})
      c.currentTime++
    }
    window.requestAnimationFrame(updateVideoTime)
    if (!canvasProvider.canvas()) {
      canvasProvider.canvas = () => {return c}
    }
    return c
  }
  return nativeCreateElement.call(document, elem)
}

const loadOffscreenVideo = (src) => {
  const offscreenVideo = nativeCreateElement.call(document, 'video')
  offscreenVideo.autoplay = true
  offscreenVideo.loop = true
  offscreenVideo.muted = true
  offscreenVideo.style = 'display: none;'
  offscreenVideo.setAttribute('playsinline', true)
  document.getElementsByTagName('body')[0].appendChild(offscreenVideo)
  offscreenVideo.src = src
  offscreenVideo.play()
  const checkVideoStatus = () => {
    requestAnimationFrame(() => {checkVideoStatus()})
    const c = canvasProvider.canvas()
    if (!c) {
      return
    }
    c.width = offscreenVideo.videoWidth
    c.height = offscreenVideo.videoHeight
    c.videoWidth = offscreenVideo.videoWidth
    c.videoHeight = offscreenVideo.videoHeight
    c.getContext('2d').drawImage(offscreenVideo, 0, 0)
  }
  checkVideoStatus()
}
window.requestAnimationFrame(() => {loadOffscreenVideo('image-targets.mp4')})
