// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portilo (alvin@8thwall.com)
//
// Functions for initializing the header struct for an analytics record sent to the server.

#pragma once

#include "c8/protolog/api/log-request.capnp.h"
#include "c8/protolog/xr-extern.h"
#include "capnp/message.h"

namespace c8 {

// Writes information to the provided LogRecordHeader about the current device, application,
// developer, etc.
void c8_exportLogHeaderInfo(
  RealityEngineLogRecordHeader::EngineType engineType,
  const char* mobileAppKey,
  LogRecordHeader::Builder *headerBuilder);

}  // namespace c8
