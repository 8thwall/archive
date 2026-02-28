// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Riyaan Bakhda (riyaanbakhda@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "log-record-reader.h",
  };
  deps = {
    "//c8/io:capnp-messages",
    "//c8/protolog/api:log-request.capnp-cc",
    "//c8:c8-log",
  };
}
cc_end(0xecac49f5);
