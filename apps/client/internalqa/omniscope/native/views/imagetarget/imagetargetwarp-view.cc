// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imagetargetwarp-view.h",
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
cc_end(0xb67702cd);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/viewdata.h"
#include "apps/client/internalqa/omniscope/native/views/imagetarget/imagetargetwarp-view.h"
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
class WarpProducer : public GlDataProducer {
public:
  WarpProducer(
    AppConfiguration appConfig,
    TexCopier *copyTexture,
    TexWarper *warpTexture,
    CurvyTexWarper *warpCurvyTexture)
      : appConfig_(appConfig),
        copyTexture_(copyTexture),
        warpTexture_(warpTexture),
        warpCurvyTexture_(warpCurvyTexture) {
    dest_.initialize(
      makeLinearRGBA8888Texture2D(appConfig_.captureWidth, appConfig_.captureHeight),
      GL_FRAMEBUFFER,
      GL_COLOR_ATTACHMENT0);
  }

  void setRoi(const ImageRoi &roi) { roi_ = roi; }

  GlTexture displayTex() { return dest_.tex().tex(); }
  int displayBuffer() { return dest_.id(); }

  void drawGl(FrameData &in) override {
    auto ct =
      wrapRGBA8888Texture(in.cameraTexture, appConfig_.captureWidth, appConfig_.captureHeight);
    HPoint2 searchDims{
      static_cast<float>(appConfig_.captureWidth), static_cast<float>(appConfig_.captureHeight)};

    switch (roi_.source) {
      case ImageRoi::Source::IMAGE_TARGET:
        (*warpTexture_)(roi_.warp, ct, &dest_);
        break;
      case ImageRoi::Source::CURVY_IMAGE_TARGET:
        (*warpCurvyTexture_)(
          roi_.geom, roi_.intrinsics, roi_.globalPose, 0, ROI_ASPECT, searchDims, ct, &dest_);
        break;
      default:
        (*copyTexture_)(ct, &dest_);
        break;
    }
  }

  void readGl() override {}

private:
  GlFramebufferObject dest_;
  AppConfiguration appConfig_;
  TexCopier *copyTexture_;
  TexWarper *warpTexture_;
  CurvyTexWarper *warpCurvyTexture_;
  ImageRoi roi_;
};

ImageTargetWarpView::ImageTargetWarpView() : gr8_(Gr8Gl::create()) {
  copyTexture_ = compileCopyTexture2D();
  warpTexture_ = compileWarpTexture2D();
  warpCurvyTexture_ = compileWarpCurvyTexture2D();
}

void ImageTargetWarpView::configure(const AppConfiguration &appConfig) {
  appConfig_ = appConfig;
  if (glShader_ == nullptr) {
    glShader_.reset(new Gr8FeatureShader());
    glShader_->initialize();
  }
}

void ImageTargetWarpView::initialize(std::unique_ptr<OmniscopeViewData> &dataPtr) {
  auto *viewData = new OmniscopeViewData(appConfig_);
  viewData->addProducer(std::make_unique<FeaturesDataProducer>(appConfig_, glShader_.get()))
    ->addProducer(
      std::make_unique<WarpProducer>(appConfig_, &copyTexture_, &warpTexture_, &warpCurvyTexture_))
    ->setRenderer(
      std::make_unique<RawTextureRenderer>(appConfig_.captureWidth, appConfig_.captureHeight));
  viewData->renderer<RawTextureRenderer>().setDisplayTex(
    viewData->producer<WarpProducer>().displayBuffer(),
    viewData->producer<WarpProducer>().displayTex());

  dataPtr.reset(viewData);
};

void ImageTargetWarpView::processCpu(OmniscopeViewData *data) {
  ScopeTimer t("process-cpu");
  auto &featureProducer = data->producer<FeaturesDataProducer>();

  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    return;
  }

  auto tls = featureProducer.pyramid().levels;
  auto l0 = tls[0];
  /*
  C8Log("[imagetargetwarp-view] l0: %d,%d %dx%d", tls[0].c, tls[0].r, tls[0].w, tls[0].h);
  C8Log("[imagetargetwarp-view] l1: %d,%d %dx%d", tls[1].c, tls[1].r, tls[1].w, tls[1].h);
  C8Log("[imagetargetwarp-view] l2: %d,%d %dx%d", tls[2].c, tls[2].r, tls[2].w, tls[2].h);
  C8Log("[imagetargetwarp-view] l3: %d,%d %dx%d", tls[3].c, tls[3].r, tls[3].w, tls[3].h);
  */
  auto k1 = Intrinsics::getProcessingIntrinsics(appConfig_.deviceModel, l0.w, l0.h);
  auto feats = getFeatures(k1, featureProducer.pyramid(), &gr8_);
  auto roiFeats = getFeaturesRoi(k1, featureProducer.pyramid(), &gr8_);

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

  ImageRoi nextRoi = {};
  auto targets = appConfig_.detectionImages();
  bool selected = false;
  const auto &its = tracker_.locatedImageTargets();
  for (int i = 0; i < its.size(); ++i) {
    const auto &res = its[i];
    featureProducer.gl().addNextDrawRoi(res.roi);
    // Use one that matches srcName_, else the last
    if (res.targetSpace.name == srcName_ || (!selected && i == its.size() - 1)) {
      nextRoi = res.roi;
      srcName_ = res.targetSpace.name;
      selected = true;
    }
  }
  featureProducer.gl().addNextDrawHiResScans(k1, {0.0f, 0.0f});

  data->producer<WarpProducer>().setRoi(nextRoi);
}

void ImageTargetWarpView::gotTouches(const Vector<Touch> &touches) {
  if (appConfig_.imageTargets == nullptr || appConfig_.imageTargets->size() == 0) {
    srcName_ = "";
    return;
  }
  srcName_ = appConfig_.getNextImageTargetName(srcName_);
}
}  // namespace c8
