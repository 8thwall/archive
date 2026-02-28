// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/random-numbers.h"
#include "c8/string.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/gr8gl.h"

namespace c8 {

class ImageTargetPoseView : public OmniscopeView {
public:
  ImageTargetPoseView();

  String name() override { return "Image Targets Robust PnP (Pose View)"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  ImageTargetPoseView(ImageTargetPoseView &&) = default;
  ImageTargetPoseView &operator=(ImageTargetPoseView &&) = default;

  // Disallow copying.
  ImageTargetPoseView(const ImageTargetPoseView &) = delete;
  ImageTargetPoseView &operator=(const ImageTargetPoseView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  TexCopier copyTexture_;

  Gr8Gl gr8_;
  String srcName_;
  RandomNumbers random_;
};

}  // namespace c8
