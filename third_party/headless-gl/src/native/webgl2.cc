#include "webgl2.h"

#include <cstdio>
#include <cstring>
#include <iostream>
#include <type_traits>
#include <vector>

#if !C8_USE_ANGLE
#include "c8/xrapi/openxr/gl-contexts.h"
#endif

#include "c8/c8-log.h"

#define EGL_MAJOR_VERSION_WEBGL2 3
#define EGL_MINOR_VERSION_WEBGL2 0

const char *REQUIRED_EXTENSIONS_WEBGL2[] = {nullptr};

#define GL_METHOD(method_name) GL_METHOD_IMPL(WebGL2RenderingContext, method_name)

#define GL_BOILERPLATE GL_BOILERPLATE_IMPL(WebGL2RenderingContext)

using ptr_type = std::conditional<sizeof(intptr_t) == 8, int64_t, int32_t>::type;
using c8::C8Log;
using c8::cmd::TransferWrap;
using hgl::internal::AppSingleton;
using hgl::internal::bytesPerPixel;

WebGL2RenderingContext::WebGL2RenderingContext(
  int width,
  int height,
  bool alpha,
  bool depth,
  bool stencil,
  bool antialias,
  bool premultipliedAlpha,
  bool preserveDrawingBuffer,
  bool preferLowPowerToHighPerformance,
  bool failIfMajorPerformanceCaveat,
  void *nativeWindow)
    : WebGLRenderingContextBase() {
  // Initialize members
  state = GLCONTEXT_STATE_INIT;
  unpack_flip_y = false;
  unpack_premultiply_alpha = false;
  unpack_colorspace_conversion = 0x9244;
  unpack_alignment = 4;
  unpack_row_length = 0;
  unpack_skip_pixels = 0;
  unpack_skip_rows = 0;
  next = nullptr;
  prev = nullptr;

  // Get the app singleton and initialize EGL if it isn't already.
  AppSingleton &app = AppSingleton::getInstance({
    // Prefer Metal if a native window is provided, OpenGL otherwise. This is due to deadlock issues
    // that we are observing when running multiple Metal contexts.
    .preferMetal = (nativeWindow != nullptr),
  });
  startCommandBufferThread();

  if (app.tryAttachContext(this, nativeWindow)) {
    c8::setXrCommandBuffer(&commandBuffer());
  } else {
    nativeWindow = nullptr;  // Fall back to offscreen rendering.
  }

  std::vector<EGLint> attrib_list;

  if (nativeWindow == nullptr) {
    // Use an offscreen pbuffer.
    attrib_list.push_back(EGL_SURFACE_TYPE);
    attrib_list.push_back(EGL_PBUFFER_BIT);
  }

  attrib_list.insert(
    attrib_list.end(),
    {EGL_RED_SIZE,
     8,
     EGL_GREEN_SIZE,
     8,
     EGL_BLUE_SIZE,
     8,
     EGL_RENDERABLE_TYPE,
     EGL_OPENGL_ES3_BIT});

  if (alpha) {
    attrib_list.push_back(EGL_ALPHA_SIZE);
    attrib_list.push_back(8);
  }

  if (depth) {
    attrib_list.push_back(EGL_DEPTH_SIZE);
    attrib_list.push_back(24);
  }

  if (stencil) {
    attrib_list.push_back(EGL_STENCIL_SIZE);
    attrib_list.push_back(8);
  }

  if (antialias && nativeWindow != nullptr /* unsupported for Pbuffers */) {
    attrib_list.insert(attrib_list.end(), {EGL_SAMPLE_BUFFERS, 1, EGL_SAMPLES, 4});
  }
  attrib_list.push_back(EGL_NONE);

  auto &cb = commandBuffer();

  cb.queueCommand(eglBindAPI, EGL_OPENGL_ES_API);
  if (cb.runSyncCommand(eglGetError) != EGL_SUCCESS) {
    state = GLCONTEXT_STATE_ERROR;
    return;
  }

  EGLint num_config;
  auto chooseConfigResult =
    cb.runSyncCommand(eglChooseConfig, app.display(), attrib_list.data(), &config, 1, &num_config);
  if (chooseConfigResult != EGL_TRUE || num_config != 1) {
    state = GLCONTEXT_STATE_ERROR;
    return;
  }

  // Extra debugging:
  {
    EGLint config_renderable_type;
    if (!cb.runSyncCommand(
          eglGetConfigAttrib,
          app.display(),
          config,
          EGL_RENDERABLE_TYPE,
          &config_renderable_type)) {
      state = GLCONTEXT_STATE_ERROR;
      return;
    }
  }

  // Create context
  EGLint contextAttribs[] = {
    EGL_CONTEXT_MAJOR_VERSION_KHR,
    EGL_MAJOR_VERSION_WEBGL2,
    EGL_CONTEXT_MINOR_VERSION_KHR,
    EGL_MINOR_VERSION_WEBGL2,
#if C8_USE_ANGLE
    EGL_EXTENSIONS_ENABLED_ANGLE,
    EGL_TRUE,
    EGL_CONTEXT_WEBGL_COMPATIBILITY_ANGLE,
    EGL_TRUE,
#endif
    EGL_NONE};
  context =
    cb.runSyncCommand(eglCreateContext, app.display(), config, EGL_NO_CONTEXT, contextAttribs);
  if (context == EGL_NO_CONTEXT) {
    state = GLCONTEXT_STATE_ERROR;
    return;
  }

#if !C8_USE_ANGLE
  if (nativeWindow) {
    c8::notifyXrCompatibleGlContext(app.display(), context, config);
  }
#endif

  // Create surface and make it current.
  createSurface(nativeWindow, width, height);

  if (surface == EGL_NO_SURFACE) {
    state = GLCONTEXT_STATE_ERROR;
    return;
  }

  // Success
  state = GLCONTEXT_STATE_OK;
  registerContext();

  // Initialize function pointers
  initPointers();

  // Check extensions
  const char *extensionString = (const char *)(cb.runSyncCommand(glGetString, GL_EXTENSIONS));

  // Load required extensions
  for (const char **rext = REQUIRED_EXTENSIONS_WEBGL2; *rext; ++rext) {
    if (!strstr(extensionString, *rext)) {
      dispose();
      state = GLCONTEXT_STATE_ERROR;
      return;
    }
  }

  // Select best preferred depth
  preferredDepth = GL_DEPTH_COMPONENT16;
  if (strstr(extensionString, "GL_depth32")) {
    preferredDepth = GL_DEPTH_COMPONENT32F;
  } else if (strstr(extensionString, "GL_depth24")) {
    preferredDepth = GL_DEPTH_COMPONENT24;
  }
}
#include <execinfo.h>
void WebGL2RenderingContext::setError(GLenum error) {
  if (error == GL_NO_ERROR || lastError != GL_NO_ERROR) {
    return;
  }
  GLenum prevError = (this->glGetError)();
  if (prevError == GL_NO_ERROR) {
    lastError = error;
  }
}

void WebGL2RenderingContext::dispose() {
  DISPOSE_CONTEXT(WebGL2RenderingContext, glDeleteVertexArrays);
}

WebGL2RenderingContext::~WebGL2RenderingContext() {
  dispose();
  if (AppSingleton::getInstance().detachContext(this)) {
    c8::setXrCommandBuffer(nullptr);
  }
}

GLenum WebGL2RenderingContext::getError() {
  GLenum error = (this->glGetError)();
  if (lastError != GL_NO_ERROR) {
    error = lastError;
  }
  lastError = GL_NO_ERROR;
  return error;
}

COMMON_WEBGL_METHODS();

NEW_WEBGL_CONTEXT(WebGL2RenderingContext);

GL_METHOD(RenderbufferStorage) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLenum internalformat = Nan::To<int32_t>(info[1]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[2]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[3]).ToChecked();

  if (internalformat == GL_DEPTH_STENCIL) {
    internalformat = GL_DEPTH24_STENCIL8;
  } else if (internalformat == GL_DEPTH_COMPONENT32F) {
    internalformat = inst->preferredDepth;
  }

  cb.queueCommand(inst->glRenderbufferStorage, target, internalformat, width, height);
}

