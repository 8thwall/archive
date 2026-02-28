// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)
//
// Helpers for verifying splat vertex shaders.

#pragma once

#include "c8/hmatrix.h"
#include "c8/hpoint.h"
#include "c8/quaternion.h"

namespace c8 {

// CPU implementation of the splat vertex shader. Given the extrinsic camera matrix, the position,
// rotation and scale of a splat, find a transform that warps points on a circle to the oval
// represented by the splat, at the same depth as the splat. In the shader, this is used to warp the
// corners of a quad to points in 3d space that are the facing the camera at the depth of the quad
// and bounding its screen-space extent.
HMatrix splatTransform(
  const HMatrix &extrinsic,
  HPoint3 instancePosition,
  Quaternion instanceRotation,
  HVector3 instanceScale);

}  // namespace c8
