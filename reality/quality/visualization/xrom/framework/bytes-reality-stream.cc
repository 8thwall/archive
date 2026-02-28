// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "bytes-reality-stream.h",
  };
  deps = {
    ":reality-stream-interface",
    "//c8:c8-log-proto",
    "//c8:string",
    "//c8/protolog:xr-extern",
    "//reality/app/xr/capnp:xr-capnp",
    "//reality/quality/visualization/protolog:log-bytes-capture",
  };
}
cc_end(0x9d330448);

#include "reality/quality/visualization/xrom/framework/bytes-reality-stream.h"

#include "c8/c8-log-proto.h"

using namespace c8;

void BytesRealityStream::setCallback(RealityStreamCallback *callback) { callback_ = callback; }
RealityStreamCallback* BytesRealityStream::getCallback() { return callback_; }

void BytesRealityStream::spin() {
  while (spinOnce() && !stopped_) {
    // pass
  }
}
bool BytesRealityStream::spinOnce() {
  bool more = cap_->read(&sensors_);
  if (!more && loop_) {
    cap_.reset(LogBytesCapture::create(data_));
    return spinOnce();
  }

  auto request = sensors_.requestMessage->reader();
  if (!request.getSensors().getCamera().getCurrentFrame().hasImage()) {
    C8Log("%s", "Skipping frame with no image data.");
    return more;
  }

  XRCapnpReality reality;
  {
    ScopeTimer t("bytes-reality-stream");
    engine_->pushRealityForward(sensors_, &reality);
  }

  if (callback_ != nullptr) {
    callback_->processReality(this, request, reality.xrResponse.reader());
  }
  return more;
}

void BytesRealityStream::stop() { stopped_ = true; }

ConstRootMessage<XrQueryResponse> *BytesRealityStream::query(XrQueryRequest::Reader request) {
  return engine_->query(request);
}

// Default constructor.
BytesRealityStream::BytesRealityStream(c8_NativeByteArray data) {
  data_ = data;
  cap_.reset(LogBytesCapture::create(data_));

  XRCapnpConfiguration xrconfig;
  xrconfig.xrConfig.builder().getMask().setCamera(true);
  xrconfig.xrConfig.builder().getMask().setLighting(true);
  xrconfig.xrConfig.builder().getMask().setSurfaces(true);
  xrconfig.xrConfig.builder().getMask().setVerticalSurfaces(true);
  xrconfig.xrConfig.builder().getMask().setFeatureSet(true);
  xrconfig.disableExperimental = true;
  engine_.reset(new XRCapnp(std::move(xrconfig)));
}
