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

using ChannelHeatmap = std::function<void(int channel, GlTexture src, GlFramebufferObject *dest)>;

class ImageTargetCamPyramidView : public OmniscopeView {
public:
  ImageTargetCamPyramidView();

  String name() override { return "Image Targets Camera Pyramid"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  ImageTargetCamPyramidView(ImageTargetCamPyramidView &&) = default;
  ImageTargetCamPyramidView &operator=(ImageTargetCamPyramidView &&) = default;

  // Disallow copying.
  ImageTargetCamPyramidView(const ImageTargetCamPyramidView &) = delete;
  ImageTargetCamPyramidView &operator=(const ImageTargetCamPyramidView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  ChannelHeatmap channelHeatmap_;
  RandomNumbers random_;
  Gr8Gl gr8_;
  int numClicks_ = 0;
  Tracker tracker_;
};

}  // namespace c8
