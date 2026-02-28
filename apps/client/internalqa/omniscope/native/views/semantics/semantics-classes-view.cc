// Copyright (c) 2022 Niantic, Inc.
// Original Author: Lynn Dang (lynndang@nianticlabs.com)
//
// Creates two visualizations for the semantics generator. One is the semantic scores per class,
// and the other is for the max of the semantic scores.

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "semantics-classes-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//c8:c8-log",
    "//c8:color",
    "//c8:string",
    "//c8:vector",
    "//c8/geometry:vectors",
    "//c8/pixels:draw-figure",
    "//c8/pixels:draw2",
    "//c8/pixels:pixel-buffers",
    "//c8/pixels/opengl:gl-error",
    "//c8/stats:scope-timer",
    "//reality/engine/deepnets:multiclass-operations",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/semantics:semantics-classifier",
    "//reality/engine/semantics/data:embedded-semanticsnet-portrait",
    "//reality/quality/synthetic:synthetic-scenes",
  };
}
cc_end(0xe557efe0);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/semantics/semantics-classes-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/vectors.h"
#include "c8/pixels/draw-figure.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/pixel-buffers.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "reality/engine/deepnets/multiclass-operations.h"
#include "reality/engine/semantics/data/embedded-semanticsnet-portrait.h"
#include "reality/quality/synthetic/synthetic-scenes.h"

namespace c8 {

namespace {

class RenderData : public CpuProcessingResult {
public:
  // Holds the visual representations of the semantic scores for each class.
  RGBA8888PlanePixels singleSemanticsMap;

  // Holds the visual representation of the max semantics scores recorded in the log.
  RGBA8888PlanePixels maxSemanticsMap;
};

const char *SEMANTICS_CLASS = "Semantics Class";

}  // namespace

SemanticsClassesView::SemanticsClassesView() { copyTexture_ = compileCopyTexture2D(); }

void SemanticsClassesView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (!semClassifier_) {
    const Vector<uint8_t> tfliteFile(
      embeddedSemanticsMobilenetv3SeparableQuarterFp16TfliteData,
      embeddedSemanticsMobilenetv3SeparableQuarterFp16TfliteData
        + embeddedSemanticsMobilenetv3SeparableQuarterFp16TfliteSize);
    semClassifier_ = std::make_unique<SemanticsClassifier>(tfliteFile);
    semNumClasses_ = semClassifier_->getNumberOfClasses();
  }

  // Creating class selector for the single semantics view.
  controlPanelConfig()[SEMANTICS_CLASS] =
    ControlPanelElement::listBox(SEMANTICS_CLASS, classDisplay_, SEMANTICS_CLASS_STRINGS);
}

void SemanticsClassesView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::sceneRenderer<RenderData>(appConfig_, 1440, 640);
  auto capW = dataPtr->captureWidth();
  auto capH = dataPtr->captureHeight();
  auto inputWidth = semClassifier_->getInputWidth();
  auto inputHeight = semClassifier_->getInputHeight();
  float ratioW = static_cast<float>(inputWidth) / static_cast<float>(capW);
  float ratioH = static_cast<float>(inputHeight) / static_cast<float>(capH);
  float ratio = std::max(ratioW, ratioH);
  int resizeW = static_cast<int>(capW * ratio);
  int resizeH = static_cast<int>(capH * ratio);

  // downsize image to be larger than input dimension 144*256
  dataPtr->addProducer(std::make_unique<ResizedDataProducer>(appConfig_, resizeW, resizeH));
}

void SemanticsClassesView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");

  auto &renderData = data->cpuProcessingResult<RenderData>();

  // Processing semantics from classifier.
  {
    ScopeTimer t2("semantics-classifier");
    auto &resizedDataProducer = data->producer<ResizedDataProducer>();

    int height = semClassifier_->getInputHeight();
    int width = semClassifier_->getInputWidth();
    int resizedH = resizedDataProducer.image().rows();
    int resizedW = resizedDataProducer.image().cols();
    C8Log(
      "[semantics view] height %d, width %d, resized H %d, resized W %d",
      height,
      width,
      resizedH,
      resizedW);

    auto pix = resizedDataProducer.image();
    if (
      resizedImageBuffer_.pixels().rows() != height
      && resizedImageBuffer_.pixels().cols() != width) {
      resizedImageBuffer_ = RGBA8888PlanePixelBuffer(height, width);
    }
    // crop middle part to resizedImageBuffer_
    int xoffset = (resizedW - width) / 2;
    int yoffset = (resizedH - height) / 2;
    copyPixelBufferSubImage(
      resizedDataProducer.image(), xoffset, yoffset, 0, 0, width, height, resizedImageBuffer_);

    // Classifier image into semantics.
    semClassifier_->generateSemantics(resizedImageBuffer_.pixels(), semanticsRes_, {});

    // Writes images for each of the class scores.
    // Reallocate if necessary.
    if (singleSemBuffer_.pixels().rows() != height || singleSemBuffer_.pixels().cols() != width) {
      singleSemBuffer_ = RGBA8888PlanePixelBuffer(height, width);
    }

    classDisplay_ = controlPanelConfig()[SEMANTICS_CLASS].val<int>();
    auto outPix = singleSemBuffer_.pixels();
    floatToRgba(semanticsRes_[classDisplay_], &outPix, VIRIDIS_RGB_256, 0.5, 0.75);

    renderData.singleSemanticsMap = singleSemBuffer_.pixels();

    // Writes a single image displaying max of all classes together.
    // Reallocate maxSemanticsMap if necessary.
    if (maxSemBuffer_.pixels().rows() != height || maxSemBuffer_.pixels().cols() != width) {
      maxSemBuffer_ = RGBA8888PlanePixelBuffer(height, width);
    }
    outPix = maxSemBuffer_.pixels();
    maxMultiClassMap(semanticsRes_, semNumClasses_, outPix);
    renderData.maxSemanticsMap = outPix;
  }
}

