// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "c8-helpers.h",
  };
  deps = {
    "//c8:hmatrix",
    "//c8:hpoint",
    "//c8:quaternion",
  };
  visibility = {
    "//reality/app/xr/ios:__subpackages__",
    "//reality/app/sensors/arkit:__subpackages__",
  };
}

#include "reality/app/xr/ios/c8-helpers.h"

#include "c8/hmatrix.h"
#include "c8/hpoint.h"
#include "c8/quaternion.h"

namespace c8 {

void getCameraPose(
  const matrix_float4x4 &camera,
  float *qw,
  float *qx,
  float *qy,
  float *qz,
  float *x,
  float *y,
  float *z) {
  HMatrix cmat{
    {camera.columns[0].x, camera.columns[1].x, camera.columns[2].x, camera.columns[3].x},
    {camera.columns[0].y, camera.columns[1].y, camera.columns[2].y, camera.columns[3].y},
    {camera.columns[0].z, camera.columns[1].z, camera.columns[2].z, camera.columns[3].z},
    {camera.columns[0].w, camera.columns[1].w, camera.columns[2].w, camera.columns[3].w}};
  Quaternion cquat = Quaternion::fromHMatrix(cmat);
  HPoint3 trans{cmat(0, 3), cmat(1, 3), cmat(2, 3)};

  *qw = cquat.w();
  *qx = cquat.x();
  *qy = cquat.y();
  *qz = cquat.z();
  *x = trans.x();
  *y = trans.y();
  *z = trans.z();
}

}  // namespace c8
