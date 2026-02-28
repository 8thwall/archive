// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Rami Farran (rami@8thwall.com)
//
// Library aimed at helping calibrate devices.

#pragma once

#include <stdio.h>
#include <string.h>
#include <opencv2/core.hpp>
#include <opencv2/calib3d.hpp>

namespace c8 {
struct CalibrationOutput {
  bool ok;
  cv::Mat cameraMatrix = cv::Mat::eye(3, 3, CV_64F);
  cv::Mat distCoeffs = cv::Mat::zeros(8, 1, CV_64F);
  std::vector<cv::Mat> rvecs;
  std::vector<cv::Mat> tvecs;
  std::vector<float> reprojErrs;
  double totalAvgErr = 0.0f;
};

enum { DETECTION = 0, CAPTURING = 1, CALIBRATED = 2 };
enum Pattern { CHESSBOARD, CIRCLES_GRID, ASYMMETRIC_CIRCLES_GRID };

// This function "returns the average re-projection error" - OpenCV documentation
double computeReprojectionErrors(
  const std::vector<std::vector<cv::Point3f>> &objectPoints,
  const std::vector<std::vector<cv::Point2f>> &imagePoints,
  const std::vector<cv::Mat> &rvecs,
  const std::vector<cv::Mat> &tvecs,
  const cv::Mat &cameraMatrix,
  const cv::Mat &distCoeffs,
  std::vector<float> *perViewErrors);

// Determines where the corners of the chessboard are (depending on the pattern)
void calcChessboardCorners(
  cv::Size boardSize, float squareSize, std::vector<cv::Point3f> &corners, Pattern patternType = CHESSBOARD);

// Takes in varied sensor data and returns calibrated values
void runCalibration(
  std::vector<std::vector<cv::Point2f>> imagePoints,
  cv::Size imageSize,
  cv::Size boardSize,
  Pattern patternType,
  float squareSize,
  float aspectRatio,
  int flags,
  CalibrationOutput *calibrationOutput);

// Finds the checkerboard on the frame if there is one
bool processFrame(
  cv::Mat *viewGray,
  Pattern pattern,
  cv::Size *boardSize,
  std::vector<std::vector<cv::Point2f>> *imagePoints,
  std::vector<cv::Point2f> *pointbuf);

// Creates a high contrast version of an image
cv::Mat makeImageGray(const cv::Mat &view, cv::Mat *vg);

cv::Mat increaseContrast(const cv::Mat &grayImage);

// Displays image on screen with a color checkerboard overlaid.
void renderBoardWithCorners(
  cv::Mat *view,
  const cv::Mat &contrastView,
  cv::Size boardSize,
  std::vector<cv::Point2f> *pointbuf,
  bool found);

}  // namespace c8
