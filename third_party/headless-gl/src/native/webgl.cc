#include "webgl.h"

#include <cstdio>
#include <cstring>
#include <iostream>
#include <vector>

#include "c8/c8-log.h"

#define EGL_MAJOR_VERSION_WEBGL 2
#define EGL_MINOR_VERSION_WEBGL 0

using c8::C8Log;
using hgl::internal::AppSingleton;

const char *REQUIRED_EXTENSIONS_WEBGL[] = {
  "GL_OES_packed_depth_stencil", "GL_ANGLE_instanced_arrays", NULL};

#define GL_METHOD(method_name) GL_METHOD_IMPL(WebGLRenderingContext, method_name)

#define GL_BOILERPLATE GL_BOILERPLATE_IMPL(WebGLRenderingContext)

using c8::cmd::TransferWrap;
using hgl::internal::bytesPerPixel;

WebGLRenderingContext::WebGLRenderingContext(
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
  next = NULL;
  prev = NULL;

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
     EGL_ALPHA_SIZE,
     8,
     EGL_DEPTH_SIZE,
     24,
     EGL_STENCIL_SIZE,
     8,
     EGL_RENDERABLE_TYPE,
     EGL_OPENGL_ES2_BIT,
     EGL_NONE});

  auto &cb = commandBuffer();

  cb.queueCommand(eglBindAPI, EGL_OPENGL_ES_API);
  if (cb.runSyncCommand(eglGetError) != EGL_SUCCESS) {
    state = GLCONTEXT_STATE_ERROR;
    return;
  }

  EGLint num_config;
  if (
    !cb.runSyncCommand(eglChooseConfig, app.display(), attrib_list.data(), &config, 1, &num_config)
    || num_config != 1) {
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
    EGL_MAJOR_VERSION_WEBGL,
    EGL_CONTEXT_MINOR_VERSION_KHR,
    EGL_MINOR_VERSION_WEBGL,
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
  for (const char **rext = REQUIRED_EXTENSIONS_WEBGL; *rext; ++rext) {
    if (!strstr(extensionString, *rext)) {
      dispose();
      state = GLCONTEXT_STATE_ERROR;
      return;
    }
  }

  // Select best preferred depth
#if C8_USE_ANGLE
  preferredDepth = GL_DEPTH_COMPONENT16;
  if (strstr(extensionString, "GL_OES_depth32")) {
    preferredDepth = GL_DEPTH_COMPONENT32_OES;
  } else if (strstr(extensionString, "GL_OES_depth24")) {
    preferredDepth = GL_DEPTH_COMPONENT24_OES;
  }
#else
  preferredDepth = GL_DEPTH_COMPONENT32F;
#endif
}

void WebGLRenderingContext::setError(GLenum error) {
  if (error == GL_NO_ERROR || lastError != GL_NO_ERROR) {
    return;
  }
  GLenum prevError = (this->glGetError)();
  if (prevError == GL_NO_ERROR) {
    lastError = error;
  }
}

void WebGLRenderingContext::dispose() {
  DISPOSE_CONTEXT(WebGLRenderingContext, glDeleteVertexArraysOES);
}

WebGLRenderingContext::~WebGLRenderingContext() {
  dispose();
  if (AppSingleton::getInstance().detachContext(this)) {
    c8::setXrCommandBuffer(nullptr);
  }
}

GLenum WebGLRenderingContext::getError() {
  GLenum error = (this->glGetError)();
  if (lastError != GL_NO_ERROR) {
    error = lastError;
  }
  lastError = GL_NO_ERROR;
  return error;
}

COMMON_WEBGL_METHODS();

NEW_WEBGL_CONTEXT(WebGLRenderingContext);

GL_METHOD(RenderbufferStorage) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLenum internalformat = Nan::To<int32_t>(info[1]).ToChecked();
  GLsizei width = Nan::To<int32_t>(info[2]).ToChecked();
  GLsizei height = Nan::To<int32_t>(info[3]).ToChecked();

  // In WebGL, we map GL_DEPTH_STENCIL to GL_DEPTH24_STENCIL8
#if C8_USE_ANGLE
  if (internalformat == GL_DEPTH_STENCIL_OES) {
    internalformat = GL_DEPTH24_STENCIL8_OES;
  } else if (internalformat == GL_DEPTH_COMPONENT32_OES) {
    internalformat = inst->preferredDepth;
  }
#else
  if (internalformat == GL_DEPTH_STENCIL) {
    internalformat = GL_DEPTH24_STENCIL8;
  } else if (internalformat == GL_DEPTH_COMPONENT32F) {
    internalformat = inst->preferredDepth;
  }
#endif

  cb.queueCommand(inst->glRenderbufferStorage, target, internalformat, width, height);
}

