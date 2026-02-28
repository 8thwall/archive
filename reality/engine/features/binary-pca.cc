// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "binary-pca.h",
  };
  deps = {
    "//c8:float-vector",
    "//c8/io:capnp-messages",
    "//reality/engine/features/api:descriptors.capnp-cc",
  };
}
cc_end(0x11fa9c32);

#include <algorithm>

#include "reality/engine/features/binary-pca.h"

namespace c8 {

BinaryPca::BinaryPca(const uint8_t *data, size_t size)
    : data_(data, size), input64_(data_.reader().getBasisVectorSize() >> 6) {}

FloatVector BinaryPca::project(const FloatVector &input, uint32_t outputDimensions) const {
  outputDimensions =
    outputDimensions > 0 ? std::min(outputDimensions, projectionSize()) : projectionSize();

  FloatVector result(outputDimensions);

  const auto &transIdx = data_.reader().getTranslationIdx();
  const auto &transLut = data_.reader().getTranslationLut();

  {
    // Translate the input vector using the translation indices and LUT.
    int p = 0;
    for (auto &x : input64_) {
      uint64_t block = 0;
      for (int i = 63; i >= 0; --i) {
        int idx = p + i;
        block = (block << 1) | static_cast<uint64_t>(0.0f < input[idx] + transLut[transIdx[idx]]);
      }
      p += 64;
      x = block;
    }
  }

  // Project the input vector into the binary PCA space.
  auto basis = data_.reader().getBasis();
  auto biter = basis.begin();
  auto iiter = input64_.begin();
  const int inputSize = input64_.size();

  // The binary basis works under the following observation:
  // If two floating point values are multiplied, the result is a negative
  // number if one is negative and one is positive. The result is positive if
  // both are negative or both are positive. So to approximate this with just 1
  // bit instead of a float, we binarize the floats, negative->0, positive->1,
  // and then calculate the result as the inverse XOR of these bits.

  // Initialize the accumulator at a half-width of the input vector size.
  const int accStart = static_cast<int>(data_.reader().getBasisVectorSize() >> 1);

  for (uint32_t i = 0; i < outputDimensions; ++i) {
    const auto bend = biter + inputSize;
    int acc = accStart;
    while (biter != bend) {
      // Subtract XOR from the accumulator to approximate the non-binary basis.
      acc -= __builtin_popcountll(*biter ^ *iiter);
      ++iiter;
      ++biter;
    }
    result[i] = static_cast<float>(acc);
    iiter = input64_.begin();
  }

  return result;
}

FloatVector BinaryPca::projectAndWhiten(const FloatVector &input, uint32_t outputDimensions) const {
  FloatVector result = project(input, outputDimensions);

  const auto &whitening = data_.reader().getWhitening();
  for (int i = 0; i < result.size(); ++i) {
    result[i] *= whitening[i];
  }

  return result;
}

}  // namespace c8
