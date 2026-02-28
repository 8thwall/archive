// Copyright (c) $year 8th Wall, Inc.
// Original Author: $fullName (${unixName}@8thwall.com)

#include "bzl/inliner/rules.h"

cc_binary {
  deps = {
    "//bzl/inliner:rules",
  };
}

#include "something/fun.h"

using namespace $ccNamespace;

int main(int argc, char* argv[]) {

  return 0;
}
