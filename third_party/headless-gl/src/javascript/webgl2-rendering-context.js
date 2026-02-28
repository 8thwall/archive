const bits = require('bit-twiddle')
// const tokenize = require('glsl-tokenizer/string')

const HEADLESS_VERSION = require('../../package.json').version
const {WebGL2Export} = require('./native-gl')
const {getEXTTextureFilterAnisotropic} = require('./extensions/ext-texture-filter-anisotropic')
const {getEXTColorBufferFloat} = require('./webgl2/ext-color-buffer-float')
const {getEXTTextureCompressionBPTC} = require('./extensions/ext-texture-compression-bptc')
const {getEXTTextureCompressionRGTC} = require('./extensions/ext-texture-compression-rgtc')
const {getOESTextureFloatLinear} = require('./extensions/oes-texture-float-linear')
const {getWebGLCompressedTextureASTC} = require('./extensions/webgl-compressed-texture-astc')
const {getWebGLCompressedTextureS3TC} = require('./extensions/webgl-compressed-texture-s3tc')
const {getWebGLCompressedTextureS3TC_SRGB} = require('./extensions/webgl-compressed-texture-s3tc-srgb')
const {getWebGLCompressedTexturePVRTC} = require('./extensions/webgl-compressed-texture-pvrtc')
const {getWebGLMultisampledRenderToTexture} = require('./extensions/webgl-multisampled-render-to-texture')
const {
  bindPublics,
  checkObject,
  isValidString,
  extractImageData,
  isTypedArray,
  unpackTypedArray,
} = require('./utils')

const {
  checkPixelTypeTexture,
  checkUniform,
  computeImageSize2D,
  computeImageSize3D,
  convertPixels,
  isPowerOfTwo,
  lookupPixelSizeForFormatCombination,
  typeSize,
  uniformTypeSize,
  validCubeTarget,
  vertexCount,
} = require('./utils2')

const {isDebugMode, printStackTraceWithArgs} = require('./tools/debug-tools')
const {WebGLActiveInfo} = require('./webgl-active-info')
const {WebGLFramebuffer} = require('./webgl-framebuffer')
const {WebGLBuffer} = require('./webgl-buffer')
const {WebGLProgram} = require('./webgl-program')
const {WebGLRenderbuffer} = require('./webgl-renderbuffer')
const {WebGLShader} = require('./webgl-shader')
const {WebGLShaderPrecisionFormat} = require('./webgl-shader-precision-format')
const {WebGLTexture} = require('./webgl-texture')
const {WebGLTransformFeedback} = require('./webgl2/webgl-transform-feedback')
const {WebGLUniformLocation} = require('./webgl-uniform-location')

const {
  gl2: gl,
  NativeWebGL2RenderingContext,
  NativeWebGL2Object: NativeWebGL2,
  getNull2: getNull,
} = WebGL2Export

// These are defined by the WebGL spec
const MAX_UNIFORM_LENGTH = 256
const MAX_ATTRIBUTE_LENGTH = 256

const TOKENIZER_OPT = {version: '300 es'}

const availableExtensions = {
  ext_texture_filter_anisotropic: getEXTTextureFilterAnisotropic,
  ext_color_buffer_float: getEXTColorBufferFloat,
  ext_texture_compression_bptc: getEXTTextureCompressionBPTC,
  ext_texture_compression_rgtc: getEXTTextureCompressionRGTC,
  oes_texture_float_linear: getOESTextureFloatLinear,
  webgl_compressed_texture_astc: getWebGLCompressedTextureASTC,
  webgl_compressed_texture_s3tc: getWebGLCompressedTextureS3TC,
  webgl_compressed_texture_s3tc_srgb: getWebGLCompressedTextureS3TC_SRGB,
  webgl_compressed_texture_pvrtc: getWebGLCompressedTexturePVRTC,
  webgl_multisampled_render_to_texture: getWebGLMultisampledRenderToTexture,
}

const privateMethods = ['resize', 'destroy']

function wrapContext(ctx) {
  // Headless GL has a mechanism for wrapping a WebGL2RenderingContext and
  // hiding all private members from the public API. We're skipping it now,
  // as it is causing two copies of the native addon to be instantiated. This
  // can be revisited in the future.
  return ctx

  const wrapper = new WebGL2RenderingContext()
  bindPublics(Object.keys(ctx), wrapper, ctx, privateMethods)
  bindPublics(
    Object.keys(ctx.constructor.prototype), wrapper, ctx, privateMethods
  )
  bindPublics(Object.getOwnPropertyNames(ctx), wrapper, ctx, privateMethods)
  bindPublics(
    Object.getOwnPropertyNames(ctx.constructor.prototype),
    wrapper,
    ctx,
    privateMethods
  )

  /*
  Object.defineProperties(wrapper, {
    drawingBufferWidth: {
      get () { return ctx.drawingBufferWidth },
      set (value) { ctx.drawingBufferWidth = value }
    },
    drawingBufferHeight: {
      get () { return ctx.drawingBufferHeight },
      set (value) { ctx.drawingBufferHeight = value }
    }
  })
  */

  return wrapper
}

// We need to wrap some of the native WebGL functions to handle certain error
// codes and check input values
class WebGL2RenderingContext extends NativeWebGL2RenderingContext {
  _checkDimensions(
    target,
    width,
    height,
    depth,
    level
  ) {
    if (arguments.length === 4) {
      level = depth
      depth = 0
    }

    if (level < 0 ||
      width < 0 ||
      height < 0 ||
      depth < 0) {
      this.setError(gl.INVALID_VALUE)
      return false
    }
    if (target === gl.TEXTURE_2D) {
      if (width > this._maxTextureSize ||
        height > this._maxTextureSize ||
        level > this._maxTextureLevel) {
        this.setError(gl.INVALID_VALUE)
        return false
      }
    } else if (target === gl.TEXTURE_2D_ARRAY || target === gl.TEXTURE_3D) {
      if (level > this._max3DTextureLevel) {
        this.setError(gl.INVALID_VALUE)
        return false
      }

      const maxTextureSize = Math.floor(this._max3DTextureSize / Math.pow(2, level))
      if (width > maxTextureSize ||
        height > maxTextureSize ||
        depth > maxTextureSize) {
        this.setError(gl.INVALID_VALUE)
        return false
      }
    } else if (this._validCubeTarget(target)) {
      if (width > this._maxCubeMapSize ||
        height > this._maxCubeMapSize ||
        level > this._maxCubeMapLevel) {
        this.setError(gl.INVALID_VALUE)
        return false
      }
    } else {
      this.setError(gl.INVALID_ENUM)
      return false
    }
    return true
  }

  _checkLocation(location) {
    if (!(location instanceof WebGLUniformLocation)) {
      this.setError(gl.INVALID_VALUE)
      return false
    } else if (location._program._ctx !== this ||
      location._linkCount !== location._program._linkCount) {
      this.setError(gl.INVALID_OPERATION)
      return false
    }
    return true
  }

  _checkLocationActive(location) {
    if (!location) {
      return false
    } else if (!this._checkLocation(location)) {
      return false
    } else if (location._program !== this._activeProgram) {
      this.setError(gl.INVALID_OPERATION)
      return false
    }
    return true
  }

  _checkOwns(object) {
    return typeof object === 'object' &&
      object._ctx === this
  }

  // NOTE(akashmahesh): This is a no-op for performance reasons. tokenize() is expensive.
  _checkShaderSource(shader) {
    return true
    // const source = shader._source
    // const tokens = tokenize(source, TOKENIZER_OPT)

    // let errorStatus = false
    // const errorLog = []

    // for (let i = 0; i < tokens.length; ++i) {
    //   const tok = tokens[i]
    //   switch (tok.type) {
    //     case 'ident':
    //       if (!this._validGLSLIdentifier(tok.data)) {
    //         errorStatus = true
    //         errorLog.push(`${tok.line}:${tok.column
    //         } invalid identifier - ${tok.data}`)
    //       }
    //       break
    //     case 'preprocessor': {
    //       const bodyToks = tokenize(tok.data.match(/^\s*#\s*(.*)$/)[1], TOKENIZER_OPT)
    //       for (let j = 0; j < bodyToks.length; ++j) {
    //         const btok = bodyToks[j]
    //         if (btok.type === 'ident' || btok.type === undefined) {
    //           if (!this._validGLSLIdentifier(btok.data)) {
    //             errorStatus = true
    //             errorLog.push(`${tok.line}:${btok.column
    //             } invalid identifier - ${btok.data}`)
    //           }
    //         }
    //       }
    //       break
    //     }
    //     case 'keyword':
    //       break
    //     case 'builtin':
    //       break
    //   }
    // }

    // if (errorStatus) {
    //   shader._compileInfo = errorLog.join('\n')
    // }

    // return !errorStatus
  }

  _checkStencilState() {
    if (!this._checkStencil) {
      return this._stencilState
    }
    this._checkStencil = false
    this._stencilState = true
    if (this.getParameter(gl.STENCIL_WRITEMASK) !==
      this.getParameter(gl.STENCIL_BACK_WRITEMASK) ||
      this.getParameter(gl.STENCIL_VALUE_MASK) !==
      this.getParameter(gl.STENCIL_BACK_VALUE_MASK) ||
      this.getParameter(gl.STENCIL_REF) !==
      this.getParameter(gl.STENCIL_BACK_REF)) {
      this.setError(gl.INVALID_OPERATION)
      this._stencilState = false
    }
    return this._stencilState
  }

  _checkTextureTarget(target) {
    const unit = this._getActiveTextureUnit()
    let tex = null
    if (target === gl.TEXTURE_2D) {
      tex = unit._bind2D
    } else if (target === gl.TEXTURE_3D) {
      tex = unit._bind3D
    } else if (target === gl.TEXTURE_CUBE_MAP) {
      tex = unit._bindCube
    } else if (target === gl.TEXTURE_2D_ARRAY) {
      tex = unit._bind2DArray
    } else {
      this.setError(gl.INVALID_ENUM)
      return false
    }
    if (!tex) {
      this.setError(gl.INVALID_OPERATION)
      return false
    }
    return true
  }

  _checkWrapper(object, Wrapper) {
    if (!this._checkValid(object, Wrapper)) {
      this.setError(gl.INVALID_VALUE)
      return false
    } else if (!this._checkOwns(object)) {
      this.setError(gl.INVALID_OPERATION)
      return false
    }
    return true
  }

  _checkValid(object, Type) {
    return object instanceof Type && object._ !== 0
  }

  _checkVertexAttribState(maxIndex) {
    const program = this._activeProgram
    if (!program) {
      this.setError(gl.INVALID_OPERATION)
      return false
    }
    const attribs = this._vertexObjectState._attribs
    for (let i = 0; i < attribs.length; ++i) {
      const attrib = attribs[i]
      if (attrib._isPointer) {
        const buffer = attrib._pointerBuffer
        if (!buffer) {
          this.setError(gl.INVALID_OPERATION)
          return false
        }
        if (program._attributes.indexOf(i) >= 0) {
          let maxByte = 0
          if (attrib._divisor) {
            maxByte = attrib._pointerSize +
              attrib._pointerOffset
          } else {
            maxByte = attrib._pointerStride * maxIndex +
              attrib._pointerSize +
              attrib._pointerOffset
          }
          if (maxByte > buffer._size) {
            this.setError(gl.INVALID_OPERATION)
            return false
          }
        }
      }
    }
    return true
  }

  _checkVertexIndex(index) {
    if (index < 0 || index >= this._vertexObjectState._attribs.length) {
      this.setError(gl.INVALID_VALUE)
      return false
    }
    return true
  }

  _computeRowStride(width, pixelSize) {
    let rowStride = width * pixelSize
    if (rowStride % this._unpackAlignment) {
      rowStride += this._unpackAlignment - (rowStride % this._unpackAlignment)
    }
    return rowStride
  }

  _fixupLink(program) {
    if (!super.getProgramParameter(program._, gl.LINK_STATUS)) {
      program._linkInfoLog = super.getProgramInfoLog(program)
      return false
    }

    // Record attribute attributeLocations
    const numAttribs = this.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
    const names = new Array(numAttribs)
    program._attributes.length = numAttribs
    for (let i = 0; i < numAttribs; ++i) {
      names[i] = this.getActiveAttrib(program, i).name
      program._attributes[i] = this.getAttribLocation(program, names[i]) | 0
    }

    // Check attribute names
    for (let i = 0; i < names.length; ++i) {
      if (names[i].length > MAX_ATTRIBUTE_LENGTH) {
        program._linkInfoLog = `attribute ${names[i]} is too long`
        return false
      }
    }

    for (let i = 0; i < numAttribs; ++i) {
      super.bindAttribLocation(
        program._ | 0,
        program._attributes[i],
        names[i]
      )
    }

    super.linkProgram(program._ | 0)

    const numUniforms = this.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    program._uniforms.length = numUniforms
    for (let i = 0; i < numUniforms; ++i) {
      program._uniforms[i] = this.getActiveUniform(program, i)
    }

    // Check attribute and uniform name lengths
    for (let i = 0; i < program._uniforms.length; ++i) {
      if (program._uniforms[i].name.length > MAX_UNIFORM_LENGTH) {
        program._linkInfoLog = `uniform ${program._uniforms[i].name} is too long`
        return false
      }
    }

    program._linkInfoLog = ''
    return true
  }

  _drawFramebufferOk() {
    const framebuffer = this._drawFramebuffer
    if (framebuffer &&
      this._preCheckFramebufferStatus(framebuffer) !== gl.FRAMEBUFFER_COMPLETE) {
      this.setError(gl.INVALID_FRAMEBUFFER_OPERATION)
      return false
    }
    return true
  }

  _getActiveBuffer(target) {
    switch (target) {
      case gl.ARRAY_BUFFER:
        return this._vertexGlobalState._arrayBufferBinding
      case gl.ELEMENT_ARRAY_BUFFER:
        return this._vertexObjectState._elementArrayBufferBinding
      case gl.TRANSFORM_FEEDBACK_BUFFER:
        return this._transformFeedbackGlobalState._transformFeedbackBufferBinding
      case gl.UNIFORM_BUFFER:
        return this._uniformBufferGlobalState._uniformBufferBinding
      case gl.COPY_READ_BUFFER:
      case gl.COPY_WRITE_BUFFER:
      case gl.PIXEL_PACK_BUFFER:
      case gl.PIXEL_UNPACK_BUFFER:
        return this._bufferContextState.getBuffer(target)
    }

    return null
  }

  _getActiveTextureUnit() {
    return this._textureUnits[this._activeTextureUnit]
  }

  _getActiveTexture(target) {
    const activeUnit = this._getActiveTextureUnit()
    if (target === gl.TEXTURE_2D) {
      return activeUnit._bind2D
    } else if (target === gl.TEXTURE_3D) {
      return activeUnit._bind3D
    } else if (target === gl.TEXTURE_CUBE_MAP) {
      return activeUnit._bindCube
    }
    return null
  }

  _getAttachments() {
    return this._multipleRenderTargets.ALL_ATTACHMENTS
  }

  _getColorAttachments() {
    return this._multipleRenderTargets.ALL_COLOR_ATTACHMENTS
  }

  _getTexImage(target) {
    const unit = this._getActiveTextureUnit()
    if (target === gl.TEXTURE_2D) {
      return unit._bind2D
    } else if (target === gl.TEXTURE_2D_ARRAY) {
      return unit._bind2DArray
    } else if (target === gl.TEXTURE_3D) {
      return unit._bind3D
    } else if (validCubeTarget(target)) {
      return unit._bindCube
    }
    this.setError(gl.INVALID_ENUM)
    return null
  }

  /*
  Conditions for Framebuffer Completeness:
    - Attachment Completeness: All attachments must be complete (i.e., have allocated storage).
    - Matching Dimensions: All attachments must have the same width and height.
    - Valid Formats: The combination of internal formats of the attachments must be valid.
    - At Least One Attachment: The framebuffer must have at least one attachment (color, depth, or stencil).
  */
  _preCheckFramebufferStatus(framebuffer) {
    const attachments = framebuffer._attachments
    const width = []
    const height = []
    const depthAttachment = attachments[gl.DEPTH_ATTACHMENT]
    const stencilAttachment = attachments[gl.STENCIL_ATTACHMENT]
    const colorAttachments = this._getColorAttachments()

    if (depthAttachment && depthAttachment instanceof WebGLRenderbuffer) {
      if (depthAttachment._format !== gl.DEPTH_COMPONENT16 &&
       depthAttachment._format !== gl.DEPTH_COMPONENT24 &&
       depthAttachment._format !== gl.DEPTH_COMPONENT32F &&
       depthAttachment._format !== gl.DEPTH24_STENCIL8 &&
       depthAttachment._format !== gl.DEPTH32F_STENCIL8 &&
       depthAttachment._format !== gl.DEPTH_STENCIL) {
        return gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT
      }
      width.push(depthAttachment._width)
      height.push(depthAttachment._height)
    }

    if (stencilAttachment && stencilAttachment instanceof WebGLRenderbuffer) {
      if (stencilAttachment._format !== gl.STENCIL_INDEX8 &&
         stencilAttachment._format !== gl.DEPTH_STENCIL) {
        return gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT
      }
      width.push(stencilAttachment._width)
      height.push(stencilAttachment._height)
    }

    if (depthAttachment && stencilAttachment && depthAttachment !== stencilAttachment) {
      return gl.FRAMEBUFFER_UNSUPPORTED
    }

    let colorAttached = false
    for (let i = 0; i < colorAttachments.length; ++i) {
      const colorAttachment = attachments[colorAttachments[i]]
      if (colorAttachment instanceof WebGLTexture) {
        if (lookupPixelSizeForFormatCombination(colorAttachment._internalFormat, colorAttachment._format, colorAttachment._type) === 0) {
          return gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT
        }
        colorAttached = true
        const level = framebuffer._attachmentLevel[gl.COLOR_ATTACHMENT0]
        width.push(colorAttachment._levelWidth[level])
        height.push(colorAttachment._levelHeight[level])
      } else if (colorAttachment instanceof WebGLRenderbuffer) {
        const format = colorAttachment._format
        switch (format) {
          case gl.RGBA4:
          case gl.RGBA8:
          case gl.RGBA32I:
          case gl.RGBA32UI:
          case gl.RGBA32F:
          case gl.RGB565:
          case gl.RGB5_A1:
          case gl.RGB8:
            break
          case gl.R16F:
          case gl.R32F:
          case gl.RG16F:
          case gl.RG32F:
          case gl.RGBA16F:
          case gl.RGBA32F:
          case gl.R11F_G11F_B10F:
            if (this._extensions.ext_color_buffer_float) {
              break
            }
          default:
            return gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT
        }
        colorAttached = true
        width.push(colorAttachment._width)
        height.push(colorAttachment._height)
      }
    }

    if (!colorAttached &&
      !stencilAttachment &&
      !depthAttachment) {
      return gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT
    }

    if (width.length <= 0 || height.length <= 0) {
      return gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT
    }

    for (let i = 1; i < width.length; ++i) {
      if (width[i - 1] !== width[i] ||
        height[i - 1] !== height[i]) {
        return gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS
      }
    }

    if (width[0] === 0 || height[0] === 0) {
      return gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT
    }

    framebuffer._width = width[0]
    framebuffer._height = height[0]

    return gl.FRAMEBUFFER_COMPLETE
  }

  _isConstantBlendFunc(factor) {
    return (
      factor === gl.CONSTANT_COLOR ||
      factor === gl.ONE_MINUS_CONSTANT_COLOR ||
      factor === gl.CONSTANT_ALPHA ||
      factor === gl.ONE_MINUS_CONSTANT_ALPHA)
  }

  _isObject(object, method, Wrapper) {
    if (!(object === null || object === undefined) &&
      !(object instanceof Wrapper)) {
      throw new TypeError(`${method}(${Wrapper.name})`)
    }
    if (this._checkValid(object, Wrapper) && this._checkOwns(object)) {
      return true
    }
    return false
  }

  // Commenting out all of the custom logic to use an offscreen
  // framebuffer/renderbuffer as we want to render to the EGL surface provided
  // by ANGLE.
  /*
  _resizeDrawingBuffer (width, height) {
    const prevFramebuffer = this._activeFramebuffer
    const prevTexture = this._getActiveTexture(gl.TEXTURE_2D)
    const prevRenderbuffer = this._activeRenderbuffer

    const contextAttributes = this._contextAttributes

    const drawingBuffer = this._drawingBuffer
    super.bindFramebuffer(gl.FRAMEBUFFER, drawingBuffer._framebuffer)
    const attachments = this._getAttachments()
    // Clear all attachments
    for (let i = 0; i < attachments.length; ++i) {
      super.framebufferTexture2D(
        gl.FRAMEBUFFER,
        attachments[i],
        gl.TEXTURE_2D,
        0,
        0)
    }

    // Update color attachment
    super.bindTexture(gl.TEXTURE_2D, drawingBuffer._color)
    const colorFormat = contextAttributes.alpha ? gl.RGBA : gl.RGB
    super.texImage2D(
      gl.TEXTURE_2D,
      0,
      colorFormat,
      width,
      height,
      0,
      colorFormat,
      gl.UNSIGNED_BYTE,
      null)
    super.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    super.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    super.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      drawingBuffer._color,
      0)

    // Update depth-stencil attachments if needed
    let storage = 0
    let attachment = 0
    if (contextAttributes.depth && contextAttributes.stencil) {
      storage = gl.DEPTH_STENCIL
      attachment = gl.DEPTH_STENCIL_ATTACHMENT
    } else if (contextAttributes.depth) {
      storage = 0x81A7
      attachment = gl.DEPTH_ATTACHMENT
    } else if (contextAttributes.stencil) {
      storage = gl.STENCIL_INDEX8
      attachment = gl.STENCIL_ATTACHMENT
    }

    if (storage) {
      super.bindRenderbuffer(
        gl.RENDERBUFFER,
        drawingBuffer._depthStencil)
      super.renderbufferStorage(
        gl.RENDERBUFFER,
        storage,
        width,
        height)
      super.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        attachment,
        gl.RENDERBUFFER,
        drawingBuffer._depthStencil)
    }

    // Restore previous binding state
    this.bindFramebuffer(gl.FRAMEBUFFER, prevFramebuffer)
    this.bindTexture(gl.TEXTURE_2D, prevTexture)
    this.bindRenderbuffer(gl.RENDERBUFFER, prevRenderbuffer)
  }
  */

  _restoreError(lastError) {
    const topError = this._errorStack.pop()
    if (topError === gl.NO_ERROR) {
      this.setError(lastError)
    } else {
      this.setError(topError)
    }
  }

  _saveError() {
    this._errorStack.push(this.getError())
  }

  _switchActiveProgram(active) {
    if (active) {
      active._refCount -= 1
      active._checkDelete()
    }
  }

  _tryDetachFramebuffer(framebuffer, renderbuffer) {
    // FIXME: Does the texture get unbound from *all* framebuffers, or just the
    // active FBO?
    if (framebuffer && framebuffer._linked(renderbuffer)) {
      const attachments = this._getAttachments()
      const framebufferAttachments = Object.keys(framebuffer._attachments)
      for (let i = 0; i < framebufferAttachments.length; ++i) {
        if (framebuffer._attachments[attachments[i]] === renderbuffer) {
          this.framebufferTexture2D(
            gl.FRAMEBUFFER,
            attachments[i] | 0,
            gl.TEXTURE_2D,
            null
          )
        }
      }
    }
  }

