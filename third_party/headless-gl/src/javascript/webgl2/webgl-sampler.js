const {printStackTraceWithArgs} = require('../tools/debug-tools')

/*
 *  A Sampler Object that stores the sampling parameters for a Texture access inside of a shader.
 */
class WebGLSampler {
  constructor (_, ctx) {
    this._ = _
    this._ctx = ctx
    this._pendingDelete = false
    this._invalidated = false
    this._boundTextureUnits = []
  }
}

class WebGLSamplerGlobalState {
  constructor (ctx) {
    this._ctx = ctx

    // List of methods to override
    const methods = ['createSampler', 'deleteSampler', 'isSampler', 'bindSampler', 'samplerParameteri', 'samplerParameterf', 'getSamplerParameter']

    // Store the original methods and override them
    if (!this._ctx.super) {
      this._ctx.super = {}
    }
    methods.forEach(method => {
      this._ctx.super[method] = ctx[method].bind(ctx)
      ctx[method] = this[method].bind(this)
    })
    
    this._boundSamplers = new Array(ctx.getParameter(ctx.MAX_COMBINED_TEXTURE_IMAGE_UNITS)).fill(null)
  }

  createSampler () {
    printStackTraceWithArgs(arguments)

    const samplerPtr = this._ctx.super.createSampler()
    const samplerObj = new WebGLSampler(samplerPtr, this._ctx)
    return samplerObj
  }

  deleteSampler (sampler) {
    printStackTraceWithArgs(arguments)

    if (this._ctx._ !== sampler._ctx._) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
    }

    if (sampler._pendingDelete) {
      return
    }

    this._ctx.super.deleteSampler(sampler._)

    for (const unit of sampler._boundTextureUnits) {
      this.bindSampler(unit, null)
    }
    sampler._pendingDelete = true
    sampler._ = 0
  }

  isSampler (sampler) {
    printStackTraceWithArgs(arguments)

    if (!sampler || sampler._invalidated) {
      return false
    }

    return this._ctx.super.isSampler(sampler._)
  }

  bindSampler (unit, sampler) {
    printStackTraceWithArgs(arguments)

    if (sampler && (this._ctx._ !== sampler._ctx._ || sampler._pendingDelete)) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
    }

    if (unit >= this._ctx.getParameter(this._ctx.MAX_COMBINED_TEXTURE_IMAGE_UNITS)) {
      this._ctx.setError(this._ctx.INVALID_VALUE)
    }

    this._ctx.super.bindSampler(unit, sampler ? sampler._ : 0)

    if (sampler) {
      sampler._boundTextureUnits.push(unit)
      this._boundSamplers[unit] = sampler
    } else {
      this._boundSamplers[unit] = null
    }
  }

  samplerParameteri (sampler, pname, param) {
    printStackTraceWithArgs(arguments)

    switch (pname) {
      case this._ctx.TEXTURE_MIN_FILTER:
      case this._ctx.TEXTURE_MAG_FILTER:
      case this._ctx.TEXTURE_WRAP_S:
      case this._ctx.TEXTURE_WRAP_T:
      case this._ctx.TEXTURE_WRAP_R:
      case this._ctx.TEXTURE_COMPARE_MODE:
      case this._ctx.TEXTURE_COMPARE_FUNC:
        break
      default:
        this._ctx.setError(this._ctx.INVALID_ENUM)
        return
    }

    if ((pname === this._ctx.TEXTURE_WRAP_S || pname === this._ctx.TEXTURE_WRAP_T || pname === this._ctx.TEXTURE_WRAP_R) &&
      (param !== this._ctx.REPEAT && param !== this._ctx.CLAMP_TO_EDGE && param !== this._ctx.MIRRORED_REPEAT)) {
      this._ctx.setError(this._ctx.INVALID_ENUM)
      return
    }

    if (this._ctx._ !== sampler._ctx._ || sampler._pendingDelete) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }

    this._ctx.super.samplerParameteri(sampler._, pname, param)
  }

  samplerParameterf (sampler, pname, param) {
    printStackTraceWithArgs(arguments)

    switch (pname) {
      case this._ctx.TEXTURE_MIN_LOD:
      case this._ctx.TEXTURE_MAX_LOD:
        break
      default:
        if (this._ctx._extensions.ext_texture_filter_anisotropic &&
          pname === this._ctx._extensions.ext_texture_filter_anisotropic.TEXTURE_MAX_ANISOTROPY_EXT) {
          break
        }

        this._ctx.setError(this._ctx.INVALID_ENUM)
        return
    }

    if (this._ctx._ !== sampler._ctx._ || sampler._pendingDelete) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return
    }

    this._ctx.super.samplerParameterf(sampler._, pname, param)
  }

  getSamplerParameter (sampler, pname) {
    printStackTraceWithArgs(arguments)

    switch (pname) {
      case this._ctx.TEXTURE_MIN_FILTER:
      case this._ctx.TEXTURE_MIN_LOD:
      case this._ctx.TEXTURE_MAG_FILTER:
      case this._ctx.TEXTURE_MAX_LOD:
      case this._ctx.TEXTURE_WRAP_S:
      case this._ctx.TEXTURE_WRAP_T:
      case this._ctx.TEXTURE_WRAP_R:
      case this._ctx.TEXTURE_COMPARE_MODE:
      case this._ctx.TEXTURE_COMPARE_FUNC:
        break
      default:
        if (this._ctx._extensions.ext_texture_filter_anisotropic &&
          pname === this._ctx._extensions.ext_texture_filter_anisotropic.TEXTURE_MAX_ANISOTROPY_EXT) {
          break
        }
        this._ctx.setError(this._ctx.INVALID_ENUM)
        return null
    }

    if (!sampler || this._ctx._ !== sampler._ctx._ || sampler._pendingDelete) {
      this._ctx.setError(this._ctx.INVALID_OPERATION)
      return null
    }

    return this._ctx.super.getSamplerParameter(sampler._, pname)
  }
}

export { WebGLSampler, WebGLSamplerGlobalState }
