// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

// A Manager to wrap around the CoreMotion APIs on iOS.
// Could be made more generic to be shared with Android Sensor Manager

#pragma once

#import <CoreMotion/CoreMotion.h>

#include <memory>

#include "c8/set.h"
#include "c8/string.h"

#define DEFAULT_SENSOR_UPDATE_INTERVAL 1.0 / 60.0  // 60 Hz

enum SensorType {
  SENSOR_TYPE_DEVICE_MOTION,

  // Always keep this as the last element
  SENSOR_TYPE_COUNT
};

namespace c8 {

class SensorManager {
public:
  SensorManager() noexcept;

  ~SensorManager();

  void enableSensor(SensorType sensorType);

  void enableSensors();

  void disableSensor(SensorType sensorType);

  void disableSensors();

  void processSensorEvents(int writeFd);

  void updateRegisteredSensors(const String &eventType, bool enable);

private:
  void registerSensor(SensorType sensorType);

  void unregisterSensor(SensorType sensorType);

  CMMotionManager *motionManager_ = nullptr;

  TreeSet<SensorType> registeredSensors_;
};

}  // namespace c8
