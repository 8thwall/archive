// Copyright (c) 2023 Niantic Labs
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "handtracker-mesh-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:overlay-scene-manager",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//apps/client/internalqa/omniscope/native/lib/view-widgets:control-panel-widgets",
    "//apps/client/internalqa/omniscope/native/lib/view-widgets:pose-widgets",
    "//c8:c8-log",
    "//c8:color",
    "//c8/geometry:vectors",
    "//c8:hpoint",
    "//c8/io:image-io",
    "//c8:string",
    "//c8:vector",
    "//c8/geometry:intrinsics",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels:draw3-widgets",
    "//c8/pixels/opengl:gl-error",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/hands:hand-mesh-tracker",
    "//reality/engine/faces:face-geometry",
    "//third_party/mediapipe/models:palm-detection-embedded",
    "//reality/engine/hands/data:embedded-hand-mesh-model",
  };
}
cc_end(0x406bd96e);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/control-panel-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/view-widgets/pose-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/pose/handtracker-mesh-view.h"
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
#include "reality/engine/tracking/tracking-sensor-event.h"
#include "third_party/mediapipe/models/palm-detection-embedded.h"

namespace c8 {

namespace {

constexpr bool WRITE_CROP = false;

class RenderData : public CpuProcessingResult {
public:
  GlTexture roiTex;
  Vector<Hand3d> trackedHands;
  Vector<DetectedRayPoints> localHands;

