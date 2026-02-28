// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#include "c8/html-shell/android/sensor-manager.h"

#include <unistd.h>

#include "c8/c8-log.h"
#include "c8/html-shell/android/sensor-event-data-converter.h"
#include "c8/html-shell/dom-events.h"

namespace c8 {

void SensorManager::initializeSensorManager(struct android_app *app) {
  auto manager = ASensorManager_getInstance();
  androidSensorManager_.reset(manager);

  auto queue = ASensorManager_createEventQueue(
    androidSensorManager_.get(), app->looper, LOOPER_ID_USER, nullptr, nullptr);
  sensorEventQueue_.reset(queue);
}

void SensorManager::enableSensors() {
  if (!sensorEventQueue_) {
    return;
  }

  const int defaultRate = 10000;  // 10000µs / 100Hz

  for (const auto &[sensorType, sensor] : registeredSensors_) {
    ASensorEventQueue_enableSensor(sensorEventQueue_.get(), sensor.get());
    ASensorEventQueue_setEventRate(sensorEventQueue_.get(), sensor.get(), defaultRate);
  }
}

void SensorManager::disableSensors() {
  if (!sensorEventQueue_) {
    return;
  }

  for (const auto &[sensorType, sensor] : registeredSensors_) {
    ASensorEventQueue_disableSensor(sensorEventQueue_.get(), sensor.get());
  }
}

void SensorManager::disableSensor(int sensorType) {
  if (!sensorEventQueue_) {
    return;
  }

  auto sensor = registeredSensors_[sensorType].get();
  if (sensor) {
    ASensorEventQueue_disableSensor(sensorEventQueue_.get(), sensor);
  }
}

void SensorManager::registerSensor(int sensorType) {
  auto sensor = ASensorManager_getDefaultSensor(androidSensorManager_.get(), sensorType);
  if (sensor) {
    registeredSensors_[sensorType].reset(sensor);
  } else {
    // TODO(lreyna): Add proper fallback for devices that can use alternative sensors.
    C8Log("[sensor-manager] Failed to register sensor type: %d", sensorType);
  }
}

void SensorManager::unregisterSensor(int sensorType) { registeredSensors_.erase(sensorType); }

void SensorManager::updateRegisteredSensors(const String &eventType, bool enable) {
  // Add more sensor types here as needed.
  if (
    eventType == DeviceOrientationEvent::TYPE_DEVICEORIENTATION
    || eventType == DeviceMotionEvent::TYPE_DEVICEMOTION) {
    if (enable) {
      registerSensor(ASENSOR_TYPE_ROTATION_VECTOR);
      enableSensors();
    } else {
      disableSensor(ASENSOR_TYPE_ROTATION_VECTOR);
      unregisterSensor(ASENSOR_TYPE_ROTATION_VECTOR);
    }
  }
}

void SensorManager::processSensorEvents(int writeFd) {
  if (!sensorEventQueue_) {
    return;
  }

  ASensorEvent event;
  while (ASensorEventQueue_getEvents(sensorEventQueue_.get(), &event, 1) > 0) {
    SensorEventData sensorEventData = convertFromPlatformEvent(&event);
    write(writeFd, &sensorEventData, sizeof(SensorEventData));
  }
}

}  // namespace c8
