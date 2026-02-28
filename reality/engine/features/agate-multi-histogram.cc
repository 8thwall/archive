// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"agate-multi-histogram.h"};
  deps = {
    ":agate-histogram",
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
    "//third_party/cvlite/flann:lsh-index",
  };
}
cc_end(0x97741a23);

#include "reality/engine/features/agate-multi-histogram.h"

#include <random>

#include "c8/cblas.h"
#include "c8/exceptions.h"
#include "c8/io/capnp-messages.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "reality/engine/features/embedded-agate-dictionaries.h"

namespace c8 {

template <typename LocalDescriptor>
AgateMultiHistogram<LocalDescriptor>::AgateMultiHistogram() {
  auto genAgate = [](const uint8_t *data, size_t size) {
    ConstRootMessage<DescriptorDictionary> dictionary(data, size);
    return AgateHistogram<LocalDescriptor>(dictionary.reader());
  };

  // Add four dictionaries of size k=64.
  agates_.emplace_back(genAgate(
    embeddedAgateKeyframeDictionary64N0CapnpbinData,
    embeddedAgateKeyframeDictionary64N0CapnpbinSize));
  agates_.emplace_back(genAgate(
    embeddedAgateKeyframeDictionary64N1CapnpbinData,
    embeddedAgateKeyframeDictionary64N1CapnpbinSize));
  agates_.emplace_back(genAgate(
    embeddedAgateKeyframeDictionary64N2CapnpbinData,
    embeddedAgateKeyframeDictionary64N2CapnpbinSize));
  agates_.emplace_back(genAgate(
    embeddedAgateKeyframeDictionary64N3CapnpbinData,
    embeddedAgateKeyframeDictionary64N3CapnpbinSize));

  size_t histogramSize = 0;
  for (const auto &agate : agates_) {
    histogramSize += agate.histogramSize();
  }
  multiHistogram_.resize(histogramSize);
}

template <typename LocalDescriptor>
AgateMultiHistogram<LocalDescriptor>::AgateMultiHistogram(
  AgateHistogram<LocalDescriptor> &&agates...) {
  agates_.emplace_back(std::forward<AgateHistogram<LocalDescriptor>>(agates));

  size_t histogramSize = 0;
  for (const auto &agate : agates_) {
    histogramSize += agate.histogramSize();
  }
  multiHistogram_.resize(histogramSize);
}

template <typename LocalDescriptor>
const FloatVector &AgateMultiHistogram<LocalDescriptor>::extract(
  const Vector<LocalDescriptor> &localDescriptors) {
  ScopeTimer t("agate-multi-histogram");

  auto iter = multiHistogram_.begin();

  // Copy the histograms into the multiHistogram.
  for (auto &agate : agates_) {
    const FloatVector &histogram = agate.extract(localDescriptors);
    std::copy(histogram.cbegin(), histogram.cend(), iter);
    iter += histogram.size();
  }

  return multiHistogram_;
}

// Instantiate the following template classes. This should match the
// 'extern template' lines in agate-multi-histogram.h.
template class AgateMultiHistogram<OrbFeature>;

}  // namespace c8
