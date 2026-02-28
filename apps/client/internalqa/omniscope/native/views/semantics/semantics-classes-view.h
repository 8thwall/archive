// Copyright (c) 2022 Niantic, Inc.
// Original Author: Lynn Dang (lynndang@nianticlabs.com)
//
// Creates two visualizations for the semantics generator. One is the semantic scores per class,
// and the other is for the max of the semantic scores.

#pragma once

#include <memory>
#include <mutex>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/hvector.h"
#include "c8/pixels/gpu-pixels-resizer.h"
#include "c8/string.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/semantics/semantics-classifier.h"

namespace c8 {

class SemanticsClassesView : public OmniscopeView {
public:
  SemanticsClassesView();

  String name() override { return "Semantics Classes"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  SemanticsClassesView(SemanticsClassesView &&) = delete;
  SemanticsClassesView &operator=(SemanticsClassesView &&) = delete;

  // Disallow copying.
  SemanticsClassesView(const SemanticsClassesView &) = delete;
  SemanticsClassesView &operator=(const SemanticsClassesView &) = delete;

private:
  AppConfiguration appConfig_;
  TexCopier copyTexture_;

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;

  // Semantics classifier.
  int semNumClasses_ = 1;
  std::unique_ptr<SemanticsClassifier> semClassifier_;

  Vector<FloatPixels> semanticsRes_;

  int64_t lastFrameTime_ = -1;
  uint8_t classDisplay_ = 0;

  RGBA8888PlanePixelBuffer resizedImageBuffer_;

  // Buffers for the semantic visualizations.
  RGBA8888PlanePixelBuffer maxSemBuffer_;
  RGBA8888PlanePixelBuffer singleSemBuffer_;

  void updateScene(OmniscopeViewData *viewData);
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
};

}  // namespace c8
