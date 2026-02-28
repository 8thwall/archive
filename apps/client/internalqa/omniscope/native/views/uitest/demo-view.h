// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <functional>
#include <memory>

#include "apps/client/internalqa/omniscope/native/lib/overlay-scene-manager.h"
#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/pixels/render/renderer.h"
#include "c8/string.h"
namespace c8 {

class DemoView : public OmniscopeView {
public:
  String name() override { return "Demo"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void renderDisplay(OmniscopeViewData *viewData) override;
  void gotTouches(const Vector<Touch> &touches) override;

  DemoView() = default;

  // Default move constructors.
  DemoView(DemoView &&) = default;
  DemoView &operator=(DemoView &&) = default;

  // Disallow copying.
  DemoView(const DemoView &) = delete;
  DemoView &operator=(const DemoView &) = delete;

private:
  AppConfiguration appConfig_;

  // State for rendering. These should only be accessed / modified in the renderDisplay
  // method.
  OverlaySceneManager sceneManager_;
  void updateScene(OmniscopeViewData *viewData);
  void initializeScene();
};

}  // namespace c8
