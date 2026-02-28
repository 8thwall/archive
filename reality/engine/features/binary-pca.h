// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Class to project a binary PCA basis from a set of binariazed FloatVectors.

#pragma once

#include "c8/float-vector.h"
#include "c8/io/capnp-messages.h"
#include "reality/engine/features/api/descriptors.capnp.h"

namespace c8 {

class BinaryPca {
public:
  // Construct a BinaryPca with a pointer to a flat memory block containing a
  // serialized BinaryPcaData capnp message. This memory is not owned by this
  // class and should exist throughout the BinaryPca lifetime.
  BinaryPca(const uint8_t *data, size_t size);

  // Default move constructors.
  BinaryPca(BinaryPca &&) = default;
  BinaryPca &operator=(BinaryPca &&) = default;

  // Disallow copying.
  BinaryPca(const BinaryPca &) = delete;
  BinaryPca &operator=(const BinaryPca &) = delete;

  // Project a data sample into the PCA space using the basis, mean, and
  // scale that is loaded in the generator. If outputDimensions is specified,
  // project only this many dimensions. Output dimensions must be divisible by 64.
  FloatVector project(const FloatVector &input, uint32_t outputDimensions = 0) const;

  // Project and a data sample into the PCA space then whiten it (scale such
  // that the output has an identity covariance matrix).
  // If outputDimensions is specified, project only this many dimensions. Output
  // dimensions must be divisible by 64.
  FloatVector projectAndWhiten(const FloatVector &input, uint32_t outputDimensions = 0) const;

  // Return the dimensionality of the projection.
  uint32_t projectionSize() const {
    return (data_.reader().getBasis().size() << 6) / data_.reader().getBasisVectorSize();
  }

private:
  ConstRootMessageView<BinaryPcaData> data_;
  mutable Vector<uint64_t> input64_;
};

}  // namespace c8
