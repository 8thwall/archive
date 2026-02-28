// Copyright (c) $year 8th Wall, Inc.
// Original Author: $fullName (${unixName}@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  visibility = {
    "//visibility:private",
  };
  deps = {
    "//bzl/inliner:rules",
  };
}

#include "$ccHeaderRelative"

#include "something/else.h"

namespace $ccNamespace {

// definitions

}  // namespace $ccNamespace
