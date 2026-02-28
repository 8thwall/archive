// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "facelocal-view.h",
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
    "//reality/engine/faces:face-detector-global",
    "//reality/engine/faces:face-detector-local",
    "//reality/engine/faces:face-geometry",
    "//third_party/mediapipe/models:face-detection-front-embedded",
    "//third_party/mediapipe/models:face-landmark-attention-embedded",
  };
}
cc_end(0x62047b96);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/pose-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/pose/facelocal-view.h"
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
#include "third_party/mediapipe/models/face-landmark-attention-embedded.h"

namespace c8 {

namespace {
class RenderData : public CpuProcessingResult {
public:
  GlTexture roiTex;
  Vector<DetectedRayPoints> localFaces;
};

}  // namespace

void FaceLocalView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (shader_ == nullptr) {
    shader_.reset(new FaceRoiShader());
    shader_->initialize();
    checkGLError("[facelocal-view] shader_.initialize");
  }
  deviceK_ = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(appConfig_.deviceModel),
    appConfig_.captureWidth,
    appConfig_.captureHeight);
}

void FaceLocalView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::faceRoiObject8Renderer<RenderData>(
    appConfig_,
    appConfig_.captureWidth + appConfig_.captureHeight,
    appConfig_.captureHeight,
    shader_.get());
}

void FaceLocalView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &faceRoiProducer = data->producer<FaceRoiDataProducer>();

  auto &renderData = data->cpuProcessingResult<RenderData>();
  renderData = {};  // Clear previous data.
  renderData.roiTex = faceRoiProducer.renderer().dest();

  const auto &faceRenderResult = faceRoiProducer.renderer().result();

  if (faceDetector_ == nullptr) {
    faceDetector_.reset(new FaceDetectorGlobal(
      embeddedFaceDetectionFrontTfliteData, embeddedFaceDetectionFrontTfliteSize));
    meshDetector_.reset(new FaceDetectorLocal(
      embeddedFaceLandmarkWithAttentionTfliteData, embeddedFaceLandmarkWithAttentionTfliteSize,
      earConfig_));
  }

  // Run global face detection only if there are no currently tracked faces.
  Vector<DetectedPoints> globalFaces;
  if (faceRenderResult.faceMeshImages.empty()) {
    globalFaces = faceDetector_->detectFaces(faceRenderResult.faceDetectImage, deviceK_);

    for (int i = 0; i < globalFaces.size(); ++i) {
      globalFaces[i].roi.faceId = i + 1;
    }
  }

  // Run local detection on all currently tracked faces.
  Vector<DetectedPoints> localFaces;
  for (const auto &im : faceRenderResult.faceMeshImages) {
    // Mesh detector will return 1 or 0 results.
    auto f = meshDetector_->analyzeFace(im, deviceK_);
    if (!f.empty()) {
      localFaces.push_back(f[0]);
      renderData.localFaces.push_back(detectionToRaySpace(f[0]));
    }
  }

  // Set the next ROI from local faces if possible, or global faces otherwise.
  faceRoiProducer.renderer().setDetectedFaces(localFaces.empty() ? globalFaces : localFaces);
}

void FaceLocalView::updateScene(OmniscopeViewData *data) {
  auto &renderData = data->cpuProcessingResult<RenderData>();
  auto &roiScene = scene().find<Scene>("roi-view");
  auto &cameraScene = scene().find<Scene>("camera-view");

  roiScene.find<Renderable>("roi").material().colorTexture()->setNativeId(renderData.roiTex.id());

  ///////////// Camera View Update //////////////
  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  updateDetections(renderData.localFaces, &cameraScene, &detections_, 3.0f);
}

void FaceLocalView::resetScene() {
  // noop
}

void FaceLocalView::renderDisplay(OmniscopeViewData *data) {
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

void FaceLocalView::gotTouches(const Vector<Touch> &touches) {
  if (touches.size() == 2) {
    resetScene();
    return;
  }
}

void FaceLocalView::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  renderer_ = std::make_unique<Renderer>();
  initRoiAndCameraScene(&scene(), deviceK_, 640);
}

bool FaceLocalView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;
}

}  // namespace c8
