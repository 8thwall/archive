const { WebGLExport: { gl } } = require('./native-gl')
const { WebGLBuffer } = require('./webgl-buffer')

let _maxVertexAttribs = null
let _maxUniformBufferBindings = null

const getMaxVertexAttribs = (ctx) => {
  if (_maxVertexAttribs === null) {
    _maxVertexAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS)
  }
  return _maxVertexAttribs
}

const getMaxUniformBufferBindings = (ctx) => {
  if (_maxUniformBufferBindings === null) {
    _maxUniformBufferBindings = ctx.getParameter(ctx.MAX_UNIFORM_BUFFER_BINDINGS)
  }
  return _maxUniformBufferBindings
}

class WebGLVertexArrayObjectAttribute {
  constructor (ctx, idx) {
    this._ctx = ctx
    this._idx = idx
    this._clear()
  }

  _clear () {
    this._isPointer = false
    this._pointerBuffer = null
    this._pointerOffset = 0
    this._pointerSize = 0
    this._pointerStride = 0
    this._pointerType = gl.FLOAT
    this._pointerNormal = false
    this._divisor = 0
    this._inputSize = 4
    this._inputStride = 0
  }
}

class WebGLVertexArrayGlobalAttribute {
  constructor (idx) {
    this._idx = idx
    this._data = [0, 0, 0, 1]
  }

  castToTypedArray(type) {
    switch(type) {
        case gl.FLOAT:
            this._data = new Float32Array(this._data)
            break
        case gl.INT:
            this._data = new Int32Array(this._data)
            break
        case gl.UNSIGNED_INT:
            this._data = new Uint32Array(this._data)
            break
        default:
            throw new Error('Unsupported data type')
    }
  }
}

class WebGLVertexArrayObjectState {
  constructor (ctx) {
    const numAttribs = getMaxVertexAttribs(ctx)
    this._attribs = new Array(numAttribs)
    for (let i = 0; i < numAttribs; ++i) {
      this._attribs[i] = new WebGLVertexArrayObjectAttribute(ctx, i)
    }
    this._elementArrayBufferBinding = null
  }

  setElementArrayBuffer (buffer) {
    if (buffer !== null && !(buffer instanceof WebGLBuffer)) {
      throw new TypeError('setElementArrayBuffer(WebGLBuffer?)')
    }
    const current = this._elementArrayBufferBinding
    if (current !== buffer) {
      if (current) {
        current._refCount -= 1
        current._checkDelete()
      }
      if (buffer) {
        buffer._refCount += 1
      }
      this._elementArrayBufferBinding = buffer
    }
  }

  cleanUp () {
    const elementArrayBuffer = this._elementArrayBufferBinding
    if (elementArrayBuffer) {
      elementArrayBuffer._refCount -= 1
      elementArrayBuffer._checkDelete()
      this._elementArrayBufferBinding = null
    }

    for (let i = 0; i < this._attribs.length; ++i) {
      const attrib = this._attribs[i]
      if (attrib._pointerBuffer) {
        attrib._pointerBuffer._refCount -= 1
        attrib._pointerBuffer._checkDelete()
      }
      attrib._clear()
    }
  }

  releaseArrayBuffer (buffer) {
    if (!buffer) {
      return
    }
    for (let i = 0; i < this._attribs.length; ++i) {
      const attrib = this._attribs[i]
      if (attrib._pointerBuffer === buffer) {
        attrib._pointerBuffer._refCount -= 1
        attrib._pointerBuffer._checkDelete()
        attrib._clear()
      }
    }
  }

  setVertexAttribPointer (
    buffer,
    index,
    pointerSize,
    pointerOffset,
    pointerStride,
    pointerType,
    pointerNormal,
    inputStride,
    inputSize) {
    const attrib = this._attribs[index]
    if (buffer !== attrib._pointerBuffer) {
      if (attrib._pointerBuffer) {
        attrib._pointerBuffer._refCount -= 1
        attrib._pointerBuffer._checkDelete()
      }
      if (buffer) {
        buffer._refCount += 1
      }
      attrib._pointerBuffer = buffer
    }
    attrib._pointerSize = pointerSize
    attrib._pointerOffset = pointerOffset
    attrib._pointerStride = pointerStride
    attrib._pointerType = pointerType
    attrib._pointerNormal = pointerNormal
    attrib._inputStride = inputStride
    attrib._inputSize = inputSize
  }

