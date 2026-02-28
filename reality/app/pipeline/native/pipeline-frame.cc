// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"pipeline-frame.h"};
  deps = {
    "//c8:c8-log",
    "//c8/camera:device-infos",
    "//c8/io:capnp-messages",
    "//c8/pixels/opengl:gl-framebuffer",
    "//c8/pixels:pixel-buffer",
    "//reality/engine/api:reality.capnp-cc",
    "//reality/engine/features:gl-reality-frame",
  };
}
cc_end(0xcfa8444d);

#include "c8/c8-log.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/stats/scope-timer.h"
#include "reality/app/pipeline/native/pipeline-frame.h"

namespace c8 {

PipelineFrame::PipelineFrame(int captureWidth, int captureHeight) {
  // We always process images in portrait orientation.
  if (captureWidth > captureHeight) {
    std::swap(captureWidth, captureHeight);
  }

  displayRgba = makeLinearRGBA8888Framebuffer(captureWidth, captureHeight);
  checkGLError("[omniscope-frame] Initialize displayRgba");
}

// Processing. By default omniscope views delegate to their data providers for these functions,
// but they can override this behavior if needed.
void PipelineView::drawGl(FrameState &in) { in.viewData->drawGl(in.frameData); }

void PipelineView::readGl(PipelineViewData *viewData) { viewData->readGl(); }

void PipelineView::renderDisplay(PipelineViewData *viewData) { viewData->renderDisplay(); }

PipelineViewData *PipelineViewData::setRenderer(std::unique_ptr<GpuSceneRenderer> &&renderer) {
  renderer_ = std::move(renderer);
  return this;
}

PipelineViewData *PipelineViewData::setCpuResult(std::unique_ptr<CpuResult> &&cpuProcessingResult) {
  cpuProcessingResult_ = std::move(cpuProcessingResult);
  return this;
}

void PipelineViewData::drawGl(FrameInputData &in) {
  frameDataCopy_.cameraTexture = in.cameraTexture;
  frameDataCopy_.request = ConstRootMessage<RealityRequest>(in.request.reader());
  frameDataCopy_.response = ConstRootMessage<RealityResponse>(in.response.reader());

  {
    ScopeTimer t("draw-gl");
    for (auto &p : producers_) {
      p.second->drawGl(in);
    }
  }
}

void PipelineViewData::readGl() {
  ScopeTimer t("read-gl");
  for (auto &p : producers_) {
    p.second->readGl();
  }
}

void PipelineViewData::renderDisplay() { renderer_->renderDisplay(); }

}  // namespace c8
