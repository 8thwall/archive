// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/pixels:pixels",
    "//reality/app/remote:remote-reality-postprocessor",
    "//c8/protolog:xr-requests",
  };
}
cc_end(0x1a5694b9);

#include <chrono>
#include <iostream>
#include <thread>
#include "c8/c8-log.h"
#include "c8/pixels/pixels.h"
#include "c8/protolog/remote-service-connection.h"
#include "c8/protolog/remote-service-discovery.h"
#include "c8/protolog/xr-requests.h"
#include "reality/app/remote/remote-reality-postprocessor.h"

using namespace c8;

constexpr int SEND_FPS = 15.0f;
constexpr int CHECK_SERVERS_FPS = 60.0f;

static uint8_t pixelData[] = {
  48,  30,  10,  11,  23,   // Row 0
  231, 255, 247, 255, 255,  // Row 1
  252, 249, 244, 232, 69,   // Row 2
  179, 169, 174, 0,   17,   // Row 3
  36,  72,  69,  31,  43    // Row 4
};

void sendMessage(RemoteRealityPostprocessor &proc) {
  MutableRootMessage<RealityRequest> m;
  auto b = m.builder();

  YPlanePixels srcY(4, 3, 5, pixelData);
  UVPlanePixels srcUV(0, 0, 0, nullptr);

  auto cameraBuilder = b.getSensors().getCamera();
  setCameraPixelPointers(srcY, srcUV, &cameraBuilder);

  ConstRootMessage<RealityResponse> r;
  proc.update(m.reader(), r.reader());
}

int main(int argc, char *argv[]) {
  RemoteRealityPostprocessor proc;
  proc.resumeBrowsingForServers();
  auto sendThread = std::thread([&proc]() {
    C8Log("[auto-stream-main] %s", "rpc thread running");
    while (true) {
      sendMessage(proc);
      std::this_thread::sleep_for(
        std::chrono::duration<int, std::ratio<1, static_cast<int>(SEND_FPS)>>(1));
    }
  });  // end std::thread

  std::string server = "<select server>";

  while (true) {
    auto servers = proc.remoteConnection().reader().getAvailableServers();
    std::string backServer =
      servers.size() > 0 ? servers[servers.size() - 1].getDisplayName() : "<select server>";
    if (server != backServer) {
      server = backServer;
      MutableRootMessage<XrServer> xrserver;
      xrserver.builder().setDisplayName(server);
      xrserver.builder().setResolveStrategy(XrServer::ResolveStrategy::MDNS);
      ConstRootMessage<XrServer> constserver(xrserver);
      proc.resumeConnectionToServer(constserver);
    }
    std::this_thread::sleep_for(
      std::chrono::duration<int, std::ratio<1, static_cast<int>(CHECK_SERVERS_FPS)>>(1));
  }

  return 0;
}
