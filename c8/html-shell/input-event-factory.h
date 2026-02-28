// Copyright (c) 2024 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)
//
// Factory methods for generating Javascript input events from Input Event Data.

#pragma once

#include <v8.h>

#include "c8/html-shell/input-event-data.h"

namespace c8 {

class InputEventFactory {
public:
  // Prevent instantiation of this class, as it should only be used statically.
  InputEventFactory() = delete;
  // Creates a TouchEvent as a v8::Object from an InputEventData if applicable, otherwise returns
  // v8::Null.
  static v8::Local<v8::Value> createTouchEventOrNull(
    const InputEventData &eventData, v8::Isolate *isolate, v8::Local<v8::Object> window);
  // Creates a PointerEvent as a v8::Object from an InputEventData if applicable, otherwise returns
  // v8::Null.
  static v8::Local<v8::Value> createPointerEventOrNull(
    const InputEventData &eventData, v8::Isolate *isolate, v8::Local<v8::Object> window);

  // TODO: Add more factory methods for other types of input events, such as KeyboardEvent,
  // MouseEvent, Event("scroll") etc.
};

}  // namespace c8
