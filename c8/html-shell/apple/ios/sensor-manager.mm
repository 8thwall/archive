// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#import "c8/html-shell/apple/ios/sensor-manager.h"

#include "c8/c8-log.h"
#include "c8/html-shell/apple/ios/sensor-event-data-converter.h"
#include "c8/html-shell/dom-events.h"

namespace c8 {

SensorManager::SensorManager() noexcept { motionManager_ = [[CMMotionManager alloc] init]; }

SensorManager::~SensorManager() { disableSensors(); }

// If sensor updates are already active, calling this method again does nothing.
void SensorManager::enableSensor(SensorType sensorType) {
  switch (sensorType) {
    case SensorType::SENSOR_TYPE_DEVICE_MOTION:
      motionManager_.deviceMotionUpdateInterval = DEFAULT_SENSOR_UPDATE_INTERVAL;
      [motionManager_ startDeviceMotionUpdates];
      break;
    default:
      C8Log("[sensor-manager] Unsupported sensor type: %d", sensorType);
      break;
  }
}

void SensorManager::enableSensors() {
  for (int i = 0; i < static_cast<int>(SensorType::SENSOR_TYPE_COUNT); ++i) {
    SensorType sensorType = static_cast<SensorType>(i);

    enableSensor(sensorType);
  }
}

void SensorManager::disableSensor(SensorType sensorType) {
  switch (sensorType) {
    case SensorType::SENSOR_TYPE_DEVICE_MOTION:
      [motionManager_ stopDeviceMotionUpdates];
      break;
    default:
      C8Log("[sensor-manager] Unsupported sensor type: %d", sensorType);
      break;
  }
}

void SensorManager::disableSensors() {
  for (int i = 0; i < static_cast<int>(SensorType::SENSOR_TYPE_COUNT); ++i) {
    SensorType sensorType = static_cast<SensorType>(i);

    disableSensor(sensorType);
  }
}

void SensorManager::processSensorEvents(int writeFd) {
  if (
    registeredSensors_.count(SensorType::SENSOR_TYPE_DEVICE_MOTION) > 0
    && motionManager_.deviceMotionAvailable) {
    CMDeviceMotion *deviceMotion = motionManager_.deviceMotion;
    if (deviceMotion) {
      SensorEventData sensorEventData = convertFromPlatformEvent(deviceMotion);
      write(writeFd, &sensorEventData, sizeof(SensorEventData));
    }
  }
}

void SensorManager::registerSensor(SensorType sensorType) {
  registeredSensors_.insert(sensorType);
  enableSensor(SensorType::SENSOR_TYPE_DEVICE_MOTION);
}

void SensorManager::unregisterSensor(SensorType sensorType) {
  registeredSensors_.erase(sensorType);
  disableSensor(SensorType::SENSOR_TYPE_DEVICE_MOTION);
}

void SensorManager::updateRegisteredSensors(const String &eventType, bool enable) {
  // Add more sensor types here as needed.
  if (
    eventType == DeviceOrientationEvent::TYPE_DEVICEORIENTATION
    || eventType == DeviceMotionEvent::TYPE_DEVICEMOTION) {
    if (enable) {
      registerSensor(SensorType::SENSOR_TYPE_DEVICE_MOTION);
    } else {
      unregisterSensor(SensorType::SENSOR_TYPE_DEVICE_MOTION);
    }
  }
}

}  // namespace c8
