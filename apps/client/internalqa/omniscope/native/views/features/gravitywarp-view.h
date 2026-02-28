// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/camera/device-infos.h"
#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/pixel-buffer.h"
#include "reality/engine/features/frame-point.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/gr8gl.h"

namespace c8 {

class GravitywarpView : public OmniscopeView {
public:
  GravitywarpView();

  String name() override { return "Gravity Warp"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  GravitywarpView(GravitywarpView &&) = default;
  GravitywarpView &operator=(GravitywarpView &&) = default;

  // Disallow copying.
  GravitywarpView(const GravitywarpView &) = delete;
  GravitywarpView &operator=(const GravitywarpView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  TexCopier copyTexture_;

  Gr8Gl gr8_;
  bool hideImage_ = false;
};

}  // namespace c8
