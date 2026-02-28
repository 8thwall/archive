// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "camera-framework.h",
  };
  deps = {
    "//bzl/inliner:rules",
    "//reality/engine/api:reality.capnp-cc",
  };
}


#include "reality/app/xr/common/camera-framework.h"

using namespace c8;
