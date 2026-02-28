const { vertexCount } = require('../utils')
const {printStackTraceWithArgs} = require('../tools/debug-tools')

class InstancedArrays {
  constructor (gl) {
    this.ctx = gl

    // List of methods to override
    const methods = ['drawArraysInstanced', 'drawElementsInstanced', 'vertexAttribDivisor']

    // Store the original methods and override them
    if (!this.ctx.super) {
      this.ctx.super = {}
    }
    methods.forEach(method => {
      this.ctx.super[method] = gl[method].bind(gl)
      gl[method] = this[method].bind(this)
    })
  }

  drawArraysInstanced (mode, first, count, primCount) {
    printStackTraceWithArgs(arguments)
    
    const { ctx } = this
    mode |= 0
    first |= 0
    count |= 0
    primCount |= 0
    if (first < 0 || count < 0 || primCount < 0) {
      ctx.setError(ctx.INVALID_VALUE)
      return
    }
    if (!ctx._checkStencilState()) {
      return
    }
    const reducedCount = vertexCount(mode, count)
    if (reducedCount < 0) {
      ctx.setError(ctx.INVALID_ENUM)
      return
    }
    if (!ctx._drawFramebufferOk()) {
      return
    }
    if (count === 0 || primCount === 0) {
      return
    }
    let maxIndex = first
    if (count > 0) {
      maxIndex = (count + first - 1) >>> 0
    }
    if (this.checkInstancedVertexAttribState(maxIndex, primCount)) {
      return ctx.super.drawArraysInstanced(mode, first, reducedCount, primCount)
    }
  }

  drawElementsInstanced (mode, count, type, ioffset, primCount) {
    printStackTraceWithArgs(arguments)

    const { ctx } = this
    mode |= 0
    count |= 0
    type |= 0
    ioffset |= 0
    primCount |= 0

    if (count < 0 || ioffset < 0 || primCount < 0) {
      ctx.setError(ctx.INVALID_VALUE)
      return
    }

    if (!ctx._checkStencilState()) {
      return
    }

    const elementBuffer = ctx._vertexObjectState._elementArrayBufferBinding
    if (!elementBuffer) {
      ctx.setError(ctx.INVALID_OPERATION)
      return
    }

    // Unpack element data
    let elementData = null
    let offset = ioffset
    if (type === ctx.UNSIGNED_SHORT) {
      if (offset % 2) {
        ctx.setError(ctx.INVALID_OPERATION)
        return
      }
      offset >>= 1
      elementData = new Uint16Array(elementBuffer._elements.buffer)
    } else if (type === ctx.UNSIGNED_INT) {
      if (offset % 4) {
        ctx.setError(ctx.INVALID_OPERATION)
        return
      }
      offset >>= 2
      elementData = new Uint32Array(elementBuffer._elements.buffer)
    } else if (type === ctx.UNSIGNED_BYTE) {
      elementData = elementBuffer._elements
    } else {
      ctx.setError(ctx.INVALID_ENUM)
      return
    }

    let reducedCount = count
    switch (mode) {
      case ctx.TRIANGLES:
        if (count % 3) {
          reducedCount -= (count % 3)
        }
        break
      case ctx.LINES:
        if (count % 2) {
          reducedCount -= (count % 2)
        }
        break
      case ctx.POINTS:
        break
      case ctx.LINE_LOOP:
      case ctx.LINE_STRIP:
        if (count < 2) {
          ctx.setError(ctx.INVALID_OPERATION)
          return
        }
        break
      case ctx.TRIANGLE_FAN:
      case ctx.TRIANGLE_STRIP:
        if (count < 3) {
          ctx.setError(ctx.INVALID_OPERATION)
          return
        }
        break
      default:
        ctx.setError(ctx.INVALID_ENUM)
        return
    }

    if (!ctx._drawFramebufferOk()) {
      return
    }

    if (count === 0 || primCount === 0) {
      this.checkInstancedVertexAttribState(0, 0)
      return
    }

    if ((count + offset) >>> 0 > elementData.length) {
      ctx.setError(ctx.INVALID_OPERATION)
      return
    }

    // Compute max index
    let maxIndex = -1
    for (let i = offset; i < offset + count; ++i) {
      maxIndex = Math.max(maxIndex, elementData[i])
    }

    if (maxIndex < 0) {
      this.checkInstancedVertexAttribState(0, 0)
      return
    }

    if (this.checkInstancedVertexAttribState(maxIndex, primCount)) {
      if (reducedCount > 0) {
        ctx.super.drawElementsInstanced(mode, reducedCount, type, ioffset, primCount)
      }
    }
  }

  vertexAttribDivisor (index, divisor) {
    printStackTraceWithArgs(arguments)

    const { ctx } = this

    index |= 0
    divisor |= 0
    if (divisor < 0 ||
      index < 0 || index >= ctx._vertexObjectState._attribs.length) {
      ctx.setError(ctx.INVALID_VALUE)
      return
    }
    const attrib = ctx._vertexObjectState._attribs[index]
    attrib._divisor = divisor
    ctx.super.vertexAttribDivisor(index, divisor)
  }

  checkInstancedVertexAttribState (maxIndex, primCount) {
    printStackTraceWithArgs(arguments)

    const { ctx } = this
    const program = ctx._activeProgram
    if (!program) {
      ctx.setError(ctx.INVALID_OPERATION)
      return false
    }

    const attribs = ctx._vertexObjectState._attribs
    let hasZero = false
    for (let i = 0; i < attribs.length; ++i) {
      const attrib = attribs[i]
      if (attrib._isPointer) {
        const buffer = attrib._pointerBuffer
        if (program._attributes.indexOf(i) >= 0) {
          if (!buffer) {
            ctx.setError(ctx.INVALID_OPERATION)
            return false
          }
          let maxByte = 0
          if (attrib._divisor === 0) {
            hasZero = true
            maxByte = attrib._pointerStride * maxIndex +
              attrib._pointerSize +
              attrib._pointerOffset
          } else {
            maxByte = attrib._pointerStride * (Math.ceil(primCount / attrib._divisor) - 1) +
              attrib._pointerSize +
              attrib._pointerOffset
          }
          if (maxByte > buffer._size) {
            ctx.setError(ctx.INVALID_OPERATION)
            return false
          }
        }
      }
    }

    if (!hasZero) {
      ctx.setError(ctx.INVALID_OPERATION)
      return false
    }

    return true
  }
}

export { InstancedArrays }
