// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/pixel-pinhole-camera-model.h"
#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/quaternion.h"
#include "reality/engine/features/frame-point.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/gr8gl.h"
#include "reality/engine/features/local-matcher.h"

namespace c8 {

class LocalmatchView : public OmniscopeView {
public:
  LocalmatchView();

  String name() override { return "Local Matches"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  LocalmatchView(LocalmatchView &&) = default;
  LocalmatchView &operator=(LocalmatchView &&) = default;

  // Disallow copying.
  LocalmatchView(const LocalmatchView &) = delete;
  LocalmatchView &operator=(const LocalmatchView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  TexCopier copyTexture_;

  Gr8Gl gr8_;
  LocalMatcher<OrbFeature> localMatcher_;
  FrameWithPoints lastFramePoints_;
  bool hideImage_ = false;
};

}  // namespace c8
