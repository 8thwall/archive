// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <capnp/serialize-packed.h>

#include "c8/c8-log.h"
#include "reality/quality/visualization/protolog/log-record-reader.h"

namespace c8 {

class CapnpbinReader : public LogRecordReader {
public:
  // Read from the provided logfile, or stdin if logfile is null or empty. Returns nullptr if the
  // file cannot be opened.
  static CapnpbinReader *open(const char *logfile);

  // Read one record from the file. Returns true if read, or false if there are no more records to
  // read.
  template <class RecordType>
  bool read(MutableRootMessage<RecordType> *message) {
    // Read until we read a complete record, and then set the data on the input.
    if (stream.tryGetReadBuffer() != nullptr) {
      if (isPackedMessage_) {
        capnp::PackedMessageReader inputMessage(stream);
        auto record = inputMessage.getRoot<RecordType>();
        message->setRoot(record);
      } else {
        capnp::InputStreamMessageReader inputMessage(stream);
        auto record = inputMessage.getRoot<RecordType>();
        message->setRoot(record);
      }
      return true;
    }

    // No record found; we are done.
    return false;
  }

  bool read(MutableRootMessage<LogRecord> *message) { return read<>(message); }

  // Disable default construction, copy and move.
  CapnpbinReader() = delete;
  CapnpbinReader(CapnpbinReader &&) = delete;
  CapnpbinReader &operator=(CapnpbinReader &&) = delete;
  CapnpbinReader(const CapnpbinReader &) = delete;
  CapnpbinReader &operator=(const CapnpbinReader &) = delete;

private:
  bool isPackedMessage_ = false;
  CapnpbinReader(int fd);
  kj::FdInputStream fdstream;
  kj::BufferedInputStreamWrapper stream;
};

}  // namespace c8
