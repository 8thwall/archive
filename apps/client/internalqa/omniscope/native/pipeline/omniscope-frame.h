// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// An OmniscopeFrame is a set of texture data, image data, and reality data corresponding to a
// single image frame.

#pragma once

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/pixels/opengl/gl-framebuffer.h"

namespace c8 {

// A list of the XR processing stages run on independent threads.
enum class OmniscopeFrameStage {
  CAPTURE_AND_PROCESS_GPU = 0,
  PROCESS_CPU = 1,
  RENDER = 2,
};

// The state data required for capture, process, and render on each camera frame.
struct OmniscopeFrame {
  OmniscopeFrame(int captureWidth, int captureHeight);

  // Default move constructors.
  OmniscopeFrame(OmniscopeFrame &&) = default;
  OmniscopeFrame &operator=(OmniscopeFrame &&) = default;

  // Disallow copying.
  OmniscopeFrame(const OmniscopeFrame &) = delete;
  OmniscopeFrame &operator=(const OmniscopeFrame &) = delete;

  // An RGBA Framebuffer and Texture used for rendering to the display.
  GlFramebufferObject displayRgba;
  FrameInput frame;
};

}  // namespace c8
