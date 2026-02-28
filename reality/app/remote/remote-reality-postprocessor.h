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
#include "reality/engine/logging/remote-streamer.h"

namespace c8 {

class RemoteRealityPostprocessor : public RealityPostprocessor {
public:
  // Default constructor.
  RemoteRealityPostprocessor() = default;
  virtual ~RemoteRealityPostprocessor(){};

  // Disallow copying.
  RemoteRealityPostprocessor(RemoteRealityPostprocessor &&) = delete;
  RemoteRealityPostprocessor &operator=(RemoteRealityPostprocessor &&) = delete;
  RemoteRealityPostprocessor(const RemoteRealityPostprocessor &) = delete;
  RemoteRealityPostprocessor &operator=(const RemoteRealityPostprocessor &) = delete;

  void pause() override;
  void resume() override;

  RealityResponse::Reader update(
    RealityRequest::Reader request, RealityResponse::Reader response) override;

  void resumeBrowsingForServers();
  void pauseBrowsingForServers();

  void resumeConnectionToServer(ConstRootMessage<XrServer> &server);
  void pauseConnectionToServer();

  void setWifiInterfaceIndex(int index);

  void sendRemoteApp(ConstRootMessage<XrRemoteApp> &remote);
  ConstRootMessage<RemoteServiceResponse> &remoteResponse();

  ConstRootMessage<XrRemoteConnection> &remoteConnection();

private:
  RemoteStreamer remoteStreamer_;

  // Holders and locks for exported and imported data.
  std::mutex remoteLock_;
  ConstRootMessage<RealityResponse> serverReality_;
  Vector<ConstRootMessage<XrRemoteApp>> remotes_;
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
