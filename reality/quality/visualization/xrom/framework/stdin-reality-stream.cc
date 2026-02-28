// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "stdin-reality-stream.h",
  };
  deps = {
    ":reality-stream-interface",
    "//bzl/inliner:rules",
    "//c8:c8-log-proto",
    "//reality/app/xr/capnp:xr-capnp",
    "//reality/quality/visualization/protolog:log-record-capture",
  };
}

#include "reality/quality/visualization/xrom/framework/stdin-reality-stream.h"

#include "c8/c8-log-proto.h"

using namespace c8;

void StdinRealityStream::setCallback(RealityStreamCallback *callback) { callback_ = callback; }

void StdinRealityStream::spin() {
  while (cap_->read(&sensors_) && !stopped_) {
    auto request = sensors_.requestMessage->reader();
    if (!request.getSensors().getCamera().getCurrentFrame().hasImage()) {
      C8Log("%s", "Skipping frame with no image data.");
      continue;
    }

    XRCapnpReality reality;
    {
      ScopeTimer("stdin-reality-stream");
      engine_->pushRealityForward(sensors_, &reality);
    }

    if (callback_ != nullptr) {
      callback_->processReality(this, engine_->lastRequest(), reality.xrResponse.reader());
    }
  }
}

void StdinRealityStream::stop() { stopped_ = true; }

ConstRootMessage<XrQueryResponse> *StdinRealityStream::query(XrQueryRequest::Reader request) {
  return engine_->query(request);
}

// Default constructor.
StdinRealityStream::StdinRealityStream() {
  cap_.reset(LogRecordCapture::create(""));

  XRCapnpConfiguration xrconfig;
  xrconfig.xrConfig.builder().getMask().setCamera(true);
  xrconfig.xrConfig.builder().getMask().setLighting(true);
  xrconfig.xrConfig.builder().getMask().setSurfaces(true);
  xrconfig.xrConfig.builder().getMask().setVerticalSurfaces(true);
  xrconfig.disableExperimental = true;
  engine_.reset(new XRCapnp(std::move(xrconfig)));
}
