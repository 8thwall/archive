/* globals mat4 XRWebGLLayer */
import {ARButton} from './ar-button'
import {drawScene} from './draw-scene'
import {initScene} from './init-scene'

const runWebXr = (canvas) => {
  const gl = canvas.getContext('webgl', {xrCompatible: true})

  let referenceSpace_ = null
  let session_ = null
  let framebuffer_ = null

  canvas.width = 640
  canvas.height = 480
  const scene_ = initScene(gl)
  let then_ = 0

  const onAnimationFrame = (time, frame) => {
    const pose = frame.getViewerPose(referenceSpace_)

    if (pose !== null) {
      const {views} = pose
      const {baseLayer} = session_.renderState

      framebuffer_ = baseLayer.framebuffer

      console.log(`Got ${views.length} views`)

      const [view] = views
      const viewport = baseLayer.getViewport(view)

      mat4.copy(scene_.mvp.projection, view.projectionMatrix)
      mat4.invert(scene_.mvp.view, view.transform.matrix)
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer_)

      drawScene(gl, scene_, false, viewport)

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }
  }

  const animate = (time, frame) => {
    onAnimationFrame(time, frame)
    session_.requestAnimationFrame(animate)
  }

  const onRequestReferenceSpace = (referenceSpace) => {
    referenceSpace_ = referenceSpace
    session_.requestAnimationFrame(animate)
  }

  document.body.appendChild(ARButton.createButton({
    sessionStarted: (session) => {
      console.log('session started')
      session_ = session
      gl.makeXRCompatible()
      const attributes = gl.getContextAttributes()
      const layerInit = {
        antialias: attributes.antialias,
        alpha: attributes.alpha,
        depth: attributes.depth,
        stencil: attributes.stencil,
        framebufferScaleFactor: 1.0,
      }
      session.updateRenderState({baseLayer: new XRWebGLLayer(session, gl, layerInit)})
      session.requestReferenceSpace('local').then(onRequestReferenceSpace)
    },
    sessionEnded: () => {
      console.log('session ended')
    },
  }))
  Object.assign(canvas.style, {
    border: '2px solid black',
    backgroundColor: 'black',
  })

  // Draw the scene repeatedly
  const render = (now) => {
    mat4.rotate(scene_.mvp.model, scene_.mvp.model, (now - then_) * 1e-3, [0, 1, 0])
    then_ = now

    drawScene(gl, scene_, true)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

export {
  runWebXr,
}
