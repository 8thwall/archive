// Copyright (c) 2024 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)

#include "c8/html-shell/input-event-factory.h"

#include "c8/html-shell/dom-events.h"
#include "c8/html-shell/input-event-data.h"

namespace c8 {

namespace {

v8::Local<v8::Object> createTouchObject(
  v8::Local<v8::Context> &context,
  v8::Isolate *isolate,
  const c8::InputEventData::PointerData &pointer) {
  v8::Local<v8::Object> touch = v8::Object::New(isolate);
  float x = pointer.x;
  float y = pointer.y;
  touch
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "identifier").ToLocalChecked(),
      v8::Number::New(isolate, pointer.pointerId))
    .Check();
  touch
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "clientX").ToLocalChecked(),
      v8::Number::New(isolate, x))
    .Check();
  touch
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "clientY").ToLocalChecked(),
      v8::Number::New(isolate, y))
    .Check();
  touch
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "screenX").ToLocalChecked(),
      v8::Number::New(isolate, x))
    .Check();

  touch
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "screenY").ToLocalChecked(),
      v8::Number::New(isolate, y))
    .Check();
  return touch;
}

}  // namespace

// static
v8::Local<v8::Value> InputEventFactory::createPointerEventOrNull(
  const InputEventData &eventData, v8::Isolate *isolate, v8::Local<v8::Object> window) {
  if (eventData.type != InputEventData::EventType::MOTION) {
    return v8::Null(isolate);
  }

  v8::HandleScope handleScope(isolate);

  v8::Local<v8::Context> context = isolate->GetCurrentContext();

  // Get the PointerEvent constructor from the window.
  v8::Local<v8::Function> eventConstructor =
    window->Get(context, v8::String::NewFromUtf8(isolate, PointerEvent::NAME).ToLocalChecked())
      .ToLocalChecked()
      .As<v8::Function>();

  // Get the pointer type, based on the action (either down, move, or up).
  const char *eventType = nullptr;
  // In the future, to support other peripherals, we need to track button contact state changes.
  // For now, since eventData.button() will always return 0 for motion events, so there's no way I
  // can think of to add support for button property to support periperals. We're only supporting 0
  // and -1 for now.
  // https://w3c.github.io/pointerevents/#the-button-property
  int button = 0;
  switch (eventData.action) {
    case InputEventData::ActionType::DOWN:
      eventType = PointerEvent::TYPE_POINTERDOWN;
      break;
    case InputEventData::ActionType::UP:
      eventType = PointerEvent::TYPE_POINTERUP;
      break;
    case InputEventData::ActionType::MOVE:
      // -1 is the expected button value when there is no state change and during a drag gesture.
      button = -1;
      eventType = PointerEvent::TYPE_POINTERMOVE;
      break;
    case InputEventData::ActionType::CANCEL:
      eventType = PointerEvent::TYPE_POINTERCANCEL;
      break;
    case InputEventData::ActionType::ENTER:
      eventType = PointerEvent::TYPE_POINTERENTER;
      break;
    case InputEventData::ActionType::OUT:
      eventType = PointerEvent::TYPE_POINTEROUT;
      break;
    default:
      return v8::Null(isolate);
      break;
  }
  const char *pointerType = nullptr;
  switch (eventData.pointerType) {
    case InputEventData::PointerType::MOUSE:
      pointerType = "mouse";
      break;
    case InputEventData::PointerType::PEN:
      pointerType = "pen";
      break;
    case InputEventData::PointerType::TOUCH:
      pointerType = "touch";
      break;
    case InputEventData::PointerType::UNSUPPORTED:
    default:
      C8Log("[input-event-factory] Unsupported pointer type: %d", eventData.source);
      return v8::Null(isolate);
  }

  // Create event type string for the PointerEvent.
  v8::Local<v8::String> pointerEventTypeArg =
    v8::String::NewFromUtf8(isolate, eventType).ToLocalChecked();

  // Create the options object for the PointerEvent.
  v8::Local<v8::Object> pointerOptions = v8::Object::New(isolate);

  pointerOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "width").ToLocalChecked(),
      v8::Number::New(isolate, eventData.width))
    .Check();
  pointerOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "height").ToLocalChecked(),
      v8::Number::New(isolate, eventData.height))
    .Check();
  pointerOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "pressure").ToLocalChecked(),
      v8::Number::New(isolate, eventData.pressure))
    .Check();
  pointerOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "pointerType").ToLocalChecked(),
      v8::String::NewFromUtf8(isolate, pointerType).ToLocalChecked())
    .Check();
  pointerOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "isPrimary").ToLocalChecked(),
      v8::Boolean::New(isolate, eventData.pointerIndex == 0))
    .Check();
  pointerOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "clientX").ToLocalChecked(),
      v8::Number::New(isolate, eventData.x))
    .Check();
  pointerOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "clientY").ToLocalChecked(),
      v8::Number::New(isolate, eventData.y))
    .Check();
  pointerOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "pointerId").ToLocalChecked(),
      v8::Number::New(isolate, eventData.pointerId))
    .Check();
  pointerOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "button").ToLocalChecked(),
      v8::Number::New(isolate, button))
    .Check();
  // propagate the event
  pointerOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "bubbles").ToLocalChecked(),
      v8::Boolean::New(isolate, true))
    .Check();

  // Create the arguments value for the PointerEvent.
  v8::Local<v8::Value> pointerArgv[] = {pointerEventTypeArg, pointerOptions};

  // Create the PointerEvent.
  v8::Local<v8::Object> pointerEvent =
    eventConstructor->NewInstance(context, 2, pointerArgv).ToLocalChecked();
  return pointerEvent;
}

