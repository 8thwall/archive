// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":vert",
    "//c8/geometry:egomotion",
    "@com_google_googletest//:gtest_main",
  };
}
cc_end(0xc57004bd);

#include <gmock/gmock.h>
#include <gtest/gtest.h>

#include "c8/geometry/egomotion.h"
#include "reality/quality/splat/vert.h"

using testing::Eq;
using testing::Pointwise;

namespace c8 {

class VertTest : public ::testing::Test {};

MATCHER_P(AreWithin, eps, "") { return fabs(testing::get<0>(arg) - testing::get<1>(arg)) < eps; }

decltype(auto) equalsPoint(const HPoint3 &point) {
  return Pointwise(AreWithin(0.0001), point.data());
}

const auto AXIS_R = HPoint3{1.0f, 0.0f, 0.0f};
const auto AXIS_U = HPoint3{0.0f, 1.0f, 0.0f};
const auto AXIS_L = HPoint3{-1.0f, 0.0f, 0.0f};
const auto AXIS_D = HPoint3{0.0f, -1.0f, 0.0f};
const auto RT_2 = std::sqrt(2.0f);
const auto HRT_2 = 0.5f * RT_2;

// Tests a circular splat. A point at (1, 0, 0) should go to (1, 0, d), and a point at (0, 1, 0)
// should go to (0, 1, d), where d is the distance from the camera to the splat.
TEST_F(VertTest, TestCircular) {
  auto camPos = HPoint3{0.0f, 0.0f, -3.0f};
  auto camRot = Quaternion::fromPitchYawRollDegrees(0, 0, 0);
  auto splatPos = HPoint3{0.0f, 0.0f, 0.0f};
  auto splatRot = Quaternion::fromPitchYawRollDegrees(0, 0, 0);
  auto splatScale = HVector3{1.0f, 1.0f, 1.0f};

  auto st = splatTransform(cameraMotion(camPos, camRot), splatPos, splatRot, splatScale);

  EXPECT_THAT((st * AXIS_R).data(), equalsPoint(HPoint3{1.0f, 0.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_U).data(), equalsPoint(HPoint3{0.0f, 1.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_L).data(), equalsPoint(HPoint3{-1.0f, 0.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_D).data(), equalsPoint(HPoint3{0.0f, -1.0f, 3.0f}));
}

// Tests a circular splat with standard deviation=2. The scale of the splat quad should be 2.
TEST_F(VertTest, TestCircularScale) {
  auto camPos = HPoint3{0.0f, 0.0f, -3.0f};
  auto camRot = Quaternion::fromPitchYawRollDegrees(0, 0, 0);
  auto splatPos = HPoint3{0.0f, 0.0f, 0.0f};
  auto splatRot = Quaternion::fromPitchYawRollDegrees(0, 0, 0);
  auto splatScale = HVector3{2.0f, 2.0f, 2.0f};

  auto st = splatTransform(cameraMotion(camPos, camRot), splatPos, splatRot, splatScale);

  EXPECT_THAT((st * AXIS_R).data(), equalsPoint(HPoint3{2.0f, 0.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_U).data(), equalsPoint(HPoint3{0.0f, 2.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_L).data(), equalsPoint(HPoint3{-2.0f, 0.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_D).data(), equalsPoint(HPoint3{0.0f, -2.0f, 3.0f}));
}

// Tests a circular splat with standard deviation=2. The scale of the splat quad should be 2.
TEST_F(VertTest, TestAxisAlignedOval) {
  auto camPos = HPoint3{0.0f, 0.0f, -3.0f};
  auto camRot = Quaternion::fromPitchYawRollDegrees(0, 0, 0);
  auto splatPos = HPoint3{0.0f, 0.0f, 0.0f};
  auto splatRot = Quaternion::fromPitchYawRollDegrees(0, 0, 0);
  auto splatScale = HVector3{2.0f, 1.0f, 3.0f};

  auto st = splatTransform(cameraMotion(camPos, camRot), splatPos, splatRot, splatScale);

  EXPECT_THAT((st * AXIS_R).data(), equalsPoint(HPoint3{2.0f, 0.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_U).data(), equalsPoint(HPoint3{0.0f, 1.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_L).data(), equalsPoint(HPoint3{-2.0f, 0.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_D).data(), equalsPoint(HPoint3{0.0f, -1.0f, 3.0f}));
}

// Tests a 2x1x3 oval rotated so that it is 3x2x1.
TEST_F(VertTest, TestOutOfPlaneRotationOval213) {
  auto camPos = HPoint3{0.0f, 0.0f, -3.0f};
  auto camRot = Quaternion::fromPitchYawRollDegrees(0, 0, 0);
  auto splatPos = HPoint3{0.0f, 0.0f, 0.0f};
  auto splatRot = Quaternion::fromPitchYawRollDegrees(0, 90, 90);
  auto splatScale = HVector3{2.0f, 1.0f, 3.0f};

  auto st = splatTransform(cameraMotion(camPos, camRot), splatPos, splatRot, splatScale);

  EXPECT_THAT((st * AXIS_R).data(), equalsPoint(HPoint3{3.0f, 0.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_U).data(), equalsPoint(HPoint3{0.0f, 2.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_L).data(), equalsPoint(HPoint3{-3.0f, 0.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_D).data(), equalsPoint(HPoint3{0.0f, -2.0f, 3.0f}));
}

// Tests a 1x2x3 oval rotated so that it is 2x3x1.
TEST_F(VertTest, TestOutOfPlaneRotationOval123) {
  auto camPos = HPoint3{0.0f, 0.0f, -3.0f};
  auto camRot = Quaternion::fromPitchYawRollDegrees(0, 0, 0);
  auto splatPos = HPoint3{0.0f, 0.0f, 0.0f};
  auto splatRot = Quaternion::fromPitchYawRollDegrees(90, 0, 90);
  auto splatScale = HVector3{1.0f, 2.0f, 3.0f};

  auto st = splatTransform(cameraMotion(camPos, camRot), splatPos, splatRot, splatScale);

  EXPECT_THAT((st * AXIS_R).data(), equalsPoint(HPoint3{0.0f, 3.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_U).data(), equalsPoint(HPoint3{-2.0f, 0.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_L).data(), equalsPoint(HPoint3{0.0f, -3.0f, 3.0f}));
  EXPECT_THAT((st * AXIS_D).data(), equalsPoint(HPoint3{2.0f, 0.0f, 3.0f}));
}

// Tests a 2x1x3 oval rotated 45 degrees in plane.
TEST_F(VertTest, TestInPlaneRotationOval) {
  auto camPos = HPoint3{0.0f, 0.0f, -3.0f};
  auto camRot = Quaternion::fromPitchYawRollDegrees(0, 0, 0);
  auto splatPos = HPoint3{0.0f, 0.0f, 0.0f};
  auto splatRot = Quaternion::fromPitchYawRollDegrees(0, 0, 45);
  auto splatScale = HVector3{2.0f, 1.0f, 3.0f};

  auto st = splatTransform(cameraMotion(camPos, camRot), splatPos, splatRot, splatScale);

  EXPECT_THAT((st * AXIS_R).data(), equalsPoint(HPoint3{RT_2, RT_2, 3.0f}));
  EXPECT_THAT((st * AXIS_U).data(), equalsPoint(HPoint3{-HRT_2, HRT_2, 3.0f}));
  EXPECT_THAT((st * AXIS_L).data(), equalsPoint(HPoint3{-RT_2, -RT_2, 3.0f}));
  EXPECT_THAT((st * AXIS_D).data(), equalsPoint(HPoint3{HRT_2, -HRT_2, 3.0f}));
}

}  // namespace c8
