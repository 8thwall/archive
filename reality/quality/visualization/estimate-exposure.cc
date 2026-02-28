// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Pooja Bansal (pooja@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  visibility = {
    "//reality/engine/executor:__subpackages__",
    "//reality/engine/lighting:__subpackages__",
    "//reality/quality:__subpackages__",
  };
  deps = {
    "//c8:task-queue",
    "//c8:thread-pool",
    "//c8/pixels:pixels",
    "//reality/engine/lighting:lighting-estimator",
    "//reality/quality/visualization/protolog:log-record-capture",
    "//reality/app/xr/capnp:xr-capnp",
    "@opencv//:core",
    "@opencv//:highgui",
    "@opencv//:videoio",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
}
cc_end(0x43b1a139);

#include <iostream>
#include <opencv2/core.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/videoio.hpp>

#include "c8/pixels/pixels.h"
#include "c8/task-queue.h"
#include "c8/thread-pool.h"
#include "reality/app/xr/capnp/xr-capnp.h"
#include "reality/engine/lighting/lighting-estimator.h"
#include "c8/stats/scope-timer.h"
#include "reality/quality/visualization/protolog/log-record-capture.h"

using namespace c8;

int main(int argc, char *argv[]) {
  XRCapnpSensors sensors;
  auto cap = LogRecordCapture::create("");
  bool frameByFrame = true;
  std::cout << "Capturing frame.." << std::endl;
  std::cout << "Press Ctrl+c to exit." << std::endl;
  while (cap->read(&sensors)) {
    // Currently this demo assumes there is a camera frame, so just skip records without one.
    if (
      sensors.yBuffer == nullptr
      || !sensors.requestMessage->reader().getSensors().getCamera().getCurrentFrame().hasImage()) {
      continue;
    }

    YPlanePixels srcY = sensors.yBuffer->pixels();
    cv::Mat yMat(srcY.rows(), srcY.cols(), CV_8UC1, srcY.pixels(), srcY.rowBytes());
    ScopeTimer t("estimate-exposure");
    TaskQueue taskQueue;
    ThreadPool threadPool(1);
    float val =
      LightingEstimator::estimateLighting(srcY, &taskQueue, &threadPool, 1);
    // Display the frame generated.
    std::cout << "Exposure: " << val << std::endl;
    cv::imshow("cam", yMat);
    if (frameByFrame) {
      for (;;) {
        int key = cv::waitKey(1);
        if (key > 0 && key < 255) {
          break;
        }
      }
    }

    int key = cv::waitKey(1);
    if (key > 0 && key < 255) {
      break;
    }
  }
  return 0;
}
