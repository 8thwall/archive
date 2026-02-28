// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":hand-detector-local-mediapipe",
    ":hand-detector-local-mesh",
    "//c8:string",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8/io:model-3d-io",
    "//reality/engine/hands:handmesh-data",
    "@com_google_googletest//:gtest_main",
  };
  data = {
    "//reality/engine/deepnets/testdata:hand-right-up-128",
    "//reality/engine/deepnets/testdata:hand-left-up-224",
    "//reality/engine/hands/data:handmeshmodel",
    "//third_party/mediapipe/models:hand-landmark",
  };
  linkstatic = 1;
}
cc_end(0x2e439ebf);

#include <cmath>
#include <cstdio>
#include <fstream>
#include <iostream>

#include "c8/camera/device-infos.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/io/model-3d-io.h"
#include "c8/stats/scope-timer.h"
#include "c8/string.h"
#include "gtest/gtest.h"
#include "reality/engine/hands/hand-detector-local-mediapipe.h"
#include "reality/engine/hands/hand-detector-local-mesh.h"
#include "reality/engine/hands/handmesh-data.h"

namespace c8 {

class HandDetectorLocalTest : public ::testing::Test {};

static constexpr char IMAGE_128_PATH[] = "reality/engine/deepnets/testdata/hand_right_up_128.jpg";
static constexpr char IMAGE_224_PATH[] = "reality/engine/deepnets/testdata/hand_left_up_224.jpg";

static constexpr char MEDIAPIPE_LANDMARK_MODEL_PATH[] =
  "third_party/mediapipe/models/hand_landmark_lite.tflite";

static constexpr bool WRITE_MODEL = false;
static constexpr char HAND_MESH_OUTPUT_PLY_PATH[] = "/tmp/hand_mesh.ply";
static constexpr char HAND_MESH_R_UV_PLY_PATH[] = "/tmp/hand_mesh_r_uv.ply";

TEST_F(HandDetectorLocalTest, TestAnaylyze) {
  // Read in an image. The test image is 224x224 pixels.
  auto im = readImageToRGBA(IMAGE_224_PATH);
  auto pix = im.pixels();
  auto k = Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6);

  // Take the test image with a well centered hand.

  RenderedSubImage img{
    {0, 0, 224, 224},
    pix,
    {
      ImageRoi::Source::HAND,
      0,
      "",
      HMatrixGen::i(),
    }};

  // Load a TFLite interpreter with the tensor flow model.
  HandDetectorLocal mesher(readFile(MEDIAPIPE_LANDMARK_MODEL_PATH));

  ScopeTimer rt("test");
  auto hands = mesher.analyzeHand(img, k);

  EXPECT_EQ(1, hands.size());
  EXPECT_EQ(21, hands[0].points.size());
}

bool hasSingleEntry(const float *data, int size, int entryToSkip) {
  bool noEntry = true;
  if (data) {
    for (int k = 0; k < size; ++k) {
      if (k == entryToSkip) {
        continue;
      }
      if (data[k] != 0.0f) {
        noEntry = false;
        break;
      }
    }
  }
  return noEntry;
}

TEST_F(HandDetectorLocalTest, TestAnaylyzeMesh) {
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

  const int numKeyPoints = getHandMeshModelKeyPointCount();

  ScopeTimer rt("hand-mesh-test");
  auto hands = mesher.analyzeHand(img, k);

  Vector<HPoint3> &verts = hands[0].points;

  // j_reg
  Eigen::VectorXf jReg[numKeyPoints];
  float *data = const_cast<float *>(HAND_R_MESH_J_REGRESSOR);
  for (int i = 0; i < numKeyPoints; ++i) {
    jReg[i] = Eigen::Map<Eigen::Vector<float, HANDMESH_R_VERTEX_COUNT>>(data);

    if (i == 21) {
      EXPECT_TRUE(hasSingleEntry(data, HANDMESH_R_VERTEX_COUNT, 279));
      EXPECT_FLOAT_EQ(data[279], 1.0f);
    }
    if (i == 22) {
      EXPECT_TRUE(hasSingleEntry(data, HANDMESH_R_VERTEX_COUNT, 92));
      EXPECT_FLOAT_EQ(data[92], 1.0f);
    }
    if (i == 23) {
      EXPECT_TRUE(hasSingleEntry(data, HANDMESH_R_VERTEX_COUNT, 117));
      EXPECT_FLOAT_EQ(data[117], 1.0f);
    }
    if (i == 24) {
      EXPECT_TRUE(hasSingleEntry(data, HANDMESH_R_VERTEX_COUNT, 78));
      EXPECT_FLOAT_EQ(data[78], 1.0f);
    }

    data += HANDMESH_R_VERTEX_COUNT;
  }

  // update vertex column
  std::unique_ptr<float> vertCols[3];
  for (int i = 0; i < 3; ++i) {
    vertCols[i].reset(new float[HANDMESH_R_VERTEX_COUNT]);
  }

  float *xptr = vertCols[0].get();
  float *yptr = vertCols[1].get();
  float *zptr = vertCols[2].get();
  for (int i = 0; i < HANDMESH_R_VERTEX_COUNT; ++i) {
    xptr[i] = verts[i].x();
    yptr[i] = verts[i].y();
    zptr[i] = verts[i].z();
  }

  Eigen::VectorXf cols[3];
  cols[0] = Eigen::Map<Eigen::Vector<float, HANDMESH_R_VERTEX_COUNT>>(vertCols[0].get());
  cols[1] = Eigen::Map<Eigen::Vector<float, HANDMESH_R_VERTEX_COUNT>>(vertCols[1].get());
  cols[2] = Eigen::Map<Eigen::Vector<float, HANDMESH_R_VERTEX_COUNT>>(vertCols[2].get());

  if (WRITE_MODEL) {
    // write vertex only mesh
    Vector<HVector3> normals;
    Vector<HPoint2> uv;
    String fileName(HAND_MESH_OUTPUT_PLY_PATH);
    writeModelToPLY(
      fileName,
      HANDMESH_R_VERTEX_COUNT,
      hands[0].points,
      normals,
      uv,
      HANDMESH_R_FACE_COUNT,
      HANDMESH_R_INDICES);
  }
}

TEST_F(HandDetectorLocalTest, TestMeshUV) {
  // write out UVs as vertices at {u, v, 0.0f} vertices, with 1 triangle
  if (WRITE_MODEL) {
    Vector<HPoint3> vertices;
    for (size_t i = 0; i < HANDMESH_R_UVS.size(); ++i) {
      const HPoint2 &uv = HANDMESH_R_UVS[i];
      vertices.push_back({uv.x(), uv.y(), 0.0f});
    }
    Vector<HVector3> normals;
    Vector<HPoint2> uv;
    String fileName(HAND_MESH_R_UV_PLY_PATH);
    writeModelToPLY(
      fileName,
      vertices.size(),
      vertices,
      normals,
      uv,
      HANDMESH_R_VERT_UV_INDICES.size(),
      HANDMESH_R_VERT_UV_INDICES);
  }
}

}  // namespace c8
