// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  hdrs = {
    "xr-android-dll.h",
  };
  deps = {"//bzl/inliner:rules"};
}

#include "reality/app/xr/android/xr-android-dll.h"

void c8_loadXRDll() {
  // No-op.
}
