// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// Library for retrieving iOS app information.

#pragma once

#include "reality/engine/api/request/app.capnp.h"

namespace c8 {

// Writes information of the currently running iOS device to the provided builder.
void exportAppContext(AppContext::Builder appContextBuilder);

}  // namespace c8
