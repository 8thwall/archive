// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#import <CoreMotion/CoreMotion.h>

#include "c8/html-shell/sensor-event-data.h"

namespace c8 {

SensorEventData convertFromPlatformEvent(const CMDeviceMotion *ev);

}  // namespace c8
