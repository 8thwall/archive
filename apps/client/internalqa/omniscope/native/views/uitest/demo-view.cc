// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "demo-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:overlay-scene-manager",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//c8:c8-log",
    "//c8:string",
    "//c8/geometry:device-pose",
    "//c8/stats:scope-timer",
  };
}
cc_end(0x094987cd);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/uitest/demo-view.h"
#include "c8/c8-log.h"
#include "c8/geometry/device-pose.h"
#include "c8/stats/scope-timer.h"

namespace c8 {

namespace {
class RenderData : public CpuProcessingResult {
public:
  HMatrix extrinsic = HMatrixGen::i();
};
}  // namespace

void DemoView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  sceneManager_.configure(
    appConfig_,
    scenePtr(),
    [this]() { this->initializeScene(); },
    [this](OmniscopeViewData *data) { this->updateScene(data); });

  controlPanelConfig()["Checkbox"] =
    ControlPanelElement::checkBox("Checkbox", true, "This is a tooltip");
  controlPanelConfig()["Slider"] = ControlPanelElement::slider("Slider", .5f, "", -1.f, 5.f);
  controlPanelConfig()["InputSlider"] =
    ControlPanelElement::inputSlider("InputSlider", .8, "Double click me the input area to edit");
  controlPanelConfig()["RadioButton"] =
    ControlPanelElement::radioButton("RadioButton", 2, {"a", "b", "c"});
}

void DemoView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::sceneRenderer<RenderData>(
    appConfig_, appConfig_.captureWidth, appConfig_.captureHeight);
}

void DemoView::processCpu(OmniscopeViewData *viewData) {
  ScopeTimer t("process-uitest-demo");
  auto &data = viewData->cpuProcessingResult<RenderData>();

  data.extrinsic = xrRotationFromDeviceRotation(viewData->devicePose()).toRotationMat();
}

void DemoView::renderDisplay(OmniscopeViewData *data) {
  ScopeTimer t("render-uitest-demo");
  sceneManager_.renderDisplay(data);
}

void DemoView::updateScene(OmniscopeViewData *data) {
  scene().find<Camera>().setLocal(data->cpuProcessingResult<RenderData>().extrinsic);
}

void DemoView::initializeScene() {
  // Create a flat plane below the camera, and set its corner colors.
  auto quadPos =
    HMatrixGen::translateY(-1.0f) * HMatrixGen::xDegrees(90.0f) * HMatrixGen::scale(2.0f);
  auto &quad = scene().add(ObGen::positioned(ObGen::quad(), quadPos));
  quad.geometry().setColors({Color::PURPLE, Color::CHERRY, Color::MINT, Color::MANGO});
}

void DemoView::gotTouches(const Vector<Touch> &touches) {
  sceneManager_.gotTouches(touches);
}

}  // namespace c8
