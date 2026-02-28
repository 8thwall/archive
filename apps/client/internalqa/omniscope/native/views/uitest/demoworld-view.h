// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#pragma once

#include <memory>
#include <mutex>

#include "apps/client/internalqa/omniscope/native/lib/overlay-scene-manager.h"
#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/string.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/tracking/tracker.h"

namespace c8 {

class DemoWorldView : public OmniscopeView {
public:
  DemoWorldView() = default;

  String name() override { return "Demo World"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Disallow move constructors.
  DemoWorldView(DemoWorldView &&) = delete;
  DemoWorldView &operator=(DemoWorldView &&) = delete;

  // Disallow copying.
  DemoWorldView(const DemoWorldView &) = delete;
  DemoWorldView &operator=(const DemoWorldView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;

  std::unique_ptr<Tracker> tracker_;
  RandomNumbers random_;
  std::mutex touchMtx_;
  bool hideImage_ = false;
  int counter = 0;
  const HMatrix rotatingOrigin = HMatrixGen::translation(2.f, -1.f, 0.f);

  // State for rendering. These should only be accessed / modified in the renderDisplay method.
  std::unique_ptr<Renderer> renderer_;
  int64_t lastFrameTime_ = -1;

  void updateScene(OmniscopeViewData *viewData);
  void resetScene();
  void initializeScene(OmniscopeViewData *data);
  bool updateSceneWithUserInput();
};

}  // namespace c8
