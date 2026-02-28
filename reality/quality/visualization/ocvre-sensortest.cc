// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//reality/app/xr/capnp:xr-capnp",
    "//reality/quality/visualization/protolog:log-record-capture",
    "//reality/quality/visualization/render:expanded-reality",
    "@opencv//:core",
    "@opencv//:highgui",
    "@opencv//:videoio",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
}
cc_end(0x13d24221);

#include <iostream>
#include <memory>
#include <opencv2/core.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/videoio.hpp>

#include "reality/app/xr/capnp/xr-capnp.h"
#include "reality/quality/visualization/protolog/log-record-capture.h"
#include "reality/quality/visualization/render/expanded-reality.h"

using namespace c8;

// Takes serialized capnp sensor data from stdin and echoes a minimum subset of the sensor data
// sufficient to demonstrate that it was properly deserialized, passed into the reality engine,
// processed in the reality engine, passed back out through the api, and returned to the caller.
//
// e.g.
//
// bazel-bin/reality/quality/visualization/ocvre-sensortest < ~/android-hq.capnpbin
//
// or
//
// bazel-bin/apps/server/logservice/main | bazel-bin/reality/quality/visualization/ocvre-sensortest
int main(int argc, char *argv[]) {
  std::unique_ptr<LogRecordCapture> cap(LogRecordCapture::create(""));

  cv::Mat frame;
  XRCapnpConfiguration config(true, false, false);
  config.disableExperimental = true;
  XRCapnp engine(std::move(config));

  XRCapnpSensors sensors;
  XRCapnpReality reality;
  int f = 0;
  while (cap->read(&sensors)) {
    // Currently this demo assumes there is a camera frame, so just skip records without one.
    if (
      sensors.yBuffer == nullptr
      || !sensors.requestMessage->reader().getSensors().getCamera().getCurrentFrame().hasImage()) {
      continue;
    }

    double sensorTestCameraMeanPixelValue =
      reality.xrResponse.reader().getSensorTest().getCamera().getMeanPixelValue();
    auto stpDevicePose = reality.xrResponse.reader().getSensorTest().getPose().getDevicePose();
    auto stpDeviceAcc =
      reality.xrResponse.reader().getSensorTest().getPose().getDeviceAcceleration();
    Quaternion sensorTestPoseDevicePose(
      stpDevicePose.getW(), stpDevicePose.getX(), stpDevicePose.getY(), stpDevicePose.getZ());
    HPoint3 sensorTestPoseDeviceAcceleration(
      stpDeviceAcc.getX(), stpDeviceAcc.getY(), stpDeviceAcc.getZ());

    engine.pushRealityForward(sensors, &reality);
    renderFrameForDisplay(sensors, &frame);
    std::cout << "Processing frame " << ++f
              << "; had mean pixel: " << sensorTestCameraMeanPixelValue
              << "; pose: " << sensorTestPoseDevicePose
              << "; acceleration: " << sensorTestPoseDeviceAcceleration << std::endl;
    cv::imshow("frame", frame);
    cv::waitKey(10);
  }

  return 0;
}
