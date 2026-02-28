// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/lib/overlay-scene-manager.h"
#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/string.h"

namespace c8 {

class DeviceposeView : public OmniscopeView {
public:
  DeviceposeView() = default;

  String name() override { return "Device Pose"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  void renderDisplay(OmniscopeViewData *viewData) override;

  // Default move constructors.
  DeviceposeView(DeviceposeView &&) = default;
  DeviceposeView &operator=(DeviceposeView &&) = default;

  // Disallow copying.
  DeviceposeView(const DeviceposeView &) = delete;
  DeviceposeView &operator=(const DeviceposeView &) = delete;

private:
  AppConfiguration appConfig_;
  OverlaySceneManager sceneManager_;
  void updateScene(OmniscopeViewData *viewData);
  void initializeScene();
};

}  // namespace c8
