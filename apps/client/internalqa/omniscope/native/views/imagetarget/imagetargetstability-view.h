// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

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

class ImageTargetStabilityView : public OmniscopeView {
public:
  ImageTargetStabilityView();

  String name() override { return "Image Targets Stability View"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  ImageTargetStabilityView(ImageTargetStabilityView &&) = default;
  ImageTargetStabilityView &operator=(ImageTargetStabilityView &&) = default;

  // Disallow copying.
  ImageTargetStabilityView(const ImageTargetStabilityView &) = delete;
  ImageTargetStabilityView &operator=(const ImageTargetStabilityView &) = delete;

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

  std::deque<float> timeSeries_;
  std::deque<float> xSeries_;
  std::deque<float> ySeries_;
  std::deque<float> zSeries_;
  std::deque<float> xSeriesUnfiltered_;
  std::deque<float> ySeriesUnfiltered_;
  std::deque<float> zSeriesUnfiltered_;

  std::deque<float> qwSeries_;
  std::deque<float> qxSeries_;
  std::deque<float> qySeries_;
  std::deque<float> qzSeries_;
  std::deque<float> qwSeriesUnfiltered_;
  std::deque<float> qxSeriesUnfiltered_;
  std::deque<float> qySeriesUnfiltered_;
  std::deque<float> qzSeriesUnfiltered_;
};

}  // namespace c8
