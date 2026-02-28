// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "reality/app/xr/streaming/xr-streaming.h"

#include <iostream>
#include "c8/c8-log.h"
#include "c8/c8-log-proto.h"
#include "c8/io/capnp-messages.h"
#include "c8/protolog/api/remote-request.capnp.h"
#include "reality/engine/api/reality.capnp.h"

#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#else
#include <unistd.h>
#endif

using MutableXRConfiguration = c8::MutableRootMessage<c8::XRConfiguration>;
using ConstRealityResponse = c8::ConstRootMessage<c8::RealityResponse>;
using ConstXRConfiguration = c8::ConstRootMessage<c8::XRConfiguration>;

using namespace c8;

int main(int argc, char *argv[]) {
  // Create a new reality engine.
  c8XRStreaming_create();

  // Configure it to process sensor data.
  MutableXRConfiguration config;
  auto mask = config.builder().getMask();
  mask.setLighting(true);
  mask.setSurfaces(true);
  mask.setVerticalSurfaces(true);
  ConstXRConfiguration sConfig(config);
  c8_NativeByteArray configBytes{static_cast<const void *>(sConfig.bytes().begin()),
                                 static_cast<int>(sConfig.bytes().size())};
  c8XRStreaming_configureXR(&configBytes);

  // Start receiving updates.
  c8XRStreaming_resume();

  int64_t lastUpdateMicros = 0L;
  for (int count = 0; count < 5000;) {
    // Get the latest update.
    c8_NativeByteArray realityBytes{nullptr, 0};
    c8XRStreaming_getCurrentRealityXR(&realityBytes);
    if (realityBytes.bytes == nullptr) {
      continue;
    }

    // If nothing updated, sleep and try again.
    ConstRealityResponse reality(realityBytes.bytes, realityBytes.size);
    if (reality.reader().getEventId().getEventTimeMicros() <= lastUpdateMicros) {
#ifdef _WIN32
      Sleep(1000);
#else
      usleep(1000);  // Sleep for 1ms.
#endif
      continue;
    }

    C8Log("Count %d with %d bytes", count, realityBytes.size);
    c8_NativeByteArray remoteBytes;
    c8XRStreaming_getXRRemote(&remoteBytes);
    ConstRootMessage<XrRemoteApp> remote(remoteBytes.bytes, remoteBytes.size);

    if (remote.reader().getDevice().getScreenWidth() != 0) {
      C8LogCapnpMessage(remote.reader());
    }

    // Move our high water mark, and display what we got.
    lastUpdateMicros = reality.reader().getEventId().getEventTimeMicros();
    C8Log(
      "Camera global exposure val: %f",
      reality.reader().getXRResponse().getLighting().getGlobal().getExposure());
    count++;
  }

  c8XRStreaming_destroy();
  return 0;
}
