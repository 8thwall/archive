// Copyright (c) 2022 Niantic, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "semantics-cubemap-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//apps/client/internalqa/omniscope/native/lib/view-widgets:sensors-widgets",
    "//c8:c8-log",
    "//c8:color",
    "//c8:string",
    "//c8:vector",
    "//c8/geometry:vectors",
    "//c8/pixels:draw-figure",
    "//c8/pixels:draw2",
    "//c8/pixels:draw3-widgets",
    "//c8/pixels/opengl:gl-error",
    "//c8/pixels/opengl:gl-texture",
    "//c8/pixels:pixel-transforms",
    "//c8/stats:scope-timer",
    "//reality/engine/deepnets:multiclass-operations",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/tracking:tracker",
    "//reality/engine/semantics:semantics-classifier",
    "//reality/engine/semantics/data:embedded-semanticsnet-portrait",
    "//reality/engine/semantics:semantics-cubemap-renderer",
    "//reality/quality/synthetic:synthetic-scenes",
  };
}
cc_end(0xcc7cf686);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/sensors-widgets.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/semantics/semantics-cubemap-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/vectors.h"
#include "c8/pixels/draw-figure.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/draw3-widgets.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "reality/engine/deepnets/multiclass-operations.h"
#include "reality/engine/semantics/data/embedded-semanticsnet-portrait.h"
#include "reality/quality/synthetic/synthetic-scenes.h"

namespace c8 {

namespace {

class RenderData : public CpuProcessingResult {
public:
  HMatrix extrinsic = HMatrixGen::i();
};

constexpr float FRUSTUM_SCALE = 0.2f;
const char *SKIP_FRAME = "Update per X Frames";
const char *EDGE_SMOOTHNESS = "Edge Smoothness";
const char *HAVE_SEEN_SKY = "Have Seen Sky";
const char *FLIP_MASK = "Flip Mask";
}  // namespace

void SemanticsCubemapView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  // initialize semantics classifier
  if (!semClassifier_) {
    const Vector<uint8_t> tfliteFile(
      embeddedSemanticsMobilenetv3SeparableQuarterFp16TfliteData,
      embeddedSemanticsMobilenetv3SeparableQuarterFp16TfliteData
        + embeddedSemanticsMobilenetv3SeparableQuarterFp16TfliteSize);
    semClassifier_ = std::make_unique<SemanticsClassifier>(tfliteFile);
  }

  // compute semantics result dimension without letterbox
  int height = semClassifier_->getInputHeight();
  int width = semClassifier_->getInputWidth();
  const bool isPortrait =
    (semClassifier_->getOrientation() == SemanticsClassifier::InputOrientation::PORTRAIT);
  int capWidth = isPortrait ? appConfig_.captureWidth : appConfig_.captureHeight;
  int capHeight = isPortrait ? appConfig_.captureHeight : appConfig_.captureWidth;
  letterboxDimensionSameAspectRatio(
    capWidth, capHeight, width, height, &semanticsWidth_, &semanticsHeight_);

  tracker_.reset(new Tracker());

  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
    checkGLError("[semantics-cubemap-view] glShader_.initialize");
  }

  if (!cubemapRenderer_) {
    cubemapRenderer_.reset(new SemanticsCubemapRenderer());
  }

  frameIndex_ = 0;

  // Creating intSlider to set skip frames
  controlPanelConfig()[SKIP_FRAME] =
    ControlPanelElement::intSlider(SKIP_FRAME, skipFrameCount_, "Number of frames to skip", 0, 15);
  controlPanelConfig()[EDGE_SMOOTHNESS] =
    ControlPanelElement::slider(EDGE_SMOOTHNESS, .5f, "", 0.0f, 1.0f);
  controlPanelConfig()[HAVE_SEEN_SKY] =
    ControlPanelElement::checkBox(HAVE_SEEN_SKY, true, "Is Sky Seen");
  controlPanelConfig()[FLIP_MASK] =
    ControlPanelElement::checkBox(FLIP_MASK, false, "Flip Alpha Mask");
}

void SemanticsCubemapView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::sceneRenderer<RenderData>(appConfig_, 1600, 640);
  auto inWidth = semClassifier_->getInputWidth();
  auto inHeight = semClassifier_->getInputHeight();
  dataPtr->addProducer(std::make_unique<ResizedDataProducer>(appConfig_, inWidth, inHeight));
  dataPtr->addProducer(std::make_unique<FeaturesDataProducer>(appConfig_, glShader_.get()));
}

