// Copyright (c) 2023 Niantic, Inc.
// Original Author: Lynn Dang (lynndang@nianticlabs.com)
//
// Runs the MediaPipe selife segmentation visualized on omniscope.

#pragma once

#include <memory>
#include <mutex>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/hvector.h"
#include "c8/pixels/gpu-pixels-resizer.h"
#include "c8/string.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/selfie-segmentation/selfie-segmentation.h"

namespace c8 {

class SelfieSegmentationView : public OmniscopeView {
public:
  SelfieSegmentationView();

  String name() override { return "Selfie Segmentation View"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  SelfieSegmentationView(SelfieSegmentationView &&) = delete;
  SelfieSegmentationView &operator=(SelfieSegmentationView &&) = delete;

  // Disallow copying.
  SelfieSegmentationView(const SelfieSegmentationView &) = delete;
  SelfieSegmentationView &operator=(const SelfieSegmentationView &) = delete;

private:
  AppConfiguration appConfig_;
  TexCopier copyTexture_;

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;

  // Segmentation classifier.
  int segNumClasses_ = 6;

  std::unique_ptr<SelfieSegmentation> classifier_;

  Vector<FloatPixels> segmentationRes_;

  int64_t lastFrameTime_ = -1;
  uint8_t classDisplay_ = 0;

  RGBA8888PlanePixelBuffer resizedImageBuffer_;

  // Buffers for the semantic visualizations.
  RGBA8888PlanePixelBuffer maxSegBuffer_;
  RGBA8888PlanePixelBuffer singleSegBuffer_;
  RGBA8888PlanePixelBuffer outSegBuffer_;

  void updateScene(OmniscopeViewData *viewData);
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
};

}  // namespace c8
