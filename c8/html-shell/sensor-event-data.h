// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)
//
// Sensor Event Data Serialization
// For Android, see:
// - https://developer.android.com/ndk/reference/group/sensor#summary
// - https://developer.android.com/develop/sensors-and-location/sensors/sensors_motion

#pragma once

#include <cstdint>

namespace c8 {

struct SensorEventVector {
  float x = 0.f;
  float y = 0.f;
  float z = 0.f;
};

struct SensorEventData {
  // Time in nanoseconds when the event occurred
  int64_t timestamp = 0;

  // Rate of rotation around an axis in deg / sec
  SensorEventVector gyroscopeVector;
  bool hasGyroscope = false;

  // Orientation for Web Euler angles in deg
  SensorEventVector orientation;
  bool hasOrientation = false;

  // Acceleration vector component in m / sec^2
  SensorEventVector accelerationVector;
  bool hasAcceleration = false;
};

}  // namespace c8
