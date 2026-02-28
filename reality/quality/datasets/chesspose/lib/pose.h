// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/hmatrix.h"
#include "c8/hpoint.h"
#include "c8/hvector.h"
#include "c8/pixels/pixels.h"
#include "c8/quaternion.h"
#include "c8/vector.h"
#include "reality/app/xr/capnp/xr-capnp.h"
#include "reality/engine/api/reality.capnp.h"

namespace c8 {

struct PoseState {
  HPoint3 position;
  Quaternion orientation;
  int64_t timestampNanos = 0;
  bool wasFound = false;
};

HMatrix pixelIntrinsics(RealityRequest::Reader request);

Vector<HPoint3> worldPoints();

void orderPoints(const Vector<HPoint2> &pts, const Vector<size_t> order, Vector<HPoint2> *ordered);

Vector<HPoint2> findChessboardCorners(YPlanePixels srcY, int numRow = 7, int numCols = 7);

size_t chessboardLeftBottomIdx(const Vector<HPoint2> &warpPoints);

}  // namespace c8
