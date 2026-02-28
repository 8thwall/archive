// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include <random>
#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    "//third_party/cvlite/features2d:fast-score",
    "@com_google_benchmark//:benchmark",
  };
}
cc_end(0x50a45cef);

#include "third_party/cvlite/features2d/fast-score.h"

#include <benchmark/benchmark.h>

namespace c8 {

static void benchmarkCornerScore(benchmark::State &state) {
  int pixel[25];
  c8cv::makeOffsets(pixel, 32, 16);

  uint8_t ptr[16384];
  int threshold = 20;

  std::random_device rd;
  std::mt19937 gen(99);
  std::uniform_int_distribution<> uniformChar(0, 255);

  // Fill ptr with random data.
  for (int i = 0; i < sizeof(ptr); ++i) {
    ptr[i] = uniformChar(gen);
  }

  int offset = 0;
  constexpr int RANGE = sizeof(ptr) - (32 * 16);

  for (auto _ : state) {
    // Run cornerScore.
    c8cv::cornerScore<16>(ptr + offset, pixel, threshold);

    // Choose a new offset.
    offset = (offset + 97) % RANGE;
  }
}
BENCHMARK(benchmarkCornerScore);

}  // namespace c8
