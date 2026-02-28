// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "vert.h",
  };
  deps = {
    "//c8:hmatrix",
    "//c8:hpoint",
    "//c8:quaternion",
    "//c8/geometry:egomotion",
  };
}
cc_end(0x3bbfd147);

#include <array>

#include "c8/geometry/egomotion.h"
#include "reality/quality/splat/vert.h"

namespace c8 {

namespace {

std::array<float, 6> rssrCoeffs(Quaternion rot, HVector3 scale) {
  float x = rot.x();
  float y = rot.y();
  float z = rot.z();
  float w = rot.w();

  // R * S * S.T * R.T = [c0 c1 c2,
  //                      c1 c3 c4,
  //                      c2 c4 c5]
  // where
  // c0 = s0r00 * s0r00 + s1r01 * s1r01 + s2r02 * s2r02
  // c1 = s0r00 * s0r10 + s1r01 * s1r11 + s2r02 * s2r12
  // c2 = s0r00 * s0r20 + s1r01 * s1r21 + s2r02 * s2r22
  // c3 = s0r10 * s0r10 + s1r11 * s1r11 + s2r12 * s2r12
  // c4 = s0r10 * s0r20 + s1r11 * s1r21 + s2r12 * s2r22
  // c5 = s0r20 * s0r20 + s1r21 * s1r21 + s2r22 * s2r22
  float s0r00 = scale.x() * (1.0 - 2.0 * (y * y + z * z));
  float s1r01 = scale.y() * (2.0 * (x * y - w * z));
  float s2r02 = scale.z() * (2.0 * (x * z + w * y));
  float s0r10 = scale.x() * (2.0 * (x * y + w * z));
  float s1r11 = scale.y() * (1.0 - 2.0 * (x * x + z * z));
  float s2r12 = scale.z() * (2.0 * (y * z - w * x));
  float s0r20 = scale.x() * (2.0 * (x * z - w * y));
  float s1r21 = scale.y() * (2.0 * (y * z + w * x));
  float s2r22 = scale.z() * (1.0 - 2.0 * (x * x + y * y));
  return {
    s0r00 * s0r00 + s1r01 * s1r01 + s2r02 * s2r02,
    s0r00 * s0r10 + s1r01 * s1r11 + s2r02 * s2r12,
    s0r00 * s0r20 + s1r01 * s1r21 + s2r02 * s2r22,
    s0r10 * s0r10 + s1r11 * s1r11 + s2r12 * s2r12,
    s0r10 * s0r20 + s1r11 * s1r21 + s2r12 * s2r22,
    s0r20 * s0r20 + s1r21 * s1r21 + s2r22 * s2r22
  };
}
}  // namespace

HMatrix splatTransform(
  const HMatrix &extrinsic,
  HPoint3 instancePosition,
  Quaternion instanceRotation,
  HVector3 instanceScale) {
  auto mv = extrinsic.inv();
  auto splat3d = mv * instancePosition;

  auto coeffs = rssrCoeffs(instanceRotation, instanceScale);

  float c0 = coeffs[0];
  float c1 = coeffs[1];
  float c2 = coeffs[2];
  float c3 = coeffs[3];
  float c4 = coeffs[4];
  float c5 = coeffs[5];
  HMatrix rssr = {{c0, c1, c2, 0.0}, {c1, c3, c4, 0.0}, {c2, c4, c5, 0.0}, {0.0, 0.0, 0.0, 1.0}};

  HMatrix J = HMatrix{
    {1.0f, 0, -splat3d.x() / splat3d.z(), 0},
    {0, 1.0f, -splat3d.y() / splat3d.z(), 0},
    {0, 0, 0, 0},
    {0, 0, 0, 0},
  };

  auto T = rotationMat(mv).t() * J;
  auto cov2d = T.t() * rssr * T;
  C8Log(
    "rssr:\n%s\nJ:\n%s\ncov2d:\n%s",
    rssr.toPrettyString().c_str(),
    J.toPrettyString().c_str(),
    cov2d.toPrettyString().c_str());

  float diagonal1 = cov2d(0, 0);
  float offDiagonal = cov2d(0, 1);
  float diagonal2 = cov2d(1, 1);

  auto mid = (diagonal1 + diagonal2) * 0.5f;
  auto rx = (diagonal1 - diagonal2) * 0.5f;
  auto ry = offDiagonal;
  auto radius = std::sqrt(rx * rx + ry * ry);
  float lambda1 = mid + radius;
  float lambda2 = mid - radius;

  C8Log(
    "mid: %f, rx: %f, ry: %f, radius: %f, lambda1: %f, lambda2: %f",
    mid,
    rx,
    ry,
    radius,
    lambda1,
    lambda2);

  float dx = offDiagonal;
  float dy = lambda1 - diagonal1;
  float dn = std::sqrt(dx * dx + dy * dy);
  if (dn < 1e-6f) {
    dx = 1.0f;
    dy = 0.0f;
  } else {
    dx /= dn;
    dy /= dn;
  }
  float std1 = std::sqrt(lambda1);
  float std2 = std::sqrt(lambda2);

  HVector2 majorAxis = HVector2{dx * std1, dy * std1};
  HVector2 minorAxis = HVector2{-dy * std2, dx * std2};


  C8Log("diagonal: (x: %f, y: %f)", dx, dy);

  float mjx = majorAxis.x();
  float mjy = majorAxis.y();
  float mnx = minorAxis.x();
  float mny = minorAxis.y();

  C8Log("major axis: (x: %f, y: %f), minor axis: (x: %f, y: %f)", mjx, mjy, mnx, mny);

  HMatrix transform = HMatrix{
    {mjx, mnx, 0, splat3d.x()},
    {mjy, mny, 0, splat3d.y()},
    {0, 0, 1, splat3d.z()},
    {0, 0, 0, 1},
  };
  C8Log("transform:\n%s", transform.toPrettyString().c_str());
  return transform;
}

}  // namespace c8
