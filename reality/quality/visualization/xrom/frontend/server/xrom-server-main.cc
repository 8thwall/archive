// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_binary {
  deps = {
    ":xrom-server",
    "//bzl/inliner:rules",
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8/io:capnp-messages",
  };
  visibility = {
    "//visibility:private",
  };
}

#include "reality/quality/visualization/xrom/frontend/server/xrom-server.h"

#include <iostream>
#include "c8/c8-log.h"
#include "c8/c8-log-proto.h"
#include "c8/io/capnp-messages.h"
#include "reality/quality/visualization/xrom/api/xrom.capnp.h"

#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#else
#include <unistd.h>
#endif

using namespace c8;

int main(int argc, char *argv[]) {
  // Create a new reality engine.
  c8XromServer_create();

  for (int count = 0; count < 5000;) {
    // Get the latest update.
    c8_NativeByteArray updateBytes{nullptr, 0};
    c8XromServer_getUpdates(&updateBytes);
    if (updateBytes.bytes == nullptr) {
      continue;
    }

    // If nothing updated, sleep and try again.
    ConstRootMessage<UpdateXromRequest> updates(updateBytes.bytes, updateBytes.size);
    if (updates.reader().getUpdates().size() <= 0) {
#ifdef _WIN32
      Sleep(1000);
#else
      usleep(1000);  // Sleep for 1ms.
#endif
      continue;
    }

    C8LogCapnpMessage(updates.reader());
    count++;
  }

  c8XromServer_destroy();
  return 0;
}