GL_METHOD(RenderbufferStorageMultisample) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLsizei samples = Nan::To<int32_t>(info[1]).ToChecked();
  GLenum internalformat = Nan::To<int32_t>(info[2]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[3]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[4]).ToChecked();

  if (internalformat == GL_DEPTH_STENCIL) {
    internalformat = GL_DEPTH24_STENCIL8;
  } else if (internalformat == GL_DEPTH_COMPONENT32F) {
    internalformat = inst->preferredDepth;
  }

  cb.queueCommand(
    inst->glRenderbufferStorageMultisample, target, samples, internalformat, width, height);
}

GL_METHOD(GetTexParameter) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();

  GLint param_value = 0;
  GLfloat param_f_value = 0;
  switch (pname) {
    case GL_TEXTURE_MIN_FILTER:
    case GL_TEXTURE_MAG_FILTER:
    case GL_TEXTURE_WRAP_S:
    case GL_TEXTURE_WRAP_T:
    case GL_TEXTURE_WRAP_R:
    case GL_TEXTURE_COMPARE_MODE:
    case GL_TEXTURE_COMPARE_FUNC:
    case GL_TEXTURE_BASE_LEVEL:
    case GL_TEXTURE_MAX_LEVEL:
    case GL_TEXTURE_IMMUTABLE_FORMAT:
      cb.runSyncCommand(inst->glGetTexParameteriv, target, pname, &param_value);
      info.GetReturnValue().Set(Nan::New<v8::Integer>(param_value));
      break;
    case GL_TEXTURE_MAX_LOD:
    case GL_TEXTURE_MIN_LOD:
    case GL_TEXTURE_MAX_ANISOTROPY_EXT:
      cb.runSyncCommand(inst->glGetTexParameterfv, target, pname, &param_f_value);
      info.GetReturnValue().Set(Nan::New<v8::Number>(param_f_value));
      break;
    default:
      info.GetReturnValue().Set(Nan::Null());
      break;
  }
}

GL_METHOD(DrawBuffers) {
  GL_BOILERPLATE;

  v8::Local<v8::Array> buffersArray = v8::Local<v8::Array>::Cast(info[0]);
  GLuint numBuffers = buffersArray->Length();
  GLenum *buffers = new GLenum[numBuffers];

  for (GLuint i = 0; i < numBuffers; i++) {
    buffers[i] =
      Nan::Get(buffersArray, i).ToLocalChecked()->Uint32Value(Nan::GetCurrentContext()).ToChecked();
  }

  cb.queueCommand(inst->glDrawBuffers, numBuffers, buffers);

  delete[] buffers;
}

GL_METHOD(DrawRangeElements) {
  GL_BOILERPLATE;

  GLenum mode = Nan::To<int32_t>(info[0]).ToChecked();
  GLuint start = Nan::To<uint32_t>(info[1]).ToChecked();
  GLuint end = Nan::To<uint32_t>(info[2]).ToChecked();
  GLsizei count = Nan::To<int32_t>(info[3]).ToChecked();
  GLenum type = Nan::To<int32_t>(info[4]).ToChecked();
  GLintptr offset = Nan::To<ptr_type>(info[5]).ToChecked();

  cb.queueCommand(
    inst->glDrawRangeElements,
    mode,
    start,
    end,
    count,
    type,
    reinterpret_cast<const void *>(offset));
}

GL_METHOD(BeginTransformFeedback) {
  GL_BOILERPLATE;

  GLenum primitiveMode = Nan::To<int32_t>(info[0]).ToChecked();

  cb.queueCommand(inst->glBeginTransformFeedback, primitiveMode);
}

GL_METHOD(BeginQuery) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLuint id = Nan::To<uint32_t>(info[1]).ToChecked();

  cb.queueCommand(inst->glBeginQuery, target, id);
}

GL_METHOD(BindVertexArray) {
  GL_BOILERPLATE;

  GLuint array = Nan::To<uint32_t>(info[0]).ToChecked();

  cb.queueCommand(inst->glBindVertexArray, array);
}

GL_METHOD(BindBufferBase) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLuint index = Nan::To<uint32_t>(info[1]).ToChecked();
  GLuint buffer = Nan::To<uint32_t>(info[2]).ToChecked();

  cb.queueCommand(inst->glBindBufferBase, target, index, buffer);
}

GL_METHOD(BindBufferRange) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLuint index = Nan::To<uint32_t>(info[1]).ToChecked();
  GLuint buffer = Nan::To<uint32_t>(info[2]).ToChecked();
  GLintptr offset = Nan::To<ptr_type>(info[3]).ToChecked();
  GLsizeiptr size = Nan::To<ptr_type>(info[4]).ToChecked();

  cb.queueCommand(inst->glBindBufferRange, target, index, buffer, offset, size);
}

GL_METHOD(BindSampler) {
  GL_BOILERPLATE;

  GLuint unit = Nan::To<uint32_t>(info[0]).ToChecked();
  GLuint sampler = Nan::To<uint32_t>(info[1]).ToChecked();

  cb.queueCommand(inst->glBindSampler, unit, sampler);
}

GL_METHOD(BindTransformFeedback) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLuint id = Nan::To<uint32_t>(info[1]).ToChecked();

  cb.queueCommand(inst->glBindTransformFeedback, target, id);
}

GL_METHOD(CompressedTexImage2D) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLint level = Nan::To<int32_t>(info[1]).ToChecked();
  GLenum internalformat = Nan::To<int32_t>(info[2]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[3]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[4]).ToChecked();
  GLint border = Nan::To<int32_t>(info[5]).ToChecked();
  GLsizei imageSize = Nan::To<int32_t>(info[6]).ToChecked();
  Nan::TypedArrayContents<unsigned char> data(info[7]);

  cb.queueCommand(
    inst->glCompressedTexImage2D,
    target,
    level,
    internalformat,
    width,
    height,
    border,
    imageSize,
    TransferWrap(reinterpret_cast<void *>(*data), imageSize));
}

GL_METHOD(CompressedTexSubImage2D) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLint level = Nan::To<int32_t>(info[1]).ToChecked();
  GLint xoffset = Nan::To<int32_t>(info[2]).ToChecked();
  GLint yoffset = Nan::To<int32_t>(info[3]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[4]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[5]).ToChecked();
  GLenum format = Nan::To<int32_t>(info[6]).ToChecked();
  GLsizei imageSize = Nan::To<int32_t>(info[7]).ToChecked();
  Nan::TypedArrayContents<unsigned char> data(info[8]);

  cb.queueCommand(
    inst->glCompressedTexSubImage2D,
    target,
    level,
    xoffset,
    yoffset,
    width,
    height,
    format,
    imageSize,
    TransferWrap(reinterpret_cast<void *>(*data), imageSize));
}

GL_METHOD(CopyBufferSubData) {
  GL_BOILERPLATE;

  GLenum readTarget = Nan::To<int32_t>(info[0]).ToChecked();
  GLenum writeTarget = Nan::To<int32_t>(info[1]).ToChecked();
  GLintptr readOffset = Nan::To<ptr_type>(info[2]).ToChecked();
  GLintptr writeOffset = Nan::To<ptr_type>(info[3]).ToChecked();
  GLsizeiptr size = Nan::To<ptr_type>(info[4]).ToChecked();

  cb.queueCommand(
    inst->glCopyBufferSubData, readTarget, writeTarget, readOffset, writeOffset, size);
}

GL_METHOD(CopyTexSubImage3D) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLint level = Nan::To<int32_t>(info[1]).ToChecked();
  GLint xoffset = Nan::To<int32_t>(info[2]).ToChecked();
  GLint yoffset = Nan::To<int32_t>(info[3]).ToChecked();
  GLint zoffset = Nan::To<int32_t>(info[4]).ToChecked();
  GLint x = Nan::To<int32_t>(info[5]).ToChecked();
  GLint y = Nan::To<int32_t>(info[6]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[7]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[8]).ToChecked();

  cb.queueCommand(
    inst->glCopyTexSubImage3D, target, level, xoffset, yoffset, zoffset, x, y, width, height);
}

GL_METHOD(ClearBufferfv) {
  GL_BOILERPLATE;

  GLenum buffer = Nan::To<int32_t>(info[0]).ToChecked();
  GLint drawbuffer = Nan::To<int32_t>(info[1]).ToChecked();
  v8::Local<v8::Array> value = v8::Local<v8::Array>::Cast(info[2]);
  GLfloat *data = new GLfloat[value->Length()];

  for (unsigned int i = 0; i < value->Length(); i++) {
    data[i] =
      Nan::Get(value, i).ToLocalChecked()->NumberValue(Nan::GetCurrentContext()).ToChecked();
  }

  cb.queueCommand(inst->glClearBufferfv, buffer, drawbuffer, data);

  delete[] data;
}

