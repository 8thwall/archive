// Copyright (c) 2023 Niantic Labs
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "eartracker-view.h",
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
    "//c8:parameter-data",
    "//c8/geometry:facemesh-data",
    "//c8/geometry:intrinsics",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels:draw3-widgets",
    "//c8/pixels/opengl:gl-error",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/ears/data:embedded-ear-model",
    "//reality/engine/faces:face-tracker",
    "//reality/engine/faces:face-geometry",
    "//third_party/mediapipe/models:face-detection-front-embedded",
    "//third_party/mediapipe/models:face-landmark-attention-embedded",
  };
}
cc_end(0xfd2c2b9b);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/pose-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/pose/eartracker-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/facemesh-data.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/vectors.h"
#include "c8/hpoint.h"
#include "c8/parameter-data.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/draw3-widgets.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "c8/string/join.h"
#include "reality/engine/ears/data/embedded-ear-model.h"
#include "reality/engine/faces/face-geometry.h"
#include "reality/engine/tracking/tracking-sensor-event.h"
#include "third_party/mediapipe/models/face-detection-front-embedded.h"
#include "third_party/mediapipe/models/face-landmark-attention-embedded.h"

namespace c8 {

namespace {
constexpr int CACHE_HUD_SIZE = 150; // This has to be > max(numYBins, numZBins) * 2
constexpr int TEXT_MARGIN = 100;
// 3 outputs per ear: helix, canal, lobe
constexpr int NUM_EAR_OUTPUTS = 3;
struct EarSampledStats {
  size_t numYBins = 0;
  size_t numZBins = 0;
  // Assuming [zBin][yBin]
  Vector<int> binToCount;
  size_t totalRecords = 0;
  size_t numBinsWithRecord = 0;
};

class RenderData : public CpuProcessingResult {
public:
  GlTexture faceRoiTex;
  Vector<Face3d> trackedFaces;
  Vector<DetectedRayPoints> localFaces;

  GlTexture earRoiTex;
  Vector<DetectedRayPoints> localEars;
  Vector<Ear3d> trackedEars;
  EarSampledStats cacheStats;
  EarPoseBinIdx currentPoseBinIdx;
};

// Control panel items.
const char *SHOW_FACE = "show face";
const char *SHOW_CAMERA_TEXTURE = "show camera texture";
const char *SHOW_EAR_DETECTION = "show ear detections";
const char *SHOW_EAR_VERTICES = "show ear vertices";
const char *SHOW_EAR_VERTICES_VISIBLE_ONLY = "show ear vertices visible only";

// Used for testing the camerafeed on top of mesh transforms. A quick and dirty blend shape.
const char *FACEMESH_X_SCALE = "Facemesh x scale";

// Look through the cache state and produce stats needed to draw its state onto the screen
// TODO(dat): Potentially movable to pose-widget or maybe ear-widget
EarSampledStats collectSampledEarStats(const EarSampledVerticesFullView &cache) {
  auto numYBins = cache.numYBin();
  auto numZBins = cache.numZBin();
  Vector<int> binToCount;
  binToCount.resize(numYBins * numZBins, 0);
  size_t numBinsWithRecord = 0;
  size_t totalRecords = 0;
  for (size_t i = 0; i < numZBins; i++) {
    for (size_t j = 0; j < numYBins; j++) {
      auto binIdx = EarPoseBinIdx{.yBin = j, .zBin = i};
      auto sampledVertices = cache.getSampledVertices(binIdx);

      // We sum up all the counts for both left and right ears
      // When a bin is full, for 3 ear points (helix, canal, lobe), we would have 3 * 20 = 60 per
      // side for a total of 120
      size_t binNumRecords = 0;
      for (auto count : sampledVertices.leftVertCount) {
        binNumRecords += count;
      }
      for (auto count : sampledVertices.rightVertCount) {
        binNumRecords += count;
      }
      binToCount[binIdx.zBin * numYBins + binIdx.yBin] = binNumRecords;

      if (binNumRecords > 0) {
        numBinsWithRecord++;
      }
      totalRecords += binNumRecords;
    }
  }
  return {numYBins, numZBins, binToCount, totalRecords, numBinsWithRecord};
}

}  // namespace

void EarTrackerView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (shader_ == nullptr) {
    shader_.reset(new FaceRoiShader());
    shader_->initialize();
    checkGLError("[eartracker-view] shader_.initialize");
  }
  deviceK_ = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(appConfig_.deviceModel),
    appConfig_.captureWidth,
    appConfig_.captureHeight);

  controlPanelConfig()[SHOW_FACE] =
    ControlPanelElement::checkBox(SHOW_FACE, false, "Show face indices");
  // SHOW_EAR_DETECTION
  controlPanelConfig()[SHOW_EAR_DETECTION] =
    ControlPanelElement::checkBox(SHOW_EAR_DETECTION, true, "Show ear detections");
  controlPanelConfig()[SHOW_EAR_VERTICES] =
    ControlPanelElement::checkBox(SHOW_EAR_VERTICES, true, "Show ear vertices");
  controlPanelConfig()[SHOW_EAR_VERTICES_VISIBLE_ONLY] = ControlPanelElement::checkBox(
    SHOW_EAR_VERTICES_VISIBLE_ONLY, false, "Show ear vertices visible only");
  controlPanelConfig()[SHOW_CAMERA_TEXTURE] =
    ControlPanelElement::checkBox(SHOW_CAMERA_TEXTURE, false, "Show camera texture on mesh");
  controlPanelConfig()[FACEMESH_X_SCALE] =
    ControlPanelElement::inputSlider(FACEMESH_X_SCALE, 1.0f, "Facemesh x scale", 0.1f, 2.0f);
}

