// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "xrom-client-interface.h",
  };
  deps = {
    "//bzl/inliner:rules",
    "//c8/io:capnp-messages",
    "//reality/quality/visualization/xrom/api:xrom.capnp-cc",
  };
}

#include "reality/quality/visualization/xrom/framework/xrom-client-interface.h"

using namespace c8;
