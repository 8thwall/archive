// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Christoph Bartschat (christoph@8thwall.com)
// Wrapper for OpenGL context.  We cache the values of the WebGL context for performance purposes.

/* global WebGLVertexArrayObjectOES:readonly */

// NOTE(akul): This is a copy of context-wrapper.js from 'reality/app/xr/js/src/context-wrapper'.
// This copy is needed because the current build system setup which uses CommonJs exports
// does not allow for ES6 style exports which is needed to be built in omniscope-js
// TODO remove me, when the xr build system is upgraded

const objectHasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

const isVaoOES = vao => (
  (window.WebGLVertexArrayObjectOES && vao instanceof WebGLVertexArrayObjectOES) ||
  (vao.toString().includes('WebGLVertexArrayObjectOES'))
)

const createVertexObjectState = () => {
  const vao = {
    // gets bound on the global state.  Pointer to a WebGL buffer.
    elementArrayBufferBinding: null,

    // we are not actually caching the corresponding get attribs locations
    // attribs: [],
  }

  return vao
}

/* eslint-disable prefer-destructuring */
// eslint-disable-next-line
function contextWrapper(ctx, verbose = true) {
  const isWebGL2 = !!ctx.PIXEL_PACK_BUFFER
  let addedVertexArray = false

  const TEXTURE_TARGETS = {
    [ctx.TEXTURE_2D]: ctx.TEXTURE_BINDING_2D,
    [ctx.TEXTURE_CUBE_MAP]: ctx.TEXTURE_BINDING_CUBE_MAP,
  }
  if (isWebGL2) {
    Object.assign(TEXTURE_TARGETS, {
      [ctx.TEXTURE_3D]: ctx.TEXTURE_BINDING_3D,
      [ctx.TEXTURE_2D_ARRAY]: ctx.TEXTURE_BINDING_2D_ARRAY,
    })
  }

  const FRAMEBUFFER_TARGETS = {
    [ctx.FRAMEBUFFER]: ctx.FRAMEBUFFER_BINDING,
  }
  if (isWebGL2) {
    Object.assign(FRAMEBUFFER_TARGETS, {
      [ctx.DRAW_FRAMEBUFFER]: ctx.DRAW_FRAMEBUFFER_BINDING,
      [ctx.READ_FRAMEBUFFER]: ctx.READ_FRAMEBUFFER_BINDING,
    })
  }

  const BUFFER_TARGETS = {
    [ctx.ARRAY_BUFFER]: ctx.ARRAY_BUFFER_BINDING,
    [ctx.ELEMENT_ARRAY_BUFFER]: ctx.ELEMENT_ARRAY_BUFFER_BINDING,
  }
  if (isWebGL2) {
    Object.assign(BUFFER_TARGETS, {
      [ctx.COPY_READ_BUFFER]: ctx.COPY_READ_BUFFER_BINDING,
      [ctx.COPY_WRITE_BUFFER]: ctx.COPY_WRITE_BUFFER_BINDING,
      [ctx.TRANSFORM_FEEDBACK_BUFFER]: ctx.TRANSFORM_FEEDBACK_BUFFER_BINDING,
      [ctx.UNIFORM_BUFFER]: ctx.UNIFORM_BUFFER_BINDING,
      [ctx.PIXEL_PACK_BUFFER]: ctx.PIXEL_PACK_BUFFER_BINDING,
      [ctx.PIXEL_UNPACK_BUFFER]: ctx.PIXEL_UNPACK_BUFFER_BINDING,
    })
  }

  const ENABLE_ENUMS = new Set([
    ctx.BLEND,
    ctx.CULL_FACE,
    ctx.DEPTH_TEST,
    ctx.DITHER,
    ctx.POLYGON_OFFSET_FILL,
    ctx.SAMPLE_ALPHA_TO_COVERAGE,
    ctx.SAMPLE_COVERAGE,
    ctx.SCISSOR_TEST,
    ctx.STENCIL_TEST,
  ])
  if (isWebGL2) {
    ENABLE_ENUMS.add(ctx.RASTERIZER_DISCARD)
  }

  // This is the OpenGL global state cache (in contrast to the VAO cache, which we'll be adding
  // soon). If byActiveTexture is true, then the parameter keyword is dependent on what the current
  // active texture is.
  const globalState = {}
  Object.values(TEXTURE_TARGETS).forEach((textureBinding) => {
    globalState[textureBinding] = {byActiveTexture: true}
  })

  // The default VAO cache.  It has slightly different semantics.  If you delete a buffer and only
  // the default is pointing at it, it actually gets deleted.  It's as if you don't have one at all.
  const defaultVAOState = createVertexObjectState()
  // activeVAOState is the active VAO's state.  That means calls to bindBuffer with
  // ELEMENT_ARRAY_BUFFER will be recorded on this state.
  let activeVAOState = defaultVAOState
  // Stores the VAOs except the default VAO state.  The key is the VAO, the value is the state
  // object.
  const vaoState = new Map()

  // Wrap getting an extension so we can wrap the extension for VAO for webgl1
  const ctxGetExtension = ctx.getExtension
  const extensions = {}

  // Save the original getParameter function, which we wrap below.
  const getCtxParameter = ctx.getParameter

  // These are the original versions of the VAO commands.  We will be resetting these functions
  // if undoWrapper is called
  let originalCreateVertexArray = null
  let originalDeleteVertexArray = null
  let originalBindVertexArray = null
  let originalIsVertexArray = null

  // Symbols are how we can discretely store attributes on WebGL objects.
  const deletedSym = Symbol('deleted')
  const wrappedSym = Symbol('wrapped')

  ctx.getExtension = (extName) => {
    // we need to cache the extension so the user doesn't make multiple.
    if (objectHasKey(extensions, extName)) {
      return extensions[extName]
    }

    const extension = ctxGetExtension.call(ctx, extName)
    extensions[extName] = extension

    // Wrapping the VAO extension so that it updates our internal cache
    if (extension && extName === 'OES_vertex_array_object') {
      // creating a vao
      originalCreateVertexArray = extension.createVertexArrayOES
      extension.createVertexArrayOES = () => {
        const vao = originalCreateVertexArray.call(extension)
        // mark that the vao was created inside the wrapped context
        vao[wrappedSym] = true
        // don't add it to our vertex cache until the VAO has been bound
        return vao
      }

      // deleting a vao
      originalDeleteVertexArray = extension.deleteVertexArrayOES
      extension.deleteVertexArrayOES = (vao) => {
        originalDeleteVertexArray.call(extension, vao)

        if (!isVaoOES(vao) || vao[deletedSym]) {
          return
        }

        vao[deletedSym] = true
        // if the VAO being deleted is the active VAO, set the activeVAOState back to the default
        if (vaoState.get(vao) === activeVAOState) {
          activeVAOState = defaultVAOState
        }

        vaoState.delete(vao)
      }

      // setting a vao to be the current active vao
      originalBindVertexArray = extension.bindVertexArrayOES
      extension.bindVertexArrayOES = (vao) => {
        // if null, go back to default
        if (vao == null) {
          activeVAOState = defaultVAOState
        } else if (isVaoOES(vao) && !vao[deletedSym]) {
          if (!vaoState.has(vao)) {
            vaoState.set(vao, createVertexObjectState())
          }
          // set the active VAO to this vao
          activeVAOState = vaoState.get(vao)
        }

        originalBindVertexArray.call(extension, vao)

        // If the VAO was not created by a wrapped context, then it could have an EBO that is not
        // part of our cache. Since we are also caching the EBO, we should query and set the true
        // EBO using the original getParameter call.
        if (vao && vao[wrappedSym] !== true) {
          vaoState.get(vao).elementArrayBufferBinding = getCtxParameter.call(
            ctx, ctx.ELEMENT_ARRAY_BUFFER_BINDING
          )
          vao[wrappedSym] = true
        }
      }

      // checking if a VAO is valid.  It's only considered valid if it's been bound and is not
      // deleted
      originalIsVertexArray = extension.isVertexArrayOES
      extension.isVertexArrayOES = vao => vaoState.has(vao)
    }

    return extension
  }

  // If we are using WebGL1, we'll want the VAO extension by calling our wrapped ctx.getExtension
  if (!isWebGL2) {
    addedVertexArray = true
    const ext = ctx.getExtension('OES_vertex_array_object')

    // Wrap our webgl1 context with the webgl2 methods for VAO management.
    if (ext) {
      ctx.createVertexArray = () => ext.createVertexArrayOES()
      ctx.deleteVertexArray = (vao) => { ext.deleteVertexArrayOES(vao) }
      ctx.bindVertexArray = (vao) => { ext.bindVertexArrayOES(vao) }
      ctx.isVertexArray = vao => ext.isVertexArrayOES(vao)
      ctx.VERTEX_ARRAY_BINDING = ext.VERTEX_ARRAY_BINDING_OES
    }
  } else {
    // wrap VAO logic for WebGL2.  We have to make a duplicate since:
    // 1) this one uses WebGLVertexArrayObject and not WebGLVertexArrayObjectOES
    // 2) WebGL1 uses the extension, WebGL2 uses the context
    // creating a vao
    originalCreateVertexArray = ctx.createVertexArray
    ctx.createVertexArray = () => {
      const vao = originalCreateVertexArray.call(ctx)
      // mark that the vao was created inside the wrapped context
      vao[wrappedSym] = true
      // don't add it to our vertex cache until the VAO has been bound
      return vao
    }

    // deleting a vao
    originalDeleteVertexArray = ctx.deleteVertexArray
    ctx.deleteVertexArray = (vao) => {
      originalDeleteVertexArray.call(ctx, vao)

      if (!(vao instanceof WebGLVertexArrayObject) || vao[deletedSym]) {
        return
      }

      vao[deletedSym] = true
      // if the VAO being deleted is the active VAO, set the activeVAOState back to the default
      if (vaoState.get(vao) === activeVAOState) {
        activeVAOState = defaultVAOState
      }

      vaoState.delete(vao)
    }

    // setting a vao to be the current active vao
    originalBindVertexArray = ctx.bindVertexArray
    ctx.bindVertexArray = (vao) => {
      // if null, go back to default
      if (vao == null) {
        activeVAOState = defaultVAOState
      } else if (vao instanceof WebGLVertexArrayObject && !vao[deletedSym]) {
        if (!vaoState.has(vao)) {
          vaoState.set(vao, createVertexObjectState())
        }
        // set the active VAO to this vao
        activeVAOState = vaoState.get(vao)
      }

      originalBindVertexArray.call(ctx, vao)

      // If the VAO was not created by a wrapped context, then it could have an EBO that is not
      // part of our cache. Since we are also caching the EBO, we should query and set the true
      // EBO using the original getParameter call.
      if (vao && vao[wrappedSym] !== true) {
        vaoState.get(vao).elementArrayBufferBinding = getCtxParameter.call(
          ctx, ctx.ELEMENT_ARRAY_BUFFER_BINDING
        )
        vao[wrappedSym] = true
      }
    }

    // checking if a VAO is valid
    originalIsVertexArray = ctx.isVertexArray
    ctx.isVertexArray = vao => vaoState.has(vao)
  }

  // These function bindings are simple enough that we're able to wrap them and call them with
  // updateParameter
  const functionBindings = {
    activeTexture: ctx.ACTIVE_TEXTURE,
    viewport: ctx.VIEWPORT,
    useProgram: ctx.CURRENT_PROGRAM,
    frontFace: ctx.FRONT_FACE,
    pixelStorei: {
      // WEBGL 1 only
      [ctx.PACK_ALIGNMENT]: ctx.PACK_ALIGNMENT,
      [ctx.UNPACK_ALIGNMENT]: ctx.UNPACK_ALIGNMENT,
      [ctx.UNPACK_FLIP_Y_WEBGL]: ctx.UNPACK_FLIP_Y_WEBGL,
      [ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL]: ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
      [ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL]: ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL,
    },
  }

  if (isWebGL2) {
    Object.assign(functionBindings.pixelStorei, {
      [ctx.PACK_ROW_LENGTH]: ctx.PACK_ROW_LENGTH,
      [ctx.PACK_SKIP_PIXELS]: ctx.PACK_SKIP_PIXELS,
      [ctx.PACK_SKIP_ROWS]: ctx.PACK_SKIP_ROWS,
      [ctx.UNPACK_ROW_LENGTH]: ctx.UNPACK_ROW_LENGTH,
      [ctx.UNPACK_IMAGE_HEIGHT]: ctx.UNPACK_IMAGE_HEIGHT,
      [ctx.UNPACK_SKIP_PIXELS]: ctx.UNPACK_SKIP_PIXELS,
      [ctx.UNPACK_SKIP_ROWS]: ctx.UNPACK_SKIP_ROWS,
      [ctx.UNPACK_SKIP_IMAGES]: ctx.UNPACK_SKIP_IMAGES,
    })
  }

  // These bindings will be the ones that ctx.getParameter will use our cache for.
  const cachedBindingEnums = new Set()
  Object.keys(functionBindings).forEach((value) => {
    if (typeof value !== 'object') {
      cachedBindingEnums.add(value)
    } else {
      Object.values(value).forEach(v => cachedBindingEnums.add(v))
    }
  })
  ;[TEXTURE_TARGETS, FRAMEBUFFER_TARGETS, BUFFER_TARGETS].forEach((target) => {
    Object.values(target).forEach(v => cachedBindingEnums.add(v))
  })

  // Returns keys of functionBindings with values being those functions.
  const originalFunctions = Object.keys(functionBindings).reduce((o, name) => {
    o[name] = ctx[name]
    return o
  }, {})

  // Returns the active texture unit.  For example, gl.TEXTURE0 which is '33984'.
  const getActiveTexture = () => {
    let activeTexture = globalState[ctx.ACTIVE_TEXTURE]
    if (!activeTexture) {
      activeTexture = getCtxParameter.call(ctx, ctx.ACTIVE_TEXTURE)
      globalState[ctx.ACTIVE_TEXTURE] = activeTexture
    }
    return activeTexture
  }

  // Wrapper around getParameter.  The pass in a parameter like GLctx.TEXTURE_BINDING_2D which
  // is a number.  The original getParameter is now named getCtxParameter.
  ctx.getParameter = (parameter) => {
    // ELEMENT_ARRAY_BUFFER_BINDING is set on the active VAO, so we should query this from the
    // active VAO instead of the global cache
    if (parameter === ctx.ELEMENT_ARRAY_BUFFER_BINDING) {
      return activeVAOState.elementArrayBufferBinding
    }

    const cached = globalState[parameter]
    let p = cached
    if (cached && cached.byActiveTexture) {
      p = cached[getActiveTexture()]
    }

    if (p === undefined) {
      p = getCtxParameter.call(ctx, parameter)
      if (cachedBindingEnums.has(parameter)) {
        if (cached && cached.byActiveTexture) {
          // this is indirectly updating globalState, since cached is one value of parameter map
          // that is an object.  If p is null, then we update globalState to null.
          cached[getActiveTexture()] = p
        } else {
          globalState[parameter] = p
        }
      }
    }

    return p
  }

  // Set cached value
  const updateParameter = (name, ...args) => {
    const fn = functionBindings[name]
    if (!fn) {
      // eslint-disable-next-line no-console
      console.error(`[XR:WebGL] No binding known for ${name}`)
      return
    }
    switch (args.length) {
      case 1:
        globalState[fn] = args[0]
        return
      case 2: {
        // The corresponding _BINDING for the argument.  For example:
        //   ARRAY_BUFFER -> ARRAY_BUFFER_BINDING.
        //   ELEMENT_ARRAY_BUFFER -> ELEMENT_ARRAY_BUFFER_BINDING
        const binding = fn[args[0]]
        if (binding) {
          globalState[binding] = args[1]
          return
        }
        break
      }
      case 4:
        globalState[fn] = args
        return
      default:
    }
    if (verbose) {
      // eslint-disable-next-line no-console
      console.error(`[XR:WebGL] Can't update parameter for ${name}[${args}]`)
    }
  }

  // Override setters
  Object.keys(functionBindings).forEach((name) => {
    ctx[name] = (...args) => {
      const result = originalFunctions[name].call(ctx, ...args)

      updateParameter(name, ...args)
      return result
    }
  })

  const ctxBindBuffer = ctx.bindBuffer
  ctx.bindBuffer = (target, buffer) => {
    if (objectHasKey(BUFFER_TARGETS, target) &&
        (buffer == null || (buffer instanceof WebGLBuffer && !buffer[deletedSym]))) {
      // if the target is ELEMENT_ARRAY_BUFFER, then we need to set it on the activeVAOState
      if (target === ctx.ELEMENT_ARRAY_BUFFER) {
        activeVAOState.elementArrayBufferBinding = buffer || null
      } else {
        globalState[BUFFER_TARGETS[target]] = buffer || null
      }
    }

    ctxBindBuffer.call(ctx, target, buffer)
  }

  const ctxBindTexture = ctx.bindTexture
  ctx.bindTexture = (target, texture) => {
    if (objectHasKey(TEXTURE_TARGETS, target) &&
        (texture == null || (texture instanceof WebGLTexture && !texture[deletedSym]))) {
      globalState[TEXTURE_TARGETS[target]][getActiveTexture()] = texture || null
    }

    ctxBindTexture.call(ctx, target, texture)
  }

  const ctxBindFramebuffer = ctx.bindFramebuffer
  ctx.bindFramebuffer = (target, framebuffer) => {
    if (objectHasKey(FRAMEBUFFER_TARGETS, target) &&
        (framebuffer == null ||
            (framebuffer instanceof WebGLFramebuffer && !framebuffer[deletedSym]))) {
      globalState[FRAMEBUFFER_TARGETS[target]] = framebuffer || null
    }
    ctxBindFramebuffer.call(ctx, target, framebuffer)
  }

  // Given a list of bindings (ARRAY_BUFFER_BINDING, FRAMEBUFFER_BINDING, etc) and a buffer, check
  // to see if the buffer is in the global state for those bindings.  If so, remove it.
  const removeBufferFromGlobalState = (bindings, buffer) => {
    const bindingToClear = bindings.find(binding => buffer === globalState[binding])
    if (!bindingToClear) {
      return
    }

    globalState[bindingToClear] = null
  }

  // Make sure that the texture is removed from our cache when ctx.deleteTexture is called
  const ctxDeleteTexture = ctx.deleteTexture
  ctx.deleteTexture = (texture) => {
    if (texture == null || texture[deletedSym]) {
      return
    }

    if (texture instanceof WebGLTexture) {
      texture[deletedSym] = true
      const activeTexture = getActiveTexture()
      const bindingToClear = Object.values(TEXTURE_TARGETS).find(
        binding => texture === globalState[binding][activeTexture]
      )
      if (bindingToClear) {
        globalState[bindingToClear] = {byActiveTexture: true}
      }
    }

    ctxDeleteTexture.call(ctx, texture)
  }

  // Make sure that the buffer is removed from our cache when ctx.deleteBuffer is called
  const ctxDeleteBuffer = ctx.deleteBuffer
  ctx.deleteBuffer = (buffer) => {
    // We should only unset the buffer from the cache if it's a valid buffer / not deleted
    if (buffer == null || buffer[deletedSym]) {
      return
    }

    if (buffer instanceof WebGLBuffer) {
      // mark that the buffer is deleted.  That way, if the user tries to re-bind the buffer, we
      // won't cache a deleted buffer.
      buffer[deletedSym] = true

      if (buffer === activeVAOState.elementArrayBufferBinding) {
        activeVAOState.elementArrayBufferBinding = null
      } else {
        removeBufferFromGlobalState(Object.values(BUFFER_TARGETS), buffer)
      }
    }
    ctxDeleteBuffer.call(ctx, buffer)
  }

  // Make sure that the framebuffer is removed from our cache when ctx.deleteFramebuffer is called
  const ctxDeleteFramebuffer = ctx.deleteFramebuffer
  ctx.deleteFramebuffer = (framebuffer) => {
    if (framebuffer == null || framebuffer[deletedSym]) {
      return
    }

    if (framebuffer instanceof WebGLFramebuffer) {
      framebuffer[deletedSym] = true
      removeBufferFromGlobalState(Object.values(FRAMEBUFFER_TARGETS), framebuffer)
    }

    ctxDeleteFramebuffer.call(ctx, framebuffer)
  }

  const originalEnable = ctx.enable
  ctx.enable = (...args) => {
    if (ENABLE_ENUMS.has(args[0])) {
      if (globalState[args[0]] === true) {
        return
      }
      globalState[args[0]] = true
    }

    originalEnable.call(ctx, ...args)
  }

  const originalIsEnabled = ctx.isEnabled
  ctx.isEnabled = (...args) => {
    if (ENABLE_ENUMS.has(args[0])) {
      return globalState[args[0]]
    } else {
      return originalIsEnabled.call(ctx, ...args)
    }
  }

  const originalDisable = ctx.disable

  // Removes the wrapper
  const undoWrapper = () => {
    ctx.getParameter = getCtxParameter
    Object.keys(functionBindings).forEach((name) => { ctx[name] = originalFunctions[name] })
    ctx.enable = originalEnable
    ctx.disable = originalDisable
    ctx.isEnabled = originalIsEnabled
    ctx.bindBuffer = ctxBindBuffer
    ctx.bindTexture = ctxBindTexture
    ctx.bindFramebuffer = ctxBindFramebuffer
    ctx.deleteTexture = ctxDeleteTexture
    ctx.deleteBuffer = ctxDeleteBuffer
    ctx.deleteFramebuffer = ctxDeleteFramebuffer
    ctx.getExtension = ctxGetExtension

    // Reset vertex array functions either on the extension if WebGL1 or on the context if WebGL2
    if (isWebGL2) {
      ctx.createVertexArray = originalCreateVertexArray
      ctx.deleteVertexArray = originalDeleteVertexArray
      ctx.bindVertexArray = originalBindVertexArray
      ctx.isVertexArray = originalIsVertexArray
    } else {
      const vaoExtension = extensions.OES_vertex_array_object
      vaoExtension.createVertexArrayOES = originalCreateVertexArray
      vaoExtension.deleteVertexArrayOES = originalDeleteVertexArray
      vaoExtension.bindVertexArrayOES = originalBindVertexArray
      vaoExtension.isVertexArrayOES = originalIsVertexArray
    }

    if (addedVertexArray) {
      delete ctx.bindVertexArray
      delete ctx.VERTEX_ARRAY_BINDING
    }
  }

  ctx.disable = (...args) => {
    // this is our way of disabling the context wrapper without adding an additional method to
    // the context
    if (args[0] === ctx.NO_ERROR) {
      undoWrapper()
      return
    }

    if (ENABLE_ENUMS.has(args[0])) {
      if (globalState[args[0]] === false) {
        return
      }
      globalState[args[0]] = false
    }
    originalDisable.call(ctx, ...args)
  }

  return ctx
}

export {contextWrapper}
