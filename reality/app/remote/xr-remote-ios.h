// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// C-wrapper functions for running 8thWall XR on iOS.

#pragma once

#ifdef __cplusplus
extern "C" {
#endif

#include <stdbool.h>
#include <stdint.h>
#include "c8/protolog/xr-extern.h"

// Allocate and initialize a new remote singleton.
void c8XRIos_createRemote();

// Decommission and deallocate the remote.
void c8XRIos_destroyRemote();

// Attach the remote to the xr controller.
void c8XRIos_enableRemote();

// Send remote app data as an XrRemoteApp message.
void c8XRIos_sendRemoteApp(struct c8_NativeByteArray *bytes);

// Select a server to stream remote data to as an XrServer message.
void c8XRIos_resumeConnectionToServer(struct c8_NativeByteArray *bytes);

// Disconnect from the connected server..
void c8XRIos_pauseConnectionToServer();

// Get an RemoteServiceResponse message.
void c8XRIos_getRemoteResponse(struct c8_NativeByteArray *bytes);

// Get an XrRemoteConnection message.
void c8XRIos_getRemoteConnection(struct c8_NativeByteArray *bytes);

#ifdef __cplusplus
}  // extern "C"
#endif
