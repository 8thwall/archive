// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Generator for Agate Descriptors, compact binary descriptors capable of
// predicting whether two images are matching views.

#pragma once

#include "c8/float-vector.h"
#include "c8/vector.h"
#include "reality/engine/features/agate-histogram.h"
#include "reality/engine/features/agate-pca.h"
#include "reality/engine/features/image-descriptor.h"
#include "reality/engine/features/random-basis.h"

namespace c8 {

template <typename GlobalDescriptor, typename AgatePcaT = AgatePca32>
class AgateDescriptor {
public:
  using AgateType = AgatePcaT;
  using Descriptor = GlobalDescriptor;

  // Default basis has 32 dimensions.
  AgateDescriptor() : agate_(), basis_(agate_.histogramSize()) {}

  // Default move constructors.
  AgateDescriptor(AgateDescriptor<Descriptor, AgatePcaT> &&) = default;
  AgateDescriptor &operator=(AgateDescriptor<Descriptor, AgatePcaT> &&) = default;

  // Disallow copying.
  AgateDescriptor(const AgateDescriptor<Descriptor, AgatePcaT> &) = delete;
  AgateDescriptor &operator=(const AgateDescriptor<Descriptor, AgatePcaT> &) = delete;

  Descriptor extract(const Vector<typename AgateType::Descriptor> &pts);

private:
  AgateType agate_;

  RandomBasis<Descriptor> basis_;
};

// Instantiated in the .cc file.
extern template class AgateDescriptor<OrbFeature>;
extern template class AgateDescriptor<ImageDescriptor32>;
extern template class AgateDescriptor<ImageDescriptor<64>>;
extern template class AgateDescriptor<ImageDescriptor<128>>;
extern template class AgateDescriptor<ImageDescriptor32, AgateMultiPca32>;
extern template class AgateDescriptor<ImageDescriptor<64>, AgateMultiPca32>;
extern template class AgateDescriptor<ImageDescriptor<128>, AgateMultiPca32>;

// Aliases for the specific Agate Extractor(s) we use.
using AgateDescriptor128 = AgateDescriptor<OrbFeature>;
using AgateMultiDescriptor128 = AgateDescriptor<OrbFeature, AgateMultiPca32>;

}  // namespace c8
