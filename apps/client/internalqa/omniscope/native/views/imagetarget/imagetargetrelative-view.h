// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)

#pragma once

#include <deque>
#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/random-numbers.h"
#include "c8/string.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/gr8gl.h"
#include "reality/engine/tracking/tracker.h"

namespace c8 {

class ImageTargetRelativeView : public OmniscopeView {
public:
  ImageTargetRelativeView();

  String name() override { return "Image Targets Relative"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;
  bool handleKey(int key) override;

  // Disallow move constructors.
  ImageTargetRelativeView(ImageTargetRelativeView &&) = delete;
  ImageTargetRelativeView &operator=(ImageTargetRelativeView &&) = delete;

  // Disallow copying.
  ImageTargetRelativeView(const ImageTargetRelativeView &) = delete;
  ImageTargetRelativeView &operator=(const ImageTargetRelativeView &) = delete;

private:
  AppConfiguration appConfig_;
  std::unique_ptr<Gr8FeatureShader> glShader_;
  TexCopier copyTexture_;
  RandomNumbers random_;
  Gr8Gl gr8_;

  std::mutex touchMtx_;
  std::unique_ptr<Tracker> tracker_;

  // For world view drawing
  HMatrix worldView_ =
    // cameraMotion(-1.49354f,-0.577614f,0.282736f, 0.0493804f,-0.435515f,0.0874429f,0.894562f);
    // cameraMotion(-1.46033f,-0.117557f,1.66013f, 0.0493889f,-0.435515f,0.0874429f,0.894562f);
    cameraMotion(
      -2.98041f, 0.69882f, 2.0993f, 0.0493889f, -0.435515f, 0.0874429f, 0.894562f);  //  1555014683

  c8_PixelPinholeCameraModel lastIntrinsics_;
  HMatrix lastExtrinsic_ = HMatrixGen::i();
  RGBA8888PlanePixels lastWorldDisplay_;
  Vector<TrackedImage> lastFound_;

  void drawRelativeView(
    const HMatrix &world,
    c8_PixelPinholeCameraModel intrinsics,
    const HMatrix &extrinsic,
    const Vector<TrackedImage> &found,
    RGBA8888PlanePixels cp);
};

}  // namespace c8
