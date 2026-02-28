// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Rami Farran (rami@8thwall.com)
//
// Logic that takes in an image, converts it to a matrix,
// then calibrates with that information.

#include "bzl/inliner/rules2.h"

cc_binary {
  name = "calibrate-cc";
  deps = {
    "//c8:c8-log",
    "//c8:symbol-visibility",
    "//c8/pixels:pixel-transforms",
    "//c8/calibrate:cvcamcalibrate",
    "@opencv//:core",
  };
}
cc_end(0xda4fc35f);
#ifdef JAVASCRIPT

#include <emscripten.h>

#include <opencv2/core/core.hpp>
#include "c8/c8-log.h"
#include "c8/calibrate/cvcamcalibrate.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/symbol-visibility.h"

using namespace c8;
using namespace cv;
using namespace std;

namespace {
struct Data {
  std::vector<std::vector<cv::Point2f>> foundPoints;
  bool foundFrameThisFrame = false;
  CalibrationOutput out;
  int i = 0;
};

const int MIN_NUM_OF_FRAMES = 10;
const int BOARD_INNER_CORNERS = 7;
const float SQUARE_SIZE_MM = 20;

Data localData;

}  // namespace

extern "C" {

C8_PUBLIC
bool c8EmAsm_processCalibrationFrame(int rows, int cols, int rowBytes, uint8_t *pixels) {
  YPlanePixels ypix(rows, cols, rowBytes, pixels);

  cv::Mat gray(ypix.rows(), ypix.cols(), CV_8UC1, ypix.pixels(), ypix.rowBytes());
  cv::Mat hcGray = increaseContrast(gray);

  // If chessboard corners were found, set foundFrameThisFrame to true, else false
  Size boardSize;
  boardSize.height = BOARD_INNER_CORNERS;
  boardSize.width = BOARD_INNER_CORNERS;
  Pattern pattern = CHESSBOARD;
  bool calibrationFinished = false;
  vector<Point2f> pointbuf;
  localData.foundFrameThisFrame =
    processFrame(&hcGray, pattern, &boardSize, &localData.foundPoints, &pointbuf);

  // If found add the vector of points to foundPoints. (up to a max of 10)
  if (localData.foundFrameThisFrame) {
    localData.foundPoints.push_back(pointbuf);
  }

  if (localData.foundPoints.size() == MIN_NUM_OF_FRAMES) {
    Size imageSize = gray.size();
    float aspectRatio = (float)imageSize.width / imageSize.height;
    float squareSize = SQUARE_SIZE_MM;
    int flags = 0;
    // We use the "-a" flag
    // flags |= CALIB_FIX_ASPECT_RATIO;
    // We use the "-zt" flag
    flags |= CALIB_FIX_PRINCIPAL_POINT;
    flags |= CALIB_ZERO_TANGENT_DIST;
    runCalibration(
      localData.foundPoints,
      imageSize,
      boardSize,
      pattern,
      squareSize,
      aspectRatio,
      flags,
      &localData.out);
    calibrationFinished = true;
  }

  EM_ASM_(
    {
      window.calib = {};
      calib.foundFrames = $0;
      calib.foundFrameThisFrame = $1;
      calib.cameraFocalLength = $2;
      calib.cameraWidth = $3;
      calib.cameraHeight = $4;
      calib.reprojectionError = $5;
      calib.squareSizeMM = $6;
      calib.boardInnerCorners = $7;
    },
    localData.foundPoints.size(),
    localData.foundFrameThisFrame,
    localData.out.cameraMatrix.at<double>(0, 0),
    ypix.cols(),
    ypix.rows(),
    localData.out.totalAvgErr,
    SQUARE_SIZE_MM,
    BOARD_INNER_CORNERS);

  return calibrationFinished;
}

}  // EXTERN "C"

#endif  // JAVASCRIPT
