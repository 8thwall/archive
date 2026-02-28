// Copyright (c) 2022 Niantic, Inc.
// Original Author: Lynn Dang (lynndang@nianticlabs.com)
//
// Creates two visualizations for the semantics generator. One is the semantic scores per class,
// and the other is for the max of the semantic scores.

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "semclassproduct-view.h",
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
    "//c8/pixels:draw2-widgets",
    "//c8/geometry:intrinsics",
    "//c8/pixels/opengl:gl-error",
    "//c8/stats:logging-summaries",
    "//c8/stats:scope-timer",
    "//c8/time:rolling-framerate",
    "//reality/engine/deepnets:multiclass-operations",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/semantics:semantics-classifier",
    "//reality/engine/semantics/data:embedded-semanticsnet-portrait",
    "//reality/quality/synthetic:synthetic-scenes",
  };
}
cc_end(0xe3766292);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/semantics/semclassproduct-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/vectors.h"
#include "c8/pixels/draw-figure.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/logging-summaries.h"
#include "c8/stats/scope-timer.h"
#include "reality/engine/deepnets/multiclass-operations.h"
#include "reality/engine/semantics/data/embedded-semanticsnet-portrait.h"
#include "reality/quality/synthetic/synthetic-scenes.h"

namespace c8 {

namespace {

class RenderData : public CpuProcessingResult {
public:
  double fps = 0.0;
  float inputSummary = 0;
  float invokeSummary = 0;
  float outputSummary = 0;
  float totalSummary = 0;

  // Holds the visual representation of the max semantics scores recorded in the log.
  RGBA8888PlanePixels semanticsMap;
};

constexpr const char *SEMANTICS_SUMMARY_PATH =
  "/process-cpu/semantics-classifier/generate-semantics/";

constexpr const int SEMANTICS_SUMMARY_WIDTH = 300;
constexpr const int SEMANTICS_SUMMARY_HEIGHT = 120;

}  // namespace

SemanticsClassProductView::SemanticsClassProductView() { copyTexture_ = compileCopyTexture2D(); }

void SemanticsClassProductView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (!semClassifier_) {
    const Vector<uint8_t> tfliteFile(
      embeddedSemanticsMobilenetv3SeparableQuarterFp16TfliteData,
      embeddedSemanticsMobilenetv3SeparableQuarterFp16TfliteData
        + embeddedSemanticsMobilenetv3SeparableQuarterFp16TfliteSize);
    semClassifier_ = std::make_unique<SemanticsClassifier>(tfliteFile);
    semNumClasses_ = semClassifier_->getNumberOfClasses();
  }
}

void SemanticsClassProductView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::sceneRenderer<RenderData>(
    appConfig_, appConfig_.captureWidth, appConfig_.captureHeight);
  auto inputWidth = semClassifier_->getInputWidth();
  auto inputHeight = semClassifier_->getInputHeight();
  dataPtr->addProducer(std::make_unique<ResizedDataProducer>(appConfig_, inputWidth, inputHeight));
}

void SemanticsClassProductView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");

  auto &renderData = data->cpuProcessingResult<RenderData>();
  int height = semClassifier_->getInputHeight();
  int width = semClassifier_->getInputWidth();

  // Processing semantics from classifier.
  {
    ScopeTimer t2("semantics-classifier");
    auto &resizedDataProducer = data->producer<ResizedDataProducer>();

    // Classifier image into semantics.
    semClassifier_->generateSemantics(resizedDataProducer.image(), semanticsRes_, {});
  }

  {
    ScopeTimer t2("semantics-classifier-output");
    // Writes a single image displaying max of all classes together.
    // Reallocate semBuffer if necessary.
    if (semBuffer_.pixels().rows() != height || semBuffer_.pixels().cols() != width) {
      semBuffer_ = RGBA8888PlanePixelBuffer(height, width);
    }
    auto outPix = semBuffer_.pixels();

    // Take max of the classes.
    if (semanticsIndex_ == semClassifier_->getNumberOfClasses()) {
      maxMultiClassMap(semanticsRes_, semClassifier_->getNumberOfClasses(), outPix);
    } else {  // Take a single class.
      floatToRgba(semanticsRes_[semanticsIndex_], &outPix, VIRIDIS_RGB_256, 0, 1);
    }
    renderData.semanticsMap = outPix;
  }

  rollingFramerate_.push();
  renderData.fps = rollingFramerate_.fps();

  // Getting latency information.
  if (summarizerPath_ == "") {
    summarizerPath_ = getSummarizerRoot();
  }

  renderData.inputSummary = latencyMeanFromPath("generate-semantics-input");
  renderData.invokeSummary = latencyMeanFromPath("generate-semantics-invoke");
  renderData.outputSummary = latencyMeanFromPath("generate-semantics-output");
}