  // Used for determining lost/found events.
  Vector<float> translationDeltas;
  Vector<float> rotationDeltas;
  Vector<float> iouDeltas;
  Vector<float> distanceDeltas;
  Vector<float> residuals;
  Vector<float> inlierResiduals;
  Vector<HPoint3> handTranslations;
  Vector<HPoint3> palmTranslations;
  Vector<float> cropCenterX;
  Vector<float> cropCenterY;
  Vector<float> cropLength;
  Vector<float> extendedCropCenterX;
  Vector<float> extendedCropCenterY;
  Vector<float> extendedCropLength;
  TreeMap<Hand3d::TrackingStatus, int> statusCounts;
  int globalDetectionCounter = 0;
  int unstableFrames = 0;
};

constexpr const char *LANDMARK_2D_FILTER = "TrackedHandState.apply2dLandmarkFilter";
constexpr const char *LANDMARK_3D_FILTER = "TrackedHandState.apply3dLandmarkFilter";
constexpr const char *TRANSFORM_FILTER = "TrackedHandState.applyTransformFilter";
constexpr const char *LOCAL_VERTEX_FILTER = "TrackedHandState.applyLocalVertexFilter";
constexpr const char *USE_RECURSIVE_FILTER = "TrackedHandState.useRecursiveFilter";
constexpr const char *ROI_SMOOTH_BBOX_LENGTH = "HandRoiRenderer.smoothBBoxLength";
constexpr const char *ROI_SMOOTH_BBOX_CENTER = "HandRoiRenderer.smoothBBoxCenter";
constexpr const char *ROI_BBOX_LENGTH_MIN_ALPHA = "HandRoiRenderer.bboxLengthMinAlpha";
constexpr const char *ROI_BBOX_LENGTH_UPDATE_90_V = "HandRoiRenderer.bboxLengthUpdate90V";
constexpr const char *ROI_BBOX_LENGTH_V_ALPHA = "HandRoiRenderer.bboxLengthVAlpha";
constexpr const char *ROI_BBOX_CENTER_MIN_ALPHA = "HandRoiRenderer.bboxCenterMinAlpha";
constexpr const char *ROI_BBOX_CENTER_UPDATE_90_V = "HandRoiRenderer.bboxCenterUpdate90V";
constexpr const char *ROI_BBOX_CENTER_V_ALPHA = "HandRoiRenderer.bboxCenterVAlpha";

constexpr const char *MIN_ALPHA = "TrackedHandState.minAlpha";
constexpr const char *UPDATE_90V = "TrackedHandState.update90v";
constexpr const char *V_ALPHA = "TrackedHandState.vAlpha";
constexpr const char *TRANSFORM_ALPHA = "TrackedHandState.transformAlpha";
constexpr const char *POINT_ALPHA = "TrackedHandState.pointAlpha";

constexpr const char *COMPUTE_WRIST = "ComputeWrist";

}  // namespace

void HandTrackerMeshView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (shader_ == nullptr) {
    shader_.reset(new FaceRoiShader());
    shader_->initialize();
    checkGLError("[handtracker-mesh-view] shader_.initialize");
  }
  deviceK_ = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(appConfig_.deviceModel),
    appConfig_.captureWidth,
    appConfig_.captureHeight);

  globalParams().getOrSet(TRANSFORM_FILTER, true);
  globalParams().getOrSet(LANDMARK_2D_FILTER, true);
  globalParams().getOrSet(LANDMARK_3D_FILTER, true);
  globalParams().getOrSet(LOCAL_VERTEX_FILTER, true);
  globalParams().getOrSet(USE_RECURSIVE_FILTER, false);
  globalParams().getOrSet(ROI_SMOOTH_BBOX_LENGTH, true);
  globalParams().getOrSet(ROI_SMOOTH_BBOX_CENTER, true);

  globalParams().getOrSet(ROI_BBOX_LENGTH_MIN_ALPHA, 0.00001f);
  globalParams().getOrSet(ROI_BBOX_LENGTH_UPDATE_90_V, 0.96f);
  globalParams().getOrSet(ROI_BBOX_LENGTH_V_ALPHA, 0.07f);

  globalParams().getOrSet(ROI_BBOX_CENTER_MIN_ALPHA, 0.001f);
  globalParams().getOrSet(ROI_BBOX_CENTER_UPDATE_90_V, 0.5f);
  globalParams().getOrSet(ROI_BBOX_CENTER_V_ALPHA, 0.3f);

  globalParams().getOrSet(MIN_ALPHA, 0.001f);
  globalParams().getOrSet(UPDATE_90V, 0.04f);
  globalParams().getOrSet(V_ALPHA, 0.1f);
  globalParams().getOrSet(TRANSFORM_ALPHA, 0.8f);
  globalParams().getOrSet(POINT_ALPHA, 0.6f);

  globalParams().getOrSet(COMPUTE_WRIST, false);

  controlPanelConfig()[LANDMARK_2D_FILTER] = ControlPanelElement::checkBox(
    LANDMARK_2D_FILTER, globalParams().get<bool>(LANDMARK_2D_FILTER), "");
  controlPanelConfig()[LANDMARK_3D_FILTER] = ControlPanelElement::checkBox(
    LANDMARK_3D_FILTER, globalParams().get<bool>(LANDMARK_3D_FILTER), "");
  controlPanelConfig()[TRANSFORM_FILTER] =
    ControlPanelElement::checkBox(TRANSFORM_FILTER, globalParams().get<bool>(TRANSFORM_FILTER), "");
  controlPanelConfig()[LOCAL_VERTEX_FILTER] = ControlPanelElement::checkBox(
    LOCAL_VERTEX_FILTER, globalParams().get<bool>(LOCAL_VERTEX_FILTER), "");
  controlPanelConfig()[USE_RECURSIVE_FILTER] = ControlPanelElement::checkBox(
    USE_RECURSIVE_FILTER, globalParams().get<bool>(USE_RECURSIVE_FILTER), "");

  controlPanelConfig()[MIN_ALPHA] =
    ControlPanelElement::inputSlider(MIN_ALPHA, globalParams().get<float>(MIN_ALPHA), "", 0.f, 1.f);
  controlPanelConfig()[UPDATE_90V] = ControlPanelElement::inputSlider(
    UPDATE_90V, globalParams().get<float>(UPDATE_90V), "", 0.f, 1.f);
  controlPanelConfig()[V_ALPHA] =
    ControlPanelElement::inputSlider(V_ALPHA, globalParams().get<float>(V_ALPHA), "", 0.f, 1.f);
  controlPanelConfig()[TRANSFORM_ALPHA] = ControlPanelElement::inputSlider(
    TRANSFORM_ALPHA, globalParams().get<float>(TRANSFORM_ALPHA), "", 0.f, 1.f);
  controlPanelConfig()[POINT_ALPHA] = ControlPanelElement::inputSlider(
    POINT_ALPHA, globalParams().get<float>(POINT_ALPHA), "", 0.f, 1.f);

  controlPanelConfig()[ROI_SMOOTH_BBOX_LENGTH] = ControlPanelElement::checkBox(
    ROI_SMOOTH_BBOX_LENGTH, globalParams().get<bool>(ROI_SMOOTH_BBOX_LENGTH), "");
  controlPanelConfig()[ROI_BBOX_LENGTH_MIN_ALPHA] = ControlPanelElement::inputSlider(
    ROI_BBOX_LENGTH_MIN_ALPHA, globalParams().get<float>(ROI_BBOX_LENGTH_MIN_ALPHA), "", 0.f, 1.f);
  controlPanelConfig()[ROI_BBOX_LENGTH_UPDATE_90_V] = ControlPanelElement::inputSlider(
    ROI_BBOX_LENGTH_UPDATE_90_V,
    globalParams().get<float>(ROI_BBOX_LENGTH_UPDATE_90_V),
    "",
    0.f,
    1.f);
  controlPanelConfig()[ROI_BBOX_LENGTH_V_ALPHA] = ControlPanelElement::inputSlider(
    ROI_BBOX_LENGTH_V_ALPHA, globalParams().get<float>(ROI_BBOX_LENGTH_V_ALPHA), "", 0.f, 1.f);

  controlPanelConfig()[ROI_SMOOTH_BBOX_CENTER] = ControlPanelElement::checkBox(
    ROI_SMOOTH_BBOX_CENTER, globalParams().get<bool>(ROI_SMOOTH_BBOX_CENTER), "");
  controlPanelConfig()[ROI_BBOX_CENTER_MIN_ALPHA] = ControlPanelElement::inputSlider(
    ROI_BBOX_CENTER_MIN_ALPHA, globalParams().get<float>(ROI_BBOX_CENTER_MIN_ALPHA), "", 0.f, 1.f);
  controlPanelConfig()[ROI_BBOX_CENTER_UPDATE_90_V] = ControlPanelElement::inputSlider(
    ROI_BBOX_CENTER_UPDATE_90_V,
    globalParams().get<float>(ROI_BBOX_CENTER_UPDATE_90_V),
    "",
    0.f,
    1.f);
  controlPanelConfig()[ROI_BBOX_CENTER_V_ALPHA] = ControlPanelElement::inputSlider(
    ROI_BBOX_CENTER_V_ALPHA, globalParams().get<float>(ROI_BBOX_CENTER_V_ALPHA), "", 0.f, 1.f);

  controlPanelConfig()[COMPUTE_WRIST] =
    ControlPanelElement::checkBox(COMPUTE_WRIST, globalParams().get<bool>(COMPUTE_WRIST), "");
}

