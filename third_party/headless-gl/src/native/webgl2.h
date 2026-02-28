#ifndef WEBGL2_H_
#define WEBGL2_H_

#include "webgl-base.h"

// Using OpenGL ES 3.0 for most compatibility
// See https://chromium.googlesource.com/angle/angle/+/main/README.md
#include <cmath>

#include "c8/pixels/opengl/egl.h"
#include "c8/pixels/opengl/eglext.h"
#include "c8/pixels/opengl/eglplatform.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/pixels/opengl/glext.h"

typedef std::pair<GLuint, GLObjectType> GLObjectReference;

struct WebGL2RenderingContext : public WebGLRenderingContextBase {
  // A list of object references, need do destroy them at program exit
  std::map<std::pair<GLuint, GLObjectType>, bool> objects;
  void registerGLObj(GLObjectType type, GLuint obj) { objects[std::make_pair(obj, type)] = true; }
  void unregisterGLObj(GLObjectType type, GLuint obj) { objects.erase(std::make_pair(obj, type)); }

  // Constructor
  WebGL2RenderingContext(
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
    void *nativeWindow);
  virtual ~WebGL2RenderingContext();

  // Error handling
  GLenum lastError = GL_NO_ERROR;
  void setError(GLenum error);
  GLenum getError();

  // Preferred depth format
  GLenum preferredDepth;

  void *nativeWindow_;

  // Destructors
  void dispose() override;

  BASE_NAN_METHODS();

  static NAN_METHOD(BindVertexArray);
  static NAN_METHOD(CreateVertexArray);
  static NAN_METHOD(DeleteVertexArray);
  static NAN_METHOD(IsVertexArray);

  // WebGL2 methods
  static NAN_METHOD(BeginTransformFeedback);
  static NAN_METHOD(BeginQuery);
  static NAN_METHOD(BindBufferBase);
  static NAN_METHOD(BindBufferRange);
  static NAN_METHOD(BindSampler);
  static NAN_METHOD(BindTransformFeedback);
  static NAN_METHOD(ClearBufferfv);
  static NAN_METHOD(ClearBufferiv);
  static NAN_METHOD(ClearBufferuiv);
  static NAN_METHOD(ClearBufferfi);
  static NAN_METHOD(ClientWaitSync);
  static NAN_METHOD(CopyBufferSubData);
  static NAN_METHOD(CopyTexSubImage3D);
  static NAN_METHOD(CompressedTexImage2D);
  static NAN_METHOD(CompressedTexSubImage2D);
  static NAN_METHOD(CreateSampler);
  static NAN_METHOD(CreateTransformFeedback);
  static NAN_METHOD(CreateQuery);
  static NAN_METHOD(DeleteSampler);
  static NAN_METHOD(DeleteSync);
  static NAN_METHOD(DeleteTransformFeedback);
  static NAN_METHOD(DeleteQuery);
  static NAN_METHOD(DrawBuffers);
  static NAN_METHOD(DrawRangeElements);
  static NAN_METHOD(EndTransformFeedback);
  static NAN_METHOD(EndQuery);
  static NAN_METHOD(FenceSync);
  static NAN_METHOD(GetActiveUniformBlockParameter);
  static NAN_METHOD(GetActiveUniforms);
  static NAN_METHOD(GetBufferSubData);
  static NAN_METHOD(GetFragDataLocation);
  static NAN_METHOD(GetIntegeriv);
  static NAN_METHOD(GetInternalformatParameter);
  static NAN_METHOD(GetParameter2);
  static NAN_METHOD(GetSamplerParameter);
  static NAN_METHOD(GetSyncParameter);
  static NAN_METHOD(GetTransformFeedbackVarying);
  static NAN_METHOD(GetQuery);
  static NAN_METHOD(GetQueryParameter);
  static NAN_METHOD(GetUniformBlockIndex);
  static NAN_METHOD(GetUniformIndices);
  static NAN_METHOD(IsSampler);
  static NAN_METHOD(IsSync);
  static NAN_METHOD(IsTransformFeedback);
  static NAN_METHOD(IsQuery);
  static NAN_METHOD(PauseTransformFeedback);
  static NAN_METHOD(BlitFramebuffer);
  static NAN_METHOD(FramebufferTextureLayer);
  static NAN_METHOD(InvalidateSubFramebuffer);
  static NAN_METHOD(InvalidateFramebuffer);
  static NAN_METHOD(ReadBuffer);
  static NAN_METHOD(ResumeTransformFeedback);
  static NAN_METHOD(RenderbufferStorageMultisample);
  static NAN_METHOD(SamplerParameteri);
  static NAN_METHOD(SamplerParameterf);
  static NAN_METHOD(TexImage3D);
  static NAN_METHOD(TexSubImage3D);
  static NAN_METHOD(TexStorage2D);
  static NAN_METHOD(TexStorage3D);
  static NAN_METHOD(TransformFeedbackVaryings);
  static NAN_METHOD(Uniform1iv);
  static NAN_METHOD(Uniform1fv);
  static NAN_METHOD(Uniform1ui);
  static NAN_METHOD(Uniform1uiv);
  static NAN_METHOD(Uniform2fv);
  static NAN_METHOD(Uniform2iv);
  static NAN_METHOD(Uniform2ui);
  static NAN_METHOD(Uniform2uiv);
  static NAN_METHOD(Uniform3fv);
  static NAN_METHOD(Uniform3iv);
  static NAN_METHOD(Uniform3ui);
  static NAN_METHOD(Uniform3uiv);
  static NAN_METHOD(Uniform4fv);
  static NAN_METHOD(Uniform4iv);
  static NAN_METHOD(Uniform4ui);
  static NAN_METHOD(Uniform4uiv);
  static NAN_METHOD(UniformBlockBinding);
  static NAN_METHOD(UniformMatrix2x3fv);
  static NAN_METHOD(UniformMatrix2x4fv);
  static NAN_METHOD(UniformMatrix3x2fv);
  static NAN_METHOD(UniformMatrix3x4fv);
  static NAN_METHOD(UniformMatrix4x2fv);
  static NAN_METHOD(UniformMatrix4x3fv);
  static NAN_METHOD(WaitSync);
  static NAN_METHOD(VertexAttribI4i);
  static NAN_METHOD(VertexAttribI4ui);
  static NAN_METHOD(VertexAttribIPointer);

  // EXT_multisampled_render_to_texture
  static NAN_METHOD(RenderbufferStorageMultisampleEXT);
  static NAN_METHOD(FramebufferTexture2DMultisampleEXT);

  // Non-standard methods
  static NAN_METHOD(GetCachedUnpackRowLength);
  static NAN_METHOD(GetCachedUnpackSkipPixels);
  static NAN_METHOD(GetCachedUnpackSkipRows);

  void initPointers();

#include "procs-webgl2.h"

private:
  // Compute the pixel pointer offset given UNPACK_SKIP_PIXELS and UNPACK_SKIP_ROWS.
  std::ptrdiff_t pixelOffset(int bytesPerRow, int bytesPerPixel);

  GLint unpack_row_length;
  GLint unpack_skip_pixels;
  GLint unpack_skip_rows;
};

#endif
