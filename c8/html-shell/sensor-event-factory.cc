// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucasreyna@nianticlabs.com)

#include "c8/html-shell/sensor-event-factory.h"

#include "c8/html-shell/dom-events.h"
#include "c8/html-shell/sensor-event-data.h"

namespace c8 {

v8::Local<v8::Value> SensorEventFactory::createDeviceOrientationEventOrNull(
  const SensorEventData &eventData, v8::Isolate *isolate, v8::Local<v8::Object> window) {
  // NOTE(lreyna): Other sensor types in combination could be used to calculate the orientation.
  // In the future, we may want to add a custom event type.
  if (!eventData.hasOrientation) {
    return v8::Null(isolate);
  }

  v8::HandleScope handleScope(isolate);

  v8::Local<v8::Context> context = isolate->GetCurrentContext();

  // Get the DeviceOrientationEvent constructor from the window.
  v8::Local<v8::Function> eventConstructor =
    window
      ->Get(
        context, v8::String::NewFromUtf8(isolate, DeviceOrientationEvent::NAME).ToLocalChecked())
      .ToLocalChecked()
      .As<v8::Function>();

  const char *eventType = DeviceOrientationEvent::TYPE_DEVICEORIENTATION;

  // Create event type string for the DeviceOrientationEvent.
  v8::Local<v8::String> eventTypeArg = v8::String::NewFromUtf8(isolate, eventType).ToLocalChecked();

  // Create the options object for the DeviceOrientationEvent.
  // See: https://w3c.github.io/deviceorientation/#dictdef-deviceorientationeventinit
  v8::Local<v8::Object> options = v8::Object::New(isolate);
  options
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "bubbles").ToLocalChecked(),
      v8::Boolean::New(isolate, true))
    .Check();

  options
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, DeviceOrientationEvent::OPTION_ALPHA).ToLocalChecked(),
      v8::Number::New(isolate, eventData.orientation.x))
    .Check();
  options
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, DeviceOrientationEvent::OPTION_BETA).ToLocalChecked(),
      v8::Number::New(isolate, eventData.orientation.y))
    .Check();
  options
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, DeviceOrientationEvent::OPTION_GAMMA).ToLocalChecked(),
      v8::Number::New(isolate, eventData.orientation.z))
    .Check();
  options
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, DeviceOrientationEvent::OPTION_ABSOLUTE).ToLocalChecked(),
      v8::Boolean::New(isolate, true))  // NOTE: Hardcoding to true for now
    .Check();

  // Create the arguments value for the DeviceOrientationEvent.
  v8::Local<v8::Value> argv[] = {eventTypeArg, options};

  // Create the DeviceOrientationEvent.
  v8::Local<v8::Object> deviceOrientationEvent =
    eventConstructor->NewInstance(context, 2, argv).ToLocalChecked();

  return deviceOrientationEvent;
}

v8::Local<v8::Value> SensorEventFactory::createDeviceMotionEventOrNull(
  const SensorEventData &eventData, v8::Isolate *isolate, v8::Local<v8::Object> window) {
  if (!eventData.hasAcceleration || !eventData.hasGyroscope) {
    return v8::Null(isolate);
  }

  v8::HandleScope handleScope(isolate);

  v8::Local<v8::Context> context = isolate->GetCurrentContext();

  // Get the DeviceMotionEvent constructor from the window.
  v8::Local<v8::Function> eventConstructor =
    window->Get(context, v8::String::NewFromUtf8(isolate, DeviceMotionEvent::NAME).ToLocalChecked())
      .ToLocalChecked()
      .As<v8::Function>();

  const char *eventType = DeviceMotionEvent::TYPE_DEVICEMOTION;

  // Create event type string for the DeviceMotionEvent.
  v8::Local<v8::String> eventTypeArg = v8::String::NewFromUtf8(isolate, eventType).ToLocalChecked();

  // Create the options object for the DeviceMotionEvent.
  // See: https://w3c.github.io/deviceorientation/#dictdef-devicemotioneventinit
  v8::Local<v8::Object> options = v8::Object::New(isolate);
  options
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, DeviceMotionEvent::OPTION_INTERVAL).ToLocalChecked(),
      v8::Number::New(isolate, 10))  // NOTE: Hardcoding to 10ms for now, based on 100Hz
    .Check();

  options
    ->Set(
      context,
      v8::String::NewFromUtf8(isolate, "bubbles").ToLocalChecked(),
      v8::Boolean::New(isolate, true))
    .Check();

  {
    v8::Local<v8::Object> acceleration = v8::Object::New(isolate);
    acceleration
      ->Set(
        context,
        v8::String::NewFromUtf8(isolate, DeviceMotionEvent::OPTION_ACCELERATION_X).ToLocalChecked(),
        v8::Number::New(isolate, eventData.accelerationVector.x))
      .Check();
    acceleration
      ->Set(
        context,
        v8::String::NewFromUtf8(isolate, DeviceMotionEvent::OPTION_ACCELERATION_Y).ToLocalChecked(),
        v8::Number::New(isolate, eventData.accelerationVector.y))
      .Check();
    acceleration
      ->Set(
        context,
        v8::String::NewFromUtf8(isolate, DeviceMotionEvent::OPTION_ACCELERATION_Z).ToLocalChecked(),
        v8::Number::New(isolate, eventData.accelerationVector.z))
      .Check();

    options
      ->Set(
        context,
        v8::String::NewFromUtf8(isolate, DeviceMotionEvent::OPTION_ACCELERATION).ToLocalChecked(),
        acceleration)
      .Check();
  }

  // TODO: Add Acceleration with Gravity

  {
    v8::Local<v8::Object> rotationRate = v8::Object::New(isolate);
    rotationRate
      ->Set(
        context,
        v8::String::NewFromUtf8(isolate, DeviceMotionEvent::OPTION_ROTATION_RATE_ALPHA)
          .ToLocalChecked(),
        v8::Number::New(isolate, eventData.gyroscopeVector.x))
      .Check();
    rotationRate
      ->Set(
        context,
        v8::String::NewFromUtf8(isolate, DeviceMotionEvent::OPTION_ROTATION_RATE_BETA)
          .ToLocalChecked(),
        v8::Number::New(isolate, eventData.gyroscopeVector.y))
      .Check();
    rotationRate
      ->Set(
        context,
        v8::String::NewFromUtf8(isolate, DeviceMotionEvent::OPTION_ROTATION_RATE_GAMMA)
          .ToLocalChecked(),
        v8::Number::New(isolate, eventData.gyroscopeVector.z))
      .Check();

    options
      ->Set(
        context,
        v8::String::NewFromUtf8(isolate, DeviceMotionEvent::OPTION_ROTATION_RATE).ToLocalChecked(),
        rotationRate)
      .Check();
  }

  // Create the arguments value for the DeviceMotionEvent.
  v8::Local<v8::Value> argv[] = {eventTypeArg, options};

  // Create the DeviceMotionEvent.
  v8::Local<v8::Object> deviceMotionEvent =
    eventConstructor->NewInstance(context, 2, argv).ToLocalChecked();

  return deviceMotionEvent;
}

}  // namespace c8
