// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Conversions from c8 types to OpenCV types.

#pragma once

#include <type_traits>

#include <opencv2/core.hpp>
#include <opencv2/core/affine.hpp>

#include "c8/vector.h"
#include "c8/hpoint.h"

namespace c8 {

class HMatrix;

// Prevent namespace conflicts with the cvlite version.
namespace opencv {

class MatBackedInputArray {
private:
  using Type = std::remove_const_t<std::remove_reference_t<cv::InputArray>>;

public:
  MatBackedInputArray() = delete;

  // Construct by taking ownership of a cv::Mat header.
  MatBackedInputArray(cv::Mat mat);

  // Implicit conversion to cv::InputArray.
  operator Type() const;

  // Default copy and assign.
  MatBackedInputArray(const MatBackedInputArray &mat) = default;
  MatBackedInputArray &operator=(const MatBackedInputArray &mat) = default;

private:
  cv::Mat matrix;
};

// Convert the HMatrix to a cv::Matx44f, changing the internal storage from column-major to
// row-major.
cv::Matx44f toMatx(const HMatrix &matrix);

// Convert the upper-left submatrix of the HMatrix to a cv::Matx, changing the internal storage from
// column-major to row-major.
cv::Matx44d toMatx44d(const HMatrix &matrix);
cv::Matx34f toMatx34f(const HMatrix &matrix);
cv::Matx34d toMatx34d(const HMatrix &matrix);
cv::Matx33f toMatx33f(const HMatrix &matrix);
cv::Matx33d toMatx33d(const HMatrix &matrix);
cv::Matx22f toMatx22f(const HMatrix &matrix);
cv::Matx22d toMatx22d(const HMatrix &matrix);

// Convert the upper right submatrix of the HMatrix to a cv::Matx; this can be used to extract the
// translational component of the matrix.
cv::Matx31f toMatx31f(const HMatrix &matrix);
cv::Matx31d toMatx31d(const HMatrix &matrix);

// Convert the cv::Mat to an HMatrix, changing the internal storage from row-major to
// column-major.
HMatrix toHMatrix(const cv::Matx44f &matrix);
HMatrix toHMatrix(const cv::Matx44d &matrix);
HMatrix toHMatrix(const cv::Matx33f &matrix);
HMatrix toHMatrix(const cv::Matx33d &matrix);
HMatrix toHMatrix(const cv::Matx22f &matrix);
HMatrix toHMatrix(const cv::Matx22d &matrix);

// Convert the HMatrix to an cv::Affine3f, changing the internal storage from column-major to
// row-major.
cv::Affine3f toAffine3(const HMatrix &matrix);

// Return a read-only wrapper to the HPoint vector as a cv::Mat.
MatBackedInputArray asInputArray(const Vector<HPoint2>& points);
MatBackedInputArray asInputArray(const Vector<HPoint3>& points);

// Return a read-only wrapper to the HPoint vector as a cv::Mat, where each Mat element is a D-channel homogeneous vector.
MatBackedInputArray as3ChanInputArray(const Vector<HPoint2> &points);
MatBackedInputArray as4ChanInputArray(const Vector<HPoint3> &points);

}

}  // namespace c8
