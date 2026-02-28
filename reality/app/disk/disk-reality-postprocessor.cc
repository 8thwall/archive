// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "disk-reality-postprocessor.h",
  };
  deps = {
    "//bzl/inliner:rules",
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8:string",
    "//c8:vector",
    "//reality/app/xr/common:camera-framework",
    "//reality/engine/api:reality.capnp-cc",
    "//reality/engine/logging:remote-disk-recorder",
  };
}

#include "reality/app/disk/disk-reality-postprocessor.h"

#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"

using MutableRemoteServiceResponse = c8::MutableRootMessage<c8::RemoteServiceResponse>;
using ConstCompressedImageData = c8::ConstRootMessage<c8::CompressedImageData>;
using ConstRealityResponse = c8::ConstRootMessage<c8::RealityResponse>;
using ConstXrRemoteApp = c8::ConstRootMessage<c8::XrRemoteApp>;
using ConstXrServerList = c8::ConstRootMessage<c8::XrServerList>;

namespace c8 {

void DiskRealityPostprocessor::pause() { remoteDiskRecorder_.stop(); }

void DiskRealityPostprocessor::resume() {}

RealityResponse::Reader DiskRealityPostprocessor::update(
  RealityRequest::Reader request, RealityResponse::Reader response) {

  {
    std::lock_guard<std::mutex> lock(remoteLock_);
    remote_ = ConstXrRemoteApp();
    remoteDiskRecorder_.stream(request, response, remote_.reader());
  }

  return ConstRootMessage<RealityResponse>().reader();
}

bool DiskRealityPostprocessor::isLogging() { return remoteDiskRecorder_.isLogging(); }

void DiskRealityPostprocessor::logToDisk(int numFrames, int fd) {
  remoteDiskRecorder_.logToDisk(numFrames, fd);
}

}  // namespace c8
