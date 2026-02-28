// Copyright (c) 2019 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "omniscope-processor.h",
  };
  visibility = {
    "//visibility:__pkg__",
  };
  deps = {
    ":omniscope-frame",
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//c8:c8-log",
    "//c8/pixels/opengl:gl-error",
    "//c8/pixels/opengl:gl-framebuffer",
    "//c8/pixels/opengl:gl-texture",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/stats:scope-timer",
  };
}
cc_end(0x11566d36);

#include "apps/client/internalqa/omniscope/native/pipeline/omniscope-frame.h"
#include "apps/client/internalqa/omniscope/native/pipeline/omniscope-processor.h"
#include "c8/c8-log.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/stats/scope-timer.h"

namespace c8 {

OmniscopeProcessor::OmniscopeProcessor(void *sharedContext, bool useExternalOesTexture)
    : useExternalOesTexture_(useExternalOesTexture),
      sourceTexture_(nullptr),
      width_(0),
      height_(0) {
  if (sharedContext != nullptr) {
    ctx_ = OffscreenGlContext::createRGBA8888Context(sharedContext);
    C8Log("[omniscope-processor] Created GL Context");
  }

  if (useExternalOesTexture_) {
    copyExternalOesTexture2D = compileCopyExternalOesTexture2D();
    checkGLError("[omniscope-processor] copyExternalOesTexture2D");
  } else {
    copyTexture2D = compileCopyTexture2D();
    checkGLError("[omniscope-processor] copyTexture2D");
  }
}

OmniscopeProcessor::~OmniscopeProcessor() {
  if (ctx_.has_value()) {
    C8Log("[omniscope-processor] Destroying GL Context");
  }
}

uint32_t OmniscopeProcessor::createSourceTexture(int width, int height) {
  if (width == width_ && height == height_) {
    // Don't rebuild if not needed.
    return sourceTexture_.id();
  }
  width_ = width;
  height_ = height;

  if (useExternalOesTexture_) {
    sourceTexture_ = makeExternalTexture2D(width, height);
    checkGLError("[omniscope-processor] makeExternalTexture2D");
  } else {
    sourceTexture_ = makeLinearRGBA8888Texture2D(width, height);
    checkGLError("[omniscope-processor] makeLinearRGBA8888Texture2D");
  }
  return sourceTexture_.id();
}

void OmniscopeProcessor::processGlFrame(
  const float mtx[16], OmniscopeFrame &frame, OmniscopeView *view) {
  ScopeTimer t("process-gl-frame");

  {
    ScopeTimer t1("gpu-proc");
    if (useExternalOesTexture_) {
      // Copy the high-res texture from the camera. Mtx ensures that the external source texture is
      // rotated to a portrait-facing orientation.
      copyExternalOesTexture2D(mtx, sourceTexture_.tex(), &frame.displayRgba);
      checkGLError("[omniscope-processor] copyExternalOesTexture2D");
    } else {
      copyTexture2D(sourceTexture_.tex(), &frame.displayRgba);
      checkGLError("[omniscope-processor] copyTexture2D");
    }
  }

  view->drawGl(frame.frame);
  checkGLError("[omniscope-processor] view->drawGl");

  view->readGl(frame.frame.viewData.get());
  checkGLError("[omniscope-processor] view->readGl");
}

}  // namespace c8
