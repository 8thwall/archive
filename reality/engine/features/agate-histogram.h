// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Extractor for image-level Agate descriptors.

#pragma once

#include "c8/float-vector.h"
#include "c8/vector.h"
#include "reality/engine/features/api/descriptors.capnp.h"
#include "reality/engine/features/image-descriptor.h"

namespace c8 {

template <typename LocalDescriptor>
class AgateHistogram {
public:
  using Descriptor = LocalDescriptor;

  // Default constructor loads the dictionary from the embedded default.
  AgateHistogram();

  // Constructor that loads the dictionary from a supplied message.
  AgateHistogram(DescriptorDictionary::Reader reader);

  // Default move constructors.
  AgateHistogram(AgateHistogram &&) = default;
  AgateHistogram &operator=(AgateHistogram &&) = default;

  // Disallow copying.
  AgateHistogram(const AgateHistogram &) = delete;
  AgateHistogram &operator=(const AgateHistogram &) = delete;

  const FloatVector &extract(const Vector<LocalDescriptor> &pts);

  size_t histogramSize() const { return histogram_.size(); }

private:
  void initDictionary(DescriptorDictionary::Reader reader);

  Vector<LocalDescriptor> dictionary_;

  static constexpr size_t localDescriptorBits = 8 * LocalDescriptor::size();

  FloatVector histogram_;

  // Contains four 16-bit counters packed into each uint64_t. As this algorithm makes many add an
  // insert calls, using a packed structure gives 4x performance.
  Vector<uint64_t> bitCounter_;

  Vector<int> assignments_;
};

// These extern lines tell code not to compile the template, but expect that the
// instantiation will be available at link time.
// The agate-extractor.cc file explicitly instantiates these templates. If you
// add another, also update the .cc file.
extern template class AgateHistogram<OrbFeature>;

// Aliases for the specific Agate Extractor(s) we use.
using AgateHistogram32 = AgateHistogram<OrbFeature>;

}  // namespace c8
