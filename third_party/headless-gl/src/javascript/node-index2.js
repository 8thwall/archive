const bits = require('bit-twiddle')
const { WebGLContextAttributes } = require('./webgl-context-attributes')
const { WebGL2RenderingContext, wrapContext, getNull } = require('./webgl2-rendering-context')
const { WebGLTextureUnit } = require('./webgl-texture-unit')
const { InstancedArrays } = require('./webgl2/instanced-arrays')
const { WebGLMultipleRenderTargets } = require('./webgl2/webgl-multiple-render-targets')
const { WebGLVertexArrayObjectState, WebGLVertexArrayGlobalState, WebGLUniformBufferGlobalState } = require('./webgl-vertex-attribute')
const { WebGLTransformFeedbackGlobalState } = require('./webgl2/webgl-transform-feedback')
const { WebGLQueryGlobalState } = require('./webgl2/webgl-query')
const { WebGLSamplerGlobalState } = require('./webgl2/webgl-sampler')
const { WebGLSyncGlobalState } = require('./webgl2/webgl-sync')
const { WebGLContextBufferState } = require('./webgl2/webgl-context-buffers')
const { VertexArrayObject } = require('./webgl2/webgl-vertex-array-object')

let CONTEXT_COUNTER = 0

function flag (options, name, dflt) {
  if (!options || !(typeof options === 'object') || !(name in options)) {
    return dflt
  }
  return !!options[name]
}

function createWebGL2Context (width, height, optionsIn) {
  const options = optionsIn === undefined ? {} : optionsIn
  width = width | 0
  height = height | 0
  if (!(width > 0 && height > 0)) {
    return null
  }

  const contextAttributes = new WebGLContextAttributes(
    flag(options, 'alpha', true),
    flag(options, 'depth', true),
    flag(options, 'stencil', false),
    flag(options, 'antialias', true),
    flag(options, 'premultipliedAlpha', true),
    flag(options, 'preserveDrawingBuffer', false),
    flag(options, 'preferLowPowerToHighPerformance', false),
    flag(options, 'failIfMajorPerformanceCaveat', false),
  )

  // Can only use premultipliedAlpha if alpha is set
  contextAttributes.premultipliedAlpha =
    contextAttributes.premultipliedAlpha && contextAttributes.alpha

  let ctx
  try {
    ctx = new WebGL2RenderingContext(
      width,
      height,
      contextAttributes.alpha,
      contextAttributes.depth,
      contextAttributes.stencil,
      contextAttributes.antialias,
      contextAttributes.premultipliedAlpha,
      contextAttributes.preserveDrawingBuffer,
      contextAttributes.preferLowPowerToHighPerformance,
      contextAttributes.failIfMajorPerformanceCaveat,
      options['nativeWindow'] || getNull(),
    )
  } catch (e) {
    console.error('Failed to create native WebGL context', e)
  }
  if (!ctx) {
    return null
  }

  ctx.drawingBufferWidth = width
  ctx.drawingBufferHeight = height

  ctx._ = CONTEXT_COUNTER++

  ctx._contextAttributes = contextAttributes

  ctx._extensions = {}
  ctx._programs = {}
  ctx._shaders = {}
  ctx._buffers = {}
  ctx._textures = {}
  ctx._framebuffers = {}
  ctx._renderbuffers = {}

  // Store native method implementations here
  ctx.super = {}

  ctx._activeProgram = null
  ctx._drawFramebuffer = null
  ctx._readFramebuffer = null
  ctx._activeRenderbuffer = null
  ctx._readFramebufferBinding = null
  ctx._readBuffer = ctx.BACK
  ctx._checkStencil = false
  ctx._stencilState = true

  // Initialize texture units
  const numTextures = ctx.getParameter(ctx.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
  ctx._textureUnits = new Array(numTextures)
  for (let i = 0; i < numTextures; ++i) {
    ctx._textureUnits[i] = new WebGLTextureUnit(i)
  }
  ctx._activeTextureUnit = 0
  ctx.activeTexture(ctx.TEXTURE0)

  ctx._errorStack = []

  // Vertex array attributes that are in vertex array objects.
  ctx._defaultVertexObjectState = new WebGLVertexArrayObjectState(ctx)
  ctx._vertexObjectState = ctx._defaultVertexObjectState

  // Vertex array attributes that are not in vertex array objects.
  ctx._vertexGlobalState = new WebGLVertexArrayGlobalState(ctx)

  // Transform feedback state
  ctx._transformFeedbackGlobalState = new WebGLTransformFeedbackGlobalState(ctx)

  // Query state
  ctx._queryGlobalState = new WebGLQueryGlobalState(ctx)

  // Sampler state
  ctx._samplerGlobalState = new WebGLSamplerGlobalState(ctx)

  // Sync state
  ctx._syncGlobalState = new WebGLSyncGlobalState(ctx)

  // Multiple render targets state
  ctx._multipleRenderTargets = new WebGLMultipleRenderTargets(ctx)

  // Uniform buffer state
  ctx._uniformBufferGlobalState = new WebGLUniformBufferGlobalState(ctx)

  // Buffer state
  ctx._bufferContextState = new WebGLContextBufferState(ctx)

  ctx._instanceArrays = new InstancedArrays(ctx)

  ctx._vertexArrayObject = new VertexArrayObject(ctx)

  // Store limits
  ctx._maxTextureSize = ctx.getParameter(ctx.MAX_TEXTURE_SIZE)
  ctx._max3DTextureSize = ctx.getParameter(ctx.MAX_3D_TEXTURE_SIZE)
  ctx._maxTextureLevel = bits.log2(bits.nextPow2(ctx._maxTextureSize))
  ctx._max3DTextureLevel = bits.log2(bits.nextPow2(ctx._max3DTextureSize))
  ctx._maxCubeMapSize = ctx.getParameter(ctx.MAX_CUBE_MAP_TEXTURE_SIZE)
  ctx._maxCubeMapLevel = bits.log2(bits.nextPow2(ctx._maxCubeMapSize))

  // Unpack alignment
  ctx._unpackAlignment = 4
  ctx._packAlignment = 4

  // Allocate framebuffer if doing offscreen rendering.
  if (!options.nativeWindow) {
      //ctx._allocateDrawingBuffer(width, height)
  }

  //NOTE (akashmahesh): if trying to access properties of state variables, the below GL methods need to null check the active draw/read buffer
  // Initialize defaults
  ctx.bindBuffer(ctx.ARRAY_BUFFER, null)
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null)
  ctx.bindFramebuffer(ctx.FRAMEBUFFER, null)
  ctx.bindRenderbuffer(ctx.RENDERBUFFER, null)
  ctx.bindFramebuffer(ctx.READ_FRAMEBUFFER, null)
  ctx.bindFramebuffer(ctx.DRAW_FRAMEBUFFER, null)

  // Set viewport and scissor
  ctx.viewport(0, 0, width, height)
  ctx.scissor(0, 0, width, height)

  // Clear buffers
  ctx.clearDepth(1)
  ctx.clearColor(0, 0, 0, 0)
  ctx.clearStencil(0)
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT)

  return wrapContext(ctx)
}

export default createWebGL2Context
