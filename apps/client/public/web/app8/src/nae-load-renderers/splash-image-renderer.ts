import {createProgram, createShader, getEffectAlpha} from './render-utils'

const FADE_IN_DURATION_MS = 2000
const GROW_DURATION_MS = 2500
const INITIAL_SCALE = 0.2
const FINAL_SCALE = 1.0
const IMAGE_QUAD_SIZE = 0.25

type ImageInit = {
  gl: WebGL2RenderingContext
  logoUrl: string
}

type SplashImageRenderer = {
  draw: (overallAlpha: number, isFadingOut: boolean, startTime: number, timestamp: number) => void
  cleanup: () => void
  onResize: () => void
}

// eslint-disable-next-line no-bitwise
const isPow2 = (v: number) => (v > 0) && ((v & (v - 1)) === 0)

const createSplashImageRenderer = ({gl, logoUrl}: ImageInit): SplashImageRenderer => {
  if (!gl) {
    throw new Error('[splash-image-renderer] WebGL context is not initialized')
  }

  let imageLoaded: boolean = false
  let offsetX: number = 0
  let offsetY: number = 0
  let renderWidth: number = 0
  let renderHeight: number = 0
  let image: HTMLImageElement | null = null

  const imageTexture = gl.createTexture()
  const imageVs = `
          attribute vec2 a_position;
          attribute vec2 a_texCoord;
          uniform float u_scale;
          varying vec2 v_texCoord;
          void main() {
              vec2 scaledPosition = a_position * u_scale;
              gl_Position = vec4(scaledPosition, 0.0, 1.0);
              v_texCoord = a_texCoord;
          }
      `
  const imageFs = `
          precision mediump float;
          varying vec2 v_texCoord;
          uniform sampler2D u_imageTexture;
          uniform float u_alpha;       // Image's own fade-in alpha
          uniform float u_globalAlpha; // Overall fade-out alpha
          void main() {
              vec4 textureColor = texture2D(u_imageTexture, v_texCoord);
              gl_FragColor = vec4(textureColor.rgb, textureColor.a * u_alpha * u_globalAlpha);
          }
      `
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, imageVs)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, imageFs)
  if (!vertexShader || !fragmentShader) {
    throw new Error('[splash-image-renderer] Failed to create shaders for image renderer.')
  }
  const imageProgram = createProgram(gl, vertexShader, fragmentShader)
  if (!imageProgram) {
    throw new Error('[splash-image-renderer] Failed to create image program.')
  }
  const imageScaleLocation = gl.getUniformLocation(imageProgram, 'u_scale')
  const imageAlphaLocation = gl.getUniformLocation(imageProgram, 'u_alpha')
  const imageTextureLocation = gl.getUniformLocation(imageProgram, 'u_imageTexture')
  const globalAlphaLocationImage = gl.getUniformLocation(imageProgram, 'u_globalAlpha')

  const imagePositionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, imagePositionBuffer)
  const imagePositions =
      [-IMAGE_QUAD_SIZE, -IMAGE_QUAD_SIZE,
        IMAGE_QUAD_SIZE, -IMAGE_QUAD_SIZE,
        -IMAGE_QUAD_SIZE, IMAGE_QUAD_SIZE,
        -IMAGE_QUAD_SIZE, IMAGE_QUAD_SIZE,
        IMAGE_QUAD_SIZE, -IMAGE_QUAD_SIZE,
        IMAGE_QUAD_SIZE, IMAGE_QUAD_SIZE]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(imagePositions), gl.STATIC_DRAW)

  const imageTexCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, imageTexCoordBuffer)
  const texCoords = [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)

  const onResize = () => {
    if (!image || !imageLoaded) {
      return
    }

    // Recalculate offsets and sizes based on the new canvas size
    const canvasWidth = gl.canvas.width
    const canvasHeight = gl.canvas.height
    const canvasAspect = canvasWidth / canvasHeight
    const imageAspect = image.width / image.height

    if (imageAspect > canvasAspect) {
      renderWidth = canvasWidth
      renderHeight = canvasWidth / imageAspect
      offsetX = 0
      offsetY = (canvasHeight - renderHeight) / 2
    } else {
      renderHeight = canvasHeight
      renderWidth = canvasHeight * imageAspect
      offsetY = 0
      offsetX = (canvasWidth - renderWidth) / 2
    }

    offsetX = Math.floor(offsetX)
    offsetY = Math.floor(offsetY)
    renderWidth = Math.floor(renderWidth)
    renderHeight = Math.floor(renderHeight)
  }

  const internalLoadTexture = async (url: string): Promise<void> => {
    gl.bindTexture(gl.TEXTURE_2D, imageTexture)
    const pixel = new Uint8Array([0, 0, 255, 255])  // opaque blue placeholder
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel)

    return new Promise((resolve, reject) => {
      image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => {
        imageLoaded = true
        onResize()

        gl.bindTexture(gl.TEXTURE_2D, imageTexture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

        if (isPow2(image.width) && isPow2(image.height)) {
          gl.generateMipmap(gl.TEXTURE_2D)
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        resolve()
      }
      image.onerror =
        e => reject(new Error(`Failed to load image: ${url}. Error event: ${typeof e === 'string'
          ? e : (e as Event).type}`))
      image.src = url
    })
  }

  const loadImageAndPrepare = async (): Promise<void> => {
    try {
      await internalLoadTexture(logoUrl)
    } catch (error) {
      throw new Error(`Failed to load image texture: ${error}`)
    }
  }

  const cleanup = () => {
    gl.deleteBuffer(imagePositionBuffer)
    gl.deleteBuffer(imageTexCoordBuffer)
    gl.deleteTexture(imageTexture)
    gl.deleteProgram(imageProgram)
  }

  const draw = (overallAlpha: number, isFadingOut: boolean,
    startTime: number, timestamp: number) => {
    if (!imageLoaded || !imageProgram || !imageScaleLocation || !imageAlphaLocation ||
      !imageTextureLocation || !globalAlphaLocationImage || overallAlpha <= 0.001) {
      return
    }

    gl.viewport(offsetX, offsetY, renderWidth, renderHeight)

    const imgSpecificAlpha = getEffectAlpha(isFadingOut, startTime, timestamp, FADE_IN_DURATION_MS)
    const growProgress = getEffectAlpha(isFadingOut, startTime, timestamp, GROW_DURATION_MS)
    const easedGrowProgress = 1 - (1 - growProgress) ** 3
    const currentScale = INITIAL_SCALE + (FINAL_SCALE - INITIAL_SCALE) * easedGrowProgress

    gl.useProgram(imageProgram)
    gl.uniform1f(imageScaleLocation, currentScale)
    gl.uniform1f(imageAlphaLocation, imgSpecificAlpha)
    gl.uniform1f(globalAlphaLocationImage, overallAlpha)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, imageTexture)
    gl.uniform1i(imageTextureLocation, 0)

    const posAttrLoc = gl.getAttribLocation(imageProgram, 'a_position')
    gl.enableVertexAttribArray(posAttrLoc)
    gl.bindBuffer(gl.ARRAY_BUFFER, imagePositionBuffer as WebGLBuffer)
    gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0)

    const texCoordAttrLoc = gl.getAttribLocation(imageProgram, 'a_texCoord')
    gl.enableVertexAttribArray(texCoordAttrLoc)
    gl.bindBuffer(gl.ARRAY_BUFFER, imageTexCoordBuffer as WebGLBuffer)
    gl.vertexAttribPointer(texCoordAttrLoc, 2, gl.FLOAT, false, 0, 0)

    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    gl.disable(gl.BLEND)
  }

  loadImageAndPrepare()

  return {
    cleanup,
    draw,
    onResize,
  }
}

export {
  SplashImageRenderer,
  createSplashImageRenderer,
}
