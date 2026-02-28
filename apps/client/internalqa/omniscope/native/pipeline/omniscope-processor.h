// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Android-specific OpenGL for 8th Wall XR.

#pragma once

#include <functional>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"

namespace c8 {

struct OmniscopeFrame;

class OmniscopeProcessor {
public:
  // Construct a capture frame processor.
  // @param sharedContext The shared context for creating an offscreen context.
  // @param useExternalOesTexture When set to true, use GL_TEXTURE_EXTERNAL_OES texture to hold
  // incoming capture frames; otherwise, use GL_TEXTURE_2D texture.
  OmniscopeProcessor(void *sharedContext, bool useExternalOesTexture);
  ~OmniscopeProcessor();

  // Disallow moving because of custom destructor.
  OmniscopeProcessor(OmniscopeProcessor &&) = delete;
  OmniscopeProcessor &operator=(OmniscopeProcessor &&) = delete;

  // Disallow copying.
  OmniscopeProcessor(const OmniscopeProcessor &) = delete;
  OmniscopeProcessor &operator=(const OmniscopeProcessor &) = delete;

  // Create a source texture in RGBA8888 format for capture and return its handle.
  // The type of the texture created is either GL_TEXTURE_EXTERNAL_OES or GL_TEXTURE_2D depending on
  // useExternalOesTexture_. If this is called subsequent times, the previous texture will be
  // deleted and a new one allocated.
  // On Android, generally you'd call this once to create a GL_TEXTURE_EXTERNAL_OES texture when
  // setting up the Android capture pipeline and pass the result to the SurfaceTexture used for
  // capture.
  uint32_t createSourceTexture(int width, int height);

  // Process the new GL frame.
  // @param mtx A 4x4 texture coordinate transform matrix associated with the texture image, which
  // can be retrieved from SurfaceTexture on Android. Note that the matrix is stored in
  // *column-major* order so that it may be passed directly to glUniformMatrix4fv().
  // TODO(yuhsianghuang): Currently mtx is used only for GL_TEXTURE_EXTERNAL_OES texture. We may
  // need to extend it to support the GL_TEXTURE_2D use case.
  void processGlFrame(const float mtx[16], OmniscopeFrame &frame, OmniscopeView *view);

private:
  // OpenGL context.
  std::optional<OffscreenGlContext> ctx_;

  // Whether to use GL_TEXTURE_EXTERNAL_OES texture for capture. Use GL_TEXTURE_2D texture if false.
  bool useExternalOesTexture_ = true;
  // OpenGL texture used externally for capture in RGBA8888 format.
  GlTexture2D sourceTexture_;

  // Capture frame dimensions.
  int width_ = 0;
  int height_ = 0;

  // Compiled shader and sharder+cpu methods.
  std::function<void(const float mtx[16], GlTexture src, GlFramebufferObject *dest)>
    copyExternalOesTexture2D;
  std::function<void(GlTexture src, GlFramebufferObject *dest)> copyTexture2D;
};

}  // namespace c8
