#include "webgl.h"

void WebGLRenderingContext::initPointers() {
#if C8_USE_ANGLE
  glDrawArraysInstanced = reinterpret_cast<PFNGLDRAWARRAYSINSTANCEDANGLEPROC>(
    eglGetProcAddress("glDrawArraysInstancedANGLE"));
  glDrawElementsInstanced = reinterpret_cast<PFNGLDRAWELEMENTSINSTANCEDANGLEPROC>(
    eglGetProcAddress("glDrawElementsInstancedANGLE"));
  glVertexAttribDivisor = reinterpret_cast<PFNGLVERTEXATTRIBDIVISORANGLEPROC>(
    eglGetProcAddress("glVertexAttribDivisorANGLE"));
#else
  glDrawArraysInstanced =
    reinterpret_cast<PFNGLDRAWARRAYSINSTANCEDPROC>(eglGetProcAddress("glDrawArraysInstanced"));
  glDrawElementsInstanced =
    reinterpret_cast<PFNGLDRAWELEMENTSINSTANCEDPROC>(eglGetProcAddress("glDrawElementsInstanced"));
  glVertexAttribDivisor =
    reinterpret_cast<PFNGLVERTEXATTRIBDIVISORPROC>(eglGetProcAddress("glVertexAttribDivisor"));
#endif

#include "procs-webgl-base.h"

  glDrawBuffersEXT =
    reinterpret_cast<PFNGLDRAWBUFFERSEXTPROC>(eglGetProcAddress("glDrawBuffersEXT"));

  glGenVertexArraysOES =
    reinterpret_cast<PFNGLGENVERTEXARRAYSOESPROC>(eglGetProcAddress("glGenVertexArraysOES"));
  glDeleteVertexArraysOES =
    reinterpret_cast<PFNGLDELETEVERTEXARRAYSOESPROC>(eglGetProcAddress("glDeleteVertexArraysOES"));
  glIsVertexArrayOES =
    reinterpret_cast<PFNGLISVERTEXARRAYOESPROC>(eglGetProcAddress("glIsVertexArrayOES"));
  glBindVertexArrayOES =
    reinterpret_cast<PFNGLBINDVERTEXARRAYOESPROC>(eglGetProcAddress("glBindVertexArrayOES"));
}
