// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":descriptor-lsh-index",
    ":embedded-agate-dictionaries",
    ":image-descriptor",
    "//c8:vector",
    "//c8/io:capnp-messages",
    "//reality/engine/features/api:descriptors.capnp-cc",
    "@com_google_googletest//:gtest_main",
  };
}
cc_end(0x701fff54);

#include "reality/engine/features/descriptor-lsh-index.h"

#include "c8/io/capnp-messages.h"
#include "reality/engine/features/api/descriptors.capnp.h"
#include "reality/engine/features/embedded-agate-dictionaries.h"

#include <random>

#include <gtest/gtest.h>

namespace c8 {

class DescriptorLshIndexTest : public ::testing::Test {
public:
  DescriptorLshIndexTest() {
    ConstRootMessageView<DescriptorDictionary> datasetMessage(
      embeddedAgateKeyframeDictionary64N0CapnpbinData,
      embeddedAgateKeyframeDictionary64N0CapnpbinSize);
    ConstRootMessageView<DescriptorDictionary> testsetMessage(
      embeddedAgateKeyframeDictionary64N1CapnpbinData,
      embeddedAgateKeyframeDictionary64N1CapnpbinSize);

    dataset_ =
      reinterpret_cast<const ImageDescriptor32 *>(datasetMessage.reader().getData().begin());
    testset_ =
      reinterpret_cast<const ImageDescriptor32 *>(testsetMessage.reader().getData().begin());

    datasetSize_ =
      datasetMessage.reader().getData().size() / datasetMessage.reader().getDescriptorSize();
    testsetSize_ =
      testsetMessage.reader().getData().size() / testsetMessage.reader().getDescriptorSize();
  }

protected:
  const ImageDescriptor32 *dataset_;
  const ImageDescriptor32 *testset_;
  size_t datasetSize_;
  size_t testsetSize_;
};

TEST_F(DescriptorLshIndexTest, TestNnRetrieval) {
  DescriptorLshIndex<64, ImageDescriptor32> lsh(dataset_, datasetSize_, 7, 4, 25, 1024);

  int misses = 0;
  for (int i = 0; i < testsetSize_; ++i) {
    auto bruteResult = lsh.findNearestBruteForce(testset_[i]);
    auto lshResult = lsh.findNearest(testset_[i]);

    if (bruteResult.distance < lshResult.distance) {
      ++misses;
    }
  }

  // Allow 4 or fewer times where the LSH can return a non-optimal nearest
  // neighbor out of 64 queries.
  EXPECT_LT(misses, 4);
}

}  // namespace c8
