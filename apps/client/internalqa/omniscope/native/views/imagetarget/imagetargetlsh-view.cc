// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetlsh-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-location",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-stats",
    "//c8:c8-log",
    "//c8:color",
    "//c8:string",
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
  };
}
cc_end(0xc40be0d5);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetlsh-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "c8/time/now.h"

namespace c8 {

ImageTargetLshView::ImageTargetLshView() : gr8_(Gr8Gl::create()) {
  copyTexture_ = compileCopyTexture2D();
}

void ImageTargetLshView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  srcName_ = appConfig_.imageTargets->begin()->first;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void ImageTargetLshView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr =
    ViewDataGen::cameraFeaturesCanvas(appConfig_, 480 * 2, 640 * 2, glShader_.get(), &copyTexture_);
}

void ImageTargetLshView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  auto newFrameMicros = nowMicros();
  DetectionImageStats frameStats;

  frameStats.frameTimeMicros = newFrameMicros - lastFrameMicros_;

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
  C8Log("[lsh-view] got %d rois", roiFeats.size());
  for (const auto &f : roiFeats) {
    C8Log("[lsh-view] got roi source %d", f.roi().source);
    if (f.roi().source == ImageRoi::Source::HIRES_SCAN) {
      C8Log("[lsh-view] Adding %d feats to %d", f.points().size(), hiresFeats.points().size());
      hiresFeats.addAll(f);
    }
    C8Log("[lsh-view] Now have %d feats", hiresFeats.points().size());
  }

  Vector<uint8_t> inliers;
  Vector<PointMatch> matches;

  auto &im = appConfig_.imageTargets->at(srcName_);

  matches.clear();
  im.globalMatcher().match(hiresFeats, 128, &matches);

  frameStats.numMatches = matches.size();

  auto tl = crop(dp, cp.rows(), cp.cols(), 0, 0);
  auto br = crop(dp, cp.rows(), cp.cols(), dp.rows() - cp.rows(), dp.cols() - cp.cols());

  // Copy pixels of the source image.
  fill(Color::BLACK, tl);
  copyPixels(im.previewPix(), &tl);
  copyPixels(cp, &br);

  drawFeatures(im.framePoints(), tl, false, im.rotateFeatures(), im.previewPix().cols());
  drawFeatures(hiresFeats, br);

  auto targetPixels = im.framePoints().pixels();
  auto imagePixels = hiresFeats.pixels();
  for (int i = 0; i < matches.size(); i++) {
    const auto match = matches[i];
    auto target = targetPixels[match.dictionaryIdx];
    if (im.rotateFeatures()) {
      target = {im.previewPix().cols() - 1 - target.y(), target.x()};
    }
    auto image = imagePixels[match.wordsIdx];
    frameStats.scoresHistogram[match.descriptorDist] += 1;
    if (match.descriptorDist > DetectionImage::DESCRIPTOR_DISTANCE_THRESHOLD_ORB) {
      continue;
    }
    // Color based on goodness of match.
    uint8_t heatMapVal = 255 - static_cast<uint8_t>(match.descriptorDist);
    drawLine(target, {image.x() + tl.cols(), image.y() + tl.rows()}, 1, heatMap(heatMapVal), dp);
  }

  if (lastFrameMicros_ != 0) {
    auto meanStats = stats_.add(frameStats);
    auto tr = crop(dp, cp.rows(), cp.cols(), 0, dp.cols() - cp.cols());
    Vector<String> text = {
      format("Feature matches: %7.2f", meanStats.numMatches),
      format("Frame Time ms:  %7.2f", meanStats.frameTimeMicros / 1e3),
    };
    textBox(text, {10.0f, 30.0f}, cp.cols() - 20, tr);

    double histMax = 0;
    for (int i = 0; i < meanStats.scoresHistogram.size(); ++i) {
      histMax = std::max(histMax, meanStats.scoresHistogram[i]);
    }
    auto scale = 255.0 / histMax / 2;
    auto plotIm = crop(tr, 280, 280, cp.rows() / 2 - 140, cp.cols() / 2 - 141);
    fill(Color::OFF_WHITE, plotIm);
    drawLine({15.0f, 9.0f}, {271.0f, 9.0f}, 3, Color::PURPLE_GRAY, plotIm);
    drawLine({15.0f, 9.0f + 64.0f}, {271.0f, 9.0f + 64.0f}, 3, Color::PURPLE_GRAY, plotIm);
    drawLine({15.0f, 9.0f + 128.0f}, {271.0f, 9.0f + 128.0f}, 3, Color::PURPLE_GRAY, plotIm);
    drawLine({15.0f, 9.0f + 192.0f}, {271.0f, 9.0f + 192.0f}, 3, Color::PURPLE_GRAY, plotIm);
    drawLine({271.0f, 9.0f}, {271.0f, 265.0f}, 3, Color::PURPLE_GRAY, plotIm);
    drawLine({271.0f - 64.0f, 9.0f}, {271.0f - 64.0f, 265.0f}, 3, Color::PURPLE_GRAY, plotIm);
    drawLine({271.0f - 128.0f, 9.0f}, {271.0f - 128.0f, 265.0f}, 3, Color::PURPLE_GRAY, plotIm);
    drawLine({271.0f - 192.0f, 9.0f}, {271.0f - 192.0f, 265.0f}, 3, Color::PURPLE_GRAY, plotIm);
    putText("32", {9.0f + 64.0f, 265.0f}, Color::PURPLE, Color::OFF_WHITE, plotIm);
    putText("64", {9.0f + 128.0f, 265.0f}, Color::PURPLE, Color::OFF_WHITE, plotIm);
    putText("96", {9.0f + 192.0f, 265.0f}, Color::PURPLE, Color::OFF_WHITE, plotIm);
    putText(format("%4.1f", histMax), {15.0f, 15.0f}, Color::PURPLE, Color::OFF_WHITE, plotIm);
    drawLine({15.0f, 5.0f}, {15.0f, 275.0f}, 3, Color::CHERRY, plotIm);
    drawLine({5.0f, 265.0f}, {275.0f, 265.0f}, 3, Color::CHERRY, plotIm);
    for (int i = 0; i < meanStats.scoresHistogram.size() / 2; i += 2) {
      float h = (meanStats.scoresHistogram[i] + meanStats.scoresHistogram[i + 1]) * scale;
      drawPoint({15.0f + i * 2 + 2, 265.0f - h}, 4, 2, Color::DARK_BLUE, plotIm);
    }
  }

  lastFrameMicros_ = newFrameMicros;
  featureProducer.gl().addNextDrawHiResScans(intrinsics, {0.0f, 0.0f});
}

void ImageTargetLshView::gotTouches(const Vector<Touch> &touches) {
  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    srcName_ = "";
    return;
  }
  srcName_ = appConfig_.getNextImageTargetName(srcName_);
}

}  // namespace c8
