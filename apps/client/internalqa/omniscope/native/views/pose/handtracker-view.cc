// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "handtracker-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:overlay-scene-manager",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//apps/client/internalqa/omniscope/native/lib/view-widgets:pose-widgets",
    "//c8:c8-log",
    "//c8:color",
    "//c8:hpoint",
    "//c8/geometry:vectors",
    "//c8:string",
    "//c8:vector",
    "//c8/geometry:intrinsics",
    "//c8/pixels:draw3-widgets",
    "//c8/pixels/opengl:gl-error",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/hands:hand-tracker",
    "//reality/engine/faces:face-geometry",
    "//third_party/mediapipe/models:palm-detection-embedded",
    "//third_party/mediapipe/models:hand-landmark-embedded",
  };
}
cc_end(0x93b1693d);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/pose-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/pose/handtracker-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/vectors.h"
#include "c8/hpoint.h"
#include "c8/pixels/draw3-widgets.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "c8/string/join.h"
#include "reality/engine/faces/face-geometry.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/tracking/tracking-sensor-event.h"
#include "third_party/mediapipe/models/hand-landmark-embedded.h"
#include "third_party/mediapipe/models/palm-detection-embedded.h"

namespace c8 {

namespace {
class RenderData : public CpuProcessingResult {
public:
  GlTexture roiTex;
  Vector<Hand3d> trackedHands;
};

}  // namespace

void HandTrackerView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (shader_ == nullptr) {
    shader_.reset(new FaceRoiShader());
    shader_->initialize();
    checkGLError("[handtracker-view] shader_.initialize");
  }
  deviceK_ = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(appConfig_.deviceModel),
    appConfig_.captureWidth,
    appConfig_.captureHeight);
}

void HandTrackerView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::handRoiObject8Renderer<RenderData>(
    appConfig_,
    appConfig_.captureWidth + appConfig_.captureHeight,
    appConfig_.captureHeight,
    HAND_LANDMARK_DETECTION_INPUT_SIZE,
    handRenderer_,
    shader_.get());
}

void HandTrackerView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &handRoiProducer = data->producer<HandRoiDataProducer>();

  auto &renderData = data->cpuProcessingResult<RenderData>();
  renderData = {};  // Clear previous data.
  renderData.roiTex = handRoiProducer.renderer().dest();

  const auto &handRenderResult = handRoiProducer.renderer().result();

  if (tracker_ == nullptr) {
    tracker_.reset(new HandTracker());
    tracker_->setPalmDetectModel(
      embeddedPalmDetectionLiteTfliteData, embeddedPalmDetectionLiteTfliteSize);
    tracker_->setHandDetectModel(
      embeddedHandLandmarkLiteTfliteData, embeddedHandLandmarkLiteTfliteSize);
  }

  // Run hand tracking and save result for rendering.
  auto result = tracker_->track(handRenderResult, deviceK_);
  renderData.trackedHands = *result.handData;

  // Set the next ROI from local hands if possible, or global hands otherwise.
  handRoiProducer.renderer().setDetectedHands(
    result.localHands->empty() ? *result.globalHands : *result.localHands);
}

void HandTrackerView::updateScene(OmniscopeViewData *data) {
  auto &renderData = data->cpuProcessingResult<RenderData>();
  auto &roiScene = scene().find<Scene>("roi-view");
  auto &cameraScene = scene().find<Scene>("camera-view");

  roiScene.find<Renderable>("roi").material().colorTexture()->setNativeId(renderData.roiTex.id());

  ///////////// Camera View Update //////////////
  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  updateHandMeshes(renderData.trackedHands, &cameraScene, &renderedHands_, deviceK_);
}

void HandTrackerView::resetScene() {
  // noop
}

void HandTrackerView::renderDisplay(OmniscopeViewData *data) {
  ScopeTimer t("hand-tracker-render-display");

  initializeScene(data);  // Create the scene if needed.

  // Check if there is a new frame, or if the user input changed the result.
  if (!updateSceneWithUserInput() && lastFrameTime_ == data->timeNanos()) {
    return;  // Nothing to rerender.
  }

  lastFrameTime_ = data->timeNanos();

  updateScene(data);

  // Render the scene.
  data->renderer<Object8Renderer>().render(*renderer_, scene());
}

void HandTrackerView::gotTouches(const Vector<Touch> &touches) {
  if (touches.size() == 2) {
    resetScene();
    return;
  }
}

void HandTrackerView::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  renderer_ = std::make_unique<Renderer>();
  initRoiAndCameraScene(&scene(), deviceK_, 640);
}

bool HandTrackerView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;
}

}  // namespace c8
