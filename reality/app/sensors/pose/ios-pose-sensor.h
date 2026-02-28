// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Pure C library for instantiating and reading from the iOS Camera.

#pragma once

struct c8_PoseSensor;

// Create a new c8Pose object.
extern "C" c8_PoseSensor *c8PoseSensor_create();

// Destroy the pose source.
extern "C" void c8PoseSensor_destroy(c8_PoseSensor *pose);

// Start pose capture.
extern "C" void c8PoseSensor_resume(c8_PoseSensor *pose);

// Stop pose capture.
extern "C" void c8PoseSensor_pause(c8_PoseSensor *pose);

// Get the latest pose.
extern "C" void c8PoseSensor_getPose(
  c8_PoseSensor *pose, float *x, float *y, float *z, float *qw, float *qx, float *qy, float *qz);

// Get the latest acceleration.
extern "C" void c8PoseSensor_getAcceleration(c8_PoseSensor *pose, float *ax, float *ay, float *az);

#ifdef __cplusplus
#include "c8/vector.h"

#define C8_POSE_SENSOR_ACCELEROMETER 1
#define C8_POSE_SENSOR_GYROSCOPE 2
#define C8_POSE_SENSOR_MAGNETOMETER 3

namespace c8 {
struct XRSensorEvent {
  int kind = 0;
  int64_t timestampNanos = 0;
  float x = 0.0f;
  float y = 0.0f;
  float z = 0.0f;
  XRSensorEvent(int k_, int64_t t_, float x_, float y_, float z_)
      : kind(k_), timestampNanos(t_), x(x_), y(y_), z(z_) {}
};
}  // namespace c8

void c8PoseSensor_releaseEventQueue(c8_PoseSensor *pose, c8::Vector<c8::XRSensorEvent> *eventQueue);

#endif
