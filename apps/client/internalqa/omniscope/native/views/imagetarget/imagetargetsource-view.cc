// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetsource-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//c8:c8-log",
    "//c8:color",
    "//c8:string",
    "//c8:vector",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/stats:scope-timer",
    "//c8/string:format",
  };
}
cc_end(0x4c8414b1);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetsource-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"

namespace c8 {

void ImageTargetSourceView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  srcName_ = appConfig_.imageTargets->begin()->first;
}

void ImageTargetSourceView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::canvasOnly(appConfig_, 480, 640);
}

void ImageTargetSourceView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");

  // Draw features onto texture.
  auto cp = data->renderer<PixelBufferTextureRenderer>().displayBuf();
  fill(Color::BLACK, cp);

  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    return;
  }
  const auto &im = appConfig_.imageTargets->at(srcName_);
  const auto &feats = im.framePoints();

  // Copy pixels of the source image.
  copyPixels(im.previewPix(), &cp);
  drawFeatures(feats, cp, false, im.rotateFeatures(), im.previewPix().cols());

  auto k = im.framePoints().intrinsic();
  Vector<String> text = {
    format("%d Features", feats.points().size()),
    "K: {",
    format("  w: %d, h: %d,", k.pixelsWidth, k.pixelsHeight),
    format("  cx: %5.1f, cy: %5.1f", k.centerPointX, k.centerPointY),
    format("  fx: %5.1f, fy: %5.1f }", k.focalLengthHorizontal, k.focalLengthVertical),
  };
  textBox(text, {15.0f, 10.0f}, 300, cp);
}

void ImageTargetSourceView::gotTouches(const Vector<Touch> &touches) {
  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    srcName_ = "";
    return;
  }
  srcName_ = appConfig_.getNextImageTargetName(srcName_);
}

}  // namespace c8
