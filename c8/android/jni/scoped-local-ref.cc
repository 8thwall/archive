// Copyright (c) 2024 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  hdrs = {
    "scoped-local-ref.h",
  };
  target_compatible_with = {
    "@platforms//os:android",
  };
}
cc_end(0x7115e62e);

#include "c8/android/jni/scoped-local-ref.h"

namespace c8 {}  // namespace c8
