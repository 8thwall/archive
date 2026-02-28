// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "reality-stream-interface.h",
  };
  deps = {
    "//bzl/inliner:rules",
    "//c8/io:capnp-messages",
    "//reality/engine/api:reality.capnp-cc",
  };
}

#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

using namespace c8;
