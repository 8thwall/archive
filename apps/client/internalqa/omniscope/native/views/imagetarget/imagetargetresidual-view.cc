// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetresidual-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-stats",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-location",
    "//c8:c8-log",
    "//c8:color",
    "//c8:string",
    "//c8:random-numbers",
    "//c8:vector",
    "//c8/geometry:intrinsics",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/time:now",
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/geometry:pose-pnp",
    "//reality/engine/imagedetection:location",
  };
}
cc_end(0x05fafbf8);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetresidual-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/string/format.h"
#include "c8/time/now.h"
#include "reality/engine/geometry/pose-pnp.h"
#include "reality/engine/imagedetection/location.h"
#include "c8/stats/scope-timer.h"

namespace c8 {

ImageTargetResidualView::ImageTargetResidualView() : gr8_(Gr8Gl::create()) {
  copyTexture_ = compileCopyTexture2D();
}

void ImageTargetResidualView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void ImageTargetResidualView::initialize(
  std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::cameraPreviewFeatures(appConfig_, glShader_.get(), &copyTexture_);
}

void ImageTargetResidualView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &cameraProducer = data->producer<CameraPreviewDataProducer>();
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  auto newFrameMicros = nowMicros();
  DetectionImageStats frameStats;
  frameStats.frameTimeMicros = newFrameMicros - lastFrameMicros_;

  // Draw features onto texture.
  auto cp = cameraProducer.cameraPreview();

  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    return;
  }

  auto targetFeats = featureProducer.pyramid();
  auto l0 = targetFeats.levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);
  auto feats = getFeatures(intrinsics, featureProducer.pyramid(), &gr8_);

  HMatrix pose = HMatrixGen::i();

  Vector<PointMatch> matches;
  Vector<PointMatch> drawMatches;

  Vector<std::pair<HPoint2, HPoint2>> inlierResiduals;
  Vector<HPoint3> worldPts;
  Vector<HPoint2> camRays;
  RobustPoseScratchSpace scratch;
  Vector<uint8_t> inliers;

  int idx = 0;
  for (auto &entry : *appConfig_.imageTargets) {
    auto &im = entry.second;

    matches.clear();
    im.globalMatcher().match(feats, &matches);

    getPointsAndRays(matches, im.detectionImage(), feats, &worldPts, &camRays);

    if (!robustPnP(
          worldPts,
          camRays,
          HMatrixGen::i(),
          {},
          &pose,
          &inliers,
          &random_,
          &scratch)) {
      continue;
    }

    getInlierResiduals(intrinsics, pose, worldPts, camRays, inliers, &inlierResiduals);

    drawDetectedImage(im.detectionImage(), intrinsics, pose, cp);

    for (auto r : inlierResiduals) {
      drawLine(r.first, r.second, 2, Color::VIBRANT_PINK, cp);
      drawPoint(r.first, 2, 2, Color::BLUE, cp);
      drawPoint(r.second, 2, 2, Color::VIBRANT_YELLOW, cp);
    }

    srcName_ = entry.first;
    drawMatches = matches;

    frameStats.targetFound[idx]++;
    frameStats.inlierCount[idx] += inlierResiduals.size();

    idx++;
  }

  if (lastFrameMicros_ != 0) {
    auto m = stats_.add(frameStats);
    Vector<String> text = {
      format(
        "Found 0: %04.2f; 1: %04.2f; 2: %04.2f",
        m.targetFound[0],
        m.targetFound[1],
        m.targetFound[2]),
      format(
        "Inlier 0: %04.2f; 1: %04.2f; 2: %04.2f",
        m.inlierCount[0],
        m.inlierCount[1],
        m.inlierCount[2]),
      format("Frame Time ms:  %7.2f", m.frameTimeMicros / 1e3),
    };
    textBox(text, {10.0f, 30.0f}, cp.cols() - 20, cp);
  }

  lastFrameMicros_ = newFrameMicros;
}

void ImageTargetResidualView::gotTouches(const Vector<Touch> &touches) {
  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    srcName_ = "";
    return;
  }
  srcName_ = appConfig_.getNextImageTargetName(srcName_);
}

}  // namespace c8
