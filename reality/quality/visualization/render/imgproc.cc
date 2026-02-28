// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "imgproc.h",
  };
  deps = {
    "//c8:hmatrix",
    "//c8:hpoint",
    "//c8:vector",
    "//c8/geometry:two-d",
    "//c8/opencv:convert",
    "@opencv//:calib3d",
    "@opencv//:core",
    "@opencv//:imgproc",
  };
}
cc_end(0xaec22e0f);

#include <iostream>
#include <opencv2/calib3d.hpp>
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>

#include "c8/hpoint.h"
#include "c8/opencv/convert.h"
#include "c8/vector.h"
#include "reality/quality/visualization/render/imgproc.h"

using namespace ::c8;
using namespace ::c8::opencv;

using std::round;

void Imgproc::visualizeHomography(const HMatrix &homography, cv::Mat *frame) {
  cv::Size s = frame->size();
  Vector<HPoint2> planeBoundsCam1{
    HPoint2(75.0f, 75.0f),
    HPoint2(s.width - 75.0f, 75.0f),
    HPoint2(s.width - 75.0f, s.height - 75.0f),
    HPoint2(75.0f, s.height - 75.0f)};
  Vector<HPoint2> planeBoundsCam2 = project2D(homography, planeBoundsCam1);

  for (int i = 0; i < 4; ++i) {
    auto fromPt = planeBoundsCam2[i];
    auto toPt = planeBoundsCam2[(i + 1) % 4];
    int b = i == 0 ? 255 : 0;  // Top line is cyan.
    cv::line(
      *frame,
      cv::Point2d(fromPt.x(), fromPt.y()),
      cv::Point2d(toPt.x(), toPt.y()),
      cv::Scalar(b, 255, 0),
      5);
  }
}

void Imgproc::visualizeProjection(const HMatrix &K, const HMatrix &extrinsic, cv::Mat *frame) {
  Vector<HPoint3> planeIn3d{
    HPoint3(-1.0f, 1.33f, 4.0f),    // Upper left
    HPoint3(1.0f, 1.33f, 4.0f),     // Upper right
    HPoint3(1.0f, -1.33f, 4.0f),    // Lower right
    HPoint3(-1.0f, -1.33f, 4.0f)};  // Lower left

  Vector<HPoint2> planeBoundsCam1 = project2D(K, planeIn3d);
  Vector<HPoint2> planeBoundsCam2 = project2D(K * extrinsic.inv(), planeIn3d);

  // Draw the starting rectangle for reference.
  for (int i = 0; i < 4; ++i) {
    auto fromPt = planeBoundsCam1[i];
    auto toPt = planeBoundsCam1[(i + 1) % 4];
    int g = i == 0 ? 127 : 0;  // Top line is orange.
    cv::line(
      *frame,
      cv::Point2d(fromPt.x(), fromPt.y()),
      cv::Point2d(toPt.x(), toPt.y()),
      cv::Scalar(0, g, 255),
      1);
  }

  // Connect the projected points to their starting position for reference.
  for (int i = 0; i < 4; ++i) {
    auto fromPt = planeBoundsCam1[i];
    auto toPt = planeBoundsCam2[i];
    int g = i == 0 ? 127 : 0;  // Top line is orange.
    cv::line(
      *frame,
      cv::Point2d(fromPt.x(), fromPt.y()),
      cv::Point2d(toPt.x(), toPt.y()),
      cv::Scalar(0, g, 255),
      1);
  }

  // Draw the projected point.
  for (int i = 0; i < 4; ++i) {
    auto fromPt = planeBoundsCam2[i];
    auto toPt = planeBoundsCam2[(i + 1) % 4];
    int g = i == 0 ? 127 : 0;  // Top line is orange.
    cv::line(
      *frame,
      cv::Point2d(fromPt.x(), fromPt.y()),
      cv::Point2d(toPt.x(), toPt.y()),
      cv::Scalar(0, g, 255),
      5);
  }
}

void Imgproc::displayPointMatches(
  Vector<HPoint2> &cam1Points, Vector<HPoint2> &cam2Points, cv::Mat *frame) {
  for (int i = 0; i < cam2Points.size(); ++i) {
    cv::Point point1(round(cam1Points[i].x()), round(cam1Points[i].y()));
    cv::Point point2(round(cam2Points[i].x()), round(cam2Points[i].y()));
    cv::circle(*frame, point1, 5, cv::Scalar(255, 255, 0), 2);
    cv::circle(*frame, point2, 5, cv::Scalar(0, 255, 255), 2);
    cv::line(*frame, point1, point2, cv::Scalar(255, 0, 255), 2);
  }
}

