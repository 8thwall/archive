// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "text-hud.h",
  };
  deps = {
    ":imgproc",
    "//c8:c8-log",
    "//c8:hpoint",
    "@opencv//:core",
    "@opencv//:imgproc",
    "@opencv//:highgui",
  };
}
cc_end(0xe09bde1d);

#include <opencv2/imgproc.hpp>
#include "reality/quality/visualization/render/text-hud.h"
#include "c8/c8-log.h"

namespace c8 {

TextHud::TextHud(int width, int height) : width_(width), height_(height) {}

void TextHud::addTopLeft(
  const std::string &id, const cv::Scalar &bgColor, const cv::Scalar &fgColor) {
  idToWidget_.emplace(std::make_pair(id, topLeftWidgets_.size()));
  topLeftWidgets_.push_back({id, bgColor, fgColor});
}

void TextHud::setValue(const std::string &id, const std::string &txt) {
  // TODO(dat): Support more than one location
  topLeftWidgets_[idToWidget_.at(id)].text = txt;
}

void TextHud::setBgColor(const std::string &id, const cv::Scalar &color) {
  // TODO(dat): Support more than one location
  topLeftWidgets_[idToWidget_.at(id)].bgColor = color;
}

cv::Mat TextHud::draw(const cv::Mat &img, float opacity) const {
  if (opacity < 0 || opacity > 1) {
    opacity = 1;
  }

  if (opacity == 0) {
    return img;
  }

  cv::Mat fullOverlay = img.clone();

  // Draw each widget onto the full overlay
  int leftShift = 0;
  for (const auto &widget : topLeftWidgets_) {
    int baseline = 0;
    cv::Size textSize = cv::getTextSize(widget.text, fontFace_, fontScale_, thickness_, &baseline);
    baseline += thickness_;
    // TODO(dat): Support centering the text

    // Draw the background box
    cv::Point textLoc(leftShift, 0);
    cv::Point textLocBaseline = textLoc + cv::Point(0, baseline);
    cv::rectangle(
      fullOverlay,
      textLoc,
      textLoc + cv::Point(textSize.width, textSize.height),
      widget.bgColor,
      cv::FILLED);
    cv::putText(
      fullOverlay,
      widget.text,
      textLoc + cv::Point(0, textSize.height),
      fontFace_,
      fontScale_,
      widget.fgColor,
      thickness_,
      8);

    leftShift += textSize.width;
  }

  // Add the full overlay back to the original to create transparency
  cv::addWeighted(fullOverlay, opacity, img, 1 - opacity, 0, fullOverlay);
  return fullOverlay;
}
}  // namespace c8
