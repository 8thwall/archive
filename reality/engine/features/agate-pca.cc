// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"agate-pca.h"};
  deps = {
    ":agate-histogram",
    ":agate-multi-histogram",
    ":binary-pca",
    "//c8:c8-log",
    "//c8:float-vector",
    "//c8:vector",
    "//c8/io:capnp-messages",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//reality/engine/features/api:descriptors.capnp-cc",
    "//reality/engine/features:embedded-agate-pca",
    "//reality/engine/features:embedded-agate-multi-pca",
    "//reality/engine/features:image-descriptor",
  };
}
cc_end(0x250de455);

#include "reality/engine/features/agate-pca.h"

#include <random>

#include "c8/c8-log.h"
#include "c8/io/capnp-messages.h"
#include "c8/string/format.h"
#include "reality/engine/features/embedded-agate-multi-pca.h"
#include "reality/engine/features/embedded-agate-pca.h"
#include "c8/stats/scope-timer.h"

namespace c8 {

namespace {

BinaryPca loadDefaultBasis() {
  return BinaryPca(
    embeddedAgateKeyframeBinaryPca32dCapnpbinData, embeddedAgateKeyframeBinaryPca32dCapnpbinSize);
}

BinaryPca loadDefaultMultiBasis() {
  return BinaryPca(
    embeddedAgateKeyframeBinaryMultiPca32dCapnpbinData,
    embeddedAgateKeyframeBinaryMultiPca32dCapnpbinSize);
}

}  // namespace

// Partial specialization for AgateHistogram32.
template <>
AgatePca<AgateHistogram32>::AgatePca()
    : agate_(),
      pca_(loadDefaultBasis()),
      useWhitening_(true),
      dimensionality_(pca_.projectionSize()),
      projection_(pca_.projectionSize()) {}

// Partial specialization for AgateMultiHistogram32.
template <>
AgatePca<AgateMultiHistogram32>::AgatePca()
    : agate_(),
      pca_(loadDefaultMultiBasis()),
      useWhitening_(true),
      dimensionality_(pca_.projectionSize()),
      projection_(pca_.projectionSize()) {}

template <typename AgateT>
AgatePca<AgateT>::AgatePca(
  AgateT &&agate, BinaryPca&& basis, bool useWhitening, int dimensionality)
    : agate_(std::forward<AgateT>(agate)),
      pca_(std::forward<BinaryPca>(basis)),
      useWhitening_(useWhitening),
      dimensionality_(dimensionality) {}

template <typename AgateT>
const FloatVector &AgatePca<AgateT>::extract(
  const Vector<typename AgateT::Descriptor> &localDescriptors) {
  ScopeTimer t("agate-pca");

  const FloatVector &histogram = agate_.extract(localDescriptors);

  if (useWhitening_) {
    projection_ = pca_.projectAndWhiten(histogram, dimensionality_);
  } else {
    projection_ = pca_.project(histogram, dimensionality_);
  }

  // L2 Normalize the result. This gives some minor improvement in benchmarks,
  // but it important to do here, since downstream consumers expect to use
  // cosine distance as a proxy for L2 distance sorting, which only works when
  // the vector is normalized.
  projection_.l2Normalize();

  return projection_;
}

// Instantiate the following template classes. This should match the
// 'extern template' lines in agate-multi-histogram.h.
template class AgatePca<AgateHistogram32>;
template class AgatePca<AgateMultiHistogram32>;

}  // namespace c8
