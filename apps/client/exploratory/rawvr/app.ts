// @rule(js_binary)
// @attr(esnext = 1)

import {createEmulatedXrApi} from '@nia/c8/xrapi/xrapi-emulated'
import {getNativeXrApi} from '@nia/c8/xrapi/xrapi-native'
import type {XrSystem, XrFrame, XrSession} from '@nia/c8/xrapi/xrapi-types'

const log = (...msgs: (string | number)[]) => {
  // eslint-disable-next-line no-console
  console.log(...msgs)
  document.body.appendChild(Object.assign(document.createElement('pre'), {
    textContent: msgs.join(' '),
  }))
}

log('start')

const xrApi = new URLSearchParams(window.location.search).get('native') === '1'
  ? getNativeXrApi()
  : createEmulatedXrApi(window as any)

const getSession = async (xr: XrSystem) => {
  try {
    return await xr.requestSession('immersive-vr')
  } catch (err) {
    log(`Failed to open: ${err}`)
  }

  return xr.requestSession('inline')
}

const SPACE_TYPES = ['local', 'local-floor', 'bounded-floor', 'unbounded', 'viewer'] as const

const vertexShaderSource = `
  attribute vec4 position;
  void main() {
    gl_Position = position * 40.0;
  }
`

const fragmentShaderSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

const getReferenceSpace = async (xrSession: XrSession) => {
  for (const type of SPACE_TYPES) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await xrSession.requestReferenceSpace(type)
    } catch (err) {
      log(`Failed to get ${type} space`)
    }
  }

  throw new Error('Couldn\'t load any space.')
}

const compileShader = (gl: WebGLRenderingContext, vert: string, frag: string) => {
  const shader = gl.createProgram()
  if (!shader) {
    throw new Error('Failed to create shader')
  }
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  if (!vertexShader) {
    throw new Error('Failed to create vertex shader')
  }
  gl.shaderSource(vertexShader, vert)
  gl.compileShader(vertexShader)
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw new Error(`Failed to compile vertex: ${gl.getShaderInfoLog(shader)}`)
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  if (!fragmentShader) {
    throw new Error('Failed to create fragment shader')
  }
  gl.shaderSource(fragmentShader, frag)
  gl.compileShader(fragmentShader)
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    throw new Error(`Failed to compile fragment: ${gl.getShaderInfoLog(shader)}`)
  }

  gl.attachShader(shader, vertexShader)
  gl.attachShader(shader, fragmentShader)

  gl.bindAttribLocation(shader, 0, 'position')
  gl.linkProgram(shader)

  if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
    throw new Error('Error linking vertex/fragment shaders.')
  }

  return shader
}

const startXr = async () => {
  let loggedFrame = false

  try {
    const {xr} = xrApi
    log('startXr')
    if (!xr) {
      log('no xr')
      return
    }

    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    Object.assign(canvas.style, {
      width: '20vw',
      height: '10vh',
      outline: '2px solid red',
    })

    const xrSession = await getSession(xr)

    log('session', xrSession.toString(), Object.keys(xrSession).join(', '))
    const space = await getReferenceSpace(xrSession)

    xrSession.addEventListener('end', () => {
      log('session end')
    })

    log('space', space.toString(), Object.keys(space).join(', '))

    const gl: WebGLRenderingContext | null = canvas.getContext('webgl2', {
      xrCompatible: true,
    }) as WebGLRenderingContext | null

    if (!gl) {
      log('no webgl')
      return
    }

    log('gl', Object.keys(space).join(', '))

    const glCheck = (name: string) => {
      const err = gl.getError()
      let code: string
      switch (err) {
        case gl.NO_ERROR:
          return
        case gl.INVALID_ENUM:
          code = 'INVALID_ENUM'
          break
        case gl.INVALID_VALUE:
          code = 'INVALID_VALUE'
          break
        case gl.INVALID_OPERATION:
          code = 'INVALID_OPERATION'
          break
        case gl.INVALID_FRAMEBUFFER_OPERATION:
          code = 'INVALID_FRAMEBUFFER_OPERATION'
          break
        case gl.OUT_OF_MEMORY:
          code = 'OUT_OF_MEMORY'
          break
        default:
          code = 'UNKNOWN'
          break
      }

      const message = `${name}: gl error: ${code} (${err})`
      xrSession.end()
      log(message)
      throw new Error(message)
    }

    glCheck('start')

    xrSession.updateRenderState({
      baseLayer: new xrApi.XrWebGlLayerClass(xrSession, gl),
      depthNear: 0.1,
      depthFar: 1000,
    })

    const redShader = compileShader(gl, vertexShaderSource, fragmentShaderSource)
    glCheck('shader')

    const pointsBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pointsBuffer)
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([
        0, 1, 2,
      ]),
      gl.STATIC_DRAW
    )

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0,
      ]),
      gl.STATIC_DRAW
    )
    glCheck('buffers')

    const positionLocation = gl.getAttribLocation(redShader, 'position')

    const render = (time: number, xrFrame: XrFrame) => {
      if (!loggedFrame) {
        log('frame', time, xrFrame.toString(), Object.keys(xrFrame).join(', '))
      }

      const xrWebGLLayer = xrSession.renderState.baseLayer!

      const viewer = xrFrame.getViewerPose(space)

      if (!viewer.views.length) {
        log('no views', time)
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, xrWebGLLayer.framebuffer)

      gl.clearColor((time % 10000) / 10000, 0.5, 0.5, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      for (const xrView of viewer.views) {
        const xrViewport = xrWebGLLayer.getViewport(xrView)
        if (!loggedFrame) {
          log(
            'view', xrView.toString(),
            Object.keys(xrView).join(', '),
            xrViewport.x, xrViewport.y, xrViewport.width, xrViewport.height
          )
        }
        gl.viewport(
          xrViewport.x,
          xrViewport.y,
          xrViewport.width,
          xrViewport.height
        )

        gl.clear(gl.DEPTH_BUFFER_BIT)
        gl.disable(gl.DEPTH_TEST)

        glCheck('config')

        gl.useProgram(redShader)
        glCheck('bind shader')

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pointsBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.vertexAttribPointer(
          positionLocation,
          3,
          gl.FLOAT,
          false,
          0,
          0
        )
        gl.enableVertexAttribArray(positionLocation)
        glCheck('bind arrays')

        gl.drawElements(gl.TRIANGLES, 1 * 3, gl.UNSIGNED_SHORT, 0)
        glCheck('draw')
      }
      loggedFrame = true

      xrSession.requestAnimationFrame(render)
    }

    xrSession.requestAnimationFrame(render)
  } catch (err) {
    log(`startXr error: ${err}`)
  }
}

document.body.appendChild(Object.assign(document.createElement('button'), {
  textContent: 'start',
  onclick: () => startXr(),
}))

document.body.appendChild(Object.assign(document.createElement('button'), {
  textContent: 'refresh',
  onclick: () => window.location.reload(),
}))
