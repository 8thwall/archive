#pragma once

#include "c8/html-shell/dom-events.h"
#include "c8/html-shell/input-event-data.h"
#include "c8/html-shell/node-binding-state.h"
#include "c8/html-shell/sensor-event-data.h"
#include "c8/string.h"

namespace c8 {

void dispatchWindowEvent(
  const NodeBindingState *state, const char *eventClass, const char *eventType);
void dispatchInputEvent(const NodeBindingState *state, const InputEventData &inputEventData);
void dispatchSensorEvent(const NodeBindingState *state, const SensorEventData &sensorEventData);

}  // namespace c8
