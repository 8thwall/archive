const { WebGLBuffer } = require('../webgl-buffer')
const {printStackTraceWithArgs} = require('../tools/debug-tools')

class WebGLContextBufferState {
  constructor (ctx) {
    this._ctx = ctx
    this._copy_read_buffer_binding = null
    this._copy_write_buffer_binding = null
    this._pixel_pack_buffer_binding = null
    this._pixel_unpack_buffer_binding = null
  }

  setBuffer (target, buffer) {
    printStackTraceWithArgs(arguments)

    if (buffer !== null && !(buffer instanceof WebGLBuffer)) {
      throw new TypeError('setBuffer(target, buffer)')
    }

    let current
    switch (target) {
      case this._ctx.COPY_READ_BUFFER:
        current = this._copy_read_buffer_binding
        this._copy_read_buffer_binding = buffer
        break
      case this._ctx.COPY_WRITE_BUFFER:
        current = this._copy_write_buffer_binding
        this._copy_write_buffer_binding = buffer
        break
      case this._ctx.PIXEL_PACK_BUFFER:
        current = this._pixel_pack_buffer_binding
        this._pixel_pack_buffer_binding = buffer
        break
      case this._ctx.PIXEL_UNPACK_BUFFER:
        current = this._pixel_unpack_buffer_binding
        this._pixel_unpack_buffer_binding = buffer
        break
      default:
        throw new Error('Invalid target')
    }
    if (current !== buffer) {
      if (current) {
        current._refCount -= 1
        current._checkDelete()
      }
      if (buffer) {
        buffer._refCount += 1
      }
    }
  }

  getBuffer (target) {
    printStackTraceWithArgs(arguments)

    switch (target) {
      case this._ctx.COPY_READ_BUFFER:
        return this._copy_read_buffer_binding
      case this._ctx.COPY_WRITE_BUFFER:
        return this._copy_write_buffer_binding
      case this._ctx.PIXEL_PACK_BUFFER:
        return this._pixel_pack_buffer_binding
      case this._ctx.PIXEL_UNPACK_BUFFER:
        return this._pixel_unpack_buffer_binding
      default:
        throw new Error('Invalid target')
    }
  }

  getBufferBinding (target) {
    printStackTraceWithArgs(arguments)

    switch (target) {
      case this._ctx.COPY_READ_BUFFER_BINDING:
        return this._copy_read_buffer_binding
      case this._ctx.COPY_WRITE_BUFFER_BINDING:
        return this._copy_write_buffer_binding
      case this._ctx.PIXEL_PACK_BUFFER_BINDING:
        return this._pixel_pack_buffer_binding
      case this._ctx.PIXEL_UNPACK_BUFFER_BINDING:
        return this._pixel_unpack_buffer_binding
      default:
        throw new Error('Invalid target')
    }
  }

  clearBinding (target) {
    printStackTraceWithArgs(arguments)

    switch (target) {
      case this._ctx.COPY_READ_BUFFER:
        this._copy_read_buffer_binding._binding = null
        break
      case this._ctx.COPY_WRITE_BUFFER:
        this._copy_write_buffer_binding._binding = null
        break
      case this._ctx.PIXEL_PACK_BUFFER:
        this._pixel_pack_buffer_binding._binding = null
        break
      case this._ctx.PIXEL_UNPACK_BUFFER:
        this._pixel_unpack_buffer_binding._binding = null
        break
      default:
        throw new Error('Invalid target')
    }
  }
}

export { WebGLContextBufferState }