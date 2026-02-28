const {printStackTraceWithArgs} = require('../tools/debug-tools')

/*
 *  Synchronize execution between the GL server and the client.
 */
class WebGLSync {
  constructor (_, ctx) {
    this._ = _ // Represents GLSync Pointer
    this._ctx = ctx
  }
}

class WebGLSyncGlobalState {
  constructor (ctx) {
    this._ctx = ctx

    // List of methods to override
    const methods = ['fenceSync', 'deleteSync', 'isSync', 'clientWaitSync', 'waitSync', 'getSyncParameter']

    // Store the original methods and override them
    if (!this._ctx.super) {
      this._ctx.super = {}
    }
    methods.forEach(method => {
      this._ctx.super[method] = ctx[method].bind(ctx)
      ctx[method] = this[method].bind(this)
    })

    this.maxTimeout = this._ctx.getParameter(this._ctx.MAX_CLIENT_WAIT_TIMEOUT_WEBGL)
  }

  fenceSync (condition, flags) {
    printStackTraceWithArgs(arguments)

    const syncPtr = this._ctx.super.fenceSync(condition, flags)
    const syncObj = new WebGLSync(syncPtr, this._ctx)
    return syncObj
  }

  deleteSync (sync) {
    printStackTraceWithArgs(arguments)

    if (sync._ctx._ !== this._ctx._) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
    }

    this._ctx.super.deleteSync(sync._)
  }

  isSync (sync) {
    printStackTraceWithArgs(arguments)

    if (!sync) {
      return false
    }

    return this._ctx.super.isSync(sync._)
  }

  clientWaitSync (sync, flags, timeout) {
    printStackTraceWithArgs(arguments)

    if (sync._ctx._ !== this._ctx._) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }

    if (timeout < 0 || timeout > this.maxTimeout) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }

    return this._ctx.super.clientWaitSync(sync._, flags, timeout)
  }

  waitSync (sync, flags, timeout) {
    if (sync._ctx._ !== this._ctx._) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
    }

    this._ctx.super.waitSync(sync._, flags, timeout)
  }

  getSyncParameter (sync, pname) {
    printStackTraceWithArgs(arguments)

    if (sync._ctx._ !== this._ctx._) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
    }

    return this._ctx.super.getSyncParameter(sync._, pname)
  }
}

export { WebGLSync, WebGLSyncGlobalState }