void SemanticsClassProductView::updateScene(OmniscopeViewData *data) {
  const auto &renderData = data->cpuProcessingResult<RenderData>();
  const auto &semanticsMap = renderData.semanticsMap;

  scene().find<Renderable>("semanticsfeed").material().colorTexture()->setRgbaPixels(semanticsMap);
  scene()
    .find<Renderable>("camerafeed")
    .material()
    .colorTexture()
    ->setNativeId(data->cameraTexture());

  {
    if (
      frameRateBuffer_.pixels().rows() != SEMANTICS_SUMMARY_HEIGHT
      || frameRateBuffer_.pixels().cols() != SEMANTICS_SUMMARY_WIDTH) {
      frameRateBuffer_ =
        RGBA8888PlanePixelBuffer(SEMANTICS_SUMMARY_HEIGHT, SEMANTICS_SUMMARY_WIDTH);
    }

    auto cp = frameRateBuffer_.pixels();
    fill(Color::OFF_WHITE, cp);

    textBox(
      {
        format("FPS: %f", renderData.fps),
        format("Input: %f", renderData.inputSummary),
        format("Invoke: %f", renderData.invokeSummary),
        format("Output: %f", renderData.outputSummary),
        format("Class: %s", SEMANTICS_CLASS_STRINGS[semanticsIndex_].c_str()),
      },
      {0.0f, 0.0f},
      SEMANTICS_SUMMARY_WIDTH,
      cp);
    scene()
      .find<Renderable>("tracking-status")
      .material()
      .colorTexture()
      ->setRgbaPixels(frameRateBuffer_.pixels());
  }

  scene().find<Renderable>("semantics-legend").setEnabled(displayLegend_);
}

