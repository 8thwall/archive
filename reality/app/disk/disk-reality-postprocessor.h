// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// Object that manages state for android native calls.

#pragma once

#include <cstring>
#include <mutex>

#include "c8/io/capnp-messages.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/app/xr/common/camera-framework.h"
#include "reality/engine/api/reality.capnp.h"
#include "reality/engine/logging/remote-disk-recorder.h"

namespace c8 {

class DiskRealityPostprocessor : public RealityPostprocessor {
public:
  // Default constructor.
  DiskRealityPostprocessor() = default;
  virtual ~DiskRealityPostprocessor(){};

  // Disallow copying.
  DiskRealityPostprocessor(DiskRealityPostprocessor &&) = delete;
  DiskRealityPostprocessor &operator=(DiskRealityPostprocessor &&) = delete;
  DiskRealityPostprocessor(const DiskRealityPostprocessor &) = delete;
  DiskRealityPostprocessor &operator=(const DiskRealityPostprocessor &) = delete;

  void pause() override;
  void resume() override;
  RealityResponse::Reader update(
    RealityRequest::Reader request, RealityResponse::Reader response) override;

  bool isLogging();
  void logToDisk(int numFrames) { logToDisk(numFrames, -1); }
  void logToDisk(int numFrames, int fd);
  int framesLogged() const { return remoteDiskRecorder_.framesLogged(); };
  void setEncodeJpg(bool encodeJpg) { remoteDiskRecorder_.setEncodeJpg(encodeJpg); }

private:
  RemoteDiskRecorder remoteDiskRecorder_;
  ConstRootMessage<XrRemoteApp> remote_;

  std::mutex remoteLock_;
};

class RemoteFeatureProvider : public FeatureProvider {
public:
  RemoteFeatureProvider() = default;
  FeatureProvider::FeatureStatus status(const char *name) override {
    if (strncmp(name, "yuvtex", 6) == 0) {
      return FeatureProvider::FeatureStatus::ENABLED;
    }
    return FeatureProvider::FeatureStatus::UNSPECIFIED;
  }
  virtual ~RemoteFeatureProvider() {}
};

}  // namespace c8
