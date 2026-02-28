// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"detection-image-stats.h"};
  deps = {
    "//c8:vector",
  };
}
cc_end(0x6c10abb3);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-stats.h"

namespace c8 {}  // namespace c8
