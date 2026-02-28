#ifndef WEBGL_BASE_H_
#define WEBGL_BASE_H_

#include <node.h>
#include <v8.h>

#ifdef ANDROID
#include <jni.h>
#endif

#include <algorithm>
#include <atomic>
#include <map>
#include <utility>
#include <vector>

#include "c8/command/command-buffer.h"
#include "c8/pixels/opengl/egl.h"
#include "c8/pixels/opengl/eglext.h"
#include "c8/pixels/opengl/eglplatform.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/xrapi/openxr/gl-impl.h"
#include "nan.h"

struct android_app;

// Use generated EGL includes from ANGLE:
#define EGL_EGL_PROTOTYPES 1

#define GL_METHOD_IMPL(context_impl, method_name) NAN_METHOD(context_impl::method_name)

#define GL_BOILERPLATE_IMPL(context_impl)                                   \
  Nan::HandleScope();                                                       \
  if (info.This()->InternalFieldCount() <= 0) {                             \
    return Nan::ThrowError("Invalid WebGL Object");                         \
  }                                                                         \
  context_impl *inst = node::ObjectWrap::Unwrap<context_impl>(info.This()); \
  [[maybe_unused]] c8::GlBuffer &cb = inst->commandBuffer();                \
  if (false) {                                                              \
    printf("Method name: %s\n", __func__);                                  \
  }                                                                         \
  if (!(inst && inst->isOk())) {                                            \
    return Nan::ThrowError("Invalid GL context");                           \
  }

enum GLObjectType {
  GLOBJECT_TYPE_BUFFER,
  GLOBJECT_TYPE_FRAMEBUFFER,
  GLOBJECT_TYPE_PROGRAM,
  GLOBJECT_TYPE_RENDERBUFFER,
  GLOBJECT_TYPE_SHADER,
  GLOBJECT_TYPE_TEXTURE,
  GLOBJECT_TYPE_VERTEX_ARRAY,
};

enum GLContextState {
  GLCONTEXT_STATE_INIT,
  GLCONTEXT_STATE_OK,
  GLCONTEXT_STATE_DESTROY,
  GLCONTEXT_STATE_ERROR
};

struct WebGLRenderingContextBase;

namespace hgl {
namespace internal {

// Compute the bytes per channel (component) of a pixel.
int bytesPerChannel(GLenum type);

// Compute the channels components per pixel.
int channelsPerPixel(GLenum format);

// Compute the bytes per pixel given a format and type.
int bytesPerPixel(GLenum format, GLenum type);

struct AppSingletonOptions {
  bool preferMetal = false;
};

class AppSingleton {
public:
  AppSingleton(const AppSingleton &) = delete;
  AppSingleton &operator=(const AppSingleton &) = delete;

  // Terminates EGL.
  ~AppSingleton();

  // Thread-safe call to get the singleton instance of the AppSingleton, which will initialize EGL
  // the first time it is called. If options are provided, they will be used to configure the
  // singleton on the first call to getInstance, and will be ignored on subsequent calls.
  static AppSingleton &getInstance(const AppSingletonOptions &options = {});

#ifdef ANDROID
  void setAndroidApp(struct android_app *app) { app_ = app; }
#endif

  void attachCurrentThread();

  void detachCurrentThread();

  // Notifies the singleton that the on-screen surface is being (re-)created.
  void setNativeWindow(void *nativeWindow);

  // Notifies the singleton that the on-screen surface will be destroyed.
  void destroySurface();

  bool tryAttachContext(WebGLRenderingContextBase *context, void *nativeWindow);

  bool detachContext(WebGLRenderingContextBase *context);

  EGLDisplay display() const { return display_; }

private:
  AppSingleton(const AppSingletonOptions &options);

  // The native window surface pointer, e.g. ANativeWindow* on Android.
  void *surfaceNativeWindow_;

  // The rendering context that is currently is attached to the window surface, as only one can be
  // attached at a time.
  std::atomic<WebGLRenderingContextBase *> contextAtomic_;

  EGLDisplay display_;

private:
#ifdef ANDROID
  struct android_app *app_ = nullptr;
  JNIEnv *env_ = nullptr;
#endif
};

}  // namespace internal
}  // namespace hgl

struct WebGLRenderingContextBase : public node::ObjectWrap {

private:
  c8::GlBuffer cb_;

protected:
  WebGLRenderingContextBase();
  virtual ~WebGLRenderingContextBase();

#ifdef ANDROID
  android_app *app;
  JNIEnv *env;
#endif

  // Start the command buffer thread, should be called once after the AppSingleton is initialized.
  void startCommandBufferThread();

  c8::GlBuffer &commandBuffer() { return cb_; }

  // Compute the bytes per row given a format, type, width, using UNPACK_ROW_LENGTH (supply as
  // unpackRowLength or zero in WebGL1) and UNPACK_ALIGNMENT settings.
  int bytesPerRow(GLenum format, GLenum type, int width, int unpackRowLength);

  // Pixel storage flags
  bool unpack_flip_y;
  bool unpack_premultiply_alpha;
  int unpack_colorspace_conversion;
  int unpack_alignment;

  // The underlying OpenGL context
  EGLContext context;
  EGLConfig config;
  EGLSurface surface;
  GLContextState state;

  bool isOk() { return state == GLCONTEXT_STATE_OK; }

  // Context list
  WebGLRenderingContextBase *next, *prev;
  WebGLRenderingContextBase *CONTEXT_LIST_HEAD;
  void registerContext() {
    if (CONTEXT_LIST_HEAD) {
      CONTEXT_LIST_HEAD->prev = this;
    }
    next = CONTEXT_LIST_HEAD;
    prev = nullptr;
    CONTEXT_LIST_HEAD = this;
  }
  void unregisterContext() {
    if (next) {
      next->prev = this->prev;
    }
    if (prev) {
      prev->next = this->next;
    }
    if (CONTEXT_LIST_HEAD == this) {
      CONTEXT_LIST_HEAD = this->next;
    }
    next = prev = nullptr;
  }

  // Unpacks a buffer full of pixels into memory
  unsigned char *unpackPixels(
    unsigned int type, unsigned int format, int width, int height, unsigned char *pixels);

public:
  virtual void dispose() = 0;
  void setToReadyState();

  // Create a new surface and make the context current. Will be a window surface if nativeWindow is
  // not null, otherwise a pbuffer.
  void createSurface(void *nativeWindow, int width, int height);

  // Destroy the current surface, will call eglMakeCurrent with EGL_NO_SURFACE before destroying.
  void destroySurface();
};

