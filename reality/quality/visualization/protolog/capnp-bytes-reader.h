// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <capnp/message.h>
#include <capnp/serialize.h>
#include <kj/io.h>

#include "c8/io/capnp-messages.h"
#include "c8/protolog/xr-extern.h"

namespace c8 {

class CapnpBytesReader {
public:
  // Read from the provided logfile, or stdin if logfile is null or empty. Returns nullptr if the
  // file cannot be opened.
  static CapnpBytesReader *wrap(c8_NativeByteArray data);

  // Read one record from the file. Returns true if read, or false if there are no more records to
  // read.
  template <class RecordType>
  bool read(MutableRootMessage<RecordType> *message) {
    // Read until we read a complete record, and then set the data on the input.
    while (stream.tryGetReadBuffer() != nullptr) {
      capnp::InputStreamMessageReader inputMessage(stream);
      auto record = inputMessage.getRoot<RecordType>();
      message->setRoot(record);
      return true;
    }

    // No record found; we are done.
    return false;
  }

  // Disable default construction, copy and move.
  CapnpBytesReader() = delete;
  CapnpBytesReader(CapnpBytesReader &&) = delete;
  CapnpBytesReader &operator=(CapnpBytesReader &&) = delete;
  CapnpBytesReader(const CapnpBytesReader &) = delete;
  CapnpBytesReader &operator=(const CapnpBytesReader &) = delete;

private:
  CapnpBytesReader(c8_NativeByteArray data);
  kj::ArrayInputStream arraystream;
  kj::BufferedInputStreamWrapper stream;
};

}  // namespace c8
