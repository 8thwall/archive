// Copyright (c) 2023 Niantic Labs
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "handlocal-mesh-view.h",
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
    "//c8/io:image-io",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels:draw3-widgets",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels/opengl:gl-error",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/hands:hand-detector-global",
    "//reality/engine/hands:hand-detector-local-mesh",
    "//reality/engine/faces:face-geometry",
    "//third_party/mediapipe/models:palm-detection-embedded",
    "//reality/engine/hands/data:embedded-hand-mesh-model",
    "//reality/engine/hands:tracked-hand-state",
  };
}
cc_end(0xc560e162);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/pose-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/pose/handlocal-mesh-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/vectors.h"
#include "c8/hpoint.h"
#include "c8/io/image-io.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/draw3-widgets.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "c8/string/join.h"
#include "reality/engine/faces/face-geometry.h"
#include "reality/engine/hands/data/embedded-hand-mesh-model.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/hands/tracked-hand-state.h"
#include "reality/engine/tracking/tracking-sensor-event.h"
#include "third_party/mediapipe/models/palm-detection-embedded.h"

namespace c8 {

namespace {

// For debugging the individual hand renderer crop images sent to the hand mesh detector model.
constexpr bool WRITE_CROP = false;

class RenderData : public CpuProcessingResult {
public:
  GlTexture roiTex;
  Vector<Hand3d> trackedHands;
  Vector<DetectedRayPoints> localHands;
};

}  // namespace

void HandLocalMeshView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (shader_ == nullptr) {
    shader_.reset(new FaceRoiShader());
    shader_->initialize();
    checkGLError("[handlocal-mesh-view] shader_.initialize");
  }
  deviceK_ = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(appConfig_.deviceModel),
    appConfig_.captureWidth,
    appConfig_.captureHeight);

  handsById_.clear();
  lostIds_.clear();

  fill(Color::DUSTY_VIOLET.alpha(0), wristMatchesBuffer_.pixels());
}

void HandLocalMeshView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::handRoiObject8Renderer<RenderData>(
    appConfig_,
    appConfig_.captureWidth + appConfig_.captureHeight,
    appConfig_.captureHeight,
    HAND_MESH_DETECTION_INPUT_SIZE,
    handRenderer_,
    shader_.get());

  auto &handRoiProducer = dataPtr->producer<HandRoiDataProducer>();
  handRoiProducer.renderer().setRequireFullHand(true);
  handRoiProducer.renderer().setRequireHandUpright(false);

  frameNum_ = 0;
  globalDetectionCounter_ = 0;
}

void HandLocalMeshView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &handRoiProducer = data->producer<HandRoiDataProducer>();

  auto &renderData = data->cpuProcessingResult<RenderData>();
  renderData = {};  // Clear previous data.
  renderData.roiTex = handRoiProducer.renderer().dest();

  const auto &handRenderResult = handRoiProducer.renderer().result();

  if (handDetector_ == nullptr) {
    handDetector_.reset(new HandDetectorGlobal(
      embeddedPalmDetectionLiteTfliteData, embeddedPalmDetectionLiteTfliteSize));
    handMeshDetector_.reset(
      new HandDetectorLocalMesh(embeddedHandMeshV2TfliteData, embeddedHandMeshV2TfliteSize));
    setHandMeshModelKeyPointCount(25);
  }

  lostIds_.clear();

  // Run local detection on all currently tracked hands.
  Vector<DetectedPoints> localHands;
  if (!forceGlobalNextFrame_) {
    for (const auto &im : handRenderResult.handMeshImages) {
      // Mesh detector will return 1 or 0 results.
      auto f = handMeshDetector_->analyzeHand(im, deviceK_);
      if (!f.empty()) {
        localHands.push_back(f[0]);
        renderData.localHands.push_back(detectionToRaySpace(f[0]));
      }
    }
  }

  // Run global hand detection only if there are no currently tracked hands.
  Vector<DetectedPoints> globalHands;
  if (localHands.empty() && handRenderResult.handMeshImages.empty()) {
    globalHands = handDetector_->detectHands(handRenderResult.handDetectImage, deviceK_);

    for (int i = 0; i < globalHands.size(); ++i) {
      globalHands[i].roi.faceId = i + 1;
    }
    forceGlobalNextFrame_ = false;
  }

  if (WRITE_CROP && !handRenderResult.handMeshImages.empty()) {
    writeImage(handRenderResult.handMeshImages[0].image, format("/tmp/frame_%d.png", frameNum_));
  }

  for (const auto &handDetection : localHands) {
    auto &handState = handsById_[handDetection.roi.faceId];  // creates if new.
    // Convert the orthographic handDetection information from local detection into 3D space
    renderData.trackedHands.push_back(handState.locateHandMesh(handDetection, true));
  }

  // Find lost elements and remove them.
  lostIds_.reserve(handsById_.size());
  for (const auto &state : handsById_) {
    if (state.second.status() == Hand3d::TrackingStatus::LOST) {
      lostIds_.push_back(state.first);
      // Since we're in a dual pipeline setup, we need to tell the subsequent frame to not local
      // track.
      forceGlobalNextFrame_ = true;
    }
  }

  for (auto id : lostIds_) {
    // Remove knowledge of this hand.
    handsById_.erase(id);
  }

  // Set the next ROI from local hands if possible, or global hands otherwise.
  handRoiProducer.renderer().setDetectedHands(localHands.empty() ? globalHands : localHands);
  usingGlobal_ = localHands.empty();
  globalDetectionCounter_ += usingGlobal_;
  frameNum_ += 1;
}

