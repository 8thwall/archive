// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetrelative-view.h",
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
    "//c8/pixels:camera-controls",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//reality/engine/api/request:precomputed.capnp-cc",
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/geometry:bundle",
    "//reality/engine/geometry:pose-pnp",
    "//reality/engine/geometry:image-warp",
    "//reality/engine/tracking:tracker",
    "//third_party/nrc:quick-select",
  };
}
cc_end(0x4f5203cf);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetrelative-view.h"
#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/camera-controls.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "reality/engine/api/request/precomputed.capnp.h"
#include "reality/engine/geometry/image-warp.h"
#include "reality/engine/geometry/pose-pnp.h"
#include "reality/engine/tracking/tracker.h"
#include "third_party/nrc/quick-select.h"

namespace c8 {

ImageTargetRelativeView::ImageTargetRelativeView() : gr8_(Gr8Gl::create()) {
  copyTexture_ = compileCopyTexture2D();
}

void ImageTargetRelativeView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
  tracker_.reset(new Tracker());
}

void ImageTargetRelativeView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr =
    ViewDataGen::cameraFeaturesCanvas(appConfig_, 480 * 2, 640, glShader_.get(), &copyTexture_);
};

void ImageTargetRelativeView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  // Draw features onto texture.
  auto cpp = data->producer<CameraPreviewDataProducer>().cameraPreview();
  auto dp = data->renderer<PixelBufferTextureRenderer>().displayBuf();
  fill(0, 0, 0, 255, &dp);

  auto cp = crop(dp, cpp.rows(), cpp.cols(), 0, 0);
  auto tr = crop(dp, cpp.rows(), cpp.cols(), 0, cpp.cols());
  copyPixels(cpp, &cp);

  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    return;
  }

  auto targetFeats = featureProducer.pyramid();
  auto l0 = targetFeats.levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);
  auto feats = getFeatures(intrinsics, featureProducer.pyramid(), &gr8_);
  auto roiFeats = getFeaturesRoi(intrinsics, featureProducer.pyramid(), &gr8_);

  // Run tracker
  auto extrinsic = executeTracker(
    tracker_.get(),
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

  Vector<TrackedImage> found;
  for (const auto &l : tracker_->locatedImageTargets()) {
    featureProducer.gl().addNextDrawRoi(l.roi);
    auto res = l.targetSpace;
    if (res.everSeen()) {
      found.push_back(res);
    }
    // drawDetectedImageInWorld(intrinsics, tracker_->imTracker().extrinsic(), l, cp);
    if (res.lastSeen < 3) {
      auto &im = appConfig_.imageTargets->at(res.name).detectionImage();
      drawDetectedImageInWorld(intrinsics, extrinsic, l, im, cp);
    }
  }
  featureProducer.gl().addNextDrawHiResScans(intrinsics, {0.0f, 0.0f});

  lastFound_ = found;
  /*
  ImageTargetsRigidAssembly *ra = tracker_->imTracker().rigidAssembly();
  for (auto res : found) {
    auto &im = appConfig_.imageTargets->at(res.index);

    drawImageFrustum(
      im.framePoints().intrinsic(),
      intrinsics,
      ra->worldPose(),
      ra->worldPose(res.index),
      ra->scale(),
      colors[res.index],
      cp);

    drawDetectedImage(im.detectionImage(), intrinsics, ra->pose(res.index),
      {Color::MINT, colors[res.index], Color::CHERRY}, cp);

    if (res.isUsable()) {
      drawDetectedImage(im.detectionImage(), intrinsics, res.pose, cp);
    }
  }
    */

  drawRelativeView(worldView_, intrinsics, extrinsic, found, tr);
}

void ImageTargetRelativeView::gotTouches(const Vector<Touch> &touches) {
  if (touches.size() == 2) {
    std::lock_guard<std::mutex> lock(touchMtx_);
    C8Log("[view] %s", "Tracker Reset");
    tracker_.reset(new Tracker());
    return;
  }
}

bool ImageTargetRelativeView::handleKey(int key) {
  HMatrix newCam = worldView_;
  if (!updateViewCameraPosition(key, worldView_, &newCam)) {
    return false;
  }
  worldView_ = newCam;
  // C8Log("cameraMotion%s", extrinsicToString(worldView_).c_str());
  drawRelativeView(worldView_, lastIntrinsics_, lastExtrinsic_, lastFound_, lastWorldDisplay_);
  return true;
}

