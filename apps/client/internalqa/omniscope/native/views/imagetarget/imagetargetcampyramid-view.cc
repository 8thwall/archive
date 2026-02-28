// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetcampyramid-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-location",
    "//apps/client/internalqa/omniscope/native/lib:detection-image-stats",
    "//apps/client/internalqa/omniscope/native/lib:viewdata",
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
    "//reality/engine/geometry:image-warp",
    "//reality/engine/tracking:tracker",
  };
}
cc_end(0x2c3df369);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetcampyramid-view.h"
#include "c8/c8-log.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "c8/time/now.h"
#include "reality/engine/geometry/image-warp.h"

namespace c8 {

class ChannelHeatmapRenderer : public GlTextureRenderer {
public:
  ChannelHeatmapRenderer(GlTexture src, ChannelHeatmap *channelHeatmap)
      : src_(src), channelHeatmap_(channelHeatmap) {
    dest_.initialize(
      makeLinearRGBA8888Texture2D(src.width(), src.height()), GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0);
  }

  GlTexture displayTex() override { return dest_.tex().tex(); }
  int displayBuffer() override { return dest_.id(); }

  void renderDisplay() override { (*channelHeatmap_)(numClicks_, src_, &dest_); }

  void setClicks(int numClicks) { numClicks_ = numClicks; };

private:
  GlFramebufferObject dest_;
  GlTexture src_;
  ChannelHeatmap *channelHeatmap_;
  int numClicks_ = 0;
};

ImageTargetCamPyramidView::ImageTargetCamPyramidView() : gr8_(Gr8Gl::create()) {
  channelHeatmap_ = compileChannelHeatmap();
}

void ImageTargetCamPyramidView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void ImageTargetCamPyramidView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  auto *viewData = new OmniscopeViewData(appConfig_);
  viewData->addProducer(std::make_unique<FeaturesDataProducer>(appConfig_, glShader_.get()));
  auto &gl = viewData->producer<FeaturesDataProducer>().gl();
  viewData->setRenderer(std::make_unique<ChannelHeatmapRenderer>(gl.dest(), &channelHeatmap_));
  dataPtr.reset(viewData);
};

void ImageTargetCamPyramidView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    return;
  }

  auto l0 = featureProducer.pyramid().levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);
  auto feats = getFeatures(intrinsics, featureProducer.pyramid(), &gr8_);
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

  for (const auto &found : tracker_.locatedImageTargets()) {
    featureProducer.gl().addNextDrawRoi(found.roi);
  }
  featureProducer.gl().addNextDrawHiResScans(intrinsics, {0.0f, 0.0f});

  data->renderer<ChannelHeatmapRenderer>().setClicks(numClicks_);
}

void ImageTargetCamPyramidView::gotTouches(const Vector<Touch> &touches) { ++numClicks_; }

}  // namespace c8
