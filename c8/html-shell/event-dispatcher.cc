#include "c8/html-shell/event-dispatcher.h"

#include <v8.h>

#include "c8/c8-log.h"
#include "c8/html-shell/input-event-factory.h"
#include "c8/html-shell/sensor-event-factory.h"
#include "c8/string.h"

namespace c8 {

void dispatchWindowEvent(
  const NodeBindingState *state, const char *eventClass, const char *eventType) {
  v8::Isolate *isolate = v8::Isolate::GetCurrent();
  if (!isolate) {
    // No current isolate, handle the error appropriately
    C8Log("[event-dispatcher] Error: No current V8 isolate.");
    return;
  }

  v8::HandleScope handleScope(isolate);

  v8::Local<v8::Context> context = isolate->GetCurrentContext();
  if (context.IsEmpty()) {
    // No current context, handle the error appropriately
    C8Log("[event-dispatcher] Error: No current V8 context.");
    return;
  }

  // Get the global object from the current context
  v8::Local<v8::Object> global = context->Global();

  // Get the current window from the global object, if it exists.
  v8::Local<v8::Symbol> currentWindowSymbol = state->currentWindowSymbol.Get(isolate);
  v8::Local<v8::Value> currentWindowValue =
    global->Get(context, currentWindowSymbol).ToLocalChecked();

  if (!currentWindowValue->IsObject()) {
    // No current window set, return.
    return;
  }

  v8::Local<v8::Object> currentWindow = currentWindowValue.As<v8::Object>();

  // Get the dispatchEvent function from the current window.
  v8::Local<v8::Function> dispatchEvent =
    currentWindow->Get(context, v8::String::NewFromUtf8(isolate, "dispatchEvent").ToLocalChecked())
      .ToLocalChecked()
      .As<v8::Function>();

  // Get the FocusEvent constructor from the window.
  v8::Local<v8::Function> eventConstructor =
    currentWindow->Get(context, v8::String::NewFromUtf8(isolate, eventClass).ToLocalChecked())
      .ToLocalChecked()
      .As<v8::Function>();

  // Create the options object for the FocusEvent.
  v8::Local<v8::Object> options = v8::Object::New(isolate);

  // Create the arguments value for the FocusEvent.
  v8::Local<v8::String> eventTypeArg = v8::String::NewFromUtf8(isolate, eventType).ToLocalChecked();
  v8::Local<v8::Value> argv[] = {eventTypeArg, options};

  // Create the FocusEvent.
  v8::Local<v8::Object> focusEvent =
    eventConstructor->NewInstance(context, 2, argv).ToLocalChecked();

  // Dispatch the event.
  v8::Local<v8::Value> dispatchArgs[] = {focusEvent};
  dispatchEvent->Call(context, currentWindow, 1, dispatchArgs).ToLocalChecked();
}

void dispatchInputEvent(const NodeBindingState *state, const InputEventData &inputEventData) {
  // Get the input event target from the global object.
  v8::Isolate *isolate = v8::Isolate::GetCurrent();
  v8::HandleScope handleScope(isolate);
  v8::Local<v8::Context> context = isolate->GetCurrentContext();

  // Get the global object from the current context
  v8::Local<v8::Object> global = context->Global();

  // Get the input EventTarget and context Window from the global object, if they exist.
  v8::Local<v8::Symbol> inputEventTargetSymbol = state->inputEventTargetSymbol.Get(isolate);
  v8::Local<v8::Symbol> currentWindowSymbol = state->currentWindowSymbol.Get(isolate);

  v8::Local<v8::Value> inputEventTargetValue =
    global->Get(context, inputEventTargetSymbol).ToLocalChecked();
  v8::Local<v8::Value> contextWindowValue =
    global->Get(context, currentWindowSymbol).ToLocalChecked();

  if (!inputEventTargetValue->IsObject() || !contextWindowValue->IsObject()) {
    // No input event target or context window set, return.
    return;
  }

  v8::Local<v8::Object> inputEventTarget = inputEventTargetValue.As<v8::Object>();
  v8::Local<v8::Object> contextWindow = contextWindowValue.As<v8::Object>();

  // Get the dispatchEvent function from the input event target.
  v8::Local<v8::Function> dispatchEvent =
    inputEventTarget
      ->Get(context, v8::String::NewFromUtf8(isolate, "dispatchEvent").ToLocalChecked())
      .ToLocalChecked()
      .As<v8::Function>();

  if (inputEventData.type == InputEventData::EventType::MOTION) {
    // TODO: Add support for other types of input events, such as KeyboardEvent, MouseEvent, etc.
    v8::Local<v8::Value> pointerEventValue =
      InputEventFactory::createPointerEventOrNull(inputEventData, isolate, contextWindow);
    if (pointerEventValue->IsObject()) {
      // Dispatch the PointerEvent.
      v8::Local<v8::Value> dispatchArgs[] = {pointerEventValue};
      v8::MaybeLocal<v8::Value> res =
        dispatchEvent->Call(context, inputEventTarget, 1, dispatchArgs);
      if (res.IsEmpty()) {
        C8Log("[event-dispatcher] Error: Failed to dispatch PointerEvent.");
      }
    }
    v8::Local<v8::Value> touchEventValue =
      InputEventFactory::createTouchEventOrNull(inputEventData, isolate, contextWindow);
    if (touchEventValue->IsObject()) {
      // Dispatch the TouchEvent.
      v8::Local<v8::Value> dispatchArgs[] = {touchEventValue};
      v8::MaybeLocal<v8::Value> res =
        dispatchEvent->Call(context, inputEventTarget, 1, dispatchArgs);
      if (res.IsEmpty()) {
        C8Log("[event-dispatcher] Error: Failed to dispatch TouchEvent.");
      }
    }
  }
}

void dispatchSensorEvent(const NodeBindingState *state, const SensorEventData &sensorEventData) {
  // Get the sensor event target from the global object.
  v8::Isolate *isolate = v8::Isolate::GetCurrent();
  v8::HandleScope handleScope(isolate);
  v8::Local<v8::Context> context = isolate->GetCurrentContext();

  // Get the global object from the current context
  v8::Local<v8::Object> global = context->Global();

  v8::Local<v8::Symbol> sensorEventTargetSymbol = state->sensorEventTargetSymbol.Get(isolate);
  v8::Local<v8::Symbol> currentWindowSymbol = state->currentWindowSymbol.Get(isolate);

  v8::Local<v8::Value> sensorEventTargetValue =
    global->Get(context, sensorEventTargetSymbol).ToLocalChecked();
  v8::Local<v8::Value> contextWindowValue =
    global->Get(context, currentWindowSymbol).ToLocalChecked();

  if (!sensorEventTargetValue->IsObject() || !contextWindowValue->IsObject()) {
    // No sensor event target or context window set, return.
    return;
  }

  v8::Local<v8::Object> sensorEventTarget = sensorEventTargetValue.As<v8::Object>();
  v8::Local<v8::Object> contextWindow = contextWindowValue.As<v8::Object>();

  // Get the dispatchEvent function from the sensor event target.
  v8::Local<v8::Function> dispatchEvent =
    sensorEventTarget
      ->Get(context, v8::String::NewFromUtf8(isolate, "dispatchEvent").ToLocalChecked())
      .ToLocalChecked()
      .As<v8::Function>();

  // May need to buffer / queue the native events to create the appropriate dom event.
  // For example, DeviceMotionEvent also holds Acceleration data.
  if (sensorEventData.hasGyroscope && sensorEventData.hasAcceleration) {
    v8::Local<v8::Value> deviceMotionEventValue =
      SensorEventFactory::createDeviceMotionEventOrNull(sensorEventData, isolate, contextWindow);
    if (deviceMotionEventValue->IsObject()) {
      v8::Local<v8::Value> dispatchArgs[] = {deviceMotionEventValue};
      v8::MaybeLocal<v8::Value> res =
        dispatchEvent->Call(context, sensorEventTarget, 1, dispatchArgs);
      if (res.IsEmpty()) {
        C8Log("[event-dispatcher] Error: Failed to dispatch DeviceMotionEvent.");
      }
    }
  }

  if (sensorEventData.hasOrientation) {
    v8::Local<v8::Value> deviceOrientationEventValue =
      SensorEventFactory::createDeviceOrientationEventOrNull(
        sensorEventData, isolate, contextWindow);
    if (deviceOrientationEventValue->IsObject()) {
      v8::Local<v8::Value> dispatchArgs[] = {deviceOrientationEventValue};
      v8::MaybeLocal<v8::Value> res =
        dispatchEvent->Call(context, sensorEventTarget, 1, dispatchArgs);
      if (res.IsEmpty()) {
        C8Log("[event-dispatcher] Error: Failed to dispatch DeviceOrientationEvent.");
      }
    }
  }
}

}  // namespace c8
