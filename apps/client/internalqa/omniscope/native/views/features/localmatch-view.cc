// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "localmatch-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//c8:c8-log",
    "//c8:color",
    "//c8/geometry:device-pose",
    "//c8:hpoint",
    "//c8:quaternion",
    "//c8:string",
    "//c8:vector",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/pixels:draw2",
    "//c8/pixels:pixel-transforms",
    "//c8/stats:scope-timer",
    "//reality/engine/features:frame-point",
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/features:local-matcher",
  };
}
cc_end(0x19c50984);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/features/localmatch-view.h"
#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/color.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/intrinsics.h"
#include "c8/hpoint.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"

namespace c8 {

LocalmatchView::LocalmatchView()
    : gr8_(Gr8Gl::create()),
      localMatcher_(15, 20, 0.1f /* no hamming thresh */),
      lastFramePoints_(Intrinsics::getCameraIntrinsics(DeviceInfos::DeviceModel::APPLE_IPHONE_8)) {
  copyTexture_ = compileCopyTexture2D();
  localMatcher_.useScaleFilter(true);
}

void LocalmatchView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void LocalmatchView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::cameraPreviewFeatures(appConfig_, glShader_.get(), &copyTexture_);
}

void LocalmatchView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &cameraProducer = data->producer<CameraPreviewDataProducer>();
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  // Draw features onto texture.
  auto cp = cameraProducer.cameraPreview();
  auto feats = gr8_.detectAndCompute(featureProducer.pyramid());

  auto l0 = featureProducer.pyramid().levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);

  FrameWithPoints framePoints(
    intrinsics, xrRotationFromDeviceRotation(data->devicePose()).toRotationMat());
  // copy output.
  framePoints.reserve(feats.size());
  for (const auto &f : feats) {
    auto l = f.location();
    framePoints.addImagePixelPoint(
      HPoint2(l.pt.x, l.pt.y), l.scale, l.angle, l.gravityAngle, f.features().clone());
  }
  Vector<PointMatch> matches;
  localMatcher_.match(lastFramePoints_, framePoints, &matches);

  if (hideImage_) {
    fill(Color::BLACK, cp);
  }

  auto lastPts = lastFramePoints_.pixels();
  auto thisPts = framePoints.pixels();
  for (auto match : matches) {
    drawLine(
      lastPts[match.wordsIdx],
      thisPts[match.dictionaryIdx],
      1,
      heatMap(255 - match.descriptorDist),
      cp);
  }

  lastFramePoints_ = std::move(framePoints);
}

void LocalmatchView::gotTouches(const Vector<Touch> &touches) { hideImage_ = !hideImage_; }

}  // namespace c8