GL_METHOD(ClearBufferuiv) {
  GL_BOILERPLATE;

  GLenum buffer = Nan::To<int32_t>(info[0]).ToChecked();
  GLint drawbuffer = Nan::To<int32_t>(info[1]).ToChecked();
  v8::Local<v8::Array> value = v8::Local<v8::Array>::Cast(info[2]);
  GLuint *data = new GLuint[value->Length()];

  for (unsigned int i = 0; i < value->Length(); i++) {
    data[i] =
      Nan::Get(value, i).ToLocalChecked()->Uint32Value(Nan::GetCurrentContext()).ToChecked();
  }

  cb.queueCommand(inst->glClearBufferuiv, buffer, drawbuffer, data);

  delete[] data;
}

GL_METHOD(ClearBufferiv) {
  GL_BOILERPLATE;

  GLenum buffer = Nan::To<int32_t>(info[0]).ToChecked();
  GLint drawbuffer = Nan::To<int32_t>(info[1]).ToChecked();
  v8::Local<v8::Array> value = v8::Local<v8::Array>::Cast(info[2]);
  GLint *data = new GLint[value->Length()];

  for (unsigned int i = 0; i < value->Length(); i++) {
    data[i] = Nan::Get(value, i).ToLocalChecked()->Int32Value(Nan::GetCurrentContext()).ToChecked();
  }

  cb.queueCommand(inst->glClearBufferiv, buffer, drawbuffer, data);

  delete[] data;
}

GL_METHOD(ClearBufferfi) {
  GL_BOILERPLATE;

  GLenum buffer = Nan::To<int32_t>(info[0]).ToChecked();
  GLint drawbuffer = Nan::To<int32_t>(info[1]).ToChecked();
  GLfloat depth = Nan::To<double>(info[2]).ToChecked();
  GLint stencil = Nan::To<int32_t>(info[3]).ToChecked();

  cb.queueCommand(inst->glClearBufferfi, buffer, drawbuffer, depth, stencil);
}

GL_METHOD(ClientWaitSync) {
  GL_BOILERPLATE;

  v8::Local<v8::Value> value = info[0];
  intptr_t intValue = value->IntegerValue(Nan::GetCurrentContext()).FromJust();
  GLsync sync = (GLsync)intValue;
  GLbitfield flags = Nan::To<int32_t>(info[1]).ToChecked();
  GLuint64 timeout = Nan::To<uint32_t>(info[2]).ToChecked();

  GLenum result = cb.runSyncCommand(inst->glClientWaitSync, sync, flags, timeout);
  info.GetReturnValue().Set(Nan::New<v8::Integer>(result));
}

GL_METHOD(CreateSampler) {
  GL_BOILERPLATE;

  GLuint sampler;
  cb.runSyncCommand(inst->glGenSamplers, 1, &sampler);

  info.GetReturnValue().Set(Nan::New<v8::Integer>(sampler));
}

GL_METHOD(CreateTransformFeedback) {
  GL_BOILERPLATE;

  GLuint id;
  cb.runSyncCommand(inst->glGenTransformFeedbacks, 1, &id);

  info.GetReturnValue().Set(Nan::New<v8::Integer>(id));
}

GL_METHOD(CreateQuery) {
  GL_BOILERPLATE;

  GLuint id;
  cb.runSyncCommand(inst->glGenQueries, 1, &id);

  info.GetReturnValue().Set(Nan::New<v8::Integer>(id));
}

GL_METHOD(CreateVertexArray) {
  GL_BOILERPLATE;

  GLuint array = 0;
  cb.runSyncCommand(inst->glGenVertexArrays, 1, &array);
  inst->registerGLObj(GLOBJECT_TYPE_VERTEX_ARRAY, array);

  info.GetReturnValue().Set(Nan::New<v8::Integer>(array));
}

GL_METHOD(DeleteVertexArray) {
  GL_BOILERPLATE;

  GLuint array = Nan::To<uint32_t>(info[0]).ToChecked();
  inst->unregisterGLObj(GLOBJECT_TYPE_VERTEX_ARRAY, array);

  using UintWrap1 = c8::cmd::FixedArrayWrap<GLuint, 1>;
  cb.queueCommand(inst->glDeleteVertexArrays, 1, UintWrap1(&array));
}

GL_METHOD(DeleteSampler) {
  GL_BOILERPLATE;

  GLuint sampler = Nan::To<uint32_t>(info[0]).ToChecked();

  using UintWrap1 = c8::cmd::FixedArrayWrap<GLuint, 1>;
  cb.queueCommand(inst->glDeleteSamplers, 1, UintWrap1(&sampler));
}

GL_METHOD(DeleteSync) {
  GL_BOILERPLATE;

  v8::Local<v8::Value> value = info[0];
  intptr_t intValue = value->IntegerValue(Nan::GetCurrentContext()).FromJust();
  GLsync sync = (GLsync)intValue;
  cb.queueCommand(inst->glDeleteSync, sync);
}

GL_METHOD(DeleteTransformFeedback) {
  GL_BOILERPLATE;

  GLuint id = Nan::To<uint32_t>(info[0]).ToChecked();

  using UintWrap1 = c8::cmd::FixedArrayWrap<GLuint, 1>;
  cb.queueCommand(inst->glDeleteTransformFeedbacks, 1, UintWrap1(&id));
}

GL_METHOD(DeleteQuery) {
  GL_BOILERPLATE;

  GLuint id = Nan::To<uint32_t>(info[0]).ToChecked();

  using UintWrap1 = c8::cmd::FixedArrayWrap<GLuint, 1>;
  cb.queueCommand(inst->glDeleteQueries, 1, UintWrap1(&id));
}

GL_METHOD(EndTransformFeedback) {
  GL_BOILERPLATE;

  cb.queueCommand(inst->glEndTransformFeedback);
}

GL_METHOD(EndQuery) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();

  cb.queueCommand(inst->glEndQuery, target);
}

GL_METHOD(FenceSync) {
  GL_BOILERPLATE;

  GLenum condition = Nan::To<int32_t>(info[0]).ToChecked();
  GLbitfield flags = Nan::To<int32_t>(info[1]).ToChecked();

  GLsync sync = cb.runSyncCommand(inst->glFenceSync, condition, flags);
  info.GetReturnValue().Set(Nan::New<v8::Number>(reinterpret_cast<ptr_type>(sync)));
}

GL_METHOD(IsQuery) {
  GL_BOILERPLATE;

  info.GetReturnValue().Set(
    Nan::New<v8::Boolean>(
      cb.runSyncCommand(inst->glIsQuery, Nan::To<uint32_t>(info[0]).ToChecked()) != 0));
}

GL_METHOD(IsVertexArray) {
  GL_BOILERPLATE;

  info.GetReturnValue().Set(
    Nan::New<v8::Boolean>(
      cb.runSyncCommand(inst->glIsVertexArray, Nan::To<uint32_t>(info[0]).ToChecked()) != 0));
}

GL_METHOD(GetActiveUniformBlockParameter) {
  GL_BOILERPLATE;

  GLuint program = Nan::To<uint32_t>(info[0]).ToChecked();
  GLuint uniformBlockIndex = Nan::To<uint32_t>(info[1]).ToChecked();
  GLenum pname = Nan::To<int32_t>(info[2]).ToChecked();

  GLint params[1];  // Specifies the address of a variable to receive the result of the query.
  cb.runSyncCommand(inst->glGetActiveUniformBlockiv, program, uniformBlockIndex, pname, params);

  switch (pname) {
    case GL_UNIFORM_BLOCK_DATA_SIZE:
    case GL_UNIFORM_BLOCK_BINDING:
    case GL_UNIFORM_BLOCK_ACTIVE_UNIFORMS:
    case GL_UNIFORM_BLOCK_NAME_LENGTH:
      info.GetReturnValue().Set(Nan::New<v8::Integer>(params[0]));
      break;
    case GL_UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER:
    case GL_UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER:
      info.GetReturnValue().Set(Nan::New<v8::Boolean>(params[0]));
      break;
    case GL_UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES:
      break;
    default:
      info.GetReturnValue().Set(Nan::Null());
      break;
  }

  return;
}

