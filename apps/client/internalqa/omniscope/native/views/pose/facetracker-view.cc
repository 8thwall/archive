// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "facetracker-view.h",
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
    "//c8/geometry:facemesh-data",
    "//c8/geometry:intrinsics",
    "//c8/geometry:vectors",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels:draw3-widgets",
    "//c8/pixels/opengl:gl-error",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/faces:face-tracker",
    "//reality/engine/faces:face-geometry",
    "//third_party/mediapipe/models:face-detection-front-embedded",
    "//third_party/mediapipe/models:face-landmark-attention-embedded",
  };
}
cc_end(0x413dce1b);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/pose-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/pose/facetracker-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/facemesh-data.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/vectors.h"
#include "c8/hpoint.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
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
  Vector<Face3d> trackedFaces;
  Vector<DetectedRayPoints> localFaces;
};

// Control panel items.
const char *SHOW_FACE = "show face";
const char *SHOW_EYES = "show eyes";
const char *SHOW_MOUTH = "show mouth";
const char *SHOW_IRIS = "show iris";
const char *SHOW_CAMERA_TEXTURE = "show camera texture";

// Used for testing the camerafeed on top of mesh transforms. A quick and dirty blend shape.
const char *FACEMESH_X_SCALE = "Facemesh x scale";

}  // namespace

void FaceTrackerView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (shader_ == nullptr) {
    shader_.reset(new FaceRoiShader());
    shader_->initialize();
    checkGLError("[facetracker-view] shader_.initialize");
  }
  deviceK_ = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(appConfig_.deviceModel),
    appConfig_.captureWidth,
    appConfig_.captureHeight);

  controlPanelConfig()[SHOW_FACE] =
    ControlPanelElement::checkBox(SHOW_FACE, true, "Show face indices");
  controlPanelConfig()[SHOW_EYES] =
    ControlPanelElement::checkBox(SHOW_EYES, false, "Show eye indices");
  controlPanelConfig()[SHOW_MOUTH] =
    ControlPanelElement::checkBox(SHOW_MOUTH, false, "Show mouth indices");
  controlPanelConfig()[SHOW_IRIS] =
    ControlPanelElement::checkBox(SHOW_IRIS, true, "Show iris indices");
  controlPanelConfig()[SHOW_CAMERA_TEXTURE] =
    ControlPanelElement::checkBox(SHOW_CAMERA_TEXTURE, false, "Show camera texture on mesh");
  controlPanelConfig()[FACEMESH_X_SCALE] =
    ControlPanelElement::inputSlider(FACEMESH_X_SCALE, 1.0f, "Facemesh x scale", 0.1f, 2.0f);
}

void FaceTrackerView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::faceRoiObject8Renderer<RenderData>(
    appConfig_,
    appConfig_.captureWidth + appConfig_.captureHeight,
    appConfig_.captureHeight,
    shader_.get());
}

void FaceTrackerView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &faceRoiProducer = data->producer<FaceRoiDataProducer>();

  auto &renderData = data->cpuProcessingResult<RenderData>();
  renderData = {};  // Clear previous data.
  renderData.roiTex = faceRoiProducer.renderer().dest();

  const auto &faceRenderResult = faceRoiProducer.renderer().result();

  if (tracker_ == nullptr) {
    tracker_.reset(new FaceTracker());
    tracker_->setFaceDetectModel(
      embeddedFaceDetectionFrontTfliteData, embeddedFaceDetectionFrontTfliteSize);
    tracker_->setFaceMeshModel(
      embeddedFaceLandmarkWithAttentionTfliteData, embeddedFaceLandmarkWithAttentionTfliteSize);
    tracker_->setIsTrackingEars(false);
  }
  // Run face tracking and save result for rendering.
  auto result = tracker_->track(faceRenderResult, deviceK_);
  renderData.trackedFaces = *result.faceData;

  for (const auto &localFace : (*result.localFaces)) {
    renderData.localFaces.push_back(detectionToRaySpace(localFace));
  }

  // Set the next ROI from local faces if possible, or global faces otherwise.
  faceRoiProducer.renderer().setDetectedFaces(
    result.localFaces->empty() ? *result.globalFaces : *result.localFaces);
}