void Imgproc::drawPoints(
  const Vector<HPoint2> &points, int radius, cv::Scalar color, cv::Mat *frame) {
  for (const auto &pt : points) {
    drawPoint(pt, radius, color, frame);
  }
}

void Imgproc::drawPoint(HPoint2 pt, int radius, cv::Scalar color, cv::Mat *frame) {
  cv::circle(*frame, cv::Point2d(pt.x(), pt.y()), radius, color);
}

void Imgproc::drawPoint(HPoint2 pt, int radius, cv::Scalar color, cv::Mat *frame, int thickness) {
  cv::circle(*frame, cv::Point2d(pt.x(), pt.y()), radius, color, thickness);
}

void Imgproc::drawPoly(const Poly2 &poly, int width, cv::Scalar color, cv::Mat *frame) {
  drawLines(poly.poly(), width, color, frame);
}

void Imgproc::drawLines(const Vector<Line2> &lines, int width, cv::Scalar color, cv::Mat *frame) {
  for (auto line : lines) {
    cv::line(
      *frame,
      cv::Point2d(line.start().x(), line.start().y()),
      cv::Point2d(line.end().x(), line.end().y()),
      color,
      width);
  }
}

void Imgproc::drawLines(
  const Vector<HPoint2> &fromPts,
  const Vector<HPoint2> &toPts,
  int width,
  cv::Scalar color,
  cv::Mat *frame) {
  for (int i = 0; i < fromPts.size(); ++i) {
    drawLine(fromPts[i], toPts[i], width, color, frame);
  }
}

void Imgproc::drawLine(HPoint2 fromPt, HPoint2 toPt, int width, cv::Scalar color, cv::Mat *frame) {
  cv::line(
    *frame, cv::Point2d(fromPt.x(), fromPt.y()), cv::Point2d(toPt.x(), toPt.y()), color, width);
}

