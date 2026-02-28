// Copyright (c) 2022 Niantic, Inc.
// Original Author: Lynn Dang (lynndang@nianticlabs.com)
//
// Runs the semantic generator on JS to evaluate the performance of the model. It will display the
// camera  view on one corner while showing the semantics output on the phone screen.

#pragma once

#include <memory>
#include <mutex>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/hvector.h"
#include "c8/pixels/gpu-pixels-resizer.h"
#include "c8/string.h"
#include "c8/time/rolling-framerate.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/semantics/semantics-classifier.h"

namespace c8 {

class SemanticsClassProductView : public OmniscopeView {
public:
  SemanticsClassProductView();

  String name() override { return "Semantics Classes Product View"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void renderDisplay(OmniscopeViewData *data) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Disallow move constructors.
  SemanticsClassProductView(SemanticsClassProductView &&) = delete;
  SemanticsClassProductView &operator=(SemanticsClassProductView &&) = delete;

  // Disallow copying.
  SemanticsClassProductView(const SemanticsClassProductView &) = delete;
  SemanticsClassProductView &operator=(const SemanticsClassProductView &) = delete;

private:
  AppConfiguration appConfig_;
  TexCopier copyTexture_;
  RollingFramerate rollingFramerate_;

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;
  // Semantics classifier.
  int semNumClasses_ = 1;
  std::unique_ptr<SemanticsClassifier> semClassifier_;

  Vector<FloatPixels> semanticsRes_;

  int64_t lastFrameTime_ = -1;
  int semanticsIndex_ = 0;

  // Buffers for the semantic visualizations.
  RGBA8888PlanePixelBuffer semBuffer_;

  // Buffer for frame rate.
  RGBA8888PlanePixelBuffer frameRateBuffer_;

  // Display for class legend.
  bool displayLegend_ = false;

  // Summarizer to log the latencies.
  String summarizerPath_ = "";

  void updateScene(OmniscopeViewData *data);
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();

  String getSummarizerRoot();
  float latencyMeanFromPath(const String &inputPath);
};

}  // namespace c8