#define BASE_NAN_METHODS()                              \
  static NAN_METHOD(SetError);                          \
  static NAN_METHOD(GetError);                          \
                                                        \
  static NAN_METHOD(New);                               \
  static NAN_METHOD(Destroy);                           \
                                                        \
  static NAN_METHOD(VertexAttribDivisor);               \
  static NAN_METHOD(DrawArraysInstanced);               \
  static NAN_METHOD(DrawElementsInstanced);             \
                                                        \
  static NAN_METHOD(Uniform1f);                         \
  static NAN_METHOD(Uniform2f);                         \
  static NAN_METHOD(Uniform3f);                         \
  static NAN_METHOD(Uniform4f);                         \
  static NAN_METHOD(Uniform1i);                         \
  static NAN_METHOD(Uniform2i);                         \
  static NAN_METHOD(Uniform3i);                         \
  static NAN_METHOD(Uniform4i);                         \
                                                        \
  static NAN_METHOD(PixelStorei);                       \
  static NAN_METHOD(BindAttribLocation);                \
  static NAN_METHOD(DrawArrays);                        \
  static NAN_METHOD(UniformMatrix2fv);                  \
  static NAN_METHOD(UniformMatrix3fv);                  \
  static NAN_METHOD(UniformMatrix4fv);                  \
  static NAN_METHOD(GenerateMipmap);                    \
  static NAN_METHOD(GetAttribLocation);                 \
  static NAN_METHOD(DepthFunc);                         \
  static NAN_METHOD(Viewport);                          \
  static NAN_METHOD(CreateShader);                      \
  static NAN_METHOD(ShaderSource);                      \
  static NAN_METHOD(CompileShader);                     \
  static NAN_METHOD(GetShaderParameter);                \
  static NAN_METHOD(GetShaderInfoLog);                  \
  static NAN_METHOD(CreateProgram);                     \
  static NAN_METHOD(AttachShader);                      \
  static NAN_METHOD(LinkProgram);                       \
  static NAN_METHOD(GetProgramParameter);               \
  static NAN_METHOD(GetUniformLocation);                \
  static NAN_METHOD(ClearColor);                        \
  static NAN_METHOD(ClearDepth);                        \
  static NAN_METHOD(Disable);                           \
  static NAN_METHOD(Enable);                            \
  static NAN_METHOD(CreateTexture);                     \
  static NAN_METHOD(BindTexture);                       \
  static NAN_METHOD(TexImage2D);                        \
  static NAN_METHOD(TexParameteri);                     \
  static NAN_METHOD(TexParameterf);                     \
  static NAN_METHOD(Clear);                             \
  static NAN_METHOD(UseProgram);                        \
  static NAN_METHOD(CreateBuffer);                      \
  static NAN_METHOD(BindBuffer);                        \
  static NAN_METHOD(CreateFramebuffer);                 \
  static NAN_METHOD(BindFramebuffer);                   \
  static NAN_METHOD(FramebufferTexture2D);              \
  static NAN_METHOD(BufferData);                        \
  static NAN_METHOD(BufferSubData);                     \
  static NAN_METHOD(BlendEquation);                     \
  static NAN_METHOD(BlendFunc);                         \
  static NAN_METHOD(EnableVertexAttribArray);           \
  static NAN_METHOD(VertexAttribPointer);               \
  static NAN_METHOD(ActiveTexture);                     \
  static NAN_METHOD(DrawElements);                      \
  static NAN_METHOD(Flush);                             \
  static NAN_METHOD(Finish);                            \
                                                        \
  static NAN_METHOD(VertexAttrib1f);                    \
  static NAN_METHOD(VertexAttrib2f);                    \
  static NAN_METHOD(VertexAttrib3f);                    \
  static NAN_METHOD(VertexAttrib4f);                    \
                                                        \
  static NAN_METHOD(BlendColor);                        \
  static NAN_METHOD(BlendEquationSeparate);             \
  static NAN_METHOD(BlendFuncSeparate);                 \
  static NAN_METHOD(ClearStencil);                      \
  static NAN_METHOD(ColorMask);                         \
  static NAN_METHOD(CopyTexImage2D);                    \
  static NAN_METHOD(CopyTexSubImage2D);                 \
  static NAN_METHOD(CullFace);                          \
  static NAN_METHOD(DepthMask);                         \
  static NAN_METHOD(DepthRange);                        \
  static NAN_METHOD(Hint);                              \
  static NAN_METHOD(IsEnabled);                         \
  static NAN_METHOD(LineWidth);                         \
  static NAN_METHOD(PolygonOffset);                     \
                                                        \
  static NAN_METHOD(GetShaderPrecisionFormat);          \
                                                        \
  static NAN_METHOD(StencilFunc);                       \
  static NAN_METHOD(StencilFuncSeparate);               \
  static NAN_METHOD(StencilMask);                       \
  static NAN_METHOD(StencilMaskSeparate);               \
  static NAN_METHOD(StencilOp);                         \
  static NAN_METHOD(StencilOpSeparate);                 \
                                                        \
  static NAN_METHOD(Scissor);                           \
                                                        \
  static NAN_METHOD(BindRenderbuffer);                  \
  static NAN_METHOD(CreateRenderbuffer);                \
  static NAN_METHOD(FramebufferRenderbuffer);           \
                                                        \
  static NAN_METHOD(DeleteBuffer);                      \
  static NAN_METHOD(DeleteFramebuffer);                 \
  static NAN_METHOD(DeleteProgram);                     \
  static NAN_METHOD(DeleteRenderbuffer);                \
  static NAN_METHOD(DeleteShader);                      \
  static NAN_METHOD(DeleteTexture);                     \
  static NAN_METHOD(DetachShader);                      \
                                                        \
  static NAN_METHOD(GetVertexAttribOffset);             \
  static NAN_METHOD(DisableVertexAttribArray);          \
                                                        \
  static NAN_METHOD(IsBuffer);                          \
  static NAN_METHOD(IsFramebuffer);                     \
  static NAN_METHOD(IsProgram);                         \
  static NAN_METHOD(IsRenderbuffer);                    \
  static NAN_METHOD(IsShader);                          \
  static NAN_METHOD(IsTexture);                         \
                                                        \
  static NAN_METHOD(RenderbufferStorage);               \
  static NAN_METHOD(GetShaderSource);                   \
  static NAN_METHOD(ValidateProgram);                   \
                                                        \
  static NAN_METHOD(TexSubImage2D);                     \
  static NAN_METHOD(ReadPixels);                        \
  static NAN_METHOD(GetTexParameter);                   \
  static NAN_METHOD(GetActiveAttrib);                   \
  static NAN_METHOD(GetActiveUniform);                  \
  static NAN_METHOD(GetAttachedShaders);                \
  static NAN_METHOD(GetParameter);                      \
  static NAN_METHOD(GetBufferParameter);                \
  static NAN_METHOD(GetFramebufferAttachmentParameter); \
  static NAN_METHOD(GetProgramInfoLog);                 \
  static NAN_METHOD(GetRenderbufferParameter);          \
  static NAN_METHOD(GetVertexAttrib);                   \
  static NAN_METHOD(GetSupportedExtensions);            \
  static NAN_METHOD(GetExtension);                      \
                                                        \
  static NAN_METHOD(FrontFace);                         \
  static NAN_METHOD(SampleCoverage);                    \
  static NAN_METHOD(GetUniform);                        \
                                                        \
  /* Non-standard methods. */                           \
  static NAN_METHOD(EglSwapBuffers);                    \
  static NAN_METHOD(GetCachedUnpackAlignment);          \
                                                        \
  /* Get a null pointer as a node external */           \
  static NAN_METHOD(GetNull);

