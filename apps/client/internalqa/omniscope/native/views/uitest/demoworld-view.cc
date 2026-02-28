// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "demoworld-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:overlay-scene-manager",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//apps/client/internalqa/omniscope/native/lib/view-widgets:sensors-widgets",
    "//c8:c8-log",
    "//c8:color",
    "//c8:hpoint",
    "//c8/geometry:intrinsics",
    "//c8/geometry:vectors",
    "//c8:string",
    "//c8:vector",
    "//c8/pixels:draw3-widgets",
    "//c8/pixels/opengl:gl-error",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/tracking:tracking-sensor-event",
    "//reality/engine/tracking:tracker",
  };
}
cc_end(0x044b3b98);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/sensors-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/uitest/demoworld-view.h"
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
#include "reality/engine/tracking/tracking-sensor-event.h"

namespace c8 {

constexpr const char *ROTATE_LIGHT = "Rotate light";
constexpr const char *DIRECTIONAL_LIGHTS = "Directional";
const Vector<String> DIRS = {"0", "x", "-x", "y", "-y", "z", "-z"};

namespace {
class RenderData : public CpuProcessingResult {
public:
  HMatrix extrinsic = HMatrixGen::i();
};

float FRUSTUM_SCALE = 0.2f;
}  // namespace

void DemoWorldView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  tracker_.reset(new Tracker());

  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
    checkGLError("[vio-view] glShader_.initialize");
  }

  controlPanelConfig()[ROTATE_LIGHT] = ControlPanelElement::checkBox(
    ROTATE_LIGHT, true, "Should the light continously rotate around the cube.");
  controlPanelConfig()[DIRECTIONAL_LIGHTS] =
    ControlPanelElement::radioButton(DIRECTIONAL_LIGHTS, 0, DIRS);
}

void DemoWorldView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::featuresObject8Renderer<RenderData>(
    appConfig_, appConfig_.captureWidth, appConfig_.captureHeight, glShader_.get());
}

void DemoWorldView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  // Draw features onto texture.
  auto l0 = featureProducer.pyramid().levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);

  MutableRootMessage<RequestSensor> requestSensor;
  fillRequestSensorMessage(*data, requestSensor.builder());

  TrackingSensorFrame trackerInput;
  prepareTrackingSensorFrame(
    appConfig_.deviceModel,
    appConfig_.deviceManufacturer,
    intrinsics,
    requestSensor.reader(),
    &trackerInput);
  trackerInput.pyramid = featureProducer.pyramid();
  trackerInput.devicePose = data->devicePose();
  trackerInput.timeNanos = data->timeNanos();

  MutableRootMessage<XrTrackingState> status;
  auto &renderData = data->cpuProcessingResult<RenderData>();
  renderData = {};  // Clear previous data.
  renderData.extrinsic = tracker_->track(trackerInput, {}, &random_, status.builder());
}

void DemoWorldView::updateScene(OmniscopeViewData *data) {
  auto &renderData = data->cpuProcessingResult<RenderData>();
  auto &worldScene = scene().find<Scene>("world-view");
  auto &cameraScene = scene().find<Scene>("camera-view");

  ///////////// World View Update //////////////
  worldScene.find<Group>("frustum").setLocal(renderData.extrinsic);

  if (controlPanelConfig()[ROTATE_LIGHT].val<bool>()) {
    float lightX = 2.f * sin(counter / 50.f);
    float lightZ = 2.f * cos(counter / 50.f);
    auto p = rotatingOrigin.translate(lightX, 0.f, lightZ);
    worldScene.find<Light>("rotating-point-light").setLocal(p);
    counter++;
  }

  int val = controlPanelConfig()[DIRECTIONAL_LIGHTS].val<int>();
  for (int i = 0; i < DIRS.size(); ++i) {
    worldScene.find<Light>(DIRS[i]).setEnabled(val == i);
  }

  auto &cube = worldScene.find<Renderable>("image-cube");
  cube.material().colorTexture()->setNativeId(data->cameraTexture());

  ///////////// Camera View Update //////////////
  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());
}

void DemoWorldView::resetScene() {
  std::lock_guard<std::mutex> lock(touchMtx_);
  C8Log("[demoworld-view] %s", "Tracker Reset");
  tracker_.reset(new Tracker());
}

