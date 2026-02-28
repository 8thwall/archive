// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Pure C library for instantiating and reading from the iOS Camera.

#pragma once

#ifdef __cplusplus
extern "C" {
#endif

struct c8_CameraSensor;
struct c8_CameraImageCallback;

// Create a new c8_CameraSensor object and set to the highest non-binned
// framerate.
struct c8_CameraSensor *c8CameraSensor_create();

// Set a callback function to handle new frames. This function will be given
// the address of a locked CVPixelBuffer; when the function completes, the
// CVPixelBuffer will be unlocked.
void c8CameraSensor_setImageCallback(
  struct c8_CameraSensor *camera, c8_CameraImageCallback *callback);

// Start camera capture.
void c8CameraSensor_resume(struct c8_CameraSensor *camera);

// Stop camera capture.
void c8CameraSensor_pause(struct c8_CameraSensor *camera);

// Destroy the camera capture source.
void c8CameraSensor_destroy(struct c8_CameraSensor *camera);

void c8CameraSensor_configure(struct c8_CameraSensor *camera, bool enableCameraAutofocus);

#ifdef __cplusplus
}
#endif
