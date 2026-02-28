// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// C-wrapper functions for running the RealityEngine.

#pragma once

#ifdef __cplusplus
extern "C" {
#endif

#include <stdbool.h>
#include <stdint.h>
#include "c8/protolog/xr-extern.h"

#if defined(_WIN32) || defined(WIN23)
#define DLLEXPORT __declspec(dllexport)
#define INTERFACE_CALL __stdcall
#else
#define DLLEXPORT
#define INTERFACE_CALL
#endif

// Allocate and initialize a new xrom server.
DLLEXPORT void c8XromServer_create();

// Destroy an xrom server.
DLLEXPORT void c8XromServer_destroy();

// Get the most recent updates from the xrom server.
DLLEXPORT int c8XromServer_getUpdates(struct c8_NativeByteArray *response);

#ifdef __cplusplus
}  // extern "C"
#endif
