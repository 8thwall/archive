const { Linkable } = require('../linkable')
const { checkObject } = require('../utils')
const { WebGLVertexArrayObjectState } = require('../webgl-vertex-attribute')
const {printStackTraceWithArgs} = require('../tools/debug-tools')

class WebGLVertexArrayObject extends Linkable {
  constructor (_, ctx, state) {
    super(_)
    this._ctx = ctx
    this._state = state
    this._vertexState = new WebGLVertexArrayObjectState(ctx)
  }

  _performDelete () {
    printStackTraceWithArgs(arguments)

    // Clean up the vertex state to release references to buffers.
    this._vertexState.cleanUp()

    delete this._vertexState
    delete this._state._vaos[this._]

    // NOTE(akashmahesh): Investigate why previous non-super call wasn't crashing
    this._ctx.super.deleteVertexArray(this._)
  }
}

class VertexArrayObject {
  constructor (ctx) {
    this._ctx = ctx
    this._vaos = {}
    this._activeVertexArrayObject = null

    // List of methods to override
    const methods = ['createVertexArray', 'deleteVertexArray', 'bindVertexArray', 'isVertexArray']

    // Store the original methods and override them
    if (!this._ctx.super) {
      this._ctx.super = {}
    }
    methods.forEach(method => {
      this._ctx.super[method] = ctx[method].bind(ctx)
      ctx[method] = this[method].bind(this)
    })
  }

  createVertexArray () {
    printStackTraceWithArgs(arguments)

    const arrayId = this._ctx.super.createVertexArray()
    if (arrayId <= 0) return null
    const array = new WebGLVertexArrayObject(arrayId, this._ctx, this)
    this._vaos[arrayId] = array
    return array
  }

  deleteVertexArray (array) {
    printStackTraceWithArgs(arguments)

    if (!checkObject(array)) {
      throw new TypeError('deleteVertexArray(WebGLVertexArrayObject)')
    }

    if (!(array instanceof WebGLVertexArrayObject &&
      this._ctx._checkOwns(array))) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }

    if (array._pendingDelete) {
      return
    }

    if (this._activeVertexArrayObject === array) {
      this.bindVertexArray(null)
    }

    array._pendingDelete = true
    array._checkDelete()
  }

  bindVertexArray (array) {
    printStackTraceWithArgs(arguments)

    const { _activeVertexArrayObject: activeVertexArrayObject } = this
    if (!checkObject(array)) {
      throw new TypeError('bindVertexArray(WebGLVertexArrayObject)')
    }

    if (!array) {
      array = null
      this._ctx.super.bindVertexArray(null)
    } else if (array instanceof WebGLVertexArrayObject && array._pendingDelete) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    } else if (this._ctx._checkWrapper(array, WebGLVertexArrayObject)) {
      this._ctx.super.bindVertexArray(array._)
    } else {
      return
    }

    if (activeVertexArrayObject !== array) {
      if (activeVertexArrayObject) {
        activeVertexArrayObject._refCount -= 1
        activeVertexArrayObject._checkDelete()
      }
      if (array) {
        array._refCount += 1
      }
    }

    if (array === null) {
      this._ctx._vertexObjectState = this._ctx._defaultVertexObjectState
    } else {
      this._ctx._vertexObjectState = array._vertexState
    }

    // Update the active vertex array object.
    this._activeVertexArrayObject = array
  }

  isVertexArray (object) {
    printStackTraceWithArgs(arguments)

    if (!this._ctx._isObject(object, 'isVertexArray', WebGLVertexArrayObject)) return false
    return this._ctx.super.isVertexArray(object._ | 0)
  }
}

export {
  WebGLVertexArrayObject,
  VertexArrayObject,
}
