// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "devicepose-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:overlay-scene-manager",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//c8:c8-log",
    "//c8:string",
    "//c8/geometry:device-pose",
    "//c8/pixels:draw3-widgets",
    "//c8/stats:scope-timer",
  };
}
cc_end(0x553cc7be);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/sensors/devicepose-view.h"
#include "c8/c8-log.h"
#include "c8/geometry/device-pose.h"
#include "c8/pixels/draw3-widgets.h"
#include "c8/stats/scope-timer.h"

namespace c8 {

namespace {
class RenderData : public CpuProcessingResult {
public:
  HMatrix extrinsic = HMatrixGen::i();
};
}  // namespace

void DeviceposeView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  sceneManager_.configure(
    appConfig_,
    scenePtr(),
    [this]() { this->initializeScene(); },
    [this](OmniscopeViewData *data) { this->updateScene(data); });
}

void DeviceposeView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::sceneRenderer<RenderData>(
    appConfig_, appConfig_.captureWidth, appConfig_.captureHeight);
}

void DeviceposeView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  data->cpuProcessingResult<RenderData>().extrinsic =
    xrRotationFromDeviceRotation(data->devicePose()).toRotationMat();
}
void DeviceposeView::initializeScene() {
  // Add directionally colored floor visualization.
  scene().add(ObGen::positioned(groundPointGrid(7, 1.0f), HMatrixGen::translateY(-1.0f)));
}

void DeviceposeView::updateScene(OmniscopeViewData *data) {
  scene().find<Camera>().setLocal(data->cpuProcessingResult<RenderData>().extrinsic);
}

void DeviceposeView::renderDisplay(OmniscopeViewData *data) {
  ScopeTimer t("render-display");
  sceneManager_.renderDisplay(data);
}

void DeviceposeView::gotTouches(const Vector<Touch> &touches) {
  sceneManager_.gotTouches(touches);
}

}  // namespace c8