void DemoWorldView::renderDisplay(OmniscopeViewData *data) {
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

void DemoWorldView::gotTouches(const Vector<Touch> &touches) {
  if (touches.size() == 2) {
    resetScene();
    return;
  }
  hideImage_ = !hideImage_;
}

void DemoWorldView::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  renderer_ = std::make_unique<Renderer>();

  ///////////// World View Setup: Shows a 3rd person view of the scene //////////////

  // Set up the "world-view" subscene, which can have its camera contorlled by user mouse input.
  auto &worldScene = scene().add(ObGen::subScene("world-view", {{960, 640}}));

  // Create a scene camera with field of view matched to the device, initially placed to the left
  // and forward of the user's starting position so that we can see the user's camera as the scene
  // starts.
  auto captureIntrinsics = Intrinsics::getCameraIntrinsics(appConfig_.deviceModel);
  worldScene.add(
    ObGen::positioned(
      ObGen::perspectiveCamera(captureIntrinsics, 960, 640),
      HMatrixGen::translation(-5.0f, 1.0f, 2.0f) * HMatrixGen::zDegrees(-15.0f)
        * HMatrixGen::yDegrees(90.0f)));

  // Create the environment background.
  auto &backQuad =
    worldScene.add(ObGen::named(ObGen::backQuad(), "environment")).setMaterial(MatGen::colorOnly());
  backQuad.geometry().setColors({Color::GRAY_03, Color::GRAY_04, Color::GRAY_05, Color::GRAY_05});

  // Create an axis visualization.
  worldScene.add(ObGen::named(orientedPoint({0.0f, -1.0f, 0.0f}, {}, 0.5f), "origin"));

  // Add floor visualization.
  worldScene.add(
    ObGen::named(
      ObGen::positioned(groundLineGrid(11, 1.0f), HMatrixGen::translateY(-1.001f)), "ground"));

  // Add ground height visualization.
  worldScene
    .add(
      ObGen::named(
        ObGen::positioned(groundLineGrid(11, 1.0f, 1.0f, true), HMatrixGen::translateY(-1.001f)),
        "groundHeight"))
    .setEnabled(false);

  // Add a visualization of the user's camera's view frustum.
  worldScene.add(ObGen::named(frustum(captureIntrinsics, Color::MINT, FRUSTUM_SCALE), "frustum"));

  // Ambient lighting.
  worldScene.add(ObGen::ambientLight(Color::WHITE, .8f));

  // Rotating light + cube.
  {
    auto &cube = worldScene.add(ObGen::positioned(ObGen::cubeMesh(), rotatingOrigin));
    cube.geometry().setColor(Color::BLUE);

    worldScene.add(
      ObGen::positioned(
        ObGen::named(ObGen::pointLight(Color::YELLOW, 1.f, true), "rotating-point-light"),
        rotatingOrigin));
  }

  // Arrangement of lights + cube.
  {
    auto cubePos = HMatrixGen::translation(2.f, -1.f, 4.f) * HMatrixGen::yDegrees(45.0f);
    auto &cube =
      worldScene.add(ObGen::named(ObGen::positioned(ObGen::cubeMesh(), cubePos), "image-cube"));
    cube.geometry().setColor(Color::YELLOW);
    cube.material().setColorTexture(TexGen::empty());
    Vector<Color> colors = {
      Color::OFF_WHITE,
      Color::MATCHA,
      Color::PINK,
      Color::YELLOW,
      Color::VIBRANT_BLUE,
      Color::CHERRY,
      Color::MANGO,
      Color::MINT};
    int i = 0;
    for (int x = -1; x <= 1; x++) {
      for (int z = -1; z <= 1; z++) {
        if (x == 0 && z == 0) {
          continue;
        }
        auto p = cubePos.translate(1.1f * x, 0.f, 1.1f * z);
        worldScene.add(ObGen::positioned(ObGen::pointLight(colors[i++], 1.f, true), p));
      }
    }
  }

  // Directional light.
  {
    worldScene.add(ObGen::named(ObGen::directionalLight(Color::PURPLE, 1.f, true), "0"))
      .setEnabled(false);
    worldScene
      .add(
        ObGen::positioned(
          ObGen::named(ObGen::directionalLight(Color::RED, 1.f, true), "-x"),
          rotationToVector({-1.f, 0.f, 0.f}).toRotationMat()))
      .setEnabled(false);
    worldScene
      .add(
        ObGen::positioned(
          ObGen::named(ObGen::directionalLight(Color::CHERRY, 1.f, true), "x"),
          rotationToVector({1.f, 0.f, 0.f}).toRotationMat()))
      .setEnabled(false);
    worldScene
      .add(
        ObGen::positioned(
          ObGen::named(ObGen::directionalLight(Color::GREEN, 1.f, true), "-y"),
          rotationToVector({0.f, -1.f, 0.f}).toRotationMat()))
      .setEnabled(false);
    worldScene
      .add(
        ObGen::positioned(
          ObGen::named(ObGen::directionalLight(Color::MINT, 1.f, true), "y"),
          rotationToVector({0.f, 1.f, 0.f}).toRotationMat()))
      .setEnabled(false);
    worldScene
      .add(
        ObGen::positioned(
          ObGen::named(ObGen::directionalLight(Color::BLUE, 1.f, true), "-z"),
          rotationToVector({0.f, 0.f, -1.f}).toRotationMat()))
      .setEnabled(false);
    worldScene
      .add(
        ObGen::positioned(
          ObGen::named(ObGen::directionalLight(Color::PURPLE, 1.f, true), "z"),
          rotationToVector({0.f, 0.f, 1.f}).toRotationMat()))
      .setEnabled(false);
  }

  ///////////// Camera View Setup: Shows the camera feed and a 1st person view //////////////

  auto &cameraScene = scene().add(ObGen::subScene("camera-view", {{480, 640}}));

  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  cameraScene.add(ObGen::perspectiveCamera(captureIntrinsics, 480, 640));

  // Add the background camera feed. This needs to have y inverted because the input texture was
  // inverted.
  cameraScene
    .add(
      ObGen::positioned(ObGen::named(ObGen::backQuad(), "camerafeed"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  ///////////// Composite View Setup: Set up the layout for both subscenes //////////////

  // Set the default renderSpec on the root scene
  scene().setRenderSpecs({{1440, 640}});

  // Add a pixel camera which works with vertices in pixel space. For omniscope, this must have
  // flipY() applied.
  scene().add(ObGen::pixelCamera(1440, 640)).flipY();

  // Render the world view to a quad on the left two thirds.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(0, 0, 960, 640), "world-view-render"))
    .setMaterial(MatGen::subsceneMaterial("world-view"));

  // Render the camera view to a quad on the right third.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(960, 0, 480, 640), "camera-view-render"))
    .setMaterial(MatGen::subsceneMaterial("camera-view"));
}

bool DemoWorldView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  // If we are continously rotating the light we need to rerender on every update.
  return controlPanelConfig()[ROTATE_LIGHT].val<bool>();
}

}  // namespace c8
