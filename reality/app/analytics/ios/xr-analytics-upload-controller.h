// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portillo (alvin@8thwall.com)
//
// Controller class responsible for uploading analytics logs to the server.

#pragma once

#include "capnp/message.h"

namespace c8 {

// Performs a best-effort attempt to upload the log to the server.
void c8AnalyticsUploadController_logRecordToServer(std::unique_ptr<c8::Vector<uint8_t>> &recordBytesPtr);

}  // namespace c8
