// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetpose-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
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
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/geometry:pose-pnp",
    "//reality/engine/imagedetection:location",
  };
}
cc_end(0x9a134578);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetpose-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "reality/engine/geometry/pose-pnp.h"
#include "reality/engine/imagedetection/location.h"

namespace c8 {

ImageTargetPoseView::ImageTargetPoseView() : gr8_(Gr8Gl::create()) {
  copyTexture_ = compileCopyTexture2D();
}

void ImageTargetPoseView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  srcName_ = appConfig_.imageTargets->begin()->first;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void ImageTargetPoseView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr =
    ViewDataGen::cameraFeaturesCanvas(appConfig_, 480 * 2, 640 * 2, glShader_.get(), &copyTexture_);
};

void ImageTargetPoseView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  // Draw features onto texture.
  auto cp = data->producer<CameraPreviewDataProducer>().cameraPreview();
  auto dp = data->renderer<PixelBufferTextureRenderer>().displayBuf();

  fill(0, 0, 0, 255, &dp);

  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    return;
  }
  auto pyr = featureProducer.pyramid();
  auto l0 = pyr.levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);
  auto feats = getFeatures(intrinsics, pyr, &gr8_);
  auto roiFeats = getFeaturesRoi(intrinsics, pyr, &gr8_);

  auto hiresFeats = feats.clone();
  for (const auto &f : roiFeats) {
    if (f.roi().source == ImageRoi::Source::HIRES_SCAN) {
      hiresFeats.addAll(f);
    }
  }

  HMatrix pose = HMatrixGen::i();

  Vector<uint8_t> inliers;
  Vector<uint8_t> drawInliers;
  Vector<PointMatch> matches;
  Vector<PointMatch> drawMatches;

  Vector<HPoint3> worldPts;
  Vector<HPoint2> camRays;
  RobustPoseScratchSpace scratch;

  auto brShiftX = dp.cols() - cp.cols();
  auto brShiftY = dp.rows() - cp.rows();
  auto br = crop(dp, cp.rows(), cp.cols(), brShiftY, brShiftX);
  copyPixels(cp, &br);

  for (auto &entry : *appConfig_.imageTargets) {
    auto &im = entry.second;

    matches.clear();
    im.globalMatcher().match(hiresFeats, &matches);

    getPointsAndRays(matches, im.detectionImage(), hiresFeats, &worldPts, &camRays);

    if (!robustPnP(worldPts, camRays, HMatrixGen::i(), {}, &pose, &inliers, &random_, &scratch)) {
      continue;
    }

    drawDetectedImage(im.detectionImage(), intrinsics, pose, br);

    srcName_ = entry.first;
    drawInliers = inliers;
    drawMatches = matches;
  }

  auto &im = appConfig_.imageTargets->at(srcName_);

  auto tl = crop(dp, cp.rows(), cp.cols(), 0, 0);

  // Copy pixels of the source image.
  fill(Color::BLACK, tl);
  copyPixels(im.previewPix(), &tl);

  drawFeatures(im.framePoints(), tl, false, im.rotateFeatures(), im.previewPix().cols());
  drawFeatures(hiresFeats, br);

  auto targetPixels = im.framePoints().pixels();
  auto imagePixels = hiresFeats.pixels();
  for (int i = 0; i < drawMatches.size(); i++) {
    if (!drawInliers[i]) {
      continue;
    }

    const auto match = drawMatches[i];
    auto target = targetPixels[match.dictionaryIdx];
    if (im.rotateFeatures()) {
      target = {im.previewPix().cols() - 1 - target.y(), target.x()};
    }
    auto image = imagePixels[match.wordsIdx];
    // Color based on goodness of match.
    uint8_t heatMapVal = 255 - static_cast<uint8_t>(match.descriptorDist);
    drawLine(target, {image.x() + brShiftX, image.y() + brShiftY}, 1, heatMap(heatMapVal), dp);
  }
  featureProducer.gl().addNextDrawHiResScans(intrinsics, {0.0f, 0.0f});
}

void ImageTargetPoseView::gotTouches(const Vector<Touch> &touches) {
  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    srcName_ = "";
    return;
  }
  srcName_ = appConfig_.getNextImageTargetName(srcName_);
}

}  // namespace c8
