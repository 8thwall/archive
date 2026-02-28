// Copyright (c) 2019 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetroi-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-location",
    "//reality/engine/imagedetection:location",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-stats",
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
    "//reality/engine/features:image-descriptor",
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/features:local-matcher",
    "//reality/engine/geometry:pose-pnp",
    "//reality/engine/tracking:tracker",
  };
}
cc_end(0xb1d1eadf);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetroi-view.h"
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
#include "reality/engine/imagedetection/location.h"

namespace c8 {
ImageTargetRoiView::ImageTargetRoiView() : gr8_(Gr8Gl::create()) {
  copyTexture_ = compileCopyTexture2D();
}

void ImageTargetRoiView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void ImageTargetRoiView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr =
    ViewDataGen::cameraFeaturesCanvas(appConfig_, 480 * 3, 640, glShader_.get(), &copyTexture_);
};

void ImageTargetRoiView::processCpu(OmniscopeViewData *data) {
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

  auto previewHeight = cp.rows();
  auto previewWidth = cp.rows();

  if (appConfig_.imageTargets->find(srcName_) != appConfig_.imageTargets->end()) {
    auto &im = appConfig_.imageTargets->at(srcName_);
    previewHeight = im.previewPix().rows();
    previewWidth = im.previewPix().cols();
  }
  auto d0 = crop(dp, cp.rows(), cp.cols(), 0, 0);
  auto d1 = crop(dp, previewHeight, previewWidth, 0, cp.cols());
  auto d2 = crop(dp, cp.rows(), cp.cols(), 0, cp.cols() + previewWidth);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Draw third image camera feed early, in case of early return.
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  copyPixels(cp, &d2);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Run data processing.
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  auto pyr = featureProducer.pyramid();
  auto l0 = pyr.levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);
  auto feats = getFeatures(intrinsics, pyr, &gr8_);
  auto roiFeats = getFeaturesRoi(intrinsics, featureProducer.pyramid(), &gr8_);

  auto extrinsic = executeTracker(
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
  auto located = LocatedImage{};
  bool selected = false;
  const auto &its = tracker_.locatedImageTargets();
  for (int i = 0; i < its.size(); ++i) {
    const auto &res = its[i];
    featureProducer.gl().addNextDrawRoi(res.roi);
    // Use one that matches srcName_, else the last
    if (res.targetSpace.name == srcName_ || (!selected && i == its.size() - 1)) {
      found = res.targetSpace;
      located = res;
      srcName_ = found.name;
      selected = true;
    }
  }

  int roiIdx = -1;
  if (!pyr.rois.empty()) {
    for (int i = 0; i < pyr.rois.size(); ++i) {
      if (pyr.rois[i].roi.name == srcName_) {
        roiIdx = i;
      }
    }
  }

  featureProducer.gl().addNextDrawHiResScans(intrinsics, {0.0f, 0.0f});

  if (roiIdx < 0) {
    return;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Draw First image
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  auto &im = appConfig_.imageTargets->at(srcName_);
  auto framePixels = im.framePoints().pixels();

  // Draw the ROI image in the top left.
  auto roiIm = pyr.roi(roiIdx);
  auto roiDest = crop(d0, roiIm.rows(), roiIm.cols(), 0, (d0.cols() - roiIm.cols()) / 2);
  drawImageChannel(roiIm, 0, roiDest);

  // Draw the ideal image location, which is the size of the 3rd pyramid level.
  auto p2 = pyr.level(2);
  float l2or = (roiIm.rows() - p2.rows()) / 2;
  float l2oc = (roiIm.cols() - p2.cols()) / 2;
  Vector<HPoint2> l2corners = {
    {l2oc, l2or},
    {l2oc + p2.cols(), l2or},
    {l2oc + p2.cols(), l2or + p2.rows()},
    {l2oc, l2or + p2.rows()},
  };
  drawShape(l2corners, 2, Color::CHERRY, roiDest);

  // Draw local matches in the ROI space.
  float p2sc = static_cast<float>(p2.rows()) / l0.h;
  auto fscale = HMatrixGen::translation(l2oc, l2or, 0.0f) * HMatrixGen::scale(p2sc, p2sc, 1.0f);

  const Vector<PointMatch> &localMatches = tracker_.imTracker().localMatches(srcName_);
  ROI roi = pyr.rois[roiIdx];
  auto l = pyr.rois[roiIdx].layout;
  auto b = l0;

  auto rpix = roiFeats[roiIdx].pixels();
  TreeMap<size_t, bool> cameraMatches;
  for (size_t i = 0; i < rpix.size(); ++i) {
    cameraMatches[i] = false;
  }

  // Used for feature points from a curvy image target ROI.
  Vector<HPoint2> pixelsInLiftedTargetSpace;
  // Used for feature points from all other ROIs (which use the warp matrix).
  HMatrix iscale = HMatrixGen::i();
  if (roi.roi.source == ImageRoi::Source::CURVY_IMAGE_TARGET) {
    float liftedRows = (static_cast<float>(roi.roi.geom.srcCols) / roi.roi.geom.srcRows < .75f)
      ? l.h * roi.roi.geom.srcRows / roi.roi.geom.srcRows
      : l.h * roi.roi.geom.srcRows / (roi.roi.geom.srcCols / .75);
    float liftedCols = (static_cast<float>(roi.roi.geom.srcCols) / roi.roi.geom.srcRows < .75f)
      ? l.w * roi.roi.geom.srcCols / (.75f * roi.roi.geom.srcRows)
      : l.w * roi.roi.geom.srcCols / roi.roi.geom.srcCols;

    CurvyImageGeometry liftedGeom = roi.roi.geom;
    liftedGeom.srcRows = liftedRows;
    liftedGeom.srcCols = liftedCols;

    Vector<HPoint2> raysInSearchWorld;
    std::transform(
      localMatches.begin(),
      localMatches.end(),
      std::back_inserter(raysInSearchWorld),
      [&rpix, &roi](const PointMatch &m) -> HPoint2 {
        HPoint3 rayInSearchPixel = rpix[m.wordsIdx].extrude();
        return (roi.roi.intrinsics.inv() * rayInSearchPixel).flatten();
      });
    pixelsInLiftedTargetSpace =
      cameraPointsSearchWorldToTargetPixel(liftedGeom, raysInSearchWorld, roi.roi.globalPose);
  } else {
    auto wscale = HMatrixGen::scale(b.w - 1.0f, b.h - 1.0f, 1.0f)
      * HMatrixGen::translation(0.5f, 0.5f, 0.0f) * HMatrixGen::scale(0.5f, 0.5f, 1.0f)
      * pyr.rois[roiIdx].roi.warp.inv() * HMatrixGen::scale(2.0f, 2.0f, 1.0f)
      * HMatrixGen::translation(-0.5f, -0.5f, 0.0f)
      * HMatrixGen::scale(1.0f / (l.w - 1), 1.0f / (l.h - 1), 1.0);
    iscale = wscale.inv();
  }

  size_t idx = 0;
  for (auto m : localMatches) {
    cameraMatches[m.wordsIdx] = true;
    auto rp = rpix[m.wordsIdx];
    auto fp = framePixels[m.dictionaryIdx];

    HPoint2 fromPt = roi.roi.source == ImageRoi::Source::CURVY_IMAGE_TARGET
      ? pixelsInLiftedTargetSpace[idx]
      : (iscale * HPoint3{rp.x(), rp.y(), 1.0f}).truncate();
    drawPoint(fromPt, 3, Color::PURPLE, roiDest);

    HPoint2 toPt = (fscale * HPoint3{fp.x(), fp.y(), 1.0f}).flatten();
    if (im.rotateFeatures()) {
      toPt = {roiDest.cols() - 1 - toPt.y(), toPt.x()};
    }
    drawPoint(toPt, 3, Color::MANGO, roiDest);

    if (
      tracker_.imTracker().inliers(srcName_).size() > idx
      && tracker_.imTracker().inliers(srcName_)[idx++]) {
      drawLine(fromPt, toPt, 2, Color::MINT, roiDest);
    } else {
      drawLine(fromPt, toPt, 2, Color::CHERRY, roiDest);
    }
  }

  // Draw the located image in the ROI space.
  // TODO(paris) Add support for drawing the CURVY_IMAGE_TARGET ROI.
  auto wcorners = locatedImageCorners(intrinsics, extrinsic, located);
  Vector<HPoint2> lcorners;
  if (roi.roi.source != ImageRoi::Source::CURVY_IMAGE_TARGET) {
    for (auto pt : wcorners) {
      lcorners.push_back((iscale * HPoint3{pt.x(), pt.y(), 1.0f}).truncate());
    }
  }
  drawShape(lcorners, 2, Color::MANGO, roiDest);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Draw second image
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  copyPixels(im.previewPix(), &d1);

  float matchAvgLength = 0;
  float matchAvgLengthPostFit = 0;

  float angleFromLastPose = 0.0f;
  Vector<float> distXs(1);
  Vector<float> distYs(1);

  const auto &featsRayInTargetView = tracker_.imTracker().featsRayInTargetView(srcName_);
  const auto &featsRayInTargetViewPostFit =
    tracker_.imTracker().featsRayInTargetViewPostFit(srcName_);
  auto tk = HMatrixGen::intrinsic(im.framePoints().intrinsic());
  size_t nMatches = localMatches.size();
  float nInv = 1.0 / nMatches;
  distXs.resize(nMatches);
  distYs.resize(nMatches);

  for (size_t i = 0; i < localMatches.size(); ++i) {
    // Pre-fit
    auto &match = localMatches[i];
    HPoint2 fromPt =
      (tk * featsRayInTargetView.points()[match.wordsIdx].position().extrude()).flatten();
    HPoint2 toPt = framePixels[match.dictionaryIdx];
    if (im.rotateFeatures()) {
      fromPt = {d1.cols() - 1 - fromPt.y(), fromPt.x()};
      toPt = {d1.cols() - 1 - toPt.y(), toPt.x()};
    }
    auto distX = toPt.x() - fromPt.x();
    auto distY = toPt.y() - fromPt.y();
    matchAvgLength += (distX * distX + distY * distY) * nInv;

    // Post-fit
    HPoint2 fromPt2 =
      (tk * featsRayInTargetViewPostFit.points()[match.wordsIdx].position().extrude()).flatten();
    if (im.rotateFeatures()) {
      fromPt2 = {d1.cols() - 1 - fromPt2.y(), fromPt2.x()};
    }
    drawLine(fromPt2, toPt, 2, Color::BLUE, d1);

    if (
      tracker_.imTracker().inliers(srcName_).size() > i
      && tracker_.imTracker().inliers(srcName_)[i]) {
      drawLine(fromPt, toPt, 2, Color::MINT, d1);
    } else {
      drawLine(fromPt, toPt, 2, Color::CHERRY, d1);
    }
    drawPoint(toPt, 3, Color::MANGO, d1);
    distXs.push_back(distX);
    distYs.push_back(distY);

    distX = toPt.x() - fromPt2.x();
    distY = toPt.y() - fromPt2.y();
    matchAvgLengthPostFit += (distX * distX + distY * distY) * nInv;
  }
  for (const auto &ray : featsRayInTargetView.points()) {
    auto pixelPt = (tk * ray.position().extrude()).flatten();
    if (im.rotateFeatures()) {
      pixelPt = {d1.cols() - 1 - pixelPt.y(), pixelPt.x()};
    }
    drawPoint(pixelPt, 3, Color::PURPLE, d1);
  }

  size_t medianMark = nMatches / 2;
  std::nth_element(distXs.begin(), distXs.begin() + medianMark, distXs.end());
  std::nth_element(distYs.begin(), distYs.begin() + medianMark, distYs.end());

  angleFromLastPose = tracker_.imTracker().angleFromLastPose(srcName_);
  frameStats.targetRatio[0] = targetRatioInImage(im.detectionImage(), intrinsics, found.pose);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Draw third image
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  size_t i = 0;
  for (auto p : rpix) {
    if (cameraMatches[i++]) {
      drawPoint(p, 3, Color::MINT, d2);
    } else {
      drawPoint(p, 3, Color::CHERRY, d2);
    }
  }
  if (found.isUsable()) {
    drawDetectedImage(im.detectionImage(), intrinsics, found.pose, d2);
  } else {
    drawDetectedImageDark(im.detectionImage(), intrinsics, found.pose, d2);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Draw stats textbox.
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  if (lastFrameMicros_ != 0) {
    auto m = stats_.add(frameStats);
    auto lPoseData = found.pose.data();
    Vector<String> lines = {
      format("%d -> %s", its.size(), srcName_.c_str()),
      format("Frame number: %d. Matches: %d.", tracker_.currentFrame(), nMatches),
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
    textBox(lines, {10.0f, roiDest.rows() + 10.0f}, d0.cols() - 20, d0);
  }

  lastFrameMicros_ = newFrameMicros;
}

void ImageTargetRoiView::gotTouches(const Vector<Touch> &touches) {
  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    srcName_ = "";
    return;
  }
  srcName_ = appConfig_.getNextImageTargetName(srcName_);
}

}  // namespace c8
