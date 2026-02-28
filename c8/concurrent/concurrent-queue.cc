// Copyright (c) 2024 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"concurrent-queue.h"};
  deps = {
    "//c8:vector",
  };
}
cc_end(0xa5965758);

#include "c8/concurrent/concurrent-queue.h"

namespace c8 {
// Implementation in header.
}  // namespace c8
