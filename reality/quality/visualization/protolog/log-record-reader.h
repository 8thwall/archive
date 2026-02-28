// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Riyaan Bakhda (riyaanbakhda@nianticlabs.com)

#pragma once

#include "c8/protolog/api/log-request.capnp.h"
#include "c8/io/capnp-messages.h"
#include "c8/c8-log.h"

namespace c8 {

class LogRecordReader{

public:
  virtual bool read(MutableRootMessage<LogRecord> *message)=0;

  // Set noexcept(false) to make exception specification of overriding function less lax than base
  // Define a virtual destructor to default
  virtual ~LogRecordReader() noexcept(false) = default;
};

}
