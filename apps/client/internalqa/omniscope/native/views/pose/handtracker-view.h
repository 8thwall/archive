// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/string.h"
#include "reality/engine/faces/face-roi-shader.h"
#include "reality/engine/hands/hand-tracker.h"
#include "reality/engine/hands/hand-roi-renderer.h"

namespace c8 {

class HandTrackerView : public OmniscopeView {
public:
  HandTrackerView() = default;

  String name() override { return "Hand Tracker"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  HandTrackerView(HandTrackerView &&) = delete;
  HandTrackerView &operator=(HandTrackerView &&) = delete;

  // Disallow copying.
  HandTrackerView(const HandTrackerView &) = delete;
  HandTrackerView &operator=(const HandTrackerView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<FaceRoiShader> shader_;
  std::unique_ptr<HandTracker> tracker_;
  c8_PixelPinholeCameraModel deviceK_;

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;
  Vector<Group *> renderedHands_;
  int64_t lastFrameTime_ = -1;
  std::shared_ptr<HandRoiRenderer> handRenderer_ = std::make_shared<HandRoiRenderer>();

  void updateScene(OmniscopeViewData *viewData);
  void resetScene();
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
};

}  // namespace c8
