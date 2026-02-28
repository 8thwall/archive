// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"omniscope-frame.h"};
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//c8:c8-log",
    "//c8/pixels/opengl:gl-error",
    "//c8/pixels/opengl:gl-framebuffer",
  };
}
cc_end(0x6b180737);

#include "apps/client/internalqa/omniscope/native/pipeline/omniscope-frame.h"
#include "c8/c8-log.h"
#include "c8/pixels/opengl/gl-error.h"

namespace c8 {

OmniscopeFrame::OmniscopeFrame(int captureWidth, int captureHeight) {
  // We always process images in portrait orientation.
  if (captureWidth > captureHeight) {
    std::swap(captureWidth, captureHeight);
  }

  displayRgba = makeLinearRGBA8888Framebuffer(captureWidth, captureHeight);
  checkGLError("[omniscope-frame] Initialize displayRgba");
}

}  // namespace c8
