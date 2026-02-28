// Copyright (c) 2022 8th Wall, LLC
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/string.h"
#include "reality/engine/faces/face-roi-shader.h"
#include "reality/engine/hands/hand-detector-global.h"
#include "reality/engine/hands/hand-roi-renderer.h"

namespace c8 {

class HandGlobalView : public OmniscopeView {
public:
  HandGlobalView() = default;

  String name() override { return "Hand Global"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  HandGlobalView(HandGlobalView &&) = delete;
  HandGlobalView &operator=(HandGlobalView &&) = delete;

  // Disallow copying.
  HandGlobalView(const HandGlobalView &) = delete;
  HandGlobalView &operator=(const HandGlobalView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<FaceRoiShader> shader_;
  std::unique_ptr<HandDetectorGlobal> handDetector_;
  c8_PixelPinholeCameraModel deviceK_;
  std::shared_ptr<HandRoiRenderer> handRenderer_ = std::make_shared<HandRoiRenderer>();

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;
  Vector<Group *> detections_;
  Vector<float> globalConfidence_;
  int64_t lastFrameTime_ = -1;

  void updateScene(OmniscopeViewData *viewData);
  void resetScene();
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
};

}  // namespace c8
