const {printStackTraceWithArgs} = require('../tools/debug-tools')
const {WebGLTexture} = require('../webgl-texture')

// See: https://github.com/KhronosGroup/WebGL/pull/3342/files
// https://registry.khronos.org/OpenGL/extensions/EXT/EXT_multisampled_render_to_texture.txt
class WebGLMultisampledRenderToTexture {
  constructor (ctx) {
    this._ctx = ctx

    // List of methods to override
    const methods = ['renderbufferStorageMultisampleEXT']

    // Store the original methods and override them
    if (!this._ctx.super) {
      this._ctx.super = {}
    }
    methods.forEach(method => {
      this._ctx.super[method] = ctx[method].bind(ctx)
      ctx[method] = this[method].bind(this)
    })

    this.RENDERBUFFER_SAMPLES_EXT = 0x8CAB
    this.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE_EXT = 0x8D56
    this.MAX_SAMPLES_EXT = 0x8D57
    this.FRAMEBUFFER_ATTACHMENT_TEXTURE_SAMPLES_EXT = 0x8D6C
  }

  renderbufferStorageMultisampleEXT(target, samples, internalFormat, width, height) {
    printStackTraceWithArgs(arguments)

    target |= 0
    samples |= 0
    internalFormat |= 0
    width |= 0
    height |= 0

    if (target !== this._ctx.RENDERBUFFER) {
      this._ctx.setError(this._ctx.INVALID_ENUM)
      return
    }

    const renderbuffer = this._ctx._activeRenderbuffer
    if (!renderbuffer) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }

    switch (internalFormat) {
      case this._ctx.R8:
      case this._ctx.R8_UI:
      case this._ctx.R8I:
      case this._ctx.R16UI:
      case this._ctx.R16I:
      case this._ctx.R32UI:
      case this._ctx.R32I:
      case this._ctx.RG8:
      case this._ctx.RG8_UI:
      case this._ctx.RG8I:
      case this._ctx.RG16UI:
      case this._ctx.RG16I:
      case this._ctx.RG32UI:
      case this._ctx.RG32I:
      case this._ctx.RGB8:
      case this._ctx.RGB565:
      case this._ctx.RGBA8:
      case this._ctx.SRGB8_ALPHA8:
      case this._ctx.RGB5_A1:
      case this._ctx.RGBA4:
      case this._ctx.RGB10_A2:
      case this._ctx.RGBA8UI:
      case this._ctx.RGBA8I:
      case this._ctx.RGB10_A2UI:
      case this._ctx.RGBA16UI:
      case this._ctx.RGBA16I:
      case this._ctx.RGBA32I:
      case this._ctx.RGBA32UI:
      case this._ctx.DEPTH_STENCIL:
      case this._ctx.DEPTH_COMPONENT16:
      case this._ctx.DEPTH_COMPONENT24:
      case this._ctx.DEPTH_COMPONENT32F:
      case this._ctx.DEPTH24_STENCIL8:
      case this._ctx.DEPTH32F_STENCIL8:
      case this._ctx.STENCIL_INDEX8:
        break
      case this._ctx.R16F:
      case this._ctx.R32F:
      case this._ctx.RG16F:
      case this._ctx.RG32F:
      case this._ctx.RGBA16F:
      case this._ctx.RGBA32F:
      case this._ctx.R11F_G11F_B10F:
        if (this._ctx._extensions.ext_color_buffer_float) {
          break
        }
      default:
        this._ctx.setError(this._ctx.INVALID_ENUM)
        return
    }

    if (internalFormat === this._ctx.DEPTH_STENCIL && samples > 0) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }

    this._ctx._saveError()
    this._ctx.super.renderbufferStorageMultisampleEXT(
      target,
      samples,
      internalFormat,
      width,
      height
    )
    const error = this._ctx.getError()
    this._ctx._restoreError(error)
    if (error !== this._ctx.NO_ERROR) {
      return
    }

    renderbuffer._width = width
    renderbuffer._height = height
    renderbuffer._format = internalFormat
    renderbuffer._samples = samples

    // Store the app provided samples value, so it can be restored later
    this._ctx._attachmentObjToSampleCount.set(renderbuffer, samples)

    const checkUpdateFrameBufferAttachment = (frameBuffer) => {
      let needsUpdate = false
      const attachments = this._ctx._getAttachments()
      for (let i = 0; i < attachments.length; ++i) {
        if (frameBuffer._attachments[attachments[i]] === renderbuffer) {
          needsUpdate = true
          break
        }
      }
      if (needsUpdate) {
        this._ctx._updateFramebufferAttachments(frameBuffer)
      }
    }

    if (this._ctx._drawFramebuffer) {
      checkUpdateFrameBufferAttachment(this._ctx._drawFramebuffer)
    }
    if (this._ctx._readFramebuffer) {
      checkUpdateFrameBufferAttachment(this._ctx._readFramebuffer)
    }
  }

  framebufferTexture2DMultisampleEXT(target, attachment, textarget, texture, level, samples) {
    printStackTraceWithArgs(arguments)

    let framebuffer = null
    if (target === this._ctx.FRAMEBUFFER) {
      framebuffer = this._ctx._drawFramebuffer
    } else if (target === this._ctx.DRAW_FRAMEBUFFER) {
      framebuffer = this._ctx._drawFramebuffer
    } else if (target === this._ctx.READ_FRAMEBUFFER) {
      framebuffer = this._ctx._readFramebuffer
    }

    if (!framebuffer) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }

    if (!this._ctx._checkWrapper(texture, WebGLTexture)) {
      return
    }

    framebuffer._setAttachment(texture, attachment)
    framebuffer._attachmentLevel[attachment] = level
    framebuffer._attachmentFace[attachment] = textarget
    texture._samples = samples

    // Store the app provided samples value, so it can be restored later
    this._ctx._attachmentObjToSampleCount.set(texture, samples)

    this._ctx._updateFramebufferAttachments(framebuffer)
  }
}

function getWebGLMultisampledRenderToTexture(context) {
  let result = null
  const exts = context.getSupportedExtensions()

  if (exts && exts.indexOf('WEBGL_multisampled_render_to_texture') >= 0) {
    result = new WebGLMultisampledRenderToTexture(context)
  }

  return result
}

export {getWebGLMultisampledRenderToTexture, WebGLMultisampledRenderToTexture}
