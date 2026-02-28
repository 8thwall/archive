// @sublibrary(:dom-core-lib)
import type {
  GLenum,
  GLboolean,
  GLbitfield,
  GLbyte,
  GLshort,
  GLint,
  GLsizei,
  GLintptr,
  GLsizeiptr,
  GLubyte,
  GLushort,
  GLuint,
  GLfloat,
  GLclampf,
  Float32List,
  Int32List,
  TexImageSource,
  WebGLObject,
  WebGLBuffer,
  WebGLFramebuffer,
  WebGLProgram,
  WebGLRenderbuffer,
  WebGLShader,
  WebGLTexture,
  WebGLUniformLocation,
  WebGLActiveInfo,
  WebGLShaderPrecisionFormat,
  WebGLContextAttributes,
  WebGLPowerPreference,
} from './webgl-rendering-context-base'

import type {
  GLint64,
  GLuint64,
  Uint32List,
  WebGL2RenderingContextBase,
  WebGLQuery,
  WebGLSampler,
  WebGLTransformFeedback,
  WebGLVertexArrayObject,
  WebGLSync,
} from './webgl2-rendering-context-base'

import type {
  WebGL2RenderingContextOverloads,
} from './webgl2-rendering-context-overloads'

import type {
  AllowSharedBufferSource,
} from './webgl-rendering-context-overloads'

import {WebGLRenderingContext} from './webgl-rendering-context'

