// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// C-wrapper functions for running the XR.

#pragma once

#include "xr-ios-interface.h"

namespace c8 {

// Allocate and initialize a new reality engine driver.
XRDriverIos *createXRIosRemoteOnly(XRIos *xr);

}  // namespace c8
