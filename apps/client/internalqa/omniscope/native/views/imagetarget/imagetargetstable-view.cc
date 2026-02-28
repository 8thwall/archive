// Copyright (c) 2025 Niantic Spatial, Inc.
// Original Author: Yuling Wang (yuling@nianticspatial.com)
//
// Description: This file implements the ImageTargetStableView class, which is used to display the
// Gravity direction in the camera view.

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetstable-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-location",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-stats",
    "//c8:c8-log",
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
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/tracking:tracker",
  };
}
cc_end(0x182afe9f);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetstable-view.h"
#include "c8/c8-log.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/draw-figure.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "c8/time/now.h"

namespace c8 {

static constexpr const char *SHOW_LOCAL_MATCHES = "Show local matches";
static constexpr const char *SHOW_GLOBAL_MATCHES = "Show global matches";
static constexpr const char *SHOW_ORB_FEATURE_IN_TARGET = "Show ORB features in target";
static constexpr const char *SHOW_GORB_FEATURE_IN_TARGET = "Show GORB features in target";
static constexpr const char *SHOW_GRAVITY_3D = "Show gravity direction in 3D space";
static constexpr const char *SHOW_GRAVITY_2D = "Show gravity direction in 2D space";
static constexpr const char *SHOW_FEATURES = "Show feature directions";
static const Color gravityColor = Color::RED;

ImageTargetStableView::ImageTargetStableView() : gr8_(Gr8Gl::create()) {
  copyTexture_ = compileCopyTexture2D();
}

void ImageTargetStableView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  srcName_ = appConfig_.imageTargets->begin()->first;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }

  controlPanelConfig()[SHOW_LOCAL_MATCHES] =
    ControlPanelElement::checkBox(SHOW_LOCAL_MATCHES, false, "Show local matches");
  controlPanelConfig()[SHOW_GLOBAL_MATCHES] =
    ControlPanelElement::checkBox(SHOW_GLOBAL_MATCHES, true, "Show global matches");
  controlPanelConfig()[SHOW_ORB_FEATURE_IN_TARGET] =
    ControlPanelElement::checkBox(SHOW_ORB_FEATURE_IN_TARGET, true, "Show ORB features in target");
  controlPanelConfig()[SHOW_GORB_FEATURE_IN_TARGET] = ControlPanelElement::checkBox(
    SHOW_GORB_FEATURE_IN_TARGET, true, "Show GORB features in target");
  controlPanelConfig()[SHOW_GRAVITY_3D] =
    ControlPanelElement::checkBox(SHOW_GRAVITY_3D, true, "Show gravity direction in 3D space");
  controlPanelConfig()[SHOW_GRAVITY_2D] =
    ControlPanelElement::checkBox(SHOW_GRAVITY_2D, true, "Show gravity direction in 2D space");
  controlPanelConfig()[SHOW_FEATURES] =
    ControlPanelElement::checkBox(SHOW_FEATURES, true, "Show feature directions");
}

void ImageTargetStableView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  // The canvas will be split into two parts: the image target on the left (tl) and the camera view
  // (br) on the right.
  dataPtr =
    ViewDataGen::cameraFeaturesCanvas(appConfig_, 480 * 2, 640 * 2, glShader_.get(), &copyTexture_);
}

