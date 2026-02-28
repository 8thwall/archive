// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <deque>
#include <memory>

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/hmatrix.h"
#include "c8/pixels/opengl/texture-transforms.h"

namespace c8 {

class ImageTargetGravityWarpView : public OmniscopeView {
public:
  ImageTargetGravityWarpView();

  String name() override { return "Image Targets Gravity Warp"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void drawGl(FrameInput &in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  ImageTargetGravityWarpView(ImageTargetGravityWarpView &&) = default;
  ImageTargetGravityWarpView &operator=(ImageTargetGravityWarpView &&) = default;

  // Disallow copying.
  ImageTargetGravityWarpView(const ImageTargetGravityWarpView &) = delete;
  ImageTargetGravityWarpView &operator=(const ImageTargetGravityWarpView &) = delete;

private:
  AppConfiguration appConfig_;
  int clickNum_ = 0;
  TexWarper warpTexture_;
};

}  // namespace c8
