// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// C-wrapper functions for running the XR.

#pragma once

#include "reality/app/xr/ios/xr-ios-interface.h"

namespace c8 {

// Allocate and initialize a new reality engine driver.
XRDriverIos *createXRIosC8(XRIos *xr);

// Export XREnvironment data from the C8 driver.
void exportXRIosC8Environment(XREnvironment::Builder *environment);

}  // namespace c8
