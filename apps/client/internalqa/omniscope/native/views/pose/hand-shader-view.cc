// Copyright (c) 2023 Niantic Labs
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "hand-shader-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib/producers:hand-visible-data-producer",
    "//apps/client/internalqa/omniscope/native/lib/view-widgets:pose-widgets",
    "//apps/client/internalqa/omniscope/native/lib/view-widgets:control-panel-widgets",
    "//apps/client/internalqa/omniscope/native/lib:overlay-scene-manager",
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
    "//reality/engine/faces:face-geometry",
    "//reality/engine/hands/data:embedded-hand-mesh-model",
    "//reality/engine/hands:hand-detector-global",
    "//reality/engine/hands:hand-detector-local-mesh",
    "//reality/engine/hands:tracked-hand-state",
    "//third_party/mediapipe/models:palm-detection-embedded",
  };
}
cc_end(0x88198177);

#include "apps/client/internalqa/omniscope/native/lib/producers/hand-visible-data-producer.h"
#include "apps/client/internalqa/omniscope/native/lib/view-widgets/control-panel-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/view-widgets/pose-widgets.h"
#include "apps/client/internalqa/omniscope/native/views/pose/hand-shader-view.h"
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
#include "reality/engine/hands/data/embedded-hand-mesh-model.h"
#include "reality/engine/hands/hand-types.h"
#include "reality/engine/hands/tracked-hand-state.h"
#include "reality/engine/tracking/tracking-sensor-event.h"
#include "third_party/mediapipe/models/palm-detection-embedded.h"

namespace c8 {

namespace {
class RenderData : public CpuProcessingResult {
public:
  GlTexture edgeTex;
  GlTexture smoothTex;
  GlTexture finalTex;
};

constexpr const char *EDGE_SOFTNESS = "HandVisibleRenderer.edgeSoftness";
constexpr const char *EDGE_THRESHOLD = "HandVisibleRenderer.edgeThreshold";
constexpr const char *SMOOTH_INTENSITY = "HandVisibleRenderer.smoothIntensity";

}  // namespace

void HandShaderView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (shader_ == nullptr) {
    shader_.reset(new HandVisibleShader());
    shader_->initialize();
    checkGLError("[hand-dest-view] shader_.initialize");
  }
  deviceK_ = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(appConfig_.deviceModel),
    appConfig_.captureWidth,
    appConfig_.captureHeight);

  globalParams().getOrSet(EDGE_SOFTNESS, 6.78f);
  globalParams().getOrSet(EDGE_THRESHOLD, 0.15f);
  globalParams().getOrSet(SMOOTH_INTENSITY, 1.0f);
  controlPanelConfig()[EDGE_SOFTNESS] = ControlPanelElement::inputSlider(
    EDGE_SOFTNESS, globalParams().get<float>(EDGE_SOFTNESS), "", 1.f, 10.f);
  controlPanelConfig()[EDGE_THRESHOLD] = ControlPanelElement::inputSlider(
    EDGE_THRESHOLD, globalParams().get<float>(EDGE_THRESHOLD), "", 0.f, 1.f);
  controlPanelConfig()[SMOOTH_INTENSITY] = ControlPanelElement::inputSlider(
    SMOOTH_INTENSITY, globalParams().get<float>(SMOOTH_INTENSITY), "", 0.25f, 10.f);
}

void HandShaderView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::handVisibleObject8Renderer<RenderData>(
    appConfig_,
    appConfig_.captureWidth,
    appConfig_.captureHeight,
    shader_.get());
}

void HandShaderView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &producer = data->producer<HandVisibleDataProducer>();

  auto &renderData = data->cpuProcessingResult<RenderData>();
  renderData = {};  // Clear previous data.
  renderData.edgeTex = producer.renderer().edge();
  renderData.smoothTex = producer.renderer().smoothed();
  renderData.finalTex = producer.renderer().dest();
}

