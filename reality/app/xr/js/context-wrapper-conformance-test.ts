// @package(npm-c8)
// @attr[](data = "@npm-c8//:modules")
// @attr[](tags = "manual")

// Tests our contextWrapper using https://github.com/stackgl/gl-conformance.  It uses
// https://github.com/stackgl/headless-gl as the underlying WebGL implementation.
/* Run this test using:

   bazel test //reality/app/xr/js:context-wrapper-conformance-test  --test_output=streamed
      --nocache_test_results
*/
import path from 'path'

import tape from 'tape'

import {contextWrapper} from '@nia/reality/app/xr/js/src/context-wrapper'

const rtRequire = (module) => {
  const absPath = path.join(process.cwd(), module)
  return eval(`require('${absPath}')`)  // eslint-disable-line
}

const modules = 'external/npm-c8/node_modules'

const glConformance = rtRequire(`${modules}/gl-conformance`)
const createContext = rtRequire(`${modules}/gl`)

// @ts-ignore
globalThis.window = globalThis

// Load WebGL globals after glConformance, since the latter uses the absence of these globals to
// determine whether to instantiate a node context.
globalThis.WebGLRenderingContext = rtRequire(`${modules}/gl/src/javascript/webgl-rendering-context`).WebGLRenderingContext  // eslint-disable-line
globalThis.WebGLBuffer = rtRequire(`${modules}/gl/src/javascript/webgl-buffer`).WebGLBuffer  // eslint-disable-line
globalThis.WebGLFramebuffer = rtRequire(`${modules}/gl/src/javascript/webgl-framebuffer`).WebGLFramebuffer  // eslint-disable-line
globalThis.WebGLProgram = rtRequire(`${modules}/gl/src/javascript/webgl-program`).WebGLProgram  // eslint-disable-line
globalThis.WebGLRenderbuffer = rtRequire(`${modules}/gl/src/javascript/webgl-renderbuffer`).WebGLRenderbuffer  // eslint-disable-line
globalThis.WebGLShader = rtRequire(`${modules}/gl/src/javascript/webgl-shader`).WebGLShader  // eslint-disable-line
globalThis.WebGLTexture = rtRequire(`${modules}/gl/src/javascript/webgl-texture`).WebGLTexture  // eslint-disable-line
globalThis.WebGLUniformLocation = rtRequire(`${modules}/gl/src/javascript/webgl-uniform-location`).WebGLUniformLocation  // eslint-disable-line
globalThis.WebGLActiveInfo = rtRequire(`${modules}/gl/src/javascript/webgl-active-info`).WebGLActiveInfo  // eslint-disable-line
globalThis.WebGLShaderPrecisionFormat = rtRequire(`${modules}/gl/src/javascript/webgl-shader-precision-format`).WebGLShaderPrecisionFormat  // eslint-disable-line
globalThis.WebGLContextAttributes = rtRequire(`${modules}/gl/src/javascript/webgl-context-attributes`).WebGLContextAttributes  // eslint-disable-line
globalThis.WebGLVertexArrayObjectOES = rtRequire(`${modules}/gl/src/javascript/extensions/oes-vertex-array-object`).WebGLVertexArrayObjectOES  // eslint-disable-line

const BLACKLIST = [
  // Test suites not included in headless-gl that don't pass without the context.
  'typedarrays_',
  'canvas_',
  'canvas_canvas-zero-size',  // throws an error and prevents the test suite from completing
  'canvas_draw-static-webgl-to-multiple-canvas-test',  // throws an error
  'glsl_bugs_',
  'glsl_misc_',

  // Tests skipped in headless-gl because they were failing
  'context_context-type-test',
  'context_methods',
  'extensions_ext-frag-depth',
  'extensions_ext-shader-texture-lod',
  'extensions_webgl-draw-buffers',
  'glsl_samplers_glsl-function-texture2dprojlod',
  'misc_uninitialized-test',
  'misc_object-deletion-behaviour',
  'more_glsl_arrayOutOfBounds',
  'ogles_GL_array_array_001_to_006',
  'ogles_GL_biuDepthRange_biuDepthRange_001_to_002',
  'ogles_GL_build_build_001_to_008',
  'ogles_GL_build_build_025_to_032',
  'ogles_GL_gl_FragCoord_gl_FragCoord_001_to_003',
  'ogles_GL_mat3_mat3_001_to_006',
  'ogles_GL_vec3_vec3_001_to_008',
  'ogles_GL_functions_functions_001_to_008',
  'renderbuffers_feedback-loop',
  'renderbuffers_renderbuffer-initialization',
  'rendering_framebuffer-texture-switch',
  'rendering_framebuffer-switch',
  'rendering_polygon-offset',
  'rendering_point-no-attributes',
  'state_gl-get-calls',
  'textures_compressed-tex-image',
  'textures_copy-tex-image-2d-formats',
  'textures_copy-tex-image-and-sub-image-2d',
  'textures_tex-image-webgl',
  'textures_tex-image-and-uniform-binding-bugs',
  'textures_tex-input-validation',
  'textures_texture-attachment-formats',
  'textures_texture-fakeblack',
  'textures_texture-copying-feedback-loops',
  'textures_texture-mips',
  'uniforms_out-of-bounds-uniform-array-access',
  'uniforms_uniform-default-values',
  'more_functions_isTests',
  'more_functions_texSubImage2DHTMLBadArgs',
  'more_functions_texImage2DHTMLBadArgs',
  'more_functions_copyTexSubImage2D',
  'more_functions_texSubImage2DBadArgs',
]

glConformance({
  tape,
  createContext(width, height, options) {
    const context = createContext(width, height, options)
    const wrappedContext = contextWrapper(context, true, false)
    return wrappedContext
  },
  filter(str) {
    return BLACKLIST.every(skip => !str.startsWith(skip))
  },
})
