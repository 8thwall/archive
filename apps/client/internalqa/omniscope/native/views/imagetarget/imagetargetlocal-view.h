// Copyright (c) 2019 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/lib/detection-image-stats.h"
#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/random-numbers.h"
#include "c8/string.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/gr8gl.h"
#include "reality/engine/tracking/tracker.h"

namespace c8 {

class ImageTargetLocalView : public OmniscopeView {
public:
  ImageTargetLocalView();

  String name() override { return "Image Targets Local View"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  ImageTargetLocalView(ImageTargetLocalView &&) = default;
  ImageTargetLocalView &operator=(ImageTargetLocalView &&) = default;

  // Disallow copying.
  ImageTargetLocalView(const ImageTargetLocalView &) = delete;
  ImageTargetLocalView &operator=(const ImageTargetLocalView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  TexCopier copyTexture_;
  DetectionImageStatsTracker stats_;
  int64_t lastFrameMicros_ = 0;
  Gr8Gl gr8_;
  RandomNumbers random_;
  Tracker tracker_;
  String srcName_;
};

}  // namespace c8