GL_METHOD(GetActiveUniforms) {
  GL_BOILERPLATE;

  GLuint program = Nan::To<uint32_t>(info[0]).ToChecked();
  Nan::TypedArrayContents<uint32_t> uniformIndices(info[1]);
  GLenum pname = Nan::To<int32_t>(info[2]).ToChecked();

  GLsizei numUniforms = uniformIndices.length();

  GLint *params = new GLint[numUniforms];  // Specifies the address of a variable to receive the
                                           // result of the query.
  cb.runSyncCommand(
    inst->glGetActiveUniformsiv, program, numUniforms, *uniformIndices, pname, params);

  v8::Local<v8::Array> resultArr = Nan::New<v8::Array>(numUniforms);
  switch (pname) {
    case GL_UNIFORM_TYPE:
      for (int i = 0; i < numUniforms; i++) {
        Nan::Set(resultArr, i, Nan::New<v8::Integer>(params[i]));
      }

      info.GetReturnValue().Set(resultArr);
      break;
    case GL_UNIFORM_SIZE:
      for (int i = 0; i < numUniforms; i++) {
        Nan::Set(resultArr, i, Nan::New<v8::Integer>((uint)params[i]));
      }

      info.GetReturnValue().Set(resultArr);
      break;
    case GL_UNIFORM_BLOCK_INDEX:
    case GL_UNIFORM_OFFSET:
    case GL_UNIFORM_ARRAY_STRIDE:
    case GL_UNIFORM_MATRIX_STRIDE:
      for (int i = 0; i < numUniforms; i++) {
        Nan::Set(resultArr, i, Nan::New<v8::Integer>(params[i]));
      }

      info.GetReturnValue().Set(resultArr);
      break;
    case GL_UNIFORM_IS_ROW_MAJOR:
      for (int i = 0; i < numUniforms; i++) {
        Nan::Set(resultArr, i, Nan::New<v8::Boolean>(params[i]));
      }

      info.GetReturnValue().Set(resultArr);
      break;
    default:
      info.GetReturnValue().Set(Nan::Null());
      break;
  }

  delete[] params;
}

GL_METHOD(GetFragDataLocation) {
  GL_BOILERPLATE;

  GLuint program = Nan::To<uint32_t>(info[0]).ToChecked();
  Nan::Utf8String name(info[1]);

  GLint location = cb.runSyncCommand(inst->glGetFragDataLocation, program, *name);
  info.GetReturnValue().Set(Nan::New<v8::Integer>(location));
}

GL_METHOD(GetIntegeriv) {
  GL_BOILERPLATE;

  GLenum pname = Nan::To<int32_t>(info[0]).ToChecked();
  GLuint index = Nan::To<uint32_t>(info[1]).ToChecked();

  GLint data;
  cb.runSyncCommand(inst->glGetIntegeri_v, pname, index, &data);
  info.GetReturnValue().Set(Nan::New<v8::Integer>(data));
}

GL_METHOD(GetInternalformatParameter) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLenum internalformat = Nan::To<int32_t>(info[1]).ToChecked();
  GLenum pname = Nan::To<int32_t>(info[2]).ToChecked();

  if (pname == GL_SAMPLES) {
    GLint maxSamples;
    cb.runSyncCommand(inst->glGetIntegerv, GL_MAX_SAMPLES, &maxSamples);

    GLint *samples = new GLint[maxSamples];
    cb.runSyncCommand(
      inst->glGetInternalformativ, target, internalformat, pname, maxSamples, samples);

    int jsArraySize = 0;
    for (GLint i = 0; i < maxSamples && samples[i] != 0; i++) {
      jsArraySize++;
    }

    v8::Local<v8::Array> result = Nan::New<v8::Array>(jsArraySize);
    for (GLint i = 0; i < jsArraySize; i++) {
      Nan::Set(result, i, Nan::New<v8::Integer>(samples[i]));
    }

    info.GetReturnValue().Set(result);

    delete[] samples;
  } else {
    info.GetReturnValue().Set(Nan::Null());
  }
}

GL_METHOD(GetParameter2) {
  GL_BOILERPLATE;
  GLenum name = Nan::To<int32_t>(info[0]).ToChecked();

  switch (name) {
    case GL_MAX_3D_TEXTURE_SIZE:
    case GL_MAX_ARRAY_TEXTURE_LAYERS:
    case GL_MAX_COLOR_ATTACHMENTS:
    case GL_MAX_COMBINED_UNIFORM_BLOCKS:
    case GL_MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS:
    case GL_MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS:
    case GL_MAX_DRAW_BUFFERS:
    case GL_MAX_ELEMENT_INDEX:
    case GL_MAX_ELEMENTS_INDICES:
    case GL_MAX_ELEMENTS_VERTICES:
    case GL_MAX_FRAGMENT_INPUT_COMPONENTS:
    case GL_MAX_FRAGMENT_UNIFORM_BLOCKS:
    case GL_MAX_FRAGMENT_UNIFORM_COMPONENTS:
    case GL_MAX_PROGRAM_TEXEL_OFFSET:
    case GL_MAX_SAMPLES:
    case GL_MAX_SERVER_WAIT_TIMEOUT:
    case GL_MAX_TEXTURE_LOD_BIAS:
    case GL_MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS:
    case GL_MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS:
    case GL_MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS:
    case GL_MAX_UNIFORM_BLOCK_SIZE:
    case GL_MAX_UNIFORM_BUFFER_BINDINGS:
    case GL_MAX_VARYING_COMPONENTS:
    case GL_MAX_VERTEX_OUTPUT_COMPONENTS:
    case GL_MAX_VERTEX_UNIFORM_BLOCKS:
    case GL_MAX_VERTEX_UNIFORM_COMPONENTS:
    case GL_MIN_PROGRAM_TEXEL_OFFSET:
    case GL_FRAGMENT_SHADER_DERIVATIVE_HINT:
    case GL_PACK_ROW_LENGTH:
    case GL_PACK_SKIP_PIXELS:
    case GL_PACK_SKIP_ROWS:
    case GL_UNIFORM_BUFFER_OFFSET_ALIGNMENT:
    case GL_UNPACK_IMAGE_HEIGHT:
    case GL_UNPACK_ROW_LENGTH:
    case GL_UNPACK_SKIP_IMAGES:
    case GL_UNPACK_SKIP_PIXELS:
    case GL_UNPACK_SKIP_ROWS:
    case GL_READ_BUFFER:
    case GL_READ_FRAMEBUFFER_BINDING:
    case GL_FRAMEBUFFER_BINDING:  // same as GL_DRAW_FRAMEBUFFER_BINDING
    case GL_VERTEX_ARRAY_BINDING:
    case GL_DRAW_BUFFER0:
    case GL_DRAW_BUFFER1:
    case GL_DRAW_BUFFER2:
    case GL_DRAW_BUFFER3:
    case GL_DRAW_BUFFER4:
    case GL_DRAW_BUFFER5:
    case GL_DRAW_BUFFER6:
    case GL_DRAW_BUFFER7:
    case GL_DRAW_BUFFER8:
    case GL_DRAW_BUFFER9:
    case GL_DRAW_BUFFER10:
    case GL_DRAW_BUFFER11:
    case GL_DRAW_BUFFER12:
    case GL_DRAW_BUFFER13:
    case GL_DRAW_BUFFER14:
    case GL_DRAW_BUFFER15: {
      GLint params;
      cb.runSyncCommand(inst->glGetIntegerv, name, &params);
      info.GetReturnValue().Set(Nan::New<v8::Integer>(params));
      return;
    }
    case GL_RASTERIZER_DISCARD:
    case GL_SAMPLE_ALPHA_TO_COVERAGE:
    case GL_SAMPLE_COVERAGE:
    case GL_TRANSFORM_FEEDBACK_ACTIVE:
    case GL_TRANSFORM_FEEDBACK_PAUSED: {
      GLboolean params;
      cb.runSyncCommand(inst->glGetBooleanv, name, &params);
      info.GetReturnValue().Set(Nan::New<v8::Boolean>(params));
      return;
    }
    default:
      info.GetReturnValue().Set(Nan::Null());
      return;
  }
}

