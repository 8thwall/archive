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

// Set the rendering system. Allows you to create the right xrstreaming instance
DLLEXPORT void c8XRStreaming_setRenderingSystem(int renderingSystem);

// Allocate and initialize a new reality engine.
DLLEXPORT void c8XRStreaming_create();

// Destroy a reality engine.
DLLEXPORT void c8XRStreaming_destroy();

// Bytes of an XRConfiguration message.
DLLEXPORT void c8XRStreaming_configureXR(struct c8_NativeByteArray *bytes);

DLLEXPORT void c8XRStreaming_setManagedCameraRGBATexture(
  void *texHandle, int width, int height, int renderingSystem);

DLLEXPORT void c8XRStreaming_setManagedCameraYTexture(
  void *texHandle, int width, int height, int renderingSystem);

DLLEXPORT void c8XRStreaming_setManagedCameraUVTexture(
  void *texHandle, int width, int height, int renderingSystem);

// Resume a reality engine.
DLLEXPORT void c8XRStreaming_resume();

// Recenter a reality engine.
DLLEXPORT void c8XRStreaming_recenter();

// Get the most recent reality as a RealityResponse message.
DLLEXPORT int c8XRStreaming_getCurrentRealityXR(struct c8_NativeByteArray *response);

// Get the xr environment as a XREnvironment message.
DLLEXPORT void c8XRStreaming_getXREnvironment(struct c8_NativeByteArray *bytes);

// Get the xr app environment as a XRAppEnvironment message.
DLLEXPORT void c8XRStreaming_getXRAppEnvironment(struct c8_NativeByteArray *bytes);

// Set the xr app environment.
DLLEXPORT void c8XRStreaming_setXRAppEnvironment(struct c8_NativeByteArray *bytes);

// Get the xr remote data as an XrRemoteApp message.
DLLEXPORT void c8XRStreaming_getXRRemote(struct c8_NativeByteArray *remote);
// void c8XRStreaming_getXRRemote(struct c8_XRRemote *remote);

// Pause a reality engine.
DLLEXPORT void c8XRStreaming_pause();

DLLEXPORT void c8XRStreaming_renderFrameForDisplay();

DLLEXPORT void c8XRStreaming_setEditorAppInfo(struct c8_NativeByteArray *bytes);

DLLEXPORT void c8XRStreaming_query(
  struct c8_NativeByteArray *request, struct c8_NativeByteArray *response);

typedef void (*UnityRenderingEventFuncType)(int);

// This is UnityRenderingEvent type
// This will break if they ever change their function pointer type
DLLEXPORT UnityRenderingEventFuncType c8XRStreaming_getRenderEventFunc();

#ifdef __cplusplus
}  // extern "C"
#endif
