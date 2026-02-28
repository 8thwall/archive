// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// Helpers to call c8 methods which use c++14 language features; the objective-c++ compiler only
// allows c++11 language features.

#pragma once

#include <simd/matrix_types.h>

namespace c8 {

void getCameraPose(
  const matrix_float4x4 &camera,
  float *qw,
  float *qx,
  float *qy,
  float *qz,
  float *x,
  float *y,
  float *z);

}  // namespace c8
