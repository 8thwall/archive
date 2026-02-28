// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)
// This code lab validates basic understanding of how HMatrix represents transformation
// in space. How we represent transformation as a left matrix multiply. How transformation
// composition works.

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:hmatrix",
    "//c8/io:image-io",
  };
}
cc_end(0xe129ca37);

#include <array>
#include "c8/c8-log.h"
#include "c8/hmatrix.h"
#include "c8/io/image-io.h"
#include "c8/stats/scope-timer.h"

using namespace c8;

namespace {

void runTransformationPointTest() {
  HPoint3 origin {0.f, 0.f, 0.f};

  // We follow the TRS left matrix multiply convention for transformation
  // mnemonics: TeaRS, messing up transformation matrices will leave you in tears
  // i.e. a transformation matrix (4x4) represents with translate, rotate and scale on a vector v
  // .    is computed as T * R * S * v. Where T, R and S are 4x4 matrices and v is a 4x1 vector
  auto translateMat = HMatrixGen::translation(-1, -2, 3);
  HPoint3 originT = translateMat * origin;
  C8Log("[transformations] origin after translate %f %f %f", originT.x(), originT.y(), originT.z());
  HPoint3 origin2 = translateMat.inv() * originT;
  C8Log("[transformations] origin after translate back %f %f %f", origin2.x(), origin2.y(), origin2.z());

  // NOTE(dat): Doing the same transformation on an HVector3 doesn't work because HVector3 has the 4th component being 0
  // .          The concept of translating a HVector3 doesn't exist.

  // You can compose multiple transformation into a single matrix (because matrix multiply is associative)
  auto tr1 = HMatrixGen::translation(2, 3, -4);
  auto tr2 = HMatrixGen::rotationD(90, -23, 145);
  auto tr3 = HMatrixGen::scale(1.f, 2.f, 0.5f);
  // Remember: T R S
  auto combinedTr = tr1 * tr2 * tr3;

  HPoint3 pointA {1.f, 2.f, 4.f};
  HPoint3 afterS = tr3 * pointA;
  C8Log("[transformations] pointA after scale %f %f %f", afterS.x(), afterS.y(), afterS.z());
  HPoint3 afterSThenR = tr2 * afterS;
  C8Log("[transformations] pointA after scale then rotate %f %f %f", afterSThenR.x(), afterSThenR.y(), afterSThenR.z());
  HPoint3 afterSThenRThenT = tr1 * afterSThenR;
  C8Log("[transformations] pointA after scale then rotate translate %f %f %f", afterSThenRThenT.x(), afterSThenRThenT.y(), afterSThenRThenT.z());
  HPoint3 direct = combinedTr * pointA;
  C8Log("[transformations] pointA with a direct combined transformation %f %f %f", direct.x(), direct.y(), direct.z());
}

void runTransformationCompositionTest() {
  // An HMatrix represents a transformation of coordinate system
  HPoint3 pointInCameraSpace {1.f, 1.f, 5.f};
  HMatrix cameraPose = HMatrixGen::translation(1, 2, 3) * HMatrixGen::rotationD(-45, 76, 150);

  // A camera pose refers to pose as seen from the world coordinate
  // A camera pose in an object coordinate should be named cameraPoseFromObject or objectToCameraPose
  HPoint3 pointInWorldSpace = cameraPose.inv() * pointInCameraSpace;
  C8Log("[transformations] point in world space %f %f %f", pointInWorldSpace.x(), pointInWorldSpace.y(), pointInWorldSpace.z());
}

}  // namespace

int main(int argc, char *argv[]) {
  runTransformationPointTest();
  runTransformationCompositionTest();
}