void EarTrackerView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::earRoiObject8Renderer<RenderData>(
    appConfig_,
    appConfig_.captureWidth + appConfig_.captureHeight,
    appConfig_.captureHeight,
    shader_.get());
}

void EarTrackerView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("ear-tracker-process-cpu");
  auto &earRoiProducer = data->producer<EarRoiDataProducer>();

  auto &renderData = data->cpuProcessingResult<RenderData>();
  renderData = {};  // Clear previous data.
  renderData.faceRoiTex = earRoiProducer.faceRenderer().dest();
  renderData.earRoiTex = earRoiProducer.earRenderer().dest();

  const auto &faceRenderResult = earRoiProducer.faceRenderer().result();
  const auto &earRenderResult = earRoiProducer.earRenderer().result();

  if (tracker_ == nullptr) {
    tracker_.reset(new FaceTracker());
    tracker_->setIsTrackingEars(true);  // set the flag before loading the model
    tracker_->setFaceDetectModel(
      embeddedFaceDetectionFrontTfliteData, embeddedFaceDetectionFrontTfliteSize);
    tracker_->setFaceMeshModel(
      embeddedFaceLandmarkWithAttentionTfliteData, embeddedFaceLandmarkWithAttentionTfliteSize);
    tracker_->setEarModel(embeddedEarModelV2TfliteData, embeddedEarModelV2TfliteSize);
  }

  // Run face tracking and save result for rendering.
  auto result = tracker_->track(faceRenderResult, deviceK_);
  renderData.trackedFaces = *result.faceData;

  for (const auto &localFace : (*result.localFaces)) {
    renderData.localFaces.push_back(detectionToRaySpace(localFace));
  }

  // Set the next ROI from local faces if possible, or global faces otherwise.
  earRoiProducer.faceRenderer().setDetectedFaces(
    result.localFaces->empty() ? *result.globalFaces : *result.localFaces);

  // Get ear tracking result and save result for ear rendering
  EarTrackingResult earResult = tracker_->trackEars(earRenderResult, deviceK_);
  renderData.trackedEars = *earResult.earData;

  for (const auto &localEar : (*earResult.localEars)) {
    renderData.localEars.push_back(detectionToRaySpace(localEar));
  }

  // Sampling stats of the compute cache for rendering
  if (renderData.trackedEars.size() > 0) {
    if (globalParams().get<bool>("FaceTracker.toCacheEarData")) {
      // We are only looking at the first face and ears
      renderData.cacheStats = collectSampledEarStats(
        tracker_->getFaceIdToSampledEar3d().at(renderData.trackedEars[0].faceId));
    }
    renderData.currentPoseBinIdx = tracker_->getEarRotationBinNum(
      renderData.trackedFaces[0].transform.rotation);
  }

  // Set the next ROIs from local ears if there are local faces.
  if (!result.localFaces->empty() && !result.localEars->empty()) {
    earRoiProducer.earRenderer().setDetectedEars(*result.localEars);
  }
}

