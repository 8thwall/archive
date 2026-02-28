// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"
cc_library {
  hdrs = {
    "qr-render-result.h",
  };
  deps = {
    "//c8:hmatrix",
    "//c8/pixels:pixels",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0xb94a7705);

#include "reality/engine/qr/qr-render-result.h"

namespace c8 {}  // namespace c8
