// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "gpu-frame-processor.h",
  };
  deps = {
    ":pipeline-frame",
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
cc_end(0xcfd47210);

#include "c8/c8-log.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/opengl/gl-pixel-buffer.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "reality/app/pipeline/native/gpu-frame-processor.h"
#include "reality/app/pipeline/native/pipeline-frame.h"

namespace c8 {

GpuFrameProcessor::GpuFrameProcessor(void *sharedContext)
    : ctx_(OffscreenGlContext::createRGBA8888Context(sharedContext)),
      externalSrcTex_(nullptr),
      width_(0),
      height_(0) {
  C8Log("%s", "[gpu-frame-processor] Created EGL Context");
  copyExternalOesTexture2D = compileCopyExternalOesTexture2D();
  checkGLError("[gpu-frame-processor] compileCopyExternalOesTexture2D");
}

GpuFrameProcessor::~GpuFrameProcessor() {
  C8Log("%s", "[gpu-frame-processor] Destroying EGL Context");
}

uint32_t GpuFrameProcessor::createSourceTexture(int width, int height) {
  if (width == width_ && height == height_) {
    // Don't rebuild if not needed.
    return externalSrcTex_.id();
  }
  width_ = width;
  height_ = height;
  externalSrcTex_ = makeExternalTexture2D(width, height);
  checkGLError("[gpu-frame-processor] makeExternalTexture2D");
  return externalSrcTex_.id();
}

void GpuFrameProcessor::processGlFrame(
  const float mtx[16], PipelineFrame &frame, PipelineView *view) {

  ScopeTimer t("process-gl-frame");

  {
    ScopeTimer t1("gpu-proc");
    // Copy the high-res texture from the camera. Mtx ensures that the external source texture is
    // rotated to a portrait-facing orientation.
    copyExternalOesTexture2D(mtx, externalSrcTex_.tex(), &frame.displayRgba);
  }
  checkGLError("[gpu-frame-processor] copyExternalOesTexture2D");

  view->drawGl(frame.frame);
  checkGLError("[gpu-frame-processor] view->drawGl");

  view->readGl(frame.frame.viewData.get());
  checkGLError("[gpu-frame-processor] view->readGl");
}

}  // namespace c8
