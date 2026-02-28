// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "qrdetect-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:overlay-scene-manager",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//apps/client/internalqa/omniscope/native/lib/view-widgets:pose-widgets",
    "//c8:c8-log",
    "//c8:color",
    "//c8:hpoint",
    "//c8:string",
    "//c8:vector",
    "//c8/geometry:intrinsics",
    "//c8/geometry:vectors",
    "//c8/pixels:draw3-widgets",
    "//c8/pixels/opengl:gl-error",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/faces:face-detector-global",
    "//reality/engine/faces:face-geometry",
    "//third_party/mediapipe/models:face-detection-front-embedded",
  };
}
cc_end(0x94941d82);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/pose-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/qr/qrdetect-view.h"
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
#include "reality/engine/tracking/tracking-sensor-event.h"
#include "third_party/mediapipe/models/face-detection-front-embedded.h"

namespace c8 {

namespace {
class RenderData : public CpuProcessingResult {
public:
  GlTexture roiTex;
  Vector<DetectedRayPoints> globalFaces;
};

}  // namespace

void QrDetectView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (shader_ == nullptr) {
    shader_.reset(new FaceRoiShader());
    shader_->initialize();
    checkGLError("[faceglobal-view] shader_.initialize");
  }
  deviceK_ = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(appConfig_.deviceModel),
    appConfig_.captureWidth,
    appConfig_.captureHeight);
}

void QrDetectView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::faceRoiObject8Renderer<RenderData>(
    appConfig_,
    appConfig_.captureWidth + appConfig_.captureHeight,
    appConfig_.captureHeight,
    shader_.get());
}

void QrDetectView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &faceRoiProducer = data->producer<FaceRoiDataProducer>();

  auto &renderData = data->cpuProcessingResult<RenderData>();
  renderData = {};  // Clear previous data.
  renderData.roiTex = faceRoiProducer.renderer().dest();

  if (faceDetector_ == nullptr) {
    faceDetector_.reset(new FaceDetectorGlobal(
      embeddedFaceDetectionFrontTfliteData, embeddedFaceDetectionFrontTfliteSize));
  }

  auto globalFaces =
    faceDetector_->detectFaces(faceRoiProducer.renderer().result().faceDetectImage, deviceK_);
  for (const auto &f : globalFaces) {
    renderData.globalFaces.push_back(detectionToRaySpace(f));
  }
}

void QrDetectView::updateScene(OmniscopeViewData *data) {
  auto &renderData = data->cpuProcessingResult<RenderData>();
  auto &roiScene = scene().find<Scene>("roi-view");
  auto &cameraScene = scene().find<Scene>("camera-view");

  roiScene.find<Renderable>("roi").material().colorTexture()->setNativeId(renderData.roiTex.id());

  ///////////// Camera View Update //////////////
  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  updateDetections(renderData.globalFaces, &cameraScene, &detections_);
}

void QrDetectView::resetScene() {
  // noop
}

void QrDetectView::renderDisplay(OmniscopeViewData *data) {
  ScopeTimer t("render-display");

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

void QrDetectView::gotTouches(const Vector<Touch> &touches) {
  if (touches.size() == 2) {
    resetScene();
    return;
  }
}

void QrDetectView::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  renderer_ = std::make_unique<Renderer>();
  initRoiAndCameraScene(&scene(), deviceK_, 640);
}

bool QrDetectView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;
}

}  // namespace c8