void FaceTrackerView::updateScene(OmniscopeViewData *data) {
  auto &renderData = data->cpuProcessingResult<RenderData>();
  auto &roiScene = scene().find<Scene>("roi-view");
  auto &cameraScene = scene().find<Scene>("camera-view");

  roiScene.find<Renderable>("roi").material().colorTexture()->setNativeId(renderData.roiTex.id());

  if (!renderData.trackedFaces.empty()) {

    Vector<String> allLines;

    for (int i = 0; i < renderData.trackedFaces.size(); ++i) {
      const auto &vertices = renderData.trackedFaces[i].vertices;
      if (vertices.empty()) {
        continue;
      }
      auto leftIrisDiameter =
        (vertices[FACEMESH_L_IRIS_LEFT_CORNER].dist(vertices[FACEMESH_L_IRIS_RIGHT_CORNER])
         + vertices[FACEMESH_L_IRIS_TOP_CORNER].dist(vertices[FACEMESH_L_IRIS_BOTTOM_CORNER]))
        / 2.f;
      auto rightIrisDiameter =
        (vertices[FACEMESH_R_IRIS_LEFT_CORNER].dist(vertices[FACEMESH_R_IRIS_RIGHT_CORNER])
         + vertices[FACEMESH_R_IRIS_TOP_CORNER].dist(vertices[FACEMESH_R_IRIS_BOTTOM_CORNER]))
        / 2.f;
      auto interpupillaryDistance = vertices[FACEMESH_L_IRIS].dist(vertices[FACEMESH_R_IRIS]);
      auto interpupillaryDistanceInMM =
        ((0.0117f / leftIrisDiameter) + (0.0117f / rightIrisDiameter)) / 2;

      // Determining scale based off iris.
      auto leftIrisScale = 0.0117f / leftIrisDiameter;
      auto rightIrisScale = 0.0117f / rightIrisDiameter;
      Vector<String> lines = {
        format(
          "Mouth %.3f: %s",
          renderData.trackedFaces[i].expressionOutput.lipsDistance,
          renderData.trackedFaces[i].expressionOutput.mouthOpen ? "open" : "closed"),
        format(
          "Left eye %.3f %s",
          renderData.trackedFaces[i].expressionOutput.leftEyelidDistance,
          renderData.trackedFaces[i].expressionOutput.leftEyeOpen ? "open" : "closed"),
        format(
          "Right eye %.3f %s",
          renderData.trackedFaces[i].expressionOutput.rightEyelidDistance,
          renderData.trackedFaces[i].expressionOutput.rightEyeOpen ? "open" : "closed"),
        format(
          "Left eyebrow %.3f %s",
          renderData.trackedFaces[i].expressionOutput.nasalBridgeToLeftEyebrowDistance,
          renderData.trackedFaces[i].expressionOutput.leftEyebrowRaised ? "raised" : "lowered"),
        format(
          "Right eyebrow %.3f %s",
          renderData.trackedFaces[i].expressionOutput.nasalBridgeToRightEyebrowDistance,
          renderData.trackedFaces[i].expressionOutput.rightEyebrowRaised ? "raised" : "lowered"),
        format(
          "Head radian offset from forward: %.3f",
          renderData.trackedFaces[i].transform.rotation.radians(Quaternion(0.f, 0.f, 1.f, 0.f))),
        // Head distance could be used to make sure the user is within a certain z distance from
        // the camera for a more accurate IPD, still need to do some more testing with this.
        format(
          "Head distance: %.3fm",
          renderData.trackedFaces[i].transform.position.dist({0.f, 0.f, 0.f})
            * ((leftIrisScale + rightIrisScale) / 2.f)),
        format("Left Iris Scale %.3f", leftIrisScale),
        format("Right Iris Scale %.3f", rightIrisScale),
        format("IPD in local space %.3f", interpupillaryDistance),
        format("IPD from left iris %.3fmm", interpupillaryDistance * leftIrisScale * 1000.f),
        format("IPD from right iris %.3fmm", interpupillaryDistance * rightIrisScale * 1000.f),
        format(
          "IPD from head width %.3fmm",
          interpupillaryDistance
            * renderData.trackedFaces[i].transform.scale
            // convert to millimeters.
            * 1000.f),
        format("Final IPD: %.3fmm", renderData.trackedFaces[i].interpupillaryDistanceInMM),
      };

      allLines.insert(allLines.end(), lines.begin(), lines.end());
    };

    RGBA8888PlanePixelBuffer buffer(allLines.size() * 20 + 15, 400);
    auto cp = buffer.pixels();
    fill(Color::OFF_WHITE, cp);
    textBox(allLines, {0.0f, 0.0f}, 400, cp);
    scene()
      .find<Renderable>("face-events")
      .material()
      .colorTexture()
      ->setRgbaPixelBuffer(std::move(buffer));
  }

  ///////////// Camera View Update //////////////
  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  updateFaceMeshes(
    renderData.trackedFaces,
    &cameraScene,
    &renderedFaces_,
    {controlPanelConfig()[SHOW_FACE].val<bool>(),
     controlPanelConfig()[SHOW_EYES].val<bool>(),
     controlPanelConfig()[SHOW_MOUTH].val<bool>(),
     controlPanelConfig()[SHOW_IRIS].val<bool>()});

  updateDetections(renderData.localFaces, &cameraScene, &detections_, 3.0f);

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

void FaceTrackerView::resetScene() {
  // noop
}

void FaceTrackerView::renderDisplay(OmniscopeViewData *data) {
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

void FaceTrackerView::gotTouches(const Vector<Touch> &touches) {
  if (touches.size() == 2) {
    resetScene();
    return;
  }
}

void FaceTrackerView::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  renderer_ = std::make_unique<Renderer>();
  initRoiAndCameraScene(&scene(), deviceK_, 640);

  // Text box
  auto quadPos =
    HMatrixGen::translation(-0.6f, 0.6f, -1.0f) * HMatrixGen::scale(0.35f, 0.35f, 0.0f);
  scene()
    .add(ObGen::named(ObGen::positioned(ObGen::backQuad(), quadPos), "face-events"))
    .setMaterial(MatGen::image());
}

bool FaceTrackerView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;
}

}  // namespace c8
