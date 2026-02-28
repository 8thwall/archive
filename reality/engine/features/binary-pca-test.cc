// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":binary-pca",
    ":pca-basis",
    "//c8:float-vector",
    "//c8/io:capnp-messages",
    "@com_google_googletest//:gtest_main",
  };
}
cc_end(0xce611877);

#include "reality/engine/features/binary-pca.h"

#include <random>

#include "c8/float-vector.h"
#include "c8/io/capnp-messages.h"
#include "reality/engine/features/pca-basis.h"

#include <gtest/gtest.h>

namespace c8 {

class BinaryPcaTest : public ::testing::Test {};

TEST_F(BinaryPcaTest, ProjectAndCompare) {
  // Create some random FloatVectors of dimension 512.
  Vector<FloatVector> data;
  const float stddev = 1.0f;
  std::mt19937 rnd(0);
  std::normal_distribution<float> dist{5, stddev};
  auto genRnd = [&rnd, &dist]() { return dist(rnd); };
  for (int i = 0; i < 10; ++i) {
    FloatVector vec(512);
    std::generate(vec.begin(), vec.end(), genRnd);
    data.emplace_back(std::move(vec));
  }

  // Generate a PCA basis.
  float retainVariance = 0.99f;
  PcaBasis pca = pca.generateBasis(data.begin(), data.end(), &retainVariance);
  EXPECT_EQ(9, pca.projectionSize());

  // Binarize and store the basis in a BinaryPcaData message.
  MutableRootMessage<BinaryPcaData> binaryMessage;
  pca.storeBinaryBasis(binaryMessage.builder());

  ConstRootMessage<BinaryPcaData> binaryData(binaryMessage);

  // Create the BinaryPca class wrapping the binarized message.
  BinaryPca bpca(binaryData.bytes().begin(), binaryData.bytes().size());

  FloatVector absError;
  for (int i = 0; i < data.size(); ++i) {
    // Project each vector into the PCA space and whiten.
    FloatVector pProjection = pca.projectAndWhiten(data[i]);
    FloatVector bProjection = bpca.projectAndWhiten(data[i]);

    ASSERT_EQ(pProjection.size(), bProjection.size());

    // L2-Normalize each projection.
    pProjection.l2Normalize();
    bProjection.l2Normalize();

    FloatVector residual = bProjection - pProjection;
    absError.push_back(l1Norm(residual) / residual.size());
  }

  // Expect the mean absolute error of the components of the projected vector
  // is small.
  float mae = mean(absError);
  EXPECT_LT(mae, 0.05f);
}

}  // namespace c8