void Imgproc::displayEstimatedHomography(
  const HMatrix &homography,
  const HMatrix &K,
  const HMatrix &extrinsic,
  const Vector<HPoint3> &pts3d,
  const Vector<HPoint2> &matchCam1,
  const Vector<HPoint2> &matchCam2,
  const Vector<uint8_t> &coplanar,
  cv::Mat *frame) {
  // TODO(nb): Move non-display logic to reality/engine/geometry.
  std::cout << "Initial homography mat is:" << std::endl << homography << std::endl;

  int numInPlane = 0;
  std::vector<cv::Point2d> cam1CoplanarPoints;
  std::vector<cv::Point2d> cam2CoplanarPoints;
  for (int i = 0; i < coplanar.size(); ++i) {
    if (!coplanar[i]) {
      continue;
    }
    ++numInPlane;

    cv::Point2d pt1(matchCam1[i].x(), matchCam1[i].y());
    cv::Point2d pt2(matchCam2[i].x(), matchCam2[i].y());

    cv::circle(*frame, pt2, 6, cv::Scalar(0, 127, 255), 2);
    cam1CoplanarPoints.push_back(pt1);
    cam2CoplanarPoints.push_back(pt2);
  }

  std::cout << numInPlane << " were in plane." << std::endl;
  if (numInPlane < 4) {
    return;
  }

  visualizeHomography(homography, frame);

  cv::Point3d coplanarCentroid;
  cv::Mat coplanar3dMatXY(numInPlane, 3, CV_64F);
  cv::Mat coplanar3dMatZ(numInPlane, 1, CV_64F);
  int j = 0;
  for (int i = 0; i < coplanar.size(); ++i) {
    if (!coplanar[i]) {
      continue;
    }

    cv::Point3d pt(pts3d[i].x(), pts3d[i].y(), pts3d[i].z());

    coplanar3dMatXY.at<double>(j, 0) = pt.x;
    coplanar3dMatXY.at<double>(j, 1) = pt.y;
    coplanar3dMatXY.at<double>(j, 2) = 1;
    coplanar3dMatZ.at<double>(j, 0) = pt.z;
    j++;

    coplanarCentroid += pt;
  }
  coplanarCentroid /= numInPlane;

  double distToCentroid = 0;
  for (int i = 0; i < coplanar.size(); ++i) {
    if (!coplanar[i]) {
      continue;
    }

    cv::Point3d pt(pts3d[i].x(), pts3d[i].y(), pts3d[i].z());
    cv::Point3d dist = pt - coplanarCentroid;
    distToCentroid += cv::sqrt(dist.x * dist.x + dist.y * dist.y + dist.z * dist.z);
  }
  distToCentroid /= numInPlane;

  cv::Mat plane =
    (coplanar3dMatXY.t() * coplanar3dMatXY).inv() * coplanar3dMatXY.t() * coplanar3dMatZ;

  for (int i = 0; i < coplanar.size(); ++i) {
    if (!coplanar[i]) {
      continue;
    }

    cv::Point3d pt(pts3d[i].x(), pts3d[i].y(), pts3d[i].z());
    double estZ =
      plane.at<double>(0, 0) * pt.x + plane.at<double>(0, 1) * pt.y + plane.at<double>(0, 2);
    std::cout << "Estimated " << estZ << " for pt.z " << pt.z << " (" << pt.z - estZ << ")"
              << std::endl;
  }

  cv::Point3d planeNormal(-plane.at<double>(0, 0), -plane.at<double>(1, 0), 1);
  planeNormal = planeNormal
    * (distToCentroid
       / cv::sqrt(
         planeNormal.x * planeNormal.x + planeNormal.y * planeNormal.y
         + planeNormal.z * planeNormal.z));

  std::cout << "Got coplanar points (XY):" << std::endl
            << coplanar3dMatXY << std::endl
            << "Got coplanar points (Z):" << std::endl
            << coplanar3dMatZ << std::endl
            << "Got plane:" << std::endl
            << plane << std::endl
            << "distToCentroid: " << distToCentroid << std::endl
            << "Got planeNormal:" << std::endl
            << planeNormal << std::endl
            << "Got centroid mat:" << std::endl
            << coplanarCentroid << std::endl;

  std::vector<cv::Point3d> normalVec3d;
  normalVec3d.push_back(coplanarCentroid);
  normalVec3d.push_back(coplanarCentroid - planeNormal);

  HMatrix cam2 = K * extrinsic.inv();

  cv::Mat normalVec4d;
  cv::convertPointsToHomogeneous(normalVec3d, normalVec4d);
  normalVec4d = normalVec4d.reshape(1).t();
  std::cout << "Got normalVec4d " << normalVec4d.rows << "x" << normalVec4d.cols << ":" << std::endl
            << normalVec4d << std::endl;

  cv::Mat cvCam2;
  cv::Mat(toMatx(cam2)).rowRange(0, 3).convertTo(cvCam2, CV_64F);
  cv::Mat normalVec2dHomogeneous = (cvCam2 * normalVec4d).t();
  std::cout << "Got normalVec2dHomogeneous " << normalVec2dHomogeneous.rows << "x"
            << normalVec2dHomogeneous.cols << ":" << std::endl
            << normalVec2dHomogeneous << std::endl;

  std::vector<cv::Point2d> normalVec2d;
  cv::convertPointsFromHomogeneous(normalVec2dHomogeneous, normalVec2d);

  std::cout << "Got normalVec2d:" << std::endl << normalVec2d << std::endl;

  for (int i = 0; i < coplanar.size(); ++i) {
    if (!coplanar[i]) {
      continue;
    }
    cv::line(
      *frame,
      cv::Point(matchCam2[i].x(), matchCam2[i].y()),
      normalVec2d[0],
      cv::Scalar(0, 127, 255),
      1);
  }
  cv::circle(*frame, normalVec2d[0], 10, cv::Scalar(0, 0, 255), 3);
  cv::line(*frame, normalVec2d[0], normalVec2d[1], cv::Scalar(0, 0, 255), 3);
}

void Imgproc::warpHomography(
  const HMatrix &homography, const cv::Mat &frame, cv::Mat *warpedFrame) {
  cv::Mat p(toMatx33d(homography));
  cv::Mat s = cv::Mat::eye(3, 3, CV_64F);
  s.at<double>(0, 0) = 1.0 / 10.0;
  s.at<double>(1, 1) = 1.0 / 10.0;
  cv::Mat t = cv::Mat::eye(3, 3, CV_64F);
  t.at<double>(0, 2) = frame.cols / 2;
  t.at<double>(1, 2) = frame.rows / 2;

  cv::warpPerspective(
    frame,
    *warpedFrame,
    t * s * p,
    frame.size(),
    cv::INTER_LINEAR,
    cv::BORDER_CONSTANT,
    cv::Scalar(127, 127, 127));
}

