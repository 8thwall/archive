const {printStackTraceWithArgs} = require('../tools/debug-tools')

/*
 *  The WebGLQuery interface represents an OpenGL Query Object.
 *  The underlying object is created as if by calling glGenQueries,
 *  made active as if by calling glBeginQuery,
 *  concluded as if by calling glEndQuery and destroyed as if by calling glDeleteQueries.
 */
class WebGLQuery {
  constructor (_, ctx) {
    this._ = _
    this._ctx = ctx
    this._active = false
    this._activeTarget = null
    this._waitedFrameAfterEnd = false
  }
}

class WebGLQueryGlobalState {
  constructor (ctx) {
    this._ctx = ctx
    this._queries = {}

    // List of methods to override
    const methods = ['createQuery', 'deleteQuery', 'isQuery', 'beginQuery', 'endQuery', 'getQuery', 'getQueryParameter']

    // Store the original methods and override them
    if (!this._ctx.super) {
      this._ctx.super = {}
    }
    methods.forEach(method => {
      this._ctx.super[method] = ctx[method].bind(ctx)
      ctx[method] = this[method].bind(this)
    })
  }

  createQuery () {
    const queryId = this._ctx.super.createQuery()
    const queryObj = new WebGLQuery(queryId, this._ctx)
    this._queries[queryId] = queryObj
    return queryObj
  }

  deleteQuery (query) {
    printStackTraceWithArgs(arguments)

    if (query._ in this._queries) {
      this._ctx.super.deleteQuery(query._)
      delete this._queries[query._]

      if (query._active) {
        this.endQuery(query._activeTarget)
      }
    }
  }

  isQuery (query) {
    printStackTraceWithArgs(arguments)

    if (!query) {
      return false
    }

    return this._ctx.super.isQuery(query._)
  }

  beginQuery (target, query) {
    printStackTraceWithArgs(arguments)

    this._ctx.super.beginQuery(target, query._)
    query._active = true
    query._activeTarget = target
  }

  endQuery (target) {
    printStackTraceWithArgs(arguments)

    this._ctx._saveError()
    this._ctx.super.endQuery(target)
    const error = this._ctx.getError()
    this._ctx._restoreError(error)

    if (error !== this._ctx.NO_ERROR) {
      return
    }

    for (const queryId in this._queries) {
      const query = this._queries[queryId]
      if (query._active) {
        query._active = false
        query._activeTarget = null
        query._waitedFrameAfterEnd = false
        setTimeout(() => {
          query._waitedFrameAfterEnd = true
        }, 0)
      }
    }
  }

  getQuery (target, pname) {
    printStackTraceWithArgs(arguments)

    const queryId = this._ctx.super.getQuery(target, pname)
    if (queryId in this._queries) {
      return this._queries[queryId]
    }
    return null
  }

  getQueryParameter (query, pname) {
    printStackTraceWithArgs(arguments)

    if (pname !== this._ctx.QUERY_RESULT && pname !== this._ctx.QUERY_RESULT_AVAILABLE) {
      this._ctx.setError(this._ctx.INVALID_ENUM)
      return null
    }

    if (!(query instanceof WebGLQuery)) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return null
    }

    if (query._ctx._ != this._ctx._) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return null
    }

    if (!query._waitedFrameAfterEnd) {
      return null
    }

    return this._ctx.super.getQueryParameter(query._, pname)
  }
}

export { WebGLQuery, WebGLQueryGlobalState }
