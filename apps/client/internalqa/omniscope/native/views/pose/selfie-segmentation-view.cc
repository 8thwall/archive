// Copyright (c) 2023 Niantic, Inc.
// Original Author: Lynn Dang (lynndang@nianticlabs.com)
//
// Creates two visualizations for the selfie segmentation generator. One is the selfie segmentation
// scores per class, and the other is for the max of the segmentation scores.

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "selfie-segmentation-view.h",
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
    "//reality/engine/selfie-segmentation:selfie-segmentation",
    "//reality/engine/selfie-segmentation/data:embedded-selfiemulticlass",
    "//reality/quality/synthetic:synthetic-scenes",
  };
}
cc_end(0xc46df1ab);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/pose/selfie-segmentation-view.h"
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
#include "reality/engine/selfie-segmentation/data/embedded-selfiemulticlass.h"
#include "reality/quality/synthetic/synthetic-scenes.h"

namespace c8 {

namespace {

class RenderData : public CpuProcessingResult {
public:
  // Holds the visual representations of the semantic scores for each class.
  RGBA8888PlanePixels singleSegmentationMap;

  // Holds the visual representation of the max semantics scores recorded in the log.
  RGBA8888PlanePixels maxSegmentationMap;

  // Holds the resized camera feed input sent to the network for debugging purposes.
  RGBA8888PlanePixels camerafeedPixels;
};

const char *SELFIE_CLASS = "Selfie Segmentation View";

const Vector<String> SELFIE_CLASS_STRINGS = {
  "Background", "Hair", "Body Skin", "Face Skin", "Clothes", "Others"};

}  // namespace

SelfieSegmentationView::SelfieSegmentationView() { copyTexture_ = compileCopyTexture2D(); }

void SelfieSegmentationView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (!classifier_) {
    const Vector<uint8_t> tfliteFile(
      embeddedSelfieMulticlass256x256TfliteData,
      embeddedSelfieMulticlass256x256TfliteData + embeddedSelfieMulticlass256x256TfliteSize);
    classifier_.reset(new SelfieSegmentation(tfliteFile));
    segNumClasses_ = classifier_->getNumberOfClasses();
  }

  // Creating class selector for the single semantics view.
  controlPanelConfig()[SELFIE_CLASS] =
    ControlPanelElement::listBox(SELFIE_CLASS, classDisplay_, SELFIE_CLASS_STRINGS);
}

void SelfieSegmentationView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::sceneRenderer<RenderData>(appConfig_, 1440, 640);
  auto capW = dataPtr->captureWidth();
  auto capH = dataPtr->captureHeight();

  auto inputWidth = classifier_->getInputWidth();
  auto inputHeight = classifier_->getInputHeight();
  float ratio = static_cast<float>(capW) / static_cast<float>(capH);
  auto resizedW = classifier_->getInputHeight() * ratio;
  auto resizedH = classifier_->getInputHeight();

  if (
    resizedImageBuffer_.pixels().rows() != resizedH
    && resizedImageBuffer_.pixels().cols() != resizedW) {
    resizedImageBuffer_ = RGBA8888PlanePixelBuffer(resizedH, resizedW);
  }

  // Scale the image to be 256 x 256
  dataPtr->addProducer(std::make_unique<ResizedDataProducer>(appConfig_, inputWidth, inputHeight));
}

void SelfieSegmentationView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");

  auto &renderData = data->cpuProcessingResult<RenderData>();

  // Processing segmentation from classifier.
  {
    ScopeTimer t2("segmentation-classifier");
    auto &resizedDataProducer = data->producer<ResizedDataProducer>();

    int height = classifier_->getInputHeight();
    int width = classifier_->getInputWidth();
    int resizedH = resizedImageBuffer_.pixels().rows();
    int resizedW = resizedImageBuffer_.pixels().cols();

    auto pix = resizedDataProducer.image();

    // Crop middle part to resizedImageBuffer_, only showing the camera feed without additional
    // space.
    int xoffset = (width - resizedW) / 2;
    copyPixelBufferSubImage(
      resizedDataProducer.image(), xoffset, 0, 0, 0, width, height, resizedImageBuffer_);

    // Classifier image into segmentation.
    classifier_->generateSegmentation(resizedDataProducer.image(), segmentationRes_, {});
    renderData.camerafeedPixels = resizedImageBuffer_.pixels();

    // Writes images for each of the class scores.
    // Reallocate if necessary.
    if (outSegBuffer_.pixels().rows() != height || outSegBuffer_.pixels().cols() != width) {
      outSegBuffer_ = RGBA8888PlanePixelBuffer(height, width);
    }
    if (
      singleSegBuffer_.pixels().rows() != resizedH
      || singleSegBuffer_.pixels().cols() != resizedW) {
      singleSegBuffer_ = RGBA8888PlanePixelBuffer(resizedH, resizedW);
    }

    classDisplay_ = controlPanelConfig()[SELFIE_CLASS].val<int>();
    auto outPix = outSegBuffer_.pixels();
    floatToRgba(segmentationRes_[classDisplay_], &outPix, VIRIDIS_RGB_256, 0.5, 0.75);
    copyPixelBufferSubImage(outPix, xoffset, 0, 0, 0, width, height, singleSegBuffer_);
    renderData.singleSegmentationMap = singleSegBuffer_.pixels();

    // Writes a single image displaying max of all classes together.
    // Reallocate maxSegmentationMap if necessary.
    if (maxSegBuffer_.pixels().rows() != resizedH || maxSegBuffer_.pixels().cols() != resizedW) {
      maxSegBuffer_ = RGBA8888PlanePixelBuffer(resizedH, resizedW);
    }

    maxMultiClassMap(segmentationRes_, segNumClasses_, outPix);
    copyPixelBufferSubImage(outPix, xoffset, 0, 0, 0, width, height, maxSegBuffer_);
    renderData.maxSegmentationMap = maxSegBuffer_.pixels();
  }
}

