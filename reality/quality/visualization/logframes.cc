// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//reality/quality/visualization/render:expanded-reality",
    "//reality/quality/visualization/protolog:log-record-capture",
    "@opencv//:core",
    "@opencv//:highgui",
  };
  linkopts = {
    "-framework AVFoundation", "-framework Cocoa",
  };
}
cc_end(0xa7f4efd9);

#include <opencv2/core.hpp>
#include <opencv2/highgui.hpp>
#include "c8/c8-log.h"
#include "reality/quality/visualization/render/expanded-reality.h"
#include "reality/quality/visualization/protolog/log-record-capture.h"

using namespace c8;

int main(int argc, char *argv[]) {
  std::unique_ptr<LogRecordCapture>cap(LogRecordCapture::create(""));

  cv::Mat colorFrame;
  XRCapnpSensors sensors;
  int f = 0;
  while (cap->read(&sensors)) {
    C8Log("[logframes] Processing frame %d", ++f);
    renderFrameForDisplay(sensors, &colorFrame);
    cv::imshow("frame", colorFrame);
    cv::waitKey(50);
  }

  return 0;
}
