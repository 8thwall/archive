// Copyright (c) 2025 Niantic Spatial, Inc.
// Original Author: Yuling Wang (yuling@nianticspatial.com)

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

class ImageTargetStableView : public OmniscopeView {
public:
  ImageTargetStableView();

  String name() override { return "Image Targets Stable"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;

  // Default move constructors.
  ImageTargetStableView(ImageTargetStableView &&) = default;
  ImageTargetStableView &operator=(ImageTargetStableView &&) = default;

  // Disallow copying.
  ImageTargetStableView(const ImageTargetStableView &) = delete;
  ImageTargetStableView &operator=(const ImageTargetStableView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  TexCopier copyTexture_;
  RandomNumbers random_;
  Gr8Gl gr8_;
  Tracker tracker_;
  String srcName_;

  int globalInlierCumulative_ = 0;
  int globalMatchCumulative_ = 0;

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

  // Frame-based tracking variables
  int frameCount_ = 0;
  int foundCumulativeFrames_ = 0;
  int notFoundCumulativeFrames_ = 0;
  int firstFoundFrame_ = -1;
  int startFrame_ = -1;
};

}  // namespace c8
