// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":algorithms",
    "//c8:hmatrix",
    "//c8/geometry:intrinsics",
    "//c8/geometry:worlds",
    "@com_google_googletest//:gtest_main",
  };
}
cc_end(0xf75dad7c);

#include "c8/opencv/algorithms.h"

#include "c8/hmatrix.h"
#include "gtest/gtest.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/worlds.h"

namespace c8 {

namespace opencv {

class AlgorithmsTest : public ::testing::Test {};

TEST_F(AlgorithmsTest, TestProposeHomography) {
  // Construct a camera and a world with three planes.
  HMatrix K = Intrinsics::logitechQuickCamPro9000();  // Use a realistic camera model.
  Vector<HPoint3> worldPts = c8::Worlds::axisAlignedPolygonsWorld();

  // Image the world from two positions with a baseline offset.
  auto cam1 = HMatrixGen::translation(5.0, 5.0, 19.0) * HMatrixGen::rotationD(12.0, 190.0, -15.0);
  Vector<HPoint2> cam1Points = flatten<2>(K * cam1.inv() * worldPts);

  auto cam2 = HMatrixGen::translation(7.0, 6.0, 16.0) * HMatrixGen::rotationD(23.0, 199.0, -25.0);
  Vector<HPoint2> cam2Points = flatten<2>(K * cam2.inv() * worldPts);

  // Find a homography that explains the first four points.
  TreeSet<size_t> coplanar1{0, 1, 2, 3};
  HMatrix m1 = proposeHomography(cam1Points, cam2Points, coplanar1);
  Vector<HPoint2> projected1 = project2D(m1, cam1Points);

  EXPECT_FLOAT_EQ(projected1[0].x(), cam2Points[0].x());
  EXPECT_FLOAT_EQ(projected1[0].y(), cam2Points[0].y());
  EXPECT_FLOAT_EQ(projected1[1].x(), cam2Points[1].x());
  EXPECT_FLOAT_EQ(projected1[1].y(), cam2Points[1].y());
  EXPECT_FLOAT_EQ(projected1[2].x(), cam2Points[2].x());
  EXPECT_FLOAT_EQ(projected1[2].y(), cam2Points[2].y());
  EXPECT_FLOAT_EQ(projected1[3].x(), cam2Points[3].x());
  EXPECT_FLOAT_EQ(projected1[3].y(), cam2Points[3].y());

  // Find a homography that explains the second five points.
  TreeSet<size_t> coplanar2{4, 5, 6, 7, 8};
  HMatrix m2 = proposeHomography(cam1Points, cam2Points, coplanar2);
  Vector<HPoint2> projected2 = project2D(m2, cam1Points);

  EXPECT_NEAR(projected2[4].x(), cam2Points[4].x(), 1e-4);
  EXPECT_FLOAT_EQ(projected2[4].y(), cam2Points[4].y());
  EXPECT_NEAR(projected2[5].x(), cam2Points[5].x(), 1e-4);
  EXPECT_FLOAT_EQ(projected2[5].y(), cam2Points[5].y());
  EXPECT_FLOAT_EQ(projected2[6].x(), cam2Points[6].x());
  EXPECT_FLOAT_EQ(projected2[6].y(), cam2Points[6].y());
  EXPECT_FLOAT_EQ(projected2[7].x(), cam2Points[7].x());
  EXPECT_FLOAT_EQ(projected2[7].y(), cam2Points[7].y());
  EXPECT_FLOAT_EQ(projected2[8].x(), cam2Points[8].x());
  EXPECT_FLOAT_EQ(projected2[8].y(), cam2Points[8].y());

  // Find a homography that explains the last six points.
  TreeSet<size_t> coplanar3{9, 10, 11, 12, 13, 14};
  HMatrix m3 = proposeHomography(cam1Points, cam2Points, coplanar3);
  Vector<HPoint2> projected3 = project2D(m3, cam1Points);

  EXPECT_FLOAT_EQ(projected3[9].x(), cam2Points[9].x());
  EXPECT_FLOAT_EQ(projected3[9].y(), cam2Points[9].y());
  EXPECT_FLOAT_EQ(projected3[10].x(), cam2Points[10].x());
  EXPECT_FLOAT_EQ(projected3[10].y(), cam2Points[10].y());
  EXPECT_FLOAT_EQ(projected3[11].x(), cam2Points[11].x());
  EXPECT_FLOAT_EQ(projected3[11].y(), cam2Points[11].y());
  EXPECT_FLOAT_EQ(projected3[12].x(), cam2Points[12].x());
  EXPECT_FLOAT_EQ(projected3[12].y(), cam2Points[12].y());
  EXPECT_FLOAT_EQ(projected3[13].x(), cam2Points[13].x());
  EXPECT_FLOAT_EQ(projected3[13].y(), cam2Points[13].y());
  EXPECT_FLOAT_EQ(projected3[14].x(), cam2Points[14].x());
  EXPECT_FLOAT_EQ(projected3[14].y(), cam2Points[14].y());
}

}  // namespace opencv

}  // namespace c8
