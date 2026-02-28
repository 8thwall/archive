// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#pragma once

#include <v8.h>

#include "c8/html-shell/sensor-event-data.h"

namespace c8 {

class SensorEventFactory {
public:
  SensorEventFactory() = delete;

  static v8::Local<v8::Value> createDeviceOrientationEventOrNull(
    const SensorEventData &eventData, v8::Isolate *isolate, v8::Local<v8::Object> window);

  static v8::Local<v8::Value> createDeviceMotionEventOrNull(
    const SensorEventData &eventData, v8::Isolate *isolate, v8::Local<v8::Object> window);
};

}  // namespace c8
