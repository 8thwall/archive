// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"agate-descriptor.h"};
  deps = {
    ":agate-pca",
    ":random-basis",
    "//c8:float-vector",
    "//c8:vector",
    "//c8/io:capnp-messages",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//reality/engine/features/api:descriptors.capnp-cc",
    "//reality/engine/features:embedded-agate-pca",
    "//reality/engine/features:image-descriptor",
  };
}
cc_end(0xc7f87f2e);

#include "reality/engine/features/agate-descriptor.h"

#include <random>

#include "c8/io/capnp-messages.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "reality/engine/features/agate-pca.h"
#include "reality/engine/features/random-basis.h"

namespace c8 {

template <typename GlobalDescriptor, typename AgateT>
GlobalDescriptor AgateDescriptor<GlobalDescriptor, AgateT>::extract(
  const Vector<typename AgateType::Descriptor> &localDescriptors) {
  ScopeTimer t("agate-descriptor");

  return basis_.projectAndBinarize(agate_.extract(localDescriptors));
}

// Instantiate the following template classes. This should match the
// 'extern template' lines in agate-multi-histogram.h.
template class AgateDescriptor<OrbFeature>;
template class AgateDescriptor<ImageDescriptor32>;
template class AgateDescriptor<ImageDescriptor<64>>;
template class AgateDescriptor<ImageDescriptor<128>>;
template class AgateDescriptor<OrbFeature, AgateMultiPca32>;
template class AgateDescriptor<ImageDescriptor32, AgateMultiPca32>;
template class AgateDescriptor<ImageDescriptor<64>, AgateMultiPca32>;
template class AgateDescriptor<ImageDescriptor<128>, AgateMultiPca32>;

}  // namespace c8
