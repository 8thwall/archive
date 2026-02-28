// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)
//

#include <random>
#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":quick-select",
    "@com_google_benchmark//:benchmark",
  };
}
cc_end(0x0688ebcb);

#include <benchmark/benchmark.h>
#include <array>
#include <random>
#include "third_party/nrc/quick-select.h"

constexpr static int NUM_DATA_PTS = 500;
constexpr static int TARGET_IDX = 252;

/* quick_select is way faster than nthElement
------------------------------------------------------------------------
Benchmark                                 Time           CPU Iterations
------------------------------------------------------------------------
BenchmarkQuickSelect/quickSelect        479 ns        479 ns    1287072
BenchmarkQuickSelect/nthElement        1462 ns       1461 ns     474136
*/

class BenchmarkQuickSelect : public benchmark::Fixture {
public:
  BenchmarkQuickSelect() : rng(rd()), rdDistribution(0.0, 400.0) {
    // Generate a bunch of random floats
    for (int i = 0; i < NUM_DATA_PTS; i++) {
      initialData[i] = rdDistribution(rng);
    }
  }

protected:
  std::random_device rd;
  std::mt19937 rng;
  std::uniform_real_distribution<> rdDistribution;
  float initialData[NUM_DATA_PTS];
};

BENCHMARK_F(BenchmarkQuickSelect, quickSelect)(benchmark::State &state) {
  float targetElement = -1;
  std::array<float, NUM_DATA_PTS> copiedData = {};
  for (auto _ : state) {
    // Make a fresh copy every time since nthElement test does the same thing
    std::copy(initialData, initialData + NUM_DATA_PTS, copiedData.begin());
    targetElement = quick_select(copiedData.data(), TARGET_IDX);
  }
}

BENCHMARK_F(BenchmarkQuickSelect, nthElement)(benchmark::State &state) {
  float targetElement2 = -1;
  std::array<float, NUM_DATA_PTS> copiedData = {};
  for (auto _ : state) {
    // Make a fresh copy every time because nth_element modify the array in place
    std::copy(initialData, initialData + NUM_DATA_PTS, copiedData.begin());
    std::nth_element(copiedData.begin(), copiedData.begin() + TARGET_IDX, copiedData.end());
    targetElement2 = *(copiedData.begin() + TARGET_IDX);
  }
}
