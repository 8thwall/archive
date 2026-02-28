// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Pure C library for instantiating and reading from the iOS Camera.

#pragma once

#include "reality/engine/api/reality.capnp.h"

#ifdef __cplusplus
extern "C" {
#endif

struct c8_ARKitSensor;
struct c8_ARKitImageCallback;

// Create a new c8_ARKitSensor object and set to the highest non-binned
// framerate.
// If session pointer is not null, this will be used instead of creating new ARSession.
// If session config pointer is not null, this will be used to configure the session.
// If session delegate pointer is not null, this will be used for ARSession delegate.
struct c8_ARKitSensor *c8ARKitSensor_create(
  void *session, void *sessionConfig, void *sessionDelegate);

// Set a callback function to handle new frames. This function will be given
// the address of a locked CVPixelBuffer; when the function completes, the
// CVPixelBuffer will be unlocked.
void c8ARKitSensor_setImageCallback(struct c8_ARKitSensor *arkit, c8_ARKitImageCallback *callback);

// Start arkit capture.
void c8ARKitSensor_resume(struct c8_ARKitSensor *arkit);

// Stop arkit capture.
void c8ARKitSensor_pause(struct c8_ARKitSensor *arkit);

// Configure ARKit according the API.
void c8ARKitSensor_configure(struct c8_ARKitSensor *arkit, c8::XRConfiguration::Reader config);

// Destroy the arkit capture source.
void c8ARKitSensor_destroy(struct c8_ARKitSensor *arkit);

#ifdef __cplusplus
}
#endif