void SemanticsClassProductView::renderDisplay(OmniscopeViewData *data) {
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

void SemanticsClassProductView::initializeScene(OmniscopeViewData *data) {
  if (renderer_ != nullptr) {  // Already initialized.
    return;
  }

  int renderWidth = data->captureWidth();
  int renderHeight = data->captureHeight();
  auto aspectRatio = static_cast<float>(renderHeight) / renderWidth;

  renderer_ = std::make_unique<Renderer>();

  // Set the default renderSpec on the root scene.
  scene().setRenderSpecs({{renderWidth, renderHeight}});

  // Create a scene camera with field of view matched to the device. For omniscope, this must have
  // flipY() applied.
  auto captureIntrinsics = Intrinsics::getCameraIntrinsics(appConfig_.deviceModel);
  scene().add(ObGen::perspectiveCamera(captureIntrinsics, renderWidth, renderHeight)).flipY();

  // Display semantics results. Resize back to phone dimensions.
  auto semPos = HMatrixGen::scaleY(aspectRatio);
  if (semClassifier_->getOrientation() == SemanticsClassifier::InputOrientation::LANDSCAPE_LEFT) {
    semPos = semPos * HMatrixGen::z270();
  } else if (
    semClassifier_->getOrientation() == SemanticsClassifier::InputOrientation::LANDSCAPE_RIGHT) {
    semPos = semPos * HMatrixGen::z90();
  }
  scene()
    .add(ObGen::named(ObGen::positioned(ObGen::backQuad(), semPos), "semanticsfeed"))
    .setMaterial(MatGen::image());

  // Camera preview position.
  auto prevPos =
    HMatrixGen::translation(-0.65f, 0.65f, -1.0f) * HMatrixGen::HMatrixGen::scale(0.3f);
  scene()
    .add(ObGen::named(ObGen::positioned(ObGen::backQuad(), prevPos), "camerafeed"))
    .setMaterial(MatGen::image());

  // Show frame rate.
  auto quadPos = HMatrixGen::translation(-0.6f, -0.8f, -1.0f)
    * HMatrixGen::HMatrixGen::scale(0.35f, 0.15f, 0.0f);
  scene()
    .add(ObGen::named(ObGen::positioned(ObGen::backQuad(), quadPos), "tracking-status"))
    .setMaterial(MatGen::image());

  // Show legend.
  auto legendPos =
    HMatrixGen::translation(0.0f, -0.3f, -1.0f) * HMatrixGen::HMatrixGen::scale(0.7f, 0.35f, 0.0f);
  auto &legendQuad =
    scene()
      .add(ObGen::named(ObGen::positioned(ObGen::backQuad(), legendPos), "semantics-legend"))
      .setMaterial(MatGen::image());

  RGBA8888PlanePixelBuffer buffer(300, 600);
  auto cp = buffer.pixels();
  fill(Color::OFF_WHITE, cp);

  for (int i = 0; i < semNumClasses_; i++) {
    textBox(
      {format("%d: %s", i, SEMANTICS_CLASS_STRINGS[i].c_str())},
      {(i % 2) * 300.0f, (i / 2) * 30.0f},
      300,
      cp,
      Color::turbo(static_cast<float>(i + 1) / semNumClasses_));
  }
  legendQuad.material().colorTexture()->setRgbaPixelBuffer(std::move(buffer));
  scene().find<Renderable>("semantics-legend").material().setTransparent(true);
  scene().find<Renderable>("semantics-legend").setEnabled(displayLegend_);
}

bool SemanticsClassProductView::updateSceneWithUserInput() {
  if (scene().needsRerender()) {
    scene().setNeedsRerender(false);
    return true;
  }
  return false;  // Only update if needed.
}

void SemanticsClassProductView::gotTouches(const Vector<Touch> &touches) {
  if ((touches.size() == 1) && (semanticsIndex_ == semNumClasses_)) {
    displayLegend_ = !displayLegend_;
  } else if ((touches.size() == 2) || (semanticsIndex_ != semNumClasses_)) {
    displayLegend_ = false;
    semanticsIndex_ = (semanticsIndex_ + 1) % (semNumClasses_ + 1);
  }
}

String SemanticsClassProductView::getSummarizerRoot() {
  auto summaryOmni = ScopeTimer::summarizer()
                       ->summary(
                         "/process-reality/cpu-process-and-render-display/process-cpu/"
                         "semantics-classifier/generate-semantics/generate-semantics-invoke")
                       .reader();
  if (hasLatency(summaryOmni)) {
    return "/process-reality/cpu-process-and-render-display";
  } else {
    auto summaryJS = ScopeTimer::summarizer()
                       ->summary(
                         "/c8EmAsm_cpuProcessAndRenderDisplay/process-cpu/semantics-classifier/"
                         "generate-semantics/generate-semantics-invoke")
                       .reader();

    if (hasLatency(summaryJS)) {
      return "/c8EmAsm_cpuProcessAndRenderDisplay";
    } else {
      auto summaryAndroid = ScopeTimer::summarizer()
                              ->summary(
                                "/android-exec-staged/process-cpu/semantics-classifier/"
                                "generate-semantics/generate-semantics-invoke")
                              .reader();
      if (hasLatency(summaryAndroid)) {
        return "/android-exec-staged";
      }
    }
  }
  return "";
}

float SemanticsClassProductView::latencyMeanFromPath(const String &inputPath) {
  String summaryPath =
    format("%s%s%s", summarizerPath_.c_str(), SEMANTICS_SUMMARY_PATH, inputPath.c_str());
  auto summary = ScopeTimer::summarizer()->summary(summaryPath).reader();
  if (hasLatency(summary)) {
    return latencyMean(summary) * 1e-3f;
  } else {
    return -1;
  }
}

}  // namespace c8
