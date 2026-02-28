// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "pose.h",
  };
  deps = {
    "//c8:c8-log",
    "//c8:hmatrix",
    "//c8:hpoint",
    "//c8:hvector",
    "//c8:quaternion",
    "//c8:vector",
    "//c8/geometry:egomotion",
    "//c8/geometry:intrinsics",
    "//c8/opencv:convert",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//reality/app/xr/capnp:xr-capnp",
    "//reality/engine/api:reality.capnp-cc",
    "//reality/quality/visualization/protolog:log-record-capture",
    "//reality/quality/visualization/render:imgproc",
    "@opencv//:calib3d",
    "@opencv//:core",
    "@opencv//:imgproc",
  };
}
cc_end(0x9696fd35);

#include <opencv2/calib3d.hpp>
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>

#include "c8/c8-log.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/intrinsics.h"
#include "c8/hpoint.h"
#include "c8/opencv/convert.h"
#include "c8/protolog/xr-requests.h"
#include "c8/vector.h"
#include "reality/engine/api/reality.capnp.h"
#include "reality/quality/datasets/chesspose/lib/pose.h"
#include "reality/quality/visualization/protolog/log-record-capture.h"
#include "reality/quality/visualization/render/imgproc.h"

using namespace ::c8;
using namespace ::c8::opencv;

namespace c8 {

Vector<Vector<size_t>> orientations{
  Vector<size_t>{
    0,  1,  2,  3,  4,  5,  6,   // Row 0
    7,  8,  9,  10, 11, 12, 13,  // Row 1
    14, 15, 16, 17, 18, 19, 20,  // Row 2
    21, 22, 23, 24, 25, 26, 27,  // Row 3
    28, 29, 30, 31, 32, 33, 34,  // Row 4
    35, 36, 37, 38, 39, 40, 41,  // Row 5
    42, 43, 44, 45, 46, 47, 48,  // Row 6
  },
  Vector<size_t>{
    6, 13, 20, 27, 34, 41, 48,  // Row 0
    5, 12, 19, 26, 33, 40, 47,  // Row 1
    4, 11, 18, 25, 32, 39, 46,  // Row 2
    3, 10, 17, 24, 31, 38, 45,  // Row 3
    2, 9,  16, 23, 30, 37, 44,  // Row 4
    1, 8,  15, 22, 29, 36, 43,  // Row 5
    0, 7,  14, 21, 28, 35, 42,  // Row 6
  },
  Vector<size_t>{
    48, 47, 46, 45, 44, 43, 42,  // Row 0
    41, 40, 39, 38, 37, 36, 35,  // Row 1
    34, 33, 32, 31, 30, 29, 28,  // Row 2
    27, 26, 25, 24, 23, 22, 21,  // Row 3
    20, 19, 18, 17, 16, 15, 14,  // Row 4
    13, 12, 11, 10, 9,  8,  7,   // Row 5
    6,  5,  4,  3,  2,  1,  0,   // Row 6
  },
  Vector<size_t>{
    42, 35, 28, 21, 14, 7,  0,  // Row 0
    43, 36, 29, 22, 15, 8,  1,  // Row 1
    44, 37, 30, 23, 16, 9,  2,  // Row 2
    45, 38, 31, 24, 17, 10, 3,  // Row 3
    46, 39, 32, 25, 18, 11, 4,  // Row 4
    47, 40, 33, 26, 19, 12, 5,  // Row 5
    48, 41, 34, 27, 20, 13, 6,  // Row 6
  }};

Vector<HPoint3> worldPoints() {
  Vector<HPoint3> worldPts;
  for (int x = 0; x < 7; ++x) {
    for (int z = 0; z < 7; ++z) {
      worldPts.push_back(HPoint3((x + 1) * .02f, 0.0f, (z + 1) * .02f));
    }
  }
  return worldPts;
}

HMatrix pixelIntrinsics(RealityRequest::Reader request) {
  return HMatrixGen::intrinsic(Intrinsics::getFullFrameIntrinsics(request));
}

void orderPoints(const Vector<HPoint2> &pts, const Vector<size_t> order, Vector<HPoint2> *ordered) {
  ordered->clear();
  for (size_t idx : order) {
    ordered->push_back(pts[idx]);
  }
}

Vector<HPoint2> findChessboardCorners(YPlanePixels srcY, int numRows, int numCols) {
  Vector<HPoint2> pts;

  cv::Mat vg(srcY.rows(), srcY.cols(), CV_8UC1, srcY.pixels(), srcY.rowBytes());
  cv::Mat viewGray = 1.5 * (vg - 65);

  std::vector<cv::Point2f> pointbuf;
  bool found = cv::findChessboardCorners(
    viewGray,
    cv::Size(numCols, numRows),
    pointbuf,
    cv::CALIB_CB_ADAPTIVE_THRESH | cv::CALIB_CB_NORMALIZE_IMAGE);

  if (!found) {
    for (int x = 0; x < srcY.rows(); x++) {
      for (int y = 0; y < srcY.cols(); y++) {
        auto p = vg.at<uint8_t>(x, y);
        viewGray.at<uint8_t>(x, y) = p < 200 ? p / 2 : p * 2;
      }
    }

    found = cv::findChessboardCorners(
      viewGray,
      cv::Size(numCols, numRows),
      pointbuf,
      cv::CALIB_CB_ADAPTIVE_THRESH | cv::CALIB_CB_NORMALIZE_IMAGE);

    if (!found) {
      return pts;
    }
  }

  cv::cornerSubPix(
    viewGray,
    pointbuf,
    cv::Size(11, 11),
    cv::Size(-1, -1),
    cv::TermCriteria(cv::TermCriteria::EPS + cv::TermCriteria::COUNT, 30, 0.1));

  for (auto pt : pointbuf) {
    pts.push_back(HPoint2(pt.x, pt.y));
  }
  return pts;
}

size_t chessboardLeftBottomIdx(const Vector<HPoint2> &warpPoints) {
  size_t leftBottom = 0;
  HPoint2 lb = warpPoints[0];
  for (size_t orderIdx = 1; orderIdx < 4; ++orderIdx) {
    auto pt = warpPoints[orientations[orderIdx][0]];
    if (pt.x() < lb.x() || (pt.x() == lb.x() && pt.y() < lb.y())) {
      leftBottom = orderIdx;
      lb = pt;
    }
  }
  return leftBottom;
}

}  // namespace c8
