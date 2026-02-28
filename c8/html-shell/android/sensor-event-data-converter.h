// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#include <android/sensor.h>

#include "c8/html-shell/sensor-event-data.h"

namespace c8 {

SensorEventData convertFromPlatformEvent(const ASensorEvent *ev);

}  // namespace c8
