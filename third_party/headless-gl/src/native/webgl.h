#ifndef WEBGL_H_
#define WEBGL_H_

#include "c8/pixels/opengl/egl.h"
#include "c8/pixels/opengl/eglext.h"
#include "c8/pixels/opengl/eglplatform.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/pixels/opengl/glext.h"
#include "webgl-base.h"

#if C8_USE_ANGLE
#define MAYBE_ANGLE_EXT(name) name##_EXT
#else
#define MAYBE_ANGLE_EXT(name) name
#endif

typedef std::pair<GLuint, GLObjectType> GLObjectReference;

struct WebGLRenderingContext : public WebGLRenderingContextBase {
  // A list of object references, need do destroy them at program exit
  std::map<std::pair<GLuint, GLObjectType>, bool> objects;
  void registerGLObj(GLObjectType type, GLuint obj) { objects[std::make_pair(obj, type)] = true; }
  void unregisterGLObj(GLObjectType type, GLuint obj) { objects.erase(std::make_pair(obj, type)); }

  // Constructor
  WebGLRenderingContext(
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
  virtual ~WebGLRenderingContext();

  // Error handling
  GLenum lastError;
  void setError(GLenum error);
  GLenum getError();

  // Preferred depth format
  GLenum preferredDepth;

  void *nativeWindow_;

  // Destructors
  void dispose() override;

  BASE_NAN_METHODS();

  // WebGL1 Exclusive
  static NAN_METHOD(BindVertexArrayOES);
  static NAN_METHOD(CreateVertexArrayOES);
  static NAN_METHOD(DeleteVertexArrayOES);
  static NAN_METHOD(IsVertexArrayOES);

  static NAN_METHOD(DrawBuffersWEBGL);
  static NAN_METHOD(EXTWEBGL_draw_buffers);

  void initPointers();

#include "procs-webgl.h"
};

#endif
