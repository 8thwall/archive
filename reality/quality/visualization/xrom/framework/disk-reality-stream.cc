// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "disk-reality-stream.h",
  };
  deps = {
    ":reality-stream-interface",
    "//bzl/inliner:rules",
    "//c8:c8-log-proto",
    "//c8:string",
    "//reality/app/xr/capnp:xr-capnp",
    "//reality/quality/visualization/protolog:log-record-capture",
  };
}

#include "c8/c8-log-proto.h"
#include "reality/quality/visualization/xrom/framework/disk-reality-stream.h"

using namespace c8;

void DiskRealityStream::setCallback(RealityStreamCallback *callback) { callback_ = callback; }

void DiskRealityStream::spin() {
  while (cap_->read(&sensors_, &reality_) && !stopped_) {
    auto request = sensors_.requestMessage->reader();
    if (
      !request.getSensors().getCamera().getCurrentFrame().hasImage()
      || !request.getSensors().getCamera().getCurrentFrame().getTimestampNanos()) {
      // Sometimes early frames come in with black frames and no timestamps because the pipeline is
      // still being primed. These have no image data.
      C8Log("%s", "Skipping frame with no image data.");
      continue;
    }
    if (!useExistingResponse_) {
      ScopeTimer t("disk-reality-stream");
      engine_->pushRealityForward(sensors_, &reality_);
      request = engine_->lastRequest();
    }

    if (callback_ != nullptr) {
      callback_->processReality(this, request, reality_.xrResponse.reader());
    }
  }
}

void DiskRealityStream::stop() { stopped_ = true; }

ConstRootMessage<XrQueryResponse> *DiskRealityStream::query(XrQueryRequest::Reader request) {
  return engine_->query(request);
}

void DiskRealityStream::setUseExistingResponse(bool useExistingResponse) {
  useExistingResponse_ = useExistingResponse;
}

// Default constructor.
DiskRealityStream::DiskRealityStream(const String &filename) {
  cap_.reset(LogRecordCapture::create(filename.c_str()));

  XRCapnpConfiguration xrconfig;
  xrconfig.xrConfig.builder().getMask().setCamera(true);
  xrconfig.xrConfig.builder().getMask().setLighting(true);
  xrconfig.xrConfig.builder().getMask().setSurfaces(true);
  xrconfig.xrConfig.builder().getMask().setVerticalSurfaces(true);
  xrconfig.xrConfig.builder().getMask().setFeatureSet(true);
  xrconfig.disableExperimental = true;
  engine_.reset(new XRCapnp(std::move(xrconfig)));
}
