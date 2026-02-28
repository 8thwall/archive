// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// An XrGlAndroidFrame is a set of texture data, image data, and reality data corresponding to a
// single image frame.

#pragma once

#include "c8/io/capnp-messages.h"
#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/pixel-buffer.h"
#include "reality/engine/api/reality.capnp.h"
#include "reality/engine/features/gl-reality-frame.h"

namespace c8 {

// A list of the XR processing stages run on independent threads.
enum class XrGlAndroidFrameStage {
  CAPTURE_AND_PROCESS_GPU = 0,
  PROCESS_CPU = 1,
  RENDER = 2,
};

enum class XrGlAndroidFrameOutput {
  UNSPECIFIED_OUTPUT = 0,
  OUTPUT_YUV = 1,
  OUTPUT_GR8_PYRAMID = 2,
};

// The state data required for capture, process, and render on each camera frame.
struct XrGlAndroidFrame {
  XrGlAndroidFrame(
    int captureWidth,
    int captureHeight,
    XrGlAndroidFrameOutput output,
    int yuvWidth,
    int yuvHeight,
    Gr8FeatureShader *gr8Shader);

  // Default move constructors.
  XrGlAndroidFrame(XrGlAndroidFrame &&) = default;
  XrGlAndroidFrame &operator=(XrGlAndroidFrame &&) = default;

  // Disallow copying.
  XrGlAndroidFrame(const XrGlAndroidFrame &) = delete;
  XrGlAndroidFrame &operator=(const XrGlAndroidFrame &) = delete;

  // An RGBA Framebuffer and Texture used for rendering to the display.
  GlFramebufferObject displayRgba;

  // The reality request corresponding to this frame.
  ConstRootMessage<RealityRequest> realityRequest;

  // The reality response corresponding to this frame.
  ConstRootMessage<RealityResponse> realityResponse;

  // Specifies the type of output that's created for processing.
  XrGlAndroidFrameOutput output;

  // Processing outputs that are set when OUTPUT_YUV is requested.
  YPlanePixelBuffer processingY;
  UVPlanePixelBuffer processingUV;

  // Processing outputs that are set when OUTPUT_GR8_PYRAMID is requested.
  GlRealityFrame pyramid;
};

}  // namespace c8
