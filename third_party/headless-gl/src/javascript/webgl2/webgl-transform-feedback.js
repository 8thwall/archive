const { WebGLBuffer } = require('../webgl-buffer')
const {printStackTraceWithArgs} = require('../tools/debug-tools')

/*
 *  The underlying object is created as if by calling glGenTransformFeedbacks,
 *  bound as if by calling glBindTransformFeedback
 *  and destroyed as if by calling glDeleteTransformFeedbacks
 */
class WebGLTransformFeedback {
  constructor (_, ctx) {
    this._ = _
    this._ctx = ctx
  }
}

class WebGLTransformFeedbackGlobalState {
  constructor (ctx) {
    const numAttribs = ctx.getParameter(ctx.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)
    this._ctx = ctx
    this._defaultTransformFeedback = null
    this._canUseDefaultTransformFeedback = true
    this._genericBuffer = null
    this._indexedBuffers = new Array(numAttribs).fill(null)
    this._transformFeedbackBufferBinding = null
    this._transformFeedbackBinding = null
    this._transformFeedbacks = new Set()

    // Active Transform Feedback
    this._activeTransformFeedback = false
    this._activePrimitiveMode = null
  }

  // Used for the generic binding point
  setTransformFeedbackBuffer (buffer) {
    if (buffer !== null && !(buffer instanceof WebGLBuffer)) {
      throw new TypeError('setTransformFeedbackBuffer(WebGLBuffer?)')
    }
    const current = this._transformFeedbackBufferBinding
    if (current !== buffer) {
      if (current) {
        current._refCount -= 1
        current._checkDelete()
      }
      if (buffer) {
        buffer._refCount += 1
      }
      this._genericBuffer = buffer
      this._transformFeedbackBufferBinding = buffer
    }
  }

  // Used for the indexed / attrib binding point
  setTransformFeedbackIndexedBuffer (buffer, index) {
    printStackTraceWithArgs(arguments)

    if (buffer !== null && !(buffer instanceof WebGLBuffer)) {
      throw new TypeError('setTransformFeedbackBuffer(WebGLBuffer?, GLuint)')
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

    const current = this._transformFeedbackBufferBinding
    if (current !== buffer) {
      if (current) {
        current._refCount -= 1
        current._checkDelete()
      }
      if (buffer) {
        buffer._refCount += 1
      }
    }
    this._transformFeedbackBufferBinding = buffer
    this._indexedBuffers[index] = buffer
  }

  addTransformFeedback (transformFeedback) {
    printStackTraceWithArgs(arguments)

    this._transformFeedbacks.add(transformFeedback)
  }

  bindTransformFeedback (transformFeedback) {
    printStackTraceWithArgs(arguments)

    this._transformFeedbackBinding = transformFeedback
  }

  getTransformFeedbackBinding () {
    printStackTraceWithArgs(arguments)

    return this._transformFeedbackBinding
  }

  getDefaultTransformFeedback () {
    printStackTraceWithArgs(arguments)

    if (this._defaultTransformFeedback === null && this._canUseDefaultTransformFeedback) {
      this._defaultTransformFeedback = this._ctx.createTransformFeedback()
    }
    return this._defaultTransformFeedback
  }

  hasActiveTransformFeedback () {
    printStackTraceWithArgs(arguments)

    for (let i = 0; i < this._indexedBuffers.length; i++) {
      if (this._indexedBuffers[i] !== null) {
        return true
      }
    }
    return false
  }

  removeTransformFeedback (transformFeedback) {
    printStackTraceWithArgs(arguments)

    if (this._transformFeedbackBinding === transformFeedback) {
      this.unbindTransformFeedback()
    }
    this._transformFeedbacks.delete(transformFeedback)
  }

  unbindTransformFeedback () {
    printStackTraceWithArgs(arguments)

    this._transformFeedbackBinding = null
    if (this._transformFeedbackBufferBinding) {
      this._transformFeedbackBufferBinding._binding = 0
      this._transformFeedbackBufferBinding = null
    }
  }
}

export { WebGLTransformFeedback, WebGLTransformFeedbackGlobalState }
