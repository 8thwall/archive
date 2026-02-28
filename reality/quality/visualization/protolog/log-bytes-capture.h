// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <kj/io.h>

#include "c8/protolog/xr-extern.h"
#include "reality/app/xr/capnp/xr-capnp.h"
#include "reality/quality/visualization/protolog/capnp-bytes-reader.h"

namespace c8 {

class LogBytesCapture {
public:
  // Read from the provided logfile, or stdin if logfile is null or empty.
  static LogBytesCapture *create(c8_NativeByteArray data);

  // Prefer these to the overridden methods below, since they give a more accurate and complete
  // picture of the data in the phone.
  bool read(XRCapnpSensors *sensors);

  // Overrides to let opencv samples (e.g. camera calibration) use this class with minimal delta.
  bool isOpened() const;
  void release();
  ~LogBytesCapture() noexcept;

  // Disable default construction, copy and move.
  LogBytesCapture(const char *logfile) = delete;
  LogBytesCapture(LogBytesCapture &&) = delete;
  LogBytesCapture &operator=(LogBytesCapture &&) = delete;
  LogBytesCapture(const LogBytesCapture &) = delete;
  LogBytesCapture &operator=(const LogBytesCapture &) = delete;

private:
  LogBytesCapture(CapnpBytesReader *reader_);
  std::unique_ptr<CapnpBytesReader> reader;
};

}  // namespace c8