void HandShaderView::updateScene(OmniscopeViewData *data) {
  setGlobalParamFromConfig<float>(controlPanelConfig(), EDGE_SOFTNESS, &edgeSoftness_);
  setGlobalParamFromConfig<float>(controlPanelConfig(), EDGE_THRESHOLD, &edgeThreshold_);
  setGlobalParamFromConfig<float>(controlPanelConfig(), SMOOTH_INTENSITY, &smoothIntensity_);

  auto &renderData = data->cpuProcessingResult<RenderData>();
  auto &edgeScene = scene().find<Scene>("edge-view");
  auto &cameraScene = scene().find<Scene>("camera-view");
  auto &smoothScene = scene().find<Scene>("smooth-view");
  auto &finalScene = scene().find<Scene>("final-view");

  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  edgeScene.find<Renderable>("edge-quad").material().colorTexture()
    ->setNativeId(renderData.edgeTex.id());

  smoothScene.find<Renderable>("smooth-quad").material().colorTexture()
    ->setNativeId(renderData.smoothTex.id());

  finalScene.find<Renderable>("final-quad").material().colorTexture()
    ->setNativeId(renderData.finalTex.id());
}

void HandShaderView::resetScene() {
  // noop
}

void HandShaderView::renderDisplay(OmniscopeViewData *data) {
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

void HandShaderView::gotTouches(const Vector<Touch> &touches) {
  if (touches.size() == 2) {
    resetScene();
    return;
  }
}

void HandShaderView::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  renderer_ = std::make_unique<Renderer>();
  constexpr int capHeight = 640;
  constexpr int capWidth = 480;

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

  // edge version of the input
  auto &edgeScene = scene().add(ObGen::subScene("edge-view", {{capWidth, capHeight}}));
  edgeScene.add(ObGen::perspectiveCamera(deviceK_, capWidth, capHeight));
  edgeScene
    .add(
      ObGen::positioned(ObGen::named(ObGen::backQuad(), "edge-quad"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  // Blurred version of the input
  // NOTE(dat): we might able to just set the material of `dest-view-render` to our output tex
  auto &smoothScene = scene().add(ObGen::subScene("smooth-view", {{capWidth, capHeight}}));
  smoothScene.add(ObGen::perspectiveCamera(deviceK_, capWidth, capHeight));
  smoothScene
    .add(
      ObGen::positioned(ObGen::named(ObGen::backQuad(), "smooth-quad"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  // Final version of the input
  auto &finalScene = scene().add(ObGen::subScene("final-view", {{capWidth, capHeight}}));
  finalScene.add(ObGen::perspectiveCamera(deviceK_, capWidth, capHeight));
  finalScene
    .add(
      ObGen::positioned(ObGen::named(ObGen::backQuad(), "final-quad"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  ///////////// Composite View Setup: Set up the layout for both subscenes //////////////

  // Set the default renderSpec on the root scene
  SceneSize size2x2{2, 2};
  scene().setRenderSpecs({{size2x2().width, size2x2().height}});

  // Add a pixel camera which works with vertices in pixel space. For omniscope, this must have
  // flipY() applied.
  scene().add(ObGen::pixelCamera(size2x2())).flipY();

  scene().add(ObGen::named(ObGen::pixelQuad(size2x2.row0(0, 1)), "camera-view-render"))
    .setMaterial(MatGen::subsceneMaterial("camera-view"));

  scene()
    .add(ObGen::named(ObGen::pixelQuad(size2x2.row0(1, 1)), "edge-view-render"))
    .setMaterial(MatGen::subsceneMaterial("edge-view"));

  scene()
    .add(ObGen::named(ObGen::pixelQuad(size2x2.row1(0, 1)), "smooth-view-render"))
    .setMaterial(MatGen::subsceneMaterial("smooth-view"));

  scene()
    .add(ObGen::named(ObGen::pixelQuad(size2x2.row1(1, 1)), "final-view-render"))
    .setMaterial(MatGen::subsceneMaterial("final-view"));
}

bool HandShaderView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;
}

}  // namespace c8