void HandTrackerMeshView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
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
}

void HandTrackerMeshView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &handRoiProducer = data->producer<HandRoiDataProducer>();

  auto &renderData = data->cpuProcessingResult<RenderData>();
  renderData = {};  // Clear previous data.
  renderData.roiTex = handRoiProducer.renderer().dest();

  const auto &handRenderResult = handRoiProducer.renderer().result();

  if (tracker_ == nullptr) {
    tracker_.reset(new HandMeshTracker());
    tracker_->setPalmDetectModel(
      embeddedPalmDetectionLiteTfliteData, embeddedPalmDetectionLiteTfliteSize);
    tracker_->setHandMeshModel(embeddedHandMeshV2TfliteData, embeddedHandMeshV2TfliteSize);
    setHandMeshModelKeyPointCount(25);
  }

  // Run hand tracking and save result for rendering.
  bool doComputeWrist = globalParams().get<bool>(COMPUTE_WRIST);
  auto result = tracker_->track(handRenderResult, deviceK_, doComputeWrist);
  renderData.trackedHands = *result.handData;

  bool useGlobal =
    result.localHands->empty() || (result.localHands->size() == result.lostIds->size());

  // Set the next ROI from local hands if possible, or global hands otherwise.
  handRoiProducer.renderer().setDetectedHands(useGlobal ? *result.globalHands : *result.localHands);

  auto handPose = HMatrixGen::i();

  if (!tracker_->handsById().empty()) {
    for (const auto &[id, _] : tracker_->handsById()) {
      renderData.residuals = tracker_->handsById().at(id).residuals();
      renderData.inlierResiduals = tracker_->handsById().at(id).inlierResiduals();
      renderData.unstableFrames = tracker_->handsById().at(id).unstableFrames();
    }
  }

  // TODO(nathan): make this its own function.
  auto translationDelta = -1.f;
  auto rotationDelta = -1.f;
  auto iouDelta = -1.f;
  auto distanceDelta = -1.f;
  if (!result.handData->empty()) {
    auto handTransform = result.handData->at(0);

    if (handTransform.status != previousHandStatus_) {
      statusCounts_[handTransform.status]++;
    }
    previousHandStatus_ = handTransform.status;

    auto handInRay = detectionToRaySpace(result.localHands->at(0));
    renderData.localHands.push_back(handInRay);

    cropCenterX_.push_back(handInRay.boundingBox.center().x());
    cropCenterY_.push_back(handInRay.boundingBox.center().y());
    cropLength_.push_back(std::max(handInRay.boundingBox.width(), handInRay.boundingBox.height()));
    extendedCropCenterX_.push_back(handInRay.extendedBoundingBox.center().x());
    extendedCropCenterY_.push_back(handInRay.extendedBoundingBox.center().y());
    // Width and height should be the same for extended crop.
    extendedCropLength_.push_back(handInRay.extendedBoundingBox.width());

    handTranslations_.push_back(handTransform.transform.position);
    palmTranslations_.push_back(handTransform.vertices[HAND_LANDMARK_EXTRA_PALM]);
    handPose = trsMat(
      handTransform.transform.position,
      handTransform.transform.rotation,
      handTransform.transform.scale);
    if (frameNum_ > 0) {
      translationDelta = trsTranslation(handPose).dist(trsTranslation(previousPose_));
      rotationDelta = trsRotation(handPose).radians(trsRotation(previousPose_));

      if (!result.localHands->empty()) {
        // Upright bbox also corrects the y so that +y is up, which isn't the case for these image
        // space bboxes.
        iouDelta = intersectionOverUnion(
          uprightBBox(result.localHands->at(0).boundingBox), uprightBBox(previousLocalBBox_));
        distanceDelta = minBBoxDistance(
          uprightBBox(result.localHands->at(0).boundingBox), uprightBBox(previousLocalBBox_));

        previousLocalBBox_ = result.localHands->at(0).boundingBox;
      }
    }
  }

  if (WRITE_CROP && !handRenderResult.handMeshImages.empty()) {
    writeImage(handRenderResult.handMeshImages[0].image, format("/tmp/frame_%d.png", frameNum_));
  }

  globalDetectionCounter_ = globalDetectionCounter_ + static_cast<int>(useGlobal);
  renderData.globalDetectionCounter = globalDetectionCounter_;
  translationDeltas_.push_back(translationDelta);
  rotationDeltas_.push_back(rotationDelta);
  iouDeltas_.push_back(iouDelta);
  distanceDeltas_.push_back(distanceDelta);

  renderData.translationDeltas = translationDeltas_;
  renderData.rotationDeltas = rotationDeltas_;
  renderData.iouDeltas = iouDeltas_;
  renderData.distanceDeltas = distanceDeltas_;
  renderData.handTranslations = handTranslations_;
  renderData.palmTranslations = palmTranslations_;
  renderData.cropCenterX = cropCenterX_;
  renderData.cropCenterY = cropCenterY_;
  renderData.cropLength = cropLength_;
  renderData.extendedCropCenterX = extendedCropCenterX_;
  renderData.extendedCropCenterY = extendedCropCenterY_;
  renderData.extendedCropLength = extendedCropLength_;
  renderData.statusCounts = statusCounts_;
  frameNum_++;
  previousPose_ = handPose;
}

