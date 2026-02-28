// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "camera-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//c8:c8-log",
    "//c8/pixels/opengl:gl-texture",
  };
}
cc_end(0xe715462b);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/sensors/camera-view.h"
#include "c8/pixels/opengl/gl-texture.h"

namespace c8 {

void CameraView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
}

void CameraView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::rawCameraTextrue(appConfig_);
}

void CameraView::drawGl(FrameInput &in) {
  auto &viewData = in.viewData;
  viewData->renderer<RawTextureRenderer>().setDisplayTex(
    in.frameData.cameraBuffer,
    wrapRGBA8888Texture(
    in.frameData.cameraTexture, viewData->captureWidth(), viewData->captureHeight()));
}

}  // namespace c8
