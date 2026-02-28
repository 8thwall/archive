// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Rami Farran (rami@8thwall.com)
//
// Library aimed at helping calibrate devices.

#include "bzl/inliner/rules2.h"
#include "c8/exceptions.h"

cc_library {
  hdrs = {
    "cvcamcalibrate.h",
  };
  deps = {
    "//c8:c8-log",
    "//c8:exceptions",
    "@opencv//:calib3d",
    "@opencv//:core",
    "@opencv//:imgproc",
  };
  visibility = {
    "//reality/quality/visualization:__pkg__",
    "//apps/client/calibratejs:__pkg__",
  };
}
cc_end(0xa276faba);

#include <time.h>

#include <cctype>
#include <iostream>
#include <opencv2/imgproc.hpp>

#include "c8/c8-log.h"
#include "cvcamcalibrate.h"

using namespace cv;
using namespace std;
using namespace c8;

namespace c8 {

double computeReprojectionErrors(
  const vector<vector<Point3f>> &objectPoints,
  const vector<vector<Point2f>> &imagePoints,
  const vector<Mat> &rvecs,
  const vector<Mat> &tvecs,
  const Mat &cameraMatrix,
  const Mat &distCoeffs,
  vector<float> *perViewErrors) {
  vector<Point2f> imagePoints2;
  int i, totalPoints = 0;
  double totalErr = 0, err;
  perViewErrors->resize(objectPoints.size());

  for (i = 0; i < (int)objectPoints.size(); i++) {
    projectPoints(Mat(objectPoints[i]), rvecs[i], tvecs[i], cameraMatrix, distCoeffs, imagePoints2);
    err = norm(Mat(imagePoints[i]), Mat(imagePoints2), NORM_L2);
    int n = (int)objectPoints[i].size();
    (*perViewErrors)[i] = (float)std::sqrt(err * err / n);
    totalErr += err * err;
    totalPoints += n;
  }

  return std::sqrt(totalErr / totalPoints);
}

void calcChessboardCorners(
  Size boardSize, float squareSize, vector<Point3f> &corners, Pattern patternType) {
  corners.resize(0);

  switch (patternType) {
    case CHESSBOARD:
    case CIRCLES_GRID:
      for (int i = 0; i < boardSize.height; i++)
        for (int j = 0; j < boardSize.width; j++)
          corners.push_back(Point3f(float(j * squareSize), float(i * squareSize), 0));
      break;

    case ASYMMETRIC_CIRCLES_GRID:
      for (int i = 0; i < boardSize.height; i++)
        for (int j = 0; j < boardSize.width; j++)
          corners.push_back(Point3f(float((2 * j + i % 2) * squareSize), float(i * squareSize), 0));
      break;

    default:
      CV_Error(Error::StsBadArg, "Unknown pattern type\n");
  }
}

void runCalibration(
  vector<vector<Point2f>> imagePoints,
  Size imageSize,
  Size boardSize,
  Pattern patternType,
  float squareSize,
  float aspectRatio,
  int flags,
  CalibrationOutput *calibrationOutput) {
  calibrationOutput->cameraMatrix = Mat::eye(3, 3, CV_64F);
  if (flags & CALIB_FIX_ASPECT_RATIO)
    calibrationOutput->cameraMatrix.at<double>(0, 0) = aspectRatio;

  calibrationOutput->distCoeffs = Mat::zeros(8, 1, CV_64F);

  vector<vector<Point3f>> objectPoints(1);
  c8::calcChessboardCorners(boardSize, squareSize, objectPoints[0], patternType);

  objectPoints.resize(imagePoints.size(), objectPoints[0]);

  double rms = calibrateCamera(
    objectPoints,
    imagePoints,
    imageSize,
    calibrationOutput->cameraMatrix,
    calibrationOutput->distCoeffs,
    calibrationOutput->rvecs,
    calibrationOutput->tvecs,
    flags | CALIB_FIX_K4 | CALIB_FIX_K5);
  ///*|CALIB_FIX_K3*/|CALIB_FIX_K4|CALIB_FIX_K5);
  C8Log("RMS error reported by calibrateCamera: %g\n", rms);

  calibrationOutput->ok =
    checkRange(calibrationOutput->cameraMatrix) && checkRange(calibrationOutput->distCoeffs);

  calibrationOutput->totalAvgErr = c8::computeReprojectionErrors(
    objectPoints,
    imagePoints,
    calibrationOutput->rvecs,
    calibrationOutput->tvecs,
    calibrationOutput->cameraMatrix,
    calibrationOutput->distCoeffs,
    &(calibrationOutput->reprojErrs));
}

bool processFrame(
  Mat *viewGray,
  Pattern pattern,
  Size *boardSize,
  vector<vector<Point2f>> *imagePoints,
  vector<Point2f> *pointbuf) {
  bool found;

  switch (pattern) {
    case CHESSBOARD:
      // Look for the calibration pattern in the grayscale image.
      found = findChessboardCorners(
        *viewGray,   // Image input
        *boardSize,  // Size of the checkerboard (7x7)
        *pointbuf,   // Output points on the checkerboard if they were found.
        CALIB_CB_ADAPTIVE_THRESH | CALIB_CB_FAST_CHECK | CALIB_CB_NORMALIZE_IMAGE);
      break;
    case CIRCLES_GRID:
      found = findCirclesGrid(*viewGray, *boardSize, *pointbuf);
      break;
    case ASYMMETRIC_CIRCLES_GRID:
      found = findCirclesGrid(*viewGray, *boardSize, *pointbuf, CALIB_CB_ASYMMETRIC_GRID);
      break;
    default:
      C8_THROW("%s", "Unknown pattern type\n");
  }

  // Improve the found corners' coordinate accuracy
  if (pattern == CHESSBOARD && found)
    cornerSubPix(
      *viewGray,
      *pointbuf,
      Size(11, 11),
      Size(-1, -1),
      TermCriteria(TermCriteria::EPS + TermCriteria::COUNT, 30, 0.1));

  return found;
}

Mat makeImageGray(const Mat &view, Mat *vg) {
  // Take your color image and convert it to a grayscale image for processing.
  cvtColor(view, *vg, COLOR_BGR2GRAY);
  // Increase the contrast of that grayscale image and return it.
  return increaseContrast(*vg);
}

Mat increaseContrast(const Mat &grayImage) { return 1.5 * (grayImage - 65); }

void renderBoardWithCorners(
  Mat *view, const Mat &contrastView, Size boardSize, vector<Point2f> *pointbuf, bool found) {
  // Covert the grayscale image back to color so we can display it on the screen
  // with a color checkerboard overlaid on top.
  cvtColor(contrastView, *view, COLOR_GRAY2BGR);

  if (found)
    drawChessboardCorners(*view, boardSize, Mat(*pointbuf), found);
}
}  // namespace c8