v8::Local<v8::Value> InputEventFactory::createTouchEventOrNull(
  const InputEventData &eventData, v8::Isolate *isolate, v8::Local<v8::Object> window) {

  if (eventData.type != InputEventData::EventType::MOTION) {
    return v8::Null(isolate);
  }

  v8::HandleScope handleScope(isolate);

  v8::Local<v8::Context> context = isolate->GetCurrentContext();

  // Get the TouchEvent constructor from the window.
  v8::Local<v8::Function> touchEventConstructor =
    window->Get(context, v8::String::NewFromUtf8(isolate, TouchEvent::NAME).ToLocalChecked())
      .ToLocalChecked()
      .As<v8::Function>();

  const char *touchEventType = nullptr;

  switch (eventData.action) {
    case InputEventData::ActionType::DOWN:
      touchEventType = TouchEvent::TYPE_TOUCHSTART;
      break;
    case InputEventData::ActionType::UP:
      touchEventType = TouchEvent::TYPE_TOUCHEND;
      break;
    case InputEventData::ActionType::MOVE:
      touchEventType = TouchEvent::TYPE_TOUCHMOVE;
      break;
    case InputEventData::ActionType::CANCEL:
      touchEventType = TouchEvent::TYPE_TOUCHCANCEL;
      break;
    default:
      // Unsupported action type for touch events.
      return v8::Null(isolate);
      break;
  }

  v8::Local<v8::String> touchEventTypeArg =
    v8::String::NewFromUtf8(isolate, touchEventType).ToLocalChecked();

  v8::Local<v8::Array> touchArray = v8::Array::New(isolate, eventData.pointerCount);
  for (int i = 0; i < eventData.pointerCount; ++i) {
    touchArray->Set(context, i, createTouchObject(context, isolate, eventData.pointers[i])).Check();
  }

  v8::Local<v8::Array> changedTouchArray = v8::Array::New(isolate, eventData.changedTouchCount);
  for (int i = 0; i < eventData.changedTouchCount; ++i) {
    changedTouchArray
      ->Set(context, i, createTouchObject(context, isolate, eventData.changedTouches[i]))
      .Check();
  }

  v8::Local<v8::Object> touchOptions = v8::Object::New(isolate);
  touchOptions
    ->Set(context, v8::String::NewFromUtf8(isolate, "touches").ToLocalChecked(), touchArray)
    .Check();
  touchOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "changedTouches").ToLocalChecked(),
      changedTouchArray)
    .Check();
  // propagate the event
  touchOptions
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "bubbles").ToLocalChecked(),
      v8::Boolean::New(isolate, true))
    .Check();

  // Create the arguments value for the TouchEvent.
  v8::Local<v8::Value> touchArgv[] = {touchEventTypeArg, touchOptions};

  v8::Local<v8::Object> touchEvent =
    touchEventConstructor->NewInstance(context, 2, touchArgv).ToLocalChecked();
  return touchEvent;
}

}  // namespace c8
