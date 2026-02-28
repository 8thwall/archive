// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// Thin wrappers for calling OpenCV algorithms with c8 datatypes.

#pragma once

#include "c8/hmatrix.h"
#include "c8/set.h"
#include "c8/vector.h"

namespace c8 {

// Avoid namespace conflicts with cvlite.
namespace opencv {

// Wraps a call to cv::decomposeHomographyMat, which extracts potential relative camera positions
// from the homogeneous transformation in the upper left 3x3 range of the provided HMatrix.
Vector<HMatrix> decomposeHomographyMat(const HMatrix &K, const HMatrix &homography);

// Wraps a call to cv::decomposeEssentialMat, which extracts potential relative camera positions
// from the essential matrix in the upper left 3x3 range of the provided HMatrix.
Vector<HMatrix> decomposeEssentialMat(const HMatrix &K, const HMatrix &essential);

// Wraps a call to cv::findFundamentalMat, which extracts the fundamental matrix from a stereo pair
// of images into the upper left 3x3 range of the provided HMatrix.
HMatrix findFundamentalMat(
  const Vector<HPoint2> &view1MatchPoints,
  const Vector<HPoint2> &view2MatchPoints,
  Vector<uint8_t> *outlierMask);

// Wraps a call to cv::findEssentialMat, which extracts the essential matrix from a stereo pair
// of images into the upper left 3x3 range of the provided HMatrix.
HMatrix findEssentialMat(
  const HMatrix &K,
  const Vector<HPoint2> &view1MatchPoints,
  const Vector<HPoint2> &view2MatchPoints,
  Vector<uint8_t> *outlierMask);

// Wraps a call to cv::findHomography, which extracts a homography matrix from a stereo pair
// of images into the upper left 3x3 range of the provided HMatrix.
HMatrix findHomography(
  const Vector<HPoint2> &view1MatchPoints,
  const Vector<HPoint2> &view2MatchPoints,
  Vector<uint8_t> *coplanar);

HMatrix proposeHomography(
  const Vector<HPoint2> &view1MatchPoints,
  const Vector<HPoint2> &view2MatchPoints,
  const TreeSet<size_t> &coplanarSet);

HMatrix refineCameraMotion(
  const HMatrix &K,
  const HMatrix &extrinsicEstimate,
  const Vector<HPoint2> &camPoints,
  const Vector<HPoint3> &pts3dEstimate);

// Computes the image points closest to the camera points that can be triangulated with zero error.
// Triangulating these points will result in 3D points with minimum reprojection error, measured by
// l2 distance in the source images.
void getClosestEpipolarPointsF(
  const HMatrix &F,
  const Vector<HPoint2> &ptsCam1,
  const Vector<HPoint2> &ptsCam2,
  Vector<HPoint2> *epipolarPtsCam1,
  Vector<HPoint2> *epipolarPtsCam2);

void decomposeExtrinsicMatrix(const HMatrix &cam, HMatrix *rotation, HMatrix *translation);

}  // namespace opencv

}  // namespace c8