GL_METHOD(GetTransformFeedbackVarying) {
  GL_BOILERPLATE;

  GLuint program = Nan::To<uint32_t>(info[0]).ToChecked();
  GLuint index = Nan::To<uint32_t>(info[1]).ToChecked();

  GLint bufSize;
  cb.runSyncCommand(
    inst->glGetProgramiv, program, GL_TRANSFORM_FEEDBACK_VARYING_MAX_LENGTH, &bufSize);

  GLsizei outLength;
  GLsizei outSize;
  GLenum type;
  GLchar *name = new GLchar[bufSize];
  cb.runSyncCommand(
    inst->glGetTransformFeedbackVarying,
    program,
    index,
    bufSize,
    &outLength,
    &outSize,
    &type,
    name);

  if (name[0] != '\0') {
    // Create a JavaScript object to hold the results
    v8::Local<v8::Object> result = Nan::New<v8::Object>();
    v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();
    result->Set(context, Nan::New("size").ToLocalChecked(), Nan::New<v8::Integer>(outSize)).Check();
    result->Set(context, Nan::New("type").ToLocalChecked(), Nan::New<v8::Integer>(type)).Check();
    result->Set(context, Nan::New("name").ToLocalChecked(), Nan::New(name).ToLocalChecked())
      .Check();
    info.GetReturnValue().Set(result);
  } else {
    info.GetReturnValue().Set(Nan::Null());
  }

  // Clean up
  delete[] name;
}

GL_METHOD(GetQuery) {
  GL_BOILERPLATE;

  GLenum pname = Nan::To<int32_t>(info[0]).ToChecked();
  GLuint id = Nan::To<uint32_t>(info[1]).ToChecked();

  GLint params;
  cb.runSyncCommand(inst->glGetQueryiv, pname, id, &params);
  info.GetReturnValue().Set(Nan::New<v8::Integer>(params));
}

GL_METHOD(GetQueryParameter) {
  GL_BOILERPLATE;

  GLuint id = Nan::To<uint32_t>(info[0]).ToChecked();
  GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();

  GLuint params;
  cb.runSyncCommand(inst->glGetQueryObjectuiv, id, pname, &params);
  info.GetReturnValue().Set(Nan::New<v8::Integer>(params));
}

GL_METHOD(GetUniformBlockIndex) {
  GL_BOILERPLATE;

  GLuint program = Nan::To<uint32_t>(info[0]).ToChecked();
  Nan::Utf8String uniformBlockName(info[1]);

  GLuint index = cb.runSyncCommand(inst->glGetUniformBlockIndex, program, *uniformBlockName);
  info.GetReturnValue().Set(Nan::New<v8::Integer>(index));
}

GL_METHOD(GetUniformIndices) {
  GL_BOILERPLATE;

  GLuint program = Nan::To<uint32_t>(info[0]).ToChecked();
  if (info[1]->IsObject()) {
    v8::Local<v8::Array> jsNamesArray = v8::Local<v8::Array>::Cast(info[1]);
    v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();

    // Allocate memory for the GLchar** array
    GLchar **names = new GLchar *[jsNamesArray->Length()];
    GLsizei numUniforms = jsNamesArray->Length();

    for (auto i = 0; i < numUniforms; ++i) {
      v8::Local<v8::Value> jsName = jsNamesArray->Get(context, i).ToLocalChecked();
      Nan::Utf8String utf8Name(jsName);
      std::string nameStr(*utf8Name);
      names[i] = new GLchar[nameStr.size() + 1];
      std::strcpy(names[i], nameStr.c_str());
    }

    GLuint *indices = new GLuint[numUniforms];
    cb.runSyncCommand(inst->glGetUniformIndices, program, numUniforms, names, indices);

    v8::Local<v8::Array> arr = Nan::New<v8::Array>(numUniforms);
    for (GLsizei i = 0; i < numUniforms; i++) {
      Nan::Set(arr, i, Nan::New<v8::Integer>(indices[i]));
    }
    info.GetReturnValue().Set(arr);

    // Clean up the allocated memory
    for (uint32_t i = 0; i < numUniforms; ++i) {
      delete[] names[i];
    }
    delete[] names;
    delete[] indices;

    return;
  }

  info.GetReturnValue().Set(Nan::Null());
  return;
}

GL_METHOD(IsSampler) {
  GL_BOILERPLATE;

  GLuint sampler = Nan::To<uint32_t>(info[0]).ToChecked();
  info.GetReturnValue().Set(
    Nan::New<v8::Boolean>(cb.runSyncCommand(inst->glIsSampler, sampler) != 0));
}

GL_METHOD(IsSync) {
  GL_BOILERPLATE;

  v8::Local<v8::Value> value = info[0];
  intptr_t intValue = value->IntegerValue(Nan::GetCurrentContext()).FromJust();
  GLsync sync = (GLsync)intValue;
  info.GetReturnValue().Set(Nan::New<v8::Boolean>(cb.runSyncCommand(inst->glIsSync, sync) != 0));
}

GL_METHOD(IsTransformFeedback) {
  GL_BOILERPLATE;

  GLuint id = Nan::To<uint32_t>(info[0]).ToChecked();
  info.GetReturnValue().Set(
    Nan::New<v8::Boolean>(cb.runSyncCommand(inst->glIsTransformFeedback, id) != 0));
}

GL_METHOD(PauseTransformFeedback) {
  GL_BOILERPLATE;

  cb.queueCommand(inst->glPauseTransformFeedback);
}

GL_METHOD(PixelStorei) {
  GL_BOILERPLATE;

  GLenum pname = Nan::To<int32_t>(info[0]).ToChecked();
  GLenum param = Nan::To<int32_t>(info[1]).ToChecked();

  /* Handle WebGL specific extensions */
  switch (pname) {
    case 0x9240:
      inst->unpack_flip_y = param != 0;
      break;

    case 0x9241:
      inst->unpack_premultiply_alpha = param != 0;
      break;

    case 0x9243:
      inst->unpack_colorspace_conversion = param;
      break;

    case GL_UNPACK_ALIGNMENT:
      inst->unpack_alignment = param;
      cb.queueCommand(inst->glPixelStorei, pname, param);
      break;
    case GL_UNPACK_ROW_LENGTH:
      inst->unpack_row_length = param;
      cb.queueCommand(inst->glPixelStorei, pname, param);
      break;
    case GL_UNPACK_SKIP_PIXELS:
      inst->unpack_skip_pixels = param;
      cb.queueCommand(inst->glPixelStorei, pname, param);
      break;
    case GL_UNPACK_SKIP_ROWS:
      inst->unpack_skip_rows = param;
      cb.queueCommand(inst->glPixelStorei, pname, param);
      break;

    case GL_PACK_ROW_LENGTH:
    case GL_PACK_SKIP_PIXELS:
    case GL_PACK_SKIP_ROWS:
    case GL_UNPACK_IMAGE_HEIGHT:
    case GL_UNPACK_SKIP_IMAGES:
    case GL_MAX_DRAW_BUFFERS:
      cb.queueCommand(inst->glPixelStorei, pname, param);
      break;

    default:
      cb.queueCommand(inst->glPixelStorei, pname, param);
      break;
  }
}

GL_METHOD(ResumeTransformFeedback) {
  GL_BOILERPLATE;

  cb.queueCommand(inst->glResumeTransformFeedback);
}

// New functions for WebGL2
GL_METHOD(BlitFramebuffer) {
  GL_BOILERPLATE;

  GLint srcX0 = Nan::To<int32_t>(info[0]).ToChecked();
  GLint srcY0 = Nan::To<int32_t>(info[1]).ToChecked();
  GLint srcX1 = Nan::To<int32_t>(info[2]).ToChecked();
  GLint srcY1 = Nan::To<int32_t>(info[3]).ToChecked();
  GLint dstX0 = Nan::To<int32_t>(info[4]).ToChecked();
  GLint dstY0 = Nan::To<int32_t>(info[5]).ToChecked();
  GLint dstX1 = Nan::To<int32_t>(info[6]).ToChecked();
  GLint dstY1 = Nan::To<int32_t>(info[7]).ToChecked();
  GLbitfield mask = Nan::To<int32_t>(info[8]).ToChecked();
  GLenum filter = Nan::To<int32_t>(info[9]).ToChecked();

  cb.queueCommand(
    inst->glBlitFramebuffer, srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter);
}

GL_METHOD(FramebufferTextureLayer) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLenum attachment = Nan::To<int32_t>(info[1]).ToChecked();
  GLuint texture = Nan::To<uint32_t>(info[2]).ToChecked();
  GLint level = Nan::To<int32_t>(info[3]).ToChecked();
  GLint layer = Nan::To<int32_t>(info[4]).ToChecked();

  cb.queueCommand(inst->glFramebufferTextureLayer, target, attachment, texture, level, layer);
}

