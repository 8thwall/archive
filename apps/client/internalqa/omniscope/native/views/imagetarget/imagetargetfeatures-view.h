// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <deque>
#include <memory>

#include "apps/client/internalqa/omniscope/native/lib/detection-image-stats.h"
#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/random-numbers.h"
#include "c8/string.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/gr8gl.h"
#include "reality/engine/tracking/tracker.h"

namespace c8 {

class ImageTargetFeaturesView : public OmniscopeView {
public:
  ImageTargetFeaturesView();

  String name() override { return "Image Targets Features"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  ImageTargetFeaturesView(ImageTargetFeaturesView &&) = default;
  ImageTargetFeaturesView &operator=(ImageTargetFeaturesView &&) = default;

  // Disallow copying.
  ImageTargetFeaturesView(const ImageTargetFeaturesView &) = delete;
  ImageTargetFeaturesView &operator=(const ImageTargetFeaturesView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  TexCopier copyTexture_;
  RandomNumbers random_;
  Gr8Gl gr8_;
  Tracker tracker_;
};

}  // namespace c8
