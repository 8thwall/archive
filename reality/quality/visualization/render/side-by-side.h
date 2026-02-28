// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)
//
// Creating and maintaining side-by-side image

#pragma once
#include <opencv2/core.hpp>
#include "c8/hpoint.h"
namespace c8 {
class SideBySide {
public:
  // Make a copy of left and right image and put them into a single image
  SideBySide(const cv::Mat &left, const cv::Mat &right);

  cv::Mat& left() { return left_;}
  const cv::Mat& left() const { return left_;}
  cv::Mat& right() { return right_;}
  const cv::Mat& right() const { return right_;}
  cv::Mat& full() { return full_;}
  const cv::Mat& full() const { return full_;}

  void drawPointMatches(const Vector<HPoint2> &cam1Points, const Vector<HPoint2> &cam2Points);
  void drawPointMatchesSingle(const Vector<HPoint2> &cam1Points, const Vector<HPoint2> &cam2Points, bool right);

  // Make a copy of the sxs image
  SideBySide(const SideBySide &other) : SideBySide(other.left(), other.right()) {}
  SideBySide &operator=(const SideBySide &other) {
    SideBySide(other.left(), other.right());
    return *this;
  } 

  // No moving 
  SideBySide(SideBySide &&) = delete;
  SideBySide &operator=(SideBySide &&) = delete;
private:
  cv::Mat full_;
  cv::Mat left_;
  cv::Mat right_;
  int leftWidth_;
};
}  // namespace c8