void SemanticsClassesView::updateScene(OmniscopeViewData *data) {
  const auto &renderData = data->cpuProcessingResult<RenderData>();
  const auto &maxSemanticsMap = renderData.maxSemanticsMap;
  const auto &semanticMap = renderData.singleSemanticsMap;

  auto &cameraScene = scene().find<Scene>("camera-view");
  auto &semanticsScene = scene().find<Scene>("semantics-view");
  auto &maxSemanticsScene = scene().find<Scene>("max-semantics-view");

  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  semanticsScene.find<Renderable>("semantics-feed")
    .material()
    .colorTexture()
    ->setRgbaPixels(semanticMap);

  maxSemanticsScene.find<Renderable>("max-semantics-feed")
    .material()
    .colorTexture()
    ->setRgbaPixels(maxSemanticsMap);
}

void SemanticsClassesView::renderDisplay(OmniscopeViewData *data) {
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

void SemanticsClassesView::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  renderer_ = std::make_unique<Renderer>();

  ///////////// Camera View Setup: Shows the camera feed and a 1st person view //////////////

  auto &cameraScene = scene().add(ObGen::subScene("camera-view", {{480, 640}}));

  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  auto captureIntrinsics = Intrinsics::getCameraIntrinsics(appConfig_.deviceModel);
  cameraScene.add(ObGen::perspectiveCamera(captureIntrinsics, 480, 640));

  // Add the background camera feed. This needs to have y inverted because the input texture was
  // inverted.
  cameraScene
    .add(
      ObGen::positioned(ObGen::named(ObGen::backQuad(), "camerafeed"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  ///////////// Single Semantics Output Setup //////////////
  auto &singleSemanticScene = scene().add(ObGen::subScene("semantics-view", {{360, 640}}));

  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  singleSemanticScene.add(ObGen::perspectiveCamera(captureIntrinsics, 360, 640));

  // Add the semantics feed for a single class. This needs to have y inverted because the input
  // texture was inverted.
  auto semPos = HMatrixGen::i();
  if (semClassifier_->getOrientation() == SemanticsClassifier::InputOrientation::LANDSCAPE_LEFT) {
    semPos = HMatrixGen::HMatrixGen::z270() * semPos;
  }
  singleSemanticScene
    .add(ObGen::positioned(
      ObGen::named(ObGen::backQuad(), "semantics-feed"), semPos * HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  ///////////// Max Semantics Output Setup //////////////

  auto &maxSemanticsScene = scene().add(ObGen::subScene("max-semantics-view", {{360, 640}}));

  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  maxSemanticsScene.add(ObGen::perspectiveCamera(captureIntrinsics, 360, 640));

  // Add the max semantics feed. This needs to have y inverted because the input texture was
  // inverted.
  maxSemanticsScene
    .add(ObGen::positioned(
      ObGen::named(ObGen::backQuad(), "max-semantics-feed"), semPos * HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  ///////////// Composite View Setup: Set up the layout for both subscenes //////////////

  // Set the default renderSpec on the root scene
  scene().setRenderSpecs({{1200, 640}});

  // Add a pixel camera which works with vertices in pixel space. For omniscope, this must have
  // flipY() applied.
  scene().add(ObGen::pixelCamera(1200, 640)).flipY();

  // Render the camera view.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(0, 0, 480, 640), "camera-view-render"))
    .setMaterial(MatGen::subsceneMaterial("camera-view"));

  // Render a single semantic output.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(480, 0, 360, 640), "semantics-render"))
    .setMaterial(MatGen::subsceneMaterial("semantics-view"));

  // Render the max semantic output.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(840, 0, 360, 640), "max-semantics-render"))
    .setMaterial(MatGen::subsceneMaterial("max-semantics-view"));
}

bool SemanticsClassesView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;  // Only update if needed.
}

void SemanticsClassesView::gotTouches(const Vector<Touch> &touches) {
  classDisplay_ = (classDisplay_ + 1) % semNumClasses_;
  controlPanelConfig()[SEMANTICS_CLASS].setVal(classDisplay_);
}

}  // namespace c8