void ImageTargetStableView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  auto cp = data->producer<CameraPreviewDataProducer>().cameraPreview();
  auto dp = data->renderer<PixelBufferTextureRenderer>().displayBuf();

  fill(0, 0, 0, 255, &dp);
  auto br = crop(dp, cp.rows(), cp.cols(), dp.rows() - cp.rows(), dp.cols() - cp.cols());
  auto tl = crop(dp, cp.rows(), cp.cols(), 0, 0);

  copyPixels(cp, &br);
  fill(Color::BLACK, tl);

  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    return;
  }

  auto l0 = featureProducer.pyramid().levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);

  auto feats = getFeatures(intrinsics, featureProducer.pyramid(), &gr8_);
  auto roiFeats = getFeaturesRoi(intrinsics, featureProducer.pyramid(), &gr8_);

  // Run tracker
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

  // Get high-resolution features from the ROI features.
  auto hiresFeats = feats.clone();
  for (const auto &f : roiFeats) {
    if (f.roi().source == ImageRoi::Source::HIRES_SCAN) {
      hiresFeats.addAll(f);
    }
  }

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

  auto &im = appConfig_.imageTargets->at(srcName_);

  // Draw the detected image with the features.
  copyPixels(im.previewPix(), &tl);

  if (controlPanelConfig()[SHOW_ORB_FEATURE_IN_TARGET].val<bool>()) {
    // Draw the ORB features in the target view.
    drawFeatures(im.framePoints(), tl, false, im.rotateFeatures(), im.previewPix().cols());
  }
  if (controlPanelConfig()[SHOW_GORB_FEATURE_IN_TARGET].val<bool>()) {
    // Draw the GORB features in the target view.
    drawFeatures(im.framePoints(), tl, true, im.rotateFeatures(), im.previewPix().cols());
  }

  Vector<HPoint2> targetPixels = im.framePoints().pixels();
  Vector<HPoint2> imagePixels = hiresFeats.pixels();

  // Draw the global matches.
  if (controlPanelConfig()[SHOW_GLOBAL_MATCHES].val<bool>()) {
    auto globalMatches = tracker_.imTracker().globalMatches(srcName_);

    for (int i = 0; i < globalMatches.size(); i++) {
      // Only draw matches that are inliers.
      if (!tracker_.imTracker().globalInliers(srcName_)[i]) {
        continue;
      }

      const auto match = globalMatches[i];
      auto target = targetPixels[match.dictionaryIdx];
      auto image = imagePixels[match.wordsIdx];
      // Color based on goodness of match.
      uint8_t heatMapVal = 255 - static_cast<uint8_t>(match.descriptorDist);
      if (im.rotateFeatures()) {
        drawLine(
          {im.previewPix().cols() - 1 - target.y(), target.x()},
          {image.x() + tl.cols(), image.y() + tl.rows()},
          1,
          heatMap(heatMapVal),
          dp);
      } else {
        drawLine(
          target, {image.x() + tl.cols(), image.y() + tl.rows()}, 1, heatMap(heatMapVal), dp);
      }
    }
  }
  auto newFrameMicros = nowMicros();

  if (selected) {
    drawDetectedImage(im.detectionImage(), intrinsics, found.pose, br);
    auto tk = HMatrixGen::intrinsic(im.framePoints().intrinsic());
    if (controlPanelConfig()[SHOW_LOCAL_MATCHES].val<bool>()) {
      auto localMatches = tracker_.imTracker().localMatches(srcName_);
      if (localMatches.size() == tracker_.imTracker().inliers(srcName_).size()) {
        for (int i = 0; i < localMatches.size(); i++) {
          // Only draw matches that are inliers.
          if (!tracker_.imTracker().inliers(srcName_)[i]) {
            continue;
          }

          const auto match = localMatches[i];
          auto target = targetPixels[match.dictionaryIdx];
          auto image = imagePixels[match.wordsIdx];
          uint8_t heatMapVal = 255 - static_cast<uint8_t>(match.descriptorDist);

          if (im.rotateFeatures()) {
            drawLine(
              {im.previewPix().cols() - 1 - target.y(), target.x()},
              {image.x() + tl.cols(), image.y() + tl.rows()},
              1,
              heatMap(heatMapVal),
              dp);
          } else {
            drawLine(
              target, {image.x() + tl.cols(), image.y() + tl.rows()}, 1, heatMap(heatMapVal), dp);
          }
        }
      }
    }

    // Draw the features in the camera view.
    for (const auto &f : roiFeats) {
      if (f.roi().name != srcName_) {
        continue;
      }
      if (controlPanelConfig()[SHOW_GRAVITY_3D].val<bool>()) {
        drawFeatureGravityDirections(found.pose, tk, f, 0.1f, gravityColor, br);
      }

      if (controlPanelConfig()[SHOW_GRAVITY_2D].val<bool>()) {
        drawFeatures(f, br, true);
      }

      if (controlPanelConfig()[SHOW_FEATURES].val<bool>()) {
        drawFeatures(f, br, false);
      }
    }

    // Draw pose stability time series.
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
    }
    if (!timeSeries_.empty()) {
      SeriesPlot &posePlot = data->mutableSeriesPlot("PoseTimeSeries");
      posePlot.title = "Pose/Rotation Time Series";
      posePlot.xAxis.name = "Time (us)";
      posePlot.yAxis.name = "Value";
      Vector<float> xs(timeSeries_.begin(), timeSeries_.end());
      addLine(posePlot, "x", xs, Vector<float>(xSeries_.begin(), xSeries_.end()), Color::RED);
      addLine(posePlot, "y", xs, Vector<float>(ySeries_.begin(), ySeries_.end()), Color::GREEN);
      addLine(posePlot, "z", xs, Vector<float>(zSeries_.begin(), zSeries_.end()), Color::BLUE);
      addLine(posePlot, "qw", xs, Vector<float>(qwSeries_.begin(), qwSeries_.end()), Color::YELLOW);
      addLine(posePlot, "qx", xs, Vector<float>(qxSeries_.begin(), qxSeries_.end()), Color::CHERRY);
      addLine(posePlot, "qy", xs, Vector<float>(qySeries_.begin(), qySeries_.end()), Color::MANGO);
      addLine(posePlot, "qz", xs, Vector<float>(qzSeries_.begin(), qzSeries_.end()), Color::MINT);
    }
  }

  // record stability of tracking
  frameCount_++;
  if (startFrame_ == -1) {
    startFrame_ = frameCount_;
  }
  int delta = 1;  // Each call is one frame
  if (found.isUsable()) {
    foundCumulativeFrames_ += delta;
    if (firstFoundFrame_ == -1) {
      firstFoundFrame_ = frameCount_;
    }
  } else {
    notFoundCumulativeFrames_ += delta;
  }
  Table foundTable;
  foundTable.columns = {"State", "Cumulative Frames"};
  foundTable.dataPerRow["Tracking"] = {"Tracking", toString(foundCumulativeFrames_)};
  foundTable.dataPerRow["LostTracking"] = {"LostTracking", toString(notFoundCumulativeFrames_)};

  // record frame to first found
  int framesToFirstFound =
    (firstFoundFrame_ != -1 && startFrame_ != -1) ? (firstFoundFrame_ - startFrame_) : -1;
  foundTable.dataPerRow["TimeToFirstFound"] = {
    "Frames to First Found", framesToFirstFound < 0 ? "N/A" : toString(framesToFirstFound)};

  // Add global inlier percentage (per-frame)
  {
    auto globalMatches = tracker_.imTracker().globalMatches(srcName_);
    auto globalInliers = tracker_.imTracker().globalInliers(srcName_);
    int inlierCount = 0;
    if (!globalMatches.empty() && globalInliers.size() == globalMatches.size()) {
      inlierCount =
        std::count_if(globalInliers.begin(), globalInliers.end(), [](auto v) { return v; });
      // Update cumulative counters
      globalInlierCumulative_ += inlierCount;
      globalMatchCumulative_ += globalInliers.size();
    }
    float cumInlierPct = 0.f;
    if (globalMatchCumulative_ > 0) {
      cumInlierPct = 100.f * float(globalInlierCumulative_) / float(globalMatchCumulative_);
    }
    foundTable.dataPerRow["CumulativeGlobalInlierPct"] = {
      "Cumulative Global Inlier %", toString(cumInlierPct)};
  }
  // Ensure the table is set after all rows are added
  data->setTable("Tracking State Time", foundTable);
}
}  // namespace c8
