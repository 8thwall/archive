// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <deque>
#include <memory>

#include "apps/client/internalqa/omniscope/native/lib/detection-image-stats.h"
#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/random-numbers.h"
#include "c8/string.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/gr8gl.h"

namespace c8 {

class ImageTargetResidualView : public OmniscopeView {
public:
  ImageTargetResidualView();

  String name() override { return "Image Targets Residuals"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  ImageTargetResidualView(ImageTargetResidualView &&) = default;
  ImageTargetResidualView &operator=(ImageTargetResidualView &&) = default;

  // Disallow copying.
  ImageTargetResidualView(const ImageTargetResidualView &) = delete;
  ImageTargetResidualView &operator=(const ImageTargetResidualView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  TexCopier copyTexture_;

  Gr8Gl gr8_;
  String srcName_;
  RandomNumbers random_;
  DetectionImageStatsTracker stats_;
  int64_t lastFrameMicros_ = 0;
};

}  // namespace c8
