// Copyright (c) 2019 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "xr-gl-android-processor.h",
  };
  visibility = {
    "//visibility:__pkg__",
  };
  deps = {
    ":xr-gl-android-frame",
    "//c8:c8-log",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels/opengl:gl-headers",
    "//c8/pixels/opengl:gl-pixel-buffer",
    "//c8/pixels/opengl:gl-framebuffer",
    "//c8/pixels/opengl:gl-texture",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/stats:scope-timer",
    "//reality/engine/features:gl-reality-frame",
  };
}
cc_end(0x5a1d78d0);

#ifdef ANDROID

#include "reality/app/xr/android/xr-gl-android-processor.h"

#include "c8/c8-log.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/pixels/opengl/gl-pixel-buffer.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "reality/app/xr/android/xr-gl-android-frame.h"
#include "c8/stats/scope-timer.h"

namespace c8 {

XrGlAndroidProcessor::XrGlAndroidProcessor(void *sharedContext)
    : ctx_(OffscreenGlContext::createRGBA8888Context(sharedContext)),
      externalSrcTex_(nullptr),
      yuva444Framebuffer_(nullptr),
      yuva444PixelBuffer_(),
      width_(0),
      height_(0) {
  C8Log("%s", "[xr-gl-android-processor] Created EGL Context");
  copyExternalOesTexture2D = compileCopyExternalOesTexture2D();
  convertTextureRGBToYUV = compileConvertTextureRGBToYUV();
}

XrGlAndroidProcessor::~XrGlAndroidProcessor() {
  C8Log("%s", "[xr-gl-android-processor] Destroying EGL Context");
}

uint32_t XrGlAndroidProcessor::createSourceTexture(int width, int height) {
  if (width == width_ && height == height_) {
    // Don't rebuild if not needed.
    return externalSrcTex_.id();
  }
  width_ = width;
  height_ = height;
  externalSrcTex_ = makeExternalTexture2D(width, height);
  return externalSrcTex_.id();
}

void XrGlAndroidProcessor::processGlFrame(
  const float mtx[16], XrGlAndroidFrame &frame) {

  if (yuva444Framebuffer_.id() == 0 && frame.output == XrGlAndroidFrameOutput::OUTPUT_YUV) {
    const auto &procY = frame.processingY.pixels();
    const int width = procY.cols();
    const int height = procY.rows();
    C8Log("[xr-gl-android-processor] Initialize yuva444 buffer %d %d", width, height);
    // Initialize the framebuffer and pixelbuffer on first run. It is an error if the size of the
    // frame processing buffer changes across the lifetime of this class.
    yuva444Framebuffer_ = GlFramebufferObject();
    yuva444Framebuffer_.initialize(
      makeLinearRGBA8888Texture2D(width, height), GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0);
    yuva444PixelBuffer_ = GlYUVA8888PlanePixelBuffer(height, width, width * 4);
  }

  ScopeTimer t("process-gl-frame");

  {
    ScopeTimer t1("gpu-proc");
    // Copy the high-res texture from the camera. Mtx ensures that the external source texture is
    // rotated to a portrait-facing orientation.
    copyExternalOesTexture2D(mtx, externalSrcTex_.tex(), &frame.displayRgba);

    if (frame.output == XrGlAndroidFrameOutput::OUTPUT_YUV) {
      // Create the YUV processing texture.
      convertTextureRGBToYUV(frame.displayRgba.tex().tex(), &yuva444Framebuffer_);
      // Read the YUV bytes from GPU -> CPU.
      readFramebufferYUVAToPixelBuffer(yuva444Framebuffer_, &yuva444PixelBuffer_);
    } else if (frame.output == XrGlAndroidFrameOutput::OUTPUT_GR8_PYRAMID
      && !frame.realityRequest.reader().getSensors().hasARCore()) {
      frame.pyramid.draw(
        frame.displayRgba.tex().tex().id(),
        GlRealityFrame::Options::READ_IMMEDIATELY);
    }
  }

  if (frame.output == XrGlAndroidFrameOutput::OUTPUT_YUV) {
    ScopeTimer t1("yuv444-to-yuv420");

    // Map the pixel buffer.
    yuva444PixelBuffer_.bind();
    yuva444PixelBuffer_.map();

    // Convert YUV444 to YUV420 (Planar).
    auto yPix = frame.processingY.pixels();
    auto uvPix = frame.processingUV.pixels();
    yuvToPlanarYuv(yuva444PixelBuffer_.pixels(), &yPix, &uvPix);

    // Unmap the pixel buffer.
    yuva444PixelBuffer_.unmap();
    yuva444PixelBuffer_.unbind();
  }

  /**
   * Calling glFlush to force the texture to be synced with the data previously written.
   * This will ensure that the reader will render the appropriate frame, and not one that
   * was previously written. Without this, you'll occasionally see old frames rendered
   * instead of new ones.
   */
  glFlush();
}

}  // namespace c8

#endif  // ANDROID
