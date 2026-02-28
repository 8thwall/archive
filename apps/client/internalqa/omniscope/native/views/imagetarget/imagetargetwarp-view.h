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

using TexCopier = std::function<void(GlTexture src, GlFramebufferObject *dest)>;
using TexWarper = std::function<void(const HMatrix &mat, GlTexture src, GlFramebufferObject *dest)>;
using CurvyTexWarper = std::function<void(
  CurvyImageGeometry geom,
  const HMatrix &intrinsics,
  const HMatrix &globalPose,
  int rotation,
  float roiAspectRatio,
  HPoint2 searchDims,
  GlTexture src,
  GlFramebufferObject *dest)>;

class ImageTargetWarpView : public OmniscopeView {
public:
  ImageTargetWarpView();

  String name() override { return "Image Targets Warp"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  ImageTargetWarpView(ImageTargetWarpView &&) = default;
  ImageTargetWarpView &operator=(ImageTargetWarpView &&) = default;

  // Disallow copying.
  ImageTargetWarpView(const ImageTargetWarpView &) = delete;
  ImageTargetWarpView &operator=(const ImageTargetWarpView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  TexCopier copyTexture_;
  TexWarper warpTexture_;
  CurvyTexWarper warpCurvyTexture_;
  RandomNumbers random_;
  Gr8Gl gr8_;
  Tracker tracker_;
  String srcName_;
};

}  // namespace c8
