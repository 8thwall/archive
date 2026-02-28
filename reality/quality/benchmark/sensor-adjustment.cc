// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Akul Gupta (akulgupta@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  hdrs = {
    "sensor-adjustment.h",
  };
  deps = {
    "//c8:vector",
    "//reality/engine/api/response:features.capnp-cc",
    "//c8/io:capnp-messages",
    "//reality/engine/api:reality.capnp-cc",
  };
}
cc_end(0xf3087f6d);

#include "reality/quality/benchmark/sensor-adjustment.h"

namespace c8 {

void setEventsOnFrame(
  const Vector<ConstRootMessage<RequestPose>> &eventQueues,
  RealityRequest::Builder realityRequest) {
  MutableRootMessage<RequestPose> allSensorEvents;
  int totalEvents = 0;
  for (const auto &e : eventQueues) {
    totalEvents += e.reader().getEventQueue().size();
  }
  allSensorEvents.builder().initEventQueue(totalEvents);

  int index = 0;
  for (int i = 0; i < eventQueues.size(); i++) {
    auto savedEventQueue = eventQueues[i].reader().getEventQueue();
    for (int j = 0; j < savedEventQueue.size(); j++) {
      allSensorEvents.builder().getEventQueue().setWithCaveats(index, savedEventQueue[j]);
      index++;
    }
  }

  // Set all previous and current events on this frame.
  realityRequest.getSensors().getPose().setEventQueue(allSensorEvents.reader().getEventQueue());
}

}  // namespace c8
