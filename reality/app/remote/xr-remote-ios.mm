// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "reality/app/xr/ios/xr-ios.h"

#import <AVFoundation/AVFoundation.h>
#import <CoreImage/CoreImage.h>
#import <CoreVideo/CoreVideo.h>
#import <Metal/Metal.h>
#import <OpenGLES/ES3/gl.h>
#import <OpenGLES/ES3/glext.h>
#import <UIKit/UIKit.h>
#import <mutex>
#import <vector>

#include <arpa/inet.h>
#include <ifaddrs.h>

#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "c8/io/capnp-messages.h"
#include "c8/protolog/xr-extern.h"
#include "c8/protolog/xr-requests.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/app/analytics/ios/xr-analytics-log-header-factory.h"
#include "reality/app/analytics/ios/xr-analytics-upload-controller.h"
#include "reality/app/app/ios-app.h"
#include "reality/app/device/ios-device-info.h"
#include "reality/app/remote/remote-reality-postprocessor.h"
#include "reality/app/validation/ios/xr-validation-controller.h"
#include "reality/app/xr/common/camera-framework.h"
#include "reality/app/xr/ios/xr-ios-interface.h"
#include "reality/app/xr/ios/xr-ios.h"

using namespace c8;

using MutableXrRemoteApp = c8::MutableRootMessage<c8::XrRemoteApp>;

namespace {

static std::unique_ptr<RemoteRealityPostprocessor> staticProc = nullptr;

static NSFileHandle *fileHandle_ = nullptr;

RemoteRealityPostprocessor *getInstance() {
  if (staticProc != nullptr) {
    return staticProc.get();
  }

  auto *xr = XRIos::getInstance();
  if (xr == nullptr) {
    C8Log("%s", "getInstance missing xr");
    return nullptr;
  }

  auto *proc = dynamic_cast<RemoteRealityPostprocessor *>(xr->getRealityPostprocessor());
  if (proc == nullptr) {
    C8Log("%s", "getInstance missing processor");
    return nullptr;
  }

  return proc;
}

int getWifiInterfaceIndex() {
  struct ifaddrs *ifaddr, *ifa;
  if (getifaddrs(&ifaddr) == -1) {
    return -1;
  }
  int wifiIndex = -1;
  int idx = 0;
  for (ifa = ifaddr; ifa != NULL; ifa = ifa->ifa_next) {
    if (ifa->ifa_addr->sa_family == AF_LINK) {
      // AF_LINK appears to always comes before other families
      idx++;
    }
    if (ifa->ifa_addr->sa_family == AF_INET && strcmp(ifa->ifa_name, "en0") == 0) {
      wifiIndex = idx;
    }
  }
  freeifaddrs(ifaddr);
  return wifiIndex;
}

}  // namespace

#ifdef __cplusplus
extern "C" {
#endif

// Allocate and initialize a new remote singleton.
void c8XRIos_createRemote() {
  C8Log("%s", "c8XRIos_createRemote");
  if (staticProc == nullptr) {
    staticProc.reset(new RemoteRealityPostprocessor());
  }
}

// Decommission and deallocate the remote.
void c8XRIos_destroyRemote() {
  C8Log("%s", "c8XRIos_destroyRemote");
  staticProc.reset();
}

// Attach the remote to the xr controller.
void c8XRIos_enableRemote() {
  C8Log("%s", "c8XRIos_enableRemote");
  auto *xr = XRIos::getInstance();
  if (xr == nullptr) {
    throw new RuntimeError("Must call XRIos::createInstance before enabling remote.");
  }
  xr->setRealityPostprocessor(staticProc.get());
  xr->setFeatureProvider(std::unique_ptr<FeatureProvider>(new RemoteFeatureProvider()));
}

// Send remote app data as an XrRemoteApp message.
void c8XRIos_sendRemoteApp(struct c8_NativeByteArray *remote) {
  auto *instance = getInstance();
  if (instance == nullptr) {
    return;
  }

  ConstRootMessage<XrRemoteApp> r(remote->bytes, remote->size);
  instance->sendRemoteApp(r);
}

// Start looking for new servers.
void c8XRIos_resumeBrowsingForServers() {
  C8Log("%s", "c8XRIos_resumeBrowsingForServers");
  auto *instance = getInstance();
  if (instance == nullptr) {
    return;
  }
  instance->resumeBrowsingForServers();
  instance->setWifiInterfaceIndex(getWifiInterfaceIndex());
}

// Stop looking for new servers.
void c8XRIos_pauseBrowsingForServers() {
  C8Log("%s", "c8XRIos_pauseBrowsingForServers");
  auto *instance = getInstance();
  if (instance == nullptr) {
    return;
  }
  instance->pauseBrowsingForServers();
}

// Select a server to stream remote data to as an XrServer message.
void c8XRIos_resumeConnectionToServer(struct c8_NativeByteArray *server) {
  C8Log("%s", "c8XRIos_resumeConnectionToServer");
  auto *instance = getInstance();
  if (instance == nullptr) {
    return;
  }
  ConstRootMessage<XrServer> r(server->bytes, server->size);
  instance->resumeConnectionToServer(r);
}

// Disconnect from the connected server.
void c8XRIos_pauseConnectionToServer() {
  C8Log("%s", "c8XRIos_pauseConnectionToServer");
  auto *instance = getInstance();
  if (instance == nullptr) {
    return;
  }
  instance->pauseConnectionToServer();
}

// Get an RemoteServiceResponse message.
void c8XRIos_getRemoteResponse(struct c8_NativeByteArray *preview) {
  auto *instance = getInstance();
  if (instance == nullptr) {
    return;
  }

  auto &r = instance->remoteResponse();
  *preview = c8_NativeByteArray{static_cast<const void *>(r.bytes().begin()),
                                static_cast<int>(r.bytes().size())};
}

// Get an XrRemoteConnection message.
void c8XRIos_getRemoteConnection(struct c8_NativeByteArray *bytes) {
  auto *instance = getInstance();
  if (instance == nullptr) {
    return;
  }

  auto &r = instance->remoteConnection();
  *bytes = c8_NativeByteArray{static_cast<const void *>(r.bytes().begin()),
                              static_cast<int>(r.bytes().size())};
}

#ifdef __cplusplus
}  // extern "C"
#endif
