// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Pooja Bansal (pooja@8thwall.com)

#include "bzl/inliner/rules.h"

cc_binary {
  deps = {
    "//bzl/inliner:rules",
    "//c8/protolog/api:log-request.capnp-cc",
    "//c8:c8-log-proto",
    "//c8:c8-log",
  };
}

#include <fcntl.h>
#include <unistd.h>
#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/protolog/api/log-request.capnp.h"
#include "capnp/serialize.h"

using namespace c8;

int main(int argc, char *argv[]) {
  int fd = STDIN_FILENO;
  // Read the file
  capnp::StreamFdMessageReader message(fd);
  auto messageReader = message.getRoot<LogServiceRequest>();

  // Print to console or to file if the name is specified in the command line.
  C8LogCapnpMessage(messageReader);

  return 0;
}
