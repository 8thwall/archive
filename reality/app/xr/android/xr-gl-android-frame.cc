// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"xr-gl-android-frame.h"};
  deps = {
    "//c8:c8-log",
    "//c8/io:capnp-messages",
    "//c8/pixels/opengl:gl-framebuffer",
    "//c8/pixels:pixel-buffer",
    "//reality/engine/api:reality.capnp-cc",
    "//reality/engine/features:gl-reality-frame",
  };
}
cc_end(0x130fe0d7);

#include "reality/app/xr/android/xr-gl-android-frame.h"

#include "c8/c8-log.h"

namespace c8 {

XrGlAndroidFrame::XrGlAndroidFrame(
  int captureWidth,
  int captureHeight,
  XrGlAndroidFrameOutput output_,
  int yuvWidth,
  int yuvHeight,
  Gr8FeatureShader *gr8Shader)
    : output(output_) {
  // We always process images in portrait orientation.
  if (captureWidth > captureHeight) {
    std::swap(captureWidth, captureHeight);
  }
  if (yuvWidth > yuvHeight) {
    std::swap(yuvWidth, yuvHeight);
  }

  displayRgba.initialize(
    makeLinearRGBA8888Texture2D(captureWidth, captureHeight),
    GL_FRAMEBUFFER,
    GL_COLOR_ATTACHMENT0);
  if (output == XrGlAndroidFrameOutput::OUTPUT_YUV) {
    processingY = std::move(YPlanePixelBuffer(yuvHeight, yuvWidth));
    processingUV = std::move(UVPlanePixelBuffer(yuvHeight / 2, yuvWidth / 2));
  } else if (output == XrGlAndroidFrameOutput::OUTPUT_GR8_PYRAMID) {
    pyramid.initialize(
      gr8Shader,
      captureWidth,
      captureHeight,
      0 /* displayRgba will always be pre-rotated to portrait */);
  }
}

}  // namespace c8
