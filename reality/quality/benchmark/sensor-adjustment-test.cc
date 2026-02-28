// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Akul Gupta (akulgupta@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    "//reality/quality/benchmark:sensor-adjustment",
    "@com_google_googletest//:gtest_main",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0x7d9ea68a);

#include <gtest/gtest.h>

#include "reality/quality/benchmark/sensor-adjustment.h"

namespace c8 {

class SensorAdjustmentTest : public ::testing::Test {};

namespace {

// Creates a RequestPose by adding RawPositionalSensorValues to the event queue, setting the
// timestampNanos field on the RawPositionalSensorValues struct.
MutableRootMessage<RequestPose> createPose(int numEvents, int64_t eventTimeNanos) {
  MutableRootMessage<RequestPose> rp;
  auto eqBuilder = rp.builder().initEventQueue(numEvents);
  for (int i = 0; i < numEvents; i++) {
    eqBuilder[i].setTimestampNanos(eventTimeNanos);
  }
  return rp;
}
}  // namespace

TEST_F(SensorAdjustmentTest, SetEventsOnFrame) {
  Vector<ConstRootMessage<RequestPose>> savedEventQueues;

  auto pose1 = createPose(1, 1);  // pose.eventQueue = {1}
  savedEventQueues.push_back(ConstRootMessage<RequestPose>(pose1.reader()));
  auto pose2 = createPose(2, 2);  // pose.eventQueue = {2,2}
  savedEventQueues.push_back(ConstRootMessage<RequestPose>(pose2.reader()));
  auto pose3 = createPose(3, 3);  // pose.eventQueue = {3,3,3}
  savedEventQueues.push_back(ConstRootMessage<RequestPose>(pose3.reader()));

  MutableRootMessage<RealityRequest> realityRequest{};
  EXPECT_EQ(0, realityRequest.reader().getSensors().getPose().getEventQueue().size());

  setEventsOnFrame(savedEventQueues, realityRequest.builder());
  auto concatedEventQueue = realityRequest.reader().getSensors().getPose().getEventQueue();

  // Same number of events.
  EXPECT_EQ(6, concatedEventQueue.size());

  // Order and value preserved. concatedEventQueue = {1,2,2,3,3,3}
  EXPECT_EQ(1, concatedEventQueue[0].getTimestampNanos());
  EXPECT_EQ(2, concatedEventQueue[1].getTimestampNanos());
  EXPECT_EQ(2, concatedEventQueue[2].getTimestampNanos());
  EXPECT_EQ(3, concatedEventQueue[3].getTimestampNanos());
  EXPECT_EQ(3, concatedEventQueue[4].getTimestampNanos());
  EXPECT_EQ(3, concatedEventQueue[5].getTimestampNanos());
}

}  // namespace c8
