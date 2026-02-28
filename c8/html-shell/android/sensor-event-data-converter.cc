// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#include "c8/html-shell/android/sensor-event-data-converter.h"

#include <cmath>

#include "c8/html-shell/sensor-event-data-conversion.h"
#include "c8/quaternion.h"

constexpr float RAD_TO_DEG = 180.0f / M_PI;

namespace c8 {

// static
SensorEventData convertFromPlatformEvent(const ASensorEvent *ev) {
  SensorEventData data;
  switch (ev->type) {
    // https://source.android.com/docs/core/interaction/sensors/sensor-types#rotation_vector
    // Web expects the euler angles in degrees.
    case ASENSOR_TYPE_ROTATION_VECTOR: {
      auto eventQuat = Quaternion(
        ev->data[3],  // w
        ev->data[0],  // x
        ev->data[1],  // y
        ev->data[2]   // z
      );

      data.hasOrientation = true;
      getWebOrientation(eventQuat, data.orientation.x, data.orientation.y, data.orientation.z);

      data.hasGyroscope = true;
      data.gyroscopeVector.x = ev->gyro.x * RAD_TO_DEG;
      data.gyroscopeVector.y = ev->gyro.y * RAD_TO_DEG;
      data.gyroscopeVector.z = ev->gyro.z * RAD_TO_DEG;

      data.hasAcceleration = true;
      data.accelerationVector.x = ev->acceleration.x;
      data.accelerationVector.y = ev->acceleration.y;
      data.accelerationVector.z = ev->acceleration.z;

      data.timestamp = ev->timestamp;
      break;
    }
    default: {
      break;
    }
  };

  return data;
}

}  // namespace c8