void SemanticsCubemapView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &featureProducer = data->producer<FeaturesDataProducer>();
  auto &renderData = data->cpuProcessingResult<RenderData>();
  renderData = {};

  ////////////////////////////////////////////////////////////////////////
  // CPU tracking.
  ////////////////////////////////////////////////////////////////////////
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
  renderData.extrinsic = tracker_->track(trackerInput, {}, &random_, status.builder());

  // check if can skip
  skipFrameCount_ = controlPanelConfig()[SKIP_FRAME].val<int>();
  const bool needUpdateCubemap = (skipFrameCount_ == 0) || (frameIndex_ % skipFrameCount_ == 0);

  // edge feathering
  float edgeSmoothness = controlPanelConfig()[EDGE_SMOOTHNESS].val<float>();
  bool haveSeenSky = controlPanelConfig()[HAVE_SEEN_SKY].val<bool>();
  bool flipAlphaMask = controlPanelConfig()[FLIP_MASK].val<bool>();
  cubemapRenderer_->setSkyPostProcessParameters(edgeSmoothness, haveSeenSky, flipAlphaMask);

  // Processing semantics from classifier.
  if (needUpdateCubemap) {
    ScopeTimer t2("semantics-classifier");
    auto &resizedDataProducer = data->producer<ResizedDataProducer>();

    // Classifier image into semantics.
    semClassifier_->generateSemantics(resizedDataProducer.image(), semanticsRes_, {});

    // Writes images for the desired semantics class.
    // Reallocate if necessary.
    if (
      singleSemBuffer_.pixels().rows() != semanticsHeight_
      || singleSemBuffer_.pixels().cols() != semanticsWidth_) {
      singleSemBuffer_ = RGBA8888PlanePixelBuffer(semanticsHeight_, semanticsWidth_);
    }

    auto outPix = singleSemBuffer_.pixels();
    // map for selected class
    floatToRgbaGrayRemoveLetterbox(semanticsRes_[semanticClass_], &outPix, 0.0f, 1.0f);

    if (semClassifier_->getOrientation() == SemanticsClassifier::InputOrientation::PORTRAIT) {
      cubemapRenderer_->updateSrcTexture(singleSemBuffer_.pixels());
    } else {
      // rotate 90 degree cw to generate mask aligned with camera capture texture
      if (
        uprightSemBuffer_.pixels().rows() != semanticsWidth_
        || uprightSemBuffer_.pixels().cols() != semanticsHeight_) {
        uprightSemBuffer_ = RGBA8888PlanePixelBuffer(semanticsWidth_, semanticsHeight_);
      }
      auto srcPtr = singleSemBuffer_.pixels().pixels();
      auto desPtr = uprightSemBuffer_.pixels().pixels();
      auto srcRowBytes = 4 * semanticsWidth_;
      for (int r = 0; r < semanticsWidth_; ++r) {
        auto srcp = srcPtr + (semanticsHeight_ - 1) * srcRowBytes + 4 * r;
        auto dstp = desPtr + 4 * r * semanticsHeight_;
        for (int c = 0; c < semanticsHeight_; ++c) {
          dstp[0] = srcp[0];
          dstp[1] = srcp[1];
          dstp[2] = srcp[2];
          dstp[3] = srcp[3];
          dstp += 4;
          srcp -= srcRowBytes;
        }
      }
      cubemapRenderer_->updateSrcTexture(uprightSemBuffer_.pixels());
    }
  }

  // Draw features onto texture.
  if (needUpdateCubemap) {
    cubemapRenderer_->renderToCubemap(renderData.extrinsic);
  }

  frameIndex_++;
}

void SemanticsCubemapView::updateScene(OmniscopeViewData *data) {
  const auto &renderData = data->cpuProcessingResult<RenderData>();

  auto &worldScene = scene().find<Scene>("world-view");
  auto &cameraScene = scene().find<Scene>("camera-view");
  auto &semanticsScene = scene().find<Scene>("semantics-view");
  auto &skyScene = scene().find<Scene>("sky-semantics-view");

  ///////////// World View Update //////////////
  worldScene.find<Group>("frustum").setLocal(renderData.extrinsic);

  auto &backCube = worldScene.find<Renderable>("environment");
  auto bkgTexture = backCube.material().colorTexture();
  bkgTexture->setNativeId(cubemapRenderer_->cubemapTex().id());

  ///////////// Camera View Update //////////////
  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  ///////////// Semantics Mask View Update //////////////
  semanticsScene.find<Renderable>("semantics-feed")
    .material()
    .colorTexture()
    ->setRgbaPixels(singleSemBuffer_.pixels());

  ///////////// Semantics Rendering View Update //////////////
  cubemapRenderer_->setDeviceOrientation(90);

  cubemapRenderer_->drawOutputSemantics(
    renderData.extrinsic, renderedSemTex_.id(), renderedSemTex_.width(), renderedSemTex_.height());
  skyScene.find<Renderable>("semantics-rendered")
    .material()
    .colorTexture()
    ->setNativeId(renderedSemTex_.id());
}

