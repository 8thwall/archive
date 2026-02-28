#include "webgl2.h"

void WebGL2RenderingContext::initPointers() {
  glDrawArraysInstanced =
    reinterpret_cast<PFNGLDRAWARRAYSINSTANCEDPROC>(eglGetProcAddress("glDrawArraysInstanced"));
  glDrawElementsInstanced =
    reinterpret_cast<PFNGLDRAWELEMENTSINSTANCEDPROC>(eglGetProcAddress("glDrawElementsInstanced"));
  glVertexAttribDivisor =
    reinterpret_cast<PFNGLVERTEXATTRIBDIVISORPROC>(eglGetProcAddress("glVertexAttribDivisor"));

#include "procs-webgl-base.h"

  // Handle Extension functions for Opengl ES 2.0. It's recommended to use the
  // core functions instead of the extension functions if possible.
  glDrawBuffers = reinterpret_cast<PFNGLDRAWBUFFERSPROC>(eglGetProcAddress("glDrawBuffers"));

  glGenVertexArrays =
    reinterpret_cast<PFNGLGENVERTEXARRAYSPROC>(eglGetProcAddress("glGenVertexArrays"));
  glDeleteVertexArrays =
    reinterpret_cast<PFNGLDELETEVERTEXARRAYSPROC>(eglGetProcAddress("glDeleteVertexArrays"));
  glIsVertexArray = reinterpret_cast<PFNGLISVERTEXARRAYPROC>(eglGetProcAddress("glIsVertexArray"));
  glBindVertexArray =
    reinterpret_cast<PFNGLBINDVERTEXARRAYPROC>(eglGetProcAddress("glBindVertexArray"));

  // WebGL2 functions
  glBeginTransformFeedback = reinterpret_cast<PFNGLBEGINTRANSFORMFEEDBACKPROC>(
    eglGetProcAddress("glBeginTransformFeedback"));
  glBeginQuery = reinterpret_cast<PFNGLBEGINQUERYPROC>(eglGetProcAddress("glBeginQuery"));
  glBindBufferBase =
    reinterpret_cast<PFNGLBINDBUFFERBASEPROC>(eglGetProcAddress("glBindBufferBase"));
  glBindBufferRange =
    reinterpret_cast<PFNGLBINDBUFFERRANGEPROC>(eglGetProcAddress("glBindBufferRange"));
  glBindSampler = reinterpret_cast<PFNGLBINDSAMPLERPROC>(eglGetProcAddress("glBindSampler"));
  glBindTransformFeedback =
    reinterpret_cast<PFNGLBINDTRANSFORMFEEDBACKPROC>(eglGetProcAddress("glBindTransformFeedback"));
  glClearBufferiv = reinterpret_cast<PFNGLCLEARBUFFERIVPROC>(eglGetProcAddress("glClearBufferiv"));
  glClearBufferuiv =
    reinterpret_cast<PFNGLCLEARBUFFERUIVPROC>(eglGetProcAddress("glClearBufferuiv"));
  glClearBufferfv = reinterpret_cast<PFNGLCLEARBUFFERFVPROC>(eglGetProcAddress("glClearBufferfv"));
  glClearBufferfi = reinterpret_cast<PFNGLCLEARBUFFERFIPROC>(eglGetProcAddress("glClearBufferfi"));
  glClientWaitSync =
    reinterpret_cast<PFNGLCLIENTWAITSYNCPROC>(eglGetProcAddress("glClientWaitSync"));
  glCompressedTexImage2D =
    reinterpret_cast<PFNGLCOMPRESSEDTEXIMAGE2DPROC>(eglGetProcAddress("glCompressedTexImage2D"));
  glCompressedTexSubImage2D = reinterpret_cast<PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC>(
    eglGetProcAddress("glCompressedTexSubImage2D"));
  glCopyBufferSubData =
    reinterpret_cast<PFNGLCOPYBUFFERSUBDATAPROC>(eglGetProcAddress("glCopyBufferSubData"));
  glCopyTexSubImage3D =
    reinterpret_cast<PFNGLCOPYTEXSUBIMAGE3DPROC>(eglGetProcAddress("glCopyTexSubImage3D"));
  glDeleteSamplers =
    reinterpret_cast<PFNGLDELETESAMPLERSPROC>(eglGetProcAddress("glDeleteSamplers"));
  glDeleteSync = reinterpret_cast<PFNGLDELETESYNCPROC>(eglGetProcAddress("glDeleteSync"));
  glDeleteTransformFeedbacks = reinterpret_cast<PFNGLDELETETRANSFORMFEEDBACKSPROC>(
    eglGetProcAddress("glDeleteTransformFeedbacks"));
  glDeleteQueries = reinterpret_cast<PFNGLDELETEQUERIESPROC>(eglGetProcAddress("glDeleteQueries"));
  glDrawRangeElements =
    reinterpret_cast<PFNGLDRAWRANGEELEMENTSPROC>(eglGetProcAddress("glDrawRangeElements"));
  glEndTransformFeedback =
    reinterpret_cast<PFNGLENDTRANSFORMFEEDBACKPROC>(eglGetProcAddress("glEndTransformFeedback"));
  glEndQuery = reinterpret_cast<PFNGLENDQUERYPROC>(eglGetProcAddress("glEndQuery"));
  glFenceSync = reinterpret_cast<PFNGLFENCESYNCPROC>(eglGetProcAddress("glFenceSync"));
  glGenSamplers = reinterpret_cast<PFNGLGENSAMPLERSPROC>(eglGetProcAddress("glGenSamplers"));
  glGenTransformFeedbacks =
    reinterpret_cast<PFNGLGENTRANSFORMFEEDBACKSPROC>(eglGetProcAddress("glGenTransformFeedbacks"));
  glGenQueries = reinterpret_cast<PFNGLGENQUERIESPROC>(eglGetProcAddress("glGenQueries"));
  glGetActiveUniformsiv =
    reinterpret_cast<PFNGLGETACTIVEUNIFORMSIVPROC>(eglGetProcAddress("glGetActiveUniformsiv"));
  glGetSynciv = reinterpret_cast<PFNGLGETSYNCIVPROC>(eglGetProcAddress("glGetSynciv"));
  glGetActiveUniformBlockiv = reinterpret_cast<PFNGLGETACTIVEUNIFORMBLOCKIVPROC>(
    eglGetProcAddress("glGetActiveUniformBlockiv"));
  glGetFragDataLocation =
    reinterpret_cast<PFNGLGETFRAGDATALOCATIONPROC>(eglGetProcAddress("glGetFragDataLocation"));
  glGetInternalformativ =
    reinterpret_cast<PFNGLGETINTERNALFORMATIVPROC>(eglGetProcAddress("glGetInternalformativ"));
  glGetSamplerParameteriv =
    reinterpret_cast<PFNGLGETSAMPLERPARAMETERIVPROC>(eglGetProcAddress("glGetSamplerParameteriv"));
  glGetSamplerParameterfv =
    reinterpret_cast<PFNGLGETSAMPLERPARAMETERFVPROC>(eglGetProcAddress("glGetSamplerParameterfv"));
  glGetTransformFeedbackVarying = reinterpret_cast<PFNGLGETTRANSFORMFEEDBACKVARYINGPROC>(
    eglGetProcAddress("glGetTransformFeedbackVarying"));
  glGetQueryiv = reinterpret_cast<PFNGLGETQUERYIVPROC>(eglGetProcAddress("glGetQueryiv"));
  glGetQueryObjectuiv =
    reinterpret_cast<PFNGLGETQUERYOBJECTUIVPROC>(eglGetProcAddress("glGetQueryObjectuiv"));
  glGetUniformBlockIndex =
    reinterpret_cast<PFNGLGETUNIFORMBLOCKINDEXPROC>(eglGetProcAddress("glGetUniformBlockIndex"));
  glGetUniformIndices =
    reinterpret_cast<PFNGLGETUNIFORMINDICESPROC>(eglGetProcAddress("glGetUniformIndices"));
  glGetIntegeri_v = reinterpret_cast<PFNGLGETINTEGERI_VPROC>(eglGetProcAddress("glGetIntegeri_v"));
  glIsSampler = reinterpret_cast<PFNGLISSAMPLERPROC>(eglGetProcAddress("glIsSampler"));
  glIsSync = reinterpret_cast<PFNGLISSYNCPROC>(eglGetProcAddress("glIsSync"));
  glIsTransformFeedback =
    reinterpret_cast<PFNGLISTRANSFORMFEEDBACKPROC>(eglGetProcAddress("glIsTransformFeedback"));
  glIsQuery = reinterpret_cast<PFNGLISQUERYPROC>(eglGetProcAddress("glIsQuery"));
  glMapBufferRange =
    reinterpret_cast<PFNGLMAPBUFFERRANGEPROC>(eglGetProcAddress("glMapBufferRange"));
  glPauseTransformFeedback = reinterpret_cast<PFNGLPAUSETRANSFORMFEEDBACKPROC>(
    eglGetProcAddress("glPauseTransformFeedback"));
  glBlitFramebuffer =
    reinterpret_cast<PFNGLBLITFRAMEBUFFERPROC>(eglGetProcAddress("glBlitFramebuffer"));
  glFramebufferTextureLayer = reinterpret_cast<PFNGLFRAMEBUFFERTEXTURELAYERPROC>(
    eglGetProcAddress("glFramebufferTextureLayer"));
  glInvalidateSubFramebuffer = reinterpret_cast<PFNGLINVALIDATESUBFRAMEBUFFERPROC>(
    eglGetProcAddress("glInvalidateSubFramebuffer"));
  glInvalidateFramebuffer =
    reinterpret_cast<PFNGLINVALIDATEFRAMEBUFFERPROC>(eglGetProcAddress("glInvalidateFramebuffer"));
  glReadBuffer = reinterpret_cast<PFNGLREADBUFFERPROC>(eglGetProcAddress("glReadBuffer"));
  glResumeTransformFeedback = reinterpret_cast<PFNGLRESUMETRANSFORMFEEDBACKPROC>(
    eglGetProcAddress("glResumeTransformFeedback"));
  glRenderbufferStorageMultisample = reinterpret_cast<PFNGLRENDERBUFFERSTORAGEMULTISAMPLEPROC>(
    eglGetProcAddress("glRenderbufferStorageMultisample"));
  glSamplerParameteri =
    reinterpret_cast<PFNGLSAMPLERPARAMETERIPROC>(eglGetProcAddress("glSamplerParameteri"));
  glSamplerParameterf =
    reinterpret_cast<PFNGLSAMPLERPARAMETERFPROC>(eglGetProcAddress("glSamplerParameterf"));
  glTexImage3D = reinterpret_cast<PFNGLTEXIMAGE3DPROC>(eglGetProcAddress("glTexImage3D"));
  glTexSubImage3D = reinterpret_cast<PFNGLTEXSUBIMAGE3DPROC>(eglGetProcAddress("glTexSubImage3D"));
  glTexStorage2D = reinterpret_cast<PFNGLTEXSTORAGE2DPROC>(eglGetProcAddress("glTexStorage2D"));
  glTexStorage3D = reinterpret_cast<PFNGLTEXSTORAGE3DPROC>(eglGetProcAddress("glTexStorage3D"));
  glTransformFeedbackVaryings = reinterpret_cast<PFNGLTRANSFORMFEEDBACKVARYINGSPROC>(
    eglGetProcAddress("glTransformFeedbackVaryings"));
  glUnmapBuffer = reinterpret_cast<PFNGLUNMAPBUFFERPROC>(eglGetProcAddress("glUnmapBuffer"));
  glUniform1iv = reinterpret_cast<PFNGLUNIFORM1IVPROC>(eglGetProcAddress("glUniform1iv"));
  glUniform1fv = reinterpret_cast<PFNGLUNIFORM1FVPROC>(eglGetProcAddress("glUniform1fv"));
  glUniform1ui = reinterpret_cast<PFNGLUNIFORM1UIPROC>(eglGetProcAddress("glUniform1ui"));
  glUniform1uiv = reinterpret_cast<PFNGLUNIFORM1UIVPROC>(eglGetProcAddress("glUniform1uiv"));
  glUniform2fv = reinterpret_cast<PFNGLUNIFORM2FVPROC>(eglGetProcAddress("glUniform2fv"));
  glUniform2iv = reinterpret_cast<PFNGLUNIFORM2IVPROC>(eglGetProcAddress("glUniform2iv"));
  glUniform2ui = reinterpret_cast<PFNGLUNIFORM2UIPROC>(eglGetProcAddress("glUniform2ui"));
  glUniform2uiv = reinterpret_cast<PFNGLUNIFORM2UIVPROC>(eglGetProcAddress("glUniform2uiv"));
  glUniform3fv = reinterpret_cast<PFNGLUNIFORM3FVPROC>(eglGetProcAddress("glUniform3fv"));
  glUniform3iv = reinterpret_cast<PFNGLUNIFORM3IVPROC>(eglGetProcAddress("glUniform3iv"));
  glUniform3ui = reinterpret_cast<PFNGLUNIFORM3UIPROC>(eglGetProcAddress("glUniform3ui"));
  glUniform3uiv = reinterpret_cast<PFNGLUNIFORM3UIVPROC>(eglGetProcAddress("glUniform3uiv"));
  glUniform4fv = reinterpret_cast<PFNGLUNIFORM4FVPROC>(eglGetProcAddress("glUniform4fv"));
  glUniform4iv = reinterpret_cast<PFNGLUNIFORM4IVPROC>(eglGetProcAddress("glUniform4iv"));
  glUniform4ui = reinterpret_cast<PFNGLUNIFORM4UIPROC>(eglGetProcAddress("glUniform4ui"));
  glUniform4uiv = reinterpret_cast<PFNGLUNIFORM4UIVPROC>(eglGetProcAddress("glUniform4uiv"));
  glUniformBlockBinding =
    reinterpret_cast<PFNGLUNIFORMBLOCKBINDINGPROC>(eglGetProcAddress("glUniformBlockBinding"));
  glUniformMatrix2x3fv =
    reinterpret_cast<PFNGLUNIFORMMATRIX2X3FVPROC>(eglGetProcAddress("glUniformMatrix2x3fv"));
  glUniformMatrix2x4fv =
    reinterpret_cast<PFNGLUNIFORMMATRIX2X4FVPROC>(eglGetProcAddress("glUniformMatrix2x4fv"));
  glUniformMatrix3x2fv =
    reinterpret_cast<PFNGLUNIFORMMATRIX3X2FVPROC>(eglGetProcAddress("glUniformMatrix3x2fv"));
  glUniformMatrix3x4fv =
    reinterpret_cast<PFNGLUNIFORMMATRIX3X4FVPROC>(eglGetProcAddress("glUniformMatrix3x4fv"));
  glUniformMatrix4x2fv =
    reinterpret_cast<PFNGLUNIFORMMATRIX4X2FVPROC>(eglGetProcAddress("glUniformMatrix4x2fv"));
  glUniformMatrix4x3fv =
    reinterpret_cast<PFNGLUNIFORMMATRIX4X3FVPROC>(eglGetProcAddress("glUniformMatrix4x3fv"));
  glWaitSync = reinterpret_cast<PFNGLWAITSYNCPROC>(eglGetProcAddress("glWaitSync"));
  glVertexAttribI4i =
    reinterpret_cast<PFNGLVERTEXATTRIBI4IPROC>(eglGetProcAddress("glVertexAttribI4i"));
  glVertexAttribI4ui =
    reinterpret_cast<PFNGLVERTEXATTRIBI4UIPROC>(eglGetProcAddress("glVertexAttribI4ui"));
  glVertexAttribIPointer =
    reinterpret_cast<PFNGLVERTEXATTRIBIPOINTERPROC>(eglGetProcAddress("glVertexAttribIPointer"));

  // EXT_multisampled_render_to_texture
  glRenderbufferStorageMultisampleEXT =
    reinterpret_cast<PFNGLRENDERBUFFERSTORAGEMULTISAMPLEEXTPROC>(
      eglGetProcAddress("glRenderbufferStorageMultisampleEXT"));
  glFramebufferTexture2DMultisampleEXT =
    reinterpret_cast<PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEEXTPROC>(
      eglGetProcAddress("glFramebufferTexture2DMultisampleEXT"));
}