void SelfieSegmentationView::updateScene(OmniscopeViewData *data) {
  const auto &renderData = data->cpuProcessingResult<RenderData>();
  const auto &maxSegmentationMap = renderData.maxSegmentationMap;
  const auto &segmentationMap = renderData.singleSegmentationMap;

  auto &cameraScene = scene().find<Scene>("camera-view");
  auto &semanticsScene = scene().find<Scene>("segmentation-view");
  auto &maxSemanticsScene = scene().find<Scene>("max-segmentation-view");

  cameraScene.find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  semanticsScene.find<Renderable>("segmentation-feed")
    .material()
    .colorTexture()
    ->setRgbaPixels(segmentationMap);

  maxSemanticsScene.find<Renderable>("max-segmentation-feed")
    .material()
    .colorTexture()
    ->setRgbaPixels(maxSegmentationMap);
}

void SelfieSegmentationView::renderDisplay(OmniscopeViewData *data) {
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

void SelfieSegmentationView::initializeScene(OmniscopeViewData *data) {
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
  auto &singleSemanticScene = scene().add(ObGen::subScene("segmentation-view", {{480, 640}}));

  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  singleSemanticScene.add(ObGen::perspectiveCamera(captureIntrinsics, 480, 640));

  // Add the semantics feed for a single class. This needs to have y inverted because the input
  // texture was inverted.
  auto semPos = HMatrixGen::i();

  singleSemanticScene
    .add(ObGen::positioned(
      ObGen::named(ObGen::backQuad(), "segmentation-feed"), semPos * HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  ///////////// Max Semantics Output Setup //////////////

  auto &maxSemanticsScene = scene().add(ObGen::subScene("max-segmentation-view", {{480, 640}}));

  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  maxSemanticsScene.add(ObGen::perspectiveCamera(captureIntrinsics, 480, 640));

  // Add the max semantics feed. This needs to have y inverted because the input texture was
  // inverted.
  maxSemanticsScene
    .add(ObGen::positioned(
      ObGen::named(ObGen::backQuad(), "max-segmentation-feed"), semPos * HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  ///////////// Composite View Setup: Set up the layout for both subscenes //////////////

  // Set the default renderSpec on the root scene
  int rootWidth = 480 * 3;
  scene().setRenderSpecs({{rootWidth, 640}});

  // Add a pixel camera which works with vertices in pixel space. For omniscope, this must have
  // flipY() applied.
  scene().add(ObGen::pixelCamera(rootWidth, 640)).flipY();

  // Render the camera view.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(0, 0, 480, 640), "camera-view-render"))
    .setMaterial(MatGen::subsceneMaterial("camera-view"));

  // Render a single segmentation output.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(480, 0, 480, 640), "segmentation-render"))
    .setMaterial(MatGen::subsceneMaterial("segmentation-view"));

  // Render the max segmentation output.
  scene()
    .add(ObGen::named(ObGen::pixelQuad(960, 0, 480, 640), "max-segmentation-render"))
    .setMaterial(MatGen::subsceneMaterial("max-segmentation-view"));
}

bool SelfieSegmentationView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;  // Only update if needed.
}

void SelfieSegmentationView::gotTouches(const Vector<Touch> &touches) {
  classDisplay_ = (classDisplay_ + 1) % segNumClasses_;
  controlPanelConfig()[SELFIE_CLASS].setVal(classDisplay_);
}

}  // namespace c8
