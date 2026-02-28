// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Generator for Agate Histograms reduced in dimensionality by PCA with optional whitening.

#pragma once

#include "c8/float-vector.h"
#include "c8/vector.h"
#include "reality/engine/features/agate-histogram.h"
#include "reality/engine/features/agate-multi-histogram.h"
#include "reality/engine/features/api/descriptors.capnp.h"
#include "reality/engine/features/image-descriptor.h"
#include "reality/engine/features/binary-pca.h"

namespace c8 {

template <typename AgateT>
class AgatePca {
public:
  using Descriptor = typename AgateT::Descriptor;

  // Default constructor loads default AgateHistogram, default PCA basis, and
  // uses whitening.
  AgatePca();

  // Construct with a custom AgateHistogram, custom BinaryPca basis, choice of
  // whitening and reduced dimensionality.
  AgatePca(AgateT &&agate, BinaryPca &&basis, bool useWhitening, int dimensionality = 0);

  // Default move constructors.
  AgatePca(AgatePca &&) = default;
  AgatePca &operator=(AgatePca &&) = default;

  // Disallow copying.
  AgatePca(const AgatePca &) = delete;
  AgatePca &operator=(const AgatePca &) = delete;

  const FloatVector &extract(const Vector<typename AgateT::Descriptor> &pts);

  size_t histogramSize() const { return dimensionality_; }

private:
  AgateT agate_;
  BinaryPca pca_;

  bool useWhitening_;
  int dimensionality_;

  FloatVector projection_;
};

// Declare partial-specialization constructor.
template <>
AgatePca<AgateHistogram32>::AgatePca();
template <>
AgatePca<AgateMultiHistogram32>::AgatePca();

// Instantiated in the .cc file.
extern template class AgatePca<AgateHistogram32>;
extern template class AgatePca<AgateMultiHistogram32>;

// Aliases for the specific Agate Extractor(s) we use.
using AgatePca32 = AgatePca<AgateHistogram32>;
using AgateMultiPca32 = AgatePca<AgateMultiHistogram32>;

}  // namespace c8