void EarTrackerView::updateScene(OmniscopeViewData *data) {
  auto &renderData = data->cpuProcessingResult<RenderData>();
  auto &faceRoiScene = scene().find<Scene>("face-roi-view");
  auto &earRoiScene = scene().find<Scene>("ear-roi-view");
  auto &cameraScene = scene().find<Scene>("camera-view");

  faceRoiScene.find<Renderable>("faceRoi").material().colorTexture()->setNativeId(
    renderData.faceRoiTex.id());

  ///////////// Ear ROI View Update /////////////
  earRoiScene.find<Renderable>("earRoi").material().colorTexture()->setNativeId(
    renderData.earRoiTex.id());

  // Show cache info
  {
    auto &earCache = earRoiScene.find<Renderable>("earCache");
    auto numZBins = renderData.cacheStats.numZBins;
    auto numYBins = renderData.cacheStats.numYBins;
    if (numZBins > 0 && numYBins > 0) {
      if (CACHE_HUD_SIZE < std::max(numZBins, numYBins) * 2) {
        C8_THROW("Cache HUD size is too small");
      }
      // Each bin takes up a 2x2 pixel block
      RGBA8888PlanePixelBuffer buffer(CACHE_HUD_SIZE + TEXT_MARGIN, CACHE_HUD_SIZE);
      auto cp = buffer.pixels();
      fill(Color::BLACK.alpha(0), cp);
      int fullCount = globalParams().get<int>("EarTypes.averageSamples");
      for (size_t i = 0; i < numZBins; i++) {
        for (size_t j = 0; j < numYBins; j++) {
          auto count = renderData.cacheStats.binToCount[i * numYBins + j];
          // Do we even have one ear full in the cache??
          if (count >= fullCount * NUM_EAR_OUTPUTS) {
            // Draw a 2x2 block
            drawRectangle({j * 2.f, i * 2.f}, {j * 2.f + 1, i * 2.f + 1}, Color::MANGO, cp);
          }
        }
      }

      // The current pose's bin
      auto binIdx = renderData.currentPoseBinIdx;
      Vector<String> lines = {
        format("#bins > 0: %d", renderData.cacheStats.numBinsWithRecord),
        format("#records: %d", renderData.cacheStats.totalRecords),
        format(
          "This #rec: %d", renderData.cacheStats.binToCount[binIdx.zBin * numYBins + binIdx.yBin]),
        format("z=%d y=%d", binIdx.zBin, binIdx.yBin),
      };
      for (size_t i = 0; i < lines.size(); i++) {
        auto line = lines[i];
        putText(
          line, {0.f, 1.f * CACHE_HUD_SIZE + i * 20}, Color::WHITE, Color::BLACK.alpha(0), cp);
      }
      earCache.material().colorTexture()->setRgbaPixelBuffer(std::move(buffer));
      ObGen::setTransparent(earCache, 1.0f);
    }
  }

  ///////////// Camera View Update //////////////
  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  const bool toShowFace = controlPanelConfig()[SHOW_FACE].val<bool>();
  updateFaceMeshes(
    renderData.trackedFaces, &cameraScene, &renderedFaces_, {toShowFace, false, false, false});

  const bool toShowEarVertices = controlPanelConfig()[SHOW_EAR_VERTICES].val<bool>();
  const bool toShowEarVerticesVisibleOnly =
    controlPanelConfig()[SHOW_EAR_VERTICES_VISIBLE_ONLY].val<bool>();
  updateEars(
    renderData.trackedEars,
    &cameraScene,
    &renderedEars_,
    {toShowEarVertices, toShowEarVerticesVisibleOnly});

  const bool toShowEarDetection = controlPanelConfig()[SHOW_EAR_DETECTION].val<bool>();
  Vector<c8::DetectedRayPoints> localDetections;
  if (toShowFace) {
    localDetections.insert(
      localDetections.end(), renderData.localFaces.begin(), renderData.localFaces.end());
  }

  if (toShowEarDetection && renderData.localEars.size() >= 2) {
    // The first two points are anchor ear locations
    updateDetections(
      {renderData.localEars[0], renderData.localEars[1]},
      &cameraScene,
      &faceAnchors_,
      3.0f,
      false,
      Color::MANGO);
  }

  updateDetections(localDetections, &cameraScene, &detections_, 3.0f);

  if (controlPanelConfig()[SHOW_CAMERA_TEXTURE].val<bool>()) {
    if (renderData.trackedFaces.empty() || renderedFaces_.empty()) {
      // early exit.
      return;
    }

    // This code will get integrated with the
    auto &faceMesh = cameraScene.find<Renderable>("facemesh");
    if (!faceMesh.material().colorTexture()) {
      faceMesh.setMaterial(MatGen::image());
    }

    faceMesh.material().colorTexture()->setNativeId(data->cameraTexture());
    faceMesh.geometry().setUvs(renderData.trackedFaces[0].uvsInCameraSpace);

    auto faceTransform = trsMat(
      renderData.trackedFaces[0].transform.position,
      renderData.trackedFaces[0].transform.rotation,
      renderData.trackedFaces[0].transform.scale);
    renderedFaces_[0]->setLocal(
      faceTransform * HMatrixGen::scaleX(controlPanelConfig()[FACEMESH_X_SCALE].val<float>()));
  }
}