void SemanticsCubemapView::renderDisplay(OmniscopeViewData *data) {
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

void SemanticsCubemapView::initializeScene(OmniscopeViewData *data) {
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
      HMatrixGen::translation(1.07, 0.1, -3.36889)
        * Quaternion(0.985221, 0.0033495, -0.171252, 0.000582213).toRotationMat()));

  // Create the environment using cubemap.
  auto &backCube = worldScene.add(
    ObGen::named(
      ObGen::positioned(ObGen::cubemapMesh(), HMatrixGen::scale(400.0f)), "environment"));
  auto bkgTexture = backCube.material().colorTexture();
  bkgTexture->setNativeTarget(cubemapRenderer_->cubemapTex().textureTarget());
  bkgTexture->setNativeId(cubemapRenderer_->cubemapTex().id());

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

  ///////////// Camera View Setup: Shows the camera feed and a 1st person view //////////////
  auto &cameraScene = scene().add(ObGen::subScene("camera-view", {{240, 320}}));

  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  cameraScene.add(ObGen::perspectiveCamera(captureIntrinsics, 240, 320));

  // Add the background camera feed. This needs to have y inverted because the input texture was
  // inverted.
  cameraScene
    .add(
      ObGen::positioned(ObGen::named(ObGen::backQuad(), "camerafeed"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  ///////////// Semantics View Setup: Shows the semantics inference result //////////////
  auto &semanticsScene = scene().add(ObGen::subScene("semantics-view", {{240, 320}}));

  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  semanticsScene.add(ObGen::perspectiveCamera(captureIntrinsics, 240, 320));

  // Add the background camera feed. This needs to have y inverted because the input texture was
  // inverted.
  auto semPos = HMatrixGen::scaleY(-1.0f);
  semanticsScene.add(ObGen::positioned(ObGen::named(ObGen::backQuad(), "semantics-feed"), semPos))
    .setMaterial(MatGen::image());

  ///////////// Sky Semantics camera rendering Output Setup //////////////
  auto &skySemanticScene = scene().add(ObGen::subScene("sky-semantics-view", {{480, 640}}));

  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  semPos = HMatrixGen::scaleY(-1.0f);
  if (semClassifier_->getOrientation() == SemanticsClassifier::InputOrientation::PORTRAIT) {
    semPos = semPos * HMatrixGen::z90();
  }
  skySemanticScene.add(ObGen::perspectiveCamera(captureIntrinsics, 480, 640));
  skySemanticScene
    .add(ObGen::positioned(ObGen::named(ObGen::backQuad(), "semantics-rendered"), semPos))
    .setMaterial(MatGen::image());

  cubemapRenderer_->initOutputSemanticsScene(captureIntrinsics, 480, 640);

  renderedSemTex_ = makeLinearRGBA8888Texture2D(480, 640);

  int cropW = 0;
  int cropH = 0;
  cropDimensionByAspectRatio(480, 640, 9.0 / 16.0, &cropW, &cropH);
  auto projIntrinsics = Intrinsics::rotateCropAndScaleIntrinsics(captureIntrinsics, cropW, cropH);
  cubemapRenderer_->setProjectionIntrinsics(projIntrinsics);

  ///////////// Composite View Setup: Set up the layout for three subscenes //////////////

  // Set the default renderSpec on the root scene
  scene().setRenderSpecs({{1680, 640}});

  // Add a pixel camera which works with vertices in pixel space. For omniscope, this must have
  // flipY() applied.
  scene().add(ObGen::pixelCamera(1680, 640)).flipY();

  // Render the world view to a quad on the left two thirds.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(0, 0, 960, 640), "world-view-render"))
    .setMaterial(MatGen::subsceneMaterial("world-view"));

  // Render the camera view.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(960, 320, 240, 320), "camera-view-render"))
    .setMaterial(MatGen::subsceneMaterial("camera-view"));

  // Render a single semantic output.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(960, 0, 240, 320), "semantics-view-render"))
    .setMaterial(MatGen::subsceneMaterial("semantics-view"));

  // Render sky semantics result
  scene()
    .add(ObGen::named(ObGen::pixelQuad(1200, 0, 480, 640), "sky-semantics-render"))
    .setMaterial(MatGen::subsceneMaterial("sky-semantics-view"));
}

bool SemanticsCubemapView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;  // Only update if needed.
}

}  // namespace c8