void HandLocalMeshView::updateScene(OmniscopeViewData *data) {
  auto &renderData = data->cpuProcessingResult<RenderData>();
  auto &roiScene = scene().find<Scene>("roi-view");
  auto &cameraScene = scene().find<Scene>("camera-view");
  auto &matchesScene = scene().find<Scene>("line-matches-view");

  roiScene.find<Renderable>("roi").material().colorTexture()->setNativeId(renderData.roiTex.id());

  ///////////// Camera View Update //////////////
  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  updateHandMeshes(
    renderData.trackedHands, &cameraScene, &renderedHands_, deviceK_, wristMatchesBuffer_);
  updateDetections(renderData.localHands, &cameraScene, &detections_, 7.f, true);

  matchesScene.find<Renderable>("wrist-landmark-matches")
    .material()
    .colorTexture()
    ->setRgbaPixels(wristMatchesBuffer_.pixels());

  Vector<String> allLines;

  auto detectionCounterStr = format(
    "Frame: %d | Using Global?: %d | Global: %d | Local: %d",
    frameNum_,
    usingGlobal_,
    globalDetectionCounter_,
    frameNum_ - globalDetectionCounter_);
  allLines.push_back(detectionCounterStr);

  RGBA8888PlanePixelBuffer buffer(allLines.size() * 20 + 15, 500);
  auto cp = buffer.pixels();
  fill(Color::OFF_WHITE, cp);
  textBox(allLines, {0.0f, 0.0f}, 500, cp);
  scene()
    .find<Renderable>("hand-events")
    .material()
    .colorTexture()
    ->setRgbaPixelBuffer(std::move(buffer));
}

void HandLocalMeshView::resetScene() {
  // noop
}

void HandLocalMeshView::renderDisplay(OmniscopeViewData *data) {
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

void HandLocalMeshView::gotTouches(const Vector<Touch> &touches) {
  if (touches.size() == 2) {
    resetScene();
    return;
  }
}

void HandLocalMeshView::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  int viewHeight = 640;
  float scale = static_cast<float>(viewHeight) / deviceK_.pixelsHeight;
  int capWidth = deviceK_.pixelsWidth * scale;
  int capHeight = viewHeight;  // This is captureHeight * scale, but more numerically stable.
  int viewWidth = capHeight + capWidth;

  renderer_ = std::make_unique<Renderer>();
  initRoiAndCameraScene(&scene(), deviceK_, 640);

  // Text box
  auto quadPos = HMatrixGen::translation(-0.6f, 0.6f, -1.0f) * HMatrixGen::scale(0.4f, 0.1f, 0.0f);
  scene()
    .add(ObGen::named(ObGen::positioned(ObGen::backQuad(), quadPos), "hand-events"))
    .setMaterial(MatGen::image());

  auto &lineMatchScene = scene().add(ObGen::subScene("line-matches-view", {{capWidth, capHeight}}));
  lineMatchScene.renderSpec().clearColor = Color::BLACK.alpha(0);

  lineMatchScene.add(ObGen::pixelCamera(960, 640));

  auto &wristLandmarkMatches = lineMatchScene
                                 .add(ObGen::positioned(
                                   ObGen::named(ObGen::backQuad(), "wrist-landmark-matches"),
                                   HMatrixGen::translateZ(-1.0f) * HMatrixGen::scaleY(-1.0f)))
                                 .setMaterial(MatGen::image());

  ObGen::setTransparent(wristLandmarkMatches, 1.0f);
  auto &matchesView =
    scene()
      .add(ObGen::named(ObGen::pixelQuad(capHeight, 0, capWidth, capHeight), "line-matches-render"))
      .setMaterial(MatGen::subsceneMaterial("line-matches-view"));
  ObGen::setTransparent(matchesView, 1.f);
}

bool HandLocalMeshView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;
}

}  // namespace c8
