// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <opencv2/core.hpp>
#include <vector>

#include "c8/geometry/two-d.h"
#include "c8/hmatrix.h"
#include "c8/hpoint.h"
#include "c8/vector.h"

namespace c8 {

class Imgproc {
public:
  // Draws a set of point matches over a 2D image.
  static void displayPointMatches(
    Vector<HPoint2> &cam1Points, Vector<HPoint2> &cam2Points, cv::Mat *frame);

  // Draws a representation of the set of coplanar points identified as coplanar by a homography.
  static void displayEstimatedHomography(
    const HMatrix &homography,
    const HMatrix &K,
    const HMatrix &extrinsic,
    const Vector<HPoint3> &pts3d,
    const Vector<HPoint2> &matchCam1,
    const Vector<HPoint2> &matchCam2,
    const Vector<uint8_t> &coplanar,
    cv::Mat *frame);

  static void drawPoints(
    const Vector<HPoint2> &points, int radius, cv::Scalar color, cv::Mat *frame);

  static void drawPoint(HPoint2 point, int radius, cv::Scalar color, cv::Mat *frame);
  static void drawPoint(HPoint2 point, int radius, cv::Scalar color, cv::Mat *frame, int thickness);

  static void drawLines(
    const Vector<HPoint2> &fromPts,
    const Vector<HPoint2> &toPts,
    int width,
    cv::Scalar color,
    cv::Mat *frame);

  static void drawLine(HPoint2 fromPt, HPoint2 toPt, int width, cv::Scalar color, cv::Mat *frame);

  static void drawPoly(const Poly2 &poly, int width, cv::Scalar color, cv::Mat *frame);
  static void drawLines(const Vector<Line2> &lines, int width, cv::Scalar color, cv::Mat *frame);

  static void visualizeHomography(const HMatrix &homography, cv::Mat *frame);
  static void visualizeProjection(const HMatrix &K, const HMatrix &extrinsic, cv::Mat *frame);

  static void warpHomography(const HMatrix &homography, const cv::Mat &frame, cv::Mat *warpedFrame);

  static void drawCompass(const HMatrix &extrinsic, const HMatrix &intrinsic, cv::Mat *frame);

  static void drawAxis(
    const HMatrix &K, const HMatrix &pose, HPoint3 origin, float len, cv::Mat *frame);
  static void drawAxis(
    const HMatrix &K,
    const HMatrix &pose,
    HPoint3 origin,
    float len,
    const cv::Scalar color,
    cv::Mat *frame);

  // This is a static utility class, it can't be constructred, copied or moved.
  Imgproc() = delete;
  Imgproc(Imgproc &&) = delete;
  Imgproc &operator=(Imgproc &&) = delete;
  Imgproc(const Imgproc &) = delete;
  Imgproc &operator=(const Imgproc &) = delete;

private:
};

}  // namespace c8
