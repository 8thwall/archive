// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetpyramid-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//c8:c8-log",
    "//c8:color",
    "//c8:string",
    "//c8:vector",
    "//c8/pixels/opengl:gl-framebuffer",
    "//c8/pixels/opengl:gl-texture",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels:pixel-buffer",
    "//c8/stats:scope-timer",
    "//reality/engine/features:gl-reality-frame",
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
  };
}
cc_end(0xd936b4d9);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetpyramid-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/stats/scope-timer.h"

namespace c8 {
void ImageTargetPyramidView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  srcName_ = appConfig_.imageTargets->begin()->first;
}

void ImageTargetPyramidView::initialize(
  std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr =
    ViewDataGen::canvasOnly(appConfig_, GlRealityFrame::pyrSize(), GlRealityFrame::pyrSize());
}

void ImageTargetPyramidView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("draw-feat-gl");

  auto cp = data->renderer<PixelBufferTextureRenderer>().displayBuf();
  fill(Color::BLACK, cp);

  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    return;
  }
  auto &im = appConfig_.imageTargets->at(srcName_);

  drawPyramidChannel(im.gl().pyramid(), 0, cp);
}

void ImageTargetPyramidView::gotTouches(const Vector<Touch> &touches) {
  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    srcName_ = "";
    return;
  }
  srcName_ = appConfig_.getNextImageTargetName(srcName_);
}

}  // namespace c8
