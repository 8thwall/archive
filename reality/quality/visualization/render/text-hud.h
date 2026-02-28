// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)
//
// Draw text on the canvas

#pragma once
#include <opencv2/core.hpp>
#include <unordered_map>
#include "c8/hpoint.h"

namespace {
struct TextWidget {
  std::string text;
  cv::Scalar bgColor;
  cv::Scalar fgColor;
  // TextWidget(const std::string &t) : text(t) {}
};
}  // namespace

namespace c8 {

/**
 * Draw a HUD on top of an image with opacity support.
 * The HUD can only contain text elements.
 *
 * Currently only support the top left corner
 */
class TextHud {
public:
  // Make a copy of left and right image and put them into a single image
  TextHud(int width, int height);

  void addTopLeft(
    const std::string &id,
    const cv::Scalar &bgColor = cv::Scalar(0, 0, 255),
    const cv::Scalar &fgColor = cv::Scalar::all(255));
  void setValue(const std::string &id, const std::string &txt);
  void setBgColor(const std::string &id, const cv::Scalar &color);

  cv::Mat draw(const cv::Mat &img, float opacity = 0.5f) const;

  // No moving, no copying
  TextHud(TextHud &&) = delete;
  TextHud &operator=(TextHud &&) = delete;
  TextHud(TextHud &) = delete;
  TextHud &operator=(TextHud &) = delete;

private:
  int width_;
  int height_;
  int fontFace_ = cv::FONT_HERSHEY_DUPLEX;
  double fontScale_ = 0.4;
  int thickness_ = 1;

  std::vector<TextWidget> topLeftWidgets_;
  std::unordered_map<std::string, int> idToWidget_;
};
}  // namespace c8
