// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "capnp-bytes-reader.h",
  };
  deps = {
    "//c8/io:capnp-messages",
    "//c8/protolog:xr-extern",
    "@capnproto//:capnp-lib",
  };
}
cc_end(0x09c555c7);

#include "reality/quality/visualization/protolog/capnp-bytes-reader.h"

namespace c8 {

CapnpBytesReader *CapnpBytesReader::wrap(c8_NativeByteArray data) {
  return new CapnpBytesReader(data);
}

CapnpBytesReader::CapnpBytesReader(c8_NativeByteArray data)
    : arraystream(
        kj::ArrayPtr<const capnp::byte>(static_cast<const capnp::byte *>(data.bytes), data.size)),
      stream(arraystream) {}

}  // namespace c8
