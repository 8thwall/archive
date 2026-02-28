// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Extractor for multi-dictionary Agate Histograms.

#pragma once

#include "c8/float-vector.h"
#include "c8/vector.h"
#include "reality/engine/features/agate-histogram.h"
#include "reality/engine/features/api/descriptors.capnp.h"
#include "reality/engine/features/image-descriptor.h"

namespace c8 {

template <typename LocalDescriptor>
class AgateMultiHistogram {
public:
  using Descriptor = LocalDescriptor;

  // Default constructor loads four AgateHistograms from embedded defaults.
  AgateMultiHistogram();

  // Construct an AgateMultiHistogram from N AgateHistograms.
  AgateMultiHistogram(AgateHistogram<LocalDescriptor> &&agates...);

  // Default move constructors.
  AgateMultiHistogram(AgateMultiHistogram &&) = default;
  AgateMultiHistogram &operator=(AgateMultiHistogram &&) = default;

  // Disallow copying.
  AgateMultiHistogram(const AgateMultiHistogram &) = delete;
  AgateMultiHistogram &operator=(const AgateMultiHistogram &) = delete;

  const FloatVector &extract(const Vector<LocalDescriptor> &pts);

private:
  Vector<AgateHistogram<LocalDescriptor>> agates_;

  FloatVector multiHistogram_;
};

// These extern lines tell code not to compile the template, but expect that the
// instantiation will be available at link time.
// The agate-multi-histogram.cc file explicitly instantiates these templates. If you
// add another, also update the .cc file.
extern template class AgateMultiHistogram<OrbFeature>;

// Aliases for the specific Agate Extractor(s) we use.
using AgateMultiHistogram32 = AgateMultiHistogram<OrbFeature>;

}  // namespace c8
