// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// C-wrapper functions for running the XR.

#pragma once

#include "xr-ios-interface.h"

namespace c8 {

// Allocate and initialize a new reality engine driver.
XRDriverIos *createXRIosARKit(XRIos *xr);

// Export XREnvironment data from the ARKit driver.
void exportXRIosARKitEnvironment(XREnvironment::Builder *environment);

}  // namespace c8
