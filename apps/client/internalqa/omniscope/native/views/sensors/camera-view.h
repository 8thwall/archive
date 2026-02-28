// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"

namespace c8 {

class CameraView : public OmniscopeView {
public:
  CameraView() = default;

  String name() override { return "Camera"; };
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;

  void drawGl(FrameInput &in) override;

  // Default move constructors.
  CameraView(CameraView &&) = default;
  CameraView &operator=(CameraView &&) = default;

  // Disallow copying.
  CameraView(const CameraView &) = delete;
  CameraView &operator=(const CameraView &) = delete;

private:
  AppConfiguration appConfig_;
};

}  // namespace c8
