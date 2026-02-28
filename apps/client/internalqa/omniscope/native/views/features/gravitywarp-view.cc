// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "gravitywarp-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//c8:c8-log",
    "//c8:color",
    "//c8:hmatrix",
    "//c8:hpoint",
    "//c8:quaternion",
    "//c8:string",
    "//c8:vector",
    "//c8/camera:device-infos",
    "//c8/geometry:device-pose",
    "//c8/geometry:homography",
    "//c8/geometry:intrinsics",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/pixels:draw2",
    "//c8/stats:scope-timer",
    "//reality/engine/features:frame-point",
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
  };
}
cc_end(0x0b93b763);

#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/features/gravitywarp-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/homography.h"
#include "c8/geometry/intrinsics.h"
#include "c8/hmatrix.h"
#include "c8/hpoint.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"

namespace c8 {

GravitywarpView::GravitywarpView() : gr8_(Gr8Gl::create()) {
  copyTexture_ = compileCopyTexture2D();
}

void GravitywarpView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;

  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void GravitywarpView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::cameraPreviewFeatures(appConfig_, glShader_.get(), &copyTexture_);
}

void GravitywarpView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &cameraProducer = data->producer<CameraPreviewDataProducer>();
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  // Draw features onto texture.
  auto cp = cameraProducer.cameraPreview();
  auto feats = gr8_.detectAndCompute(featureProducer.pyramid());

  int r = cp.rows();
  int c = cp.cols();

  auto l0 = featureProducer.pyramid().levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);

  auto pose = xrRotationFromDeviceRotation(data->devicePose());

  FrameWithPoints framePoints(intrinsics, pose.toRotationMat());
  // copy output.
  framePoints.reserve(feats.size());
  for (const auto &f : feats) {
    auto l = f.location();
    framePoints.addImagePixelPoint(
      HPoint2(l.pt.x, l.pt.y), l.scale, l.angle, l.gravityAngle, f.features().clone());
  }

  auto K = HMatrixGen::intrinsic(intrinsics);

  auto HR = gravityNormalRotation(pose);
  auto H = K * HR * K.inv();

  auto allCamPoints = framePoints.pixels();
  auto preFlatCamPoints = extrude<3>(allCamPoints);
  auto rotatedCamPoints = HR * K.inv() * preFlatCamPoints;
  auto preFlatWarpPoints = H * preFlatCamPoints;
  auto allWarpPoints = flatten<2>(preFlatWarpPoints);

  Vector<HPoint2> camPoints;
  Vector<HPoint2> warpPoints;
  Vector<HPoint2> lowPoints;
  Vector<HPoint2> midPoints;
  Vector<HPoint2> hiPoints;
  for (int i = 0; i < allCamPoints.size(); ++i) {
    if (rotatedCamPoints[i].z() > 0.2) {
      camPoints.push_back(allCamPoints[i]);
      warpPoints.push_back(allWarpPoints[i]);
      lowPoints.push_back(allCamPoints[i]);
    } else if (rotatedCamPoints[i].z() > 0) {
      midPoints.push_back(allCamPoints[i]);
    } else {
      hiPoints.push_back(allCamPoints[i]);
    }
  }

  if (!hideImage_) {
    drawPoints(lowPoints, 3, Color::YELLOW, cp);
    drawPoints(midPoints, 3, Color::DARK_YELLOW, cp);
    drawPoints(hiPoints, 3, Color::RED, cp);
  } else {
    // TODO(nb): warp image.
    fill(Color::BLACK, cp);
    float scale = .1f;
    HPoint2 offset = HPoint2(-10 * c / 2.0f, -10 * r / 2.0f);
    Vector<HPoint2> normWarpPts;
    for (auto pt : warpPoints) {
      normWarpPts.push_back(HPoint2((pt.x() - offset.x()) * scale, (pt.y() - offset.y()) * scale));
    }
    drawPoints(normWarpPts, 2, Color::YELLOW, cp);
  }
}

void GravitywarpView::gotTouches(const Vector<Touch> &touches) { hideImage_ = !hideImage_; }

}  // namespace c8
