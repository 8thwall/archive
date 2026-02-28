// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "remote-reality-postprocessor.h",
  };
  deps = {
    "//bzl/inliner:rules",
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8:string",
    "//c8:vector",
    "//reality/app/xr/common:camera-framework",
    "//reality/engine/api:reality.capnp-cc",
    "//reality/engine/logging:remote-streamer",
  };
}

#include "reality/app/remote/remote-reality-postprocessor.h"

#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"

namespace c8 {

void RemoteRealityPostprocessor::pause() { remoteStreamer_.pause(); }

void RemoteRealityPostprocessor::resume() { remoteStreamer_.resume(); }

RealityResponse::Reader RemoteRealityPostprocessor::update(
  RealityRequest::Reader request, RealityResponse::Reader response) {

  {
    std::lock_guard<std::mutex> lock(remoteLock_);

    // Create a union XrRemoteApp that includes all the data since the last send.
    MutableRootMessage<XrRemoteApp> remote;
    int totalTouches = 0;
    for (auto &r : remotes_) {
      totalTouches += r.reader().getTouches().size();
    }
    remote.builder().initTouches(totalTouches);
    int idx = 0;
    for (auto &r : remotes_) {
      for (auto t : r.reader().getTouches()) {
        remote.builder().getTouches().setWithCaveats(idx, t);
        ++idx;
      }
    }

    // Copy device info as well.
    if (!remotes_.empty()) {
      auto lastR = remotes_.back().reader();
      remote.builder().setDevice(lastR.getDevice());
    }

    // Queue data for send.
    remoteStreamer_.stream(request, response, remote.reader());

    // reset remote data after streaming.
    remotes_.clear();
  }

  serverReality_ = ConstRootMessage<RealityResponse>(remoteStreamer_.remoteResponse().reader().getRecord().getRealityResponse());

  return serverReality_.reader();
}

void RemoteRealityPostprocessor::sendRemoteApp(ConstRootMessage<XrRemoteApp> &remote) {
  // TODO(nb): aggregate touches across requests.
  std::lock_guard<std::mutex> lock(remoteLock_);
  remotes_.emplace_back(remote.bytes().begin(), remote.bytes().size());
}

void RemoteRealityPostprocessor::resumeBrowsingForServers() {
  remoteStreamer_.resumeBrowsingForServers();
}

void RemoteRealityPostprocessor::pauseBrowsingForServers() {
  remoteStreamer_.pauseBrowsingForServers();
}

void RemoteRealityPostprocessor::resumeConnectionToServer(ConstRootMessage<XrServer> &server) {
  remoteStreamer_.resumeConnectionToServer(server);
}

void RemoteRealityPostprocessor::pauseConnectionToServer() {
  remoteStreamer_.pauseConnectionToServer();
}

void RemoteRealityPostprocessor::setWifiInterfaceIndex(int index) {
  remoteStreamer_.setWifiInterfaceIndex(index);
}

ConstRootMessage<XrRemoteConnection> &RemoteRealityPostprocessor::remoteConnection() {
  return remoteStreamer_.remoteConnection();
}

ConstRootMessage<RemoteServiceResponse> &RemoteRealityPostprocessor::remoteResponse() {
  return remoteStreamer_.remoteResponse();
}

}  // namespace c8