GL_METHOD(InvalidateSubFramebuffer) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  v8::Local<v8::Array> attachments = v8::Local<v8::Array>::Cast(info[1]);
  GLsizei numAttachments = attachments->Length();
  GLenum *attachmentsArray = new GLenum[numAttachments];
  GLint x = Nan::To<int32_t>(info[2]).ToChecked();
  GLint y = Nan::To<int32_t>(info[3]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[4]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[5]).ToChecked();

  for (int i = 0; i < numAttachments; i++) {
    attachmentsArray[i] =
      Nan::Get(attachments, i).ToLocalChecked()->Uint32Value(Nan::GetCurrentContext()).ToChecked();
  }

  cb.queueCommand(
    inst->glInvalidateSubFramebuffer,
    target,
    numAttachments,
    attachmentsArray,
    x,
    y,
    width,
    height);

  delete[] attachmentsArray;
}

GL_METHOD(InvalidateFramebuffer) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  v8::Local<v8::Array> attachments = v8::Local<v8::Array>::Cast(info[1]);
  GLsizei numAttachments = attachments->Length();
  GLenum *attachmentsArray = new GLenum[numAttachments];

  for (int i = 0; i < numAttachments; i++) {
    attachmentsArray[i] =
      Nan::Get(attachments, i).ToLocalChecked()->Uint32Value(Nan::GetCurrentContext()).ToChecked();
  }

  cb.queueCommand(inst->glInvalidateFramebuffer, target, numAttachments, attachmentsArray);

  delete[] attachmentsArray;
}

GL_METHOD(ReadBuffer) {
  GL_BOILERPLATE;

  GLenum mode = Nan::To<int32_t>(info[0]).ToChecked();
  cb.queueCommand(inst->glReadBuffer, mode);
}

GL_METHOD(TexImage3D) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLint level = Nan::To<int32_t>(info[1]).ToChecked();
  GLenum internalformat = Nan::To<int32_t>(info[2]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[3]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[4]).ToChecked();
  GLsizei depth = Nan::To<int32_t>(info[5]).ToChecked();
  GLint border = Nan::To<int32_t>(info[6]).ToChecked();
  GLenum format = Nan::To<int32_t>(info[7]).ToChecked();
  GLint type = Nan::To<int32_t>(info[8]).ToChecked();
  Nan::TypedArrayContents<unsigned char> pixels(info[9]);

  if (*pixels) {
    auto rowBytes = inst->bytesPerRow(format, type, width, inst->unpack_row_length);
    auto pixelBytes = bytesPerPixel(format, type);
    auto offset = inst->pixelOffset(rowBytes, pixelBytes);
    if (inst->unpack_flip_y || inst->unpack_premultiply_alpha) {
      unsigned char *unpacked = inst->unpackPixels(  // TODO: Verify unpack on 3D texture
        type,
        format,
        width,
        height,
        *pixels);
      cb.queueCommand(
        inst->glTexImage3D,
        target,
        level,
        internalformat,
        width,
        height,
        depth,
        border,
        format,
        type,
        TransferWrap(reinterpret_cast<void *>(unpacked), height * depth * rowBytes, offset));
      delete[] unpacked;
    } else {
      cb.queueCommand(
        inst->glTexImage3D,
        target,
        level,
        internalformat,
        width,
        height,
        depth,
        border,
        format,
        type,
        TransferWrap(reinterpret_cast<void *>(*pixels), height * depth * rowBytes, offset));
    }
  } else {
    cb.queueCommand(
      inst->glTexImage3D,
      target,
      level,
      internalformat,
      width,
      height,
      depth,
      border,
      format,
      type,
      nullptr);
  }
}

GL_METHOD(GetBufferSubData) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLintptr offset = Nan::To<ptr_type>(info[1]).ToChecked();
  GLsizeiptr size = Nan::To<ptr_type>(info[2]).ToChecked();
  Nan::TypedArrayContents<unsigned char> data(info[3]);

  // Map the buffer range into the client's address space
  void *mappedBuffer =
    cb.runSyncCommand(inst->glMapBufferRange, target, offset, size, GL_MAP_READ_BIT);
  if (mappedBuffer == nullptr) {
    // Handle the error: mapping failed
    return;
  }

  // Copy the buffer data
  std::memcpy(*data, mappedBuffer, size);

  // Unmap the buffer
  GLboolean result = cb.runSyncCommand(inst->glUnmapBuffer, target);
  if (result == GL_FALSE) {
    // Handle the error: unmapping failed
    return;
  }
}

GL_METHOD(GetSamplerParameter) {
  GL_BOILERPLATE;

  GLuint sampler = Nan::To<uint32_t>(info[0]).ToChecked();
  GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();

  if (
    pname == GL_TEXTURE_MIN_LOD || pname == GL_TEXTURE_MAX_LOD
    || pname == GL_TEXTURE_MAX_ANISOTROPY_EXT) {
    GLfloat param_value = 0;
    cb.runSyncCommand(inst->glGetSamplerParameterfv, sampler, pname, &param_value);
    info.GetReturnValue().Set(Nan::New<v8::Number>(param_value));
  } else {
    GLint param_value = 0;
    cb.runSyncCommand(inst->glGetSamplerParameteriv, sampler, pname, &param_value);
    info.GetReturnValue().Set(Nan::New<v8::Integer>(param_value));
  }
}

GL_METHOD(GetSyncParameter) {
  GL_BOILERPLATE;

  v8::Local<v8::Value> value = info[0];
  intptr_t intValue = value->IntegerValue(Nan::GetCurrentContext()).FromJust();
  GLsync sync = (GLsync)intValue;
  GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();

  GLsizei length;
  GLint values;
  cb.runSyncCommand(inst->glGetSynciv, sync, pname, 1, &length, &values);
  info.GetReturnValue().Set(Nan::New<v8::Integer>(values));
}

GL_METHOD(SamplerParameteri) {
  GL_BOILERPLATE;

  GLuint sampler = Nan::To<uint32_t>(info[0]).ToChecked();
  GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();
  GLint param = Nan::To<int32_t>(info[2]).ToChecked();

  cb.queueCommand(inst->glSamplerParameteri, sampler, pname, param);
}

GL_METHOD(SamplerParameterf) {
  GL_BOILERPLATE;

  GLuint sampler = Nan::To<uint32_t>(info[0]).ToChecked();
  GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();
  GLfloat param = Nan::To<double>(info[2]).ToChecked();

  cb.queueCommand(inst->glSamplerParameterf, sampler, pname, param);
}

GL_METHOD(TexImage2D) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLint level = Nan::To<int32_t>(info[1]).ToChecked();
  GLenum internalformat = Nan::To<int32_t>(info[2]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[3]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[4]).ToChecked();
  GLint border = Nan::To<int32_t>(info[5]).ToChecked();
  GLenum format = Nan::To<int32_t>(info[6]).ToChecked();
  GLint type = Nan::To<int32_t>(info[7]).ToChecked();

  if (info[8]->IsNumber()) {
    GLint offset = Nan::To<int32_t>(info[8]).ToChecked();
    cb.queueCommand(
      inst->glTexImage2D,
      target,
      level,
      internalformat,
      width,
      height,
      border,
      format,
      type,
      reinterpret_cast<void *>(offset));
    return;
  }

  Nan::TypedArrayContents<unsigned char> pixels(info[8]);

  if (*pixels) {
    auto rowBytes = inst->bytesPerRow(format, type, width, inst->unpack_row_length);
    auto pixelBytes = bytesPerPixel(format, type);
    auto offset = inst->pixelOffset(rowBytes, pixelBytes);
    if (inst->unpack_flip_y || inst->unpack_premultiply_alpha) {
      unsigned char *unpacked = inst->unpackPixels(type, format, width, height, *pixels);
      cb.queueCommand(
        inst->glTexImage2D,
        target,
        level,
        internalformat,
        width,
        height,
        border,
        format,
        type,
        TransferWrap(reinterpret_cast<void *>(unpacked), height * rowBytes, offset));
      delete[] unpacked;
    } else {
      cb.queueCommand(
        inst->glTexImage2D,
        target,
        level,
        internalformat,
        width,
        height,
        border,
        format,
        type,
        TransferWrap(reinterpret_cast<void *>(*pixels), height * rowBytes, offset));
    }
  } else {
    cb.queueCommand(
      inst->glTexImage2D,
      target,
      level,
      internalformat,
      width,
      height,
      border,
      format,
      type,
      nullptr);
  }
}

