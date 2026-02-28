// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Benchmark speed test for LshIndex.
//
// Example Usage:
//
//   bazel run reality/engine/features/descriptor-lsh-index-benchmark-test
//
// Example Output:
//   Run on (16 X 2300 MHz CPU s)
//   CPU Caches:
//     L1 Data 32K (x8)
//     L1 Instruction 32K (x8)
//     L2 Unified 262K (x8)
//     L3 Unified 16777K (x1)
//   -------------------------------------------------------------------------------------------
//   Benchmark                                                    Time           CPU Iterations
//   -------------------------------------------------------------------------------------------
//   DescriptorLshIndexBenchmarkTest/TestLshSpeed                68 ns         68 ns   10526791
//   DescriptorLshIndexBenchmarkTest/TestBruteForceSpeed        102 ns        102 ns    6875620

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
    "@com_google_benchmark//:benchmark",
  };
}
cc_end(0x5845461a);

#include "reality/engine/features/descriptor-lsh-index.h"

#include "c8/io/capnp-messages.h"
#include "reality/engine/features/api/descriptors.capnp.h"
#include "reality/engine/features/embedded-agate-dictionaries.h"

#include <random>

#include <benchmark/benchmark.h>

namespace c8 {

class DescriptorLshIndexBenchmarkTest : public benchmark::Fixture {
public:
  DescriptorLshIndexBenchmarkTest() {
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

BENCHMARK_F(DescriptorLshIndexBenchmarkTest, TestLshSpeed)(benchmark::State &state) {
  DescriptorLshIndex<64, ImageDescriptor32> lsh(dataset_, datasetSize_, 7, 4, 25, 4096);

  int i = 0;
  for (auto _ : state) {
    lsh.findNearest(testset_[i]);
    i = (i + 1) % testsetSize_;
  }
}

BENCHMARK_F(DescriptorLshIndexBenchmarkTest, TestBruteForceSpeed)(benchmark::State &state) {
  DescriptorLshIndex<64, ImageDescriptor32> lsh(dataset_, datasetSize_, 7, 4, 25, 4096);

  int i = 0;
  for (auto _ : state) {
    lsh.findNearestBruteForce(testset_[i]);
    i = (i + 1) % testsetSize_;
  }
}

}  // namespace c8
