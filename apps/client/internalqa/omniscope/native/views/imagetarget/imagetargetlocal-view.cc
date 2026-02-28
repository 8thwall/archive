// Copyright (c) 2019 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetlocal-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-location",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-stats",
    "//c8:c8-log",
    "//c8:color",
    "//c8:string",
    "//c8:random-numbers",
    "//c8/stats:scope-timer",
    "//c8/time:now",
    "//c8:vector",
    "//c8/geometry:intrinsics",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/string:format",
    "//reality/engine/features:image-descriptor",
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/features:local-matcher",
    "//reality/engine/geometry:pose-pnp",
    "//reality/engine/tracking:tracker",
  };
}
cc_end(0x2f8a9f0c);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetlocal-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "c8/time/now.h"
#include "reality/engine/geometry/pose-pnp.h"

namespace c8 {
ImageTargetLocalView::ImageTargetLocalView() : gr8_(Gr8Gl::create()) {
  copyTexture_ = compileCopyTexture2D();
}

void ImageTargetLocalView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  srcName_ = appConfig_.imageTargets->begin()->first;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void ImageTargetLocalView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr =
    ViewDataGen::cameraFeaturesCanvas(appConfig_, 480 * 2, 640 * 2, glShader_.get(), &copyTexture_);
};

void ImageTargetLocalView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  auto newFrameMicros = nowMicros();
  DetectionImageStats frameStats;
  frameStats.frameTimeMicros = newFrameMicros - lastFrameMicros_;

  // Draw features onto texture.
  auto cp = data->producer<CameraPreviewDataProducer>().cameraPreview();
  auto dp = data->renderer<PixelBufferTextureRenderer>().displayBuf();

  fill(Color::BLACK, dp);

  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    return;
  }
  auto pyr = featureProducer.pyramid();
  auto l0 = pyr.levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);
  auto feats = getFeatures(intrinsics, pyr, &gr8_);
  auto roiFeats = getFeaturesRoi(intrinsics, featureProducer.pyramid(), &gr8_);

  executeTracker(
    &tracker_,
    appConfig_.detectionImages(),
    &random_,
    appConfig_.deviceModel,
    appConfig_.deviceManufacturer,
    feats,
    roiFeats,
    featureProducer.pyramid(),
    data->devicePose(),
    data->eventQueue(),
    data->timeNanos(),
    data->videoTimeNanos(),
    data->frameTimeNanos());

  auto found = TrackedImage{};
  bool selected = false;
  const auto &its = tracker_.locatedImageTargets();
  for (int i = 0; i < its.size(); ++i) {
    const auto &res = its[i];
    featureProducer.gl().addNextDrawRoi(res.roi);
    // Use one that matches srcName_, else the last
    if (res.targetSpace.name == srcName_ || (!selected && i == its.size() - 1)) {
      found = res.targetSpace;
      srcName_ = found.name;
      selected = true;
    }
  }
  featureProducer.gl().addNextDrawHiResScans(intrinsics, {0.0f, 0.0f});

  RobustPoseScratchSpace scratch;
  auto br = crop(dp, cp.rows(), cp.cols(), dp.rows() - cp.rows(), dp.cols() - cp.cols());
  copyPixels(cp, &br);

  auto &im = appConfig_.imageTargets->at(srcName_);
  auto tl = crop(dp, cp.rows(), cp.cols(), 0, 0);

  // Copy pixels of the source image.
  copyPixels(im.previewPix(), &tl);

  drawFeatures(feats, br);

  // Draw Global Match top-left to bottom-right
  if (found.isLocated() && false) {
    drawFeatures(im.framePoints(), tl);
    Vector<PointMatch> globalMatches = tracker_.imTracker().globalMatches(srcName_);
    auto targetPixels = im.framePoints().pixels();
    auto imagePixels = feats.pixels();
    for (int i = 0; i < globalMatches.size(); i++) {
      if (!tracker_.imTracker().globalInliers(srcName_)[i]) {
        continue;
      }

      const auto match = globalMatches[i];
      auto target = targetPixels[match.dictionaryIdx];
      auto image = imagePixels[match.wordsIdx];
      // Color based on goodness of match.
      uint8_t heatMapVal = 255 - static_cast<uint8_t>(match.descriptorDist);
      drawLine(target, {image.x() + tl.cols(), image.y() + tl.rows()}, 1, heatMap(heatMapVal), dp);
    }
  }

  // Draw local matches on the top-right quadrant
  auto tr = crop(dp, cp.rows(), cp.cols(), 0, cp.cols());
  copyPixels(im.previewPix(), &tr);

  auto bl = crop(dp, cp.rows(), cp.cols(), cp.rows(), 0);
  float matchAvgLength = 0;
  float matchAvgLengthPostFit = 0;
  fill(Color::WHITE, bl);

  float angleFromLastPose = 0.0f;

  size_t nMatches = 0;
  size_t medianMark = 0;
  Vector<float> distXs(1);
  Vector<float> distYs(1);
  {
    const auto &featsRayInTargetView = tracker_.imTracker().featsRayInTargetView(srcName_);
    const auto &featsRayInTargetViewPostFit =
      tracker_.imTracker().featsRayInTargetViewPostFit(srcName_);
    auto tk = HMatrixGen::intrinsic(im.framePoints().intrinsic());
    for (const auto &ray : featsRayInTargetView.points()) {
      auto pixelPt = (tk * ray.position().extrude()).flatten();
      if (im.rotateFeatures()) {
        pixelPt = {tr.cols() - 1 - pixelPt.y(), pixelPt.x()};
      }
      drawPoint(pixelPt, 5, Color::MANGO, tr);
    }
    for (const auto &ray : featsRayInTargetViewPostFit.points()) {
      auto pixelPt = (tk * ray.position().extrude()).flatten();
      if (im.rotateFeatures()) {
        pixelPt = {tl.cols() - 1 - pixelPt.y(), pixelPt.x()};
      }
      drawPoint(pixelPt, 5, Color::MANGO, tl);
    }
    const auto &localMatches = tracker_.imTracker().localMatches(srcName_);
    auto framePixels = im.framePoints().pixels();
    nMatches = localMatches.size();
    float nInv = 1.0 / nMatches;
    distXs.resize(nMatches);
    distYs.resize(nMatches);

    // If pose detection succeeded, draw the inlier local matches consistent with that detection.
    // Guard against empty inliers, which can happen if we began with local detection and computed
    // localMatches, then exited local early and subsequently suceeded in global detection.
    if (localMatches.size() == tracker_.imTracker().inliers(srcName_).size()) {
      for (size_t i = 0; i < localMatches.size(); ++i) {
        if (!tracker_.imTracker().inliers(srcName_)[i]) {
          continue;
        }
        // Pre-fit
        auto &match = localMatches[i];
        HPoint2 fromPt =
          (tk * featsRayInTargetView.points()[match.wordsIdx].position().extrude()).flatten();
        HPoint2 toPt = framePixels[match.dictionaryIdx];
        auto distX = toPt.x() - fromPt.x();
        auto distY = toPt.y() - fromPt.y();
        matchAvgLength += (distX * distX + distY * distY) * nInv;
        drawLine(fromPt, toPt, 2, Color::MINT, tr);
        drawPoint(fromPt, 3, Color::CHERRY, bl);
        drawPoint(toPt, 3, Color::MINT, bl);
        distXs.push_back(distX);
        distYs.push_back(distY);
        // Post-fit
        HPoint2 fromPt2 =
          (tk * featsRayInTargetViewPostFit.points()[match.wordsIdx].position().extrude())
            .flatten();
        drawLine(fromPt2, toPt, 2, Color::MINT, tl);
        distX = toPt.x() - fromPt2.x();
        distY = toPt.y() - fromPt2.y();
        matchAvgLengthPostFit += (distX * distX + distY * distY) * nInv;
      }
    }
    size_t medianMark = nMatches / 2;
    std::nth_element(distXs.begin(), distXs.begin() + medianMark, distXs.end());
    std::nth_element(distYs.begin(), distYs.begin() + medianMark, distYs.end());

    angleFromLastPose = tracker_.imTracker().angleFromLastPose(srcName_);
    frameStats.targetRatio[0] = targetRatioInImage(im.detectionImage(), intrinsics, found.pose);
  }

  if (found.isUsable()) {
    drawDetectedImage(im.detectionImage(), intrinsics, found.pose, br);
  } else {
    drawDetectedImageDark(im.detectionImage(), intrinsics, found.pose, br);
  }

  if (lastFrameMicros_ != 0) {
    auto m = stats_.add(frameStats);
    auto lPoseData = found.pose.data();
    Vector<String> lines = {
      format("%d -> %s", its.size(), srcName_.c_str()),
      format("Matches %d", nMatches),
      format("Avg px length^2 %.2f => %.2f", matchAvgLength, matchAvgLengthPostFit),
      format("Median x %f", distXs[medianMark]),
      format("Median y %f", distYs[medianMark]),
      format("PnP %s", found.isLocated() ? "OFF" : "on"),
      format("LocalPose %s", found.isTracked() ? "YES" : "no"),
      format("Frame Time ms:  %7.2f", m.frameTimeMicros / 1e3),
      format("Target Ratio:  %4.3f", m.targetRatio[0]),
      format("Cosine angle (deg):  %f", angleFromLastPose * 180 / M_PI),
      format("U %.4f %.4f %.4f %.4f", lPoseData[0], lPoseData[1], lPoseData[2], lPoseData[3]),
      format("U %.4f %.4f %.4f %.4f", lPoseData[4], lPoseData[5], lPoseData[6], lPoseData[7]),
      format("U %.4f %.4f %.4f %.4f", lPoseData[8], lPoseData[9], lPoseData[10], lPoseData[11]),
      format("U %.4f %.4f %.4f %.4f", lPoseData[12], lPoseData[13], lPoseData[14], lPoseData[15]),
    };
    textBox(lines, {10.0f, 20.0f}, bl.cols() - 10, bl);
  }

  lastFrameMicros_ = newFrameMicros;
}

void ImageTargetLocalView::gotTouches(const Vector<Touch> &touches) {
  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    srcName_ = "";
    return;
  }
  srcName_ = appConfig_.getNextImageTargetName(srcName_);
}

}  // namespace c8
