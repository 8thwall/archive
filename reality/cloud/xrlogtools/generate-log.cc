// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Pooja Bansal (pooja@8thwall.com)

#include "bzl/inliner/rules.h"

cc_binary {
  deps = {
    "//bzl/inliner:rules",
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8/io:capnp-messages",
    "//c8/protolog/api:log-request.capnp-cc",
  };
}

#include <unistd.h>
#include <mutex>
#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/io/capnp-messages.h"
#include "c8/protolog/api/log-request.capnp.h"
#include "capnp/serialize.h"

using MutableLogServiceRequest = c8::MutableRootMessage<c8::LogServiceRequest>;

using namespace c8;

int main(int argc, char *argv[]) {
  // Create a File Handler.
  int fd = STDOUT_FILENO;

  // Create a message.
  MutableLogServiceRequest message;
  auto messageBuilder = message.builder();
  messageBuilder.initRecords(1);
  auto recordData = messageBuilder.getRecords()[0];
  recordData.getHeader().getApp().setAppId("1");
  recordData.getHeader().getDevice().setDeviceId("1");
  recordData.getHeader().getReality().setEngineId(RealityEngineLogRecordHeader::EngineType::C8);
  recordData.getHeader().getReality().getFrameId().setSessionId(5);
  recordData.getHeader().getReality().getFrameId().setTrackId(15);
  recordData.getHeader().getReality().getFrameId().setFrameId(115);

  // Write to the file.
  capnp::writeMessageToFd(fd, *(message.message()));
  return 0;
}
