// Copyright (c) 2025 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"mock-jni-test.h"};
  deps = {
    "@com_google_googletest//:gtest_main",
  };
  testonly = 1;
  target_compatible_with = {
    "@platforms//os:android",
  };
}
cc_end(0x406ae232);
