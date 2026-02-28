// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetfeatures-view.h",
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
    "//c8/pixels:draw2-widgets",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/time:now",
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/tracking:tracker",
  };
}
cc_end(0x6c77809b);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetfeatures-view.h"
#include "c8/c8-log.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "c8/time/now.h"

namespace c8 {
ImageTargetFeaturesView::ImageTargetFeaturesView() : gr8_(Gr8Gl::create()) {
  copyTexture_ = compileCopyTexture2D();
}

void ImageTargetFeaturesView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void ImageTargetFeaturesView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  dataPtr = ViewDataGen::cameraPreviewFeatures(appConfig_, glShader_.get(), &copyTexture_);
};

void ImageTargetFeaturesView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &cameraProducer = data->producer<CameraPreviewDataProducer>();
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    return;
  }

  auto l0 = featureProducer.pyramid().levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);
  auto feats = getFeatures(intrinsics, featureProducer.pyramid(), &gr8_);
  auto roiFeats = getFeaturesRoi(intrinsics, featureProducer.pyramid(), &gr8_);

  // Draw features onto texture.
  for (const auto &f : roiFeats) {
    drawFeatures(f, cameraProducer.cameraPreview());
  }

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

  for (const auto &found : tracker_.locatedImageTargets()) {
    featureProducer.gl().addNextDrawRoi(found.roi);
  }
  featureProducer.gl().addNextDrawHiResScans(intrinsics, {0.0f, 0.0f});
}

void ImageTargetFeaturesView::gotTouches(const Vector<Touch> &touches) {}

}  // namespace c8