GL_METHOD(TexSubImage2D) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLint level = Nan::To<int32_t>(info[1]).ToChecked();
  GLint xoffset = Nan::To<int32_t>(info[2]).ToChecked();
  GLint yoffset = Nan::To<int32_t>(info[3]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[4]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[5]).ToChecked();
  GLenum format = Nan::To<int32_t>(info[6]).ToChecked();
  GLenum type = Nan::To<int32_t>(info[7]).ToChecked();

  if (info[8]->IsNumber()) {
    GLint offset = Nan::To<int32_t>(info[8]).ToChecked();
    cb.queueCommand(
      inst->glTexSubImage2D,
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      type,
      reinterpret_cast<void *>(offset));
    return;
  }

  Nan::TypedArrayContents<unsigned char> pixels(info[8]);

  auto rowBytes = inst->bytesPerRow(format, type, width, inst->unpack_row_length);
  auto pixelBytes = bytesPerPixel(format, type);
  auto offset = inst->pixelOffset(rowBytes, pixelBytes);

  if (inst->unpack_flip_y || inst->unpack_premultiply_alpha) {
    unsigned char *unpacked = inst->unpackPixels(type, format, width, height, *pixels);
    cb.queueCommand(
      inst->glTexSubImage2D,
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      type,
      TransferWrap(reinterpret_cast<void *>(unpacked), height * rowBytes, offset));
    delete[] unpacked;
  } else {
    cb.queueCommand(
      inst->glTexSubImage2D,
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      type,
      TransferWrap(reinterpret_cast<void *>(*pixels), height * rowBytes, offset));
  }
}

GL_METHOD(TexSubImage3D) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLint level = Nan::To<int32_t>(info[1]).ToChecked();
  GLint xoffset = Nan::To<int32_t>(info[2]).ToChecked();
  GLint yoffset = Nan::To<int32_t>(info[3]).ToChecked();
  GLint zoffset = Nan::To<int32_t>(info[4]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[5]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[6]).ToChecked();
  GLsizei depth = Nan::To<int32_t>(info[7]).ToChecked();
  GLenum format = Nan::To<int32_t>(info[8]).ToChecked();
  GLenum type = Nan::To<int32_t>(info[9]).ToChecked();
  Nan::TypedArrayContents<unsigned char> pixels(info[10]);

  auto rowBytes = inst->bytesPerRow(format, type, width, inst->unpack_row_length);
  auto pixelBytes = bytesPerPixel(format, type);
  auto offset = inst->pixelOffset(rowBytes, pixelBytes);

  if (inst->unpack_flip_y || inst->unpack_premultiply_alpha) {
    unsigned char *unpacked = inst->unpackPixels(type, format, width, height, *pixels);
    cb.queueCommand(
      inst->glTexSubImage3D,
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      type,
      TransferWrap(reinterpret_cast<void *>(unpacked), height * depth * rowBytes, offset));
    delete[] unpacked;
  } else {
    cb.queueCommand(
      inst->glTexSubImage3D,
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      type,
      TransferWrap(reinterpret_cast<void *>(*pixels), height * depth * rowBytes, offset));
  }
}

GL_METHOD(TransformFeedbackVaryings) {
  GL_BOILERPLATE;

  GLuint program = Nan::To<uint32_t>(info[0]).ToChecked();
  v8::Local<v8::Array> varyingsArray = v8::Local<v8::Array>::Cast(info[1]);
  v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();
  GLenum bufferMode = Nan::To<int32_t>(info[2]).ToChecked();

  GLsizei count = varyingsArray->Length();
  GLchar **varyings = new GLchar *[count];
  for (int i = 0; i < count; i++) {
    v8::Local<v8::Value> name = varyingsArray->Get(context, i).ToLocalChecked();
    Nan::Utf8String utf8Name(name);
    std::string nameStr(*utf8Name);
    varyings[i] = new GLchar[nameStr.size() + 1];
    std::strcpy(varyings[i], nameStr.c_str());
  }

  cb.queueCommand(inst->glTransformFeedbackVaryings, program, count, varyings, bufferMode);

  cb.queueCommand(
    +[](GLchar **varyings, GLsizei count) {
      // Clean up the allocated memory
      for (int i = 0; i < count; ++i) {
        delete[] varyings[i];
      }
      delete[] varyings;
    },
    varyings,
    count);
}

GL_METHOD(TexStorage2D) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLsizei levels = Nan::To<int32_t>(info[1]).ToChecked();
  GLenum internalformat = Nan::To<int32_t>(info[2]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[3]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[4]).ToChecked();

  cb.queueCommand(inst->glTexStorage2D, target, levels, internalformat, width, height);
}

GL_METHOD(TexStorage3D) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLsizei levels = Nan::To<int32_t>(info[1]).ToChecked();
  GLenum internalformat = Nan::To<int32_t>(info[2]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[3]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[4]).ToChecked();
  GLsizei depth = Nan::To<int32_t>(info[5]).ToChecked();

  cb.queueCommand(inst->glTexStorage3D, target, levels, internalformat, width, height, depth);
}

GL_METHOD(Uniform1iv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();

  Nan::TypedArrayContents<GLint> value(info[1]);
  GLsizei count = value.length();

  cb.queueCommand(inst->glUniform1iv, location, count, TransferWrap(*value, count));
}

GL_METHOD(Uniform1fv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();

  Nan::TypedArrayContents<GLfloat> value(info[1]);
  GLsizei count = value.length();

  cb.queueCommand(inst->glUniform1fv, location, count, TransferWrap(*value, count));
}

GL_METHOD(Uniform1ui) {
  GL_BOILERPLATE;
  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  GLuint x = Nan::To<uint32_t>(info[1]).ToChecked();

  cb.queueCommand(inst->glUniform1ui, location, x);
}

GL_METHOD(Uniform1uiv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();

  Nan::TypedArrayContents<GLuint> value(info[1]);
  GLsizei count = value.length();

  cb.queueCommand(inst->glUniform1uiv, location, count, TransferWrap(*value, count));
}

GL_METHOD(Uniform2fv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  Nan::TypedArrayContents<GLfloat> data(info[1]);

  cb.queueCommand(
    inst->glUniform2fv, location, data.length() / 2, TransferWrap(*data, data.length()));
}

GL_METHOD(Uniform2iv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();

  Nan::TypedArrayContents<GLint> value(info[1]);
  GLsizei count = value.length() / 2;

  cb.queueCommand(inst->glUniform2iv, location, count, TransferWrap(*value, value.length()));
}

GL_METHOD(Uniform2ui) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  GLuint x = Nan::To<uint32_t>(info[1]).ToChecked();
  GLuint y = Nan::To<uint32_t>(info[2]).ToChecked();

  cb.queueCommand(inst->glUniform2ui, location, x, y);
}

GL_METHOD(Uniform2uiv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();

  Nan::TypedArrayContents<GLuint> value(info[1]);
  GLsizei count = value.length() / 2;

  cb.queueCommand(inst->glUniform2uiv, location, count, TransferWrap(*value, value.length()));
}

GL_METHOD(Uniform3fv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  Nan::TypedArrayContents<GLfloat> data(info[1]);

  cb.queueCommand(
    inst->glUniform3fv, location, data.length() / 3, TransferWrap(*data, data.length()));
}

GL_METHOD(Uniform3iv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();

  Nan::TypedArrayContents<GLint> value(info[1]);
  GLsizei count = value.length() / 3;

  cb.queueCommand(inst->glUniform3iv, location, count, TransferWrap(*value, value.length()));
}

GL_METHOD(Uniform3ui) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  GLuint x = Nan::To<uint32_t>(info[1]).ToChecked();
  GLuint y = Nan::To<uint32_t>(info[2]).ToChecked();
  GLuint z = Nan::To<uint32_t>(info[3]).ToChecked();

  cb.queueCommand(inst->glUniform3ui, location, x, y, z);
}

GL_METHOD(Uniform3uiv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();

  Nan::TypedArrayContents<GLuint> value(info[1]);
  GLsizei count = value.length() / 3;

  cb.queueCommand(inst->glUniform3uiv, location, count, TransferWrap(*value, value.length()));
}

