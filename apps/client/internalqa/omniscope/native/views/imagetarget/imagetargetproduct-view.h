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

class ImageTargetProductView : public OmniscopeView {
public:
  ImageTargetProductView();

  String name() override { return "Image Targets Product"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  ImageTargetProductView(ImageTargetProductView &&) = default;
  ImageTargetProductView &operator=(ImageTargetProductView &&) = default;

  // Disallow copying.
  ImageTargetProductView(const ImageTargetProductView &) = delete;
  ImageTargetProductView &operator=(const ImageTargetProductView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  TexCopier copyTexture_;
  DetectionImageStatsTracker stats_;
  RandomNumbers random_;
  int64_t lastFrameMicros_ = 0;
  Gr8Gl gr8_;
  bool showStats_ = true;
  Tracker tracker_;
};

}  // namespace c8
