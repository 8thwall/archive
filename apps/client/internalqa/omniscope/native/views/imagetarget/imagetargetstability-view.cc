// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetstability-view.h",
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
    "//c8/pixels:draw-figure",
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
cc_end(0x028781bf);

#include <chrono>

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetstability-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/draw-figure.h"
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

ImageTargetStabilityView::ImageTargetStabilityView() : gr8_(Gr8Gl::create()) {
  copyTexture_ = compileCopyTexture2D();
}

void ImageTargetStabilityView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void ImageTargetStabilityView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr =
    ViewDataGen::cameraFeaturesCanvas(appConfig_, 480 * 2, 640, glShader_.get(), &copyTexture_);
};

void ImageTargetStabilityView::processCpu(OmniscopeViewData *data) {
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

  auto d0 = crop(dp, cp.rows(), cp.cols(), 0, 0);
  auto d1 = crop(dp, cp.rows(), cp.cols(), 0, cp.cols());

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Draw 2nd image camera feed early, in case of early return.
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  copyPixels(cp, &d1);

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

  auto &im = appConfig_.imageTargets->at(srcName_);
  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Draw First image
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // only show a set number of data points
  // used when tuning the filter parameters
  const bool WINDOWED_DRAW = false;
  if (found.isUsable()) {
    HVector3 t = translation(found.pose);
    Quaternion r = rotation(found.pose);
    timeSeries_.push_back(newFrameMicros);
    xSeries_.push_back(t.x());
    ySeries_.push_back(t.y());
    zSeries_.push_back(t.z());
    xSeriesUnfiltered_.push_back(found.unfilteredPosition_.x());
    ySeriesUnfiltered_.push_back(found.unfilteredPosition_.y());
    zSeriesUnfiltered_.push_back(found.unfilteredPosition_.z());

    qwSeries_.push_back(r.w());
    qxSeries_.push_back(r.x());
    qySeries_.push_back(r.y());
    qzSeries_.push_back(r.z());
    qwSeriesUnfiltered_.push_back(found.unfilteredRotation_.w());
    qxSeriesUnfiltered_.push_back(found.unfilteredRotation_.x());
    qySeriesUnfiltered_.push_back(found.unfilteredRotation_.y());
    qzSeriesUnfiltered_.push_back(found.unfilteredRotation_.z());

    if (WINDOWED_DRAW && timeSeries_.size() > 30) {
      timeSeries_.pop_front();
      xSeries_.pop_front();
      ySeries_.pop_front();
      zSeries_.pop_front();
      xSeriesUnfiltered_.pop_front();
      ySeriesUnfiltered_.pop_front();
      zSeriesUnfiltered_.pop_front();

      qwSeries_.pop_front();
      qxSeries_.pop_front();
      qySeries_.pop_front();
      qzSeries_.pop_front();
      qwSeriesUnfiltered_.pop_front();
      qxSeriesUnfiltered_.pop_front();
      qySeriesUnfiltered_.pop_front();
      qzSeriesUnfiltered_.pop_front();
    }
  }

  const bool drawFiltered = false;

  Figure fig;
  fig.xAxis(timeSeries_.begin(), timeSeries_.end());
  fig.line(xSeries_.begin(), xSeries_.end(), Color::RED, "~cx");
  fig.line(ySeries_.begin(), ySeries_.end(), Color::GREEN, "~cy");
  fig.line(zSeries_.begin(), zSeries_.end(), Color::BLUE, "~cz");

  fig.line(qwSeries_.begin(), qwSeries_.end(), Color::YELLOW, "~qw");
  fig.line(qxSeries_.begin(), qxSeries_.end(), Color::CHERRY, "~qx");
  fig.line(qySeries_.begin(), qySeries_.end(), Color::MANGO, "~qy");
  fig.line(qzSeries_.begin(), qzSeries_.end(), Color::MINT, "~qz");
  if (drawFiltered) {
    fig.line(xSeriesUnfiltered_.begin(), xSeriesUnfiltered_.end(), Color::VIBRANT_BLUE, "cx");
    fig.line(ySeriesUnfiltered_.begin(), ySeriesUnfiltered_.end(), Color::VIBRANT_PINK, "cy");
    fig.line(zSeriesUnfiltered_.begin(), zSeriesUnfiltered_.end(), Color::VIBRANT_YELLOW, "cz");

    fig.line(qwSeriesUnfiltered_.begin(), qwSeriesUnfiltered_.end(), Color::CANARY, "qw");
    fig.line(qxSeriesUnfiltered_.begin(), qxSeriesUnfiltered_.end(), Color::PURPLE_POP, "qx");
    fig.line(qySeriesUnfiltered_.begin(), qySeriesUnfiltered_.end(), Color::DULL_PINK, "qy");
    fig.line(qzSeriesUnfiltered_.begin(), qzSeriesUnfiltered_.end(), Color::DARK_MATCHA, "qz");
  }

  fig.legend();
  fig.draw(d0);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Draw 2nd image
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////

  if (found.isUsable()) {
    drawDetectedImage(im.detectionImage(), intrinsics, found.pose, d1);
    drawDetectedImageTargetTexture(im, intrinsics, found.pose, d1);
    drawAxis(found.pose, HMatrixGen::intrinsic(intrinsics), HPoint3(0.f, 0.f, 0.f), 1, d1);
  } else {
    drawDetectedImageDark(im.detectionImage(), intrinsics, found.pose, d1);
  }
}

void ImageTargetStabilityView::gotTouches(const Vector<Touch> &touches) {
  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    srcName_ = "";
    return;
  }
  srcName_ = appConfig_.getNextImageTargetName(srcName_);
}

}  // namespace c8