void Imgproc::drawCompass(const HMatrix &extrinsic, const HMatrix &intrinsic, cv::Mat *frame) {
  Vector<HPoint3> compassPoints;
  Vector<cv::Scalar> colors;
  for (int x = -7; x <= 7; ++x) {
    for (int z = -7; z <= 7; ++z) {
      compassPoints.push_back(HPoint3(static_cast<float>(x), -1.0f, static_cast<float>(z)));
      if (x < 0 && z < 0) {
        // bottom left: green: 106, 168, 79
        colors.push_back(cv::Scalar(79, 168, 106));
      } else if (x == 0 && z < 0) {
        // back: dark red: 151, 26, 0
        colors.push_back(cv::Scalar(0, 26, 151));
      } else if (x > 0 && z < 0) {
        // bottom right: blue: 109, 158, 235
        colors.push_back(cv::Scalar(235, 158, 109));
      } else if (x < 0 && z == 0) {
        // left: dark blue: 29, 11, 226
        colors.push_back(cv::Scalar(226, 11, 29));
      } else if (x > 0 && z == 0) {
        // right: dark yellow: 212, 148, 21
        colors.push_back(cv::Scalar(21, 148, 212));
      } else if (x < 0 && z > 0) {
        // top left: yellow: 255, 217, 102
        colors.push_back(cv::Scalar(102, 217, 255));
      } else if (x > 0 && z > 0) {
        // top right: red: 204, 65, 37
        colors.push_back(cv::Scalar(37, 65, 204));
      } else {
        // front: purple: 138, 0, 203
        colors.push_back(cv::Scalar(203, 0, 138));
      }
    }
  }

  Vector<HPoint3> ptsInCameraFrame = extrinsic.inv() * compassPoints;
  Vector<HPoint2> ptsInCamera = flatten<2>(intrinsic * ptsInCameraFrame);

  for (int i = 0; i < compassPoints.size(); ++i) {
    if (ptsInCameraFrame[i].z() < 0) {
      continue;
    }
    if (ptsInCamera[i].x() < 0 || ptsInCamera[i].x() > frame->cols) {
      continue;
    }
    if (ptsInCamera[i].y() < 0 || ptsInCamera[i].y() > frame->rows) {
      continue;
    }

    Imgproc::drawPoint(ptsInCamera[i], 6, cv::Scalar(200, 200, 200), frame);
    Imgproc::drawPoint(ptsInCamera[i], 5, cv::Scalar(55, 55, 55), frame);
    Imgproc::drawPoint(ptsInCamera[i], 4, colors[i], frame);
    Imgproc::drawPoint(ptsInCamera[i], 3, colors[i], frame);
    Imgproc::drawPoint(ptsInCamera[i], 2, colors[i], frame);
    Imgproc::drawPoint(ptsInCamera[i], 1, colors[i], frame);
  }
}

void Imgproc::drawAxis(
  const HMatrix &K, const HMatrix &pose, HPoint3 origin, float len, cv::Mat *view) {
  drawAxis(K, pose, origin, len, cv::Scalar(255, 0, 255), view);
}

void Imgproc::drawAxis(
  const HMatrix &K,
  const HMatrix &pose,
  HPoint3 origin,
  float len,
  const cv::Scalar color,
  cv::Mat *view) {
  auto ox = origin.x();
  auto oy = origin.y();
  auto oz = origin.z();
  auto lx = ox + len;
  auto ly = oy + len;
  auto lz = oz + len;
  Vector<HPoint3> axes{
    HPoint3(ox, oy, oz),
    HPoint3(lx, oy, oz),
    HPoint3(ox, ly, oz),
    HPoint3(ox, oy, lz),
  };

  auto axesInCam = pose.inv() * axes;
  auto axesImage = flatten<2>(K * axesInCam);

  Vector<HPoint2> lineStarts{axesImage[0], axesImage[0]};
  Vector<HPoint2> lineEnds{axesImage[1], axesImage[2]};

  if (axesInCam[3].z() > 0) {
    lineStarts.push_back(axesImage[0]);
    lineEnds.push_back(axesImage[3]);
  }

  drawLines(lineStarts, lineEnds, 3, color, view);
}