declare class WebGL2RenderingContext extends WebGLRenderingContext
  implements WebGL2RenderingContextBase, WebGL2RenderingContextOverloads {
  readonly READ_BUFFER: GLenum;

  readonly UNPACK_ROW_LENGTH: GLenum;

  readonly UNPACK_SKIP_ROWS: GLenum;

  readonly UNPACK_SKIP_PIXELS: GLenum;

  readonly PACK_ROW_LENGTH: GLenum;

  readonly PACK_SKIP_ROWS: GLenum;

  readonly PACK_SKIP_PIXELS: GLenum;

  readonly COLOR: GLenum;

  readonly DEPTH: GLenum;

  readonly STENCIL: GLenum;

  readonly RED: GLenum;

  readonly RGB8: GLenum;

  readonly RGB10_A2: GLenum;

  readonly TEXTURE_BINDING_3D: GLenum;

  readonly UNPACK_SKIP_IMAGES: GLenum;

  readonly UNPACK_IMAGE_HEIGHT: GLenum;

  readonly TEXTURE_3D: GLenum;

  readonly TEXTURE_WRAP_R: GLenum;

  readonly MAX_3D_TEXTURE_SIZE: GLenum;

  readonly UNSIGNED_INT_2_10_10_10_REV: GLenum;

  readonly MAX_ELEMENTS_VERTICES: GLenum;

  readonly MAX_ELEMENTS_INDICES: GLenum;

  readonly TEXTURE_MIN_LOD: GLenum;

  readonly TEXTURE_MAX_LOD: GLenum;

  readonly TEXTURE_BASE_LEVEL: GLenum;

  readonly TEXTURE_MAX_LEVEL: GLenum;

  readonly MIN: GLenum;

  readonly MAX: GLenum;

  readonly DEPTH_COMPONENT24: GLenum;

  readonly MAX_TEXTURE_LOD_BIAS: GLenum;

  readonly TEXTURE_COMPARE_MODE: GLenum;

  readonly TEXTURE_COMPARE_FUNC: GLenum;

  readonly CURRENT_QUERY: GLenum;

  readonly QUERY_RESULT: GLenum;

  readonly QUERY_RESULT_AVAILABLE: GLenum;

  readonly STREAM_READ: GLenum;

  readonly STREAM_COPY: GLenum;

  readonly STATIC_READ: GLenum;

  readonly STATIC_COPY: GLenum;

  readonly DYNAMIC_READ: GLenum;

  readonly DYNAMIC_COPY: GLenum;

  readonly MAX_DRAW_BUFFERS: GLenum;

  readonly DRAW_BUFFER0: GLenum;

  readonly DRAW_BUFFER1: GLenum;

  readonly DRAW_BUFFER2: GLenum;

  readonly DRAW_BUFFER3: GLenum;

  readonly DRAW_BUFFER4: GLenum;

  readonly DRAW_BUFFER5: GLenum;

  readonly DRAW_BUFFER6: GLenum;

  readonly DRAW_BUFFER7: GLenum;

  readonly DRAW_BUFFER8: GLenum;

  readonly DRAW_BUFFER9: GLenum;

  readonly DRAW_BUFFER10: GLenum;

  readonly DRAW_BUFFER11: GLenum;

  readonly DRAW_BUFFER12: GLenum;

  readonly DRAW_BUFFER13: GLenum;

  readonly DRAW_BUFFER14: GLenum;

  readonly DRAW_BUFFER15: GLenum;

  readonly MAX_FRAGMENT_UNIFORM_COMPONENTS: GLenum;

  readonly MAX_VERTEX_UNIFORM_COMPONENTS: GLenum;

  readonly SAMPLER_3D: GLenum;

  readonly SAMPLER_2D_SHADOW: GLenum;

  readonly FRAGMENT_SHADER_DERIVATIVE_HINT: GLenum;

  readonly PIXEL_PACK_BUFFER: GLenum;

  readonly PIXEL_UNPACK_BUFFER: GLenum;

  readonly PIXEL_PACK_BUFFER_BINDING: GLenum;

  readonly PIXEL_UNPACK_BUFFER_BINDING: GLenum;

  /* eslint-disable camelcase */
  readonly FLOAT_MAT2x3: GLenum;

  readonly FLOAT_MAT2x4: GLenum;

  readonly FLOAT_MAT3x2: GLenum;

  readonly FLOAT_MAT3x4: GLenum;

  readonly FLOAT_MAT4x2: GLenum;

  readonly FLOAT_MAT4x3: GLenum;

  /* eslint-enable camelcase */
  readonly SRGB: GLenum;

  readonly SRGB8: GLenum;

  readonly SRGB8_ALPHA8: GLenum;

  readonly COMPARE_REF_TO_TEXTURE: GLenum;

  readonly RGBA32F: GLenum;

  readonly RGB32F: GLenum;

  readonly RGBA16F: GLenum;

  readonly RGB16F: GLenum;

  readonly VERTEX_ATTRIB_ARRAY_INTEGER: GLenum;

  readonly MAX_ARRAY_TEXTURE_LAYERS: GLenum;

  readonly MIN_PROGRAM_TEXEL_OFFSET: GLenum;

  readonly MAX_PROGRAM_TEXEL_OFFSET: GLenum;

  readonly MAX_VARYING_COMPONENTS: GLenum;

  readonly TEXTURE_2D_ARRAY: GLenum;

  readonly TEXTURE_BINDING_2D_ARRAY: GLenum;

  readonly R11F_G11F_B10F: GLenum;

  readonly UNSIGNED_INT_10F_11F_11F_REV: GLenum;

  readonly RGB9_E5: GLenum;

  readonly UNSIGNED_INT_5_9_9_9_REV: GLenum;

  readonly TRANSFORM_FEEDBACK_BUFFER_MODE: GLenum;

  readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: GLenum;

  readonly TRANSFORM_FEEDBACK_VARYINGS: GLenum;

  readonly TRANSFORM_FEEDBACK_BUFFER_START: GLenum;

  readonly TRANSFORM_FEEDBACK_BUFFER_SIZE: GLenum;

  readonly TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: GLenum;

  readonly RASTERIZER_DISCARD: GLenum;

  readonly MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: GLenum;

  readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: GLenum;

  readonly INTERLEAVED_ATTRIBS: GLenum;

  readonly SEPARATE_ATTRIBS: GLenum;

  readonly TRANSFORM_FEEDBACK_BUFFER: GLenum;

  readonly TRANSFORM_FEEDBACK_BUFFER_BINDING: GLenum;

  readonly RGBA32UI: GLenum;

  readonly RGB32UI: GLenum;

  readonly RGBA16UI: GLenum;

  readonly RGB16UI: GLenum;

  readonly RGBA8UI: GLenum;

  readonly RGB8UI: GLenum;

  readonly RGBA32I: GLenum;

  readonly RGB32I: GLenum;

  readonly RGBA16I: GLenum;

  readonly RGB16I: GLenum;

  readonly RGBA8I: GLenum;

  readonly RGB8I: GLenum;

  readonly RED_INTEGER: GLenum;

  readonly RGB_INTEGER: GLenum;

  readonly RGBA_INTEGER: GLenum;

  readonly SAMPLER_2D_ARRAY: GLenum;

  readonly SAMPLER_2D_ARRAY_SHADOW: GLenum;

  readonly SAMPLER_CUBE_SHADOW: GLenum;

  readonly UNSIGNED_INT_VEC2: GLenum;

  readonly UNSIGNED_INT_VEC3: GLenum;

  readonly UNSIGNED_INT_VEC4: GLenum;

  readonly INT_SAMPLER_2D: GLenum;

  readonly INT_SAMPLER_3D: GLenum;

  readonly INT_SAMPLER_CUBE: GLenum;

  readonly INT_SAMPLER_2D_ARRAY: GLenum;

  readonly UNSIGNED_INT_SAMPLER_2D: GLenum;

  readonly UNSIGNED_INT_SAMPLER_3D: GLenum;

  readonly UNSIGNED_INT_SAMPLER_CUBE: GLenum;

  readonly UNSIGNED_INT_SAMPLER_2D_ARRAY: GLenum;

  readonly DEPTH_COMPONENT32F: GLenum;

  readonly DEPTH32F_STENCIL8: GLenum;

  readonly FLOAT_32_UNSIGNED_INT_24_8_REV: GLenum;

  readonly FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: GLenum;

  readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: GLenum;

  readonly FRAMEBUFFER_ATTACHMENT_RED_SIZE: GLenum;

  readonly FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: GLenum;

  readonly FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: GLenum;

  readonly FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: GLenum;

  readonly FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: GLenum;

  readonly FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: GLenum;

  readonly FRAMEBUFFER_DEFAULT: GLenum;

  readonly UNSIGNED_INT_24_8: GLenum;

  readonly DEPTH24_STENCIL8: GLenum;

  readonly UNSIGNED_NORMALIZED: GLenum;

  readonly DRAW_FRAMEBUFFER_BINDING: GLenum;

  readonly READ_FRAMEBUFFER: GLenum;

  readonly DRAW_FRAMEBUFFER: GLenum;

  readonly READ_FRAMEBUFFER_BINDING: GLenum;

  readonly RENDERBUFFER_SAMPLES: GLenum;

  readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: GLenum;

  readonly MAX_COLOR_ATTACHMENTS: GLenum;

  readonly COLOR_ATTACHMENT1: GLenum;

  readonly COLOR_ATTACHMENT2: GLenum;

  readonly COLOR_ATTACHMENT3: GLenum;

  readonly COLOR_ATTACHMENT4: GLenum;

  readonly COLOR_ATTACHMENT5: GLenum;

  readonly COLOR_ATTACHMENT6: GLenum;

  readonly COLOR_ATTACHMENT7: GLenum;

  readonly COLOR_ATTACHMENT8: GLenum;

  readonly COLOR_ATTACHMENT9: GLenum;

  readonly COLOR_ATTACHMENT10: GLenum;

  readonly COLOR_ATTACHMENT11: GLenum;

  readonly COLOR_ATTACHMENT12: GLenum;

  readonly COLOR_ATTACHMENT13: GLenum;

  readonly COLOR_ATTACHMENT14: GLenum;

  readonly COLOR_ATTACHMENT15: GLenum;

  readonly FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: GLenum;

  readonly MAX_SAMPLES: GLenum;

  readonly HALF_FLOAT: GLenum;

  readonly RG: GLenum;

  readonly RG_INTEGER: GLenum;

  readonly R8: GLenum;

  readonly RG8: GLenum;

  readonly R16F: GLenum;

  readonly R32F: GLenum;

  readonly RG16F: GLenum;

  readonly RG32F: GLenum;

  readonly R8I: GLenum;

  readonly R8UI: GLenum;

  readonly R16I: GLenum;

  readonly R16UI: GLenum;

  readonly R32I: GLenum;

  readonly R32UI: GLenum;

  readonly RG8I: GLenum;

  readonly RG8UI: GLenum;

  readonly RG16I: GLenum;

  readonly RG16UI: GLenum;

  readonly RG32I: GLenum;

  readonly RG32UI: GLenum;

  readonly VERTEX_ARRAY_BINDING: GLenum;

  readonly R8_SNORM: GLenum;

  readonly RG8_SNORM: GLenum;

  readonly RGB8_SNORM: GLenum;

  readonly RGBA8_SNORM: GLenum;

  readonly SIGNED_NORMALIZED: GLenum;

  readonly COPY_READ_BUFFER: GLenum;

  readonly COPY_WRITE_BUFFER: GLenum;

  readonly COPY_READ_BUFFER_BINDING: GLenum;

  readonly COPY_WRITE_BUFFER_BINDING: GLenum;

  readonly UNIFORM_BUFFER: GLenum;

  readonly UNIFORM_BUFFER_BINDING: GLenum;

  readonly UNIFORM_BUFFER_START: GLenum;

  readonly UNIFORM_BUFFER_SIZE: GLenum;

  readonly MAX_VERTEX_UNIFORM_BLOCKS: GLenum;

  readonly MAX_FRAGMENT_UNIFORM_BLOCKS: GLenum;

  readonly MAX_COMBINED_UNIFORM_BLOCKS: GLenum;

  readonly MAX_UNIFORM_BUFFER_BINDINGS: GLenum;

  readonly MAX_UNIFORM_BLOCK_SIZE: GLenum;

  readonly MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: GLenum;

  readonly MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: GLenum;

  readonly UNIFORM_BUFFER_OFFSET_ALIGNMENT: GLenum;

  readonly ACTIVE_UNIFORM_BLOCKS: GLenum;

  readonly UNIFORM_TYPE: GLenum;

  readonly UNIFORM_SIZE: GLenum;

  readonly UNIFORM_BLOCK_INDEX: GLenum;

  readonly UNIFORM_OFFSET: GLenum;

  readonly UNIFORM_ARRAY_STRIDE: GLenum;

  readonly UNIFORM_MATRIX_STRIDE: GLenum;

  readonly UNIFORM_IS_ROW_MAJOR: GLenum;

  readonly UNIFORM_BLOCK_BINDING: GLenum;

  readonly UNIFORM_BLOCK_DATA_SIZE: GLenum;

  readonly UNIFORM_BLOCK_ACTIVE_UNIFORMS: GLenum;

  readonly UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: GLenum;

  readonly UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: GLenum;

  readonly UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: GLenum;

  readonly INVALID_INDEX: GLenum;

  readonly MAX_VERTEX_OUTPUT_COMPONENTS: GLenum;

  readonly MAX_FRAGMENT_INPUT_COMPONENTS: GLenum;

  readonly MAX_SERVER_WAIT_TIMEOUT: GLenum;

  readonly OBJECT_TYPE: GLenum;

  readonly SYNC_CONDITION: GLenum;

  readonly SYNC_STATUS: GLenum;

  readonly SYNC_FLAGS: GLenum;

  readonly SYNC_FENCE: GLenum;

  readonly SYNC_GPU_COMMANDS_COMPLETE: GLenum;

  readonly UNSIGNALED: GLenum;

  readonly SIGNALED: GLenum;

  readonly ALREADY_SIGNALED: GLenum;

  readonly TIMEOUT_EXPIRED: GLenum;

  readonly CONDITION_SATISFIED: GLenum;

  readonly WAIT_FAILED: GLenum;

  readonly SYNC_FLUSH_COMMANDS_BIT: GLenum;

  readonly VERTEX_ATTRIB_ARRAY_DIVISOR: GLenum;

  readonly ANY_SAMPLES_PASSED: GLenum;

  readonly ANY_SAMPLES_PASSED_CONSERVATIVE: GLenum;

  readonly SAMPLER_BINDING: GLenum;

  readonly RGB10_A2UI: GLenum;

  readonly INT_2_10_10_10_REV: GLenum;

  readonly TRANSFORM_FEEDBACK: GLenum;

  readonly TRANSFORM_FEEDBACK_PAUSED: GLenum;

  readonly TRANSFORM_FEEDBACK_ACTIVE: GLenum;

  readonly TRANSFORM_FEEDBACK_BINDING: GLenum;

  readonly TEXTURE_IMMUTABLE_FORMAT: GLenum;

  readonly MAX_ELEMENT_INDEX: GLenum;

  readonly TEXTURE_IMMUTABLE_LEVELS: GLenum;

  readonly TIMEOUT_IGNORED: GLenum;

  readonly MAX_CLIENT_WAIT_TIMEOUT_WEBGL: GLenum;

  beginQuery(target: GLenum, query: WebGLQuery): void;

  beginTransformFeedback(primitiveMode: GLenum): void;

  bindBufferBase(target: GLenum, index: GLuint, buffer: WebGLBuffer | null): void;

  bindBufferRange(
    target: GLenum,
    index: GLuint,
    buffer: WebGLBuffer | null,
    offset: GLintptr,
    size: GLsizeiptr): void;

  bindSampler(unit: GLuint, sampler: WebGLSampler | null): void;

  bindTransformFeedback(target: GLenum, tf: WebGLTransformFeedback | null): void;

  bindVertexArray(array: WebGLVertexArrayObject | null): void;

  blitFramebuffer(
    srcX0: GLint,
    srcY0: GLint,
    srcX1: GLint,
    srcY1: GLint,
    dstX0: GLint,
    dstY0: GLint,
    dstX1: GLint,
    dstY1: GLint,
    mask: GLbitfield,
    filter: GLenum): void;

  clearBufferfi(buffer: GLenum, drawbuffer: GLint, depth: GLfloat, stencil: GLint): void;

  clearBufferfv(buffer: GLenum, drawbuffer: GLint, values: Float32List, srcOffset?: number): void;

  clearBufferiv(buffer: GLenum, drawbuffer: GLint, values: Int32List, srcOffset?: number): void;

  clearBufferuiv(buffer: GLenum, drawbuffer: GLint, values: Uint32List, srcOffset?: number): void;

  clientWaitSync(sync: WebGLSync, flags: GLbitfield, timeout: GLuint64): GLenum;

  compressedTexImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    imageSize: GLsizei,
    offset: GLintptr
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  compressedTexImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    srcData: ArrayBufferView,
    srcOffset?: number,
    srcLengthOverride?: GLuint
  ): void;

  compressedTexSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    imageSize: GLsizei,
    offset: GLintptr
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  compressedTexSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    srcData: ArrayBufferView,
    srcOffset?: number,
    srcLengthOverride?: GLuint
  ): void;

  copyBufferSubData(
    readTarget: GLenum,
    writeTarget: GLenum,
    readOffset: GLintptr,
    writeOffset: GLintptr,
    size: GLsizeiptr
  ): void;

  copyTexSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei
  ): void;

  createQuery(): WebGLQuery | null;

  createSampler(): WebGLSampler | null;

  createTransformFeedback(): WebGLTransformFeedback | null;

  createVertexArray(): WebGLVertexArrayObject | null;

  deleteQuery(query: WebGLQuery | null): void;

  deleteSampler(sampler: WebGLSampler | null): void;

  deleteSync(sync: WebGLSync | null): void;

  deleteTransformFeedback(tf: WebGLTransformFeedback | null): void;

  deleteVertexArray(vertexArray: WebGLVertexArrayObject | null): void;

  drawArraysInstanced(mode: GLenum, first: GLint, count: GLsizei, instanceCount: GLsizei): void;

  drawBuffers(buffers: GLenum[]): void;

  drawElementsInstanced(
    mode: GLenum,
    count: GLsizei,
    type: GLenum,
    offset: GLintptr,
    instanceCount: GLsizei): void;

  drawRangeElements(
    mode: GLenum,
    start: GLuint,
    end: GLuint,
    count: GLsizei,
    type: GLenum,
    offset: GLintptr): void;

  endQuery(target: GLenum): void;

  endTransformFeedback(): void;

  fenceSync(condition: GLenum, flags: GLbitfield): WebGLSync | null;

  framebufferTextureLayer(
    target: GLenum,
    attachment: GLenum,
    texture: WebGLTexture | null,
    level: GLint,
    layer: GLint): void;

  getActiveUniformBlockName(program: WebGLProgram, uniformBlockIndex: GLuint): string | null;

  getActiveUniformBlockParameter(
    program: WebGLProgram,
    uniformBlockIndex: GLuint,
    pname: GLenum): any;

  getActiveUniforms(program: WebGLProgram, uniformIndices: GLuint[], pname: GLenum): any;

  getBufferSubData(
    target: GLenum,
    srcByteOffset: GLintptr,
    dstBuffer: ArrayBufferView, dstOffset?: number, length?: GLuint): void;

  getFragDataLocation(program: WebGLProgram, name: string): GLint;

  getIndexedParameter(target: GLenum, index: GLuint): any;

  getInternalformatParameter(target: GLenum, internalformat: GLenum, pname: GLenum): any;

  getQuery(target: GLenum, pname: GLenum): WebGLQuery | null;

  getQueryParameter(query: WebGLQuery, pname: GLenum): any;

  getSamplerParameter(sampler: WebGLSampler, pname: GLenum): any;

  getSyncParameter(sync: WebGLSync, pname: GLenum): any;

  getTransformFeedbackVarying(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null;

  getUniformBlockIndex(program: WebGLProgram, uniformBlockName: string): GLuint;

  getUniformIndices(program: WebGLProgram, uniformNames: string[]): GLuint[] | null;

  invalidateFramebuffer(target: GLenum, attachments: GLenum[]): void;

  invalidateSubFramebuffer(
    target: GLenum,
    attachments: GLenum[],
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei): void;

  isQuery(query: WebGLQuery | null): GLboolean;

  isSampler(sampler: WebGLSampler | null): GLboolean;

  isSync(sync: WebGLSync | null): GLboolean;

  isTransformFeedback(tf: WebGLTransformFeedback | null): GLboolean;

  isVertexArray(vertexArray: WebGLVertexArrayObject | null): GLboolean;

  pauseTransformFeedback(): void;

  readBuffer(src: GLenum): void;

  renderbufferStorageMultisample(
    target: GLenum,
    samples: GLsizei,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei): void;

  resumeTransformFeedback(): void;

  samplerParameterf(sampler: WebGLSampler, pname: GLenum, param: GLfloat): void;

  samplerParameteri(sampler: WebGLSampler, pname: GLenum, param: GLint): void;

  texImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    pboOffset: GLintptr): void;

  // eslint-disable-next-line no-dupe-class-members
  texImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    source: TexImageSource): void;

  // eslint-disable-next-line no-dupe-class-members
  texImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    srcData: ArrayBufferView | null): void;

  // eslint-disable-next-line no-dupe-class-members
  texImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    srcData: ArrayBufferView,
    srcOffset: number): void;

  texStorage2D(
    target: GLenum,
    levels: GLsizei,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei): void;

  texStorage3D(
    target: GLenum,
    levels: GLsizei,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei): void;

  texSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    type: GLenum,
    pboOffset: GLintptr): void;

  // eslint-disable-next-line no-dupe-class-members
  texSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    type: GLenum,
    source: TexImageSource): void;

  // eslint-disable-next-line no-dupe-class-members
  texSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    type: GLenum,
    srcData: ArrayBufferView | null,
    srcOffset?: number): void;

  transformFeedbackVaryings(program: WebGLProgram, varyings: string[], bufferMode: GLenum): void;

  uniform1ui(location: WebGLUniformLocation | null, v0: GLuint): void;

  uniform1uiv(
    location: WebGLUniformLocation | null,
    data: Uint32List,
    srcOffset?: number,
    srcLength?: GLuint): void;

  uniform2ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint): void;

  uniform2uiv(
    location: WebGLUniformLocation | null,
    data: Uint32List,
    srcOffset?: number,
    srcLength?: GLuint): void;

  uniform3ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, v2: GLuint): void;

  uniform3uiv(
    location: WebGLUniformLocation | null,
    data: Uint32List,
    srcOffset?: number,
    srcLength?: GLuint): void;

  uniform4ui(
    location: WebGLUniformLocation | null,
    v0: GLuint,
    v1: GLuint,
    v2: GLuint,
    v3: GLuint): void;

  uniform4uiv(
    location: WebGLUniformLocation | null,
    data: Uint32List,
    srcOffset?: number,
    srcLength?: GLuint): void;

  uniformBlockBinding(
    program: WebGLProgram,
    uniformBlockIndex: GLuint,
    uniformBlockBinding: GLuint): void;

  uniformMatrix2x3fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint): void;

  uniformMatrix2x4fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint): void;

  uniformMatrix3x2fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint): void;

  uniformMatrix3x4fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint): void;

  uniformMatrix4x2fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint): void;

  uniformMatrix4x3fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint): void;

  vertexAttribDivisor(index: GLuint, divisor: GLuint): void;

  vertexAttribI4i(index: GLuint, x: GLint, y: GLint, z: GLint, w: GLint): void;

  vertexAttribI4iv(index: GLuint, values: Int32List): void;

  vertexAttribI4ui(index: GLuint, x: GLuint, y: GLuint, z: GLuint, w: GLuint): void;

  vertexAttribI4uiv(index: GLuint, values: Uint32List): void;

  vertexAttribIPointer(
    index: GLuint,
    size: GLint,
    type: GLenum,
    stride: GLsizei,
    offset: GLintptr): void;

  waitSync(sync: WebGLSync, flags: GLbitfield, timeout: GLint64): void;

  bufferData(target: GLenum, size: GLsizeiptr, usage: GLenum): void;

  // eslint-disable-next-line no-dupe-class-members
  bufferData(target: GLenum, srcData: AllowSharedBufferSource | null, usage: GLenum): void;

  // eslint-disable-next-line no-dupe-class-members
  bufferData(
    target: GLenum,
    srcData: ArrayBufferView,
    usage: GLenum,
    srcOffset: number,
    length?: GLuint): void;

  bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: AllowSharedBufferSource): void;

  // eslint-disable-next-line no-dupe-class-members
  bufferSubData(
    target: GLenum,
    dstByteOffset: GLintptr,
    srcData: ArrayBufferView,
    srcOffset: number,
    length?: GLuint
  ): void;

  compressedTexImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    imageSize: GLsizei,
    offset: GLintptr
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  compressedTexImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    srcData: ArrayBufferView,
    srcOffset?: number,
    srcLengthOverride?: GLuint
  ): void;

  compressedTexSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    imageSize: GLsizei,
    offset: GLintptr
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  compressedTexSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    srcData: ArrayBufferView,
    srcOffset?: number,
    srcLengthOverride?: GLuint
  ): void;

  readPixels(
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    dstData: ArrayBufferView | null
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  readPixels(
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    offset: GLintptr
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  readPixels(
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    dstData: ArrayBufferView,
    dstOffset: number
  ): void;

  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    pixels: ArrayBufferView | null
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    format: GLenum,
    type: GLenum,
    source: TexImageSource
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    pboOffset: GLintptr
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    source: TexImageSource
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    srcData: ArrayBufferView,
    srcOffset: number
  ): void;

  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    pixels: ArrayBufferView | null
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    format: GLenum,
    type: GLenum,
    source: TexImageSource
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    pboOffset: GLintptr
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    source: TexImageSource
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    srcData: ArrayBufferView,
    srcOffset: number
  ): void;

  uniform1fv(
    location: WebGLUniformLocation | null,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint
  ): void;

  uniform1iv(
    location: WebGLUniformLocation | null,
    data: Int32List,
    srcOffset?: number,
    srcLength?: GLuint
  ): void;

  uniform2fv(
    location: WebGLUniformLocation | null,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint
  ): void;

  uniform2iv(
    location: WebGLUniformLocation | null,
    data: Int32List,
    srcOffset?: number,
    srcLength?: GLuint
  ): void;

  uniform3fv(
    location: WebGLUniformLocation | null,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint
  ): void;

  uniform3iv(
    location: WebGLUniformLocation | null,
    data: Int32List,
    srcOffset?: number,
    srcLength?: GLuint
  ): void;

  uniform4fv(
    location: WebGLUniformLocation | null,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint
  ): void;

  uniform4iv(
    location: WebGLUniformLocation | null,
    data: Int32List,
    srcOffset?: number,
    srcLength?: GLuint
  ): void;

  uniformMatrix2fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint
  ): void;

  uniformMatrix3fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint
  ): void;

  uniformMatrix4fv(
    location: WebGLUniformLocation | null,
    transpose: GLboolean,
    data: Float32List,
    srcOffset?: number,
    srcLength?: GLuint
  ): void;
}

declare function createContext(width: number, height: number, options: any): WebGL2RenderingContext

export {
  WebGL2RenderingContext,
  createContext,
}

export type {
  AllowSharedBufferSource,
  GLenum,
  GLboolean,
  GLbitfield,
  GLbyte,
  GLshort,
  GLint,
  GLint64,
  GLsizei,
  GLintptr,
  GLsizeiptr,
  GLubyte,
  GLushort,
  GLuint,
  GLuint64,
  GLfloat,
  GLclampf,
  Float32List,
  Int32List,
  Uint32List,
  TexImageSource,
  WebGLObject,
  WebGLBuffer,
  WebGLFramebuffer,
  WebGLProgram,
  WebGLRenderbuffer,
  WebGLSampler,
  WebGLShader,
  WebGLSync,
  WebGLTexture,
  WebGLQuery,
  WebGLUniformLocation,
  WebGLActiveInfo,
  WebGLShaderPrecisionFormat,
  WebGLContextAttributes,
  WebGLPowerPreference,
}
