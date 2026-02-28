// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "pyramid-view.h",
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
cc_end(0x45af1b9b);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/features/pyramid-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/stats/scope-timer.h"

namespace c8 {
void PyramidView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void PyramidView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::featuresOnlyCanvas(appConfig_, glShader_.get());
}

void PyramidView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("draw-feat-gl");
  drawPyramidChannel(
    data->producer<FeaturesDataProducer>().pyramid(),
    channel_,
    data->renderer<PixelBufferTextureRenderer>().displayBuf());
}

void PyramidView::gotTouches(const Vector<Touch> &touches) { channel_ = (channel_ + 1) % 4; }

}  // namespace c8