  // TODO: Double check this
  setVertexAttribIPointer (
    buffer,
    index,
    pointerSize,
    pointerOffset,
    pointerStride,
    pointerType,
    inputStride,
    inputSize) {
    const attrib = this._attribs[index]
    if (buffer !== attrib._pointerBuffer) {
      if (attrib._pointerBuffer) {
        attrib._pointerBuffer._refCount -= 1
        attrib._pointerBuffer._checkDelete()
      }
      if (buffer) {
        buffer._refCount += 1
      }
      attrib._pointerBuffer = buffer
    }
    attrib._pointerSize = pointerSize
    attrib._pointerOffset = pointerOffset
    attrib._pointerStride = pointerStride
    attrib._pointerType = pointerType
    attrib._inputStride = inputStride
    attrib._inputSize = inputSize
  }
}

class WebGLVertexArrayGlobalState {
  constructor (ctx) {
    const numAttribs = getMaxVertexAttribs(ctx)
    this._attribs = new Array(numAttribs)
    for (let i = 0; i < numAttribs; ++i) {
      this._attribs[i] = new WebGLVertexArrayGlobalAttribute(i)
    }
    this._arrayBufferBinding = null
  }

  setArrayBuffer (buffer) {
    if (buffer !== null && !(buffer instanceof WebGLBuffer)) {
      throw new TypeError('setArrayBuffer(WebGLBuffer?)')
    }
    const current = this._arrayBufferBinding
    if (current !== buffer) {
      if (current) {
        current._refCount -= 1
        current._checkDelete()
      }
      if (buffer) {
        buffer._refCount += 1
      }
      this._arrayBufferBinding = buffer
    }
  }
}

// For WebGL2
class WebGLUniformBufferGlobalState {
  constructor (ctx) {
    const numBuffers = getMaxUniformBufferBindings(ctx)
    this._genericBuffer = null
    this._indexedBuffers = new Array(numBuffers).fill(null)
    this._uniformBufferBinding = null
  }

  // Used for the generic binding point
  setUniformBuffer (buffer) {
    if (buffer !== null && !(buffer instanceof WebGLBuffer)) {
      throw new TypeError('setUniformBuffer(WebGLBuffer?)')
    }
    const current = this._uniformBufferBinding
    if (current !== buffer) {
      if (current) {
        current._refCount -= 1
        current._checkDelete()
      }
      if (buffer) {
        buffer._refCount += 1
      }
      this._genericBuffer = buffer
      this._uniformBufferBinding = buffer
    }
  }

  setUniformIndexedBuffer (buffer, index) {
    if (buffer !== null && !(buffer instanceof WebGLBuffer)) {
      throw new TypeError('setUniformIndexedBuffer(WebGLBuffer?, GLuint)')
    }

    // unbind the buffer if it is null
    if (buffer === null) {
      if (this._indexedBuffers[index] !== null) {
        this._indexedBuffers[index]._refCount -= 1
        this._indexedBuffers[index]._checkDelete()
        this._indexedBuffers[index] = null
      }
      return
    }

    const current = this._uniformBufferBinding
    if (current !== buffer) {
      if (current) {
        current._refCount -= 1
        current._checkDelete()
      }
      if (buffer) {
        buffer._refCount += 1
      }
    }
    this._uniformBufferBinding = buffer
    this._indexedBuffers[index] = buffer
  }
}

export {
  WebGLUniformBufferGlobalState,
  WebGLVertexArrayObjectAttribute,
  WebGLVertexArrayGlobalAttribute,
  WebGLVertexArrayObjectState,
  WebGLVertexArrayGlobalState
}