GL_METHOD(GetTexParameter) {
  GL_BOILERPLATE;

  GLenum target = Nan::To<int32_t>(info[0]).ToChecked();
  GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();

  if (pname == GL_TEXTURE_MAX_ANISOTROPY_EXT) {
    GLfloat param_value = 0;
    cb.runSyncCommand(inst->glGetTexParameterfv, target, pname, &param_value);
    info.GetReturnValue().Set(Nan::New<v8::Number>(param_value));
  } else {
    GLint param_value = 0;
    cb.runSyncCommand(inst->glGetTexParameteriv, target, pname, &param_value);
    info.GetReturnValue().Set(Nan::New<v8::Integer>(param_value));
  }
}

GL_METHOD(DrawBuffersWEBGL) {
  GL_BOILERPLATE;

  v8::Local<v8::Array> buffersArray = v8::Local<v8::Array>::Cast(info[0]);
  GLuint numBuffers = buffersArray->Length();
  GLenum *buffers = new GLenum[numBuffers];

  for (GLuint i = 0; i < numBuffers; i++) {
    buffers[i] =
      Nan::Get(buffersArray, i).ToLocalChecked()->Uint32Value(Nan::GetCurrentContext()).ToChecked();
  }

  cb.queueCommand(inst->glDrawBuffersEXT, numBuffers, buffers);

  delete[] buffers;
}

GL_METHOD(BindVertexArrayOES) {
  GL_BOILERPLATE;

  GLuint array = Nan::To<uint32_t>(info[0]).ToChecked();

  cb.queueCommand(inst->glBindVertexArrayOES, array);
}

GL_METHOD(CreateVertexArrayOES) {
  GL_BOILERPLATE;

  GLuint array = 0;
  cb.runSyncCommand(inst->glGenVertexArraysOES, 1, &array);
  inst->registerGLObj(GLOBJECT_TYPE_VERTEX_ARRAY, array);

  info.GetReturnValue().Set(Nan::New<v8::Integer>(array));
}

GL_METHOD(DeleteVertexArrayOES) {
  GL_BOILERPLATE;

  GLuint array = Nan::To<uint32_t>(info[0]).ToChecked();
  inst->unregisterGLObj(GLOBJECT_TYPE_VERTEX_ARRAY, array);

  using UintWrap1 = c8::cmd::FixedArrayWrap<GLuint, 1>;
  cb.queueCommand(inst->glDeleteVertexArraysOES, 1, UintWrap1(&array));
}

GL_METHOD(IsVertexArrayOES) {
  GL_BOILERPLATE;

  info.GetReturnValue().Set(
    Nan::New<v8::Boolean>(
      cb.runSyncCommand(inst->glIsVertexArrayOES, Nan::To<uint32_t>(info[0]).ToChecked()) != 0));
}

GL_METHOD(EXTWEBGL_draw_buffers) {
  v8::Local<v8::Object> result = Nan::New<v8::Object>();
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT0_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT0)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT1_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT1)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT2_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT2)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT3_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT3)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT4_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT4)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT5_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT5)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT6_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT6)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT7_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT7)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT8_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT8)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT9_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT9)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT10_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT10)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT11_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT11)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT12_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT12)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT13_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT13)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT14_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT14)));
  Nan::Set(
    result,
    Nan::New("COLOR_ATTACHMENT15_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_COLOR_ATTACHMENT15)));

  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER0_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER0)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER1_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER1)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER2_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER2)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER3_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER3)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER4_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER4)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER5_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER5)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER6_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER6)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER7_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER7)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER8_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER8)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER9_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER9)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER10_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER10)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER11_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER11)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER12_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER12)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER13_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER13)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER14_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER14)));
  Nan::Set(
    result,
    Nan::New("DRAW_BUFFER15_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_DRAW_BUFFER15)));

  Nan::Set(
    result,
    Nan::New("MAX_COLOR_ATTACHMENTS_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_MAX_COLOR_ATTACHMENTS)));
  Nan::Set(
    result,
    Nan::New("MAX_DRAW_BUFFERS_WEBGL").ToLocalChecked(),
    Nan::New<v8::Number>(MAYBE_ANGLE_EXT(GL_MAX_DRAW_BUFFERS)));

  info.GetReturnValue().Set(result);
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
      break;

    case MAYBE_ANGLE_EXT(GL_MAX_DRAW_BUFFERS):
      cb.queueCommand(inst->glPixelStorei, pname, param);
      break;

    default:
      cb.queueCommand(inst->glPixelStorei, pname, param);
      break;
  }
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
  Nan::TypedArrayContents<unsigned char> pixels(info[8]);

  if (*pixels) {
    auto rowBytes = inst->bytesPerRow(format, type, width, 0);
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
        TransferWrap(reinterpret_cast<void *>(unpacked), height * rowBytes));
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
        TransferWrap(reinterpret_cast<void *>(*pixels), height * rowBytes));
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
  Nan::TypedArrayContents<unsigned char> pixels(info[8]);

  auto rowBytes = inst->bytesPerRow(format, type, width, 0);

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
      TransferWrap(reinterpret_cast<void *>(unpacked), height * rowBytes));
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
      TransferWrap(reinterpret_cast<void *>(*pixels), height * rowBytes));
  }
}