void HandTrackerMeshView::updateScene(OmniscopeViewData *data) {
  auto &renderData = data->cpuProcessingResult<RenderData>();
  auto &roiScene = scene().find<Scene>("roi-view");
  auto &cameraScene = scene().find<Scene>("camera-view");

  setGlobalParamFromConfig<bool>(controlPanelConfig(), LANDMARK_2D_FILTER, &landmark2dFilter_);
  setGlobalParamFromConfig<bool>(controlPanelConfig(), LANDMARK_3D_FILTER, &landmark3dFilter_);
  setGlobalParamFromConfig<bool>(controlPanelConfig(), TRANSFORM_FILTER, &transformFilter_);
  setGlobalParamFromConfig<bool>(controlPanelConfig(), LOCAL_VERTEX_FILTER, &localVertexFilter_);
  setGlobalParamFromConfig<bool>(controlPanelConfig(), USE_RECURSIVE_FILTER, &useRecursiveFilter_);

  setGlobalParamFromConfig<bool>(
    controlPanelConfig(), ROI_SMOOTH_BBOX_LENGTH, &roiSmoothBBoxLength_);
  setGlobalParamFromConfig<float>(
    controlPanelConfig(), ROI_BBOX_LENGTH_MIN_ALPHA, &roiLengthMinAlpha_);
  setGlobalParamFromConfig<float>(
    controlPanelConfig(), ROI_BBOX_LENGTH_UPDATE_90_V, &roiLengthUpdate90V_);
  setGlobalParamFromConfig<float>(controlPanelConfig(), ROI_BBOX_LENGTH_V_ALPHA, &roiLengthVAlpha_);

  setGlobalParamFromConfig<bool>(
    controlPanelConfig(), ROI_SMOOTH_BBOX_CENTER, &roiSmoothBBoxCenter_);
  setGlobalParamFromConfig<float>(
    controlPanelConfig(), ROI_BBOX_CENTER_MIN_ALPHA, &roiCenterMinAlpha_);
  setGlobalParamFromConfig<float>(
    controlPanelConfig(), ROI_BBOX_CENTER_UPDATE_90_V, &roiCenterUpdate90V_);
  setGlobalParamFromConfig<float>(controlPanelConfig(), ROI_BBOX_CENTER_V_ALPHA, &roiCenterVAlpha_);

  setGlobalParamFromConfig<float>(controlPanelConfig(), MIN_ALPHA, &minAlpha_);
  setGlobalParamFromConfig<float>(controlPanelConfig(), UPDATE_90V, &update90v_);
  setGlobalParamFromConfig<float>(controlPanelConfig(), V_ALPHA, &vAlpha_);
  setGlobalParamFromConfig<float>(controlPanelConfig(), POINT_ALPHA, &pointAlpha_);

  setGlobalParamFromConfig<float>(controlPanelConfig(), TRANSFORM_ALPHA, &transformAlpha_);

  roiScene.find<Renderable>("roi").material().colorTexture()->setNativeId(renderData.roiTex.id());

  ///////////// Camera View Update //////////////
  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  // updateDetections(renderData.localHands, &cameraScene, &detections_, 7.0f, true);
  updateHandMeshes(renderData.trackedHands, &cameraScene, &renderedHands_, deviceK_);

  // Frame numbers for plots.
  Vector<float> xs;
  for (int i = 0; i < renderData.translationDeltas.size(); ++i) {
    xs.push_back(static_cast<float>(i));
  }

  {
    auto &p = seriesPlot(
      data, "lost-found-deltas", "LOST / FOUND deltas", {"Frame"}, {"Value", {-.1f, 1.f}});
    addLine(p, "Translation Delta", xs, renderData.translationDeltas, Color::PURPLE);
    addLine(p, "Rotation Delta", xs, renderData.rotationDeltas, Color::GREEN);
    addLine(p, "IOU Delta", xs, renderData.iouDeltas, Color::PINK);
    addLine(p, "Distance Delta", xs, renderData.distanceDeltas, Color::YELLOW);
  }

  // Hand translation graph
  {
    Vector<float> translationXs;
    for (int i = 0; i < renderData.handTranslations.size(); ++i) {
      translationXs.push_back(static_cast<float>(i));
    }
    Vector<float> xs;
    Vector<float> ys;
    Vector<float> zs;
    for (const auto &t : renderData.handTranslations) {
      xs.push_back(t.x());
      ys.push_back(t.y());
      zs.push_back(t.z());
    }
    auto &p = seriesPlot(
      data, "Hand Translation", "Hand Translation", {"Residual Index"}, {"Value", {-.1f, 1.f}});
    addLine(p, "x", translationXs, xs, Color::PURPLE);
    addLine(p, "y", translationXs, ys, Color::GREEN);
    addLine(p, "z", translationXs, zs, Color::ORANGE);
  }

  // Palm translation graph
  {
    Vector<float> translationXs;
    for (int i = 0; i < renderData.palmTranslations.size(); ++i) {
      translationXs.push_back(static_cast<float>(i));
    }
    Vector<float> xs;
    Vector<float> ys;
    Vector<float> zs;
    for (const auto &t : renderData.palmTranslations) {
      xs.push_back(t.x());
      ys.push_back(t.y());
      zs.push_back(t.z());
    }
    auto &p = seriesPlot(
      data, "Palm Translation", "Palm Translation", {"Residual Index"}, {"Value", {-.1f, 1.f}});
    addLine(p, "x", translationXs, xs, Color::PURPLE);
    addLine(p, "y", translationXs, ys, Color::GREEN);
    addLine(p, "z", translationXs, zs, Color::ORANGE);
  }

  // Crop graph
  {
    Vector<float> cropXs;
    for (int i = 0; i < renderData.cropCenterX.size(); ++i) {
      cropXs.push_back(static_cast<float>(i));
    }
    auto &p1 =
      seriesPlot(data, "Crop Center", "Crop Center", {"Residual Index"}, {"Value", {-.1f, 1.f}});
    addLine(p1, "crop center x", cropXs, renderData.cropCenterX, Color::PURPLE);
    addLine(p1, "crop center y", cropXs, renderData.cropCenterY, Color::GREEN);
    addLine(p1, "extended crop center x", cropXs, renderData.extendedCropCenterX, Color::BLUE);
    addLine(p1, "extended crop center y", cropXs, renderData.extendedCropCenterY, Color::MINT);
    auto &p2 =
      seriesPlot(data, "Crop Length", "Crop Length", {"Residual Index"}, {"Value", {-.1f, 1.f}});
    addLine(p2, "crop length", cropXs, renderData.cropLength, Color::ORANGE);
    addLine(p2, "extended crop length", cropXs, renderData.extendedCropLength, Color::RED);
  }

  // Residuals graphs
  {
    Vector<float> residualsXs;
    for (int i = 0; i < renderData.residuals.size(); ++i) {
      residualsXs.push_back(static_cast<float>(i));
    }
    auto &p =
      seriesPlot(data, "Residuals", "Residuals", {"Residual Index"}, {"Value", {-.1f, 1.f}});
    addLine(p, "Residuals", residualsXs, renderData.residuals, Color::PURPLE);
  }

  // Inlier Residuals graphs
  {
    Vector<float> inlierResidualsXs;
    for (int i = 0; i < renderData.inlierResiduals.size(); ++i) {
      inlierResidualsXs.push_back(static_cast<float>(i));
    }
    auto &p = seriesPlot(
      data, "Inlier Residuals", "Inlier Residuals", {"Residual Index"}, {"Value", {-.1f, 1.f}});
    addLine(p, "Inlier Residuals", inlierResidualsXs, renderData.inlierResiduals, Color::GREEN);
  }

  Vector<String> allLines;
  for (int i = 0; i < renderData.trackedHands.size(); ++i) {
    Vector<String> lines = {
      format(
        "Hand #%d kind: %d state: %s (unstable: %d)",
        renderData.trackedHands[i].id,
        renderData.trackedHands[i].handKind,
        // TODO(nathan): make this a type to string function.
        renderData.trackedHands[i].status == Hand3d::TrackingStatus::LOST      ? "lost"
          : renderData.trackedHands[i].status == Hand3d::TrackingStatus::FOUND ? "found"
                                                                               : "updated",
        renderData.unstableFrames),
    };

    allLines.insert(allLines.end(), lines.begin(), lines.end());
  };

  auto statusCountStr = format(
    "Found: %d | Updated: %d | Lost: %d",
    renderData.statusCounts[Hand3d::TrackingStatus::FOUND],
    renderData.statusCounts[Hand3d::TrackingStatus::UPDATED],
    renderData.statusCounts[Hand3d::TrackingStatus::LOST]);
  allLines.push_back(statusCountStr);

  auto detectionCounterStr = format(
    "Global: %d | Local: %d",
    renderData.globalDetectionCounter,
    frameNum_ - renderData.globalDetectionCounter);
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

void HandTrackerMeshView::resetScene() {
  // noop
}

void HandTrackerMeshView::renderDisplay(OmniscopeViewData *data) {
  ScopeTimer t("hand-mesh-tracker-render-display");

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

void HandTrackerMeshView::gotTouches(const Vector<Touch> &touches) {
  if (touches.size() == 2) {
    resetScene();
    return;
  }
}

void HandTrackerMeshView::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  renderer_ = std::make_unique<Renderer>();
  initRoiAndCameraScene(&scene(), deviceK_, 640);

  // Text box
  auto quadPos = HMatrixGen::translation(-0.6f, 0.6f, -1.0f) * HMatrixGen::scale(0.4f, 0.2f, 0.0f);
  scene()
    .add(ObGen::named(ObGen::positioned(ObGen::backQuad(), quadPos), "hand-events"))
    .setMaterial(MatGen::image());
}

bool HandTrackerMeshView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;
}

}  // namespace c8
