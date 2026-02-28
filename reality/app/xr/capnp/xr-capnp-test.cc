// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":xr-capnp",
    "@com_google_googletest//:gtest_main",
    "@opencv//:core",
  };
}
cc_end(0x6d989d79);

#include "reality/app/xr/capnp/xr-capnp.h"

#include <gtest/gtest.h>
#include <opencv2/core/core.hpp>
#include "c8/protolog/xr-requests.h"

namespace c8 {

class XRCapnpTest : public ::testing::Test {};

TEST_F(XRCapnpTest, GetSensorTest) {
  XRCapnp rEngine(XRCapnpConfiguration(true, false, false));

  XRCapnpSensors sensors;
  sensors.yBuffer.reset(new YPlanePixelBuffer(80, 80));

  auto srcY = sensors.yBuffer->pixels();
  cv::Mat yWrapper(srcY.rows(), srcY.cols(), CV_8UC1, srcY.pixels(), srcY.rowBytes());
  yWrapper = 255;
  yWrapper.rowRange(40, 80) = 0;

  auto cameraBuilder = sensors.requestMessage->builder().getSensors().getCamera();
  setCameraPixelPointers(sensors.yBuffer->pixels(), sensors.uvBuffer->pixels(), &cameraBuilder);

  XRCapnpReality reality;
  rEngine.pushRealityForward(sensors, &reality);
  EXPECT_EQ(127.5, reality.xrResponse.reader().getSensorTest().getCamera().getMeanPixelValue());
}

}  // namespace c8
