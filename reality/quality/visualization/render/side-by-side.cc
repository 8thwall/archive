// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "side-by-side.h",
  };
  deps = {
    ":imgproc",
    "//c8:hpoint",
    "@opencv//:core",
    "@opencv//:imgproc",
    "@opencv//:highgui",
  };
}
cc_end(0xc1a2a46d);

#include "reality/quality/visualization/render/side-by-side.h"
#include <opencv2/imgproc.hpp>

namespace c8 {
SideBySide::SideBySide(const cv::Mat &left, const cv::Mat &right) {
  full_.create(std::max(left.rows, right.rows), left.cols + right.cols, left.type());
  left_ = full_.rowRange(0, left.rows).colRange(0, left.cols);
  right_ = full_.rowRange(0, right.rows).colRange(left.cols, left.cols + right.cols);
  left.copyTo(left_);
  right.copyTo(right_);
  leftWidth_ = left.cols;
}

void SideBySide::drawPointMatches(const Vector<HPoint2> &cam1Points, const Vector<HPoint2> &cam2Points) {
  for (int i = 0; i < cam2Points.size(); ++i) {
    cv::Point point1(round(cam1Points[i].x()), round(cam1Points[i].y()));
    cv::Point point2(round(cam2Points[i].x()), round(cam2Points[i].y()));
    cv::circle(left_, point1, 5, cv::Scalar(255, 255, 0), 2);
    cv::circle(right_, point2, 5, cv::Scalar(0, 255, 255), 2);

    cv::Point point2InFull(point2.x + leftWidth_, point2.y);
    cv::line(full_, point1, point2InFull, cv::Scalar(255, 0, 255), 2);
  }
}

void SideBySide::drawPointMatchesSingle(const Vector<HPoint2> &cam1Points, const Vector<HPoint2> &cam2Points, bool right) {
  auto cam = right ? right_ : left_;
  for (int i = 0; i < cam2Points.size(); ++i) {
    cv::Point point1(round(cam1Points[i].x()), round(cam1Points[i].y()));
    cv::Point point2(round(cam2Points[i].x()), round(cam2Points[i].y()));
    cv::circle(cam, point1, 5, cv::Scalar(255, 255, 0), 2);
    cv::circle(cam, point2, 5, cv::Scalar(0, 255, 255), 2);

    cv::Point point2InFull(point2.x, point2.y);
    cv::line(cam, point1, point2InFull, cv::Scalar(255, 0, 255), 2);
  }
}

}  // namespace c8
