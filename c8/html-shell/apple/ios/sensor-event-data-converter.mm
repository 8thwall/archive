// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#include "c8/html-shell/apple/ios/sensor-event-data-converter.h"

#include <cmath>

#include "c8/html-shell/sensor-event-data-conversion.h"
#include "c8/quaternion.h"

constexpr float RAD_TO_DEG = 180.0f / M_PI;

namespace c8 {

SensorEventData convertFromPlatformEvent(const CMDeviceMotion *ev) {
  SensorEventData data;
  Quaternion eventQuat(
    ev.attitude.quaternion.w,
    ev.attitude.quaternion.x,
    ev.attitude.quaternion.y,
    ev.attitude.quaternion.z);

  data.hasOrientation = true;
  getWebOrientation(eventQuat, data.orientation.x, data.orientation.y, data.orientation.z);

  // Gyroscope (degrees/sec)
  data.hasGyroscope = true;
  data.gyroscopeVector.x = ev.rotationRate.x * RAD_TO_DEG;
  data.gyroscopeVector.y = ev.rotationRate.y * RAD_TO_DEG;
  data.gyroscopeVector.z = ev.rotationRate.z * RAD_TO_DEG;

  // Acceleration (without gravity)
  data.hasAcceleration = true;
  data.accelerationVector.x = ev.userAcceleration.x;
  data.accelerationVector.y = ev.userAcceleration.y;
  data.accelerationVector.z = ev.userAcceleration.z;

  // Timestamp in nanoseconds, CMLogItem provides timestamp in seconds
  data.timestamp = ev.timestamp * 1e9;
  return data;
}

}  // namespace c8
