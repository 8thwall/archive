// Copyright (c) 2022 Niantic, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)
//
// Creates visualizations for the semantics cubemap generator.
// Left: camera frustum and cubemap
// Mid-top: Camera feed
// Mid-bottom: inference results
// Right: rendered result from cubemap

#pragma once

#include <memory>
#include <mutex>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/hvector.h"
#include "c8/pixels/gpu-pixels-resizer.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/string.h"
#include "reality/engine/deepnets/multiclass-operations.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/semantics/semantics-classifier.h"
#include "reality/engine/semantics/semantics-cubemap-renderer.h"
#include "reality/engine/tracking/tracker.h"

namespace c8 {

class SemanticsCubemapView : public OmniscopeView {
public:
  SemanticsCubemapView() = default;

  String name() override { return "Semantics Cubemap"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  SemanticsCubemapView(SemanticsCubemapView &&) = delete;
  SemanticsCubemapView &operator=(SemanticsCubemapView &&) = delete;

  // Disallow copying.
  SemanticsCubemapView(const SemanticsCubemapView &) = delete;
  SemanticsCubemapView &operator=(const SemanticsCubemapView &) = delete;

private:
  AppConfiguration appConfig_;

  int semanticsWidth_ = 0;
  int semanticsHeight_ = 0;

  std::unique_ptr<Gr8FeatureShader> glShader_;

  std::unique_ptr<Tracker> tracker_;
  RandomNumbers random_;

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;

  std::unique_ptr<SemanticsCubemapRenderer> cubemapRenderer_;

  // Semantics classifier.
  std::unique_ptr<SemanticsClassifier> semClassifier_;

  Vector<FloatPixels> semanticsRes_;

  int64_t lastFrameTime_ = -1;
  const uint8_t semanticClass_ = static_cast<uint8_t>(SemanticsClassifications::SKY);

  // number of frames to be skipped.
  int skipFrameCount_ = 10;
  // current frame's index
  int frameIndex_ = 0;

  // Buffer for the semantic result.
  RGBA8888PlanePixelBuffer singleSemBuffer_;
  RGBA8888PlanePixelBuffer uprightSemBuffer_;

  GlTexture2D renderedSemTex_;

  void updateScene(OmniscopeViewData *viewData);
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
};

}  // namespace c8