GL_METHOD(Uniform4fv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  Nan::TypedArrayContents<GLfloat> data(info[1]);

  cb.queueCommand(
    inst->glUniform4fv, location, data.length() / 4, TransferWrap(*data, data.length()));
}

GL_METHOD(Uniform4iv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();

  Nan::TypedArrayContents<GLint> value(info[1]);
  GLsizei count = value.length() / 4;

  cb.queueCommand(inst->glUniform4iv, location, count, TransferWrap(*value, value.length()));
}

GL_METHOD(Uniform4ui) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  GLuint x = Nan::To<uint32_t>(info[1]).ToChecked();
  GLuint y = Nan::To<uint32_t>(info[2]).ToChecked();
  GLuint z = Nan::To<uint32_t>(info[3]).ToChecked();
  GLuint w = Nan::To<uint32_t>(info[4]).ToChecked();

  cb.queueCommand(inst->glUniform4ui, location, x, y, z, w);
}

GL_METHOD(Uniform4uiv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();

  Nan::TypedArrayContents<GLuint> value(info[1]);
  GLsizei count = value.length() / 4;

  cb.queueCommand(inst->glUniform4uiv, location, count, TransferWrap(*value, value.length()));
}

GL_METHOD(UniformBlockBinding) {
  GL_BOILERPLATE;

  GLuint program = Nan::To<uint32_t>(info[0]).ToChecked();
  GLuint uniformBlockIndex = Nan::To<uint32_t>(info[1]).ToChecked();
  GLuint uniformBlockBinding = Nan::To<uint32_t>(info[2]).ToChecked();

  cb.queueCommand(inst->glUniformBlockBinding, program, uniformBlockIndex, uniformBlockBinding);
}

GL_METHOD(UniformMatrix2x3fv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  GLboolean transpose = (Nan::To<bool>(info[1]).ToChecked());
  Nan::TypedArrayContents<GLfloat> data(info[2]);

  cb.queueCommand(
    inst->glUniformMatrix2x3fv,
    location,
    data.length() / 6,
    transpose,
    TransferWrap(*data, data.length()));
}

GL_METHOD(UniformMatrix2x4fv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  GLboolean transpose = (Nan::To<bool>(info[1]).ToChecked());
  Nan::TypedArrayContents<GLfloat> data(info[2]);

  cb.queueCommand(
    inst->glUniformMatrix2x4fv,
    location,
    data.length() / 8,
    transpose,
    TransferWrap(*data, data.length()));
}

GL_METHOD(UniformMatrix3x2fv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  GLboolean transpose = (Nan::To<bool>(info[1]).ToChecked());
  Nan::TypedArrayContents<GLfloat> data(info[2]);

  cb.queueCommand(
    inst->glUniformMatrix3x2fv,
    location,
    data.length() / 6,
    transpose,
    TransferWrap(*data, data.length()));
}

GL_METHOD(UniformMatrix3x4fv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  GLboolean transpose = (Nan::To<bool>(info[1]).ToChecked());
  Nan::TypedArrayContents<GLfloat> data(info[2]);

  cb.queueCommand(
    inst->glUniformMatrix3x4fv,
    location,
    data.length() / 12,
    transpose,
    TransferWrap(*data, data.length()));
}

GL_METHOD(UniformMatrix4x2fv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  GLboolean transpose = (Nan::To<bool>(info[1]).ToChecked());
  Nan::TypedArrayContents<GLfloat> data(info[2]);

  cb.queueCommand(
    inst->glUniformMatrix4x2fv,
    location,
    data.length() / 8,
    transpose,
    TransferWrap(*data, data.length()));
}

GL_METHOD(UniformMatrix4x3fv) {
  GL_BOILERPLATE;

  GLint location = Nan::To<int32_t>(info[0]).ToChecked();
  GLboolean transpose = (Nan::To<bool>(info[1]).ToChecked());
  Nan::TypedArrayContents<GLfloat> data(info[2]);

  cb.queueCommand(
    inst->glUniformMatrix4x3fv,
    location,
    data.length() / 8,
    transpose,
    TransferWrap(*data, data.length()));
}

GL_METHOD(WaitSync) {
  GL_BOILERPLATE;

  v8::Local<v8::Value> value = info[0];
  intptr_t intValue = value->IntegerValue(Nan::GetCurrentContext()).FromJust();
  GLsync sync = (GLsync)intValue;
  GLbitfield flags = Nan::To<int32_t>(info[1]).ToChecked();
  GLuint64 timeout = Nan::To<uint32_t>(info[2]).ToChecked();

  cb.queueCommand(inst->glWaitSync, sync, flags, timeout);
}

GL_METHOD(VertexAttribI4i) {
  GL_BOILERPLATE;

  GLuint index = Nan::To<uint32_t>(info[0]).ToChecked();
  GLint x = Nan::To<int32_t>(info[1]).ToChecked();
  GLint y = Nan::To<int32_t>(info[2]).ToChecked();
  GLint z = Nan::To<int32_t>(info[3]).ToChecked();
  GLint w = Nan::To<int32_t>(info[4]).ToChecked();

  cb.queueCommand(inst->glVertexAttribI4i, index, x, y, z, w);
}

GL_METHOD(VertexAttribI4ui) {
  GL_BOILERPLATE;

  GLuint index = Nan::To<uint32_t>(info[0]).ToChecked();
  GLuint x = Nan::To<uint32_t>(info[1]).ToChecked();
  GLuint y = Nan::To<uint32_t>(info[2]).ToChecked();
  GLuint z = Nan::To<uint32_t>(info[3]).ToChecked();
  GLuint w = Nan::To<uint32_t>(info[4]).ToChecked();

  cb.queueCommand(inst->glVertexAttribI4ui, index, x, y, z, w);
}

GL_METHOD(VertexAttribIPointer) {
  GL_BOILERPLATE;

  GLint index = Nan::To<int32_t>(info[0]).ToChecked();
  GLint size = Nan::To<int32_t>(info[1]).ToChecked();
  GLenum type = Nan::To<int32_t>(info[2]).ToChecked();
  GLint stride = Nan::To<int32_t>(info[3]).ToChecked();
  size_t offset = Nan::To<uint32_t>(info[4]).ToChecked();

  cb.queueCommand(
    inst->glVertexAttribIPointer, index, size, type, stride, reinterpret_cast<GLvoid *>(offset));
}

GL_METHOD(RenderbufferStorageMultisampleEXT) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLsizei samples = Nan::To<int32_t>(info[1]).ToChecked();
  GLenum internalformat = Nan::To<int32_t>(info[2]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[3]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[4]).ToChecked();

  cb.queueCommand(
    inst->glRenderbufferStorageMultisampleEXT, target, samples, internalformat, width, height);
}

GL_METHOD(FramebufferTexture2DMultisampleEXT) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLenum attachment = Nan::To<int32_t>(info[1]).ToChecked();
  GLenum textarget = Nan::To<int32_t>(info[2]).ToChecked();
  GLuint texture = Nan::To<uint32_t>(info[3]).ToChecked();
  GLint level = Nan::To<int32_t>(info[4]).ToChecked();
  GLint samples = Nan::To<int32_t>(info[5]).ToChecked();

  cb.queueCommand(
    inst->glFramebufferTexture2DMultisampleEXT,
    target,
    attachment,
    textarget,
    texture,
    level,
    samples);
}

GL_METHOD(GetCachedUnpackRowLength) {
  GL_BOILERPLATE;
  info.GetReturnValue().Set(Nan::New<v8::Integer>(inst->unpack_row_length));
}

GL_METHOD(GetCachedUnpackSkipPixels) {
  GL_BOILERPLATE;
  info.GetReturnValue().Set(Nan::New<v8::Integer>(inst->unpack_skip_pixels));
}

GL_METHOD(GetCachedUnpackSkipRows) {
  GL_BOILERPLATE;
  info.GetReturnValue().Set(Nan::New<v8::Integer>(inst->unpack_skip_rows));
}

std::ptrdiff_t WebGL2RenderingContext::pixelOffset(int bytesPerRow, int bytesPerPixel) {
  std::ptrdiff_t rowOffset = static_cast<std::ptrdiff_t>(bytesPerRow) * unpack_skip_rows;
  std::ptrdiff_t pixelOffset = static_cast<std::ptrdiff_t>(bytesPerPixel) * unpack_skip_pixels;
  return rowOffset + pixelOffset;
}
