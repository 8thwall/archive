const {printStackTraceWithArgs} = require('../tools/debug-tools')

class WebGLMultipleRenderTargets {
  constructor (ctx) {
    this._ctx = ctx
    this._buffersState = [ctx.BACK]

    // List of methods to override
    const methods = ['drawBuffers', 'clearBufferfv', 'clearBufferiv', 'clearBufferuiv', 'clearBufferfi']
    
    // Store the original methods and override them
    if (!this._ctx.super) {
      this._ctx.super = {}
    }

    methods.forEach(method => {
      this._ctx.super[method] = ctx[method].bind(ctx)
      ctx[method] = this[method].bind(this)
    })

    this._maxDrawBuffers = ctx.getParameter(ctx.MAX_DRAW_BUFFERS)

    this.ALL_ATTACHMENTS = []
    this.ALL_COLOR_ATTACHMENTS =
    [
      ctx.COLOR_ATTACHMENT0,
      ctx.COLOR_ATTACHMENT1,
      ctx.COLOR_ATTACHMENT2,
      ctx.COLOR_ATTACHMENT3,
      ctx.COLOR_ATTACHMENT4,
      ctx.COLOR_ATTACHMENT5,
      ctx.COLOR_ATTACHMENT6,
      ctx.COLOR_ATTACHMENT7,
      ctx.COLOR_ATTACHMENT8,
      ctx.COLOR_ATTACHMENT9,
      ctx.COLOR_ATTACHMENT10,
      ctx.COLOR_ATTACHMENT11,
      ctx.COLOR_ATTACHMENT12,
      ctx.COLOR_ATTACHMENT13,
      ctx.COLOR_ATTACHMENT14,
      ctx.COLOR_ATTACHMENT15,
    ]

    this.ALL_ATTACHMENTS = this.ALL_COLOR_ATTACHMENTS.slice(0, this._maxDrawBuffers)
    this.ALL_ATTACHMENTS.push(
      ctx.DEPTH_ATTACHMENT,
      ctx.STENCIL_ATTACHMENT,
      ctx.DEPTH_STENCIL_ATTACHMENT
    )

    this.DEFAULT_COLOR_ATTACHMENTS = [ctx.COLOR_ATTACHMENT0]
  }

  drawBuffers (buffers) {
    printStackTraceWithArgs(arguments)

    if (buffers.length < 1) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }
    if (buffers.length === 1 && buffers[0] === this._ctx.BACK) {
      this._buffersState = buffers
      this._ctx.super.drawBuffers(this.DEFAULT_COLOR_ATTACHMENTS)
      return
    } else if (!this._ctx._drawFramebuffer) {
      if (buffers.length > 1) {
        this._ctx.setError(this._ctx.INVALID_OPERATION)
        return
      }
      for (let i = 0; i < buffers.length; i++) {
        if (buffers[i] > this._ctx.NONE) {
          this._ctx.setError(this._ctx.INVALID_OPERATION)
          return
        }
      }
    }
    this._buffersState = buffers
    this._ctx.super.drawBuffers(buffers)
  }

  clearBufferfv (buffer, drawBuffer, values) {
    printStackTraceWithArgs(arguments)

    if (buffer !== this._ctx.COLOR && buffer !== this._ctx.DEPTH) {
      this._ctx.setError(this._ctx.INVALID_ENUM)
      return
    }
    if (!(values instanceof Float32Array)) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }
    if (drawBuffer < 0 || (buffer === this._ctx.COLOR && drawBuffer >= this._maxDrawBuffers) || (buffer === this._ctx.DEPTH && drawBuffer !== 0)) {
      this._ctx.setError(this._ctx.INVALID_VALUE)
      return
    }
    this._ctx.super.clearBufferfv(buffer, drawBuffer, values)
  }

  clearBufferiv (buffer, drawBuffer, values) {
    printStackTraceWithArgs(arguments)

    if (buffer !== this._ctx.COLOR && buffer !== this._ctx.STENCIL) {
      this._ctx.setError(this._ctx.INVALID_ENUM)
      return
    }
    if (!(values instanceof Int32Array)) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }
    if (drawBuffer < 0 || (buffer === this._ctx.COLOR && drawBuffer >= this._maxDrawBuffers) || (buffer === this._ctx.STENCIL && drawBuffer != 0)) {
      this._ctx.setError(this._ctx.INVALID_VALUE)
      return
    }
    this._ctx.super.clearBufferiv(buffer, drawBuffer, values)
  }

  clearBufferuiv (buffer, drawBuffer, values) {
    if (buffer !== this._ctx.COLOR) {
      this._ctx.setError(this._ctx.INVALID_ENUM)
      return
    }
    if (!(values instanceof Uint32Array)) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }
    if (drawBuffer < 0 || (buffer === this._ctx.COLOR && drawBuffer >= this._maxDrawBuffers)) {
      this._ctx.setError(this._ctx.INVALID_VALUE)
      return
    }
    this._ctx.super.clearBufferuiv(buffer, drawBuffer, values)
  }

  clearBufferfi (buffer, drawBuffer, depth, stencil) {
    printStackTraceWithArgs(arguments)

    if (buffer !== this._ctx.DEPTH_STENCIL) {
      this._ctx.setError(this._ctx.INVALID_ENUM)
      return
    }
    if (drawBuffer < 0 || drawBuffer != 0) {
      this._ctx.setError(this._ctx.INVALID_VALUE)
      return
    }
    this._ctx.super.clearBufferfi(buffer, drawBuffer, depth, stencil)
  }
}

export {
  WebGLMultipleRenderTargets
}
