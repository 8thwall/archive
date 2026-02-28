// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"agate-histogram.h"};
  deps = {
    ":embedded-agate-dictionaries",
    "//c8:cblas",
    "//c8:exceptions",
    "//c8:float-vector",
    "//c8:vector",
    "//c8/io:capnp-messages",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//reality/engine/features/api:descriptors.capnp-cc",
    "//reality/engine/features:image-descriptor",
  };
}
cc_end(0x915c32c2);

#include "reality/engine/features/agate-histogram.h"

#include <random>

#include "c8/cblas.h"
#include "c8/exceptions.h"
#include "c8/io/capnp-messages.h"
#include "c8/string/format.h"
#include "reality/engine/features/embedded-agate-dictionaries.h"
#include "c8/stats/scope-timer.h"

namespace c8 {

template <typename LocalDescriptor>
AgateHistogram<LocalDescriptor>::AgateHistogram() {
  MutableRootMessage<DescriptorDictionary> dictionary;
  kj::ArrayPtr flatArray(
    reinterpret_cast<const capnp::word *>(embeddedAgateKeyframeDictionary64N0CapnpbinData),
    embeddedAgateKeyframeDictionary64N0CapnpbinSize / sizeof(capnp::word));
  capnp::initMessageBuilderFromFlatArrayCopy(flatArray, *dictionary.message());
  initDictionary(dictionary.reader());
}

template <typename LocalDescriptor>
AgateHistogram<LocalDescriptor>::AgateHistogram(DescriptorDictionary::Reader reader) {
  initDictionary(reader);
}

template <typename LocalDescriptor>
void AgateHistogram<LocalDescriptor>::initDictionary(DescriptorDictionary::Reader reader) {
  auto descriptorSize = reader.getDescriptorSize();
  auto dataSize = reader.getData().size();

  if (descriptorSize != LocalDescriptor::size()) {
    C8_THROW("Local descriptor size does not match expected size %d \% %d != 0",
      dataSize,
      LocalDescriptor::size());
  }

  if (dataSize % descriptorSize != 0) {
    C8_THROW(
      "Dictionary data not a multiple of Descriptor size %d \% %d != 0", dataSize, descriptorSize);
  }

  // Size and set the local descriptor dictionary.
  auto numDescriptors = dataSize / descriptorSize;
  dictionary_.resize(numDescriptors);
  const uint8_t *offset = reader.getData().begin();
  for (int i = 0; i < numDescriptors; ++i) {
    std::copy(offset, offset + descriptorSize, dictionary_[i].mutableData());
    offset += descriptorSize;
  }

  histogram_.resize(numDescriptors * localDescriptorBits);
  histogram_.zeroOut();

  bitCounter_.resize(numDescriptors * localDescriptorBits / 4);
  std::fill(bitCounter_.begin(), bitCounter_.end(), 0);
}

template <typename LocalDescriptor>
const FloatVector &AgateHistogram<LocalDescriptor>::extract(
  const Vector<LocalDescriptor> &localDescriptors) {

  ScopeTimer t("agate-extract-features");

  // Zero out the the counter.
  std::fill(bitCounter_.begin(), bitCounter_.end(), 0);

  auto n = localDescriptors.size();
  constexpr size_t descriptorSize = LocalDescriptor::size();

  assignments_.resize(n);

  // Perform a brute force search for the nearest dictionary descriptor.
  {
    ScopeTimer tt("agate-brute-search");
    for (int i = 0; i < n; ++i) {
      const LocalDescriptor &queryDesc = localDescriptors[i];

      int closestDistance = std::numeric_limits<int>::max();
      for (int j = 0; j < dictionary_.size(); ++j) {
        int d = queryDesc.hammingDistance(dictionary_[j]);
        if (d < closestDistance) {
          closestDistance = d;
          assignments_[i] = j;
        }
      }
    }
  }

  // Count the matches for each dictionary item.
  Vector<int> indexCounts(dictionary_.size());
  for (int i = 0; i < n; ++i) {
    indexCounts[assignments_[i]]++;
  }

  {
    ScopeTimer tt("agate-aggregate-bits");
    for (int i = 0; i < n; ++i) {
      int index = assignments_[i];
      const LocalDescriptor &queryDesc = localDescriptors[i];

      // Jump to the bits for the matched dictionary term.
      auto iter = std::next(bitCounter_.begin(), (index * localDescriptorBits) >> 2);

      for (int p = 0; p < descriptorSize; ++p) {
        uint64_t data = queryDesc.data()[p];

        // Pack first four bits in the first uint64_t.
        iter[0] += (data & 0b1ull) | ((data & 0b10ull) << 15) | ((data & 0b100ull) << 30)
          | ((data & 0b1000ull) << 45);

        // Pack second four bits in second uint64_t.
        iter[1] += ((data & 0b10000ull) >> 4) | ((data & 0b100000ull) << 11)
          | ((data & 0b1000000ull) << 26) | ((data & 0b10000000ull) << 41);

        // Increment the iterator for the next byte.
        iter += 2;
      }
    }
  }

  // Decode the 4 uint16_t in each uint64_t into the float histogram.
  for (int i = 0; i < bitCounter_.size(); ++i) {
    uint64_t data = bitCounter_[i];
    for (int j = 0; j < 4; ++j) {
      histogram_[(i << 2) + j] = (data >> (j * 16)) & 0xFFFFull;
    }
  }
  // Copy int bit counter into the float histogram.
  // std::copy(bitCounter_.begin(), bitCounter_.end(), histogram_.begin());

  for (int i = 0; i < dictionary_.size(); ++i) {
    auto iter = std::next(histogram_.begin(), i * localDescriptorBits);
    const LocalDescriptor &matchDesc = dictionary_[i];

    // Scale segment by the count of dictionary term matches.
    float scale = 1.0f / (0.00001f + indexCounts[i]);
    for (int j = 0; j < localDescriptorBits; ++j) {
      iter[j] *= scale;
    }

    // Subtract cluster center.
    float clusterScale = 0.0f;
    for (int p = 0; p < descriptorSize; ++p) {
      const int bitStart = p << 3;
      int data = matchDesc.data()[p];
      for (int b = 0; b < 8; ++b) {
        auto &item = iter[bitStart + b];
        item -= (data >> b) & 0b1;
        clusterScale += item * item;
      }
    }

    // L2 normalize segment with regularization.
    clusterScale = 1.0f / (0.00001f + std::sqrt(clusterScale));
    for (int j = 0; j < localDescriptorBits; ++j) {
      iter[j] *= clusterScale;
    }
  }

  // L2 normalize full vector with regularization.
  histogram_ *= 1.0f / (0.00001 + l2Norm(histogram_));
  return histogram_;
}

// Instantiate the following template classes. This should match the 'extern
// template' lines in agate-extractor.h.
template class AgateHistogram<OrbFeature>;

}  // namespace c8