#define NEW_WEBGL_CONTEXT(WebGLRenderingContext)                                    \
  GL_METHOD(New) {                                                                  \
    Nan::HandleScope();                                                             \
                                                                                    \
    if (info.Length() < 11 || !info[10]->IsExternal()) {                            \
      Nan::ThrowTypeError("Argument must be an External object");                   \
      return;                                                                       \
    }                                                                               \
    v8::Local<v8::External> nativeWindow = v8::Local<v8::External>::Cast(info[10]); \
                                                                                    \
    WebGLRenderingContext *instance = new WebGLRenderingContext(                    \
      Nan::To<int32_t>(info[0]).ToChecked(), /* Width */                            \
      Nan::To<int32_t>(info[1]).ToChecked(), /* Height */                           \
      Nan::To<bool>(info[2]).ToChecked(),    /* Alpha */                            \
      Nan::To<bool>(info[3]).ToChecked(),    /* Depth */                            \
      Nan::To<bool>(info[4]).ToChecked(),    /* Stencil */                          \
      Nan::To<bool>(info[5]).ToChecked(),    /* Antialias */                        \
      Nan::To<bool>(info[6]).ToChecked(),    /* PremultipliedAlpha */               \
      Nan::To<bool>(info[7]).ToChecked(),    /* PreserveDrawingBuffer */            \
      Nan::To<bool>(info[8]).ToChecked(),    /* LowPower */                         \
      Nan::To<bool>(info[9]).ToChecked(),    /* FailIfCrap */                       \
      nativeWindow->Value());                                                       \
                                                                                    \
    if (instance->state != GLCONTEXT_STATE_OK) {                                    \
      return Nan::ThrowError("Error creating " #WebGLRenderingContext);             \
    }                                                                               \
                                                                                    \
    instance->Wrap(info.This());                                                    \
                                                                                    \
    info.GetReturnValue().Set(info.This());                                         \
  }

#define DISPOSE_CONTEXT(WebGLRenderingContext, deleteArrayCall)                          \
  /* Unregister context */                                                               \
  unregisterContext();                                                                   \
                                                                                         \
  /* Update state */                                                                     \
  state = GLCONTEXT_STATE_DESTROY;                                                       \
                                                                                         \
  /* Store this pointer */                                                               \
  WebGLRenderingContext *inst = this;                                                    \
                                                                                         \
  using UintWrap1 = c8::cmd::FixedArrayWrap<GLuint, 1>;                                  \
                                                                                         \
  auto &app = AppSingleton::getInstance();                                               \
  auto &cb = inst->commandBuffer();                                                      \
                                                                                         \
  /* Destroy all object references */                                                    \
  for (std::map<std::pair<GLuint, GLObjectType>, bool>::iterator iter = objects.begin(); \
       iter != objects.end();                                                            \
       ++iter) {                                                                         \
                                                                                         \
    GLuint obj = iter->first.first;                                                      \
                                                                                         \
    switch (iter->first.second) {                                                        \
      case GLOBJECT_TYPE_PROGRAM:                                                        \
        cb.queueCommand(inst->glDeleteProgram, obj);                                     \
        break;                                                                           \
      case GLOBJECT_TYPE_BUFFER:                                                         \
        cb.queueCommand(inst->glDeleteBuffers, 1, UintWrap1(&obj));                      \
        break;                                                                           \
      case GLOBJECT_TYPE_FRAMEBUFFER:                                                    \
        cb.queueCommand(inst->glDeleteFramebuffers, 1, UintWrap1(&obj));                 \
        break;                                                                           \
      case GLOBJECT_TYPE_RENDERBUFFER:                                                   \
        cb.queueCommand(inst->glDeleteRenderbuffers, 1, UintWrap1(&obj));                \
        break;                                                                           \
      case GLOBJECT_TYPE_SHADER:                                                         \
        cb.queueCommand(inst->glDeleteShader, obj);                                      \
        break;                                                                           \
      case GLOBJECT_TYPE_TEXTURE:                                                        \
        cb.queueCommand(inst->glDeleteTextures, 1, UintWrap1(&obj));                     \
        break;                                                                           \
      case GLOBJECT_TYPE_VERTEX_ARRAY:                                                   \
        deleteArrayCall(1, &obj);                                                        \
        break;                                                                           \
      default:                                                                           \
        break;                                                                           \
    }                                                                                    \
  }                                                                                      \
                                                                                         \
  /* Destroy surface and context */                                                      \
  destroySurface();                                                                      \
  cb.runSyncCommand(eglDestroyContext, app.display(), context);

#define COMMON_WEBGL_METHODS()                                                                     \
  GL_METHOD(SetError) {                                                                            \
    GL_BOILERPLATE;                                                                                \
    inst->setError((GLenum)(Nan::To<int32_t>(info[0]).ToChecked()));                               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Destroy) {                                                                             \
    GL_BOILERPLATE                                                                                 \
                                                                                                   \
    inst->dispose();                                                                               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Uniform1f) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    int location = Nan::To<int32_t>(info[0]).ToChecked();                                          \
    float x = (float)Nan::To<double>(info[1]).ToChecked();                                         \
                                                                                                   \
    cb.queueCommand(inst->glUniform1f, location, x);                                               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Uniform2f) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint location = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLfloat x = static_cast<GLfloat>(Nan::To<double>(info[1]).ToChecked());                        \
    GLfloat y = static_cast<GLfloat>(Nan::To<double>(info[2]).ToChecked());                        \
                                                                                                   \
    cb.queueCommand(inst->glUniform2f, location, x, y);                                            \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Uniform3f) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint location = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLfloat x = static_cast<GLfloat>(Nan::To<double>(info[1]).ToChecked());                        \
    GLfloat y = static_cast<GLfloat>(Nan::To<double>(info[2]).ToChecked());                        \
    GLfloat z = static_cast<GLfloat>(Nan::To<double>(info[3]).ToChecked());                        \
                                                                                                   \
    cb.queueCommand(inst->glUniform3f, location, x, y, z);                                         \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Uniform4f) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint location = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLfloat x = static_cast<GLfloat>(Nan::To<double>(info[1]).ToChecked());                        \
    GLfloat y = static_cast<GLfloat>(Nan::To<double>(info[2]).ToChecked());                        \
    GLfloat z = static_cast<GLfloat>(Nan::To<double>(info[3]).ToChecked());                        \
    GLfloat w = static_cast<GLfloat>(Nan::To<double>(info[4]).ToChecked());                        \
                                                                                                   \
    cb.queueCommand(inst->glUniform4f, location, x, y, z, w);                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Uniform1i) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint location = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLint x = Nan::To<int32_t>(info[1]).ToChecked();                                               \
                                                                                                   \
    cb.queueCommand(inst->glUniform1i, location, x);                                               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Uniform2i) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint location = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLint x = Nan::To<int32_t>(info[1]).ToChecked();                                               \
    GLint y = Nan::To<int32_t>(info[2]).ToChecked();                                               \
                                                                                                   \
    cb.queueCommand(inst->glUniform2i, location, x, y);                                            \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Uniform3i) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint location = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLint x = Nan::To<int32_t>(info[1]).ToChecked();                                               \
    GLint y = Nan::To<int32_t>(info[2]).ToChecked();                                               \
    GLint z = Nan::To<int32_t>(info[3]).ToChecked();                                               \
                                                                                                   \
    cb.queueCommand(inst->glUniform3i, location, x, y, z);                                         \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Uniform4i) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint location = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLint x = Nan::To<int32_t>(info[1]).ToChecked();                                               \
    GLint y = Nan::To<int32_t>(info[2]).ToChecked();                                               \
    GLint z = Nan::To<int32_t>(info[3]).ToChecked();                                               \
    GLint w = Nan::To<int32_t>(info[4]).ToChecked();                                               \
                                                                                                   \
    cb.queueCommand(inst->glUniform4i, location, x, y, z, w);                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BindAttribLocation) {                                                                  \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint program = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLint index = Nan::To<int32_t>(info[1]).ToChecked();                                           \
    Nan::Utf8String name(info[2]);                                                                 \
                                                                                                   \
    cb.queueCommand(                                                                               \
      inst->glBindAttribLocation, program, index, c8::cmd::TransferWrap(*name, name.length()));    \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetError) {                                                                            \
    GL_BOILERPLATE;                                                                                \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(inst->getError()));                            \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(VertexAttribDivisor) {                                                                 \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint index = Nan::To<uint32_t>(info[0]).ToChecked();                                         \
    GLuint divisor = Nan::To<uint32_t>(info[1]).ToChecked();                                       \
                                                                                                   \
    cb.queueCommand(inst->glVertexAttribDivisor, index, divisor);                                  \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DrawArraysInstanced) {                                                                 \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum mode = Nan::To<int32_t>(info[0]).ToChecked();                                           \
    GLint first = Nan::To<int32_t>(info[1]).ToChecked();                                           \
    GLuint count = Nan::To<uint32_t>(info[2]).ToChecked();                                         \
    GLuint icount = Nan::To<uint32_t>(info[3]).ToChecked();                                        \
                                                                                                   \
    cb.queueCommand(inst->glDrawArraysInstanced, mode, first, count, icount);                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DrawElementsInstanced) {                                                               \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum mode = Nan::To<int32_t>(info[0]).ToChecked();                                           \
    GLint count = Nan::To<int32_t>(info[1]).ToChecked();                                           \
    GLenum type = Nan::To<int32_t>(info[2]).ToChecked();                                           \
    GLint offset = Nan::To<int32_t>(info[3]).ToChecked();                                          \
    GLuint icount = Nan::To<uint32_t>(info[4]).ToChecked();                                        \
                                                                                                   \
    cb.queueCommand(                                                                               \
      inst->glDrawElementsInstanced,                                                               \
      mode,                                                                                        \
      count,                                                                                       \
      type,                                                                                        \
      reinterpret_cast<GLvoid *>(offset),                                                          \
      icount);                                                                                     \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DrawArrays) {                                                                          \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum mode = Nan::To<int32_t>(info[0]).ToChecked();                                           \
    GLint first = Nan::To<int32_t>(info[1]).ToChecked();                                           \
    GLint count = Nan::To<int32_t>(info[2]).ToChecked();                                           \
                                                                                                   \
    cb.queueCommand(inst->glDrawArrays, mode, first, count);                                       \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(UniformMatrix2fv) {                                                                    \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint location = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLboolean transpose = (Nan::To<bool>(info[1]).ToChecked());                                    \
    Nan::TypedArrayContents<GLfloat> data(info[2]);                                                \
                                                                                                   \
    cb.queueCommand(                                                                               \
      inst->glUniformMatrix2fv,                                                                    \
      location,                                                                                    \
      data.length() / 4,                                                                           \
      transpose,                                                                                   \
      c8::cmd::TransferWrap(*data, data.length()));                                                \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(UniformMatrix3fv) {                                                                    \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint location = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLboolean transpose = (Nan::To<bool>(info[1]).ToChecked());                                    \
    Nan::TypedArrayContents<GLfloat> data(info[2]);                                                \
                                                                                                   \
    cb.queueCommand(                                                                               \
      inst->glUniformMatrix3fv,                                                                    \
      location,                                                                                    \
      data.length() / 9,                                                                           \
      transpose,                                                                                   \
      c8::cmd::TransferWrap(*data, data.length()));                                                \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(UniformMatrix4fv) {                                                                    \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint location = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLboolean transpose = (Nan::To<bool>(info[1]).ToChecked());                                    \
    Nan::TypedArrayContents<GLfloat> data(info[2]);                                                \
                                                                                                   \
    cb.queueCommand(                                                                               \
      inst->glUniformMatrix4fv,                                                                    \
      location,                                                                                    \
      data.length() / 16,                                                                          \
      transpose,                                                                                   \
      c8::cmd::TransferWrap(*data, data.length()));                                                \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GenerateMipmap) {                                                                      \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint target = Nan::To<int32_t>(info[0]).ToChecked();                                          \
    cb.queueCommand(inst->glGenerateMipmap, target);                                               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetAttribLocation) {                                                                   \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint program = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    Nan::Utf8String name(info[1]);                                                                 \
                                                                                                   \
    GLint result = cb.runSyncCommand(inst->glGetAttribLocation, program, *name);                   \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(result));                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DepthFunc) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glDepthFunc, Nan::To<int32_t>(info[0]).ToChecked());                     \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Viewport) {                                                                            \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint x = Nan::To<int32_t>(info[0]).ToChecked();                                               \
    GLint y = Nan::To<int32_t>(info[1]).ToChecked();                                               \
    GLsizei width = Nan::To<int32_t>(info[2]).ToChecked();                                         \
    GLsizei height = Nan::To<int32_t>(info[3]).ToChecked();                                        \
                                                                                                   \
    cb.queueCommand(inst->glViewport, x, y, width, height);                                        \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(CreateShader) {                                                                        \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint shader =                                                                                \
      cb.runSyncCommand(inst->glCreateShader, Nan::To<int32_t>(info[0]).ToChecked());              \
    inst->registerGLObj(GLOBJECT_TYPE_SHADER, shader);                                             \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(shader));                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(ShaderSource) {                                                                        \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint id = Nan::To<int32_t>(info[0]).ToChecked();                                              \
    Nan::Utf8String code(info[1]);                                                                 \
                                                                                                   \
    const char *codes[] = {*code};                                                                 \
    GLint length = code.length();                                                                  \
                                                                                                   \
    /* TODO: Use a lambda here */                                                                  \
    cb.runSyncCommand(inst->glShaderSource, id, 1, codes, &length);                                \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(CompileShader) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glCompileShader, Nan::To<int32_t>(info[0]).ToChecked());                 \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(FrontFace) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glFrontFace, Nan::To<int32_t>(info[0]).ToChecked());                     \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetShaderParameter) {                                                                  \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint shader = Nan::To<int32_t>(info[0]).ToChecked();                                          \
    GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();                                          \
                                                                                                   \
    GLint value;                                                                                   \
    cb.runSyncCommand(inst->glGetShaderiv, shader, pname, &value);                                 \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(value));                                       \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetShaderInfoLog) {                                                                    \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint id = Nan::To<int32_t>(info[0]).ToChecked();                                              \
                                                                                                   \
    GLint infoLogLength;                                                                           \
    cb.runSyncCommand(inst->glGetShaderiv, id, GL_INFO_LOG_LENGTH, &infoLogLength);                \
                                                                                                   \
    char *error = new char[infoLogLength + 1];                                                     \
    cb.runSyncCommand(inst->glGetShaderInfoLog, id, infoLogLength + 1, &infoLogLength, error);     \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::String>(error).ToLocalChecked());                       \
                                                                                                   \
    delete[] error;                                                                                \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(CreateProgram) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint program = cb.runSyncCommand(inst->glCreateProgram);                                     \
    inst->registerGLObj(GLOBJECT_TYPE_PROGRAM, program);                                           \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(program));                                     \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(AttachShader) {                                                                        \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint program = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLint shader = Nan::To<int32_t>(info[1]).ToChecked();                                          \
                                                                                                   \
    cb.queueCommand(inst->glAttachShader, program, shader);                                        \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(ValidateProgram) {                                                                     \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glValidateProgram, Nan::To<int32_t>(info[0]).ToChecked());               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(LinkProgram) {                                                                         \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glLinkProgram, Nan::To<int32_t>(info[0]).ToChecked());                   \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetProgramParameter) {                                                                 \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint program = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLenum pname = (GLenum)(Nan::To<int32_t>(info[1]).ToChecked());                                \
    GLint value = 0;                                                                               \
                                                                                                   \
    cb.runSyncCommand(inst->glGetProgramiv, program, pname, &value);                               \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(value));                                       \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetUniformLocation) {                                                                  \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint program = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    Nan::Utf8String name(info[1]);                                                                 \
                                                                                                   \
    info.GetReturnValue().Set(                                                                     \
      Nan::New<v8::Integer>(cb.runSyncCommand(inst->glGetUniformLocation, program, *name)));       \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(ClearColor) {                                                                          \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLfloat red = static_cast<GLfloat>(Nan::To<double>(info[0]).ToChecked());                      \
    GLfloat green = static_cast<GLfloat>(Nan::To<double>(info[1]).ToChecked());                    \
    GLfloat blue = static_cast<GLfloat>(Nan::To<double>(info[2]).ToChecked());                     \
    GLfloat alpha = static_cast<GLfloat>(Nan::To<double>(info[3]).ToChecked());                    \
                                                                                                   \
    cb.queueCommand(inst->glClearColor, red, green, blue, alpha);                                  \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(ClearDepth) {                                                                          \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLfloat depth = static_cast<GLfloat>(Nan::To<double>(info[0]).ToChecked());                    \
                                                                                                   \
    cb.queueCommand(inst->glClearDepthf, depth);                                                   \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Disable) {                                                                             \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glDisable, Nan::To<int32_t>(info[0]).ToChecked());                       \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Enable) {                                                                              \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glEnable, Nan::To<int32_t>(info[0]).ToChecked());                        \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(CreateTexture) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint texture;                                                                                \
    cb.runSyncCommand(inst->glGenTextures, 1, &texture);                                           \
    inst->registerGLObj(GLOBJECT_TYPE_TEXTURE, texture);                                           \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(texture));                                     \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BindTexture) {                                                                         \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLint texture = Nan::To<int32_t>(info[1]).ToChecked();                                         \
                                                                                                   \
    cb.queueCommand(inst->glBindTexture, target, texture);                                         \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(TexParameteri) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();                                          \
    GLint param = Nan::To<int32_t>(info[2]).ToChecked();                                           \
                                                                                                   \
    cb.queueCommand(inst->glTexParameteri, target, pname, param);                                  \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(TexParameterf) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();                                          \
    GLfloat param = static_cast<GLfloat>(Nan::To<double>(info[2]).ToChecked());                    \
                                                                                                   \
    cb.queueCommand(inst->glTexParameterf, target, pname, param);                                  \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Clear) {                                                                               \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glClear, Nan::To<int32_t>(info[0]).ToChecked());                         \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(UseProgram) {                                                                          \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glUseProgram, Nan::To<int32_t>(info[0]).ToChecked());                    \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(CreateBuffer) {                                                                        \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint buffer;                                                                                 \
    cb.runSyncCommand(inst->glGenBuffers, 1, &buffer);                                             \
    inst->registerGLObj(GLOBJECT_TYPE_BUFFER, buffer);                                             \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(buffer));                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BindBuffer) {                                                                          \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = (GLenum)Nan::To<int32_t>(info[0]).ToChecked();                                 \
    GLuint buffer = (GLuint)Nan::To<uint32_t>(info[1]).ToChecked();                                \
                                                                                                   \
    cb.queueCommand(inst->glBindBuffer, target, buffer);                                           \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(CreateFramebuffer) {                                                                   \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint buffer;                                                                                 \
    cb.runSyncCommand(inst->glGenFramebuffers, 1, &buffer);                                        \
    inst->registerGLObj(GLOBJECT_TYPE_FRAMEBUFFER, buffer);                                        \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(buffer));                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BindFramebuffer) {                                                                     \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint target = (GLint)Nan::To<int32_t>(info[0]).ToChecked();                                   \
    GLint buffer = (GLint)(Nan::To<int32_t>(info[1]).ToChecked());                                 \
                                                                                                   \
    cb.queueCommand(inst->glBindFramebuffer, target, buffer);                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(FramebufferTexture2D) {                                                                \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLenum attachment = Nan::To<int32_t>(info[1]).ToChecked();                                     \
    GLint textarget = Nan::To<int32_t>(info[2]).ToChecked();                                       \
    GLint texture = Nan::To<int32_t>(info[3]).ToChecked();                                         \
    GLint level = Nan::To<int32_t>(info[4]).ToChecked();                                           \
                                                                                                   \
    /* Handle depth stencil case separately */                                                     \
    if (attachment == 0x821A) {                                                                    \
      cb.queueCommand(                                                                             \
        inst->glFramebufferTexture2D, target, GL_DEPTH_ATTACHMENT, textarget, texture, level);     \
      cb.queueCommand(                                                                             \
        inst->glFramebufferTexture2D, target, GL_STENCIL_ATTACHMENT, textarget, texture, level);   \
    } else {                                                                                       \
      cb.queueCommand(                                                                             \
        inst->glFramebufferTexture2D, target, attachment, textarget, texture, level);              \
    }                                                                                              \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BufferData) {                                                                          \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint target = Nan::To<int32_t>(info[0]).ToChecked();                                          \
    GLenum usage = Nan::To<int32_t>(info[2]).ToChecked();                                          \
                                                                                                   \
    if (info[1]->IsObject()) {                                                                     \
      Nan::TypedArrayContents<char> array(info[1]);                                                \
      cb.queueCommand(                                                                             \
        inst->glBufferData,                                                                        \
        target,                                                                                    \
        array.length(),                                                                            \
        c8::cmd::TransferWrap(*array, array.length()),                                             \
        usage);                                                                                    \
    } else if (info[1]->IsNumber()) {                                                              \
      cb.queueCommand(                                                                             \
        inst->glBufferData, target, Nan::To<int32_t>(info[1]).ToChecked(), nullptr, usage);        \
    }                                                                                              \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BufferSubData) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLint offset = Nan::To<int32_t>(info[1]).ToChecked();                                          \
    Nan::TypedArrayContents<char> array(info[2]);                                                  \
                                                                                                   \
    cb.queueCommand(                                                                               \
      inst->glBufferSubData,                                                                       \
      target,                                                                                      \
      offset,                                                                                      \
      array.length(),                                                                              \
      c8::cmd::TransferWrap(*array, array.length()));                                              \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BlendEquation) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum mode = Nan::To<int32_t>(info[0]).ToChecked();                                           \
                                                                                                   \
    cb.queueCommand(inst->glBlendEquation, mode);                                                  \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BlendFunc) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum sfactor = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLenum dfactor = Nan::To<int32_t>(info[1]).ToChecked();                                        \
                                                                                                   \
    cb.queueCommand(inst->glBlendFunc, sfactor, dfactor);                                          \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(EnableVertexAttribArray) {                                                             \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glEnableVertexAttribArray, Nan::To<int32_t>(info[0]).ToChecked());       \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(VertexAttribPointer) {                                                                 \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint index = Nan::To<int32_t>(info[0]).ToChecked();                                           \
    GLint size = Nan::To<int32_t>(info[1]).ToChecked();                                            \
    GLenum type = Nan::To<int32_t>(info[2]).ToChecked();                                           \
    GLboolean normalized = Nan::To<bool>(info[3]).ToChecked();                                     \
    GLint stride = Nan::To<int32_t>(info[4]).ToChecked();                                          \
    size_t offset = Nan::To<uint32_t>(info[5]).ToChecked();                                        \
                                                                                                   \
    cb.queueCommand(                                                                               \
      inst->glVertexAttribPointer,                                                                 \
      index,                                                                                       \
      size,                                                                                        \
      type,                                                                                        \
      normalized,                                                                                  \
      stride,                                                                                      \
      reinterpret_cast<GLvoid *>(offset));                                                         \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(ActiveTexture) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glActiveTexture, Nan::To<int32_t>(info[0]).ToChecked());                 \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DrawElements) {                                                                        \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum mode = Nan::To<int32_t>(info[0]).ToChecked();                                           \
    GLint count = Nan::To<int32_t>(info[1]).ToChecked();                                           \
    GLenum type = Nan::To<int32_t>(info[2]).ToChecked();                                           \
    size_t offset = Nan::To<uint32_t>(info[3]).ToChecked();                                        \
                                                                                                   \
    cb.queueCommand(inst->glDrawElements, mode, count, type, reinterpret_cast<GLvoid *>(offset));  \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Flush) {                                                                               \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.queueCommand(inst->glFlush);                                                                \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Finish) {                                                                              \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    cb.runSyncCommand(inst->glFinish);                                                             \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(VertexAttrib1f) {                                                                      \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint index = Nan::To<int32_t>(info[0]).ToChecked();                                          \
    GLfloat x = static_cast<GLfloat>(Nan::To<double>(info[1]).ToChecked());                        \
                                                                                                   \
    cb.queueCommand(inst->glVertexAttrib1f, index, x);                                             \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(VertexAttrib2f) {                                                                      \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint index = Nan::To<int32_t>(info[0]).ToChecked();                                          \
    GLfloat x = static_cast<GLfloat>(Nan::To<double>(info[1]).ToChecked());                        \
    GLfloat y = static_cast<GLfloat>(Nan::To<double>(info[2]).ToChecked());                        \
                                                                                                   \
    cb.queueCommand(inst->glVertexAttrib2f, index, x, y);                                          \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(VertexAttrib3f) {                                                                      \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint index = Nan::To<int32_t>(info[0]).ToChecked();                                          \
    GLfloat x = static_cast<GLfloat>(Nan::To<double>(info[1]).ToChecked());                        \
    GLfloat y = static_cast<GLfloat>(Nan::To<double>(info[2]).ToChecked());                        \
    GLfloat z = static_cast<GLfloat>(Nan::To<double>(info[3]).ToChecked());                        \
                                                                                                   \
    cb.queueCommand(inst->glVertexAttrib3f, index, x, y, z);                                       \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(VertexAttrib4f) {                                                                      \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint index = Nan::To<int32_t>(info[0]).ToChecked();                                          \
    GLfloat x = static_cast<GLfloat>(Nan::To<double>(info[1]).ToChecked());                        \
    GLfloat y = static_cast<GLfloat>(Nan::To<double>(info[2]).ToChecked());                        \
    GLfloat z = static_cast<GLfloat>(Nan::To<double>(info[3]).ToChecked());                        \
    GLfloat w = static_cast<GLfloat>(Nan::To<double>(info[4]).ToChecked());                        \
                                                                                                   \
    cb.queueCommand(inst->glVertexAttrib4f, index, x, y, z, w);                                    \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BlendColor) {                                                                          \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLclampf r = static_cast<GLclampf>(Nan::To<double>(info[0]).ToChecked());                      \
    GLclampf g = static_cast<GLclampf>(Nan::To<double>(info[1]).ToChecked());                      \
    GLclampf b = static_cast<GLclampf>(Nan::To<double>(info[2]).ToChecked());                      \
    GLclampf a = static_cast<GLclampf>(Nan::To<double>(info[3]).ToChecked());                      \
                                                                                                   \
    cb.queueCommand(inst->glBlendColor, r, g, b, a);                                               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BlendEquationSeparate) {                                                               \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum mode_rgb = Nan::To<int32_t>(info[0]).ToChecked();                                       \
    GLenum mode_alpha = Nan::To<int32_t>(info[1]).ToChecked();                                     \
                                                                                                   \
    cb.queueCommand(inst->glBlendEquationSeparate, mode_rgb, mode_alpha);                          \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BlendFuncSeparate) {                                                                   \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum src_rgb = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLenum dst_rgb = Nan::To<int32_t>(info[1]).ToChecked();                                        \
    GLenum src_alpha = Nan::To<int32_t>(info[2]).ToChecked();                                      \
    GLenum dst_alpha = Nan::To<int32_t>(info[3]).ToChecked();                                      \
                                                                                                   \
    cb.queueCommand(inst->glBlendFuncSeparate, src_rgb, dst_rgb, src_alpha, dst_alpha);            \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(ClearStencil) {                                                                        \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint s = Nan::To<int32_t>(info[0]).ToChecked();                                               \
                                                                                                   \
    cb.queueCommand(inst->glClearStencil, s);                                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(ColorMask) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLboolean r = (Nan::To<bool>(info[0]).ToChecked());                                            \
    GLboolean g = (Nan::To<bool>(info[1]).ToChecked());                                            \
    GLboolean b = (Nan::To<bool>(info[2]).ToChecked());                                            \
    GLboolean a = (Nan::To<bool>(info[3]).ToChecked());                                            \
                                                                                                   \
    cb.queueCommand(inst->glColorMask, r, g, b, a);                                                \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(CopyTexImage2D) {                                                                      \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLint level = Nan::To<int32_t>(info[1]).ToChecked();                                           \
    GLenum internalformat = Nan::To<int32_t>(info[2]).ToChecked();                                 \
    GLint x = Nan::To<int32_t>(info[3]).ToChecked();                                               \
    GLint y = Nan::To<int32_t>(info[4]).ToChecked();                                               \
    GLsizei width = Nan::To<int32_t>(info[5]).ToChecked();                                         \
    GLsizei height = Nan::To<int32_t>(info[6]).ToChecked();                                        \
    GLint border = Nan::To<int32_t>(info[7]).ToChecked();                                          \
                                                                                                   \
    cb.queueCommand(                                                                               \
      inst->glCopyTexImage2D, target, level, internalformat, x, y, width, height, border);         \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(CopyTexSubImage2D) {                                                                   \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLint level = Nan::To<int32_t>(info[1]).ToChecked();                                           \
    GLint xoffset = Nan::To<int32_t>(info[2]).ToChecked();                                         \
    GLint yoffset = Nan::To<int32_t>(info[3]).ToChecked();                                         \
    GLint x = Nan::To<int32_t>(info[4]).ToChecked();                                               \
    GLint y = Nan::To<int32_t>(info[5]).ToChecked();                                               \
    GLsizei width = Nan::To<int32_t>(info[6]).ToChecked();                                         \
    GLsizei height = Nan::To<int32_t>(info[7]).ToChecked();                                        \
                                                                                                   \
    cb.queueCommand(                                                                               \
      inst->glCopyTexSubImage2D, target, level, xoffset, yoffset, x, y, width, height);            \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(CullFace) {                                                                            \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum mode = Nan::To<int32_t>(info[0]).ToChecked();                                           \
                                                                                                   \
    cb.queueCommand(inst->glCullFace, mode);                                                       \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DepthMask) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLboolean flag = (Nan::To<bool>(info[0]).ToChecked());                                         \
                                                                                                   \
    cb.queueCommand(inst->glDepthMask, flag);                                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DepthRange) {                                                                          \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLclampf zNear = static_cast<GLclampf>(Nan::To<double>(info[0]).ToChecked());                  \
    GLclampf zFar = static_cast<GLclampf>(Nan::To<double>(info[1]).ToChecked());                   \
                                                                                                   \
    cb.queueCommand(inst->glDepthRangef, zNear, zFar);                                             \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DisableVertexAttribArray) {                                                            \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint index = Nan::To<int32_t>(info[0]).ToChecked();                                          \
                                                                                                   \
    cb.queueCommand(inst->glDisableVertexAttribArray, index);                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Hint) {                                                                                \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLenum mode = Nan::To<int32_t>(info[1]).ToChecked();                                           \
                                                                                                   \
    cb.queueCommand(inst->glHint, target, mode);                                                   \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(IsEnabled) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum cap = Nan::To<int32_t>(info[0]).ToChecked();                                            \
    bool ret = cb.runSyncCommand(inst->glIsEnabled, cap) != 0;                                     \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Boolean>(ret));                                         \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(LineWidth) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLfloat width = (GLfloat)(Nan::To<double>(info[0]).ToChecked());                               \
                                                                                                   \
    cb.queueCommand(inst->glLineWidth, width);                                                     \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(PolygonOffset) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLfloat factor = static_cast<GLfloat>(Nan::To<double>(info[0]).ToChecked());                   \
    GLfloat units = static_cast<GLfloat>(Nan::To<double>(info[1]).ToChecked());                    \
                                                                                                   \
    cb.queueCommand(inst->glPolygonOffset, factor, units);                                         \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(SampleCoverage) {                                                                      \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLclampf value = static_cast<GLclampf>(Nan::To<double>(info[0]).ToChecked());                  \
    GLboolean invert = (Nan::To<bool>(info[1]).ToChecked());                                       \
                                                                                                   \
    cb.queueCommand(inst->glSampleCoverage, value, invert);                                        \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(Scissor) {                                                                             \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint x = Nan::To<int32_t>(info[0]).ToChecked();                                               \
    GLint y = Nan::To<int32_t>(info[1]).ToChecked();                                               \
    GLsizei width = Nan::To<int32_t>(info[2]).ToChecked();                                         \
    GLsizei height = Nan::To<int32_t>(info[3]).ToChecked();                                        \
                                                                                                   \
    cb.queueCommand(inst->glScissor, x, y, width, height);                                         \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(StencilFunc) {                                                                         \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum func = Nan::To<int32_t>(info[0]).ToChecked();                                           \
    GLint ref = Nan::To<int32_t>(info[1]).ToChecked();                                             \
    GLuint mask = Nan::To<uint32_t>(info[2]).ToChecked();                                          \
                                                                                                   \
    cb.queueCommand(inst->glStencilFunc, func, ref, mask);                                         \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(StencilFuncSeparate) {                                                                 \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum face = Nan::To<int32_t>(info[0]).ToChecked();                                           \
    GLenum func = Nan::To<int32_t>(info[1]).ToChecked();                                           \
    GLint ref = Nan::To<int32_t>(info[2]).ToChecked();                                             \
    GLuint mask = Nan::To<uint32_t>(info[3]).ToChecked();                                          \
                                                                                                   \
    cb.queueCommand(inst->glStencilFuncSeparate, face, func, ref, mask);                           \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(StencilMask) {                                                                         \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint mask = Nan::To<uint32_t>(info[0]).ToChecked();                                          \
                                                                                                   \
    cb.queueCommand(inst->glStencilMask, mask);                                                    \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(StencilMaskSeparate) {                                                                 \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum face = Nan::To<int32_t>(info[0]).ToChecked();                                           \
    GLuint mask = Nan::To<uint32_t>(info[1]).ToChecked();                                          \
                                                                                                   \
    cb.queueCommand(inst->glStencilMaskSeparate, face, mask);                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(StencilOp) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum fail = Nan::To<int32_t>(info[0]).ToChecked();                                           \
    GLenum zfail = Nan::To<int32_t>(info[1]).ToChecked();                                          \
    GLenum zpass = Nan::To<int32_t>(info[2]).ToChecked();                                          \
                                                                                                   \
    cb.queueCommand(inst->glStencilOp, fail, zfail, zpass);                                        \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(StencilOpSeparate) {                                                                   \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum face = Nan::To<int32_t>(info[0]).ToChecked();                                           \
    GLenum fail = Nan::To<int32_t>(info[1]).ToChecked();                                           \
    GLenum zfail = Nan::To<int32_t>(info[2]).ToChecked();                                          \
    GLenum zpass = Nan::To<int32_t>(info[3]).ToChecked();                                          \
                                                                                                   \
    cb.queueCommand(inst->glStencilOpSeparate, face, fail, zfail, zpass);                          \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(BindRenderbuffer) {                                                                    \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLuint buffer = Nan::To<uint32_t>(info[1]).ToChecked();                                        \
                                                                                                   \
    cb.queueCommand(inst->glBindRenderbuffer, target, buffer);                                     \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(CreateRenderbuffer) {                                                                  \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint renderbuffers;                                                                          \
    cb.runSyncCommand(inst->glGenRenderbuffers, 1, &renderbuffers);                                \
                                                                                                   \
    inst->registerGLObj(GLOBJECT_TYPE_RENDERBUFFER, renderbuffers);                                \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(renderbuffers));                               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DeleteBuffer) {                                                                        \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint buffer = (GLuint)Nan::To<uint32_t>(info[0]).ToChecked();                                \
                                                                                                   \
    inst->unregisterGLObj(GLOBJECT_TYPE_BUFFER, buffer);                                           \
                                                                                                   \
    using UintWrap1 = c8::cmd::FixedArrayWrap<GLuint, 1>;                                          \
    cb.queueCommand(inst->glDeleteBuffers, 1, UintWrap1(&buffer));                                 \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DeleteFramebuffer) {                                                                   \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint buffer = Nan::To<uint32_t>(info[0]).ToChecked();                                        \
                                                                                                   \
    inst->unregisterGLObj(GLOBJECT_TYPE_FRAMEBUFFER, buffer);                                      \
                                                                                                   \
    using UintWrap1 = c8::cmd::FixedArrayWrap<GLuint, 1>;                                          \
    cb.queueCommand(inst->glDeleteFramebuffers, 1, UintWrap1(&buffer));                            \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DeleteProgram) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint program = Nan::To<uint32_t>(info[0]).ToChecked();                                       \
                                                                                                   \
    inst->unregisterGLObj(GLOBJECT_TYPE_PROGRAM, program);                                         \
                                                                                                   \
    cb.queueCommand(inst->glDeleteProgram, program);                                               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DeleteRenderbuffer) {                                                                  \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint renderbuffer = Nan::To<uint32_t>(info[0]).ToChecked();                                  \
                                                                                                   \
    inst->unregisterGLObj(GLOBJECT_TYPE_RENDERBUFFER, renderbuffer);                               \
                                                                                                   \
    using UintWrap1 = c8::cmd::FixedArrayWrap<GLuint, 1>;                                          \
    cb.queueCommand(inst->glDeleteRenderbuffers, 1, UintWrap1(&renderbuffer));                     \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DeleteShader) {                                                                        \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint shader = Nan::To<uint32_t>(info[0]).ToChecked();                                        \
                                                                                                   \
    inst->unregisterGLObj(GLOBJECT_TYPE_SHADER, shader);                                           \
                                                                                                   \
    cb.queueCommand(inst->glDeleteShader, shader);                                                 \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DeleteTexture) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint texture = Nan::To<uint32_t>(info[0]).ToChecked();                                       \
                                                                                                   \
    inst->unregisterGLObj(GLOBJECT_TYPE_TEXTURE, texture);                                         \
                                                                                                   \
    using UintWrap1 = c8::cmd::FixedArrayWrap<GLuint, 1>;                                          \
    cb.queueCommand(inst->glDeleteTextures, 1, UintWrap1(&texture));                               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(DetachShader) {                                                                        \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint program = Nan::To<uint32_t>(info[0]).ToChecked();                                       \
    GLuint shader = Nan::To<uint32_t>(info[1]).ToChecked();                                        \
                                                                                                   \
    cb.queueCommand(inst->glDetachShader, program, shader);                                        \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(FramebufferRenderbuffer) {                                                             \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLenum attachment = Nan::To<int32_t>(info[1]).ToChecked();                                     \
    GLenum renderbuffertarget = Nan::To<int32_t>(info[2]).ToChecked();                             \
    GLuint renderbuffer = Nan::To<uint32_t>(info[3]).ToChecked();                                  \
                                                                                                   \
    /* Handle depth stencil case separately */                                                     \
    if (attachment == 0x821A) {                                                                    \
      cb.queueCommand(                                                                             \
        inst->glFramebufferRenderbuffer,                                                           \
        target,                                                                                    \
        GL_DEPTH_ATTACHMENT,                                                                       \
        renderbuffertarget,                                                                        \
        renderbuffer);                                                                             \
      cb.queueCommand(                                                                             \
        inst->glFramebufferRenderbuffer,                                                           \
        target,                                                                                    \
        GL_STENCIL_ATTACHMENT,                                                                     \
        renderbuffertarget,                                                                        \
        renderbuffer);                                                                             \
    } else {                                                                                       \
      cb.queueCommand(                                                                             \
        inst->glFramebufferRenderbuffer, target, attachment, renderbuffertarget, renderbuffer);    \
    }                                                                                              \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetVertexAttribOffset) {                                                               \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint index = Nan::To<uint32_t>(info[0]).ToChecked();                                         \
    GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();                                          \
                                                                                                   \
    void *ret = nullptr;                                                                           \
    cb.runSyncCommand(inst->glGetVertexAttribPointerv, index, pname, &ret);                        \
                                                                                                   \
    GLuint offset = static_cast<GLuint>(reinterpret_cast<size_t>(ret));                            \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(offset));                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(IsBuffer) {                                                                            \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    info.GetReturnValue().Set(                                                                     \
      Nan::New<v8::Boolean>(                                                                       \
        cb.runSyncCommand(inst->glIsBuffer, Nan::To<uint32_t>(info[0]).ToChecked()) != 0));        \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(IsFramebuffer) {                                                                       \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    info.GetReturnValue().Set(                                                                     \
      Nan::New<v8::Boolean>(                                                                       \
        cb.runSyncCommand(inst->glIsFramebuffer, Nan::To<uint32_t>(info[0]).ToChecked()) != 0));   \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(IsProgram) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    info.GetReturnValue().Set(                                                                     \
      Nan::New<v8::Boolean>(                                                                       \
        cb.runSyncCommand(inst->glIsProgram, Nan::To<uint32_t>(info[0]).ToChecked()) != 0));       \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(IsRenderbuffer) {                                                                      \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    info.GetReturnValue().Set(                                                                     \
      Nan::New<v8::Boolean>(                                                                       \
        cb.runSyncCommand(inst->glIsRenderbuffer, Nan::To<uint32_t>(info[0]).ToChecked()) != 0));  \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(IsShader) {                                                                            \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    info.GetReturnValue().Set(                                                                     \
      Nan::New<v8::Boolean>(                                                                       \
        cb.runSyncCommand(inst->glIsShader, Nan::To<uint32_t>(info[0]).ToChecked()) != 0));        \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(IsTexture) {                                                                           \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    info.GetReturnValue().Set(                                                                     \
      Nan::New<v8::Boolean>(                                                                       \
        cb.runSyncCommand(inst->glIsTexture, Nan::To<uint32_t>(info[0]).ToChecked()) != 0));       \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetShaderSource) {                                                                     \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint shader = Nan::To<int32_t>(info[0]).ToChecked();                                          \
                                                                                                   \
    GLint len;                                                                                     \
    cb.runSyncCommand(inst->glGetShaderiv, shader, GL_SHADER_SOURCE_LENGTH, &len);                 \
                                                                                                   \
    GLchar *source = new GLchar[len];                                                              \
    cb.runSyncCommand(inst->glGetShaderSource, shader, len, nullptr, source);                      \
    v8::Local<v8::String> str = Nan::New<v8::String>(source).ToLocalChecked();                     \
    delete[] source;                                                                               \
                                                                                                   \
    info.GetReturnValue().Set(str);                                                                \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(ReadPixels) {                                                                          \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint x = Nan::To<int32_t>(info[0]).ToChecked();                                               \
    GLint y = Nan::To<int32_t>(info[1]).ToChecked();                                               \
    GLsizei width = Nan::To<int32_t>(info[2]).ToChecked();                                         \
    GLsizei height = Nan::To<int32_t>(info[3]).ToChecked();                                        \
    GLenum format = Nan::To<int32_t>(info[4]).ToChecked();                                         \
    GLenum type = Nan::To<int32_t>(info[5]).ToChecked();                                           \
    Nan::TypedArrayContents<char> pixels(info[6]);                                                 \
                                                                                                   \
    cb.runSyncCommand(inst->glReadPixels, x, y, width, height, format, type, *pixels);             \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetActiveAttrib) {                                                                     \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint program = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLuint index = Nan::To<int32_t>(info[1]).ToChecked();                                          \
                                                                                                   \
    GLint maxLength;                                                                               \
    cb.runSyncCommand(inst->glGetProgramiv, program, GL_ACTIVE_ATTRIBUTE_MAX_LENGTH, &maxLength);  \
                                                                                                   \
    char *name = new char[maxLength];                                                              \
    GLsizei length = 0;                                                                            \
    GLenum type;                                                                                   \
    GLsizei size;                                                                                  \
    cb.runSyncCommand(                                                                             \
      inst->glGetActiveAttrib, program, index, maxLength, &length, &size, &type, name);            \
                                                                                                   \
    if (length > 0) {                                                                              \
      v8::Local<v8::Object> activeInfo = Nan::New<v8::Object>();                                   \
      Nan::Set(                                                                                    \
        activeInfo, Nan::New<v8::String>("size").ToLocalChecked(), Nan::New<v8::Integer>(size));   \
      Nan::Set(                                                                                    \
        activeInfo, Nan::New<v8::String>("type").ToLocalChecked(), Nan::New<v8::Integer>(type));   \
      Nan::Set(                                                                                    \
        activeInfo,                                                                                \
        Nan::New<v8::String>("name").ToLocalChecked(),                                             \
        Nan::New<v8::String>(name).ToLocalChecked());                                              \
      info.GetReturnValue().Set(activeInfo);                                                       \
    } else {                                                                                       \
      info.GetReturnValue().SetNull();                                                             \
    }                                                                                              \
                                                                                                   \
    delete[] name;                                                                                 \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetActiveUniform) {                                                                    \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint program = Nan::To<int32_t>(info[0]).ToChecked();                                        \
    GLuint index = Nan::To<int32_t>(info[1]).ToChecked();                                          \
                                                                                                   \
    GLint maxLength;                                                                               \
    cb.runSyncCommand(inst->glGetProgramiv, program, GL_ACTIVE_UNIFORM_MAX_LENGTH, &maxLength);    \
                                                                                                   \
    char *name = new char[maxLength];                                                              \
    GLsizei length = 0;                                                                            \
    GLenum type;                                                                                   \
    GLsizei size;                                                                                  \
    cb.runSyncCommand(                                                                             \
      inst->glGetActiveUniform, program, index, maxLength, &length, &size, &type, name);           \
                                                                                                   \
    if (length > 0) {                                                                              \
      v8::Local<v8::Object> activeInfo = Nan::New<v8::Object>();                                   \
      Nan::Set(                                                                                    \
        activeInfo, Nan::New<v8::String>("size").ToLocalChecked(), Nan::New<v8::Integer>(size));   \
      Nan::Set(                                                                                    \
        activeInfo, Nan::New<v8::String>("type").ToLocalChecked(), Nan::New<v8::Integer>(type));   \
      Nan::Set(                                                                                    \
        activeInfo,                                                                                \
        Nan::New<v8::String>("name").ToLocalChecked(),                                             \
        Nan::New<v8::String>(name).ToLocalChecked());                                              \
      info.GetReturnValue().Set(activeInfo);                                                       \
    } else {                                                                                       \
      info.GetReturnValue().SetNull();                                                             \
    }                                                                                              \
                                                                                                   \
    delete[] name;                                                                                 \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetAttachedShaders) {                                                                  \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint program = Nan::To<int32_t>(info[0]).ToChecked();                                        \
                                                                                                   \
    GLint numAttachedShaders;                                                                      \
    cb.runSyncCommand(inst->glGetProgramiv, program, GL_ATTACHED_SHADERS, &numAttachedShaders);    \
                                                                                                   \
    GLuint *shaders = new GLuint[numAttachedShaders];                                              \
    GLsizei count;                                                                                 \
    cb.runSyncCommand(inst->glGetAttachedShaders, program, numAttachedShaders, &count, shaders);   \
                                                                                                   \
    v8::Local<v8::Array> shadersArr = Nan::New<v8::Array>(count);                                  \
    for (int i = 0; i < count; i++) {                                                              \
      Nan::Set(shadersArr, i, Nan::New<v8::Integer>((int)shaders[i]));                             \
    }                                                                                              \
                                                                                                   \
    info.GetReturnValue().Set(shadersArr);                                                         \
                                                                                                   \
    delete[] shaders;                                                                              \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetParameter) {                                                                        \
    GL_BOILERPLATE;                                                                                \
    GLenum name = Nan::To<int32_t>(info[0]).ToChecked();                                           \
                                                                                                   \
    switch (name) {                                                                                \
      case 0x9240 /* UNPACK_FLIP_Y_WEBGL */:                                                       \
        info.GetReturnValue().Set(Nan::New<v8::Boolean>(inst->unpack_flip_y));                     \
        return;                                                                                    \
                                                                                                   \
      case 0x9241 /* UNPACK_PREMULTIPLY_ALPHA_WEBGL*/:                                             \
        info.GetReturnValue().Set(Nan::New<v8::Boolean>(inst->unpack_premultiply_alpha));          \
        return;                                                                                    \
                                                                                                   \
      case 0x9243 /* UNPACK_COLORSPACE_CONVERSION_WEBGL */:                                        \
        info.GetReturnValue().Set(Nan::New<v8::Integer>(inst->unpack_colorspace_conversion));      \
        return;                                                                                    \
                                                                                                   \
      case GL_BLEND:                                                                               \
      case GL_CULL_FACE:                                                                           \
      case GL_DEPTH_TEST:                                                                          \
      case GL_DEPTH_WRITEMASK:                                                                     \
      case GL_DITHER:                                                                              \
      case GL_POLYGON_OFFSET_FILL:                                                                 \
      case GL_SAMPLE_COVERAGE_INVERT:                                                              \
      case GL_SCISSOR_TEST:                                                                        \
      case GL_STENCIL_TEST: {                                                                      \
        GLboolean params;                                                                          \
        cb.runSyncCommand(inst->glGetBooleanv, name, &params);                                     \
                                                                                                   \
        info.GetReturnValue().Set(Nan::New<v8::Boolean>(params != 0));                             \
                                                                                                   \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      case GL_DEPTH_CLEAR_VALUE:                                                                   \
      case GL_LINE_WIDTH:                                                                          \
      case GL_POLYGON_OFFSET_FACTOR:                                                               \
      case GL_POLYGON_OFFSET_UNITS:                                                                \
      case GL_SAMPLE_COVERAGE_VALUE:                                                               \
      case GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT: {                                                    \
        GLfloat params;                                                                            \
        cb.runSyncCommand(inst->glGetFloatv, name, &params);                                       \
                                                                                                   \
        info.GetReturnValue().Set(Nan::New<v8::Number>(params));                                   \
                                                                                                   \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      case GL_RENDERER:                                                                            \
      case GL_SHADING_LANGUAGE_VERSION:                                                            \
      case GL_VENDOR:                                                                              \
      case GL_VERSION:                                                                             \
      case GL_EXTENSIONS: {                                                                        \
        const char *params =                                                                       \
          reinterpret_cast<const char *>(cb.runSyncCommand(inst->glGetString, name));              \
        if (params) {                                                                              \
          info.GetReturnValue().Set(Nan::New<v8::String>(params).ToLocalChecked());                \
        }                                                                                          \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      case GL_MAX_VIEWPORT_DIMS: {                                                                 \
        GLint params[2];                                                                           \
        cb.runSyncCommand(inst->glGetIntegerv, name, params);                                      \
                                                                                                   \
        v8::Local<v8::Array> arr = Nan::New<v8::Array>(2);                                         \
        Nan::Set(arr, 0, Nan::New<v8::Integer>(params[0]));                                        \
        Nan::Set(arr, 1, Nan::New<v8::Integer>(params[1]));                                        \
        info.GetReturnValue().Set(arr);                                                            \
                                                                                                   \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      case GL_SCISSOR_BOX:                                                                         \
      case GL_VIEWPORT: {                                                                          \
        GLint params[4];                                                                           \
        cb.runSyncCommand(inst->glGetIntegerv, name, params);                                      \
                                                                                                   \
        v8::Local<v8::Array> arr = Nan::New<v8::Array>(4);                                         \
        Nan::Set(arr, 0, Nan::New<v8::Integer>(params[0]));                                        \
        Nan::Set(arr, 1, Nan::New<v8::Integer>(params[1]));                                        \
        Nan::Set(arr, 2, Nan::New<v8::Integer>(params[2]));                                        \
        Nan::Set(arr, 3, Nan::New<v8::Integer>(params[3]));                                        \
        info.GetReturnValue().Set(arr);                                                            \
                                                                                                   \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      case GL_ALIASED_LINE_WIDTH_RANGE:                                                            \
      case GL_ALIASED_POINT_SIZE_RANGE:                                                            \
      case GL_DEPTH_RANGE: {                                                                       \
        GLfloat params[2];                                                                         \
        cb.runSyncCommand(inst->glGetFloatv, name, params);                                        \
                                                                                                   \
        v8::Local<v8::Array> arr = Nan::New<v8::Array>(2);                                         \
        Nan::Set(arr, 0, Nan::New<v8::Number>(params[0]));                                         \
        Nan::Set(arr, 1, Nan::New<v8::Number>(params[1]));                                         \
        info.GetReturnValue().Set(arr);                                                            \
                                                                                                   \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      case GL_BLEND_COLOR:                                                                         \
      case GL_COLOR_CLEAR_VALUE: {                                                                 \
        GLfloat params[4];                                                                         \
        cb.runSyncCommand(inst->glGetFloatv, name, params);                                        \
                                                                                                   \
        v8::Local<v8::Array> arr = Nan::New<v8::Array>(4);                                         \
        Nan::Set(arr, 0, Nan::New<v8::Number>(params[0]));                                         \
        Nan::Set(arr, 1, Nan::New<v8::Number>(params[1]));                                         \
        Nan::Set(arr, 2, Nan::New<v8::Number>(params[2]));                                         \
        Nan::Set(arr, 3, Nan::New<v8::Number>(params[3]));                                         \
        info.GetReturnValue().Set(arr);                                                            \
                                                                                                   \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      case GL_COLOR_WRITEMASK: {                                                                   \
        GLboolean params[4];                                                                       \
        cb.runSyncCommand(inst->glGetBooleanv, name, params);                                      \
                                                                                                   \
        v8::Local<v8::Array> arr = Nan::New<v8::Array>(4);                                         \
        Nan::Set(arr, 0, Nan::New<v8::Boolean>(params[0] == GL_TRUE));                             \
        Nan::Set(arr, 1, Nan::New<v8::Boolean>(params[1] == GL_TRUE));                             \
        Nan::Set(arr, 2, Nan::New<v8::Boolean>(params[2] == GL_TRUE));                             \
        Nan::Set(arr, 3, Nan::New<v8::Boolean>(params[3] == GL_TRUE));                             \
        info.GetReturnValue().Set(arr);                                                            \
                                                                                                   \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      default: {                                                                                   \
        GLint params;                                                                              \
        cb.runSyncCommand(inst->glGetIntegerv, name, &params);                                     \
        info.GetReturnValue().Set(Nan::New<v8::Integer>(params));                                  \
        return;                                                                                    \
      }                                                                                            \
    }                                                                                              \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetBufferParameter) {                                                                  \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();                                          \
                                                                                                   \
    GLint params;                                                                                  \
    cb.runSyncCommand(inst->glGetBufferParameteriv, target, pname, &params);                       \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(params));                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetFramebufferAttachmentParameter) {                                                   \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLenum attachment = Nan::To<int32_t>(info[1]).ToChecked();                                     \
    GLenum pname = Nan::To<int32_t>(info[2]).ToChecked();                                          \
                                                                                                   \
    GLint params;                                                                                  \
    cb.runSyncCommand(                                                                             \
      inst->glGetFramebufferAttachmentParameteriv, target, attachment, pname, &params);            \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(params));                                      \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetProgramInfoLog) {                                                                   \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLuint program = Nan::To<int32_t>(info[0]).ToChecked();                                        \
                                                                                                   \
    GLint infoLogLength;                                                                           \
    cb.runSyncCommand(inst->glGetProgramiv, program, GL_INFO_LOG_LENGTH, &infoLogLength);          \
                                                                                                   \
    char *error = new char[infoLogLength + 1];                                                     \
    cb.runSyncCommand(                                                                             \
      inst->glGetProgramInfoLog, program, infoLogLength + 1, &infoLogLength, error);               \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::String>(error).ToLocalChecked());                       \
                                                                                                   \
    delete[] error;                                                                                \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetShaderPrecisionFormat) {                                                            \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum shaderType = Nan::To<int32_t>(info[0]).ToChecked();                                     \
    GLenum precisionType = Nan::To<int32_t>(info[1]).ToChecked();                                  \
                                                                                                   \
    GLint range[2];                                                                                \
    GLint precision;                                                                               \
                                                                                                   \
    cb.runSyncCommand(                                                                             \
      inst->glGetShaderPrecisionFormat, shaderType, precisionType, range, &precision);             \
                                                                                                   \
    v8::Local<v8::Object> result = Nan::New<v8::Object>();                                         \
    Nan::Set(                                                                                      \
      result, Nan::New<v8::String>("rangeMin").ToLocalChecked(), Nan::New<v8::Integer>(range[0])); \
    Nan::Set(                                                                                      \
      result, Nan::New<v8::String>("rangeMax").ToLocalChecked(), Nan::New<v8::Integer>(range[1])); \
    Nan::Set(                                                                                      \
      result,                                                                                      \
      Nan::New<v8::String>("precision").ToLocalChecked(),                                          \
      Nan::New<v8::Integer>(precision));                                                           \
                                                                                                   \
    info.GetReturnValue().Set(result);                                                             \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetRenderbufferParameter) {                                                            \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLenum target = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();                                          \
                                                                                                   \
    int value;                                                                                     \
    cb.runSyncCommand(inst->glGetRenderbufferParameteriv, target, pname, &value);                  \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(value));                                       \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetUniform) {                                                                          \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint program = Nan::To<int32_t>(info[0]).ToChecked();                                         \
    GLint location = Nan::To<int32_t>(info[1]).ToChecked();                                        \
                                                                                                   \
    float data[16];                                                                                \
    cb.runSyncCommand(inst->glGetUniformfv, program, location, data);                              \
                                                                                                   \
    v8::Local<v8::Array> arr = Nan::New<v8::Array>(16);                                            \
    for (int i = 0; i < 16; i++) {                                                                 \
      Nan::Set(arr, i, Nan::New<v8::Number>(data[i]));                                             \
    }                                                                                              \
                                                                                                   \
    info.GetReturnValue().Set(arr);                                                                \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetVertexAttrib) {                                                                     \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    GLint index = Nan::To<int32_t>(info[0]).ToChecked();                                           \
    GLenum pname = Nan::To<int32_t>(info[1]).ToChecked();                                          \
                                                                                                   \
    GLint value;                                                                                   \
                                                                                                   \
    switch (pname) {                                                                               \
      case GL_VERTEX_ATTRIB_ARRAY_ENABLED:                                                         \
      case GL_VERTEX_ATTRIB_ARRAY_NORMALIZED: {                                                    \
        cb.runSyncCommand(inst->glGetVertexAttribiv, index, pname, &value);                        \
        info.GetReturnValue().Set(Nan::New<v8::Boolean>(value != 0));                              \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      case GL_VERTEX_ATTRIB_ARRAY_SIZE:                                                            \
      case GL_VERTEX_ATTRIB_ARRAY_STRIDE:                                                          \
      case GL_VERTEX_ATTRIB_ARRAY_TYPE: {                                                          \
        cb.runSyncCommand(inst->glGetVertexAttribiv, index, pname, &value);                        \
        info.GetReturnValue().Set(Nan::New<v8::Integer>(value));                                   \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      case GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: {                                                \
        cb.runSyncCommand(inst->glGetVertexAttribiv, index, pname, &value);                        \
        info.GetReturnValue().Set(Nan::New<v8::Integer>(value));                                   \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      case GL_CURRENT_VERTEX_ATTRIB: {                                                             \
        float vextex_attribs[4];                                                                   \
                                                                                                   \
        cb.runSyncCommand(inst->glGetVertexAttribfv, index, pname, vextex_attribs);                \
                                                                                                   \
        v8::Local<v8::Array> arr = Nan::New<v8::Array>(4);                                         \
        Nan::Set(arr, 0, Nan::New<v8::Number>(vextex_attribs[0]));                                 \
        Nan::Set(arr, 1, Nan::New<v8::Number>(vextex_attribs[1]));                                 \
        Nan::Set(arr, 2, Nan::New<v8::Number>(vextex_attribs[2]));                                 \
        Nan::Set(arr, 3, Nan::New<v8::Number>(vextex_attribs[3]));                                 \
        info.GetReturnValue().Set(arr);                                                            \
                                                                                                   \
        return;                                                                                    \
      }                                                                                            \
                                                                                                   \
      default:                                                                                     \
        inst->setError(GL_INVALID_ENUM);                                                           \
    }                                                                                              \
                                                                                                   \
    info.GetReturnValue().SetNull();                                                               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetSupportedExtensions) {                                                              \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    const char *extensions =                                                                       \
      reinterpret_cast<const char *>(cb.runSyncCommand(inst->glGetString, GL_EXTENSIONS));         \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::String>(extensions).ToLocalChecked());                  \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetExtension) {                                                                        \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    /* TODO */                                                                                     \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(EglSwapBuffers) {                                                                      \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    const auto &app = AppSingleton::getInstance();                                                 \
    cb.runSyncCommand(eglSwapBuffers, app.display(), inst->surface);                               \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetNull) {                                                                             \
    Nan::HandleScope();                                                                            \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::External>(nullptr));                                    \
  }                                                                                                \
                                                                                                   \
  GL_METHOD(GetCachedUnpackAlignment) {                                                            \
    GL_BOILERPLATE;                                                                                \
                                                                                                   \
    info.GetReturnValue().Set(Nan::New<v8::Integer>(inst->unpack_alignment));                      \
  }

#endif
