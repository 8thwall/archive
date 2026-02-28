// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "ui2.h",
  },
  deps = {
    "//c8:map",
    "//c8:string",
    "//c8:vector",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "@opencv//:core",
    "@opencv//:highgui",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
  visibility = {
    "//apps/client/internalqa:__subpackages__",
    "//reality/quality:__subpackages__",
  };
}
cc_end(0x10b3c041);

#include "reality/quality/visualization/render/ui2.h"

#include <opencv2/core.hpp>
#include <opencv2/highgui.hpp>
#include "c8/map.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"

namespace c8 {

namespace {

void staticHandleClick(int event, int x, int y, int flags, void *userdata);

struct UiData {
  Vector<std::unique_ptr<String>> windowNames;
  TreeMap<String, Vector<Ui2Click>> windowTouches;
  TreeMap<String, Vector<Ui2Click>> bufferedWindowTouches;
  std::mutex touchesLock;

  // Store info about mouse clicks for the main thread.
  void handleClick(int event, int x, int y, int flags, void *userdata) {
    if (event != cv::EVENT_LBUTTONDOWN && event != cv::EVENT_RBUTTONDOWN) {
      return;
    }

    std::lock_guard<std::mutex> lock(touchesLock);
    const String &windowName = *reinterpret_cast<String *>(userdata);
    Ui2Click::Type type =
      event == cv::EVENT_LBUTTONDOWN ? Ui2Click::Type::PRIMARY_CLICK : Ui2Click::Type::SECONDARY_CLICK;
    windowTouches[windowName].push_back({type, x, y});
  }

  void ensureTouchCallback(const String &windowName) {
    std::lock_guard<std::mutex> lock(touchesLock);
    if (windowTouches.find(windowName) != windowTouches.end()) {
      return;
    }

    windowNames.emplace_back(new String(windowName));
    cv::setMouseCallback(windowName, staticHandleClick, windowNames.back().get());
    windowTouches[windowName] = {};
  }

  void flushTouches() {
    std::lock_guard<std::mutex> lock(touchesLock);
    bufferedWindowTouches = windowTouches;
    for (auto &wt : windowTouches) {
      wt.second.clear();
    }
  }

  Vector<Ui2Click> touchesForWindow(const String &windowName) {
    return bufferedWindowTouches[windowName];
  }
};

UiData &data() {
  static UiData data;
  return data;
}

void staticHandleClick(int event, int x, int y, int flags, void *userdata) {
  data().handleClick(event, x, y, flags, userdata);
}

}

void show(const String &windowName, ConstRGBA8888PlanePixels im) {
  ScopeTimer t("show");
  BGRA8888PlanePixelBuffer b(im.rows(), im.cols());
  auto i = b.pixels();
  rgbaToBgra(im, &i);
  cv::Mat displayImage(i.rows(), i.cols(), CV_8UC4, i.pixels(), i.rowBytes());
  cv::imshow(windowName, displayImage);
  data().ensureTouchCallback(windowName);
}

void show(const String &windowName, ConstRGB888PlanePixels im) {
  ScopeTimer t("show");
  BGR888PlanePixelBuffer b(im.rows(), im.cols());
  auto i = b.pixels();
  rgbToBgr(im, &i);
  cv::Mat displayImage(i.rows(), i.cols(), CV_8UC3, i.pixels(), i.rowBytes());
  cv::imshow(windowName, displayImage);
  data().ensureTouchCallback(windowName);
}

void show(const String &windowName, ConstYPlanePixels im) {
  cv::Mat displayImage(
    im.rows(), im.cols(), CV_8UC1, const_cast<uint8_t *>(im.pixels()), im.rowBytes());
  cv::imshow(windowName, displayImage);
  data().ensureTouchCallback(windowName);
}


void show(const String &windowName, OneChannelPixels im) {
  cv::Mat displayImage(
    im.rows(), im.cols(), CV_8UC1, const_cast<uint8_t *>(im.pixels()), im.rowBytes());
  cv::imshow(windowName, displayImage);
  data().ensureTouchCallback(windowName);
}

int waitKey(int keyValue) {
  int key = cv::waitKey(keyValue);
  data().flushTouches();
  return key;
}

Vector<Ui2Click> clicksOnWindow(const String &windowName) { return data().touchesForWindow(windowName); }

}  // namespace c8
