// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Android-specific OpenGL for 8th Wall XR.

#pragma once

#include <functional>

#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/opengl/gl-pixel-buffer.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-buffer.h"
#include "reality/engine/features/gl-reality-frame.h"

namespace c8 {

struct XrGlAndroidFrame;

class XrGlAndroidProcessor {
public:
  XrGlAndroidProcessor(void* sharedContext = nullptr);
  ~XrGlAndroidProcessor();

  // Disallow moving because of custom destructor.
  XrGlAndroidProcessor(XrGlAndroidProcessor &&) = delete;
  XrGlAndroidProcessor &operator=(XrGlAndroidProcessor &&) = delete;

  // Disallow copying.
  XrGlAndroidProcessor(const XrGlAndroidProcessor &) = delete;
  XrGlAndroidProcessor &operator=(const XrGlAndroidProcessor &) = delete;

  // Create the EXTERNAL_OES_TEXTURE source texture and return a handle. If this is called
  // subsequent times, the previous texture will be deleted and a new one allocated. Generally you'd
  // call this once when creating the Android capture pipeline and pass the result to the
  // SurfaceTexture used for capture.
  uint32_t createSourceTexture(int width, int height);

  // Process the new GL frame. The call supplies a 4x4 texture coordinate transform matrix
  // associated with the texture image as described in android.graphics.SurfaceTexture. The matrix
  // is stored in *column-major* order so that it may be passed directly to glUniformMatrix4fv.
  void processGlFrame(const float mtx[16], XrGlAndroidFrame& frame);

  // Get the gr8 shader, initializing it if needed. It's possible that we won't need this, so we
  // shouldn't always compile the shader.
  Gr8FeatureShader *gr8Shader() {
    if (glShader_ == nullptr) {
      glShader_.reset(new Gr8FeatureShader());
      glShader_->initialize();
    }
    return glShader_.get();
  }

private:
  // OpenGL context.
  OffscreenGlContext ctx_;

  // External OES Texture used externally for capture, of type
  GlTexture2D externalSrcTex_;

  // Framebuffer to render YUVA444 data.
  GlFramebufferObject yuva444Framebuffer_;

  // PixelBuffer for accessing YUVA444 data.
  GlYUVA8888PlanePixelBuffer yuva444PixelBuffer_;

  int width_ = 0;
  int height_ = 0;

  // Compiled shader and sharder+cpu methods.
  std::function<void(const float mtx[16], GlTexture src, GlFramebufferObject *dest)>
    copyExternalOesTexture2D;
  std::function<void(GlTexture src, GlFramebufferObject *dest)> convertTextureRGBToYUV;
  std::unique_ptr<Gr8FeatureShader> glShader_;
};

}  // namespace c8
