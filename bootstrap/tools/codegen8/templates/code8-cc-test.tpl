// Copyright (c) $year 8th Wall, Inc.
// Original Author: $fullName (${unixName}@8thwall.com)

#include "bzl/inliner/rules.h"

cc_test {
  size = "small";
  deps = {
    "//bzl/inliner:rules",
    "@gtest//:gtest_main",
  };
}

#include "$ccHeaderRelative"

#include "gtest/gtest.h"

namespace $ccNamespace {

class ${ccClassName}Test : public ::testing::Test {};

TEST_F(${ccClassName}Test, TestMeSomethingGood) {
  EXPECT_TRUE(true);
}

}  // namespace $ccNamespace
