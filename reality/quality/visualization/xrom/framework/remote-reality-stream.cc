// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "remote-reality-stream.h",
  };
  deps = {
    ":reality-stream-interface",
    "//bzl/inliner:rules",
    "//c8:c8-log-proto",
    "//reality/app/xr/streaming:xr-streaming",
  };
}

#include "reality/quality/visualization/xrom/framework/remote-reality-stream.h"

#include "c8/c8-log-proto.h"
#include "reality/app/xr/streaming/xr-streaming-decl.h"

#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#else
#include <unistd.h>
#endif

using namespace c8;

void RemoteRealityStream::setCallback(RealityStreamCallback *callback) { callback_ = callback; }

void RemoteRealityStream::spin() {
  // Start receiving updates.
  XRStreaming::getInstance()->resume();

  while (!stopped_) {
    auto *reality = XRStreaming::getInstance()->getCurrentReality();
    if (reality == nullptr) {
      continue;
    }

    // If nothing updated, sleep and try again.
    if (reality->reader().getEventId().getEventTimeMicros() <= lastUpdateMicros_) {
#ifdef _WIN32
      Sleep(1000);
#else
      usleep(1000);  // Sleep for 1ms.
#endif
      continue;
    }
    lastUpdateMicros_ = reality->reader().getEventId().getEventTimeMicros();
    auto *request = XRStreaming::getInstance()->getRequestForCurrentReality();
    if (callback_ != nullptr) {
      callback_->processReality(this, request->reader(), reality->reader());
    }
  }
}

void RemoteRealityStream::stop() { stopped_ = true; }

ConstRootMessage<XrQueryResponse> *RemoteRealityStream::query(XrQueryRequest::Reader request) {
  return XRStreaming::getInstance()->query(request);
}

// Default constructor.
RemoteRealityStream::RemoteRealityStream() {
  XRStreaming::createInstance();

  // Configure it to process sensor data.
  MutableRootMessage<XRConfiguration> config;
  config.builder().getMask().setCamera(true);
  config.builder().getMask().setLighting(true);
  config.builder().getMask().setSurfaces(true);
  config.builder().getMask().setVerticalSurfaces(true);
  config.builder().getMask().setFeatureSet(true);
  XRStreaming::getInstance()->configure(config.reader());
}

RemoteRealityStream::~RemoteRealityStream() { XRStreaming::destroyInstance(); }
