// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetgravitywarp-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//c8:c8-log",
    "//c8:hmatrix",
    "//c8/geometry:device-pose",
    "//c8/geometry:intrinsics",
    "//c8/pixels/opengl:texture-transforms",
    "//reality/engine/geometry:image-warp",
  };
}
cc_end(0x7aa6f9a4);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetgravitywarp-view.h"
#include "c8/c8-log.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/intrinsics.h"
#include "reality/engine/geometry/image-warp.h"

namespace c8 {

ImageTargetGravityWarpView::ImageTargetGravityWarpView() { warpTexture_ = compileWarpTexture2D(); }

void ImageTargetGravityWarpView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
}

void ImageTargetGravityWarpView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  auto *viewData = new OmniscopeViewData(appConfig_);
  viewData->addProducer(std::make_unique<GravityWarpProducer>(appConfig_, &warpTexture_))
    ->setRenderer(
      std::make_unique<RawTextureRenderer>(appConfig_.captureWidth, appConfig_.captureHeight));
  viewData->renderer<RawTextureRenderer>().setDisplayTex(
    viewData->producer<GravityWarpProducer>().displayBuffer(),
    viewData->producer<GravityWarpProducer>().displayTex());

  dataPtr.reset(viewData);
};

void ImageTargetGravityWarpView::drawGl(FrameInput &in) {
  auto &data = in.viewData;
  data->producer<GravityWarpProducer>().setWarpType(
    static_cast<GravityWarpProducer::WarpType>(clickNum_ % 3));
  data->drawGl(in.frameData);
}

void ImageTargetGravityWarpView::gotTouches(const Vector<Touch> &touches) { ++clickNum_; }

}  // namespace c8
