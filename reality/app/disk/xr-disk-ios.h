// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)
//
// C-wrapper functions for running 8thWall XR on iOS.

#pragma once

#ifdef __cplusplus
extern "C" {
#endif

#include <stdbool.h>
#include <stdint.h>

#include "c8/symbol-visibility.h"

// Allocate and initialize a new disk recorder singleton.
C8_PUBLIC
void c8XRIos_createDiskRecorder();

// Decommission and deallocate.
C8_PUBLIC
void c8XRIos_destroyDiskRecorder();

// is the disk recorder logging
C8_PUBLIC
bool c8XRIos_isLogging();

// start logging nFrames to disk
C8_PUBLIC
void c8XRIos_logToDisk(int nFrames);

#ifdef __cplusplus
}  // extern "C"
#endif