void EarTrackerView::resetScene() {
  // noop
}

void EarTrackerView::renderDisplay(OmniscopeViewData *data) {
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

void EarTrackerView::gotTouches(const Vector<Touch> &touches) {
  if (touches.size() == 2) {
    resetScene();
    return;
  }
}

void EarTrackerView::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  renderer_ = std::make_unique<Renderer>();

  const int viewHeight = 640;
  float scale = static_cast<float>(viewHeight) / deviceK_.pixelsHeight;

  int capWidth = deviceK_.pixelsWidth * scale;
  int capHeight = viewHeight;  // This is captureHeight * scale, but more numerically stable.
  int viewWidth = 2 * capHeight + capWidth;

  ///////////// Face ROI View Setup: Shows the GPU-produced face ROI texture //////////////
  auto &faceRoiScene = scene().add(ObGen::subScene("face-roi-view", {{capHeight, capHeight}}));

  faceRoiScene
    .add(ObGen::positioned(ObGen::named(ObGen::backQuad(), "faceRoi"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  faceRoiScene.add(ObGen::pixelCamera(capHeight, capHeight));

  ///////////// Ear ROI View Setup: Shows the GPU-produced ear ROI texture //////////////
  auto &earRoiScene = scene().add(ObGen::subScene("ear-roi-view", {{capHeight, capHeight}}));

  earRoiScene
    .add(ObGen::positioned(ObGen::named(ObGen::backQuad(), "earRoi"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  // hud on ear roi scene
  auto &earCache =
    earRoiScene
      .add(
        ObGen::positioned(
          ObGen::named(
            ObGen::pixelQuad(0, 0, CACHE_HUD_SIZE + TEXT_MARGIN, CACHE_HUD_SIZE),
            "earCache"
          ),
          HMatrixGen::translateY(320)
        ))
      .setMaterial(MatGen::image());
  ObGen::setTransparent(earCache, 0.0f);

  earRoiScene.add(ObGen::pixelCamera(capHeight, capHeight)).flipY();

  ///////////// Camera View Setup: Shows the camera feed and a 1st person view //////////////

  auto &cameraScene = scene().add(ObGen::subScene("camera-view", {{capWidth, capHeight}}));

  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  cameraScene.add(ObGen::perspectiveCamera(deviceK_, capWidth, capHeight));

  // Add the background camera feed. This needs to have y inverted because the input texture was
  // inverted.
  cameraScene
    .add(
      ObGen::positioned(ObGen::named(ObGen::backQuad(), "camerafeed"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  cameraScene.add(ObGen::ambientLight(Color::WHITE, 0.7f));
  cameraScene.add(ObGen::pointLight(Color::WHITE, 0.7f));

  ///////////// Composite View Setup: Set up the layout for both subscenes //////////////

  // Set the default renderSpec on the root scene
  scene().setRenderSpecs({{viewWidth, capHeight}});

  // Add a pixel camera which works with vertices in pixel space. For omniscope, this must have
  // flipY() applied.
  scene().add(ObGen::pixelCamera(viewWidth, capHeight)).flipY();

  // Render the face roi view to a quad on the left.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(0, 0, capHeight, capHeight), "face-roi-view-render"))
    .setMaterial(MatGen::subsceneMaterial("face-roi-view"));

  // Render the ear roi view to a quad in the middle.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(capHeight, 0, capHeight, capHeight), "ear-roi-view-render"))
    .setMaterial(MatGen::subsceneMaterial("ear-roi-view"));

  // Render the camera view to a quad on the right third.
  scene()
    .add(
      ObGen::named(ObGen::pixelQuad(2 * capHeight, 0, capWidth, capHeight), "camera-view-render"))
    .setMaterial(MatGen::subsceneMaterial("camera-view"));
}

bool EarTrackerView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;
}

}  // namespace c8
