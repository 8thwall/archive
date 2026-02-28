// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Nathan Waters (nathan@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    "@com_google_googletest//:gtest_main",
    ":measured-pose-eval",
  };
}
cc_end(0xd39bd53f);

#include "gmock/gmock.h"
#include "gtest/gtest.h"
#include "reality/quality/datasets/measuredpose/measured-pose-eval.h"

using testing::Eq;
using testing::Pointwise;

namespace c8 {

class MeasuredPoseEvalTest : public ::testing::Test {};

TEST_F(MeasuredPoseEvalTest, noCrash) { EvalFrame evalFrame; }

}  // namespace c8