  _uniformVectorOffset(location, value, method, size, srcOffset, srcLength) {
    if (!this._checkUniformValueWithOffsetValid(location, value, method, size, srcOffset, srcLength)) {
      return
    }

    let data
    if (size === 1 && srcLength === 0) {
      data = value.slice(srcOffset)
    } else {
      data = value.slice(srcOffset, srcOffset + srcLength)
    }
    if (data.length === 0 &&
      (value.length - srcOffset) % size !== 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    super[method](location._, data)
  }

  _msaaDisabled = false

  _attachmentObjToSampleCount = new WeakMap()

  disableMsaa() {
    this._msaaDisabled = true
  }

  enableMsaa() {
    this._msaaDisabled = false
  }

  // TODO(divya): This should probably take in the target as an argument. It seems
  // to be always calling framebuffer operations on the gl.FRAMEBUFFER target, but
  // passing in the target breaks the following test:
  // conformance2/renderbuffers/readbuffer.html
  _updateFramebufferAttachments(framebuffer) {
    const prevStatus = framebuffer._status
    const attachments = this._getAttachments()
    framebuffer._status = this._preCheckFramebufferStatus(framebuffer)
    if (framebuffer._status !== gl.FRAMEBUFFER_COMPLETE) {
      if (prevStatus === gl.FRAMEBUFFER_COMPLETE) {
        for (let i = 0; i < attachments.length; ++i) {
          const attachmentEnum = attachments[i]
          super.framebufferTexture2D(
            gl.FRAMEBUFFER,
            attachmentEnum,
            framebuffer._attachmentFace[attachmentEnum],
            0,
            framebuffer._attachmentLevel[attachmentEnum]
          )
        }
      }
      return
    }

    // Clear all attachments
    for (let i = 0; i < attachments.length; ++i) {
      const attachmentEnum = attachments[i]
      super.framebufferTexture2D(
        gl.FRAMEBUFFER,
        attachmentEnum,
        framebuffer._attachmentFace[attachmentEnum],
        0,
        framebuffer._attachmentLevel[attachmentEnum]
      )
    }

    for (let i = 0; i < attachments.length; ++i) {
      const attachmentEnum = attachments[i]
      const attachment = framebuffer._attachments[attachmentEnum]
      const samples = this._msaaDisabled ? 0 : this._attachmentObjToSampleCount.get(attachment) || 0
      if (attachment instanceof WebGLTexture &&
        (attachment._binding === gl.TEXTURE_3D || attachment._binding === gl.TEXTURE_2D_ARRAY)) {
        super.framebufferTextureLayer(
          gl.FRAMEBUFFER,
          attachmentEnum,
          attachment._ | 0,
          framebuffer._attachmentLevel[attachmentEnum],
          framebuffer._attachmentLayer[attachmentEnum]
        )
        attachment._framebufferBinding = framebuffer
        attachment._framebufferBindingDirty = false
      } else if (attachment instanceof WebGLTexture && attachment._samples > 1) {
        if (!this._extensions.webgl_multisampled_render_to_texture) {
          this.setError(gl.INVALID_FRAMEBUFFER_OPERATION)
          return
        }
        // NOTE(dat): I tried skipping this if block and go to the next one which calls
        // framebufferTexture2D when msaaDisabled. This results in flashing screen of the previous
        // frame instead of the new frame without samplings. When I make sure both the COLOR0
        // texture and the DEPTH renderbuffer has the same `samples`, the flashing goes away.
        super.framebufferTexture2DMultisampleEXT(
          gl.FRAMEBUFFER,
          attachmentEnum,
          framebuffer._attachmentFace[attachmentEnum],
          attachment._ | 0,
          framebuffer._attachmentLevel[attachmentEnum],
          samples
        )
        attachment._framebufferBinding = framebuffer
        attachment._framebufferBindingDirty = false
      } else if (attachment instanceof WebGLTexture) {
        super.framebufferTexture2D(
          gl.FRAMEBUFFER,
          attachmentEnum,
          framebuffer._attachmentFace[attachmentEnum],
          attachment._ | 0,
          framebuffer._attachmentLevel[attachmentEnum]
        )
        attachment._framebufferBinding = framebuffer
        attachment._framebufferBindingDirty = false
      } else if (attachment instanceof WebGLRenderbuffer) {
        // Resetup the render buffer if the user turned off msaa causing the sample to change.
        // If this is not done and the `samples` are different for different attachments
        // in a framebuffer, it results in a flashing screen of the previous frame. Perhaps that's
        // what happen when the framebuffer is INCOMPLETE.
        if (attachment?._samples !== samples) {
          // Detach the renderbuffer to our frame buffer
          super.framebufferRenderbuffer(gl.FRAMEBUFFER, attachmentEnum, gl.RENDERBUFFER, 0)

          // Save the current active renderbuffer
          const activeRenderbuffer = this._activeRenderbuffer

          // Update the renderbuffer
          this.bindRenderbuffer(gl.RENDERBUFFER, attachment)
          super.renderbufferStorageMultisampleEXT(
            gl.RENDERBUFFER,
            samples,
            attachment._format,
            attachment._width,
            attachment._height
          )

          // Rebind the original renderbuffer
          this.bindRenderbuffer(gl.RENDERBUFFER, activeRenderbuffer)

          // Update the attachment samples
          attachment._samples = samples
        }
        // Rebind the renderbuffer to our frame buffer
        super.framebufferRenderbuffer(
          gl.FRAMEBUFFER,
          attachmentEnum,
          gl.RENDERBUFFER,
          attachment._ | 0
        )
      }
    }
  }

  _validBlendFunc(factor) {
    return factor === gl.ZERO ||
      factor === gl.ONE ||
      factor === gl.SRC_COLOR ||
      factor === gl.ONE_MINUS_SRC_COLOR ||
      factor === gl.DST_COLOR ||
      factor === gl.ONE_MINUS_DST_COLOR ||
      factor === gl.SRC_ALPHA ||
      factor === gl.ONE_MINUS_SRC_ALPHA ||
      factor === gl.DST_ALPHA ||
      factor === gl.ONE_MINUS_DST_ALPHA ||
      factor === gl.SRC_ALPHA_SATURATE ||
      factor === gl.CONSTANT_COLOR ||
      factor === gl.ONE_MINUS_CONSTANT_COLOR ||
      factor === gl.CONSTANT_ALPHA ||
      factor === gl.ONE_MINUS_CONSTANT_ALPHA
  }

  _validBlendMode(mode) {
    return mode === gl.FUNC_ADD ||
      mode === gl.FUNC_SUBTRACT ||
      mode === gl.FUNC_REVERSE_SUBTRACT ||
      mode === gl.MIN || mode === gl.MAX
  }

  _validCubeTarget(target) {
    return target === gl.TEXTURE_CUBE_MAP_POSITIVE_X ||
      target === gl.TEXTURE_CUBE_MAP_NEGATIVE_X ||
      target === gl.TEXTURE_CUBE_MAP_POSITIVE_Y ||
      target === gl.TEXTURE_CUBE_MAP_NEGATIVE_Y ||
      target === gl.TEXTURE_CUBE_MAP_POSITIVE_Z ||
      target === gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
  }

  _validFramebufferAttachment(attachment) {
    switch (attachment) {
      case gl.DEPTH_ATTACHMENT:
      case gl.STENCIL_ATTACHMENT:
      case gl.DEPTH_STENCIL_ATTACHMENT:
        return true
    }

    if (attachment >= gl.COLOR_ATTACHMENT0 && attachment < gl.COLOR_ATTACHMENT0 + this.getParameter(gl.MAX_COLOR_ATTACHMENTS)) {
      return true
    }

    return false
  }

  _validGLSLIdentifier(str) {
    return !(str.indexOf('webgl_') === 0 ||
      str.indexOf('_webgl_') === 0 ||
      str.length > 256)
  }

  _validTextureTarget(target) {
    return target === gl.TEXTURE_2D ||
      target === gl.TEXTURE_3D ||
      target === gl.TEXTURE_CUBE_MAP ||
      target === gl.TEXTURE_2D_ARRAY
  }

  _verifyTextureCompleteness(target, pname, param) {
    const unit = this._getActiveTextureUnit()
    let texture = null
    if (target === gl.TEXTURE_2D) {
      texture = unit._bind2D
    } else if (target === gl.TEXTURE_2D_ARRAY) {
      texture = unit._bind2DArray
    } else if (target === gl.TEXTURE_3D) {
      texture = unit._bind3D
    } else if (this._validCubeTarget(target)) {
      texture = unit._bindCube
    }

    if (!this._extensions.oes_texture_float_linear && texture && texture._type === gl.FLOAT && (pname === gl.TEXTURE_MAG_FILTER || pname === gl.TEXTURE_MIN_FILTER) && (param === gl.LINEAR || param === gl.LINEAR_MIPMAP_NEAREST || param === gl.NEAREST_MIPMAP_LINEAR || param === gl.LINEAR_MIPMAP_LINEAR)) {
      texture._complete = false
      this.bindTexture(target, texture)
      return
    }

    if (texture && texture._complete === false) {
      texture._complete = true
      this.bindTexture(target, texture)
    }
  }

  activeTexture(texture) {
    // printStackTraceWithArgs(arguments)

    texture |= 0
    const texNum = texture - gl.TEXTURE0
    // if (texNum >= 0 && texNum < this._textureUnits.length) {
    this._activeTextureUnit = texNum
    return super.activeTexture(texture)
    // }

    // this.setError(gl.INVALID_ENUM)
  }

  attachShader(program, shader) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program) ||
      !checkObject(shader)) {
      throw new TypeError('attachShader(WebGLProgram, WebGLShader)')
    }
    if (!program || !shader) {
      this.setError(gl.INVALID_VALUE)
      return
    } else if (program instanceof WebGLProgram &&
      shader instanceof WebGLShader &&
      this._checkOwns(program) &&
      this._checkOwns(shader)) {
      if (!program._linked(shader)) {
        this._saveError()
        super.attachShader(
          program._ | 0,
          shader._ | 0
        )
        const error = this.getError()
        this._restoreError(error)
        if (error === gl.NO_ERROR) {
          program._link(shader)
        }
        return
      }
    }
    this.setError(gl.INVALID_OPERATION)
  }

  beginTransformFeedback(primitiveMode) {
    printStackTraceWithArgs(arguments)

    switch (primitiveMode) {
      case gl.POINTS:
      case gl.LINES:
      case gl.TRIANGLES:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    if (this._transformFeedbackGlobalState._activeTransformFeedback) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    super.beginTransformFeedback(primitiveMode)

    if (this.getError() === gl.NO_ERROR) {
      this._transformFeedbackGlobalState._activeTransformFeedback = true
      this._transformFeedbackGlobalState._activePrimitiveInfo = primitiveMode
    }
  }

  bindAttribLocation(program, index, name) {
    if (!checkObject(program) ||
      typeof name !== 'string') {
      throw new TypeError('bindAttribLocation(WebGLProgram, GLint, String)')
    }
    name += ''
    if (!isValidString(name) || name.length > MAX_ATTRIBUTE_LENGTH) {
      this.setError(gl.INVALID_VALUE)
    } else if (/^_?webgl_a/.test(name)) {
      this.setError(gl.INVALID_OPERATION)
    } else if (this._checkWrapper(program, WebGLProgram)) {
      return super.bindAttribLocation(
        program._ | 0,
        index | 0,
        name
      )
    }
  }

  bindFramebuffer(target, framebuffer) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(framebuffer)) {
      throw new TypeError('bindFramebuffer(GLenum, WebGLFramebuffer)')
    }
    if (target !== gl.FRAMEBUFFER && target !== gl.DRAW_FRAMEBUFFER && target !== gl.READ_FRAMEBUFFER) {
      this.setError(gl.INVALID_ENUM)
      return
    }
    if (!framebuffer) {
      super.bindFramebuffer(target, 0)
    } else if (framebuffer._pendingDelete) {
      return
    } else if (this._checkWrapper(framebuffer, WebGLFramebuffer)) {
      super.bindFramebuffer(
        target,
        framebuffer._ | 0
      )
    } else {
      return
    }

    if (target === gl.FRAMEBUFFER || target === gl.DRAW_FRAMEBUFFER) {
      const {_drawFramebuffer} = this
      if (_drawFramebuffer !== framebuffer) {
        if (_drawFramebuffer) {
          _drawFramebuffer._refCount -= 1
          _drawFramebuffer._checkDelete()
        }
        if (framebuffer) {
          framebuffer._refCount += 1
        }
      }
      this._drawFramebuffer = framebuffer
      if (framebuffer) {
        this._updateFramebufferAttachments(framebuffer)
      }
    }

    if (target === gl.FRAMEBUFFER || target === gl.READ_FRAMEBUFFER) {
      const {_readFramebuffer} = this
      if (_readFramebuffer !== framebuffer) {
        if (_readFramebuffer) {
          _readFramebuffer._refCount -= 1
          _readFramebuffer._checkDelete()
        }
        if (framebuffer) {
          framebuffer._refCount += 1
        }
      }
      this._readFramebuffer = framebuffer
      if (framebuffer) {
        this._updateFramebufferAttachments(framebuffer)
      }
    }
  }

  bindBuffer(target, buffer) {
    printStackTraceWithArgs(arguments)

    target |= 0
    if (!checkObject(buffer)) {
      throw new TypeError('bindBuffer(GLenum, WebGLBuffer)')
    }

    switch (target) {
      case gl.ARRAY_BUFFER:
      case gl.ELEMENT_ARRAY_BUFFER:
      case gl.TRANSFORM_FEEDBACK_BUFFER:
      case gl.UNIFORM_BUFFER:
      case gl.COPY_READ_BUFFER:
      case gl.COPY_WRITE_BUFFER:
      case gl.PIXEL_PACK_BUFFER:
      case gl.PIXEL_UNPACK_BUFFER:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    if (!buffer) {
      buffer = null
      super.bindBuffer(target, 0)
    } else if (buffer._pendingDelete) {
      this.setError(gl.INVALID_OPERATION)
      return
    } else if (this._checkWrapper(buffer, WebGLBuffer)) {
      const isCopyBuffer = (target === gl.COPY_READ_BUFFER || target === gl.COPY_WRITE_BUFFER)
      const hasElementArrayBuffer = (target === gl.ELEMENT_ARRAY_BUFFER || buffer._binding === gl.ELEMENT_ARRAY_BUFFER)
      if (buffer._binding && buffer._binding !== target && hasElementArrayBuffer && !isCopyBuffer) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (!isCopyBuffer || buffer._binding === 0) {
        buffer._binding = target | 0
      }

      super.bindBuffer(target, buffer._ | 0)
    } else {
      return
    }

    switch (target) {
      case gl.ARRAY_BUFFER:
        this._vertexGlobalState.setArrayBuffer(buffer)
        break
      case gl.ELEMENT_ARRAY_BUFFER:
        this._vertexObjectState.setElementArrayBuffer(buffer)
        break
      case gl.TRANSFORM_FEEDBACK_BUFFER:
        this._transformFeedbackGlobalState.setTransformFeedbackBuffer(buffer)
        break
      case gl.UNIFORM_BUFFER:
        this._uniformBufferGlobalState.setUniformBuffer(buffer)
        break
      case gl.COPY_READ_BUFFER:
      case gl.COPY_WRITE_BUFFER:
      case gl.PIXEL_PACK_BUFFER:
      case gl.PIXEL_UNPACK_BUFFER:
        this._bufferContextState.setBuffer(target, buffer)
        break
      default:
        this.setError(gl.INVALID_ENUM)
    }
  }

  bindBufferBase(target, index, buffer) {
    printStackTraceWithArgs(arguments)

    target |= 0
    index |= 0
    if (!checkObject(buffer)) {
      throw new TypeError('bindBufferBase(GLenum, GLuint, WebGLBuffer)')
    }
    if (target !== gl.TRANSFORM_FEEDBACK_BUFFER &&
      target !== gl.UNIFORM_BUFFER) {
      this.setError(gl.INVALID_ENUM)
      return
    }
    if (target === gl.TRANSFORM_FEEDBACK_BUFFER && index >= this.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)) {
      this.setError(gl.INVALID_VALUE)
      return
    }
    if (target === gl.UNIFORM_BUFFER && index >= this.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS)) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (!buffer) {
      buffer = null
      super.bindBufferBase(target, index, 0)
    } else if (buffer._pendingDelete) {
      return
    } else if (this._checkWrapper(buffer, WebGLBuffer)) {
      const isCopyBuffer = (target === gl.COPY_READ_BUFFER || target === gl.COPY_WRITE_BUFFER)
      const hasElementArrayBuffer = (target === gl.ELEMENT_ARRAY_BUFFER || buffer._binding === gl.ELEMENT_ARRAY_BUFFER)
      if (buffer._binding && buffer._binding !== target && hasElementArrayBuffer && !isCopyBuffer) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
      if (!isCopyBuffer) {
        buffer._binding = target | 0
      }

      super.bindBufferBase(target, index, buffer._ | 0)
    } else {
      return
    }

    if (target === gl.TRANSFORM_FEEDBACK_BUFFER) {
      this._transformFeedbackGlobalState.setTransformFeedbackIndexedBuffer(buffer, index)
    } else if (target === gl.UNIFORM_BUFFER) {
      this._uniformBufferGlobalState.setUniformIndexedBuffer(buffer, index)
    }
  }

  bindBufferRange(target, index, buffer, offset, size) {
    printStackTraceWithArgs(arguments)

    target |= 0
    index |= 0
    offset |= 0
    size |= 0

    if (!checkObject(buffer)) {
      throw new TypeError('bindBufferRange(GLenum, GLuint, WebGLBuffer, GLintptr, GLsizeiptr)')
    }

    if (target !== gl.TRANSFORM_FEEDBACK_BUFFER &&
      target !== gl.UNIFORM_BUFFER) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (target === gl.TRANSFORM_FEEDBACK_BUFFER && index >= this.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (target === gl.UNIFORM_BUFFER && index >= this.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS)) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (buffer && size <= 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (target === gl.TRANSFORM_FEEDBACK_BUFFER && (((size % 4) !== 0) || ((offset % 4) !== 0))) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (target === gl.UNIFORM_BUFFER && offset % this.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT) !== 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (!buffer) {
      buffer = null
      super.bindBufferBase(target, index, 0)
    } else if (buffer._pendingDelete) {
      return
    } else if (this._checkWrapper(buffer, WebGLBuffer)) {
      const isCopyBuffer = (target === gl.COPY_READ_BUFFER || target === gl.COPY_WRITE_BUFFER)
      const hasElementArrayBuffer = (target === gl.ELEMENT_ARRAY_BUFFER || buffer._binding === gl.ELEMENT_ARRAY_BUFFER)
      if (buffer._binding && buffer._binding !== target && hasElementArrayBuffer && !isCopyBuffer) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
      if (!isCopyBuffer) {
        buffer._binding = target | 0
      }

      super.bindBufferRange(target, index, buffer._ | 0, offset, size)
    } else {
      return
    }

    if (target === gl.TRANSFORM_FEEDBACK_BUFFER) {
      this._transformFeedbackGlobalState.setTransformFeedbackIndexedBuffer(buffer, index)
    } else if (target === gl.UNIFORM_BUFFER) {
      this._uniformBufferGlobalState.setUniformIndexedBuffer(buffer, index)
    }
  }

  bindRenderbuffer(target, object) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(object)) {
      throw new TypeError('bindRenderbuffer(GLenum, WebGLRenderbuffer)')
    }

    if (target !== gl.RENDERBUFFER) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (!object) {
      super.bindRenderbuffer(
        target | 0,
        0
      )
    } else if (object._pendingDelete) {
      return
    } else if (this._checkWrapper(object, WebGLRenderbuffer)) {
      super.bindRenderbuffer(
        target | 0,
        object._ | 0
      )
    } else {
      return
    }
    const active = this._activeRenderbuffer
    if (active !== object) {
      if (active) {
        active._refCount -= 1
        active._checkDelete()
      }
      if (object) {
        object._refCount += 1
      }
    }
    this._activeRenderbuffer = object
  }

  bindTexture(target, texture) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(texture)) {
      throw new TypeError('bindTexture(GLenum, WebGLTexture)')
    }

    if (!this._validTextureTarget(target)) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    // Get texture id
    let textureId = 0
    if (!texture) {
      texture = null
    } else if (texture instanceof WebGLTexture &&
      texture._pendingDelete) {
      // Special case: error codes for deleted textures don't get set for some dumb reason
      return
    } else if (this._checkWrapper(texture, WebGLTexture)) {
      // Check binding mode of texture
      if (texture._binding && texture._binding !== target) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
      texture._binding = target

      if (texture._complete) {
        textureId = texture._ | 0
      }
    } else {
      return
    }

    this._saveError()
    super.bindTexture(
      target,
      textureId
    )
    const error = this.getError()
    this._restoreError(error)

    if (error !== gl.NO_ERROR) {
      return
    }

    const activeUnit = this._getActiveTextureUnit()
    const activeTex = this._getActiveTexture(target)

    // Update references
    if (activeTex !== texture) {
      if (activeTex) {
        activeTex._refCount -= 1
        activeTex._checkDelete()
      }
      if (texture) {
        texture._refCount += 1
      }
    }

    if (target === gl.TEXTURE_2D) {
      activeUnit._bind2D = texture
    } else if (target === gl.TEXTURE_2D_ARRAY) {
      activeUnit._bind2DArray = texture
    } else if (target === gl.TEXTURE_3D) {
      activeUnit._bind3D = texture
    } else if (target === gl.TEXTURE_CUBE_MAP) {
      activeUnit._bindCube = texture
    } else {
      this.setError(gl.INVALID_ENUM)
    }
  }

  bindTransformFeedback(target, transformFeedback) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(transformFeedback)) {
      throw new TypeError('bindTransformFeedback(GLenum, WebGLTransformFeedback)')
    }

    if (target !== gl.TRANSFORM_FEEDBACK) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    // Handle null input
    // If no transform feedbacks have ever been created with this context, we can use the default
    if (!transformFeedback) {
      this._transformFeedbackGlobalState.unbindTransformFeedback()

      if (this._canUseDefaultTransformFeedback) {
        transformFeedback = this._transformFeedbackGlobalState.getDefaultTransformFeedback()
      } else {
        return
      }
    }

    if (this._checkWrapper(transformFeedback, WebGLTransformFeedback)) {
      super.bindTransformFeedback(
        target || 0,
        transformFeedback._ | 0
      )
      this._transformFeedbackGlobalState.bindTransformFeedback(transformFeedback)
    }
  }

  blendColor(red, green, blue, alpha) {
    return super.blendColor(+red, +green, +blue, +alpha)
  }

  blendEquation(mode) {
    mode |= 0
    if (this._validBlendMode(mode)) {
      return super.blendEquation(mode)
    }
    this.setError(gl.INVALID_ENUM)
  }

  blendEquationSeparate(modeRGB, modeAlpha) {
    printStackTraceWithArgs(arguments)

    modeRGB |= 0
    modeAlpha |= 0
    if (this._validBlendMode(modeRGB) && this._validBlendMode(modeAlpha)) {
      return super.blendEquationSeparate(modeRGB, modeAlpha)
    }
    this.setError(gl.INVALID_ENUM)
  }

  _getCompressedTextureExtension(format) {
    if (this._extensions.webgl_compressed_texture_s3tc_srgb) {
      const ext = this._extensions.webgl_compressed_texture_s3tc_srgb
      switch (format) {
        case ext.COMPRESSED_SRGB_S3TC_DXT1_EXT:
        case ext.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT:
        case ext.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT:
        case ext.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT:
          return ext
      }
    }

    if (this._extensions.webgl_compressed_texture_s3tc) {
      const ext = this._extensions.webgl_compressed_texture_s3tc
      switch (format) {
        case ext.COMPRESSED_RGB_S3TC_DXT1_EXT:
        case ext.COMPRESSED_RGBA_S3TC_DXT1_EXT:
        case ext.COMPRESSED_RGBA_S3TC_DXT3_EXT:
        case ext.COMPRESSED_RGBA_S3TC_DXT5_EXT:
          return ext
      }
    }

    if (this._extensions.ext_texture_compression_rgtc) {
      const ext = this._extensions.ext_texture_compression_rgtc
      switch (format) {
        case ext.COMPRESSED_RED_RGTC1_EXT:
        case ext.COMPRESSED_SIGNED_RED_RGTC1_EXT:
        case ext.COMPRESSED_RED_GREEN_RGTC2_EXT:
        case ext.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT:
          return ext
      }
    }

    if (this._extensions.ext_texture_compression_bptc) {
      const ext = this._extensions.ext_texture_compression_bptc
      switch (format) {
        case ext.COMPRESSED_RGBA_BPTC_UNORM_EXT:
        case ext.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:
        case ext.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT:
        case ext.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT:
          return ext
      }
    }

    if (this._extensions.webgl_compressed_texture_astc) {
      const ext = this._extensions.webgl_compressed_texture_astc
      switch (format) {
        case ext.COMPRESSED_RGBA_ASTC_4x4_KHR:
        case ext.COMPRESSED_RGBA_ASTC_5x4_KHR:
        case ext.COMPRESSED_RGBA_ASTC_5x5_KHR:
        case ext.COMPRESSED_RGBA_ASTC_6x5_KHR:
        case ext.COMPRESSED_RGBA_ASTC_6x6_KHR:
        case ext.COMPRESSED_RGBA_ASTC_8x5_KHR:
        case ext.COMPRESSED_RGBA_ASTC_8x6_KHR:
        case ext.COMPRESSED_RGBA_ASTC_8x8_KHR:
        case ext.COMPRESSED_RGBA_ASTC_10x5_KHR:
        case ext.COMPRESSED_RGBA_ASTC_10x6_KHR:
        case ext.COMPRESSED_RGBA_ASTC_10x8_KHR:
        case ext.COMPRESSED_RGBA_ASTC_10x10_KHR:
        case ext.COMPRESSED_RGBA_ASTC_12x10_KHR:
        case ext.COMPRESSED_RGBA_ASTC_12x12_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:
          return ext
      }
    }

    if (this._extensions.webgl_compressed_texture_pvrtc) {
      const ext = this._extensions.webgl_compressed_texture_pvrtc
      switch (format) {
        case ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
        case ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
        case ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
        case ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
          return ext
      }
    }

    return null
  }

  _getCompressedTextureValidatedSize(format, width, height) {
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_s3tc_srgb/
    if (this._extensions.webgl_compressed_texture_s3tc_srgb) {
      const ext = this._extensions.webgl_compressed_texture_s3tc_srgb
      switch (format) {
        case ext.COMPRESSED_SRGB_S3TC_DXT1_EXT:
        case ext.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT:
          return Math.floor((width + 3) / 4) * Math.floor((height + 3) / 4) * 8
        case ext.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT:
        case ext.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT:
          return Math.floor((width + 3) / 4) * Math.floor((height + 3) / 4) * 16
      }
    }

    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_s3tc/
    if (this._extensions.webgl_compressed_texture_s3tc) {
      const ext = this._extensions.webgl_compressed_texture_s3tc
      switch (format) {
        case ext.COMPRESSED_RGB_S3TC_DXT1_EXT:
        case ext.COMPRESSED_RGBA_S3TC_DXT1_EXT:
          return Math.floor((width + 3) / 4) * Math.floor((height + 3) / 4) * 8
        case ext.COMPRESSED_RGBA_S3TC_DXT3_EXT:
        case ext.COMPRESSED_RGBA_S3TC_DXT5_EXT:
          return Math.floor((width + 3) / 4) * Math.floor((height + 3) / 4) * 16
      }
    }

    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_rgtc/
    if (this._extensions.ext_texture_compression_rgtc) {
      const ext = this._extensions.ext_texture_compression_rgtc
      switch (format) {
        case ext.COMPRESSED_RED_RGTC1_EXT:
        case ext.COMPRESSED_SIGNED_RED_RGTC1_EXT:
          return Math.ceil(width / 4) * Math.ceil(height / 4) * 8
        case ext.COMPRESSED_RED_GREEN_RGTC2_EXT:
        case ext.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT:
          return Math.ceil(width / 4) * Math.ceil(height / 4) * 16
      }
    }

    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_bptc/
    if (this._extensions.ext_texture_compression_bptc) {
      const ext = this._extensions.ext_texture_compression_bptc
      switch (format) {
        case ext.COMPRESSED_RGBA_BPTC_UNORM_EXT:
        case ext.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:
        case ext.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT:
        case ext.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT:
          return Math.ceil(width / 4) * Math.ceil(height / 4) * 16
      }
    }

    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_astc/
    if (this._extensions.webgl_compressed_texture_astc) {
      const ext = this._extensions.webgl_compressed_texture_astc
      switch (format) {
        case ext.COMPRESSED_RGBA_ASTC_4x4_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:
          return Math.floor((width + 3) / 4) * Math.floor((height + 3) / 4) * 16
        case ext.COMPRESSED_RGBA_ASTC_5x4_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:
          return Math.floor((width + 4) / 5) * Math.floor((height + 3) / 4) * 16
        case ext.COMPRESSED_RGBA_ASTC_5x5_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:
          return Math.floor((width + 4) / 5) * Math.floor((height + 4) / 5) * 16
        case ext.COMPRESSED_RGBA_ASTC_6x5_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:
          return Math.floor((width + 5) / 6) * Math.floor((height + 4) / 5) * 16
        case ext.COMPRESSED_RGBA_ASTC_6x6_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:
          return Math.floor((width + 5) / 6) * Math.floor((height + 5) / 6) * 16
        case ext.COMPRESSED_RGBA_ASTC_8x5_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:
          return Math.floor((width + 7) / 8) * Math.floor((height + 4) / 5) * 16
        case ext.COMPRESSED_RGBA_ASTC_8x6_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:
          return Math.floor((width + 7) / 8) * Math.floor((height + 5) / 6) * 16
        case ext.COMPRESSED_RGBA_ASTC_8x8_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:
          return Math.floor((width + 7) / 8) * Math.floor((height + 7) / 8) * 16
        case ext.COMPRESSED_RGBA_ASTC_10x5_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:
          return Math.floor((width + 9) / 10) * Math.floor((height + 4) / 5) * 16
        case ext.COMPRESSED_RGBA_ASTC_10x6_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:
          return Math.floor((width + 9) / 10) * Math.floor((height + 5) / 6) * 16
        case ext.COMPRESSED_RGBA_ASTC_10x8_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:
          return Math.floor((width + 9) / 10) * Math.floor((height + 7) / 8) * 16
        case ext.COMPRESSED_RGBA_ASTC_10x10_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:
          return Math.floor((width + 9) / 10) * Math.floor((height + 9) / 10) * 16
        case ext.COMPRESSED_RGBA_ASTC_12x10_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:
          return Math.floor((width + 11) / 12) * Math.floor((height + 9) / 10) * 16
        case ext.COMPRESSED_RGBA_ASTC_12x12_KHR:
        case ext.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:
          return Math.floor((width + 11) / 12) * Math.floor((height + 11) / 12) * 16
      }
    }

    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_pvrtc/
    if (this._extensions.webgl_compressed_texture_pvrtc) {
      const ext = this._extensions.webgl_compressed_texture_pvrtc
      switch (format) {
        case ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
        case ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
          return Math.max(width, 8) * Math.max(height, 8) / 2
        case ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
        case ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
          return Math.max(width, 16) * Math.max(height, 8) / 4
      }
    }

    return null
  }

  _checkCompressedTextureSize(ext, width, height, level) {
    // When level equals zero width and height must be a multiple of 4.
    // When level is greater than 0 width and height must be 0, 1, 2 or a multiple of 4.
    if (ext === this._extensions.webgl_compressed_texture_s3tc_srgb) {
      if (level === 0) {
        if (width % 4 !== 0 || height % 4 !== 0) {
          return false
        }
      } else if (level > 0) {
        if (width !== 0 && width !== 1 && width !== 2 && width % 4 !== 0) {
          return false
        }
        if (height !== 0 && height !== 1 && height !== 2 && height % 4 !== 0) {
          return false
        }
      } else {
        return false
      }
    }

    if (ext === this._extensions.webgl_compressed_texture_s3tc ||
      ext === this._extensions.ext_texture_compression_rgtc ||
      ext === this._extensions.ext_texture_compression_bptc) {
      if (((width << level) % 4 !== 0) || ((height << level) % 4 !== 0)) {
        return false
      }
    }

    if (ext === this._extensions.ext_texture_compression_rgtc) {
      if (level === 0 && (width % 4 !== 0 || height % 4 !== 0)) {
        return false
      }
    }

    return true
  }

  _checkCompressedTextureOffset(ext, xoffset, yoffset, width, height, level) {
    // For compressedTexSubImage2D xoffset and yoffset must be a multiple of 4 and width must be a
    // multiple of 4 or equal to the original width of the level. height must be a multiple of 4
    // or equal to the original height of the level. If they are not an INVALID_OPERATION error is generated.
    // TODO(lreyna): Add unit tests for this.
    // Level 0 represents the original dimensions of the texture. May need to update to fetch active texture dims.
    if (ext === this._extensions.webgl_compressed_texture_s3tc || ext === this._extensions.webgl_compressed_texture_s3tc_srgb) {
      if (!((xoffset % 4 === 0) && (yoffset % 4 === 0)) && (width % 4 === 0 || level === 0) && (height % 4 === 0 || level === 0)) {
        return false
      }
    }

    return true
  }

  // Misc checks for compressedTexImage2D to set INVALID_VALUE error
  _compressedTexImage2DValueCheck(ext, width, height) {
    // In compressedTexImage2D, the width and height parameters must be powers of two.
    if (ext === this._extensions.webgl_compressed_texture_pvrtc) {
      if (!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
        return false
      }
    }

    return true
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Compressed_texture_formats
  compressedTexImage2D(target, level, internalFormat, width, height, border, srcData, srcOffset = 0, srcLengthOverride = 0) {
    printStackTraceWithArgs(arguments)

    target |= 0
    level |= 0
    internalFormat |= 0
    width |= 0
    height |= 0
    border |= 0

    if (arguments.length < 7 || arguments.length > 9) {
      throw new TypeError('compressedTexImage2D(GLenum, GLint, GLenum, GLsizei, GLsizei, GLint, number | [[ArrayBufferView, srcOffset = 0], srcLengthOverride = 0])')
    }

    const ext = this._getCompressedTextureExtension(internalFormat)
    if (ext === null) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (!this._compressedTexImage2DValueCheck(ext, width, height, level)) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (ArrayBuffer.isView(srcData)) {
      // Reading from srcData begins srcOffset elements into srcData.
      // (Elements are bytes for Uint8Array, int32s for Int32Array, etc.)
      if (srcOffset < 0 || srcOffset >= srcData.length) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      if (srcLengthOverride === 0) {
        srcLengthOverride = srcData.length - srcOffset
      }

      // If there's not enough data in srcData starting at srcOffset,
      // or if the amount of data passed in is not consistent with the format, dimensions,
      // and contents of the compressed image, generates an INVALID_VALUE error.
      if (srcData.length < srcLengthOverride) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      srcData = srcData.subarray(srcOffset, srcOffset + srcLengthOverride)

      // if the variant of compressedTexImage*D or compressedTexSubImage*D taking ArrayBufferView pixels is called,
      // then the byteLength of the view must be equal to validatedSize, or an INVALID_VALUE error is generated.
      const validSize = this._getCompressedTextureValidatedSize(internalFormat, width, height)
      if (srcData.byteLength !== validSize) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      if (!this._checkCompressedTextureSize(ext, width, height, level)) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      this._saveError()
      super.compressedTexImage2D(target, level, internalFormat, width, height, border, validSize, srcData)
    } else if (typeof pixels === 'number') {
      // offset in bytes
      const offset = srcData | 0

      const pixelUnpackBuffer = this._bufferContextState.getBuffer(gl.PIXEL_UNPACK_BUFFER)
      if (!pixelUnpackBuffer) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      // if the variant of compressedTexImage*D or compressedTexSubImage*D taking GLintptr offset is called,
      // and offset + validatedSize is greater than the size of the bound PIXEL_UNPACK_BUFFER, an INVALID_OPERATION error is generated.
      const validSize = this._getCompressedTextureValidatedSize(internalFormat, width, height)
      if (offset + validSize > pixelUnpackBuffer._size) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (!this._checkCompressedTextureSize(ext, width, height, level)) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      this._saveError()
      super.compressedTexImage2D(target, level, internalFormat, width, height, border, validSize, offset)
      return
    } else {
      throw new TypeError('compressedTexImage2D(GLenum, GLint, GLenum, GLsizei, GLsizei, GLint, number | [[ArrayBufferView, srcOffset = 0], srcLengthOverride = 0])')
    }

    // Verify that the native call succeeded
    const error = this.getError()
    this._restoreError(error)

    if (error !== gl.NO_ERROR) {
      return
    }

    texture._levelWidth[level] = width
    texture._levelHeight[level] = height
    texture._format = internalFormat
    texture._internalFormat = internalFormat
    texture._type = type
  }

  // Misc checks for compressedTexSubImage2D to set INVALID_VALUE error
  _compressedTexSubImage2DValueCheck(ext, tex, width, height, level, xoffset, yoffset) {
    // In compressedTexSubImage2D, the width and height parameters must be equal
    // to the current values of the existing texture image, and the xoffset and yoffset parameters must be zero.
    if (ext === this._extensions.webgl_compressed_texture_pvrtc) {
      const activeWidth = tex._levelWidth[level]
      const activeHeight = tex._levelHeight[level]
      if (width !== activeWidth || height !== activeHeight || xoffset !== 0 || yoffset !== 0) {
        return false
      }
    }

    return true
  }

  compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data, srcOffset = 0, srcLengthOverride = 0) {
    printStackTraceWithArgs(arguments)

    target |= 0
    level |= 0
    xoffset |= 0
    yoffset |= 0
    width |= 0
    height |= 0
    format |= 0

    if (arguments.length < 8 || arguments.length > 10) {
      throw new TypeError('compressedTexImage2D(GLenum, GLint, GLenum, GLsizei, GLsizei, GLint, number | [[ArrayBufferView, srcOffset = 0], srcLengthOverride = 0])')
    }

    const texture = this._getTexImage(target)
    if (!texture) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const ext = this._getCompressedTextureExtension(format)
    if (ext === null) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (!this._compressedTexSubImage2DValueCheck(ext, texture, width, height, level, xoffset, yoffset)) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (ArrayBuffer.isView(data)) {
      // Reading from srcData begins srcOffset elements into srcData.
      // (Elements are bytes for Uint8Array, int32s for Int32Array, etc.)
      if (srcOffset < 0 || srcOffset >= data.length) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      if (srcLengthOverride === 0) {
        srcLengthOverride = data.length - srcOffset
      }

      // If there's not enough data in srcData starting at srcOffset,
      // or if the amount of data passed in is not consistent with the format, dimensions,
      // and contents of the compressed image, generates an INVALID_VALUE error.
      if (data.length < srcLengthOverride) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      data = data.subarray(srcOffset, srcOffset + srcLengthOverride)

      // if the variant of compressedTexImage*D or compressedTexSubImage*D taking ArrayBufferView pixels is called,
      // then the byteLength of the view must be equal to validatedSize, or an INVALID_VALUE error is generated.
      const validSize = this._getCompressedTextureValidatedSize(format, width, height)
      if (data.byteLength !== validSize) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      if (!this._checkCompressedTextureSize(ext, width, height, level)) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (!this._checkCompressedTextureOffset(ext, xoffset, yoffset, width, height, level)) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      super.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, srcLengthOverride, data)
    } else if (typeof pixels === 'number') {
      // offset in bytes
      const offset = srcData | 0

      const pixelUnpackBuffer = this._bufferContextState.getBuffer(gl.PIXEL_UNPACK_BUFFER)
      if (!pixelUnpackBuffer) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      // if the variant of compressedTexImage*D or compressedTexSubImage*D taking GLintptr offset is called,
      // and offset + validatedSize is greater than the size of the bound PIXEL_UNPACK_BUFFER, an INVALID_OPERATION error is generated.
      const validSize = this._getCompressedTextureValidatedSize(internalFormat, width, height)
      if (offset + validSize > pixelUnpackBuffer._size) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (!this._checkCompressedTextureSize(ext, width, height, level)) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (!this._checkCompressedTextureOffset(ext, xoffset, yoffset, width, height, level)) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      super.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, validSize, offset)
    } else {
      throw new TypeError('compressedTexSubImage2D(GLenum, GLint, GLint, GLint, GLsizei, GLsizei, GLenum, GLsizei, number | [[ArrayBufferView, srcOffset = 0], srcLengthOverride = 0])')
    }
  }

  createBuffer() {
    printStackTraceWithArgs(arguments)

    const id = super.createBuffer()
    if (id <= 0) return null
    const webGLBuffer = new WebGLBuffer(id, this)
    this._buffers[id] = webGLBuffer
    return webGLBuffer
  }

  createFramebuffer() {
    printStackTraceWithArgs(arguments)

    const id = super.createFramebuffer()
    if (id <= 0) return null
    const webGLFramebuffer = new WebGLFramebuffer(id, this)
    this._framebuffers[id] = webGLFramebuffer
    return webGLFramebuffer
  }

  createProgram() {
    printStackTraceWithArgs(arguments)

    const id = super.createProgram()
    if (id <= 0) return null
    const webGLProgram = new WebGLProgram(id, this)
    this._programs[id] = webGLProgram
    return webGLProgram
  }

  createRenderbuffer() {
    printStackTraceWithArgs(arguments)

    const id = super.createRenderbuffer()
    if (id <= 0) return null
    const webGLRenderbuffer = new WebGLRenderbuffer(id, this)
    this._renderbuffers[id] = webGLRenderbuffer
    return webGLRenderbuffer
  }

  createTexture() {
    printStackTraceWithArgs(arguments)

    const id = super.createTexture()
    if (id <= 0) return null
    const webGlTexture = new WebGLTexture(id, this)
    this._textures[id] = webGlTexture
    return webGlTexture
  }

  createTransformFeedback() {
    printStackTraceWithArgs(arguments)

    const id = super.createTransformFeedback()
    if (id <= 0) return null
    this._canUseDefaultTransformFeedback = false
    const webGLTransformFeedback = new WebGLTransformFeedback(id, this)
    this._transformFeedbackGlobalState.addTransformFeedback(webGLTransformFeedback)
    return webGLTransformFeedback
  }

  getContextAttributes() {
    printStackTraceWithArgs(arguments)

    return this._contextAttributes
  }

  getExtension(name) {
    printStackTraceWithArgs(arguments)

    const str = name.toLowerCase()
    if (str in this._extensions) {
      return this._extensions[str]
    }
    const ext = availableExtensions[str] ? availableExtensions[str](this) : null
    if (ext) {
      this._extensions[str] = ext
    }
    return ext
  }

  _getNativeSupportedExtensions() {
    return super.getSupportedExtensions()
  }

  getSupportedExtensions() {
    printStackTraceWithArgs(arguments)

    const exts = [
    ]

    const supportedExts = this._getNativeSupportedExtensions()

    if (supportedExts.indexOf('EXT_texture_filter_anisotropic') >= 0) {
      exts.push('EXT_texture_filter_anisotropic')
    }

    if (supportedExts.indexOf('EXT_color_buffer_float') >= 0) {
      exts.push('EXT_color_buffer_float')
    }

    // This extensions is causing crashes when used with current version of ANGLE
    if (!gl.__NIA_ANGLE_CONTEXT && supportedExts.indexOf('EXT_multisampled_render_to_texture') >= 0) {
      exts.push('WEBGL_multisampled_render_to_texture')
    }

    if (supportedExts.indexOf('OES_texture_float_linear') >= 0) {
      exts.push('OES_texture_float_linear')
    }

    if (supportedExts.indexOf('GL_KHR_texture_compression_astc_hdr') >= 0 ||
      supportedExts.indexOf('GL_KHR_texture_compression_astc_ldr') >= 0) {
      exts.push('WEBGL_compressed_texture_astc')
    }

    if (supportedExts.indexOf('EXT_texture_compression_s3tc_srgb') >= 0) {
      exts.push('WEBGL_compressed_texture_s3tc_srgb')
    }

    if (supportedExts.indexOf('EXT_texture_compression_s3tc') >= 0) {
      exts.push('WEBGL_compressed_texture_s3tc')
    }

    if (supportedExts.indexOf('GL_IMG_texture_compression_pvrtc') >= 0) {
      exts.push('WEBGL_compressed_texture_pvrtc')
    }

    if (supportedExts.indexOf('EXT_texture_compression_rgtc') >= 0) {
      exts.push('EXT_texture_compression_rgtc')
    }

    if (supportedExts.indexOf('EXT_texture_compression_bptc') >= 0) {
      exts.push('EXT_texture_compression_bptc')
    }

    return exts
  }

  setError(error) {
    printStackTraceWithArgs(arguments)

    // In production mode, we don't want to make blocking gpu calls
    if (!isDebugMode) {
      return
    }

    NativeWebGL2.setError.call(this, error | 0)
  }

  blendFunc(sfactor, dfactor) {
    // printStackTraceWithArgs(arguments)

    sfactor |= 0
    dfactor |= 0
    // if (!this._validBlendFunc(sfactor) ||
    //   !this._validBlendFunc(dfactor)) {
    //   this.setError(gl.INVALID_ENUM)
    //   return
    // }
    // if (this._isConstantBlendFunc(sfactor) && this._isConstantBlendFunc(dfactor)) {
    //   this.setError(gl.INVALID_OPERATION)
    //   return
    // }
    super.blendFunc(sfactor, dfactor)
  }

  blendFuncSeparate(
    srcRGB,
    dstRGB,
    srcAlpha,
    dstAlpha
  ) {
    // printStackTraceWithArgs(arguments)

    srcRGB |= 0
    dstRGB |= 0
    srcAlpha |= 0
    dstAlpha |= 0

    // if (!(this._validBlendFunc(srcRGB) &&
    //   this._validBlendFunc(dstRGB) &&
    //   this._validBlendFunc(srcAlpha) &&
    //   this._validBlendFunc(dstAlpha))) {
    //   this.setError(gl.INVALID_ENUM)
    //   return
    // }

    // if ((this._isConstantBlendFunc(srcRGB) && this._isConstantBlendFunc(dstRGB)) ||
    //   (this._isConstantBlendFunc(srcAlpha) && this._isConstantBlendFunc(dstAlpha))) {
    //   this.setError(gl.INVALID_OPERATION)
    //   return
    // }

    super.blendFuncSeparate(
      srcRGB,
      dstRGB,
      srcAlpha,
      dstAlpha
    )
  }

  bufferData(target, data, usage, srcOffset, length = 0) {
    printStackTraceWithArgs(arguments)

    target |= 0
    usage |= 0

    switch (usage) {
      case gl.STATIC_DRAW:
      case gl.STATIC_READ:
      case gl.STATIC_COPY:
      case gl.DYNAMIC_DRAW:
      case gl.DYNAMIC_READ:
      case gl.DYNAMIC_COPY:
      case gl.STREAM_DRAW:
      case gl.STREAM_READ:
      case gl.STREAM_COPY:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    switch (target) {
      case gl.ARRAY_BUFFER:
      case gl.ELEMENT_ARRAY_BUFFER:
      case gl.TRANSFORM_FEEDBACK_BUFFER:
      case gl.UNIFORM_BUFFER:
      case gl.COPY_READ_BUFFER:
      case gl.COPY_WRITE_BUFFER:
      case gl.PIXEL_PACK_BUFFER:
      case gl.PIXEL_UNPACK_BUFFER:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    const active = this._getActiveBuffer(target)
    if (!active) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (typeof data === 'object') {
      let u8Data = null
      if (isTypedArray(data) || data instanceof DataView) {
        u8Data = unpackTypedArray(data)
      } else if (data instanceof ArrayBuffer) {
        u8Data = new Uint8Array(data)
      } else {
        this.setError(gl.INVALID_VALUE)
        return
      }

      if (arguments.length === 4 || arguments.length === 5) {
        srcOffset >>>= 0
        length |= 0

        if (length === 0) {
          length = data.length - srcOffset
        }

        let copyLengthBytes = length
        let srcOffsetBytes = srcOffset
        if (isTypedArray(data) || data instanceof DataView) {
          srcOffsetBytes *= data.BYTES_PER_ELEMENT
          copyLengthBytes *= data.BYTES_PER_ELEMENT
        }

        if (srcOffsetBytes < 0 || copyLengthBytes < 0 || srcOffsetBytes > u8Data.byteLength || srcOffsetBytes + copyLengthBytes > u8Data.byteLength) {
          this.setError(gl.INVALID_VALUE)
          return
        }

        if (copyLengthBytes > 0) {
          u8Data = u8Data.subarray(srcOffsetBytes, srcOffsetBytes + copyLengthBytes)
        }
      }

      this._saveError()
      super.bufferData(
        target,
        u8Data,
        usage
      )
      const error = this.getError()
      this._restoreError(error)
      if (error !== gl.NO_ERROR) {
        return
      }

      active._size = u8Data.length

      if (target === gl.ELEMENT_ARRAY_BUFFER) {
        active._elements = new Uint8Array(u8Data)
      }
    } else if (typeof data === 'number') {
      const size = data | 0
      if (size < 0) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      this._saveError()
      super.bufferData(
        target,
        size,
        usage
      )
      const error = this.getError()
      this._restoreError(error)
      if (error !== gl.NO_ERROR) {
        return
      }

      active._size = size
      if (target === gl.ELEMENT_ARRAY_BUFFER) {
        active._elements = new Uint8Array(size)
      }
    } else {
      this.setError(gl.INVALID_VALUE)
    }
  }

  bufferSubData(target, dstOffset, data, srcOffset, length = 0) {
    printStackTraceWithArgs(arguments)

    target |= 0
    dstOffset |= 0

    switch (target) {
      case gl.ARRAY_BUFFER:
      case gl.ELEMENT_ARRAY_BUFFER:
      case gl.TRANSFORM_FEEDBACK_BUFFER:
      case gl.UNIFORM_BUFFER:
      case gl.COPY_READ_BUFFER:
      case gl.COPY_WRITE_BUFFER:
      case gl.PIXEL_PACK_BUFFER:
      case gl.PIXEL_UNPACK_BUFFER:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    if (data === null) {
      return
    }

    if (!data || typeof data !== 'object') {
      this.setError(gl.INVALID_VALUE)
      return
    }

    const active = this._getActiveBuffer(target)
    if (!active) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (dstOffset < 0 || dstOffset >= active._size) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    let u8Data = null
    if (isTypedArray(data) || data instanceof DataView) {
      u8Data = unpackTypedArray(data)
    } else if (data instanceof ArrayBuffer) {
      u8Data = new Uint8Array(data)
    } else {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (arguments.length >= 3 && arguments.length <= 5) {
      srcOffset >>>= 0
      length |= 0

      if (length === 0) {
        length = data.length - srcOffset
      }

      let copyLengthBytes = length
      let srcOffsetBytes = srcOffset
      if (isTypedArray(data) || data instanceof DataView) {
        srcOffsetBytes *= data.BYTES_PER_ELEMENT
        copyLengthBytes *= data.BYTES_PER_ELEMENT
      } else {
        copyLengthBytes = data.length - srcOffset
      }

      if (dstOffset + copyLengthBytes > active._size) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      if (srcOffsetBytes < 0 || copyLengthBytes < 0 || srcOffsetBytes > u8Data.byteLength || srcOffsetBytes + copyLengthBytes > u8Data.byteLength) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      if (copyLengthBytes > 0) {
        u8Data = u8Data.subarray(srcOffsetBytes, srcOffsetBytes + copyLengthBytes)
      }
    } else {
      throw new TypeError('bufferSubData(GLenum, GLintptr, ArrayBufferView, GLintptr, GLsizei)')
    }

    if (target === gl.ELEMENT_ARRAY_BUFFER) {
      active._elements.set(u8Data, dstOffset)
    }

    super.bufferSubData(
      target,
      dstOffset,
      u8Data
    )
  }

  checkFramebufferStatus(target) {
    return gl.FRAMEBUFFER_COMPLETE
    // TODO(dat): Move these implementation to native
    printStackTraceWithArgs(arguments)

    // target must be DRAW_FRAMEBUFFER, READ_FRAMEBUFFER or FRAMEBUFFER. FRAMEBUFFER is equivalent to DRAW_FRAMEBUFFER.
    if (target !== gl.FRAMEBUFFER && target !== gl.DRAW_FRAMEBUFFER && target !== gl.READ_FRAMEBUFFER) {
      this.setError(gl.INVALID_ENUM)
      return 0
    }

    const framebuffer = (target === gl.READ_FRAMEBUFFER) ? this._readFramebuffer : this._drawFramebuffer

    // if framebuffer is null, return FRAMEBUFFER_COMPLETE
    if (!framebuffer) {
      return gl.FRAMEBUFFER_COMPLETE
    }

    // TODO: Implement the following checks

    // Returns FRAMEBUFFER_INCOMPLETE_MULTISAMPLE if the values of RENDERBUFFER_SAMPLES are different among attached renderbuffers, or are non-zero if the attached images are a mix of renderbuffers and textures.

    // Returns FRAMEBUFFER_INCOMPLETE_DIMENSIONS if attached images have different width, height, and depth (for 3D textures) or array size (for 2D array textures). See checkFramebufferStatus may return FRAMEBUFFER_INCOMPLETE_DIMENSIONS.

    // Returns FRAMEBUFFER_UNSUPPORTED if the same image is attached to more than one color attachment point.

    return this._preCheckFramebufferStatus(framebuffer)
  }

  clear(mask) {
    printStackTraceWithArgs(arguments)

    if (!this._drawFramebufferOk()) {
      return
    }
    if (this._drawFramebuffer !== null) {
      const attachments = this._drawFramebuffer._attachments
      const colorAttachments = this._getColorAttachments()
      for (let i = 0; i < colorAttachments.length; ++i) {
        const colorAttachment = attachments[colorAttachments[i]]
        if (!colorAttachment) {
          continue
        }
        if (colorAttachment._type === gl.INT ||
            colorAttachment._type === gl.UNSIGNED_INT ||
            colorAttachment._type === gl.UNSIGNED_INT_2_10_10_10_REV ||
            colorAttachment._type === gl.UNSIGNED_INT_10F_11F_11F_REV ||
            colorAttachment._type === gl.UNSIGNED_INT_5_9_9_9_REV) {
          this.setError(gl.INVALID_OPERATION)
          return
        }
      }
    }
    return super.clear(mask | 0)
  }

  clearColor(red, green, blue, alpha) {
    printStackTraceWithArgs(arguments)

    return super.clearColor(+red, +green, +blue, +alpha)
  }

  clearDepth(depth) {
    printStackTraceWithArgs(arguments)

    return super.clearDepth(+depth)
  }

  clearStencil(s) {
    printStackTraceWithArgs(arguments)

    this._checkStencil = false
    return super.clearStencil(s | 0)
  }

  colorMask(red, green, blue, alpha) {
    printStackTraceWithArgs(arguments)

    return super.colorMask(!!red, !!green, !!blue, !!alpha)
  }

  compileShader(shader) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(shader)) {
      throw new TypeError('compileShader(WebGLShader)')
    }
    if (this._checkWrapper(shader, WebGLShader) &&
      this._checkShaderSource(shader)) {
      const prevError = this.getError()
      super.compileShader(shader._ | 0)
      const error = this.getError()
      shader._compileStatus = !!super.getShaderParameter(
        shader._ | 0,
        gl.COMPILE_STATUS
      )
      shader._compileInfo = super.getShaderInfoLog(shader._ | 0)
      const postError = this.getError()
      this.setError(prevError || error)
    }
  }

  copyBufferSubData(readTarget, writeTarget, readOffset, writeOffset, size) {
    printStackTraceWithArgs(arguments)

    readTarget |= 0
    writeTarget |= 0
    readOffset |= 0
    writeOffset |= 0
    size |= 0

    switch (readTarget) {
      case gl.ARRAY_BUFFER:
      case gl.ELEMENT_ARRAY_BUFFER:
      case gl.TRANSFORM_FEEDBACK_BUFFER:
      case gl.UNIFORM_BUFFER:
      case gl.COPY_READ_BUFFER:
      case gl.COPY_WRITE_BUFFER:
      case gl.PIXEL_PACK_BUFFER:
      case gl.PIXEL_UNPACK_BUFFER:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    switch (writeTarget) {
      case gl.ARRAY_BUFFER:
      case gl.ELEMENT_ARRAY_BUFFER:
      case gl.TRANSFORM_FEEDBACK_BUFFER:
      case gl.UNIFORM_BUFFER:
      case gl.COPY_READ_BUFFER:
      case gl.COPY_WRITE_BUFFER:
      case gl.PIXEL_PACK_BUFFER:
      case gl.PIXEL_UNPACK_BUFFER:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    const readBuffer = this._getActiveBuffer(readTarget)
    if (!readBuffer) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const writeBuffer = this._getActiveBuffer(writeTarget)
    if (!writeBuffer) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if ((readBuffer._binding == gl.ELEMENT_ARRAY_BUFFER &&
      writeBuffer._binding != gl.ELEMENT_ARRAY_BUFFER) ||
      (readBuffer._binding != gl.ELEMENT_ARRAY_BUFFER &&
      writeBuffer._binding == gl.ELEMENT_ARRAY_BUFFER)) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const calculateOverlap = (readOffset, writeOffset, size) => {
      const readEnd = readOffset + size
      const writeEnd = writeOffset + size

      return (readOffset < writeEnd && writeOffset < readEnd)
    }

    if (readTarget === writeTarget &&
        calculateOverlap(readOffset, writeOffset, size)) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (readOffset < 0 || writeOffset < 0 || size < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (readOffset + size > readBuffer._size ||
      writeOffset + size > writeBuffer._size) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    super.copyBufferSubData(readTarget, writeTarget, readOffset, writeOffset, size)
  }

  copyTexImage2D(
    target,
    level,
    internalFormat,
    x, y, width, height,
    border
  ) {
    printStackTraceWithArgs(arguments)

    target |= 0
    level |= 0
    internalFormat |= 0
    x |= 0
    y |= 0
    width |= 0
    height |= 0
    border |= 0

    const texture = this._getTexImage(target)
    if (!texture) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (internalFormat !== gl.RGBA &&
      internalFormat !== gl.RGB &&
      internalFormat !== gl.ALPHA &&
      internalFormat !== gl.LUMINANCE &&
      internalFormat !== gl.LUMINANCE_ALPHA) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (level < 0 || width < 0 || height < 0 || border !== 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (level > 0 && !(bits.isPow2(width) && bits.isPow2(height))) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    this._saveError()
    super.copyTexImage2D(
      target,
      level,
      internalFormat,
      x,
      y,
      width,
      height,
      border
    )
    const error = this.getError()
    this._restoreError(error)

    if (error === gl.NO_ERROR) {
      texture._levelWidth[level] = width
      texture._levelHeight[level] = height
      texture._format = gl.RGBA
      texture._type = gl.UNSIGNED_BYTE
    }
  }

  copyTexSubImage2D(
    target,
    level,
    xoffset, yoffset,
    x, y, width, height
  ) {
    target |= 0
    level |= 0
    xoffset |= 0
    yoffset |= 0
    x |= 0
    y |= 0
    width |= 0
    height |= 0

    const texture = this._getTexImage(target)
    if (!texture) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (width < 0 || height < 0 || xoffset < 0 || yoffset < 0 || level < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    super.copyTexSubImage2D(
      target,
      level,
      xoffset,
      yoffset,
      x,
      y,
      width,
      height
    )
  }

  copyTexSubImage3D(
    target,
    level,
    xoffset, yoffset, zoffset,
    x, y, width, height
  ) {
    target |= 0
    level |= 0
    xoffset |= 0
    yoffset |= 0
    x |= 0
    y |= 0
    width |= 0
    height |= 0

    const texture = this._getTexImage(target)
    if (!texture) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (width < 0 || height < 0 || xoffset < 0 || yoffset < 0 || zoffset < 0 || level < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    super.copyTexSubImage3D(
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      x,
      y,
      width,
      height
    )
  }

  cullFace(mode) {
    printStackTraceWithArgs(arguments)

    return super.cullFace(mode | 0)
  }

  createShader(type) {
    printStackTraceWithArgs(arguments)

    type |= 0
    if (type !== gl.FRAGMENT_SHADER &&
      type !== gl.VERTEX_SHADER) {
      this.setError(gl.INVALID_ENUM)
      return null
    }
    const id = super.createShader(type)
    if (id < 0) {
      return null
    }
    const result = new WebGLShader(id, this, type)
    this._shaders[id] = result
    return result
  }

  deleteProgram(object) {
    printStackTraceWithArgs(arguments)

    return this._deleteLinkable('deleteProgram', object, WebGLProgram)
  }

  deleteShader(object) {
    printStackTraceWithArgs(arguments)

    return this._deleteLinkable('deleteShader', object, WebGLShader)
  }

  _deleteLinkable(name, object, Type) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(object)) {
      throw new TypeError(`${name}(${Type.name})`)
    }
    if (object instanceof Type &&
      this._checkOwns(object)) {
      object._pendingDelete = true
      object._checkDelete()
      return
    }
    this.setError(gl.INVALID_OPERATION)
  }

  deleteBuffer(buffer) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(buffer) ||
      (buffer !== null && !(buffer instanceof WebGLBuffer))) {
      throw new TypeError('deleteBuffer(WebGLBuffer)')
    }

    if (!(buffer instanceof WebGLBuffer &&
      this._checkOwns(buffer))) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (this._bufferContextState.getBuffer(gl.COPY_READ_BUFFER) === buffer) {
      this.bindBuffer(gl.COPY_READ_BUFFER, null)
    }
    if (this._bufferContextState.getBuffer(gl.COPY_WRITE_BUFFER) === buffer) {
      this.bindBuffer(gl.COPY_WRITE_BUFFER, null)
    }

    if (this._vertexGlobalState._arrayBufferBinding === buffer) {
      this.bindBuffer(gl.ARRAY_BUFFER, null)
    }
    if (this._vertexObjectState._elementArrayBufferBinding === buffer) {
      this.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }
    if (this._transformFeedbackGlobalState._transformFeedbackBufferBinding === buffer) {
      this.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null)
    }
    if (this._uniformBufferGlobalState._uniformBufferBinding === buffer) {
      this.bindBuffer(gl.UNIFORM_BUFFER, null)
    }
    if (this._bufferContextState.getBuffer(gl.PIXEL_PACK_BUFFER) === buffer) {
      this.bindBuffer(gl.PIXEL_PACK_BUFFER, null)
    }
    if (this._bufferContextState.getBuffer(gl.PIXEL_UNPACK_BUFFER) === buffer) {
      this.bindBuffer(gl.PIXEL_UNPACK_BUFFER, null)
    }

    if (this._vertexObjectState === this._defaultVertexObjectState) {
      // If no vertex array object is bound, release attrib bindings for the
      // array buffer.
      this._vertexObjectState.releaseArrayBuffer(buffer)
    }

    buffer._refCount -= 1
    buffer._pendingDelete = true
    buffer._checkDelete()
  }

  deleteFramebuffer(framebuffer) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(framebuffer)) {
      throw new TypeError('deleteFramebuffer(WebGLFramebuffer)')
    }

    if (!(framebuffer instanceof WebGLFramebuffer &&
      this._checkOwns(framebuffer))) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (this._drawFramebuffer === framebuffer) {
      this.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null)
    } else if (this._readFramebuffer === framebuffer) {
      this.bindFramebuffer(gl.READ_FRAMEBUFFER, null)
    }

    framebuffer._pendingDelete = true
    framebuffer._checkDelete()
  }

  // Need to handle textures and render buffers as a special case:
  // When a texture gets deleted, we need to do the following extra steps:
  //  1. Is it bound to the current texture unit?
  //     If so, then unbind it
  //  2. Is it attached to the active fbo?
  //     If so, then detach it
  //
  // For renderbuffers only need to do second step
  //
  // After this, proceed with the usual deletion algorithm
  //
  deleteRenderbuffer(renderbuffer) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(renderbuffer)) {
      throw new TypeError('deleteRenderbuffer(WebGLRenderbuffer)')
    }

    if (!(renderbuffer instanceof WebGLRenderbuffer &&
      this._checkOwns(renderbuffer))) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (this._activeRenderbuffer === renderbuffer) {
      this.bindRenderbuffer(gl.RENDERBUFFER, null)
    }

    // TODO: _activeFramebuffer -> either _drawFramebuffer or _readFramebuffer
    const activeFramebuffer = this._activeFramebuffer

    this._tryDetachFramebuffer(activeFramebuffer, renderbuffer)

    renderbuffer._pendingDelete = true
    renderbuffer._checkDelete()
  }

  deleteTexture(texture) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(texture)) {
      throw new TypeError('deleteTexture(WebGLTexture)')
    }

    if (texture instanceof WebGLTexture) {
      if (!this._checkOwns(texture)) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
    } else {
      return
    }

    // Unbind from all texture units
    const curActive = this._activeTextureUnit

    for (let i = 0; i < this._textureUnits.length; ++i) {
      const unit = this._textureUnits[i]
      if (unit._bind2D === texture) {
        this.activeTexture(gl.TEXTURE0 + i)
        this.bindTexture(gl.TEXTURE_2D, null)
      } else if (unit._bind3D === texture) {
        this.activeTexture(gl.TEXTURE0 + i)
        this.bindTexture(gl.TEXTURE_3D, null)
      } else if (unit._bindCube === texture) {
        this.activeTexture(gl.TEXTURE0 + i)
        this.bindTexture(gl.TEXTURE_CUBE_MAP, null)
      }
    }
    this.activeTexture(gl.TEXTURE0 + curActive)

    // FIXME: Does the texture get unbound from *all* framebuffers, or just the
    // active FBO?
    // TODO: _activeFramebuffer -> either _drawFramebuffer or _readFramebuffer
    const ctx = this
    const activeFramebuffer = this._activeFramebuffer
    function tryDetach(framebuffer) {
      if (framebuffer && framebuffer._linked(texture)) {
        const attachments = ctx._getAttachments()
        for (let i = 0; i < attachments.length; ++i) {
          const attachment = attachments[i]
          if (framebuffer._attachments[attachment] === texture) {
            ctx.framebufferTexture2D(
              gl.FRAMEBUFFER,
              attachment,
              gl.TEXTURE_2D,
              null
            )
          }
        }
      }
    }

    tryDetach(activeFramebuffer)

    // Mark texture for deletion
    texture._pendingDelete = true
    texture._checkDelete()
  }

  deleteTransformFeedback(transformFeedback) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(transformFeedback)) {
      throw new TypeError('deleteTransformFeedback(WebGLTransformFeedback)')
    }

    if (!(transformFeedback instanceof WebGLTransformFeedback &&
      this._checkOwns(transformFeedback))) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    super.deleteTransformFeedback(transformFeedback._ | 0)

    this._transformFeedbackGlobalState.removeTransformFeedback(transformFeedback)
  }

  depthFunc(func) {
    printStackTraceWithArgs(arguments)

    func |= 0
    switch (func) {
      case gl.NEVER:
      case gl.LESS:
      case gl.EQUAL:
      case gl.LEQUAL:
      case gl.GREATER:
      case gl.NOTEQUAL:
      case gl.GEQUAL:
      case gl.ALWAYS:
        return super.depthFunc(func)
      default:
        this.setError(gl.INVALID_ENUM)
    }
  }

  depthMask(flag) {
    printStackTraceWithArgs(arguments)

    return super.depthMask(!!flag)
  }

  depthRange(zNear, zFar) {
    printStackTraceWithArgs(arguments)

    zNear = +zNear
    zFar = +zFar
    if (zNear <= zFar) {
      return super.depthRange(zNear, zFar)
    }
    this.setError(gl.INVALID_OPERATION)
  }

  destroy() {
    printStackTraceWithArgs(arguments)

    super.destroy()
  }

  detachShader(program, shader) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program) ||
      !checkObject(shader)) {
      throw new TypeError('detachShader(WebGLProgram, WebGLShader)')
    }
    if (this._checkWrapper(program, WebGLProgram) &&
      this._checkWrapper(shader, WebGLShader)) {
      if (program._linked(shader)) {
        super.detachShader(program._, shader._)
        program._unlink(shader)
      } else {
        this.setError(gl.INVALID_OPERATION)
      }
    }
  }

  disable(cap) {
    printStackTraceWithArgs(arguments)

    // Explicitly check cap, since Desktop GL allows other values
    switch (cap) {
      case gl.BLEND:
      case gl.CULL_FACE:
      case gl.DEPTH_TEST:
      case gl.DITHER:
      case gl.POLYGON_OFFSET_FILL:
      case gl.RASTERIZER_DISCARD:
      case gl.SAMPLE_ALPHA_TO_COVERAGE:
      case gl.SAMPLE_COVERAGE:
      case gl.SCISSOR_TEST:
      case gl.STENCIL_TEST:
        break
      default:
        this.setError(gl.INVALID_ENUM)
    }

    cap |= 0
    super.disable(cap)
    if (cap === gl.TEXTURE_2D ||
      cap === gl.TEXTURE_CUBE_MAP) {
      const active = this._getActiveTextureUnit()
      if (active._mode === cap) {
        active._mode = 0
      }
    }
  }

  disableVertexAttribArray(index) {
    printStackTraceWithArgs(arguments)

    index |= 0
    if (index < 0 || index >= this._vertexObjectState._attribs.length) {
      this.setError(gl.INVALID_VALUE)
      return
    }
    super.disableVertexAttribArray(index)
    this._vertexObjectState._attribs[index]._isPointer = false
  }

  drawArrays(mode, first, count) {
    printStackTraceWithArgs(arguments)

    mode |= 0
    first |= 0
    count |= 0

    if (first < 0 || count < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (this.getParameter(gl.CURRENT_PROGRAM) === null) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (!this._checkStencilState()) {
      return
    }

    const reducedCount = vertexCount(mode, count)
    if (reducedCount < 0) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (!this._drawFramebufferOk()) {
      return
    }

    if (count === 0) {
      return
    }

    let maxIndex = first
    if (count > 0) {
      maxIndex = (count + first - 1) >>> 0
    }

    if (this._checkVertexAttribState(maxIndex)) {
      if (
        this._vertexObjectState._attribs[0]._isPointer || (
          this._multipleRenderTargets &&
          this._multipleRenderTargets._buffersState &&
          this._multipleRenderTargets._buffersState.length > 0
        )
      ) {
        return super.drawArrays(mode, first, reducedCount)
      } else if (this._vertexGlobalState._attribs[maxIndex]._data) {
        // Used for drawing without bound vertex array
        return super.drawArrays(mode, first, reducedCount)
      }
    }
  }

  drawElementsNotUsedWeAreCallingDirectlyIntoSuper(mode, count, type, ioffset) {
    printStackTraceWithArgs(arguments)

    mode |= 0
    count |= 0
    type |= 0
    ioffset |= 0

    if (count < 0 || ioffset < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (this.getParameter(gl.CURRENT_PROGRAM) === null) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (isDebugMode && !this._checkStencilState()) {
      return
    }

    const elementBuffer = this._vertexObjectState._elementArrayBufferBinding
    if (!elementBuffer) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // Unpack element data
    let elementData = null
    let offset = ioffset
    if (type === gl.UNSIGNED_SHORT) {
      if (offset % 2) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
      offset >>= 1
      elementData = new Uint16Array(elementBuffer._elements.buffer)
    } else if (type === gl.UNSIGNED_INT) {
      if (offset % 4) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
      offset >>= 2
      elementData = new Uint32Array(elementBuffer._elements.buffer)
    } else if (type === gl.UNSIGNED_BYTE) {
      elementData = elementBuffer._elements
    } else {
      this.setError(gl.INVALID_ENUM)
      return
    }

    let reducedCount = count
    switch (mode) {
      case gl.TRIANGLES:
        if (count % 3) {
          reducedCount -= (count % 3)
        }
        break
      case gl.LINES:
        if (count % 2) {
          reducedCount -= (count % 2)
        }
        break
      case gl.POINTS:
        break
      case gl.LINE_LOOP:
      case gl.LINE_STRIP:
        if (count < 2) {
          this.setError(gl.INVALID_OPERATION)
          return
        }
        break
      case gl.TRIANGLE_FAN:
      case gl.TRIANGLE_STRIP:
        if (count < 3) {
          this.setError(gl.INVALID_OPERATION)
          return
        }
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    if (!this._drawFramebufferOk()) {
      return
    }

    if (count === 0) {
      this._checkVertexAttribState(0)
      return
    }

    if ((count + offset) >>> 0 > elementData.length) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // Compute max index
    let maxIndex = -1
    for (let i = offset; i < offset + count; ++i) {
      maxIndex = Math.max(maxIndex, elementData[i])
    }

    if (maxIndex < 0) {
      this._checkVertexAttribState(0)
      return
    }

    if (this._checkVertexAttribState(maxIndex)) {
      if (reducedCount > 0) {
        if (
          this._vertexObjectState._attribs[0]._isPointer || (
            this._multipleRenderTargets &&
            this._multipleRenderTargets._buffersState &&
            this._multipleRenderTargets._buffersState.length > 0
          )
        ) {
          this._saveError()
          super.drawElements(mode, reducedCount, type, ioffset)
          this._restoreError(this.getError())
        }
      }
    }
  }

  drawRangeElements(mode, start, end, count, type, ioffset) {
    printStackTraceWithArgs(arguments)

    mode |= 0
    start |= 0
    end |= 0
    count |= 0
    type |= 0
    ioffset |= 0

    if (count < 0 || ioffset < 0 || start < 0 || end < 0 || start > end) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (this.getParameter(gl.CURRENT_PROGRAM) === null) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const elementBuffer = this._vertexObjectState._elementArrayBufferBinding
    if (!elementBuffer) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // Unpack element data
    let elementData = null
    let offset = ioffset
    if (type === gl.UNSIGNED_SHORT) {
      if (offset % 2) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
      offset >>= 1
      elementData = new Uint16Array(elementBuffer._elements.buffer)
    } else if (type === gl.UNSIGNED_INT) {
      if (offset % 4) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
      offset >>= 2
      elementData = new Uint32Array(elementBuffer._elements.buffer)
    } else if (type === gl.UNSIGNED_BYTE) {
      elementData = elementBuffer._elements
    } else {
      this.setError(gl.INVALID_ENUM)
      return
    }

    let reducedCount = count
    switch (mode) {
      case gl.TRIANGLES:
        if (count % 3) {
          reducedCount -= (count % 3)
        }
        break
      case gl.LINES:
        if (count % 2) {
          reducedCount -= (count % 2)
        }
        break
      case gl.POINTS:
        break
      case gl.LINE_LOOP:
      case gl.LINE_STRIP:
        if (count < 2) {
          this.setError(gl.INVALID_OPERATION)
          return
        }
        break
      case gl.TRIANGLE_FAN:
      case gl.TRIANGLE_STRIP:
        if (count < 3) {
          this.setError(gl.INVALID_OPERATION)
          return
        }
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    if (!this._drawFramebufferOk()) {
      return
    }

    if (count === 0) {
      this._checkVertexAttribState(0)
      return
    }

    if ((count + offset) >>> 0 > elementData.length) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // Compute max index
    let maxIndex = -1
    for (let i = offset; i < offset + count; ++i) {
      maxIndex = Math.max(maxIndex, elementData[i])
    }

    if (maxIndex < 0) {
      this._checkVertexAttribState(0)
      return
    }

    if (this._checkVertexAttribState(maxIndex)) {
      if (reducedCount > 0) {
        if (
          this._vertexObjectState._attribs[0]._isPointer || (
            this._multipleRenderTargets._buffersState &&
            this._multipleRenderTargets._buffersState.length > 0
          )
        ) {
          return super.drawRangeElements(mode, start, end, reducedCount, type, ioffset)
        }
      }
    }
  }

  enable(cap) {
    printStackTraceWithArgs(arguments)

    // Explicitly check cap, since Desktop GL allows other values
    switch (cap) {
      case gl.BLEND:
      case gl.CULL_FACE:
      case gl.DEPTH_TEST:
      case gl.DITHER:
      case gl.POLYGON_OFFSET_FILL:
      case gl.RASTERIZER_DISCARD:
      case gl.SAMPLE_ALPHA_TO_COVERAGE:
      case gl.SAMPLE_COVERAGE:
      case gl.SCISSOR_TEST:
      case gl.STENCIL_TEST:
        break
      default:
        this.setError(gl.INVALID_ENUM)
    }

    cap |= 0
    super.enable(cap)
  }

  enableVertexAttribArray(index) {
    printStackTraceWithArgs(arguments)

    index |= 0
    if (index < 0 || index >= this._vertexObjectState._attribs.length) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    super.enableVertexAttribArray(index)

    this._vertexObjectState._attribs[index]._isPointer = true
  }

  endTransformFeedback() {
    printStackTraceWithArgs(arguments)

    if (!this._transformFeedbackGlobalState._activeTransformFeedback) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    super.endTransformFeedback()

    if (this.getError() === gl.NO_ERROR) {
      this._transformFeedbackGlobalState._activeTransformFeedback = false
      this._transformFeedbackGlobalState._activePrimitiveInfo = null
    }
  }

  finish() {
    printStackTraceWithArgs(arguments)

    return super.finish()
  }

  flush() {
    printStackTraceWithArgs(arguments)

    return super.flush()
  }

  framebufferRenderbuffer(
    target,
    attachment,
    renderbufferTarget,
    renderbuffer
  ) {
    printStackTraceWithArgs(arguments)

    target |= 0
    attachment |= 0
    renderbufferTarget |= 0

    if (!checkObject(renderbuffer)) {
      throw new TypeError('framebufferRenderbuffer(GLenum, GLenum, GLenum, WebGLRenderbuffer)')
    }

    if ((target !== gl.FRAMEBUFFER && target !== gl.DRAW_FRAMEBUFFER && target !== gl.READ_FRAMEBUFFER) ||
      !this._validFramebufferAttachment(attachment) ||
      renderbufferTarget !== gl.RENDERBUFFER) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    // Check a framebuffer is actually bound
    let framebuffer = null
    if (target === gl.FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.DRAW_FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.READ_FRAMEBUFFER) {
      framebuffer = this._readFramebuffer
    }

    if (!framebuffer) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // detach from attachment point if renderbuffer is null
    if (!renderbuffer) {
      if (attachment === gl.DEPTH_STENCIL_ATTACHMENT) {
        framebuffer._setAttachment(null, gl.DEPTH_ATTACHMENT)
        framebuffer._setAttachment(null, gl.STENCIL_ATTACHMENT)
      } else {
        framebuffer._setAttachment(null, attachment)
      }
      this._updateFramebufferAttachments(framebuffer)
      return
    }

    if (!this._checkWrapper(renderbuffer, WebGLRenderbuffer)) {
      return
    }

    if (attachment === gl.DEPTH_STENCIL_ATTACHMENT) {
      framebuffer._setAttachment(renderbuffer, gl.DEPTH_ATTACHMENT)
      framebuffer._setAttachment(renderbuffer, gl.STENCIL_ATTACHMENT)
    } else {
      framebuffer._setAttachment(renderbuffer, attachment)
    }
    this._updateFramebufferAttachments(framebuffer)
  }

  framebufferTexture2D(
    target,
    attachment,
    textarget,
    texture,
    level
  ) {
    printStackTraceWithArgs(arguments)

    target |= 0
    attachment |= 0
    textarget |= 0
    level |= 0
    if (!checkObject(texture)) {
      throw new TypeError('framebufferTexture2D(GLenum, GLenum, GLenum, WebGLTexture, GLint)')
    }

    // Check parameters are ok
    if ((target !== gl.FRAMEBUFFER && target !== gl.DRAW_FRAMEBUFFER && target !== gl.READ_FRAMEBUFFER) ||
      !this._validFramebufferAttachment(attachment)) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    // Check a framebuffer is actually bound
    let framebuffer = null
    if (target === gl.FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.DRAW_FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.READ_FRAMEBUFFER) {
      framebuffer = this._readFramebuffer
    }

    if (!framebuffer) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // detach from attachment point if texture is 0
    if (!texture) {
      if (attachment === gl.DEPTH_STENCIL_ATTACHMENT) {
        framebuffer._attachmentLevel[gl.DEPTH_ATTACHMENT] = 0
        framebuffer._attachmentLevel[gl.STENCIL_ATTACHMENT] = 0
        framebuffer._attachmentFace[gl.DEPTH_ATTACHMENT] = 0
        framebuffer._attachmentFace[gl.STENCIL_ATTACHMENT] = 0
        framebuffer._setAttachment(null, gl.DEPTH_ATTACHMENT)
        framebuffer._setAttachment(null, gl.STENCIL_ATTACHMENT)
      } else {
        framebuffer._attachmentLevel[attachment] = 0
        framebuffer._attachmentFace[attachment] = 0
        framebuffer._setAttachment(null, attachment)
      }
      this._updateFramebufferAttachments(framebuffer)
      return
    }

    // Check object ownership
    if (!this._checkWrapper(texture, WebGLTexture)) {
      return
    }

    // Check texture target is ok
    if (textarget === gl.TEXTURE_2D) {
      if (texture._binding !== gl.TEXTURE_2D) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
      // Level must be greater than or equal to zero and no larger than log2 of the value of
      // MAX_TEXTURE_SIZE.
      if (level < 0 || level > Math.log2(this.getParameter(gl.MAX_TEXTURE_SIZE))) {
        this.setError(gl.INVALID_VALUE)
        return
      }
    } else if (this._validCubeTarget(textarget)) {
      if (texture._binding !== gl.TEXTURE_CUBE_MAP) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
      // Level must be greater than or equal to zero and less than or equal to log2 of the value
      // of MAX_CUBE_MAP_TEXTURE_SIZE
      if (level < 0 || level > Math.log2(this.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE))) {
        this.setError(gl.INVALID_VALUE)
        return
      }
    } else {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (attachment === gl.DEPTH_STENCIL_ATTACHMENT) {
      framebuffer._attachmentLevel[gl.DEPTH_ATTACHMENT] = level
      framebuffer._attachmentLevel[gl.STENCIL_ATTACHMENT] = level
      framebuffer._attachmentFace[gl.DEPTH_ATTACHMENT] = textarget
      framebuffer._attachmentFace[gl.STENCIL_ATTACHMENT] = textarget
      framebuffer._setAttachment(texture, gl.DEPTH_ATTACHMENT)
      framebuffer._setAttachment(texture, gl.STENCIL_ATTACHMENT)
    } else {
      framebuffer._attachmentLevel[attachment] = level
      framebuffer._attachmentFace[attachment] = textarget
      framebuffer._setAttachment(texture, attachment)
    }
    this._updateFramebufferAttachments(framebuffer)
  }

  framebufferTextureLayer(
    target,
    attachment,
    texture,
    level,
    layer
  ) {
    printStackTraceWithArgs(arguments)

    target |= 0
    attachment |= 0
    level |= 0
    layer |= 0

    if (!checkObject(texture)) {
      throw new TypeError('framebufferTexture2D(GLenum, GLenum, GLenum, WebGLTexture, GLint)')
    }

    // Check parameters are ok
    if ((target !== gl.FRAMEBUFFER && target !== gl.DRAW_FRAMEBUFFER && target !== gl.READ_FRAMEBUFFER) ||
      !this._validFramebufferAttachment(attachment)) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (level < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    // Check object ownership
    if (texture && !this._checkWrapper(texture, WebGLTexture)) {
      return
    }

    switch (texture._binding) {
      case gl.TEXTURE_2D:
        if (layer > gl.MAX_ARRAY_TEXTURE_LAYERS - 1) {
          this.setError(gl.INVALID_VALUE)
          return
        }
        break
      case gl.TEXTURE_3D:
        if (layer > gl.MAX_3D_TEXTURE_SIZE - 1) {
          this.setError(gl.INVALID_VALUE)
          return
        }
        break
      case gl.TEXTURE_CUBE_MAP:
      case gl.TEXTURE_2D_ARRAY:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    // TODO((divya) implement these checks
    // If texture is a three-dimensional texture, then level must be greater than or equal
    // to zero and less than or equal to log2 of the value of MAX_3D_TEXTURE_SIZE. If
    // texture is a two-dimensional array texture, then level must be greater than or equal
    // to zero and no larger than log2 of the value of MAX_TEXTURE_SIZE. Otherwise,
    // an INVALID_VALUE error is generated.

    // Check a framebuffer is actually bound
    let framebuffer = null
    if (target === gl.FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.DRAW_FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.READ_FRAMEBUFFER) {
      framebuffer = this._readFramebuffer
    }

    if (!framebuffer) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    framebuffer._attachmentLayer[attachment] = layer
    framebuffer._setAttachment(texture, attachment)

    this._updateFramebufferAttachments(framebuffer)
  }

  invalidateFramebuffer(
    target,
    attachments
  ) {
    printStackTraceWithArgs(arguments)

    target |= 0

    // Check parameters are ok
    if (target !== gl.FRAMEBUFFER && target !== gl.DRAW_FRAMEBUFFER && target !== gl.READ_FRAMEBUFFER) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    // check all attachments are valid
    for (let i = 0; i < attachments.length; i++) {
      if (!this._validFramebufferAttachment(attachments[i])) {
        this.setError(gl.INVALID_ENUM)
        return
      }
    }

    // Check a framebuffer is actually bound
    let framebuffer = null
    if (target === gl.FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.DRAW_FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.READ_FRAMEBUFFER) {
      framebuffer = this._readFramebuffer
    }

    if (!framebuffer) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // TODO implement this check
    // An INVALID_ENUM error is generated if the default framebuffer is bound
    // to target and any elements of attachments are not one of
    // • COLOR, identifying the color buffer
    // • DEPTH, identifying the depth buffer
    // • STENCIL, identifying the stencil buffer.

    super.invalidateFramebuffer(target, attachments)
  }

  invalidateSubFramebuffer(
    target,
    attachments,
    x,
    y,
    width,
    height
  ) {
    printStackTraceWithArgs(arguments)

    target |= 0
    x |= 0
    y |= 0
    width |= 0
    height |= 0

    // Check parameters are ok
    if (target !== gl.FRAMEBUFFER && target !== gl.DRAW_FRAMEBUFFER && target !== gl.READ_FRAMEBUFFER) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (width < 0 || height < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    // check all attachments are valid
    for (let i = 0; i < attachments.length; i++) {
      if (!this._validFramebufferAttachment(attachments[i])) {
        this.setError(gl.INVALID_ENUM)
        return
      }
    }

    // Check a framebuffer is actually bound
    let framebuffer = null
    if (target === gl.FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.DRAW_FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.READ_FRAMEBUFFER) {
      framebuffer = this._readFramebuffer
    }

    if (!framebuffer) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // TODO implement this check
    // An INVALID_ENUM error is generated if the default framebuffer is bound
    // to target and any elements of attachments are not one of
    // • COLOR, identifying the color buffer
    // • DEPTH, identifying the depth buffer
    // • STENCIL, identifying the stencil buffer.

    super.invalidateSubFramebuffer(target, attachments, x, y, width, height)
  }

  frontFace(mode) {
    printStackTraceWithArgs(arguments)

    return super.frontFace(mode | 0)
  }

  generateMipmap(target) {
    printStackTraceWithArgs(arguments)

    const texture = this._getTexImage(target)
    if (!this._extensions.oes_texture_float_linear && texture && texture._type === gl.FLOAT) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    return super.generateMipmap(target | 0) | 0
  }

  getActiveAttrib(program, index) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program)) {
      throw new TypeError('getActiveAttrib(WebGLProgram)')
    } else if (!program) {
      this.setError(gl.INVALID_VALUE)
    } else if (this._checkWrapper(program, WebGLProgram)) {
      const info = super.getActiveAttrib(program._ | 0, index | 0)
      if (info) {
        return new WebGLActiveInfo(info)
      }
    }
    return null
  }

  getActiveUniform(program, index) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program)) {
      throw new TypeError('getActiveUniform(WebGLProgram, GLint)')
    } else if (!program) {
      this.setError(gl.INVALID_VALUE)
    } else if (this._checkWrapper(program, WebGLProgram)) {
      const info = super.getActiveUniform(program._ | 0, index | 0)
      if (info) {
        return new WebGLActiveInfo(info)
      }
    }
    return null
  }

  getActiveUniformBlockParameter(program, uniformBlockIndex, pname) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program)) {
      throw new TypeError('getActiveUniformBlockParameter(WebGLProgram, GLuint, GLenum)')
    }

    switch (pname) {
      case gl.UNIFORM_BLOCK_DATA_SIZE:
      case gl.UNIFORM_BLOCK_ACTIVE_UNIFORMS:
      case gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES:
      case gl.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER:
      case gl.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return null
    }

    if (!program) {
      this.setError(gl.INVALID_VALUE)
    } else if (this._checkWrapper(program, WebGLProgram)) {
      const result = super.getActiveUniformBlockParameter(program._ | 0, uniformBlockIndex | 0, pname | 0)
      if (result) {
        return result
      }
    }
    return null
  }

  getActiveUniforms(program, uniformIndices, pname) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program) ||
      !checkObject(uniformIndices)) {
      throw new TypeError('getActiveUniforms(WebGLProgram, Uint32Array, GLenum)')
    }

    switch (pname) {
      case gl.UNIFORM_TYPE:
      case gl.UNIFORM_SIZE:
      case gl.UNIFORM_BLOCK_INDEX:
      case gl.UNIFORM_OFFSET:
      case gl.UNIFORM_ARRAY_STRIDE:
      case gl.UNIFORM_MATRIX_STRIDE:
      case gl.UNIFORM_IS_ROW_MAJOR:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return null
    }

    if (!program) {
      this.setError(gl.INVALID_VALUE)
    } else if (this._checkWrapper(program, WebGLProgram)) {
      const result = super.getActiveUniforms(program._ | 0, uniformIndices, pname | 0)
      if (result) {
        return result
      }
    }
    return null
  }

  getAttachedShaders(program) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program) ||
      (typeof program === 'object' &&
        program !== null &&
        !(program instanceof WebGLProgram))) {
      throw new TypeError('getAttachedShaders(WebGLProgram)')
    }
    if (!program) {
      this.setError(gl.INVALID_VALUE)
    } else if (this._checkWrapper(program, WebGLProgram)) {
      const shaderArray = super.getAttachedShaders(program._ | 0)
      if (!shaderArray) {
        return null
      }
      const unboxedShaders = new Array(shaderArray.length)
      for (let i = 0; i < shaderArray.length; ++i) {
        unboxedShaders[i] = this._shaders[shaderArray[i]]
      }
      return unboxedShaders
    }
    return null
  }

  getAttribLocation(program, name) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program)) {
      throw new TypeError('getAttribLocation(WebGLProgram, String)')
    }
    name += ''
    if (!isValidString(name) || name.length > MAX_ATTRIBUTE_LENGTH) {
      this.setError(gl.INVALID_VALUE)
    } else if (this._checkWrapper(program, WebGLProgram)) {
      return super.getAttribLocation(program._ | 0, `${name}`)
    }
    return -1
  }

  getParameter(pname) {
    printStackTraceWithArgs(arguments)

    pname |= 0
    switch (pname) {
      case gl.ARRAY_BUFFER_BINDING:
        return this._vertexGlobalState._arrayBufferBinding
      case gl.ELEMENT_ARRAY_BUFFER_BINDING:
        return this._vertexObjectState._elementArrayBufferBinding
      case gl.CURRENT_PROGRAM:
        return this._activeProgram
      case gl.RENDERBUFFER_BINDING:
        return this._activeRenderbuffer
      case gl.TEXTURE_BINDING_2D:
        return this._getActiveTextureUnit()._bind2D
      case gl.TEXTURE_BINDING_2D_ARRAY:
        return this._getActiveTextureUnit()._bind2DArray
      case gl.TEXTURE_BINDING_3D:
        return this._getActiveTextureUnit()._bind3D
      case gl.TEXTURE_BINDING_CUBE_MAP:
        return this._getActiveTextureUnit()._bindCube
      case gl.VERSION:
        return `WebGL 2.0 stack-gl ${HEADLESS_VERSION}`
      case gl.VENDOR:
        return 'stack-gl'
      case gl.SHADING_LANGUAGE_VERSION:
        return 'WebGL GLSL ES 3.00 stack-gl'
      case gl.MAX_CLIENT_WAIT_TIMEOUT_WEBGL:
        return 1000  // Timeout in milliseconds

      case gl.COMPRESSED_TEXTURE_FORMATS:
        const supportedTextureFormats = []

        let ext = this._extensions.webgl_compressed_texture_s3tc_srgb
        if (ext) {
          supportedTextureFormats.push(
            ext.COMPRESSED_SRGB_S3TC_DXT1_EXT,
            ext.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
            ext.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
            ext.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
          )
        }

        ext = this._extensions.webgl_compressed_texture_s3tc
        if (ext) {
          supportedTextureFormats.push(
            ext.COMPRESSED_RGB_S3TC_DXT1_EXT,
            ext.COMPRESSED_RGBA_S3TC_DXT1_EXT,
            ext.COMPRESSED_RGBA_S3TC_DXT3_EXT,
            ext.COMPRESSED_RGBA_S3TC_DXT5_EXT
          )
        }

        ext = this._extensions.ext_texture_compression_rgtc
        if (ext) {
          supportedTextureFormats.push(
            ext.COMPRESSED_RED_RGTC1_EXT,
            ext.COMPRESSED_SIGNED_RED_RGTC1_EXT,
            ext.COMPRESSED_RED_GREEN_RGTC2_EXT,
            ext.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT
          )
        }

        ext = this._extensions.ext_texture_compression_bptc
        if (ext) {
          supportedTextureFormats.push(
            ext.COMPRESSED_RGBA_BPTC_UNORM_EXT,
            ext.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT,
            ext.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT,
            ext.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT
          )
        }

        ext = this._extensions.webgl_compressed_texture_astc
        if (ext) {
          supportedTextureFormats.push(
            ext.COMPRESSED_RGBA_ASTC_4x4_KHR,
            ext.COMPRESSED_RGBA_ASTC_5x4_KHR,
            ext.COMPRESSED_RGBA_ASTC_5x5_KHR,
            ext.COMPRESSED_RGBA_ASTC_6x5_KHR,
            ext.COMPRESSED_RGBA_ASTC_6x6_KHR,
            ext.COMPRESSED_RGBA_ASTC_8x5_KHR,
            ext.COMPRESSED_RGBA_ASTC_8x6_KHR,
            ext.COMPRESSED_RGBA_ASTC_8x8_KHR,
            ext.COMPRESSED_RGBA_ASTC_10x5_KHR,
            ext.COMPRESSED_RGBA_ASTC_10x6_KHR,
            ext.COMPRESSED_RGBA_ASTC_10x8_KHR,
            ext.COMPRESSED_RGBA_ASTC_10x10_KHR,
            ext.COMPRESSED_RGBA_ASTC_12x10_KHR,
            ext.COMPRESSED_RGBA_ASTC_12x12_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR,
            ext.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
          )
        }

        ext = this._extensions.webgl_compressed_texture_pvrtc
        if (ext) {
          supportedTextureFormats.push(
            ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
            ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
            ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
            ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
          )
        }

        return new Uint32Array(supportedTextureFormats)

      // Int arrays
      case gl.MAX_VIEWPORT_DIMS:
      case gl.SCISSOR_BOX:
      case gl.VIEWPORT:
        return new Int32Array(super.getParameter(pname))

      // Float arrays
      case gl.ALIASED_LINE_WIDTH_RANGE:
      case gl.ALIASED_POINT_SIZE_RANGE:
      case gl.DEPTH_RANGE:
      case gl.BLEND_COLOR:
      case gl.COLOR_CLEAR_VALUE:
        return new Float32Array(super.getParameter(pname))

      case gl.COLOR_WRITEMASK:
        return super.getParameter(pname)

      case gl.DEPTH_CLEAR_VALUE:
      case gl.LINE_WIDTH:
      case gl.POLYGON_OFFSET_FACTOR:
      case gl.POLYGON_OFFSET_UNITS:
      case gl.SAMPLE_COVERAGE_VALUE:
        return +super.getParameter(pname)

      case gl.BLEND:
      case gl.CULL_FACE:
      case gl.DEPTH_TEST:
      case gl.DEPTH_WRITEMASK:
      case gl.DITHER:
      case gl.POLYGON_OFFSET_FILL:
      case gl.SAMPLE_COVERAGE_INVERT:
      case gl.SCISSOR_TEST:
      case gl.STENCIL_TEST:
      case gl.UNPACK_FLIP_Y_WEBGL:
      case gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL:
        return !!super.getParameter(pname)

      case gl.ACTIVE_TEXTURE:
      case gl.ALPHA_BITS:
      case gl.BLEND_DST_ALPHA:
      case gl.BLEND_DST_RGB:
      case gl.BLEND_EQUATION_ALPHA:
      case gl.BLEND_EQUATION_RGB:
      case gl.BLEND_SRC_ALPHA:
      case gl.BLEND_SRC_RGB:
      case gl.BLUE_BITS:
      case gl.CULL_FACE_MODE:
      case gl.DEPTH_BITS:
      case gl.DEPTH_FUNC:
      case gl.FRONT_FACE:
      case gl.GENERATE_MIPMAP_HINT:
      case gl.GREEN_BITS:
      case gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS:
      case gl.MAX_CUBE_MAP_TEXTURE_SIZE:
      case gl.MAX_FRAGMENT_UNIFORM_VECTORS:
      case gl.MAX_RENDERBUFFER_SIZE:
      case gl.MAX_TEXTURE_IMAGE_UNITS:
      case gl.MAX_TEXTURE_SIZE:
      case gl.MAX_VARYING_VECTORS:
      case gl.MAX_VERTEX_ATTRIBS:
      case gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS:
      case gl.MAX_VERTEX_UNIFORM_VECTORS:
      case gl.PACK_ALIGNMENT:
      case gl.RED_BITS:
      case gl.SAMPLE_BUFFERS:
      case gl.SAMPLES:
      case gl.STENCIL_BACK_FAIL:
      case gl.STENCIL_BACK_FUNC:
      case gl.STENCIL_BACK_PASS_DEPTH_FAIL:
      case gl.STENCIL_BACK_PASS_DEPTH_PASS:
      case gl.STENCIL_BACK_REF:
      case gl.STENCIL_BACK_VALUE_MASK:
      case gl.STENCIL_BACK_WRITEMASK:
      case gl.STENCIL_BITS:
      case gl.STENCIL_CLEAR_VALUE:
      case gl.STENCIL_FAIL:
      case gl.STENCIL_FUNC:
      case gl.STENCIL_PASS_DEPTH_FAIL:
      case gl.STENCIL_PASS_DEPTH_PASS:
      case gl.STENCIL_REF:
      case gl.STENCIL_VALUE_MASK:
      case gl.STENCIL_WRITEMASK:
      case gl.SUBPIXEL_BITS:
      case gl.UNPACK_ALIGNMENT:
      case gl.UNPACK_COLORSPACE_CONVERSION_WEBGL:
        return super.getParameter(pname) | 0

      case gl.IMPLEMENTATION_COLOR_READ_FORMAT:
      case gl.IMPLEMENTATION_COLOR_READ_TYPE:
      case gl.RENDERER:
        return super.getParameter(pname)

      // Add WebGL 2.0 parameters here
      case gl.UNIFORM_BUFFER_BINDING:
        return this._uniformBufferGlobalState._uniformBufferBinding
      case gl.COPY_READ_BUFFER_BINDING:
      case gl.COPY_WRITE_BUFFER_BINDING:
      case gl.PIXEL_PACK_BUFFER_BINDING:
      case gl.PIXEL_UNPACK_BUFFER_BINDING:
        return this._bufferContextState.getBufferBinding(pname)
      case gl.SAMPLER_BINDING:
        return this._samplerGlobalState._boundSamplers[this._activeTextureUnit]
      case gl.TRANSFORM_FEEDBACK_BINDING:
        return this._transformFeedbackGlobalState.getTransformFeedbackBinding()
      case gl.TRANSFORM_FEEDBACK_BUFFER_BINDING:
        return this._transformFeedbackGlobalState._transformFeedbackBufferBinding
      case gl.VERTEX_ARRAY_BINDING:
        return this._vertexArrayObject._activeVertexArrayObject
      case gl.READ_FRAMEBUFFER_BINDING:
        return this._readFramebuffer
      case gl.FRAMEBUFFER_BINDING:
      case gl.DRAW_FRAMEBUFFER_BINDING:
        return this._drawFramebuffer
      case gl.FRAGMENT_SHADER_DERIVATIVE_HINT:
      case gl.MAX_3D_TEXTURE_SIZE:
      case gl.MAX_ARRAY_TEXTURE_LAYERS:
      case gl.MAX_SAMPLES:
      case gl.MAX_COLOR_ATTACHMENTS:
      case gl.MAX_COMBINED_UNIFORM_BLOCKS:
      case gl.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS:
      case gl.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS:
      case gl.MAX_DRAW_BUFFERS:
      case gl.MAX_ELEMENT_INDEX:
      case gl.MAX_ELEMENTS_INDICES:
      case gl.MAX_ELEMENTS_VERTICES:
      case gl.MAX_FRAGMENT_INPUT_COMPONENTS:
      case gl.MAX_FRAGMENT_UNIFORM_BLOCKS:
      case gl.MAX_FRAGMENT_UNIFORM_COMPONENTS:
      case gl.MAX_PROGRAM_TEXEL_OFFSET:
      case gl.MAX_SERVER_WAIT_TIMEOUT:
      case gl.MAX_TEXTURE_LOD_BIAS:
      case gl.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS:
      case gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS:
      case gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS:
      case gl.MAX_UNIFORM_BLOCK_SIZE:
      case gl.MAX_UNIFORM_BUFFER_BINDINGS:
      case gl.MAX_VARYING_COMPONENTS:
      case gl.MAX_VERTEX_OUTPUT_COMPONENTS:
      case gl.MAX_VERTEX_UNIFORM_BLOCKS:
      case gl.MAX_VERTEX_UNIFORM_COMPONENTS:
      case gl.MIN_PROGRAM_TEXEL_OFFSET:
      case gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT:
      case gl.READ_BUFFER:
      case gl.PACK_ROW_LENGTH:
      case gl.PACK_SKIP_PIXELS:
      case gl.PACK_SKIP_ROWS:
      case gl.RASTERIZER_DISCARD:
      case gl.SAMPLE_ALPHA_TO_COVERAGE:
      case gl.SAMPLE_COVERAGE:
      case gl.TRANSFORM_FEEDBACK_ACTIVE:
      case gl.TRANSFORM_FEEDBACK_PAUSED:
      case gl.UNPACK_IMAGE_HEIGHT:
      case gl.UNPACK_ROW_LENGTH:
      case gl.UNPACK_SKIP_IMAGES:
      case gl.UNPACK_SKIP_ROWS:
      case gl.UNPACK_SKIP_PIXELS:
        return super.getParameter2(pname)
      case gl.DRAW_BUFFER0:
      case gl.DRAW_BUFFER1:
      case gl.DRAW_BUFFER2:
      case gl.DRAW_BUFFER3:
      case gl.DRAW_BUFFER4:
      case gl.DRAW_BUFFER5:
      case gl.DRAW_BUFFER6:
      case gl.DRAW_BUFFER7:
      case gl.DRAW_BUFFER8:
      case gl.DRAW_BUFFER9:
      case gl.DRAW_BUFFER10:
      case gl.DRAW_BUFFER11:
      case gl.DRAW_BUFFER12:
      case gl.DRAW_BUFFER13:
      case gl.DRAW_BUFFER14:
      case gl.DRAW_BUFFER15:
        if (this._multipleRenderTargets._buffersState.length === 1 && this._multipleRenderTargets._buffersState[0] === gl.BACK) {
          return gl.BACK
        }
        return super.getParameter2(pname)
      default:
        if (this._extensions.ext_texture_filter_anisotropic && pname === this._extensions.ext_texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT) {
          return super.getParameter(pname)
        }

        this.setError(gl.INVALID_ENUM)
        return null
    }
  }

  getShaderPrecisionFormat(
    shaderType,
    precisionType
  ) {
    printStackTraceWithArgs(arguments)

    shaderType |= 0
    precisionType |= 0

    if (!(shaderType === gl.FRAGMENT_SHADER ||
      shaderType === gl.VERTEX_SHADER) ||
      !(precisionType === gl.LOW_FLOAT ||
        precisionType === gl.MEDIUM_FLOAT ||
        precisionType === gl.HIGH_FLOAT ||
        precisionType === gl.LOW_INT ||
        precisionType === gl.MEDIUM_INT ||
        precisionType === gl.HIGH_INT)) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    const format = super.getShaderPrecisionFormat(shaderType, precisionType)
    if (!format) {
      return null
    }

    return new WebGLShaderPrecisionFormat(format)
  }

  getBufferParameter(target, pname) {
    printStackTraceWithArgs(arguments)

    target |= 0
    pname |= 0

    switch (target) {
      case gl.ARRAY_BUFFER:
      case gl.ELEMENT_ARRAY_BUFFER:
      case gl.TRANSFORM_FEEDBACK_BUFFER:
      case gl.UNIFORM_BUFFER:
      case gl.COPY_READ_BUFFER:
      case gl.COPY_WRITE_BUFFER:
      case gl.PIXEL_PACK_BUFFER:
      case gl.PIXEL_UNPACK_BUFFER:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    switch (pname) {
      case gl.BUFFER_SIZE:
      case gl.BUFFER_USAGE:
        return super.getBufferParameter(target | 0, pname | 0)
      default:
        this.setError(gl.INVALID_ENUM)
        return null
    }
  }

  getBufferSubData(target, srcByteOffset, dstBuffer, dstOffset = 0, length = 0) {
    printStackTraceWithArgs(arguments)

    target |= 0
    srcByteOffset |= 0
    dstOffset >>>= 0
    length |= 0

    const buf = this._getActiveBuffer(target)
    switch (target) {
      case gl.ARRAY_BUFFER:
      case gl.ELEMENT_ARRAY_BUFFER:
      case gl.TRANSFORM_FEEDBACK_BUFFER:
      case gl.UNIFORM_BUFFER:
      case gl.COPY_READ_BUFFER:
      case gl.COPY_WRITE_BUFFER:
      case gl.PIXEL_PACK_BUFFER:
      case gl.PIXEL_UNPACK_BUFFER:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    if (dstOffset < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    // If dstData is a DataView then dstOffset and length are interpreted in bytes,
    // otherwise dstData's element type is used.
    const isDstDataView = dstBuffer instanceof DataView

    if (!isDstDataView && !isTypedArray(dstBuffer)) {
      throw new TypeError('getBufferSubData(WebGLBuffer, GLintptr, TypedArray, GLintptr, GLsizei)')
    }

    let copyLength = length
    if (copyLength === 0) {
      copyLength = (isDstDataView)
        ? dstBuffer.byteLength - dstOffset
        : dstBuffer.length - dstOffset
    }

    const elementSize = (isDstDataView)
      ? 1
      : dstBuffer.BYTES_PER_ELEMENT

    const copyByteLength = copyLength * elementSize

    const bufferLength = isDstDataView ? dstBuffer.byteLength : dstBuffer.length
    if (dstOffset > bufferLength || dstOffset + copyLength > bufferLength) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    let returnedData
    if (copyLength > 0) {
      if (!buf) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (target === gl.TRANSFORM_FEEDBACK_BUFFER && this._transformFeedbackGlobalState._activeTransformFeedback) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (srcByteOffset < 0 || srcByteOffset + copyByteLength > buf._size) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      returnedData = new Uint8Array(copyByteLength)
      super.getBufferSubData(target, srcByteOffset, copyByteLength, returnedData)

      if (returnedData === null || dstOffset * elementSize + returnedData.length > dstBuffer.length * elementSize) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      new Uint8Array(dstBuffer.buffer).set(returnedData, dstBuffer.byteOffset + (dstOffset * elementSize))
    }
  }

  getError() {
    // In prod, we don't want to do blocking gpu calls to get the error
    if (!isDebugMode) {
      return gl.NO_ERROR
    }

    return super.getError()
  }

  getFragDataLocation(program, name) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program)) {
      throw new TypeError('getFragDataLocation(WebGLProgram, String)')
    }

    if (!this._checkOwns(program)) {
      this.setError(gl.INVALID_OPERATION)
      return -1
    }

    return super.getFragDataLocation(program._, name)
  }

  getFramebufferAttachmentParameter(target, attachment, pname) {
    printStackTraceWithArgs(arguments)

    target |= 0
    attachment |= 0
    pname |= 0

    if ((target !== gl.FRAMEBUFFER && target !== gl.DRAW_FRAMEBUFFER && target !== gl.READ_FRAMEBUFFER) ||
      !this._validFramebufferAttachment(attachment)) {
      this.setError(gl.INVALID_ENUM)
      return null
    }

    let framebuffer = null
    if (target === gl.FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.DRAW_FRAMEBUFFER) {
      framebuffer = this._drawFramebuffer
    } else if (target === gl.READ_FRAMEBUFFER) {
      framebuffer = this._readFramebuffer
    }

    if (!framebuffer) {
      this.setError(gl.INVALID_OPERATION)
      return null
    }

    // INVALID_OPERATION is generated if attachment is DEPTH_STENCIL_ATTACHMENT and different objects are bound to
    // the depth and stencil attachment points of target.
    let object = null
    if (attachment === gl.DEPTH_STENCIL_ATTACHMENT) {
      const depthAttachment = framebuffer._attachments[gl.DEPTH_ATTACHMENT]
      const stencilAttachment = framebuffer._attachments[gl.STENCIL_ATTACHMENT]
      if (depthAttachment === stencilAttachment) {
        object = depthAttachment
      } else {
        this.setError(gl.INVALID_OPERATION)
        return null
      }
    } else {
      object = framebuffer._attachments[attachment]
    }

    if (object === null) {
      if (pname === gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE) {
        return gl.NONE
      } else if (pname === gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME) {
        return null
      }
    } else if (object instanceof WebGLTexture) {
      switch (pname) {
        case gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME:
          return object
        case gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE:
          return gl.TEXTURE
        case gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL:
          return framebuffer._attachmentLevel[attachment]
        case gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER:
          return framebuffer._attachmentLayer[attachment]
        case gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: {
          const face = framebuffer._attachmentFace[attachment]
          if (face === gl.TEXTURE_2D) {
            return 0
          }
          return face
        }
      }
    } else if (object instanceof WebGLRenderbuffer) {
      switch (pname) {
        case gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME:
          return object
        case gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE:
          return gl.RENDERBUFFER
      }
    }

    this.setError(gl.INVALID_ENUM)
    return null
  }

  getIndexedParameter(pname, index) {
    printStackTraceWithArgs(arguments)

    index |= 0

    let val
    switch (pname) {
      case gl.TRANSFORM_FEEDBACK_BUFFER_BINDING:
        val = super.getIntegeriv(pname, index)
        if (this._transformFeedbackGlobalState._indexedBuffers[index]) {
          if (val !== null && val === this._transformFeedbackGlobalState._indexedBuffers[index]._) {
            return this._transformFeedbackGlobalState._indexedBuffers[index]
          }
        }
        return null
      case gl.UNIFORM_BUFFER_BINDING:
        val = super.getIntegeriv(pname, index)
        if (this._uniformBufferGlobalState._indexedBuffers[index]) {
          if (val !== null && val === this._uniformBufferGlobalState._indexedBuffers[index]._) {
            return this._uniformBufferGlobalState._indexedBuffers[index]
          }
        }
        return null
      case gl.TRANSFORM_FEEDBACK_BUFFER_START:
      case gl.TRANSFORM_FEEDBACK_BUFFER_SIZE:
      case gl.UNIFORM_BUFFER_START:
      case gl.UNIFORM_BUFFER_SIZE:
        return super.getIntegeriv(pname, index)
    }

    this.setError(gl.INVALID_ENUM)
    return null
  }

  getInternalformatParameter(target, internalformat, pname) {
    printStackTraceWithArgs(arguments)

    target |= 0
    internalformat |= 0
    pname |= 0

    if (target !== gl.RENDERBUFFER || pname !== gl.SAMPLES) {
      this.setError(gl.INVALID_ENUM)
      return null
    }

    return super.getInternalformatParameter(target, internalformat, pname)
  }

  getProgramParameter(program, pname) {
    printStackTraceWithArgs(arguments)

    pname |= 0
    if (!checkObject(program)) {
      throw new TypeError('getProgramParameter(WebGLProgram, GLenum)')
    } else if (this._checkWrapper(program, WebGLProgram)) {
      switch (pname) {
        case gl.DELETE_STATUS:
          return program._pendingDelete

        case gl.LINK_STATUS:
          return program._linkStatus

        case gl.VALIDATE_STATUS:
          return !!super.getProgramParameter(program._, pname)

        case gl.ATTACHED_SHADERS:
        case gl.ACTIVE_ATTRIBUTES:
        case gl.ACTIVE_UNIFORMS:
        case gl.ACTIVE_UNIFORM_BLOCKS:
        case gl.TRANSFORM_FEEDBACK_VARYINGS:
        case gl.TRANSFORM_FEEDBACK_BUFFER_MODE:
          return super.getProgramParameter(program._, pname)
      }
      this.setError(gl.INVALID_ENUM)
    }
    return null
  }

  getProgramInfoLog(program) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program)) {
      throw new TypeError('getProgramInfoLog(WebGLProgram)')
    } else if (this._checkWrapper(program, WebGLProgram)) {
      return program._linkInfoLog
    }
    return null
  }

  getRenderbufferParameter(target, pname) {
    printStackTraceWithArgs(arguments)

    target |= 0
    pname |= 0
    if (target !== gl.RENDERBUFFER) {
      this.setError(gl.INVALID_ENUM)
      return null
    }
    const renderbuffer = this._activeRenderbuffer
    if (!renderbuffer) {
      this.setError(gl.INVALID_OPERATION)
      return null
    }
    switch (pname) {
      case gl.RENDERBUFFER_INTERNAL_FORMAT:
        return renderbuffer._format
      case gl.RENDERBUFFER_WIDTH:
        return renderbuffer._width
      case gl.RENDERBUFFER_HEIGHT:
        return renderbuffer._height
      case gl.RENDERBUFFER_SAMPLES:
        return renderbuffer._samples
      case gl.RENDERBUFFER_SIZE:
      case gl.RENDERBUFFER_RED_SIZE:
      case gl.RENDERBUFFER_GREEN_SIZE:
      case gl.RENDERBUFFER_BLUE_SIZE:
      case gl.RENDERBUFFER_ALPHA_SIZE:
      case gl.RENDERBUFFER_DEPTH_SIZE:
      case gl.RENDERBUFFER_STENCIL_SIZE:
        return super.getRenderbufferParameter(target, pname)
    }
    this.setError(gl.INVALID_ENUM)
    return null
  }

  getShaderParameter(shader, pname) {
    printStackTraceWithArgs(arguments)

    pname |= 0
    if (!checkObject(shader)) {
      throw new TypeError('getShaderParameter(WebGLShader, GLenum)')
    } else if (this._checkWrapper(shader, WebGLShader)) {
      switch (pname) {
        case gl.DELETE_STATUS:
          return shader._pendingDelete
        case gl.COMPILE_STATUS:
          return shader._compileStatus
        case gl.SHADER_TYPE:
          return shader._type
      }
      this.setError(gl.INVALID_ENUM)
    }
    return null
  }

  getShaderInfoLog(shader) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(shader)) {
      throw new TypeError('getShaderInfoLog(WebGLShader)')
    } else if (this._checkWrapper(shader, WebGLShader)) {
      return shader._compileInfo
    }
    return null
  }

  getShaderSource(shader) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(shader)) {
      throw new TypeError('Input to getShaderSource must be an object')
    } else if (this._checkWrapper(shader, WebGLShader)) {
      return shader._source
    }
    return null
  }

  getTexParameter(target, pname) {
    printStackTraceWithArgs(arguments)

    target |= 0
    pname |= 0

    if (!this._checkTextureTarget(target)) {
      return null
    }

    const unit = this._getActiveTextureUnit()
    if ((target === gl.TEXTURE_2D && !unit._bind2D) ||
      (target === gl.TEXTURE_2D_ARRAY && !unit._bind2DArray) ||
      (target === gl.TEXTURE_3D && !unit._bind3D) ||
      (target === gl.TEXTURE_CUBE_MAP && !unit._bindCube)) {
      this.setError(gl.INVALID_OPERATION)
      return null
    }

    switch (pname) {
      // Note: For TEXTURE_IMMUTABLE_LEVELS and TEXTURE_IMMUTABLE_FORMAT,
      // these two pname are used by getTexParameter API only, not available in texParameter[fi] in specifications.
      // Thus, these two states store default value only.
      case gl.TEXTURE_IMMUTABLE_FORMAT:
        return false
      case gl.TEXTURE_IMMUTABLE_LEVELS:
        return 0
      case gl.TEXTURE_MIN_FILTER:
      case gl.TEXTURE_MAG_FILTER:
      case gl.TEXTURE_WRAP_S:
      case gl.TEXTURE_WRAP_T:
      case gl.TEXTURE_WRAP_R:
      case gl.TEXTURE_COMPARE_FUNC:
      case gl.TEXTURE_COMPARE_MODE:
      case gl.TEXTURE_MAX_LEVEL:
      case gl.TEXTURE_BASE_LEVEL:
      case gl.TEXTURE_MAX_LOD:
      case gl.TEXTURE_MIN_LOD:
        return super.getTexParameter(target, pname)
    }

    if (this._extensions.ext_texture_filter_anisotropic && pname === this._extensions.ext_texture_filter_anisotropic.TEXTURE_MAX_ANISOTROPY_EXT) {
      return super.getTexParameter(target, pname)
    }

    this.setError(gl.INVALID_ENUM)
    return null
  }

  getTransformFeedbackVarying(program, index) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program)) {
      throw new TypeError('getTransformFeedbackVarying(WebGLProgram)')
    } else if (this._checkWrapper(program, WebGLProgram)) {
      const val = super.getTransformFeedbackVarying(program._ | 0, index)
      if (val !== null) {
        return new WebGLActiveInfo(val)
      }
    }

    return null
  }

  getUniform(program, location) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program) ||
      !checkObject(location)) {
      throw new TypeError('getUniform(WebGLProgram, WebGLUniformLocation)')
    } else if (!program) {
      this.setError(gl.INVALID_VALUE)
      return null
    } else if (!location) {
      return null
    } else if (this._checkWrapper(program, WebGLProgram)) {
      if (!checkUniform(program, location)) {
        this.setError(gl.INVALID_OPERATION)
        return null
      }
      const data = super.getUniform(program._ | 0, location._ | 0)
      if (!data) {
        return null
      }
      switch (location._activeInfo.type) {
        case gl.FLOAT:
          return data[0]
        case gl.FLOAT_VEC2:
          return new Float32Array(data.slice(0, 2))
        case gl.FLOAT_VEC3:
          return new Float32Array(data.slice(0, 3))
        case gl.FLOAT_VEC4:
          return new Float32Array(data.slice(0, 4))
        case gl.UNSIGNED_INT:
        case gl.INT:
          return data[0] | 0
        case gl.UNSIGNED_INT_VEC2:
        case gl.INT_VEC2:
          return new Int32Array(data.slice(0, 2))
        case gl.UNSIGNED_INT_VEC3:
        case gl.INT_VEC3:
          return new Int32Array(data.slice(0, 3))
        case gl.UNSIGNED_INT_VEC4:
        case gl.INT_VEC4:
          return new Int32Array(data.slice(0, 4))
        case gl.BOOL:
          return !!data[0]
        case gl.BOOL_VEC2:
          return [!!data[0], !!data[1]]
        case gl.BOOL_VEC3:
          return [!!data[0], !!data[1], !!data[2]]
        case gl.BOOL_VEC4:
          return [!!data[0], !!data[1], !!data[2], !!data[3]]
        case gl.FLOAT_MAT2:
          return new Float32Array(data.slice(0, 4))
        case gl.FLOAT_MAT2x3:
        case gl.FLOAT_MAT3x2:
          return new Float32Array(data.slice(0, 6))
        case gl.FLOAT_MAT2x4:
        case gl.FLOAT_MAT4x2:
          return new Float32Array(data.slice(0, 8))
        case gl.FLOAT_MAT3:
          return new Float32Array(data.slice(0, 9))
        case gl.FLOAT_MAT3x4:
        case gl.FLOAT_MAT4x3:
          return new Float32Array(data.slice(0, 12))
        case gl.FLOAT_MAT4:
          return new Float32Array(data.slice(0, 16))
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
        case gl.SAMPLER_3D:
        case gl.SAMPLER_2D_ARRAY:
        case gl.SAMPLER_2D_SHADOW:
        case gl.SAMPLER_CUBE_SHADOW:
        case gl.SAMPLER_2D_ARRAY_SHADOW:
        case gl.INT_SAMPLER_2D:
        case gl.INT_SAMPLER_CUBE:
        case gl.INT_SAMPLER_3D:
        case gl.INT_SAMPLER_2D_ARRAY:
        case gl.UNSIGNED_INT_SAMPLER_2D:
        case gl.UNSIGNED_INT_SAMPLER_CUBE:
        case gl.UNSIGNED_INT_SAMPLER_3D:
        case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
          return data[0] | 0
        default:
          return null
      }
    }
    return null
  }

  getUniformBlockIndex(program, uniformBlockName) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program) ||
      !isValidString(uniformBlockName)) {
      throw new TypeError('getUniformBlockIndex(WebGLProgram, String)')
    }

    if (this._checkWrapper(program, WebGLProgram)) {
      return super.getUniformBlockIndex(program._ | 0, uniformBlockName)
    }

    return null
  }

  getUniformIndices(program, uniformNames) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program) ||
      !checkObject(uniformNames)) {
      throw new TypeError('getUniformIndices(WebGLProgram, Array)')
    }

    if (!Array.isArray(uniformNames)) {
      this.setError(gl.INVALID_VALUE)
      return null
    }

    if (this._checkWrapper(program, WebGLProgram)) {
      const indices = super.getUniformIndices(program._ | 0, uniformNames)
      if (!indices) {
        return null
      }
      return new Uint32Array(indices)
    }
    return null
  }

  getUniformLocation(program, name) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program)) {
      throw new TypeError('getUniformLocation(WebGLProgram, String)')
    }

    name += ''
    if (!isValidString(name)) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (this._checkWrapper(program, WebGLProgram)) {
      const loc = super.getUniformLocation(program._ | 0, name)
      if (loc >= 0) {
        let searchName = name
        if (/\[\d+\]$/.test(name)) {
          searchName = name.replace(/\[\d+\]$/, '[0]')
        }

        let info = null
        for (let i = 0; i < program._uniforms.length; ++i) {
          const infoItem = program._uniforms[i]
          if (infoItem.name === searchName) {
            info = {
              size: infoItem.size,
              type: infoItem.type,
              name: infoItem.name,
            }
          }
        }
        if (!info) {
          return null
        }

        const result = new WebGLUniformLocation(
          loc,
          program,
          info
        )

        // handle array case
        if (/\[0\]$/.test(name)) {
          const baseName = name.replace(/\[0\]$/, '')
          const arrayLocs = []

          // if (offset < 0 || offset >= info.size) {
          //   return null
          // }

          this._saveError()
          for (let i = 0; this.getError() === gl.NO_ERROR; ++i) {
            const xloc = super.getUniformLocation(
              program._ | 0,
              `${baseName}[${i}]`
            )
            if (this.getError() !== gl.NO_ERROR || xloc < 0) {
              break
            }
            arrayLocs.push(xloc)
          }
          this._restoreError(gl.NO_ERROR)

          result._array = arrayLocs
        } else if (/\[(\d+)\]$/.test(name)) {
          const offset = +(/\[(\d+)\]$/.exec(name))[1]
          if (offset < 0 || offset >= info.size) {
            return null
          }
        }
        return result
      }
    }
    return null
  }

  getVertexAttrib(index, pname) {
    printStackTraceWithArgs(arguments)

    index |= 0
    pname |= 0
    if (index < 0 || index >= this._vertexObjectState._attribs.length) {
      this.setError(gl.INVALID_VALUE)
      return null
    }
    const attrib = this._vertexObjectState._attribs[index]
    const vertexAttribValue = this._vertexGlobalState._attribs[index]._data

    const extInstancing = this._extensions.angle_instanced_arrays
    if (extInstancing) {
      if (pname === extInstancing.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE) {
        return attrib._divisor
      }
    }

    switch (pname) {
      case gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING:
        return attrib._pointerBuffer
      case gl.VERTEX_ATTRIB_ARRAY_ENABLED:
        return attrib._isPointer
      case gl.VERTEX_ATTRIB_ARRAY_SIZE:
        return attrib._inputSize
      case gl.VERTEX_ATTRIB_ARRAY_STRIDE:
        return attrib._inputStride
      case gl.VERTEX_ATTRIB_ARRAY_TYPE:
        return attrib._pointerType
      case gl.VERTEX_ATTRIB_ARRAY_NORMALIZED:
        return attrib._pointerNormal
      case gl.CURRENT_VERTEX_ATTRIB:
        return vertexAttribValue
      default:
        this.setError(gl.INVALID_ENUM)
        return null
    }
  }

  getVertexAttribOffset(index, pname) {
    printStackTraceWithArgs(arguments)

    index |= 0
    pname |= 0
    if (index < 0 || index >= this._vertexObjectState._attribs.length) {
      this.setError(gl.INVALID_VALUE)
      return null
    }
    if (pname === gl.VERTEX_ATTRIB_ARRAY_POINTER) {
      return this._vertexObjectState._attribs[index]._pointerOffset
    } else {
      this.setError(gl.INVALID_ENUM)
      return null
    }
  }

  hint(target, mode) {
    printStackTraceWithArgs(arguments)

    target |= 0
    mode |= 0

    if (!(
      target === gl.GENERATE_MIPMAP_HINT ||
      target === gl.FRAGMENT_SHADER_DERIVATIVE_HINT
    )) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (mode !== gl.FASTEST &&
      mode !== gl.NICEST &&
      mode !== gl.DONT_CARE) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    return super.hint(target, mode)
  }

  isBuffer(object) {
    printStackTraceWithArgs(arguments)

    if (!this._isObject(object, 'isBuffer', WebGLBuffer)) return false
    return super.isBuffer(object._ | 0)
  }

  isFramebuffer(object) {
    printStackTraceWithArgs(arguments)

    if (!this._isObject(object, 'isFramebuffer', WebGLFramebuffer)) return false
    return super.isFramebuffer(object._ | 0)
  }

  isProgram(object) {
    printStackTraceWithArgs(arguments)

    if (!this._isObject(object, 'isProgram', WebGLProgram)) return false
    return super.isProgram(object._ | 0)
  }

  isRenderbuffer(object) {
    printStackTraceWithArgs(arguments)

    if (!this._isObject(object, 'isRenderbuffer', WebGLRenderbuffer)) return false
    return super.isRenderbuffer(object._ | 0)
  }

  isShader(object) {
    printStackTraceWithArgs(arguments)

    if (!this._isObject(object, 'isShader', WebGLShader)) return false
    return super.isShader(object._ | 0)
  }

  isTexture(object) {
    printStackTraceWithArgs(arguments)

    if (!this._isObject(object, 'isTexture', WebGLTexture)) return false
    return super.isTexture(object._ | 0)
  }

  isTransformFeedback(object) {
    printStackTraceWithArgs(arguments)

    if (!this._isObject(object, 'isTransformFeedback', WebGLTransformFeedback)) return false
    return super.isTransformFeedback(object._ | 0)
  }

  isEnabled(cap) {
    printStackTraceWithArgs(arguments)

    // Explicitly check cap, since Desktop GL allows other values
    switch (cap) {
      case gl.BLEND:
      case gl.CULL_FACE:
      case gl.DEPTH_TEST:
      case gl.DITHER:
      case gl.POLYGON_OFFSET_FILL:
      case gl.RASTERIZER_DISCARD:
      case gl.SAMPLE_ALPHA_TO_COVERAGE:
      case gl.SAMPLE_COVERAGE:
      case gl.SCISSOR_TEST:
      case gl.STENCIL_TEST:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return false
    }

    return super.isEnabled(cap | 0)
  }

  lineWidth(width) {
    printStackTraceWithArgs(arguments)

    if (isNaN(width)) {
      this.setError(gl.INVALID_VALUE)
      return
    }
    return super.lineWidth(+width)
  }

  linkProgram(program) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program)) {
      throw new TypeError('linkProgram(WebGLProgram)')
    }
    if (this._checkWrapper(program, WebGLProgram)) {
      program._linkCount += 1
      program._attributes = []
      const prevError = this.getError()
      super.linkProgram(program._ | 0)
      const error = this.getError()
      if (error === gl.NO_ERROR) {
        program._linkStatus = this._fixupLink(program)
      }
      this.getError()
      this.setError(prevError || error)
    }
  }

  pauseTransformFeedback() {
    printStackTraceWithArgs(arguments)

    super.pauseTransformFeedback()
  }

  resumeTransformFeedback() {
    printStackTraceWithArgs(arguments)

    super.resumeTransformFeedback()
  }

  pixelStorei(pname, param) {
    printStackTraceWithArgs(arguments)

    pname |= 0
    param |= 0
    if (pname === gl.UNPACK_ALIGNMENT) {
      if (param === 1 ||
        param === 2 ||
        param === 4 ||
        param === 8) {
        this._unpackAlignment = param
      } else {
        this.setError(gl.INVALID_VALUE)
        return
      }
    } else if (pname === gl.PACK_ALIGNMENT) {
      if (param === 1 ||
        param === 2 ||
        param === 4 ||
        param === 8) {
        this._packAlignment = param
      } else {
        this.setError(gl.INVALID_VALUE)
        return
      }
    } else if (pname === gl.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
      if (!(param === gl.NONE || param === gl.BROWSER_DEFAULT_WEBGL)) {
        this.setError(gl.INVALID_VALUE)
        return
      }
    }
    return super.pixelStorei(pname, param)
  }

  polygonOffset(factor, units) {
    printStackTraceWithArgs(arguments)

    return super.polygonOffset(+factor, +units)
  }

  blitFramebuffer(srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter) {
    // printStackTraceWithArgs(arguments)

    srcX0 |= 0
    srcY0 |= 0
    srcX1 |= 0
    srcY1 |= 0
    dstX0 |= 0
    dstY0 |= 0
    dstX1 |= 0
    dstY1 |= 0

    // if (srcX0 < 0 || srcY0 < 0 || srcX1 < 0 || srcY1 < 0 || dstX0 < 0 || dstY0 < 0 || dstX1 < 0 || dstY1 < 0) {
    //   this.setError(gl.INVALID_VALUE)
    //   return
    // }

    // // TODO: implement the following checks
    // // When blitting to the color attachment of the WebGL context's default back buffer, a context created with alpha:false is considered to have internal format RGB8, while a context created with alpha:true is considered to have internal format RGBA8.

    // // If this function attempts to blit to a missing attachment of a complete framebuffer, nothing is blitted to that attachment and no error is generated per Drawing to a Missing Attachment.
    // // In the WebGL API, any [Draw Operations] that draw to an attachment that is missing will draw nothing to that attachment. No error is generated.
    // if (this.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    //   return
    // }

    // // If this function attempts to read from a missing attachment of a complete framebuffer, and at least one draw buffer has an image to be blitted, an INVALID_OPERATION error is generated per Reading from a Missing Attachment.
    // if (this.checkFramebufferStatus(gl.READ_FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    //   this.setError(gl.INVALID_OPERATION)
    //   return
    // }

    // this._saveError()
    super.blitFramebuffer(srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter)
    // const error = this.getError()
    // this._restoreError(error)
  }

  readBuffer(src) {
    printStackTraceWithArgs(arguments)

    src |= 0

    // src must a valid framebuffer attachment point
    if (src !== gl.BACK && src !== gl.NONE && (src < gl.COLOR_ATTACHMENT0 || src > gl.COLOR_ATTACHMENT0 + this.getParameter(gl.MAX_COLOR_ATTACHMENTS))) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    // null corresponds to a binding to the default framebuffer.
    if (!this._readFramebuffer) {
      if (src !== gl.NONE && src !== gl.BACK) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
    }
    // uses the active read framebuffer object.
    else if ((src < gl.COLOR_ATTACHMENT0 || src > gl.COLOR_ATTACHMENT0 + this.getParameter(gl.MAX_COLOR_ATTACHMENTS)) && src !== gl.NONE) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // sets gl.READ_BUFFER to src
    this._saveError()
    super.readBuffer(src | 0)
    const error = this.getError()
    this._restoreError(error)
  }

  readPixels(x, y, width, height, format, type, dstData, dstOffset = 0) {
    printStackTraceWithArgs(arguments)

    x |= 0
    y |= 0
    width |= 0
    height |= 0
    dstOffset >>>= 0  // convert to unsigned int

    const pixelSize = lookupPixelSizeForFormatCombination(undefined, format, type)
    const implFormat = this.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT)
    const implType = this.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE)
    const invalidFormat = [gl.DEPTH_COMPONENT, gl.DEPTH_STENCIL, gl.R8, gl.RGBA4, gl.LUMINANCE, gl.LUMINANCE_ALPHA]
    const invalidType = [gl.UNSIGNED_INT_24_8]
    let targetPixelPack = false

    if (invalidFormat.includes(format) || invalidType.includes(type)) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (width < 0 || height < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (isTypedArray(dstData)) {
      // client memory location and with optional offset case
      if (this.getParameter(gl.PIXEL_PACK_BUFFER_BINDING) !== null) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (!dstData || dstOffset < 0) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      dstData = dstData.subarray(dstOffset)
    } else {
      // just byte offset case into pixel pack buffer
      targetPixelPack = true
      const packBuffer = this.getParameter(gl.PIXEL_PACK_BUFFER_BINDING)
      if (packBuffer === null) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (dstData < 0) {
        this.setError(gl.INVALID_VALUE)
        return
      }
    }

    // Check accepted format / type combinations
    if (!((format == gl.RGBA && type == gl.UNSIGNED_BYTE) ||
      (format == implFormat && type == implType) ||
      (format == gl.RGBA && type == gl.FLOAT) ||
      (format == gl.RGBA_INTEGER && (type == gl.INT || type == gl.UNSIGNED_INT)))) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (!targetPixelPack && !checkPixelTypeTexture(type, dstData)) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (this.checkFramebufferStatus(gl.READ_FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      this.setError(gl.INVALID_FRAMEBUFFER_OPERATION)
      return
    }

    const data = targetPixelPack ? dstData : convertPixels(dstData)
    const packAlignment = this.getParameter(gl.PACK_ALIGNMENT)
    const packRowLength = this.getParameter(gl.PACK_ROW_LENGTH)
    const packSkipPixels = this.getParameter(gl.PACK_SKIP_PIXELS)
    const packSkipRows = this.getParameter(gl.PACK_SKIP_ROWS)

    const imageSize = computeImageSize2D(
      width,
      height,
      packRowLength,
      pixelSize,
      packAlignment,
      packSkipPixels,
      packSkipRows
    )

    const targetSize = targetPixelPack ? this.getParameter(gl.PIXEL_PACK_BUFFER_BINDING)._size - dstData : data.length
    if (targetSize < imageSize) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const actualWidth = packRowLength === 0 ? width : packRowLength
    if (packSkipPixels + width > actualWidth) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    super.readPixels(
      x,
      y,
      width,
      height,
      format,
      type,
      data
    )
  }

  renderbufferStorage(
    target,
    internalFormat,
    width,
    height
  ) {
    printStackTraceWithArgs(arguments)

    target |= 0
    internalFormat |= 0
    width |= 0
    height |= 0

    if (target !== gl.RENDERBUFFER) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    const renderbuffer = this._activeRenderbuffer
    if (!renderbuffer) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    switch (internalFormat) {
      case gl.R8:
      case gl.R8_UI:
      case gl.R8I:
      case gl.R16UI:
      case gl.R16I:
      case gl.R32UI:
      case gl.R32I:
      case gl.RG8:
      case gl.RG8_UI:
      case gl.RG8I:
      case gl.RG16UI:
      case gl.RG16I:
      case gl.RG32UI:
      case gl.RG32I:
      case gl.RGB8:
      case gl.RGB565:
      case gl.RGBA8:
      case gl.SRGB8_ALPHA8:
      case gl.RGB5_A1:
      case gl.RGBA4:
      case gl.RGB10_A2:
      case gl.RGBA8UI:
      case gl.RGBA8I:
      case gl.RGB10_A2UI:
      case gl.RGBA16UI:
      case gl.RGBA16I:
      case gl.RGBA32I:
      case gl.RGBA32UI:
      case gl.DEPTH_STENCIL:
      case gl.DEPTH_COMPONENT16:
      case gl.DEPTH_COMPONENT24:
      case gl.DEPTH_COMPONENT32F:
      case gl.DEPTH24_STENCIL8:
      case gl.DEPTH32F_STENCIL8:
      case gl.STENCIL_INDEX8:
        break
      case gl.R16F:
      case gl.R32F:
      case gl.RG16F:
      case gl.RG32F:
      case gl.RGBA16F:
      case gl.RGBA32F:
      case gl.R11F_G11F_B10F:
        if (this._extensions.ext_color_buffer_float) {
          break
        }
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    this._saveError()
    super.renderbufferStorage(
      target,
      internalFormat,
      width,
      height
    )
    const error = this.getError()
    this._restoreError(error)
    if (error !== gl.NO_ERROR) {
      return
    }

    renderbuffer._width = width
    renderbuffer._height = height
    renderbuffer._format = internalFormat

    const checkUpdateFrameBufferAttachment = (frameBuffer) => {
      let needsUpdate = false
      const attachments = this._getAttachments()
      for (let i = 0; i < attachments.length; ++i) {
        if (frameBuffer._attachments[attachments[i]] === renderbuffer) {
          needsUpdate = true
          break
        }
      }
      if (needsUpdate) {
        this._updateFramebufferAttachments(frameBuffer)
      }
    }

    if (this._drawFramebuffer) {
      checkUpdateFrameBufferAttachment(this._drawFramebuffer)
    }
    if (this._readFramebuffer) {
      checkUpdateFrameBufferAttachment(this._readFramebuffer)
    }
  }

  renderbufferStorageMultisample(
    target,
    samples,
    internalFormat,
    width,
    height
  ) {
    printStackTraceWithArgs(arguments)

    target |= 0
    samples |= 0
    internalFormat |= 0
    width |= 0
    height |= 0

    if (target !== gl.RENDERBUFFER) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    const renderbuffer = this._activeRenderbuffer
    if (!renderbuffer) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    switch (internalFormat) {
      case gl.R8:
      case gl.R8_UI:
      case gl.R8I:
      case gl.R16UI:
      case gl.R16I:
      case gl.R32UI:
      case gl.R32I:
      case gl.RG8:
      case gl.RG8_UI:
      case gl.RG8I:
      case gl.RG16UI:
      case gl.RG16I:
      case gl.RG32UI:
      case gl.RG32I:
      case gl.RGB8:
      case gl.RGB565:
      case gl.RGBA8:
      case gl.SRGB8_ALPHA8:
      case gl.RGB5_A1:
      case gl.RGBA4:
      case gl.RGB10_A2:
      case gl.RGBA8UI:
      case gl.RGBA8I:
      case gl.RGB10_A2UI:
      case gl.RGBA16UI:
      case gl.RGBA16I:
      case gl.RGBA32I:
      case gl.RGBA32UI:
      case gl.DEPTH_STENCIL:
      case gl.DEPTH_COMPONENT16:
      case gl.DEPTH_COMPONENT24:
      case gl.DEPTH_COMPONENT32F:
      case gl.DEPTH24_STENCIL8:
      case gl.DEPTH32F_STENCIL8:
      case gl.STENCIL_INDEX8:
        break
      case gl.R16F:
      case gl.R32F:
      case gl.RG16F:
      case gl.RG32F:
      case gl.RGBA16F:
      case gl.RGBA32F:
      case gl.R11F_G11F_B10F:
        if (this._extensions.ext_color_buffer_float) {
          break
        }
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    if (internalFormat === gl.DEPTH_STENCIL && samples > 0) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    this._saveError()
    super.renderbufferStorageMultisample(
      target,
      this._msaaDisabled ? 0 : samples,
      internalFormat,
      width,
      height
    )
    const error = this.getError()
    this._restoreError(error)
    if (error !== gl.NO_ERROR) {
      return
    }

    renderbuffer._width = width
    renderbuffer._height = height
    renderbuffer._format = internalFormat
    renderbuffer._samples = samples

    // Store the app provided samples value, so it can be restored later
    this._attachmentObjToSampleCount.set(renderbuffer, samples)

    // TODO: _activeFramebuffer -> either _drawFramebuffer or _readFramebuffer
    const activeFramebuffer = this._activeFramebuffer
    if (activeFramebuffer) {
      let needsUpdate = false
      const attachments = this._getAttachments()
      for (let i = 0; i < attachments.length; ++i) {
        if (activeFramebuffer._attachments[attachments[i]] === renderbuffer) {
          needsUpdate = true
          break
        }
      }
      if (needsUpdate) {
        this._updateFramebufferAttachments(this._activeFramebuffer)
      }
    }
  }

  resize(width, height) {
    printStackTraceWithArgs(arguments)

    width |= 0
    height |= 0
    if (!(width > 0 && height > 0)) {
      throw new Error('Invalid surface dimensions')
    } else if (width !== this.drawingBufferWidth ||
      height !== this.drawingBufferHeight) {
      this._resizeDrawingBuffer(width, height)
      this.drawingBufferWidth = width
      this.drawingBufferHeight = height
    }
  }

  sampleCoverage(value, invert) {
    printStackTraceWithArgs(arguments)

    return super.sampleCoverage(+value, !!invert)
  }

  scissor(x, y, width, height) {
    printStackTraceWithArgs(arguments)

    return super.scissor(x | 0, y | 0, width | 0, height | 0)
  }

  shaderSource(shader, source) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(shader)) {
      throw new TypeError('shaderSource(WebGLShader, String)')
    }
    if (!shader || (!source && typeof source !== 'string')) {
      this.setError(gl.INVALID_VALUE)
      return
    }
    source += ''
    if (!isValidString(source)) {
      this.setError(gl.INVALID_VALUE)
    } else if (this._checkWrapper(shader, WebGLShader)) {
      super.shaderSource(shader._ | 0, source)
      shader._source = source
    }
  }

  stencilFunc(func, ref, mask) {
    printStackTraceWithArgs(arguments)

    this._checkStencil = true
    return super.stencilFunc(func | 0, ref | 0, mask | 0)
  }

  stencilFuncSeparate(face, func, ref, mask) {
    printStackTraceWithArgs(arguments)

    this._checkStencil = true
    return super.stencilFuncSeparate(face | 0, func | 0, ref | 0, mask | 0)
  }

  stencilMask(mask) {
    printStackTraceWithArgs(arguments)

    this._checkStencil = true
    return super.stencilMask(mask | 0)
  }

  stencilMaskSeparate(face, mask) {
    printStackTraceWithArgs(arguments)

    this._checkStencil = true
    return super.stencilMaskSeparate(face | 0, mask | 0)
  }

  stencilOp(fail, zfail, zpass) {
    printStackTraceWithArgs(arguments)

    this._checkStencil = true
    return super.stencilOp(fail | 0, zfail | 0, zpass | 0)
  }

  stencilOpSeparate(face, fail, zfail, zpass) {
    printStackTraceWithArgs(arguments)

    this._checkStencil = true
    return super.stencilOpSeparate(face | 0, fail | 0, zfail | 0, zpass | 0)
  }

  texImage2D(
    target,
    level,
    internalFormat,
    width,
    height,
    border,
    format,
    type,
    pixels,
    srcOffset = 0
  ) {
    printStackTraceWithArgs(arguments)

    if (typeof pixels !== 'object' && typeof pixels !== 'number' && pixels !== undefined) {
      throw new TypeError('texImage2D(GLenum, GLint, GLenum, GLint, GLint, GLint, GLenum, GLenum, ArrayBufferView | TexImageSource | GLint, GLint)')
    }

    target |= 0
    level |= 0
    internalFormat |= 0
    width |= 0
    height |= 0
    border |= 0
    format |= 0
    type |= 0
    srcOffset >>>= 0

    if (arguments.length === 6) {
      // texImage2D(GLenum target, GLint level, GLint internalformat, GLenum format, GLenum type, TexImageSource source); // May throw DOMException
      format = arguments[3]
      type = arguments[4]
      pixels = arguments[5]

      const texImageSourceResponse = this._handleTexImageSource(pixels, format)
      pixels = texImageSourceResponse.sourceData
      width = texImageSourceResponse.width
      height = texImageSourceResponse.height
    } else if (arguments.length === 9 || arguments.length === 10) {
      if (typeof pixels === 'number') {
        // texImage2D(enum target, int level, enum internalformat, sizei width, sizei height, int border, enum format, enum type, intptr offset);
        // Upload data to the currently bound WebGLTexture from the WebGLBuffer bound to the PIXEL_UNPACK_BUFFER target.
        // offset is the byte offset into the WebGLBuffer's data store; generates an INVALID_VALUE if it's less than 0.
        if (pixels < 0) {
          this.setError(gl.INVALID_VALUE)
          return
        }

        if (this._getActiveBuffer(gl.PIXEL_UNPACK_BUFFER) === null) {
          this.setError(gl.INVALID_OPERATION)
          return
        }
      } else if (ArrayBuffer.isView(pixels)) {
        // texImage2D(enum target, int level, enum internalformat, sizei width, sizei height, int border, enum format, enum type, ArrayBufferView srcData, uint srcOffset = 0);
        // Reading from srcData begins srcOffset elements into srcData. (Elements are bytes for Uint8Array, int32s for Int32Array, etc.)
        if (this._getActiveBuffer(gl.PIXEL_UNPACK_BUFFER) !== null) {
          this.setError(gl.INVALID_OPERATION)
          return
        }

        pixels = pixels.subarray(srcOffset)
      } else {
        // texImage2D(enum target, int level, enum internalformat, sizei width, sizei height, int border, enum format, enum type, TexImageSource source);

        // If a WebGLBuffer is bound to the PIXEL_UNPACK_BUFFER target, generates an INVALID_OPERATION error.
        if (this._getActiveBuffer(gl.PIXEL_UNPACK_BUFFER) !== null) {
          this.setError(gl.INVALID_OPERATION)
          return
        }

        const texImageSourceResponse = this._handleTexImageSource(pixels, format)
        pixels = texImageSourceResponse.sourceData

        // Pixel store parameters for uploads from TexImageSource: https://registry.khronos.org/webgl/specs/latest/2.0/#DOM_UPLOAD_UNPACK_PARAMS
        // UNPACK_ALIGNMENT and UNPACK_ROW_LENGTH are ignored.
        // UNPACK_ALIGNMENT is specified in bytes, and is implicit and implementation-dependent for TexImageSource objects.
        // UNPACK_ROW_LENGTH is currently unused.
        // UNPACK_SKIP_PIXELS and UNPACK_SKIP_ROWS determine the origin of the subrect, with the width and height arguments determining the size of the subrect.
      }
    } else {
      throw new TypeError('texImage2D(GLenum, GLint, GLenum, GLint, GLint, GLint, GLenum, GLenum, (ArrayBufferView, [GLint = 0] | TexImageSource | GLint))')
    }

    const pixelSize = lookupPixelSizeForFormatCombination(internalFormat, format, type)
    if (pixelSize === null) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (pixels && typeof pixels !== 'number' && !checkPixelTypeTexture(type, pixels)) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const texture = this._getTexImage(target)
    if (!texture) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (!this._checkDimensions(
      target,
      width,
      height,
      level
    )) {
      return
    }

    const data = (typeof pixels === 'number') ? pixels : convertPixels(pixels)

    const unpackAlignment = this._getCachedUnpackAlignment()
    const unpackRowLength = this._getCachedUnpackRowLength()
    const unpackSkipPixels = this._getCachedUnpackSkipPixels()
    const unpackSkipRows = this._getCachedUnpackSkipRows()

    const imageSize = computeImageSize2D(
      width,
      height,
      unpackRowLength,
      pixelSize,
      unpackAlignment,
      unpackSkipPixels,
      unpackSkipRows
    )

    if (data && typeof data !== 'number' && data.length < imageSize) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const actualWidth = unpackRowLength === 0 ? width : unpackRowLength
    if (data && typeof data !== 'number' && unpackSkipPixels + width > actualWidth) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (border !== 0 ||
      (validCubeTarget(target) && width !== height)) {
      this.setError(gl.INVALID_VALUE)
      return
    }
    // Need to check for out of memory error
    this._saveError()
    super.texImage2D(
      target,
      level,
      internalFormat,
      width,
      height,
      border,
      format,
      type,
      data
    )
    const error = this.getError()
    this._restoreError(error)
    if (error !== gl.NO_ERROR) {
      return
    }

    // Save width and height at level, and update texture info & framebuffer attachments.
    texture._levelWidth[level] = width
    texture._levelHeight[level] = height
    texture._format = format
    texture._internalFormat = internalFormat
    texture._type = type

    const checkUpdateFrameBufferAttachment = (frameBuffer) => {
      let needsUpdate = false
      const attachments = this._getAttachments()
      for (let i = 0; i < attachments.length; ++i) {
        if (frameBuffer._attachments[attachments[i]] === texture) {
          needsUpdate = true
          break
        }
      }
      if (needsUpdate) {
        this._updateFramebufferAttachments(frameBuffer)
      }
    }

    if (this._drawFramebuffer) {
      checkUpdateFrameBufferAttachment(this._drawFramebuffer)
    }
    if (this._readFramebuffer) {
      checkUpdateFrameBufferAttachment(this._readFramebuffer)
    }
  }

  texImage3D(
    target,
    level,
    internalFormat,
    width,
    height,
    depth,
    border,
    format,
    type,
    pixels,
    srcOffset
  ) {
    printStackTraceWithArgs(arguments)

    target |= 0
    level |= 0
    internalFormat |= 0
    width |= 0
    height |= 0
    depth |= 0
    border |= 0
    format |= 0
    type |= 0
    srcOffset |= 0

    switch (target) {
      case gl.TEXTURE_3D:
      case gl.TEXTURE_2D_ARRAY:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    if (ArrayBuffer.isView(pixels)) {
      if (this._getActiveBuffer(gl.PIXEL_UNPACK_BUFFER) !== null) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      pixels = pixels.subarray(srcOffset)
    } else if (typeof pixels === 'object') {
      if (this._getActiveBuffer(gl.PIXEL_UNPACK_BUFFER) !== null) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      const texImageSourceResponse = this._handleTexImageSource(pixels, format)
      pixels = texImageSourceResponse.sourceData
    } else if (typeof pixels === 'number') {
      // texImage3D(enum target, int level, enum internalformat, sizei width, sizei height, sizei depth, int border, enum format, enum type, intptr offset);
      // Upload data to the currently bound WebGLTexture from the WebGLBuffer bound to the PIXEL_UNPACK_BUFFER target.
      // offset is the byte offset into the WebGLBuffer's data store; generates an INVALID_VALUE if it's less than 0.
      if (pixels < 0) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      if (this._getActiveBuffer(gl.PIXEL_UNPACK_BUFFER) === null) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
    } else {
      throw new TypeError('texImage3D(GLenum, GLint, GLenum, GLint, GLint, GLint, GLint, GLenum, GLenum, ArrayBufferView | TexImageSource | GLint, GLint)')
    }

    const pixelSize = lookupPixelSizeForFormatCombination(internalFormat, format, type)
    if (pixelSize === null) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (pixels && !checkPixelTypeTexture(type, pixels)) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const texture = this._getTexImage(target)
    if (!texture) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (!this._checkDimensions(
      target,
      width,
      height,
      depth,
      level
    )) {
      return
    }

    const data = convertPixels(pixels)

    const unpackAlignment = this._getCachedUnpackAlignment()
    const unpackRowLength = this._getCachedUnpackRowLength()
    const unpackSkipPixels = this._getCachedUnpackSkipPixels()
    const unpackSkipRows = this._getCachedUnpackSkipRows()

    const unpackHeight = this.getParameter(gl.UNPACK_IMAGE_HEIGHT)
    const unpackSkipImages = this.getParameter(gl.UNPACK_SKIP_IMAGES)

    const imageSize = computeImageSize3D(
      width,
      height,
      depth,
      unpackRowLength,
      unpackHeight,
      pixelSize,
      unpackAlignment,
      unpackSkipPixels,
      unpackSkipRows,
      unpackSkipImages
    )

    if (data && typeof data !== 'number' && data.length < imageSize) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const actualWidth = unpackRowLength === 0 ? width : unpackRowLength
    const actualHeight = unpackHeight === 0 ? height : unpackHeight
    if (data && typeof data !== 'number' &&
      (unpackSkipPixels + width > actualWidth || unpackSkipRows + height > actualHeight)) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // Need to check for out of memory error
    this._saveError()
    super.texImage3D(
      target,
      level,
      internalFormat,
      width,
      height,
      depth,
      border,
      format,
      type,
      data
    )
    const error = this.getError()
    this._restoreError(error)
    if (error !== gl.NO_ERROR) {
      return
    }

    // Save width and height at level
    texture._levelWidth[level] = width
    texture._levelHeight[level] = height
    texture._levelDepth[level] = depth
    texture._internalFormat = internalFormat
    texture._format = format
    texture._type = type

    const drawFramebuffer = this._drawFramebuffer
    if (drawFramebuffer) {
      let needsUpdate = false
      const attachments = this._getAttachments()
      for (let i = 0; i < attachments.length; ++i) {
        if (drawFramebuffer._attachments[attachments[i]] === texture) {
          needsUpdate = true
          break
        }
      }
      if (needsUpdate) {
        this._updateFramebufferAttachments(this._drawFramebuffer)
      }
    }

    const readFramebuffer = this._readFramebuffer
    if (readFramebuffer) {
      let needsUpdate = false
      const attachments = this._getAttachments()
      for (let i = 0; i < attachments.length; ++i) {
        if (readFramebuffer._attachments[attachments[i]] === texture) {
          needsUpdate = true
          break
        }
      }
      if (needsUpdate) {
        this._updateFramebufferAttachments(this._readFramebuffer)
      }
    }
  }

  _handleTexImageSource(sourceData, format) {
    let width = 0
    let height = 0

    if (sourceData === null) {
      return {sourceData, width, height}
    }

    const objectName = Object.getPrototypeOf(sourceData).constructor.name

    if (objectName === 'ImageData') {
      if (sourceData.data.byteLength === 0) {
        this.setError(gl.INVALID_VALUE)
        return
      }
      height = sourceData.height
      width = sourceData.width
      sourceData = sourceData.data
    } else if (objectName === 'ImageBitmap') {
      if (sourceData.width === 0 || sourceData.height === 0) {
        this.setError(gl.INVALID_VALUE)
        return
      }
      height = sourceData.height
      width = sourceData.width
      if (format === gl.RGBA) {
        sourceData = sourceData.getBitmapData().getRGBAData()
      } else {
        sourceData = sourceData.getBitmapData().data
      }
    } else if (objectName === 'HTMLImageElement') {
      // TODO(akashmahesh): Add check for SVG Image format
      height = sourceData._image.height
      width = sourceData._image.width
      if (format === gl.RGBA) {
        sourceData = sourceData._image.getRGBAData()
      } else {
        sourceData = sourceData._image.data
      }
    } else if (objectName === 'HTMLCanvasElement' || objectName === 'OffscreenCanvas') {
      height = sourceData.height
      width = sourceData.width
      if (objectName !== 'OffscreenCanvas') {
        if (sourceData._context && sourceData._contextType === '2d') {
          sourceData = sourceData._context._image.crop({x: 0, y: 0, width, height}).getRGBAData()
        } else {
          // TODO: Verify if this behavior is desired
          const pixels = new Uint8Array(sourceData.width * sourceData.height * 4)
          this.readPixels(0, 0, sourceData.width, sourceData.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
          sourceData = pixels
        }
      }
    } else if (objectName === 'HTMLVideoElement' || objectName === 'VideoFrame') {
      height = sourceData.videoHeight
      width = sourceData.videoWidth
    }

    return {sourceData, width, height}
  }

  texSubImage2D(
    target,
    level,
    xoffset,
    yoffset,
    width,
    height,
    format,
    type,
    sourceData,
    srcOffset = 0
  ) {
    printStackTraceWithArgs(arguments)

    target |= 0
    level |= 0
    xoffset |= 0
    yoffset |= 0
    width |= 0
    height |= 0
    format |= 0
    type |= 0
    srcOffset >>>= 0

    if (arguments.length === 9 && typeof sourceData === 'number') {
      // texSubImage2D(enum target, int level, int xoffset, int yoffset, sizei width, sizei height, enum format, enum type, GLintptr offset)
      if (this._getActiveBuffer(gl.PIXEL_UNPACK_BUFFER) === null) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (sourceData < 0) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      if (this.getParameter(gl.UNPACK_FLIP_Y_WEBGL) || this.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL)) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      sourceData |= 0
    } else if ((arguments.length === 9 || arguments.length === 10) && ArrayBuffer.isView(sourceData)) {
      // Processes ArrayBufferView (both overloads)
      sourceData = sourceData.subarray(srcOffset)
    } else if ((arguments.length === 7 || arguments.length === 9)) {
      // Processes TexImageSource (both overloads)
      if (arguments.length === 7) {
        // texSubImage2D(enum target, int level, int xoffset, int yoffset, enum format, enum type, TexImageSource source)
        format = arguments[4]
        type = arguments[5]
        sourceData = arguments[6]
      }

      if (typeof sourceData !== 'object') {
        throw new TypeError('texSubImage2D(GLenum, GLint, GLint, GLint, GLint, GLint, GLenum, GLenum, ArrayBufferView | TexImageSource | GLint, GLint)')
      }

      const texImageSourceResponse = this._handleTexImageSource(sourceData, format)
      sourceData = texImageSourceResponse.sourceData

      // If dimensions aren't specified, use the dimensions of the source data
      if (arguments.length === 7) {
        width = texImageSourceResponse.width
        height = texImageSourceResponse.height
      }
    } else {
      throw new TypeError('texSubImage2D(GLenum, GLint, GLint, GLint, GLint, GLint, GLenum, GLenum, ArrayBufferView | TexImageSource | GLint, GLint)')
    }

    const texture = this._getTexImage(target)
    if (!texture) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    if (sourceData && typeof sourceData !== 'number' && !checkPixelTypeTexture(type, sourceData)) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const pixelSize = lookupPixelSizeForFormatCombination(texture._internalFormat, format, type)
    if (pixelSize === null) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (sourceData === null || xoffset < 0 || yoffset < 0 || srcOffset < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (!this._checkDimensions(
      target,
      width,
      height,
      level
    )) {
      return
    }

    const data = convertPixels(sourceData)

    const unpackAlignment = this._getCachedUnpackAlignment()
    const unpackRowLength = this._getCachedUnpackRowLength()
    const unpackSkipPixels = this._getCachedUnpackSkipPixels()
    const unpackSkipRows = this._getCachedUnpackSkipRows()

    const imageSize = computeImageSize2D(
      width,
      height,
      unpackRowLength,
      pixelSize,
      unpackAlignment,
      unpackSkipPixels,
      unpackSkipRows
    )

    if (data && typeof data !== 'number' && data.length < imageSize) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const actualWidth = unpackRowLength === 0 ? width : unpackRowLength
    if (data && typeof data !== 'number' && unpackSkipPixels + width > actualWidth) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    super.texSubImage2D(
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      type,
      data
    )
  }

  texSubImage3D(
    target,
    level,
    xoffset,
    yoffset,
    zoffset,
    width,
    height,
    depth,
    format,
    type,
    pixels,
    srcOffset = 0
  ) {
    printStackTraceWithArgs(arguments)

    target |= 0
    level |= 0
    xoffset |= 0
    yoffset |= 0
    zoffset |= 0
    width |= 0
    height |= 0
    depth |= 0
    format |= 0
    type |= 0
    srcOffset |= 0

    switch (target) {
      case gl.TEXTURE_3D:
      case gl.TEXTURE_2D_ARRAY:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    if (ArrayBuffer.isView(pixels)) {
      if (this._getActiveBuffer(gl.PIXEL_UNPACK_BUFFER) !== null) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (type === gl.FLOAT_32_UNSIGNED_INT_24_8_REV) {
        this.setError(gl.INVALID_ENUM)
        return
      }

      if (pixels && !checkPixelTypeTexture(type, pixels)) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (pixels.byteLength < srcOffset) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      pixels = pixels.subarray(srcOffset)
    } else if (typeof pixels === 'object') {  // May throw DOMException
      if (this._getActiveBuffer(gl.PIXEL_UNPACK_BUFFER) !== null) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      const texImageSourceResponse = this._handleTexImageSource(pixels, format)
      pixels = texImageSourceResponse.sourceData
      if (!pixels) {
        this.setError(gl.INVALID_VALUE)
        return
      }
    } else if (typeof pixels === 'number') {  // Uses active PIXEL_UNPACK_BUFFER
      if (this._getActiveBuffer(gl.PIXEL_UNPACK_BUFFER) === null) {
        this.setError(gl.INVALID_OPERATION)
        return
      }

      if (pixels < 0) {
        this.setError(gl.INVALID_VALUE)
        return
      }

      if (this.getParameter(gl.UNPACK_FLIP_Y_WEBGL) || this.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL)) {
        this.setError(gl.INVALID_OPERATION)
        return
      }
    } else {
      throw new TypeError('texSubImage3D(GLenum, GLint, GLint, GLint, GLint, GLint, GLint, GLint, GLenum, GLenum, ArrayBufferView | TexImageSource | GLint [, srcOffset=0])')
    }

    const texture = this._getTexImage(target)
    if (!texture) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // Texture must be complete
    if (!texture._internalFormat) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const pixelSize = lookupPixelSizeForFormatCombination(texture._internalFormat, format, type)
    if (pixelSize === null) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (pixels === null || xoffset < 0 || yoffset < 0 || zoffset < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (!this._checkDimensions(
      target,
      width,
      height,
      depth,
      level
    )) {
      return
    }

    const data = convertPixels(pixels)

    const unpackAlignment = this._getCachedUnpackAlignment()
    const unpackRowLength = this._getCachedUnpackRowLength()
    const unpackSkipPixels = this._getCachedUnpackSkipPixels()
    const unpackSkipRows = this._getCachedUnpackSkipRows()

    const unpackHeight = this.getParameter(gl.UNPACK_IMAGE_HEIGHT)
    const unpackSkipImages = this.getParameter(gl.UNPACK_SKIP_IMAGES)

    const imageSize = computeImageSize3D(
      width,
      height,
      depth,
      unpackRowLength,
      unpackHeight,
      pixelSize,
      unpackAlignment,
      unpackSkipPixels,
      unpackSkipRows,
      unpackSkipImages
    )

    if (data && typeof data !== 'number' && data.length < imageSize) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    const actualWidth = unpackRowLength === 0 ? width : unpackRowLength
    const actualHeight = unpackHeight === 0 ? height : unpackHeight
    if (data && typeof data !== 'number' &&
      (unpackSkipPixels + width > actualWidth || unpackSkipRows + height > actualHeight)) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    this._saveError()
    super.texSubImage3D(
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      type,
      data
    )
    this._restoreError(this.getError())
  }

  texStorage2D(target, levels, internalformat, width, height) {
    printStackTraceWithArgs(arguments)

    target |= 0
    levels |= 0
    internalformat |= 0
    width |= 0
    height |= 0

    if (levels < 1) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (target !== gl.TEXTURE_2D && target !== gl.TEXTURE_CUBE_MAP) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (!this._checkTextureTarget(target)) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    const texture = this._getTexImage(target)
    if (!texture) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    for (let i = 0; i < levels; i++) {
      texture._levelWidth[i] = Math.max(1, width >> i)
      texture._levelHeight[i] = Math.max(1, height >> i)
    }
    texture._internalFormat = internalformat

    this._saveError()
    super.texStorage2D(target, levels, internalformat, width, height)
    const error = this.getError()
    this._restoreError(error)
  }

  texStorage3D(target, levels, internalformat, width, height, depth) {
    printStackTraceWithArgs(arguments)

    target |= 0
    levels |= 0
    internalformat |= 0
    width |= 0
    height |= 0
    depth |= 0

    switch (target) {
      case gl.TEXTURE_3D:
      case gl.TEXTURE_2D_ARRAY:
        break
      default:
        this.setError(gl.INVALID_ENUM)
        return
    }

    if (levels < 1) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    const texture = this._getTexImage(target)
    if (!texture) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    this._saveError()
    super.texStorage3D(target, levels, internalformat, width, height, depth)
    const error = this.getError()
    this._restoreError(error)
    if (error !== gl.NO_ERROR) {
      return
    }

    for (let i = 0; i < levels; i++) {
      texture._levelWidth[i] = width
      texture._levelHeight[i] = height
      texture._levelDepth[i] = depth
    }
    texture._internalFormat = internalformat
  }

  texParameterf(target, pname, param) {
    printStackTraceWithArgs(arguments)

    target |= 0
    pname |= 0
    param = +param

    if (this._checkTextureTarget(target)) {
      this._verifyTextureCompleteness(target, pname, param)
      switch (pname) {
        case gl.TEXTURE_MIN_FILTER:
        case gl.TEXTURE_MIN_LOD:
        case gl.TEXTURE_MAG_FILTER:
        case gl.TEXTURE_MAX_LOD:
        case gl.TEXTURE_WRAP_S:
        case gl.TEXTURE_WRAP_T:
          return super.texParameterf(target, pname, param)
      }

      if (this._extensions.ext_texture_filter_anisotropic && pname === this._extensions.ext_texture_filter_anisotropic.TEXTURE_MAX_ANISOTROPY_EXT) {
        return super.texParameterf(target, pname, param)
      }

      this.setError(gl.INVALID_ENUM)
    }
  }

  texParameteri(target, pname, param) {
    // printStackTraceWithArgs(arguments)

    target |= 0
    pname |= 0
    param |= 0
    return super.texParameteri(target, pname, param)

    // if (this._checkTextureTarget(target)) {
    //   this._verifyTextureCompleteness(target, pname, param)
    //   switch (pname) {
    //     case gl.TEXTURE_MIN_FILTER:
    //       if (param === gl.NEAREST || param === gl.LINEAR || param === gl.NEAREST_MIPMAP_NEAREST ||
    //         param === gl.LINEAR_MIPMAP_NEAREST || param === gl.NEAREST_MIPMAP_LINEAR ||
    //         param === gl.LINEAR_MIPMAP_LINEAR) {
    //         return super.texParameteri(target, pname, param)
    //       }
    //       break
    //     case gl.TEXTURE_MAG_FILTER:
    //       if (param === gl.NEAREST || param === gl.LINEAR) {
    //         return super.texParameteri(target, pname, param)
    //       }
    //       break
    //     case gl.TEXTURE_WRAP_S:
    //     case gl.TEXTURE_WRAP_T:
    //     case gl.TEXTURE_WRAP_R:
    //       if (param === gl.REPEAT || param === gl.CLAMP_TO_EDGE || param === gl.MIRRORED_REPEAT) {
    //         return super.texParameteri(target, pname, param)
    //       }
    //       break
    //     case gl.TEXTURE_COMPARE_FUNC:
    //       if (param === gl.LEQUAL || param === gl.GEQUAL || param === gl.LESS ||
    //         param === gl.GREATER || param === gl.EQUAL || param === gl.NOTEQUAL ||
    //         param === gl.ALWAYS || param === gl.NEVER) {
    //         return super.texParameteri(target, pname, param)
    //       }
    //       break
    //     case gl.TEXTURE_COMPARE_MODE:
    //       if (param === gl.NONE || param === gl.COMPARE_REF_TO_TEXTURE) {
    //         return super.texParameteri(target, pname, param)
    //       }
    //       break
    //     case gl.TEXTURE_MAX_LEVEL:
    //     case gl.TEXTURE_BASE_LEVEL:
    //       if (typeof param === 'number') {
    //         return super.texParameteri(target, pname, param)
    //       }
    //       break
    //   }

    //   this.setError(gl.INVALID_ENUM)
    // }
  }

  transformFeedbackVaryings(program, varyings, bufferMode) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program)) {
      throw new TypeError('transformFeedbackVaryings(WebGLProgram, Array, GLenum)')
    }

    if (!Array.isArray(varyings) ||
      !varyings.every(isValidString) ||
      !this._checkWrapper(program, WebGLProgram)) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    super.transformFeedbackVaryings(
      program._ | 0,
      varyings,
      bufferMode | 0
    )
  }

  uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(program)) {
      throw new TypeError('uniformBlockBinding(WebGLProgram, GLuint, GLuint)')
    }

    if (uniformBlockBinding >= this.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS)) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (this._checkWrapper(program, WebGLProgram)) {
      super.uniformBlockBinding(program._ | 0, uniformBlockIndex | 0, uniformBlockBinding | 0)
    }
  }

  useProgram(program) {
    const programId = program?._ | 0
    this._activeProgram = program
    return super.useProgram(programId)

    // TODO(dat): Remove auto-clean up of program via Linkable
    // if (!checkObject(program)) {
    //   throw new TypeError('useProgram(WebGLProgram)')
    // } else if (!program) {
    //   this._switchActiveProgram(this._activeProgram)
    //   this._activeProgram = null
    //   return super.useProgram(0)
    // } else if (this._checkWrapper(program, WebGLProgram)) {
    //   if (this._activeProgram !== program) {
    //     this._switchActiveProgram(this._activeProgram)
    //     this._activeProgram = program
    //     program._refCount += 1
    //   }
    //   return super.useProgram(program._ | 0)
    // }
  }

  validateProgram(program) {
    printStackTraceWithArgs(arguments)

    if (this._checkWrapper(program, WebGLProgram)) {
      super.validateProgram(program._ | 0)
      const error = this.getError()
      if (error === gl.NO_ERROR) {
        program._linkInfoLog = super.getProgramInfoLog(program._ | 0)
      }
      this.getError()
      this.setError(error)
    }
  }

  vertexAttribPointer(
    index,
    size,
    type,
    normalized,
    stride,
    offset
  ) {
    printStackTraceWithArgs(arguments)

    if (stride < 0 || offset < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    index |= 0
    size |= 0
    type |= 0
    normalized = !!normalized
    stride |= 0
    offset |= 0

    if (stride < 0 ||
      offset < 0 ||
      index < 0 || index >= this._vertexObjectState._attribs.length ||
      !(size === 1 || size === 2 || size === 3 || size === 4)) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    if (offset !== 0 && this._vertexGlobalState._arrayBufferBinding === null) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // fixed, int and unsigned int aren't allowed in WebGL
    const byteSize = typeSize(type)
    if (byteSize === 0 ||
      type === gl.INT ||
      type === gl.UNSIGNED_INT) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (stride > 255 || stride < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    // stride and offset must be multiples of size
    if ((stride % byteSize) !== 0 ||
      (offset % byteSize) !== 0) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // Call vertex attrib pointer
    super.vertexAttribPointer(index, size, type, normalized, stride, offset)

    // Update the vertex state object and references.
    this._vertexObjectState.setVertexAttribPointer(
      /* buffer */ this._vertexGlobalState._arrayBufferBinding,
      /* index */ index,
      /* pointerSize */ size * byteSize,
      /* pointerOffset */ offset,
      /* pointerStride */ stride || (size * byteSize),
      /* pointerType */ type,
      /* pointerNormal */ normalized,
      /* inputStride */ stride,
      /* inputSize */ size
    )
  }

  vertexAttribI4i(index, v0, v1, v2, v3) {
    index |= 0
    if (!this._checkVertexIndex(index)) return
    this._vertexGlobalState._attribs[index].castToTypedArray(gl.INT)
    const data = this._vertexGlobalState._attribs[index]._data
    data[3] = v3
    data[2] = v2
    data[1] = v1
    data[0] = v0

    return super.vertexAttribI4i(index | 0, +v0, +v1, +v2, +v3)
  }

  vertexAttribI4iv(index, value) {
    printStackTraceWithArgs(arguments)

    if (typeof value !== 'object' || value === null || value.length < 4) {
      this.setError(gl.INVALID_VALUE)
      return
    }
    if (!this._checkVertexIndex(index)) return
    const attribute = this._vertexGlobalState._attribs[index]
    attribute.castToTypedArray(gl.INT)
    const data = attribute._data

    data[3] = value[3]
    data[2] = value[2]
    data[1] = value[1]
    data[0] = value[0]
    return super.vertexAttribI4i(index | 0, +value[0], +value[1], +value[2], +value[3])
  }

  vertexAttribI4ui(index, v0, v1, v2, v3) {
    printStackTraceWithArgs(arguments)

    index |= 0
    if (!this._checkVertexIndex(index)) return
    this._vertexGlobalState._attribs[index].castToTypedArray(gl.UNSIGNED_INT)
    const data = this._vertexGlobalState._attribs[index]._data
    data[3] = v3
    data[2] = v2
    data[1] = v1
    data[0] = v0

    return super.vertexAttribI4ui(index | 0, +v0, +v1, +v2, +v3)
  }

  vertexAttribI4uiv(index, value) {
    printStackTraceWithArgs(arguments)

    if (typeof value !== 'object' || value === null || value.length < 4) {
      this.setError(gl.INVALID_VALUE)
      return
    }
    if (!this._checkVertexIndex(index)) return
    this._vertexGlobalState._attribs[index].castToTypedArray(gl.UNSIGNED_INT)
    const data = this._vertexGlobalState._attribs[index]._data
    data[3] = value[3]
    data[2] = value[2]
    data[1] = value[1]
    data[0] = value[0]
    return super.vertexAttribI4ui(index | 0, +value[0], +value[1], +value[2], +value[3])
  }

  vertexAttribIPointer(
    index,
    size,
    type,
    stride,
    offset
  ) {
    printStackTraceWithArgs(arguments)

    if (stride < 0 || offset < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    index |= 0
    size |= 0
    type |= 0
    stride |= 0
    offset |= 0

    if (stride < 0 ||
      offset < 0 ||
      index < 0 || index >= this._vertexObjectState._attribs.length ||
      !(size === 1 || size === 2 || size === 3 || size === 4)) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    // should fail if no buffer is bound and offset is non-zero
    if ((offset != 0) && (this._vertexGlobalState._arrayBufferBinding === null)) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // only INT values are allowed
    const byteSize = typeSize(type)
    if (byteSize === 0 ||
      !(type === gl.INT ||
      type === gl.UNSIGNED_INT ||
      type === gl.BYTE ||
      type === gl.UNSIGNED_BYTE ||
      type === gl.SHORT ||
      type === gl.UNSIGNED_SHORT)) {
      this.setError(gl.INVALID_ENUM)
      return
    }

    if (stride > 255 || stride < 0) {
      this.setError(gl.INVALID_VALUE)
      return
    }

    // stride and offset must be multiples of size
    if ((stride % byteSize) !== 0 ||
      (offset % byteSize) !== 0) {
      this.setError(gl.INVALID_OPERATION)
      return
    }

    // Call vertex attrib pointer
    super.vertexAttribIPointer(index, size, type, stride, offset)

    // Update the vertex state object and references.
    this._vertexObjectState.setVertexAttribIPointer(
      /* buffer */ this._vertexGlobalState._arrayBufferBinding,
      /* index */ index,
      /* pointerSize */ size * byteSize,
      /* pointerOffset */ offset,
      /* pointerStride */ stride || (size * byteSize),
      /* pointerType */ type,
      /* inputStride */ stride,
      /* inputSize */ size
    )
  }

  viewport(x, y, width, height) {
    printStackTraceWithArgs(arguments)

    return super.viewport(x | 0, y | 0, width | 0, height | 0)
  }

  /*
  _allocateDrawingBuffer (width, height) {
    this._drawingBuffer = new WebGLDrawingBufferWrapper(
      super.createFramebuffer(),
      super.createTexture(),
      super.createRenderbuffer())

    this._resizeDrawingBuffer(width, height)
  }
  */

  isContextLost() {
    printStackTraceWithArgs(arguments)

    return false
  }

  _checkUniformValid(location, v0, name, count, type) {
    // In production mode, we don't need to check for errors
    if (!isDebugMode) {
      return true
    }

    if (!checkObject(location)) {
      throw new TypeError(`${name}(WebGLUniformLocation, ...)`)
    } else if (!location) {
      return false
    } else if (this._checkLocationActive(location)) {
      const utype = location._activeInfo.type
      if (utype === gl.SAMPLER_2D || utype === gl.SAMPLER_CUBE) {
        if (count !== 1) {
          this.setError(gl.INVALID_VALUE)
          return
        }
        if (type !== 'i' && type !== 'u') {
          this.setError(gl.INVALID_OPERATION)
          return
        }
        if (v0 < 0 || v0 >= this._textureUnits.length) {
          this.setError(gl.INVALID_VALUE)
          return false
        }
      }
      if (uniformTypeSize(utype) > count) {
        this.setError(gl.INVALID_OPERATION)
        return false
      }
      return true
    }
    return false
  }

  _checkUniformValueValid(location, value, name, count, type) {
    if (!checkObject(location) ||
      !checkObject(value)) {
      throw new TypeError(`${name}v(WebGLUniformLocation, Array)`)
    } else if (!location) {
      return false
    } else if (!this._checkLocationActive(location)) {
      return false
    } else if (typeof value !== 'object' || !value || typeof value.length !== 'number') {
      throw new TypeError(`Second argument to ${name} must be array`)
    } else if (uniformTypeSize(location._activeInfo.type) > count) {
      this.setError(gl.INVALID_OPERATION)
      return false
    }
    return true
  }

  _checkUniformValueWithOffsetValid(location, value, name, count, offsetStart, offsetLength) {
    if (!isDebugMode) {
      return true
    }

    if (!this._locationTypeNameCountChecks(location, value, name, count)) {
      return false
    } else if (offsetStart < 0 ||
      offsetLength < 0 ||
      offsetStart >= value.length ||
      offsetLength > value.length) {
      this.setError(gl.INVALID_VALUE)
      return false
    } else if (value.length >= count &&
      offsetStart + offsetLength <= value.length &&
      offsetLength % count === 0) {
      if (location._array) {
        return true
      } else if (value.length === count) {
        return true
      }
    }
    this.setError(gl.INVALID_VALUE)
    return false
  }

  _locationTypeNameCountChecks(location, value, name, count) {
    if (!checkObject(location) ||
      !checkObject(value)) {
      throw new TypeError(`${name}v(WebGLUniformLocation, Array)`)
    } else if (!location) {
      return false
    } else if (!this._checkLocationActive(location)) {
      return false
    } else if (typeof value !== 'object' || !value || typeof value.length !== 'number') {
      throw new TypeError(`Second argument to ${name} must be array`)
    } else if (uniformTypeSize(location._activeInfo.type) > count) {
      this.setError(gl.INVALID_OPERATION)
      return false
    }
    return true
  }

  uniform1f(location, v0) {
    // printStackTraceWithArgs(arguments)
    // if (!this._checkUniformValid(location, v0, 'uniform1f', 1, 'f')) return
    super.uniform1f(location._ | 0, v0)
  }

  uniform1fv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs()

    if (arguments.length === 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform1fv', 1, 'f')) return
      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && i < value.length; ++i) {
          const loc = locs[i]
          super.uniform1f(loc, value[i])
        }
        return
      }
      super.uniform1f(location._ | 0, value[0])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform1fv', 1, srcOffset, srcLength)
    }
  }

  uniform1i(location, v0) {
    printStackTraceWithArgs(arguments)

    if (!this._checkUniformValid(location, v0, 'uniform1i', 1, 'i')) return
    super.uniform1i(location._ | 0, v0)
  }

  uniform1iv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    if (arguments.length == 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform1iv', 1, 'i')) return
      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && i < value.length; ++i) {
          const loc = locs[i]
          super.uniform1i(loc, value[i])
        }
        return
      }
      this.uniform1i(location, value[0])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform1iv', 1, srcOffset, srcLength)
    }
  }

  uniform1ui(location, v0) {
    printStackTraceWithArgs(arguments)

    if (!this._checkUniformValid(location, v0, 'uniform1ui', 1, 'u')) return
    super.uniform1ui(location._ | 0, v0)
  }

  uniform1uiv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    if (arguments.length === 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform1uiv', 1, 'u')) return
      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && i < value.length; ++i) {
          const loc = locs[i]
          super.uniform1ui(loc, value[i])
        }
        return
      }
      this.uniform1ui(location, value[0])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform1uiv', 1, srcOffset, srcLength)
    }
  }

  uniform2f(location, v0, v1) {
    // printStackTraceWithArgs(arguments)

    // if (!this._checkUniformValid(location, v0, 'uniform2f', 2, 'f')) return
    super.uniform2f(location._ | 0, v0, v1)
  }

  uniform2fv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    if (arguments.length === 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform2fv', 2, 'f')) return
      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && 2 * i < value.length; ++i) {
          const loc = locs[i]
          super.uniform2f(loc, value[2 * i], value[(2 * i) + 1])
        }
        return
      }
      super.uniform2f(location._ | 0, value[0], value[1])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform2fv', 2, srcOffset, srcLength)
    }
  }

  uniform2i(location, v0, v1) {
    printStackTraceWithArgs(arguments)

    if (!this._checkUniformValid(location, v0, 'uniform2i', 2, 'i')) return
    super.uniform2i(location._ | 0, v0, v1)
  }

  uniform2iv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    if (arguments.length === 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform2iv', 2, 'i')) return
      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && 2 * i < value.length; ++i) {
          const loc = locs[i]
          super.uniform2i(loc, value[2 * i], value[2 * i + 1])
        }
        return
      }
      this.uniform2i(location, value[0], value[1])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform2iv', 2, srcOffset, srcLength)
    }
  }

  uniform2ui(location, v0, v1) {
    printStackTraceWithArgs(arguments)

    if (!this._checkUniformValid(location, v0, 'uniform2ui', 2, 'u')) return
    super.uniform2ui(location._ | 0, v0, v1)
  }

  uniform2uiv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    if (arguments.length === 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform2uiv', 2, 'u')) return
      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && 2 * i < value.length; ++i) {
          const loc = locs[i]
          super.uniform2ui(loc, value[2 * i], value[2 * i + 1])
        }
        return
      }
      this.uniform2ui(location, value[0], value[1])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform2uiv', 2, srcOffset, srcLength)
    }
  }

  uniform3f(location, v0, v1, v2) {
    printStackTraceWithArgs(arguments)

    if (!this._checkUniformValid(location, v0, 'uniform3f', 3, 'f')) return
    super.uniform3f(location._ | 0, v0, v1, v2)
  }

  uniform3fv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    if (arguments.length === 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform3fv', 3)) return

      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && 3 * i < value.length; ++i) {
          const loc = locs[i]
          super.uniform3f(loc, value[3 * i], value[3 * i + 1], value[3 * i + 2])
        }
        return
      }
      super.uniform3f(location._ | 0, value[0], value[1], value[2])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform3fv', 3, srcOffset, srcLength)
    }
  }

  uniform3i(location, v0, v1, v2) {
    printStackTraceWithArgs(arguments)

    if (!this._checkUniformValid(location, v0, 'uniform3i', 3, 'i')) return
    super.uniform3i(location._ | 0, v0, v1, v2)
  }

  uniform3ui(location, v0, v1, v2) {
    printStackTraceWithArgs(arguments)

    if (!this._checkUniformValid(location, v0, 'uniform3ui', 3, 'u')) return
    super.uniform3ui(location._ | 0, v0, v1, v2)
  }

  uniform3iv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    if (arguments.length === 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform3iv', 3, 'i')) return
      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && 3 * i < value.length; ++i) {
          const loc = locs[i]
          super.uniform3i(loc, value[3 * i], value[3 * i + 1], value[3 * i + 2])
        }
        return
      }
      this.uniform3i(location, value[0], value[1], value[2])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform3iv', 3, srcOffset, srcLength)
    }
  }

  uniform3uiv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    if (arguments.length === 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform3uiv', 3, 'u')) return
      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && 3 * i < value.length; ++i) {
          const loc = locs[i]
          super.uniform3ui(loc, value[3 * i], value[3 * i + 1], value[3 * i + 2])
        }
        return
      }
      this.uniform3ui(location, value[0], value[1], value[2])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform3uiv', 3, srcOffset, srcLength)
    }
  }

  uniform4f(location, v0, v1, v2, v3) {
    printStackTraceWithArgs(arguments)

    if (!this._checkUniformValid(location, v0, 'uniform4f', 4, 'f')) return
    super.uniform4f(location._ | 0, v0, v1, v2, v3)
  }

  uniform4fv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    if (arguments.length === 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform4fv', 4, 'f')) return
      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && 4 * i < value.length; ++i) {
          const loc = locs[i]
          super.uniform4f(loc, value[4 * i], value[4 * i + 1], value[4 * i + 2], value[4 * i + 3])
        }
        return
      }
      super.uniform4f(location._ | 0, value[0], value[1], value[2], value[3])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform4fv', 4, srcOffset, srcLength)
    }
  }

  uniform4i(location, v0, v1, v2, v3) {
    printStackTraceWithArgs(arguments)

    if (!this._checkUniformValid(location, v0, 'uniform4i', 4, 'i')) return
    super.uniform4i(location._ | 0, v0, v1, v2, v3)
  }

  uniform4iv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    if (arguments.length === 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform4iv', 4, 'i')) return
      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && 4 * i < value.length; ++i) {
          const loc = locs[i]
          super.uniform4i(loc, value[4 * i], value[4 * i + 1], value[4 * i + 2], value[4 * i + 3])
        }
        return
      }
      this.uniform4i(location, value[0], value[1], value[2], value[3])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform4iv', 4, srcOffset, srcLength)
    }
  }

  uniform4ui(location, v0, v1, v2, v3) {
    printStackTraceWithArgs(arguments)

    if (!this._checkUniformValid(location, v0, 'uniform4ui', 4, 'u')) return
    super.uniform4ui(location._ | 0, v0, v1, v2, v3)
  }

  uniform4uiv(location, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    if (arguments.length === 2) {
      if (!this._checkUniformValueValid(location, value, 'uniform4uiv', 4, 'u')) return
      if (location._array) {
        const locs = location._array
        for (let i = 0; i < locs.length && 4 * i < value.length; ++i) {
          const loc = locs[i]
          super.uniform4ui(loc, value[4 * i], value[4 * i + 1], value[4 * i + 2], value[4 * i + 3])
        }
        return
      }
      this.uniform4ui(location, value[0], value[1], value[2], value[3])
    } else {
      srcOffset |= 0
      srcLength |= 0

      this._uniformVectorOffset(location, value, 'uniform4uiv', 4, srcOffset, srcLength)
    }
  }

  // validate data for uniformMatrix
  // count is the number of rows for a square matrix
  // count is the number of elements for a non-square matrix
  _checkUniformMatrix(location, transpose, value, name, count) {
    printStackTraceWithArgs(arguments)

    // In production mode, we don't need to check for errors
    if (!isDebugMode) {
      return true
    }

    if (!checkObject(location) ||
      typeof value !== 'object') {
      throw new TypeError(`${name}(WebGLUniformLocation, Boolean, Array)`)
    } else if (!!transpose ||
      typeof value !== 'object' ||
      value === null ||
      !value.length ||
      value.length % count * count !== 0) {
      this.setError(gl.INVALID_VALUE)
      return false
    }
    if (!location) {
      return false
    }
    if (!this._checkLocationActive(location)) {
      return false
    }

    if ((value.length === count * count) || (value.length === count)) {
      return true
    } else if (location._array) {
      return true
    }
    this.setError(gl.INVALID_VALUE)
    return false
  }

  _uniformMatrix(location, transpose, value, srcOffset, srcLength, method, count) {
    srcOffset |= 0
    srcLength |= 0

    if (srcLength === 0) {
      srcLength = value.length - srcOffset
    }

    // if (srcLength % count !== 0 || srcLength > value.length) {
    //   this.setError(gl.INVALID_VALUE)
    //   return
    // }
    let dataArray
    if (value instanceof Float32Array) {
      if (srcOffset === 0 && srcLength === value.length) {
        // best case: no-op, already in the right shape
        dataArray = value
      } else {
        // no copy needed, just a view into the same underlying buffer
        dataArray = value.subarray(srcOffset, srcOffset + srcLength)
      }
    } else if (value instanceof ArrayBuffer) {
      // Fast path which skips copying if the data is a buffer
      dataArray = new Float32Array(value, srcOffset, srcLength)
    } else {
      // Slow path, copy the data into a new buffer
      dataArray = new Float32Array(value.slice(srcOffset, srcOffset + srcLength))
    }

    // if (!this._checkUniformMatrix(location, transpose, data, method, count)) return
    method.call(this, location._ | 0, !!transpose, dataArray)
  }

  uniformMatrix2fv(location, transpose, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    this._uniformMatrix(location, transpose, value, srcOffset, srcLength, super.uniformMatrix2fv, 4)
  }

  uniformMatrix2x3fv(location, transpose, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    this._uniformMatrix(location, transpose, value, srcOffset, srcLength, super.uniformMatrix2x3fv,
      6)
  }

  uniformMatrix2x4fv(location, transpose, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    this._uniformMatrix(location, transpose, value, srcOffset, srcLength, super.uniformMatrix2x4fv,
      8)
  }

  uniformMatrix3fv(location, transpose, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    this._uniformMatrix(location, transpose, value, srcOffset, srcLength, super.uniformMatrix3fv,
      9)
  }

  uniformMatrix3x2fv(location, transpose, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    this._uniformMatrix(location, transpose, value, srcOffset, srcLength, super.uniformMatrix3x2fv,
      6)
  }

  uniformMatrix3x4fv(location, transpose, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    this._uniformMatrix(location, transpose, value, srcOffset, srcLength, super.uniformMatrix3x4fv,
      12)
  }

  uniformMatrix4fv(location, transpose, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    this._uniformMatrix(location, transpose, value, srcOffset, srcLength, super.uniformMatrix4fv,
      16)
  }

  uniformMatrix4x2fv(location, transpose, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    this._uniformMatrix(location, transpose, value, srcOffset, srcLength, super.uniformMatrix4x2fv,
      8)
  }

  uniformMatrix4x3fv(location, transpose, value, srcOffset = 0, srcLength = 0) {
    printStackTraceWithArgs(arguments)

    this._uniformMatrix(location, transpose, value, srcOffset, srcLength, super.uniformMatrix4x3fv,
      12)
  }

  vertexAttrib1f(index, v0) {
    printStackTraceWithArgs(arguments)

    index |= 0
    if (!this._checkVertexIndex(index)) return
    const data = this._vertexGlobalState._attribs[index]._data
    data[3] = 1
    data[1] = data[2] = 0
    data[0] = v0
    return super.vertexAttrib1f(index | 0, +v0)
  }

  vertexAttrib2f(index, v0, v1) {
    printStackTraceWithArgs(arguments)

    index |= 0
    if (!this._checkVertexIndex(index)) return
    const data = this._vertexGlobalState._attribs[index]._data
    data[3] = 1
    data[2] = 0
    data[1] = v1
    data[0] = v0
    return super.vertexAttrib2f(index | 0, +v0, +v1)
  }

  vertexAttrib3f(index, v0, v1, v2) {
    printStackTraceWithArgs(arguments)

    index |= 0
    if (!this._checkVertexIndex(index)) return
    const data = this._vertexGlobalState._attribs[index]._data
    data[3] = 1
    data[2] = v2
    data[1] = v1
    data[0] = v0
    return super.vertexAttrib3f(index | 0, +v0, +v1, +v2)
  }

  vertexAttrib4f(index, v0, v1, v2, v3) {
    printStackTraceWithArgs(arguments)

    index |= 0
    if (!this._checkVertexIndex(index)) return
    const data = this._vertexGlobalState._attribs[index]._data
    data[3] = v3
    data[2] = v2
    data[1] = v1
    data[0] = v0
    return super.vertexAttrib4f(index | 0, +v0, +v1, +v2, +v3)
  }

  vertexAttrib1fv(index, value) {
    printStackTraceWithArgs(arguments)

    if (typeof value !== 'object' || value === null || value.length < 1) {
      this.setError(gl.INVALID_VALUE)
      return
    }
    if (!this._checkVertexIndex(index)) return
    this._vertexGlobalState._attribs[index].castToTypedArray(gl.FLOAT)
    const data = this._vertexGlobalState._attribs[index]._data
    data[3] = 1
    data[2] = 0
    data[1] = 0
    data[0] = value[0]
    return super.vertexAttrib1f(index | 0, +value[0])
  }

  vertexAttrib2fv(index, value) {
    printStackTraceWithArgs(arguments)

    if (typeof value !== 'object' || value === null || value.length < 2) {
      this.setError(gl.INVALID_VALUE)
      return
    }
    if (!this._checkVertexIndex(index)) return
    const data = this._vertexGlobalState._attribs[index]._data
    data[3] = 1
    data[2] = 0
    data[1] = value[1]
    data[0] = value[0]
    return super.vertexAttrib2f(index | 0, +value[0], +value[1])
  }

  vertexAttrib3fv(index, value) {
    printStackTraceWithArgs(arguments)

    if (typeof value !== 'object' || value === null || value.length < 3) {
      this.setError(gl.INVALID_VALUE)
      return
    }
    if (!this._checkVertexIndex(index)) return
    const data = this._vertexGlobalState._attribs[index]._data
    data[3] = 1
    data[2] = value[2]
    data[1] = value[1]
    data[0] = value[0]
    return super.vertexAttrib3f(index | 0, +value[0], +value[1], +value[2])
  }

  vertexAttrib4fv(index, value) {
    printStackTraceWithArgs(arguments)

    if (typeof value !== 'object' || value === null || value.length < 4) {
      this.setError(gl.INVALID_VALUE)
      return
    }
    if (!this._checkVertexIndex(index)) return
    const data = this._vertexGlobalState._attribs[index]._data
    data[3] = value[3]
    data[2] = value[2]
    data[1] = value[1]
    data[0] = value[0]
    return super.vertexAttrib4f(index | 0, +value[0], +value[1], +value[2], +value[3])
  }
}

// Make the gl consts available as static properties
for (const [key, value] of Object.entries(gl)) {
  if (typeof value !== 'number') {
    continue
  }
  Object.assign(WebGL2RenderingContext, {[key]: value})
}

export {WebGL2RenderingContext, wrapContext, getNull}
