// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <functional>
#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/pixel-buffer.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/gr8gl.h"

namespace c8 {

class ImageTargetPyramidView : public OmniscopeView {
public:
  ImageTargetPyramidView() = default;

  String name() override { return "Pyramid"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  ImageTargetPyramidView(ImageTargetPyramidView &&) = default;
  ImageTargetPyramidView &operator=(ImageTargetPyramidView &&) = default;

  // Disallow copying.
  ImageTargetPyramidView(const ImageTargetPyramidView &) = delete;
  ImageTargetPyramidView &operator=(const ImageTargetPyramidView &) = delete;

private:
  AppConfiguration appConfig_;

  String srcName_;
};

}  // namespace c8
