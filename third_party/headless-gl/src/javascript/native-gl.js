// eslint-disable-next-line global-require, import/no-unresolved
const NativeWebGL = globalThis.NativeWebGL || require('third_party/headless-gl/headless-gl-addon')

const NativeWebGLObject = NativeWebGL.WebGL
const NativeWebGL2Object = NativeWebGL.WebGL2

const {WebGLRenderingContext: NativeWebGLRenderingContext} = NativeWebGLObject
const {WebGL2RenderingContext: NativeWebGL2RenderingContext} = NativeWebGL2Object

const {getNull} = NativeWebGLObject
const getNull2 = NativeWebGL2Object.getNull

const gl = NativeWebGLRenderingContext.prototype
const gl2 = NativeWebGL2RenderingContext.prototype

// from binding.gyp
delete gl['1.0.0']

// from binding.gyp
delete NativeWebGLRenderingContext['1.0.0']

const WebGLExport = {gl, NativeWebGLRenderingContext, NativeWebGLObject, getNull}
const WebGL2Export = {gl2, NativeWebGL2RenderingContext, NativeWebGL2Object, getNull2}

export {WebGLExport, WebGL2Export}
