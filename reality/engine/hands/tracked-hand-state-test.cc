// Copyright (c) 2023 Niantic Labs
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":handmesh-data",
    ":hand-detector-local-mesh",
    ":tracked-hand-state",
    "//c8/geometry:intrinsics",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "@com_google_googletest//:gtest_main",
  };
  data = {
    "//reality/engine/deepnets/testdata:hand-right-up-128",
    "//reality/engine/hands/data:handmeshmodel",
  };
  linkstatic = 1;
}
cc_end(0x26169c9e);

#include <cmath>
#include <cstdio>

#include "c8/geometry/intrinsics.h"
#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/stats/scope-timer.h"
#include "gtest/gtest.h"
#include "reality/engine/hands/hand-detector-local-mesh.h"
#include "reality/engine/hands/handmesh-data.h"
#include "reality/engine/hands/tracked-hand-state.h"

namespace c8 {

static constexpr char IMAGE_128_PATH[] = "reality/engine/deepnets/testdata/hand_right_up_128.jpg";

class HandTrackerTest : public ::testing::Test {};

TEST_F(HandTrackerTest, TestMeshLeftRight) {
  EXPECT_EQ(HANDMESH_R_INDICES.size(), HANDMESH_L_INDICES.size());

  for (size_t i = 0; i < HANDMESH_R_INDICES.size(); ++i) {
    const MeshIndices &r = HANDMESH_R_INDICES[i];
    const MeshIndices &l = HANDMESH_L_INDICES[i];
    EXPECT_EQ(r.a, l.a);
    EXPECT_EQ(r.b, l.c);
    EXPECT_EQ(r.c, l.b);
  }
}

TEST_F(HandTrackerTest, TestMeshTranslationOptimization) {
  ScopeTimer rt("hand-tracker-test-translation");

  // Read in an image. The test image is 128x128 pixels.
  auto im = readImageToRGBA(IMAGE_128_PATH);
  auto pix = im.pixels();
  auto k = Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6);

  // Take the test image with a well centered hand.
  RenderedSubImage img{
    {0, 0, 128, 128},
    pix,
    {
      ImageRoi::Source::HAND,
      0,
      "",
      HMatrixGen::i(),
    }};

  // Load a TFLite interpreter with the tensor flow model.
  setHandMeshModelKeyPointCount(25);
  HandDetectorLocalMesh mesher(readFile(HAND_MESH_MODEL_PATH));

  auto hands = mesher.analyzeHand(img, k);

  constexpr float tx = 0.2f;
  constexpr float ty = 0.6f;
  constexpr float tz = 1.2f;

  // use a subset of vertices from the hand mesh
  const int numKeyPoints = getHandMeshModelKeyPointCount();
  const int indexStep = 30;
  Vector<HPoint3> rayPts;
  Vector<HPoint3> meshJointPts;
  for (int i = 0; i < numKeyPoints; ++i) {
    HPoint3 pt = hands[0].points[indexStep * i];
    meshJointPts.push_back(pt);
    float x = pt.x() + tx;
    float y = pt.y() + ty;
    float z = pt.z() + tz;
    HPoint3 rayP = {x / z, y / z, 1.0f};
    rayPts.push_back(rayP);
  }

  Vector<float> residualOutput;
  HPoint3 tr = computeMeshTranslation(rayPts, meshJointPts, {0.f, 0.f, 0.4f}, &residualOutput);

  EXPECT_FLOAT_EQ(tr.x(), tx);
  EXPECT_FLOAT_EQ(tr.y(), ty);
  EXPECT_FLOAT_EQ(tr.z(), tz);
}

}  // namespace c8
