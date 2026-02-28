// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "readpng.h",
  };
  deps = {
    "//c8:exceptions",
    "//c8:string",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "@opencv//:core",
    "@opencv//:imgcodecs",
  };
}
cc_end(0x006ed7e3);

#include "readpng.h"

#include <opencv2/core.hpp>
#include <opencv2/imgcodecs.hpp>
#include "c8/exceptions.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/stats/scope-timer.h"

using namespace c8;

RGBA8888PlanePixelBuffer c8::readPng(const String &filename) {
  cv::Mat png = cv::imread(filename);
  if (png.rows == 0 || png.cols == 0) {
    C8_THROW("Invalid png file: " + filename);
  }
  BGR888PlanePixels pixels(png.rows, png.cols, png.step, png.ptr(0));

  RGBA8888PlanePixelBuffer ret(png.rows, png.cols);
  auto retpix = ret.pixels();

  ScopeTimer t("opencv-read-png");
  bgrToRgba(pixels, &retpix);

  return ret;
}

void c8::writePng(const String &filename, ConstRGBA8888PlanePixels pixels) {
  BGR888PlanePixelBuffer bgrbuf(pixels.rows(), pixels.cols());
  auto p = bgrbuf.pixels();

  ScopeTimer t("opencv-write-png");
  rgbaToBgr(pixels, &p);

  cv::Mat png(p.rows(), p.cols(), CV_8UC3, p.pixels(), p.rowBytes());

  cv::imwrite(filename, png);
}
