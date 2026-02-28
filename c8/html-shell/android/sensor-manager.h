// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#pragma once

#include <android/sensor.h>
#include <android_native_app_glue.h>

#include <memory>

#include "c8/map.h"
#include "c8/string.h"

namespace c8 {

class SensorManager {
public:
  SensorManager() = default;

  void initializeSensorManager(struct android_app *app);

  void enableSensors();

  void disableSensors();

  void disableSensor(int sensorType);

  void processSensorEvents(int writeFd);

  void updateRegisteredSensors(const String &eventType, bool enable);

private:
  void registerSensor(int sensorType);

  void unregisterSensor(int sensorType);

  // Custom deleters, so we can use unique ptrs
  struct ASensorManagerDeleter {
    void operator()(ASensorManager *manager) const {
      // Add appropriate cleanup code here if necessary
      // ASensorManager is a Singleton, so don't free the ptr
    }
  };

  struct ASensorDeleter {
    void operator()(const ASensor *sensor) const {}
  };

  struct ASensorEventQueueDeleter {
    void operator()(ASensorEventQueue *queue) const {
      auto manager = ASensorManager_getInstance();
      ASensorManager_destroyEventQueue(manager, queue);
    }
  };

  std::unique_ptr<ASensorManager, ASensorManagerDeleter> androidSensorManager_;
  TreeMap<int, std::unique_ptr<const ASensor, ASensorDeleter>> registeredSensors_;
  std::unique_ptr<ASensorEventQueue, ASensorEventQueueDeleter> sensorEventQueue_;
};

}  // namespace c8