void ImageTargetRelativeView::drawRelativeView(
  const HMatrix &world,
  c8_PixelPinholeCameraModel intrinsics,
  const HMatrix &extrinsic,
  const Vector<TrackedImage> &found,
  RGBA8888PlanePixels cp) {

  // ImageTargetsRigidAssembly *ra = tracker_->imTracker().rigidAssembly();

  lastIntrinsics_ = intrinsics;
  lastExtrinsic_ = extrinsic;
  lastWorldDisplay_ = cp;
  lastFound_ = found;

  auto K = HMatrixGen::intrinsic(intrinsics);
  fill(Color::PURPLE_GRAY, cp);

  // Coordinate origin
  drawAxis(world, K, HPoint3(0.0f, 0.0f, 0.0f), 0.05f, cp);

  {  // TAM Camera Frustum
    auto origin3 = HPoint3(extrinsic(0, 3), extrinsic(1, 3), extrinsic(2, 3));
    auto origin = (K * world.inv() * origin3).flatten();
    auto frustum = flatten<2>(K * world.inv() * extrinsic * cameraFrameCorners(intrinsics, 1.0f));
    for (auto &ic : frustum) {
      if (std::isinf(ic.x()) || std::isinf(ic.y())) {
        continue;
      }
      frustum.push_back(ic);
      frustum.push_back(origin);
    }
    drawShape(frustum, 3, Color::GREEN, cp);
    for (int i = 1; i < 6; ++i) {
      drawPoint(origin, i, Color::RED, cp);
    }
  }
  /*
  { // rigid assembly Camera Frustum
    auto ex = ra->worldPose();
    auto origin3 = HPoint3(ex(0, 3), ex(1, 3), ex(2, 3));
    auto origin = (K * world.inv() * origin3).flatten();
    auto frustum = flatten<2>(K * world.inv() * ex * cameraFrameCorners(intrinsics, 1.0f));
    for (auto &ic : frustum) {
      if (std::isinf(ic.x()) || std::isinf(ic.y())) {
        continue;
      }
      frustum.push_back(ic);
      frustum.push_back(origin);
    }
    drawShape(frustum, 5, Color::MANGO, cp);
    for (int i = 1; i < 10; ++i) {
      drawPoint(origin, i, Color::GREEN, cp);
    }
  }
  */

  for (auto res : found) {
    if (false) {
      auto imPose = res.worldPose;
      auto scale = res.scale;

      // Image Frustum
      auto imOrigin3 = HPoint3(imPose(0, 3), imPose(1, 3), imPose(2, 3));
      auto imOrigin = (K * world.inv() * imOrigin3).flatten();
      auto imCorners = flatten<2>(K * world.inv() * imPose * cameraFrameCorners(intrinsics, scale));
      for (auto &ic : imCorners) {
        if (std::isinf(ic.x()) || std::isinf(ic.y())) {
          continue;
        }
        imCorners.push_back(ic);
        imCorners.push_back(imOrigin);
      }
      drawShape(imCorners, 3, Color::BLACK, cp);
      drawPoints(imCorners, 3, 3, Color::RED, cp);
    }

    /*
    {
      auto scale = ra->scale();
      auto imPose = ra->worldPose(res.index);

      // Image Frustum
      auto imOrigin3 = HPoint3(imPose(0, 3), imPose(1, 3), imPose(2, 3));
      auto imOrigin = (K * world.inv() * imOrigin3).flatten();
      auto imCorners = flatten<2>(K * world.inv() * imPose * cameraFrameCorners(intrinsics, scale));
      for (auto &ic : imCorners) {
        if (std::isinf(ic.x()) || std::isinf(ic.y())) {
          continue;
        }
        imCorners.push_back(ic);
        imCorners.push_back(imOrigin);
      }
      drawShape(imCorners, 5, colors[res.index], cp);
      drawPoints(imCorners, 5, 5, Color::GREEN, cp);

      // Image axis
      drawAxis(imPose.inv() * world, K, HPoint3(0.0f, 0.0f, scale), 0.1f, cp);
    }
    */
  }
}

}  // namespace c8
