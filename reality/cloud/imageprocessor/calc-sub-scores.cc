// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Rishi Parikh (rishi@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"calc-sub-scores.h"};
  visibility = {
    "//visibility:public",
  };
  deps = {
    "//c8:hpoint",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
    "//c8:string",
    "//c8:vector",
    "//reality/engine/imagedetection:detection-image",
  };
}
cc_end(0xf3d415f7);

#include "reality/cloud/imageprocessor/calc-sub-scores.h"
